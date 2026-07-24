import re
import os

headers = {
    "projects.html": ("projects", '02'),
    "stack.html": ("toolkit", '03'),
    "setup.html": ("setup", '04'),
    "certifications.html": ("certifications", '05')
}

header_template = """  <header class="site-header">
    <div class="header-container">
      <div class="header-top">
        <a href="index.html" class="header-identity" aria-label="Noah Carpiso, home">
          <img src="final-final.png" alt="Noah Carpiso" class="header-avatar" width="32" height="32">
          <span class="header-name">Noah Carpiso</span>
          <span class="header-role">· Metro Manila, PH</span>
        </a>
        <div class="header-actions">
          <div class="header-status">
            <span class="status-dot" aria-hidden="true"></span>
            <span>Available for work</span>
          </div>
          <div class="theme-switch" id="theme-switch-header" role="group" aria-label="Color theme">
            <button class="theme-btn" data-theme-val="system" aria-label="System theme" title="System">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            </button>
            <button class="theme-btn" data-theme-val="light" aria-label="Light theme" title="Light">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            </button>
            <button class="theme-btn" data-theme-val="dark" aria-label="Dark theme" title="Dark">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </button>
          </div>
        </div>
      </div>
      <nav class="header-nav" aria-label="Main Navigation">
        <a href="index.html" class="header-nav-item{active_home}" data-nav="home"><span class="nav-num">00</span> Overview</a>
        <a href="experience.html" class="header-nav-item{active_exp}" data-nav="experience"><span class="nav-num">01</span> Experience</a>
        <a href="projects.html" class="header-nav-item{active_proj}" data-nav="projects"><span class="nav-num">02</span> Projects</a>
        <a href="stack.html" class="header-nav-item{active_stack}" data-nav="toolkit"><span class="nav-num">03</span> Toolkit</a>
        <a href="setup.html" class="header-nav-item{active_setup}" data-nav="setup"><span class="nav-num">04</span> Setup</a>
        <a href="certifications.html" class="header-nav-item{active_cert}" data-nav="certifications"><span class="nav-num">05</span> Certifications</a>
      </nav>
    </div>
  </header>"""

for fname, (page_key, num) in headers.items():
    if not os.path.exists(fname): continue
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace sidebar block up to <main class="main">
    # Matches <aside class="sidebar" ... up to <main class="main">
    pattern = re.compile(r'<(aside|aside\s+class="sidebar")[\s\S]*?<main class="main">', re.IGNORECASE)
    
    active_flags = {
        'active_home': ' active" aria-current="page' if page_key == 'home' else '',
        'active_exp': ' active" aria-current="page' if page_key == 'experience' else '',
        'active_proj': ' active" aria-current="page' if page_key == 'projects' else '',
        'active_stack': ' active" aria-current="page' if page_key == 'toolkit' else '',
        'active_setup': ' active" aria-current="page' if page_key == 'setup' else '',
        'active_cert': ' active" aria-current="page' if page_key == 'certifications' else '',
    }
    
    header_html = header_template.format(**active_flags) + "\n\n  <main class=\"main\">"
    new_content, count = pattern.subn(header_html, content)
    if count > 0:
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {fname} with site-header")
    else:
        print(f"Pattern match failed for {fname}")
