import asyncio
from playwright.async_api import async_playwright
import os

async def inspect():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        
        print("Navigating to https://adrianabelarde.com/...")
        try:
            await page.goto('https://adrianabelarde.com/', wait_until='networkidle', timeout=30000)
        except Exception as e:
            print("Networkidle timeout or error, proceeding:", e)

        os.makedirs('scratch/abelarde', exist_ok=True)
        await page.screenshot(path='scratch/abelarde/homepage.png', full_page=True)
        
        # Extract title, meta, headings, text content
        title = await page.title()
        meta_desc = await page.evaluate("() => document.querySelector('meta[name=\"description\"]')?.content || ''")
        
        headings = await page.evaluate("""() => {
            const h = [];
            document.querySelectorAll('h1, h2, h3, h4, header, nav, section').forEach(el => {
                const txt = el.innerText ? el.innerText.trim() : '';
                if (txt) h.push({ tag: el.tagName, class: el.className, id: el.id, text: txt.substring(0, 200) });
            });
            return h;
        }""")
        
        nav_links = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('a')).map(a => ({ text: a.innerText.trim(), href: a.href }));
        }""")

        body_text = await page.evaluate("() => document.body.innerText")

        print(f"Title: {title}")
        print(f"Meta Description: {meta_desc}")
        print(f"\nExtracted Body Snippet (first 1500 chars):\n{body_text[:1500]}")
        print(f"\nNav Links ({len(nav_links)} links):")
        for link in nav_links[:15]:
            print(" -", link['text'], "->", link['href'])

        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect())
