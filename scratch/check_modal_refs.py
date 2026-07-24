import os

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for f_name in html_files:
    with open(f_name, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'email-modal' in content:
        print(f"Found email-modal reference in {f_name}")
