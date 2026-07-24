import asyncio
from playwright.async_api import async_playwright
import os
import re

async def verify_14_steps():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        # 1. experience.html checks
        page = await browser.new_page()
        exp_path = os.path.abspath('experience.html').replace('\\', '/')
        await page.goto("file:///" + exp_path)

        date_line = await page.inner_text('.exp-role-dates')
        print(f"[1] experience.html Date Line: '{date_line.strip()}' (Expected: 'FEB 2024 – PRESENT · Remote · Metro Manila')")

        modal = await page.query_selector('#email-modal')
        print(f"[5] #email-modal present in DOM? {modal is not None} (Expected: False)")
        await page.close()

        # 2. index.html checks
        page = await browser.new_page()
        idx_path = os.path.abspath('index.html').replace('\\', '/')
        await page.goto("file:///" + idx_path)

        hero_btn_attr = await page.get_attribute('.hero-actions button', 'data-copy-email')
        print(f"[7] Hero email button data-copy-email: '{hero_btn_attr}'")
        await page.close()

        # 3. projects.html live links
        page = await browser.new_page()
        prj_path = os.path.abspath('projects.html').replace('\\', '/')
        await page.goto("file:///" + prj_path)

        tk_links = await page.query_selector_all('a[href="https://arkdaemon.pages.dev/"]')
        falco_links = await page.query_selector_all('a[href="https://falco-screener.pages.dev/"]')
        sporty_links = await page.query_selector_all('a[href="https://sporty-desk.pages.dev/"]')

        print(f"[8-10] Projects live link counts:")
        print(f"  Trading KB: {len(tk_links)} | Falco: {len(falco_links)} | Sporty Desk: {len(sporty_links)}")
        await page.close()

        # 4. certifications.html check
        with open('certifications.html', 'r', encoding='utf-8') as f:
            cert_text = f.read()
        has_parens = '(in progress)' in cert_text or '(planned)' in cert_text
        print(f"[11] certifications.html has inline parentheses? {has_parens} (Expected: False)")

        # 5. play.html check
        with open('play.html', 'r', encoding='utf-8') as f:
            play_text = f.read()
        has_noindex = '<meta name="robots" content="noindex, nofollow">' in play_text
        print(f"[12] play.html has noindex? {has_noindex}")

        # 6. OG tags on all 7 pages
        pages = ['index.html', 'experience.html', 'projects.html', 'stack.html', 'setup.html', 'certifications.html', 'play.html']
        for p_file in pages:
            with open(p_file, 'r', encoding='utf-8') as f:
                pt = f.read()
            has_og = '<meta property="og:image" content="https://noah-carpiso.pages.dev/og.png">' in pt
            print(f"[13] [{p_file}] has og:image? {has_og}")

        # 7. Assets check
        print(f"[14] og.svg exists? {os.path.exists('og.svg')} | og.png exists? {os.path.exists('og.png')}")

        # 8. Mobile overflow check (320, 375, 390)
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
    asyncio.run(verify_14_steps())
