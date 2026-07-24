import os
import re

# 1. Update certifications.html timeline
with open('certifications.html', 'r', encoding='utf-8') as f:
    cert_content = f.read()

cert_old_timeline = '<p class="cert-roadmap-meta">Make.com Automation Fundamentals (in progress) · n8n Workflow Automation (planned)</p>\n            <span class="cert-tag cert-tag--pending">Active path</span>'

cert_new_timeline = '''<div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-top:0.35rem;">
              <span class="cert-roadmap-meta">Make.com Automation Fundamentals</span>
              <span class="cert-tag cert-tag--pending">In progress</span>
            </div>
            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-top:0.35rem;">
              <span class="cert-roadmap-meta">n8n Workflow Automation</span>
              <span class="cert-tag cert-tag--planned" style="background:var(--surface-2); color:var(--text-2); border:1px solid var(--border);">Planned</span>
            </div>'''

cert_content = cert_content.replace(cert_old_timeline, cert_new_timeline)
# Also handle variations if any
cert_content = re.sub(
    r'<p class="cert-roadmap-meta">\s*Make\.com Automation Fundamentals \(in progress\) · n8n Workflow Automation \(planned\)\s*</p>\s*<span class="cert-tag cert-tag--pending">Active path</span>',
    cert_new_timeline,
    cert_content
)

with open('certifications.html', 'w', encoding='utf-8') as f:
    f.write(cert_content)


# 2. Update projects.html duplicate live links
with open('projects.html', 'r', encoding='utf-8') as f:
    prj_content = f.read()

# Trading KB: remove <a ...><span>Open live site</span>...</a> from footer
prj_content = re.sub(
    r'<a href="https://arkdaemon\.pages\.dev/" target="_blank" rel="noopener noreferrer" class="btn btn-primary">\s*<span>Open live site</span>[\s\S]*?</a>\s*',
    '',
    prj_content
)

# Falco Terminal: remove <a ...><span>Open live terminal</span>...</a> from footer
prj_content = re.sub(
    r'<a href="https://falco-screener\.pages\.dev/" target="_blank" rel="noopener noreferrer" class="btn btn-primary">\s*<span>Open live terminal</span>[\s\S]*?</a>\s*',
    '',
    prj_content
)

# Sporty Desk: remove <a ...><span>Open live app</span>...</a> from footer
prj_content = re.sub(
    r'<a href="https://sporty-desk\.pages\.dev/" target="_blank" rel="noopener noreferrer" class="btn btn-primary">\s*<span>Open live app</span>[\s\S]*?</a>\s*',
    '',
    prj_content
)

with open('projects.html', 'w', encoding='utf-8') as f:
    f.write(prj_content)


# 3. Update experience.html duplicate email line
with open('experience.html', 'r', encoding='utf-8') as f:
    exp_content = f.read()

# Clean duplicate residue sections/paragraphs
exp_content = re.sub(
    r'(?:<p style="margin-top:0\.75rem; font-family:var\(--font-mono\); font-size:12px; color:var\(--text-3\);">Direct email: carpisonoah@gmail\.com</p>\s*</div>\s*</section>\s*)+',
    '',
    exp_content
)

with open('experience.html', 'w', encoding='utf-8') as f:
    f.write(exp_content)


# 4 & 5. Open Graph, Twitter Cards, and Robots tag for all 7 pages
page_meta = {
    'index.html': {
        'title': 'Noah Carpiso — Remote Operations & Automation',
        'desc': 'Remote operations and automation. I run community workflows and build the tools that make them repeatable.',
        'url': 'https://noah-carpiso.pages.dev/'
    },
    'experience.html': {
        'title': 'Experience | Noah Carpiso',
        'desc': 'Community operations, partnership management, ticket triage, and AI-assisted automation tooling track record.',
        'url': 'https://noah-carpiso.pages.dev/experience.html'
    },
    'projects.html': {
        'title': 'Projects | Noah Carpiso',
        'desc': 'Projects and automated tools: Trading Knowledge Base, Esports Data Platform scrapers, Codex Manager, Falco screener, and Sporty Desk.',
        'url': 'https://noah-carpiso.pages.dev/projects.html'
    },
    'stack.html': {
        'title': 'Toolkit | Noah Carpiso',
        'desc': 'AI-assisted building tools, Python web scrapers, community ops platforms, and automation workflow stack.',
        'url': 'https://noah-carpiso.pages.dev/stack.html'
    },
    'setup.html': {
        'title': 'Setup | Noah Carpiso',
        'desc': 'Remote work readiness: dual monitors, PC hardware specs, fiber connection, typing speed, and 24/7 availability.',
        'url': 'https://noah-carpiso.pages.dev/setup.html'
    },
    'certifications.html': {
        'title': 'Certifications | Noah Carpiso',
        'desc': 'Certifications in progress: HubSpot, Google, Notion, Make, n8n.',
        'url': 'https://noah-carpiso.pages.dev/certifications.html'
    },
    'play.html': {
        'title': 'Snake | Noah Carpiso',
        'desc': 'Snake: dual-monitor arcade game.',
        'url': 'https://noah-carpiso.pages.dev/play.html',
        'robots': '<meta name="robots" content="noindex, nofollow">'
    }
}

for p_file, data in page_meta.items():
    if not os.path.exists(p_file):
        continue
    with open(p_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove old og/twitter tags
    content = re.sub(r'<meta property="og:[^>]*>', '', content)
    content = re.sub(r'<meta name="twitter:[^>]*>', '', content)
    content = re.sub(r'<meta name="robots"[^>]*>', '', content)

    # Build new meta block
    robots_str = data.get('robots', '')
    if robots_str:
        robots_str += '\n  '

    og_block = f'''{robots_str}<meta property="og:type" content="website">
  <meta property="og:title" content="{data['title']}">
  <meta property="og:description" content="{data['desc']}">
  <meta property="og:url" content="{data['url']}">
  <meta property="og:image" content="https://noah-carpiso.pages.dev/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{data['title']}">
  <meta name="twitter:description" content="{data['desc']}">
  <meta name="twitter:image" content="https://noah-carpiso.pages.dev/og.png">'''

    # Insert before </head>
    content = content.replace('</head>', f'  {og_block}\n</head>')

    with open(p_file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Applied consistency fixes across all 7 HTML pages!")
