import os

banned_strings = [
    "I don't claim to be a software engineer",
    "part-time alongside coursework",
    "(In Progress complete)",
    "Process with receipts"
]

found = False
for root, dirs, files in os.walk('.'):
    if '.git' in root or '.wrangler' in root:
        continue
    for file in files:
        if file.endswith(('.html', '.js', '.css', '.md')):
            f_path = os.path.join(root, file)
            with open(f_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            for b_str in banned_strings:
                if b_str.lower() in content.lower():
                    print(f"FOUND '{b_str}' in {f_path}")
                    found = True

if not found:
    print("VERIFICATION SUCCESS: ZERO occurrences of all 4 forbidden strings found across the entire codebase!")
