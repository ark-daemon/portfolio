import asyncio
from playwright.async_api import async_playwright
import os

def get_html(theme='dark'):
    is_dark = theme == 'dark'
    bg = '#0c0d12' if is_dark else '#f8fafc'
    sidebar_bg = '#12141c' if is_dark else '#ffffff'
    card_bg = '#161824' if is_dark else '#ffffff'
    card_border = '#232738' if is_dark else '#e2e8f0'
    text = '#e2e8f0' if is_dark else '#0f172a'
    text_muted = '#8492a6' if is_dark else '#64748b'
    bar_bg = '#222638' if is_dark else '#f1f5f9'
    accent = '#d97706'
    green = '#10b981' if is_dark else '#059669'
    blue = '#3b82f6' if is_dark else '#2563eb'
    red = '#ef4444' if is_dark else '#dc2626'
    
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Codex Manager</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    
    body {{
      font-family: 'Inter', -apple-system, sans-serif;
      background: {bg};
      color: {text};
      display: flex;
      width: 1280px;
      height: 800px;
      overflow: hidden;
    }}

    /* Sidebar */
    .sidebar {{
      width: 240px;
      background: {sidebar_bg};
      border-right: 1px solid {card_border};
      padding: 24px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }}

    .brand {{
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      font-size: 15px;
      letter-spacing: 0.05em;
      margin-bottom: 32px;
      color: {text};
    }}

    .brand-icon {{
      width: 24px;
      height: 24px;
      background: {accent};
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 12px;
      font-weight: 800;
    }}

    .nav-list {{
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }}

    .nav-item {{
      padding: 10px 14px;
      border-radius: 8px;
      font-weight: 500;
      font-size: 13.5px;
      color: {text_muted};
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
    }}

    .nav-item.active {{
      background: rgba(217, 119, 6, {'0.15' if is_dark else '0.12'});
      color: {accent};
      font-weight: 600;
    }}

    .sidebar-widget {{
      background: {card_bg};
      border: 1px solid {card_border};
      border-radius: 12px;
      padding: 16px;
    }}

    .widget-status {{
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: {green};
      margin-bottom: 6px;
    }}

    .widget-active-acc {{
      font-size: 11.5px;
      color: {text_muted};
      margin-bottom: 12px;
    }}

    .widget-toggle-row {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 10px;
    }}

    .toggle-switch {{
      width: 34px;
      height: 18px;
      background: {green};
      border-radius: 10px;
      position: relative;
    }}

    .toggle-switch::after {{
      content: '';
      position: absolute;
      right: 2px;
      top: 2px;
      width: 14px;
      height: 14px;
      background: #fff;
      border-radius: 50%;
    }}

    .widget-bottom {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 11px;
      color: {text_muted};
    }}

    .btn-stop {{
      padding: 3px 8px;
      background: transparent;
      border: 1px solid {card_border};
      color: {text};
      border-radius: 4px;
      font-size: 10.5px;
      cursor: pointer;
    }}

    /* Main Area */
    .main {{
      flex: 1;
      padding: 28px 36px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      overflow-y: auto;
    }}

    /* Top Stats Bar */
    .header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}

    .title-area h1 {{
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.01em;
      margin-bottom: 4px;
    }}

    .title-area p {{
      font-size: 13px;
      color: {text_muted};
    }}

    .stats-panel {{
      display: flex;
      align-items: center;
      gap: 24px;
      background: {sidebar_bg};
      border: 1px solid {card_border};
      border-radius: 12px;
      padding: 12px 20px;
    }}

    .stat-item {{
      display: flex;
      flex-direction: column;
      gap: 2px;
    }}

    .stat-label {{
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: {text_muted};
    }}

    .stat-val {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 17px;
      font-weight: 700;
      color: {text};
    }}

    .global-bar-wrap {{
      width: 100px;
      height: 6px;
      background: {bar_bg};
      border-radius: 3px;
      overflow: hidden;
      margin-top: 4px;
    }}

    .global-bar-fill {{
      width: 48%;
      height: 100%;
      background: {accent};
    }}

    /* Actions Bar */
    .actions-bar {{
      display: flex;
      align-items: center;
      gap: 10px;
    }}

    .btn {{
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid {card_border};
      background: {card_bg};
      color: {text};
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }}

    .btn-primary {{
      background: {accent};
      color: #ffffff;
      border-color: {accent};
    }}

    /* Cards Grid */
    .grid {{
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 18px;
    }}

    .card {{
      background: {card_bg};
      border: 1px solid {card_border};
      border-radius: 14px;
      padding: 18px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      position: relative;
    }}

    .card.active-card {{
      border-color: {accent};
      box-shadow: 0 0 16px rgba(217, 119, 6, {'0.15' if is_dark else '0.12'});
    }}

    .card-head {{
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }}

    .acc-name {{
      font-size: 15px;
      font-weight: 700;
      color: {text};
      margin-bottom: 3px;
    }}

    .acc-email {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      color: {text_muted};
    }}

    .status-badge {{
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 9px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 5px;
    }}

    .badge-green {{ background: rgba(16, 185, 129, {'0.15' if is_dark else '0.12'}); color: {green}; }}
    .badge-blue {{ background: rgba(59, 130, 246, {'0.15' if is_dark else '0.12'}); color: {blue}; }}
    .badge-yellow {{ background: rgba(245, 158, 11, {'0.15' if is_dark else '0.12'}); color: {accent}; }}
    .badge-red {{ background: rgba(239, 68, 68, {'0.15' if is_dark else '0.12'}); color: {red}; }}

    .quota-info {{
      display: flex;
      flex-direction: column;
      gap: 6px;
    }}

    .quota-meta {{
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: {text_muted};
    }}

    .quota-val {{
      font-family: 'JetBrains Mono', monospace;
      color: {text};
    }}

    .bar-bg {{
      width: 100%;
      height: 7px;
      background: {bar_bg};
      border-radius: 4px;
      overflow: hidden;
    }}

    .bar-fill {{
      height: 100%;
      border-radius: 4px;
    }}

    .fill-green {{ background: {green}; }}
    .fill-yellow {{ background: {accent}; }}
    .fill-red {{ background: {red}; }}

    .reset-timer {{
      font-size: 11px;
      color: {text_muted};
    }}

    .card-foot {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 4px;
    }}

    .btn-use {{
      width: 100%;
      padding: 8px 0;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.03em;
      border: 1px solid {card_border};
      background: {bar_bg};
      color: {text};
      cursor: pointer;
      text-align: center;
    }}

    .btn-use.active-btn {{
      background: {accent};
      color: #ffffff;
      border-color: {accent};
    }}
  </style>
