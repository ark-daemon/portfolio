import asyncio
from playwright.async_api import async_playwright
import os

async def make_esports():
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; background: #0c0c0f; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; display: flex; align-items: center; justify-content: center; height: 800px; }
        .card { width: 1200px; height: 720px; background: #16161a; border: 1px solid #27272a; border-radius: 16px; padding: 40px; box-sizing: border-box; color: #a1a1aa; font-size: 22px; line-height: 1.7; }
        .comment { color: #71717a; }
        .kw { color: #f43f5e; }
        .fn { color: #38bdf8; }
        .str { color: #34d399; }
        .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #27272a; padding-bottom: 24px; margin-bottom: 32px; font-size: 20px; color: #e4e4e7; }
        .badge { background: #27272a; padding: 6px 16px; border-radius: 9999px; font-size: 16px; color: #38bdf8; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <span>// esports_pipeline.py — Autonomous Scraper Pipeline</span>
          <span class="badge">5 Scrapers Active</span>
        </div>
        <div><span class="kw">import</span> requests, bs4, json, time</div>
        <div><span class="kw">from</span> googleapiclient.discovery <span class="kw">import</span> build</div>
        <br>
        <div><span class="kw">def</span> <span class="fn">fetch_match_standings</span>(tournament_url):</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;res = requests.get(tournament_url, headers={<span class="str">"User-Agent"</span>: <span class="str">"EsportsBot/2.0"</span>})</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;soup = bs4.BeautifulSoup(res.text, <span class="str">"html.parser"</span>)</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;matches = parse_live_match_rows(soup)</div>
        <div>&nbsp;&nbsp;&nbsp;&nbsp;<span class="kw">return</span> sync_to_google_sheets(matches)</div>
        <br>
        <div class="comment"># Pipelines: VLR.gg (Valorant) | HLTV (CS2) | LoL Esports | Dota2 | Rocket League</div>
      </div>
    </body>
    </html>
    """

    temp_path = os.path.abspath("scratch/esports_preview.html")
    with open(temp_path, "w", encoding="utf-8") as f:
        f.write(html_content)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1280, 'height': 800})
        url = "file:///" + temp_path.replace("\\", "/")
        await page.goto(url)

        dark_path = os.path.abspath("screenshots/esports-automation-dark-mode.png")
        await page.screenshot(path=dark_path)
        print(f"Saved: {dark_path}")

        # Light mode version
        html_light = html_content.replace("#0c0c0f", "#f8fafc").replace("#16161a", "#ffffff").replace("#27272a", "#e2e8f0").replace("#a1a1aa", "#475569").replace("#e4e4e7", "#0f172a").replace("#71717a", "#94a3b8")
        with open(temp_path, "w", encoding="utf-8") as f:
            f.write(html_light)

        await page.reload()
        light_path = os.path.abspath("screenshots/esports-automation-light-mode.png")
        await page.screenshot(path=light_path)
        print(f"Saved: {light_path}")

        await browser.close()

if __name__ == '__main__':
    asyncio.run(make_esports())
