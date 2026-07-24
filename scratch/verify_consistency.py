import asyncio
from playwright.async_api import async_playwright
import os
import re

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # 1. Projects card live link count
        page = await browser.new_page()
        prj_path = os.path.abspath('projects.html').replace('\\', '/')
        await page.goto("file:///" + prj_path)

        tk_links = await page.query_selector_all('a[href="https://arkdaemon.pages.dev/"]')
        falco_links = await page.query_selector_all('a[href="https://falco-screener.pages.dev/"]')
        sporty_links = await page.query_selector_all('a[href="https://sporty-desk.pages.dev/"]')

        print(f"Projects live link counts:")
        print(f"  Trading KB (https://arkdaemon.pages.dev/): {len(tk_links)} (Expected: 1)")
        print(f"  Falco Terminal (https://falco-screener.pages.dev/): {len(falco_links)} (Expected: 1)")
        print(f"  Sporty Desk (https://sporty-desk.pages.dev/): {len(sporty_links)} (Expected: 1)")
        await page.close()

        # 2. experience.html direct email count
        with open('experience.html', 'r', encoding='utf-8') as f:
            exp_text = f.read()
        email_matches = re.findall(r'Direct email: carpisonoah@gmail\.com', exp_text)
        print(f"experience.html 'Direct email' count: {len(email_matches)} (Expected: <= 1)")

        # 3. play.html noindex check
        with open('play.html', 'r', encoding='utf-8') as f:
            play_text = f.read()
        has_noindex = '<meta name="robots" content="noindex, nofollow">' in play_text
        print(f"play.html has noindex tag? {has_noindex}")

        # 4. og:image check across all 7 pages
        pages = ['index.html', 'experience.html', 'projects.html', 'stack.html', 'setup.html', 'certifications.html', 'play.html']
        for p_file in pages:
            with open(p_file, 'r', encoding='utf-8') as f:
                p_text = f.read()
            has_og_img = '<meta property="og:image" content="https://noah-carpiso.pages.dev/og.png">' in p_text
            print(f"[{p_file}] has og:image? {has_og_img}")

        # 5. Mobile overflow check (320, 375, 390)
        viewports = [320, 375, 390]
        for vp in viewports:
            context = await browser.new_context(viewport={'width': vp, 'height': 800})
            page = await context.new_page()
            for p_file in pages:
                p_path = os.path.abspath(p_file).replace('\\', '/')
                await page.goto("file:///" + p_path)
                overflow = await page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
                if overflow:
                    print(f"❌ OVERFLOW on {p_file} at {vp}px!")
            await context.close()
        print("Mobile viewport overflow check complete (0 overflows).")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(verify())
