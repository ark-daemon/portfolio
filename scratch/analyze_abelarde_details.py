import asyncio
from playwright.async_api import async_playwright

async def inspect_details():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1440, 'height': 900})
        await page.goto('https://adrianabelarde.com/', wait_until='networkidle')
        
        details = await page.evaluate("""() => {
            const bodyStyle = window.getComputedStyle(document.body);
            const h1Style = document.querySelector('h1') ? window.getComputedStyle(document.querySelector('h1')) : null;
            
            // Extract colors and fonts used
            const styles = {
                bodyBg: bodyStyle.backgroundColor,
                bodyFont: bodyStyle.fontFamily,
                bodyColor: bodyStyle.color,
                bgImage: bodyStyle.backgroundImage,
                h1Font: h1Style ? h1Style.fontFamily : null,
                h1Size: h1Style ? h1Style.fontSize : null,
            };

            // Find all section cards / blocks
            const sections = Array.from(document.querySelectorAll('section, main > div, article')).map(el => ({
                id: el.id,
                class: el.className,
                textSnippet: el.innerText ? el.innerText.substring(0, 150).replace(/\\n/g, ' ') : ''
            }));

            // Find interactive components
            const interactive = Array.from(document.querySelectorAll('button, a[href^="http"], input, canvas')).map(el => ({
                tag: el.tagName,
                text: el.innerText ? el.innerText.trim() : el.getAttribute('aria-label') || '',
                class: el.className
            }));

            return { styles, sections, interactiveCount: interactive.length, sampleInteractive: interactive.slice(0, 10) };
        }""")

        print("=== STYLES & TYPOGRAPHY ===")
        print("Body Font:", details['styles']['bodyFont'])
        print("Body Background:", details['styles']['bodyBg'])
        print("Body Color:", details['styles']['bodyColor'])
        print("Background Image/Pattern:", details['styles']['bgImage'])
        print("H1 Font:", details['styles']['h1Font'])
        print("H1 Size:", details['styles']['h1Size'])
        
        print("\n=== SECTIONS & STRUCTURE ===")
        for s in details['sections']:
            print(f"[{s['class'] or s['id'] or 'block'}] -> {s['textSnippet']}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(inspect_details())
