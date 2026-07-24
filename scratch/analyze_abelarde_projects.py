import asyncio
from playwright.async_api import async_playwright
import os

async def inspect_project_page():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        
        url = 'https://adrianabelarde.com/work/mizan'
        print(f"Navigating to {url}...")
        await page.goto(url, wait_until='networkidle')
        
        await page.screenshot(path='scratch/abelarde/project_mizan.png', full_page=True)
        
        text = await page.evaluate("() => document.body.innerText")
        print("\n=== MIZAN CASE STUDY TEXT SNIPPET ===")
        print(text[:1200])

        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_project_page())
