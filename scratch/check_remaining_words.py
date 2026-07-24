import os
import re

search_words = ["junior", "learning", "~80%", "WIP"]
files_to_check = [
    'index.html',
    'experience.html',
    'projects.html',
    'stack.html',
    'setup.html',
    'certifications.html',
    'script.js',
    'styles.css'
]

results = []

for f_path in files_to_check:
    if not os.path.exists(f_path):
        continue
    with open(f_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    for idx, line in enumerate(lines, 1):
        for word in search_words:
            if re.search(r'\b' + re.escape(word) + r'\b', line, re.IGNORECASE) or word in line:
                # Exclude machine CSS variables or unrelated JS logic if any
                results.append({
                    "file": f_path,
                    "line": idx,
                    "word": word,
                    "text": line.strip()
                })

print("=== REMAINING OCCURRENCES REPORT ===")
if not results:
    print("Zero occurrences of 'junior', 'learning', '~80%', or 'WIP' remaining across all codebase files!")
else:
    for r in results:
        print(f"[{r['file']}:L{r['line']}] (Word: '{r['word']}') -> {r['text']}")
