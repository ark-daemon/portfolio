import asyncio
from playwright.async_api import async_playwright
import os

async def audit():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context(viewport={'width': 1440, 'height': 900})
        page = await context.new_page()

        console_logs = []
        page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
        page.on("pageerror", lambda err: console_logs.append(f"[EXCEPTION] {err}"))

        pages_to_test = [
            'index.html',
            'experience.html',
            'projects.html',
            'stack.html',
            'setup.html',
            'certifications.html'
        ]

        results = {}

        for p_file in pages_to_test:
            abs_path = os.path.abspath(p_file).replace('\\', '/')
            url = f"file:///{abs_path}"
            console_logs.clear()
            
            response = await page.goto(url, wait_until='load')
            await page.wait_for_timeout(500)

            # Check links & buttons
            elements_info = await page.evaluate("""() => {
                const links = Array.from(document.querySelectorAll('a')).map(a => ({
                    text: a.innerText.trim() || a.getAttribute('aria-label') || '',
                    href: a.getAttribute('href'),
                    target: a.getAttribute('target'),
                    visible: !!(a.offsetWidth || a.offsetHeight || a.getClientRects().length)
                }));
                const buttons = Array.from(document.querySelectorAll('button')).map(b => ({
                    text: b.innerText.trim() || b.getAttribute('aria-label') || '',
                    id: b.id,
                    class: b.className,
                    visible: !!(b.offsetWidth || b.offsetHeight || b.getClientRects().length)
                }));
                const images = Array.from(document.querySelectorAll('img')).map(img => ({
                    src: img.getAttribute('src'),
                    alt: img.getAttribute('alt'),
                    hasAlt: img.hasAttribute('alt') && img.getAttribute('alt').trim() !== ''
                }));
                const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4')).map(h => ({
                    tag: h.tagName,
                    text: h.innerText.trim()
                }));
                return { links, buttons, images, headings };
            }""")

            results[p_file] = {
                "elements": elements_info,
                "logs": list(console_logs)
            }

        print("=== AUDIT SUMMARY ===")
        for p_file, res in results.items():
            print(f"\n--- {p_file} ---")
            print(f"Headings: {len(res['elements']['headings'])}")
            print(f"Links: {len(res['elements']['links'])}")
            print(f"Buttons: {len(res['elements']['buttons'])}")
            print(f"Images: {len(res['elements']['images'])} (Missing alt: {sum(1 for i in res['elements']['images'] if not i['hasAlt'])})")
            if res['logs']:
                print(f"Console errors/logs: {res['logs']}")
            else:
                print("Console: Clean (0 errors)")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(audit())
