import os
import re
from PIL import Image, ImageDraw, ImageFont

# ================= 14. Create /og.svg AND /og.png =================
svg_content = '''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#09090b"/>
  <!-- 1px Inset Border -->
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="#27272a" stroke-width="1" rx="8"/>
  
  <!-- Top-left small mono label -->
  <text x="80" y="140" fill="#a1a1aa" font-family="monospace, system-ui, sans-serif" font-size="20" font-weight="600" letter-spacing="0.1em">NOAH CARPISO</text>
  
  <!-- Large display text -->
  <text x="80" y="240" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="700" letter-spacing="-0.02em">Remote Operations &amp; Automation</text>
  
  <!-- Muted subline -->
  <text x="80" y="320" fill="#a1a1aa" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="400">I run community workflows and build the tools that make them repeatable.</text>
  
  <!-- Footer line -->
  <text x="80" y="520" fill="#71717a" font-family="monospace, system-ui, sans-serif" font-size="20">noah-carpiso.pages.dev · Metro Manila, PH · GMT+8</text>
</svg>'''

with open('og.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

# Emit og.png via PIL
img = Image.new('RGB', (1200, 630), color='#09090b')
draw = ImageDraw.Draw(img)
draw.rectangle([24, 24, 1176, 606], outline='#27272a', width=1)
draw.text((80, 120), "NOAH CARPISO", fill='#a1a1aa', font_size=20)
draw.text((80, 200), "Remote Operations & Automation", fill='#ffffff', font_size=52)
draw.text((80, 290), "I run community workflows and build the tools that make them repeatable.", fill='#a1a1aa', font_size=28)
draw.text((80, 500), "noah-carpiso.pages.dev · Metro Manila, PH · GMT+8", fill='#71717a', font_size=20)
img.save('og.png')
print("Step 14: Created og.svg and og.png successfully!")


# ================= 1. experience.html edits (1, 2, 3, 4, 5) =================
with open('experience.html', 'r', encoding='utf-8') as f:
    exp = f.read()

# 1) ANCHOR: "part-time alongside coursework"
exp = re.sub(
    r'<p class="exp-role-dates">\s*FEB 2024[^\n<]*</p>',
    '<p class="exp-role-dates">FEB 2024 – PRESENT · Remote · Metro Manila</p>',
    exp
)

# 2) ANCHOR: "In Progress complete"
exp = re.sub(
    r'<li>\s*Building the <strong[^>]*>Trading Knowledge Base</strong>[^\n<]*</li>',
    '<li>Building the <strong>Trading Knowledge Base</strong> (In Progress) — organizing my own trading notes into a searchable library and curriculum, with a live glossary preview on the Projects page.</li>',
    exp
)

# 3) ANCHOR: "I don't claim to be a software engineer"
exp = re.sub(
    r'<p class="contribution-note"[^>]*>[\s\S]*?My role:[\s\S]*?</p>',
    '<p class="contribution-note" style="margin-top: 1rem; font-size: 0.8125rem; color: var(--text-2); line-height: 1.55;">My role: I define the operational problem, design the workflow, and ship the tool using AI-assisted development — then test the output myself. I optimize for usefulness and shipped results.</p>',
    exp
)

# 4) Remove duplicate email line on experience.html
exp = re.sub(r'(?:<p style="margin-top:0\.75rem; font-family:var\(--font-mono\); font-size:12px; color:var\(--text-3\);">Direct email: carpisonoah@gmail\.com</p>\s*)+', '', exp)

# 5) Remove dead email modal from experience.html
exp = re.sub(r'<!-- Email Modal -->\s*<dialog id="email-modal"[\s\S]*?</dialog>', '', exp)

with open('experience.html', 'w', encoding='utf-8') as f:
    f.write(exp)
print("Steps 1-5: experience.html updated cleanly!")


# ================= 6 & 7. index.html edits =================
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

# 6) ANCHOR: "Process with receipts"
idx = re.sub(
    r'<p class="section-thesis">[\s\S]*?</p>',
    '<p class="section-thesis">Organized by company — each role shown with the problem, the work, and the outcome.</p>',
    idx
)

# 7) HERO CTA SANITY: Ensure button has type="button" and data-copy-email="carpisonoah@gmail.com"
idx = re.sub(
    r'<button type="button" class="btn btn-primary"[^>]*>',
    '<button type="button" class="btn btn-primary" data-copy-email="carpisonoah@gmail.com">',
    idx
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx)
print("Steps 6-7: index.html updated cleanly!")


# ================= 8, 9, 10. projects.html duplicate link removal =================
with open('projects.html', 'r', encoding='utf-8') as f:
    prj = f.read()

# 8) Trading KB: delete <a> "Open live site"
prj = re.sub(r'<a [^>]*>\s*<span>Open live site</span>[\s\S]*?</a>\s*', '', prj)

# 9) Falco Terminal: delete <a> "Open live terminal"
prj = re.sub(r'<a [^>]*>\s*<span>Open live terminal</span>[\s\S]*?</a>\s*', '', prj)

# 10) Sporty Desk: delete <a> "Open live app"
prj = re.sub(r'<a [^>]*>\s*<span>Open live app</span>[\s\S]*?</a>\s*', '', prj)

with open('projects.html', 'w', encoding='utf-8') as f:
    f.write(prj)
print("Steps 8-10: projects.html updated cleanly!")


# ================= 11. certifications.html status chips =================
with open('certifications.html', 'r', encoding='utf-8') as f:
    cert = f.read()

cert_chips = '''<div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-top:0.35rem;">
              <span class="cert-roadmap-meta">Make.com Automation Fundamentals</span>
              <span class="cert-tag cert-tag--pending">In progress</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-top:0.35rem;">
              <span class="cert-roadmap-meta">n8n Workflow Automation</span>
              <span class="cert-tag cert-tag--planned">Planned</span>
            </div>'''

cert = re.sub(
    r'<p class="cert-roadmap-meta">\s*Make\.com Automation Fundamentals[\s\S]*?</p>\s*<span class="cert-tag cert-tag--pending">Active path</span>',
    cert_chips,
    cert
)

with open('certifications.html', 'w', encoding='utf-8') as f:
    f.write(cert)
print("Step 11: certifications.html status chips updated cleanly!")


# ================= 12 & 13. Open Graph & Twitter Meta for ALL 7 Pages =================
page_meta_spec = {
    'index.html': {
        'title': 'Noah Carpiso — Remote Operations & Automation',
        'desc': 'Remote operations and automation. I run community workflows and build the tools that make them repeatable.',
        'url': 'https://noah-carpiso.pages.dev/'
    },
    'experience.html': {
        'title': 'Experience | Noah Carpiso',
        'desc': 'Community operations, partnership coordination, and support triage — with the problem, the work, and the outcome for each role.',
        'url': 'https://noah-carpiso.pages.dev/experience.html'
    },
    'projects.html': {
        'title': 'Projects | Noah Carpiso',
        'desc': 'Utilities, scrapers, knowledge systems, and operational tools built with AI-assisted development.',
        'url': 'https://noah-carpiso.pages.dev/projects.html'
    },
    'stack.html': {
        'title': 'Toolkit | Noah Carpiso',
        'desc': 'The tools and workflows I use to run operations and build things.',
        'url': 'https://noah-carpiso.pages.dev/stack.html'
    },
    'setup.html': {
        'title': 'Setup | Noah Carpiso',
        'desc': 'My remote workstation: dual monitors, fiber + backup internet, and a reliability-first setup.',
        'url': 'https://noah-carpiso.pages.dev/setup.html'
    },
    'certifications.html': {
        'title': 'Certifications | Noah Carpiso',
        'desc': 'Active learning path in service, marketing, productivity, and automation.',
        'url': 'https://noah-carpiso.pages.dev/certifications.html'
    },
    'play.html': {
        'title': 'Snake | Noah Carpiso',
        'desc': 'A small easter-egg game.',
        'url': 'https://noah-carpiso.pages.dev/play.html',
        'robots': '<meta name="robots" content="noindex, nofollow">'
    }
}

for p_file, data in page_meta_spec.items():
    if not os.path.exists(p_file):
        continue
    with open(p_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove existing meta og/twitter/robots
    content = re.sub(r'<meta property="og:[^>]*>\s*', '', content)
    content = re.sub(r'<meta name="twitter:[^>]*>\s*', '', content)
    content = re.sub(r'<meta name="robots"[^>]*>\s*', '', content)

    robots_line = data.get('robots', '')
    if robots_line:
        robots_line += '\n  '

    og_meta_block = f'''{robots_line}<meta property="og:type" content="website">
  <meta property="og:url" content="{data['url']}">
  <meta property="og:title" content="{data['title']}">
  <meta property="og:description" content="{data['desc']}">
  <meta property="og:image" content="https://noah-carpiso.pages.dev/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{data['title']}">
  <meta name="twitter:description" content="{data['desc']}">
  <meta name="twitter:image" content="https://noah-carpiso.pages.dev/og.png">'''

    content = content.replace('</head>', f'  {og_meta_block}\n</head>')

    with open(p_file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Steps 12-13: Open Graph and Twitter Card tags updated across all 7 pages!")

# ================= 5 (script.js update). Null-guard initEmailModal =================
with open('script.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Make sure initEmailModal null-guards safely
if 'function initEmailModal()' in js_content:
    js_content = re.sub(
        r'function initEmailModal\(\)\s*\{[\s\S]*?\}\n\n',
        '''function initEmailModal() {
    var modal = document.getElementById('email-modal');
    var form = document.querySelector('.email-form');
    if (!modal && !form) return;
  }\n\n''',
        js_content
    )

with open('script.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Step 5 (script.js): initEmailModal null-guarded safely!")
