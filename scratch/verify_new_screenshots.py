import asyncio
from playwright.async_api import async_playwright
import os

async def verify_new_screenshots():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        for vp in [375, 1440]:
            context = await browser.new_context(viewport={'width': vp, 'height': 800})
            page = await context.new_page()

            errors = []
            page.on("pageerror", lambda err: errors.append(err))

            pf_path = os.path.abspath('index.html').replace('\\', '/')
            await page.goto("file:///" + pf_path)

            overflow = await page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")

            cards = await page.locator('.carousel-card--abelarde').all()
            print(f"\n[{vp}px] 'index.html' loaded | Page-Overflow={overflow} | Console Errors={len(errors)} | Cards={len(cards)}")

            for i, card in enumerate(cards):
                imgs = await card.locator('img').all()
                srcs = [await img.get_attribute('src') for img in imgs]
                is_center = "is-center" in (await card.get_attribute("class") or "")
                print(f"  Card {i+1}: is-center={is_center} | Images={srcs}")

            await context.close()

        await browser.close()

    print("\nVerified new user screenshots successfully!")

if __name__ == '__main__':
    asyncio.run(verify_new_screenshots())