</head>
<body>

  <!-- Sidebar -->
  <aside class="sidebar">
    <div>
      <div class="brand">
        <div class="brand-icon">C</div>
        <span>CODEX MANAGER</span>
      </div>
      <ul class="nav-list">
        <li class="nav-item active">Accounts</li>
        <li class="nav-item">Settings</li>
      </ul>
    </div>

    <div class="sidebar-widget">
      <div class="widget-status">
        <span style="display:inline-block; width:7px; height:7px; background:{green}; border-radius:50%"></span>
        <span>CODEX IS ACTIVE</span>
      </div>
      <div class="widget-active-acc">ACTIVE: Main-Dev-01</div>
      <div class="widget-toggle-row">
        <span>AUTO SWITCH</span>
        <div class="toggle-switch"></div>
      </div>
      <div class="widget-bottom">
        <span>20 min interval</span>
        <button class="btn-stop">Stop</button>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="main">
    <div class="header">
      <div class="title-area">
        <h1>ACCOUNTS</h1>
        <p>Manage Codex sessions, quotas, and switching.</p>
      </div>

      <div class="stats-panel">
        <div class="stat-item">
          <span class="stat-label">ACTIVE</span>
          <span class="stat-val" style="color:{green}">1</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">TOTAL ACCOUNTS</span>
          <span class="stat-val">6</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">RATE LIMITED</span>
          <span class="stat-val" style="color:{red}">1</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">GLOBAL QUOTA</span>
          <span class="stat-val">48%</span>
          <div class="global-bar-wrap"><div class="global-bar-fill"></div></div>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div class="actions-bar">
      <button class="btn btn-primary">+ Add</button>
      <button class="btn">↻ Sync</button>
      <button class="btn">↑ Export</button>
      <button class="btn">↓ Import</button>
      <button class="btn">Select All</button>
    </div>

    <!-- Cards Grid -->
    <div class="grid">
      <!-- Card 1 -->
      <div class="card active-card">
        <div class="card-head">
          <div>
            <div class="acc-name">Main-Dev-01</div>
            <div class="acc-email">noah.carpiso@gmail.com</div>
          </div>
          <span class="status-badge badge-green">● ACTIVE</span>
        </div>
        <div class="quota-info">
          <div class="quota-meta">
            <span>MONTHLY QUOTA</span>
            <span class="quota-val">34%</span>
          </div>
          <div class="bar-bg"><div class="bar-fill fill-green" style="width:34%"></div></div>
          <div class="reset-timer">Resets in 14d 08h</div>
        </div>
        <div class="card-foot">
          <button class="btn-use active-btn">ACTIVE SESSION</button>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="acc-name">Client-Alpha-Key</div>
            <div class="acc-email">alpha.ops@client-work.io</div>
          </div>
          <span class="status-badge badge-blue">● READY</span>
        </div>
        <div class="quota-info">
          <div class="quota-meta">
            <span>MONTHLY QUOTA</span>
            <span class="quota-val">72%</span>
          </div>
          <div class="bar-bg"><div class="bar-fill fill-yellow" style="width:72%"></div></div>
          <div class="reset-timer">Resets in 04d 19h</div>
        </div>
        <div class="card-foot">
          <button class="btn-use">USE SESSION</button>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="acc-name">Scraper-Bot-PROD</div>
            <div class="acc-email">bot.esports@vlr-data.net</div>
          </div>
          <span class="status-badge badge-red">● RATE LIMITED</span>
        </div>
        <div class="quota-info">
          <div class="quota-meta">
            <span>MONTHLY QUOTA</span>
            <span class="quota-val">99%</span>
          </div>
          <div class="bar-bg"><div class="bar-fill fill-red" style="width:99%"></div></div>
          <div class="reset-timer">Resets in 01d 04h</div>
        </div>
        <div class="card-foot">
          <button class="btn-use" style="opacity:0.6; cursor:not-allowed">RATE LIMITED</button>
        </div>
      </div>

      <!-- Card 4 -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="acc-name">n8n-Automation-Host</div>
            <div class="acc-email">n8n.runner@internal-ops.org</div>
          </div>
          <span class="status-badge badge-blue">● READY</span>
        </div>
        <div class="quota-info">
          <div class="quota-meta">
            <span>MONTHLY QUOTA</span>
            <span class="quota-val">48%</span>
          </div>
          <div class="bar-bg"><div class="bar-fill fill-yellow" style="width:48%"></div></div>
          <div class="reset-timer">Resets in 18d 12h</div>
        </div>
        <div class="card-foot">
          <button class="btn-use">USE SESSION</button>
        </div>
      </div>

      <!-- Card 5 -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="acc-name">Trading-KB-Indexer</div>
            <div class="acc-email">indexer@trading-kb.com</div>
          </div>
          <span class="status-badge badge-blue">● READY</span>
        </div>
        <div class="quota-info">
          <div class="quota-meta">
            <span>MONTHLY QUOTA</span>
            <span class="quota-val">18%</span>
          </div>
          <div class="bar-bg"><div class="bar-fill fill-green" style="width:18%"></div></div>
          <div class="reset-timer">Resets in 21d 06h</div>
        </div>
        <div class="card-foot">
          <button class="btn-use">USE SESSION</button>
        </div>
      </div>

      <!-- Card 6 -->
      <div class="card">
        <div class="card-head">
          <div>
            <div class="acc-name">Backup-Dev-Secondary</div>
            <div class="acc-email">dev.backup@gmail.com</div>
          </div>
          <span class="status-badge badge-blue">● READY</span>
        </div>
        <div class="quota-info">
          <div class="quota-meta">
            <span>MONTHLY QUOTA</span>
            <span class="quota-val">06%</span>
          </div>
          <div class="bar-bg"><div class="bar-fill fill-green" style="width:6%"></div></div>
          <div class="reset-timer">Resets in 27d 15h</div>
        </div>
        <div class="card-foot">
          <button class="btn-use">USE SESSION</button>
        </div>
      </div>
    </div>
  </main>

