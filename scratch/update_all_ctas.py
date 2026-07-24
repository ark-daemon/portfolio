import os
import re

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

    # Add copy email button next to Email me CTA if missing
    if 'data-copy-email' not in content:
        content = re.sub(
            r'(<a href="mailto:carpisonoah@gmail\.com"[^>]*>Email me about a role</a>)',
            r'\1\n          <button type="button" class="btn btn-cta-outline" data-copy-email="carpisonoah@gmail.com" aria-label="Copy email address carpisonoah@gmail.com">Copy email 📋</button>',
            content
        )

    # Ensure resume download tag has filename
    content = re.sub(r'download(?!=)', r'download="Noah_Carpiso_Resume.pdf"', content)

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("CTAs and email copy buttons updated cleanly across all HTML pages!")
