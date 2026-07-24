import asyncio
from playwright.async_api import async_playwright

async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        # 1. Dark mode
        context_dark = await browser.new_context(
            viewport={'width': 1280, 'height': 800},
            color_scheme='dark'
        )
        page_dark = await context_dark.new_page()
        await page_dark.goto('https://sporty-desk.pages.dev/', wait_until='networkidle')
        await page_dark.wait_for_timeout(2000)
        await page_dark.screenshot(path='screenshots/sporty-desk-dark-mode.png')
        print('Captured sporty-desk dark mode screenshot')

        # 2. Light mode
        context_light = await browser.new_context(
            viewport={'width': 1280, 'height': 800},
            color_scheme='light'
        )
        page_light = await context_light.new_page()
        await page_light.goto('https://sporty-desk.pages.dev/', wait_until='networkidle')
        await page_light.wait_for_timeout(2000)
        await page_light.screenshot(path='screenshots/sporty-desk-light-mode.png')
        print('Captured sporty-desk light mode screenshot')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(capture())
