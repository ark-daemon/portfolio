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

    # 1. Replace remaining "WIP" status text with "In Progress"
    content = re.sub(r'>\s*WIP\s*<', '>In Progress<', content)
    content = re.sub(r'status-wip', 'status-progress', content)

    # 2. Replace remaining "Learning system" or "learning system" with "Knowledge system"
    content = re.sub(r'Learning system', 'Knowledge system', content, flags=re.IGNORECASE)

    # 3. Replace remaining "junior" in experience.html form help text
    content = re.sub(r'or junior\s+automation-adjacent roles', 'or automation roles', content)
    content = re.sub(r'junior automation-adjacent', 'automation', content)

    # 4. Replace "Automation Learning Path" with "AUTOMATION"
    content = re.sub(r'Automation Learning Path', 'AUTOMATION', content, flags=re.IGNORECASE)

    # 5. Replace "Learning path" tag in certifications with "Active" or "In Progress"
    content = re.sub(r'>Learning path<', '>Active path<', content, flags=re.IGNORECASE)

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Remaining copy occurrences cleaned up!")
