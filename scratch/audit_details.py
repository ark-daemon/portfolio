import asyncio
from playwright.async_api import async_playwright
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

async def deep_audit():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        pages = {
            "Home": "index.html",
            "Experience": "experience.html",
            "Projects": "projects.html",
            "Toolkit": "stack.html",
            "Setup": "setup.html",
            "Certifications": "certifications.html"
        }

        audit_data = {}

        for name, p_file in pages.items():
            abs_path = os.path.abspath(p_file).replace('\\', '/')
            url = f"file:///{abs_path}"
            await page.goto(url, wait_until='load')

            small_targets = await page.evaluate("""() => {
                const clickable = Array.from(document.querySelectorAll('a, button, input, [role="button"]'));
                const small = [];
                clickable.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
                        small.push({
                            text: (el.innerText || el.getAttribute('aria-label') || el.id || 'unnamed').substring(0, 30),
                            tag: el.tagName,
                            width: Math.round(rect.width),
                            height: Math.round(rect.height)
                        });
                    }
                });
                return small;
            }""")

            headings = await page.evaluate("""() => {
                return Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
                    level: parseInt(h.tagName.substring(1)),
                    text: h.innerText.trim()
                }));
            }""")

            issues = await page.evaluate("""() => {
                const list = [];
                document.querySelectorAll('button').forEach(b => {
                    if (!b.getAttribute('type')) list.push(`Button missing type attribute: ${b.innerText || b.id}`);
                });
                document.querySelectorAll('a').forEach(a => {
                    const href = a.getAttribute('href');
                    if (!href || href === '#' || href === 'javascript:void(0)') {
                        list.push(`Link with empty/dead href: ${a.innerText || a.className}`);
                    }
                });
                return list;
            }""")

            audit_data[name] = {
                "small_targets": small_targets,
                "headings": headings,
                "issues": issues
            }

        for name, d in audit_data.items():
            print(f"=== {name} ===")
            print(f"Heading count: {len(d['headings'])}")
            print(f"Small tap targets (<44px): {len(d['small_targets'])}")
            if d['small_targets']:
                for st in d['small_targets'][:5]:
                    print(f"  - [{st['tag']}] '{st['text']}' ({st['width']}x{st['height']}px)")
            if d['issues']:
                print(f"Issues ({len(d['issues'])}):")
                for iss in d['issues']:
                    print("  *", iss)
            print()

        await browser.close()

if __name__ == '__main__':
    asyncio.run(deep_audit())