</body>
</html>"""

async def generate():
    os.makedirs('scratch', exist_ok=True)
    os.makedirs('screenshots', exist_ok=True)
    
    dark_html_path = os.path.abspath('scratch/codex_dark.html')
    light_html_path = os.path.abspath('scratch/codex_light.html')
    
    with open(dark_html_path, 'w', encoding='utf-8') as f:
        f.write(get_html('dark'))

    with open(light_html_path, 'w', encoding='utf-8') as f:
        f.write(get_html('light'))

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        
        page_dark = await browser.new_page(viewport={'width': 1280, 'height': 800}, device_scale_factor=2)
        await page_dark.goto(f'file:///{dark_html_path}')
        await page_dark.wait_for_timeout(1000)
        await page_dark.screenshot(path='screenshots/codex-manager-dark-mode.png')
        print('Generated codex-manager-dark-mode.png')

        page_light = await browser.new_page(viewport={'width': 1280, 'height': 800}, device_scale_factor=2)
        await page_light.goto(f'file:///{light_html_path}')
        await page_light.wait_for_timeout(1000)
        await page_light.screenshot(path='screenshots/codex-manager-light-mode.png')
        print('Generated codex-manager-light-mode.png')

        await browser.close()

if __name__ == '__main__':
    asyncio.run(generate())
