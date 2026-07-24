import asyncio
from playwright.async_api import async_playwright
import os
import re

async def full_audit():
    async with async_playwright() as p:
        browser = await p.chromium.launch()

        pages = [
            'index.html',
            'experience.html',
            'projects.html',
            'stack.html',
            'setup.html',
            'certifications.html'
        ]

        print("=== 1. SEO & META AUDIT ===")
        for p_file in pages:
            abs_path = os.path.abspath(p_file).replace('\\', '/')
            url = "file:///" + abs_path
            page = await browser.new_page()
            await page.goto(url, wait_until='load')

            title = await page.title()
            desc = await page.get_attribute('meta[name="description"]', 'content')
            canonical = await page.get_attribute('link[rel="canonical"]', 'href')

            # Heading count
            h1s = await page.query_selector_all('h1')
            h2s = await page.query_selector_all('h2')

            print(f"[{p_file}]")
            print(f"  Title ({len(title)} chars): {title}")
            print(f"  Desc ({len(desc) if desc else 0} chars): {desc}")
            print(f"  Canonical: {canonical}")
            print(f"  h1 count: {len(h1s)} | h2 count: {len(h2s)}")
            await page.close()

        print("\n=== 2. FORBIDDEN WORDS CHECK ('junior', '~80%') ===")
        for p_file in pages:
            with open(p_file, 'r', encoding='utf-8') as f:
                content = f.read().lower()

            junior_matches = re.findall(r'\bjunior\b', content)
            wip_matches = re.findall(r'~80%', content)
            print(f"[{p_file}] 'junior' count: {len(junior_matches)} | '~80%' count: {len(wip_matches)}")

        print("\n=== 3. MOBILE VIEWPORT OVERFLOW CHECK (320, 375, 390, 768, 1024, 1440) ===")
        viewports = [320, 375, 390, 768, 1024, 1440]
        for vp_w in viewports:
            context = await browser.new_context(viewport={'width': vp_w, 'height': 800})
            page = await context.new_page()
            for p_file in pages:
                abs_path = os.path.abspath(p_file).replace('\\', '/')
                await page.goto("file:///" + abs_path, wait_until='load')
                overflow = await page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
                if overflow:
                    print(f"❌ Overflow detected on {p_file} at {vp_w}px!")
            await context.close()
        print("✅ Mobile Viewport Overflow Check Completed!")

        print("\n=== 4. ACCESSIBILITY & ARIA CHECKS ===")
        page = await browser.new_page()
        idx_path = os.path.abspath('index.html').replace('\\', '/')
        await page.goto("file:///" + idx_path)

        skip_link = await page.query_selector('.skip-link')
        print(f"Skip link present? {skip_link is not None}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(full_audit())
