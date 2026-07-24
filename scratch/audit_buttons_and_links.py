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

    # 1. Update <nav> tag to have aria-label="Primary"
    content = re.sub(r'<nav class="header-nav"[^>]*>', '<nav class="header-nav" aria-label="Primary">', content)

    # 2. Ensure all <a> tags with target="_blank" have rel="noopener noreferrer"
    def fix_ext_a(match):
        tag = match.group(0)
        if 'target="_blank"' in tag and 'rel=' not in tag:
            return tag.replace('target="_blank"', 'target="_blank" rel="noopener noreferrer"')
        return tag
    content = re.sub(r'<a[^>]*>', fix_ext_a, content)

    # 3. Ensure Resume link points to Noah-David-Carpiso-Resume.pdf with download attribute
    content = re.sub(r'href="Noah-David-Carpiso-Resume\.pdf"', 'href="Noah-David-Carpiso-Resume.pdf" download="Noah-David-Carpiso-Resume.pdf"', content)
    content = re.sub(r'download="[^"]*"', 'download="Noah-David-Carpiso-Resume.pdf"', content)

    # 4. Check buttons for type="button"
    def fix_btn_type(match):
        tag = match.group(0)
        if 'type=' not in tag:
            return tag.replace('<button', '<button type="button"')
        return tag
    content = re.sub(r'<button[\s\S]*?>', fix_btn_type, content)

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Comprehensive HTML audit script completed successfully!")
