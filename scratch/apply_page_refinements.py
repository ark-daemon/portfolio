import os
import re

cta_and_footer = '''    <section class="section cta-block cta-block--compact" id="contact" aria-label="Contact">
      <div class="cta-inner">
        <p class="cta-headline">Available for remote operations, partnership coordination, support, and automation roles.</p>
        <p class="cta-subhead" style="margin-top: 0.5rem; font-size: 0.875rem; color: var(--text-2); line-height: 1.5;">If you need someone who runs day-to-day operations and builds tools to cut repetitive work, let's talk.</p>
        <div class="cta-actions">
          <button type="button" class="btn btn-cta-primary" data-copy-email="carpisonoah@gmail.com">Copy email 📋</button>
          <a href="https://www.linkedin.com/in/noah-carpiso" target="_blank" rel="noopener noreferrer" class="btn btn-cta-outline">LinkedIn ↗</a>
          <a href="Noah-David-Carpiso-Resume.pdf" download="Noah-David-Carpiso-Resume.pdf" class="btn btn-cta-outline">Resume ↓</a>
        </div>
      </div>
    </section>

    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-row">
          <div class="footer-col">
            <span class="footer-name">Noah Carpiso</span>
            <span class="footer-meta">Remote Operations &amp; Community Specialist · Metro Manila, PH</span>
          </div>
          <div class="footer-links">
            <a href="mailto:carpisonoah@gmail.com" class="footer-link">carpisonoah@gmail.com</a>
            <a href="https://www.linkedin.com/in/noah-carpiso" target="_blank" rel="noopener noreferrer" class="footer-link">LinkedIn ↗</a>
            <a href="https://github.com/ark-daemon" target="_blank" rel="noopener noreferrer" class="footer-link">GitHub ↗</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; 2026 Noah Carpiso. All rights reserved.</span>
          <span>Last updated July 2026 · Available for remote roles</span>
        </div>
      </div>
    </footer>'''

# 1. Update index.html Hero
with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

idx_content = re.sub(
    r'<p class="hero-eyebrow"[^>]*>.*?</p>',
    '<p class="hero-eyebrow" data-reveal="2">Based in Metro Manila · available worldwide · <span style="opacity:0.85;">GMT+8 · usually replies within 24h</span></p>',
    idx_content
)

hero_actions_old = r'<div class="hero-actions" data-reveal="4">[\s\S]*?</div>'
hero_actions_new = '''<div class="hero-actions" data-reveal="4">
            <button type="button" class="btn btn-primary" data-copy-email="carpisonoah@gmail.com">
              <span>Email me ↗</span>
            </button>
            <a href="#projects-teaser" class="btn btn-secondary">
              <span>View selected work</span>
            </a>
          </div>'''
idx_content = re.sub(hero_actions_old, hero_actions_new, idx_content)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx_content)

# 2. Update experience.html
with open('experience.html', 'r', encoding='utf-8') as f:
    exp_content = f.read()

exp_content = exp_content.replace(
    'plus self-directed systems I assembled with AI-assisted',
    'plus self-directed systems I build with AI-assisted'
)

if 'Organized by company' not in exp_content:
    exp_content = exp_content.replace(
        '</header>\n\n      <section id="experience"',
        '</header>\n      <p class="trust-statement-light" style="margin-top: -1rem; margin-bottom: 2.5rem; text-align: left;">Organized by company — each role shown with the problem, the work, and the outcome.</p>\n\n      <section id="experience"'
    )

with open('experience.html', 'w', encoding='utf-8') as f:
    f.write(exp_content)

# 3. Update projects.html
with open('projects.html', 'r', encoding='utf-8') as f:
    prj_content = f.read()

disclaimer = '<p class="disclaimer-note" style="margin-top:1rem; font-family:var(--font-mono); font-size:11px; color:var(--text-3);">Note: Research prototype for probability modeling and data organization — not betting or financial advice.</p>'
if 'Research prototype for probability modeling' not in prj_content:
    prj_content = prj_content.replace(
        'The data pipeline works but the odds modeling still needs validation against more matches.</p>\n              </div>',
        'The data pipeline works but the odds modeling still needs validation against more matches.</p>\n              </div>\n            ' + disclaimer
    )

with open('projects.html', 'w', encoding='utf-8') as f:
    f.write(prj_content)

# 4. Update stack.html
with open('stack.html', 'r', encoding='utf-8') as f:
    stk_content = f.read()

approach_note = '<p class="trust-statement-light" style="margin-top: -0.5rem; margin-bottom: 2rem; text-align: left;">Approach: turn manual bottlenecks into working utilities without waiting on a developer.</p>'
if 'Approach: turn manual bottlenecks' not in stk_content:
    stk_content = stk_content.replace(
        '</header>\n\n    <section id="stack"',
        '</header>\n    ' + approach_note + '\n\n    <section id="stack"'
    )

# Remove Rapid Prototyping tile if present
rapid_tile = r'<article class="stack-tile">\s*<h3 class="stack-tile-title">Rapid Prototyping</h3>[\s\S]*?</article>'
stk_content = re.sub(rapid_tile, '', stk_content)

with open('stack.html', 'w', encoding='utf-8') as f:
    f.write(stk_content)

# 5. Apply CTA and Footer to all 6 HTML files
html_files = [
    'index.html',
    'experience.html',
    'projects.html',
    'stack.html',
    'setup.html',
    'certifications.html'
]

for f_path in html_files:
    if not os.path.exists(f_path):
        continue
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove any existing footer or cta block at bottom
    content = re.sub(r'<footer[\s\S]*?</footer>', '', content)
    content = re.sub(r'<(?:div|section)[^>]*class="[^"]*cta-block[^"]*"[\s\S]*?</(?:div|section)>', '', content)

    # Insert CTA & footer right before </main> or </body>
    if '</main>' in content:
        content = content.replace('</main>', cta_and_footer + '\n  </main>')
    elif '</body>' in content:
        content = content.replace('</body>', cta_and_footer + '\n</body>')

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Applied all page-specific refinements & injected standardized CTA & Footer across all 6 pages!")
