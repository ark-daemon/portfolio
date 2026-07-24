import asyncio
from playwright.async_api import async_playwright
import os

async def verify_mobile():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        viewports = [
            {'width': 320, 'height': 568},
            {'width': 375, 'height': 667},
            {'width': 390, 'height': 844}
        ]

        pages = ['index.html', 'projects.html']

        for vp in viewports:
            context = await browser.new_context(viewport=vp)
            page = await context.new_page()

            for p_file in pages:
                abs_path = os.path.abspath(p_file).replace('\\', '/')
                url = f"file:///{abs_path}"
                await page.goto(url, wait_until='load')

                overflow = await page.evaluate("""() => {
                    return document.documentElement.scrollWidth > window.innerWidth;
                }""")

                print(f"Viewport {vp['width']}x{vp['height']} - {p_file}: Horizontal Overflow? {overflow}")

            await context.close()

        await browser.close()

if __name__ == '__main__':
    asyncio.run(verify_mobile())
