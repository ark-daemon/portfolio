import asyncio
from playwright.async_api import async_playwright
import os

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        os.makedirs('scratch/screenshots_verify', exist_ok=True)
        
        viewports = [
            ('desktop_1440', 1440, 900),
            ('mobile_375', 375, 812)
        ]
        
        pages = ['index.html', 'projects.html', 'experience.html']
        
        for p_name in pages:
            abs_p = os.path.abspath(p_name).replace('\\', '/')
            url = f"file:///{abs_p}"
            page = await browser.new_page()
            for vp_name, w, h in viewports:
                await page.set_viewport_size({'width': w, 'height': h})
                await page.goto(url, wait_until='load')
                save_path = f"scratch/screenshots_verify/{p_name.replace('.html','')}_{vp_name}.png"
                await page.screenshot(path=save_path, full_page=False)
                print(f"Captured {save_path}")
            await page.close()
            
        await browser.close()

if __name__ == '__main__':
    asyncio.run(verify())
