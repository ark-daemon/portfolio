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

    # Match any <button ... > across lines where type= is missing
    def fix_button_tag(match):
        full_btn = match.group(0)
        if 'type=' in full_btn:
            return full_btn
        return full_btn.replace('<button', '<button type="button"', 1)

    content = re.sub(r'<button[\s\S]*?>', fix_button_tag, content)

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated multiline button type attributes cleanly!")
