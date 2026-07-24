import os
import re

targets = [
    "I don't claim to be a software engineer",
    "part-time alongside coursework",
    "(In Progress complete)",
    "Process with receipts"
]

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

for f_name in html_files:
    with open(f_name, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    for i, line in enumerate(lines, 1):
        for target in targets:
            if target.lower() in line.lower():
                print(f"{f_name}:{i} -> Found '{target}': {line.strip()}")
