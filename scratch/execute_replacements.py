import re

# 1. Update experience.html
with open('experience.html', 'r', encoding='utf-8') as f:
    exp = f.read()

# Replacement 1: Coursework parenthetical
exp = exp.replace(
    'FEB 2024 - PRESENT (part-time alongside coursework through Sept 2025, full-time since)',
    'FEB 2024 – PRESENT · Remote · Metro Manila'
)

# Replacement 2: Broken sentence
exp_target_2 = '''Building the <strong>Trading Knowledge Base</strong> (In Progress
                  complete): organizing my own trading notes into a searchable
                  library and curriculum; live glossary preview on the Projects
                  page.'''
# Match flexibly across whitespace
exp = re.sub(
    r'Building the\s*<strong[^>]*>Trading Knowledge Base</strong>\s*\(In Progress\s*complete\):\s*organizing my own trading notes into a searchable\s*library and curriculum;\s*live glossary preview on the Projects\s*page\.',
    'Building the <strong>Trading Knowledge Base</strong> (In Progress) — organizing my own trading notes into a searchable library and curriculum, with a live glossary preview on the Projects page.',
    exp
)

# Replacement 3: Apologetic AI note
exp = re.sub(
    r'My role:\s*I figure out what to build and why,\s*then use AI\s*coding tools to put it together\.\s*I test the output myself\.\s*I don\'t claim to be a software engineer\.',
    'My role: I define the operational problem, design the workflow, and ship the tool using AI-assisted development — then test the output myself. I optimize for usefulness and shipped results.',
    exp
)

with open('experience.html', 'w', encoding='utf-8') as f:
    f.write(exp)


# 2. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    idx = f.read()

# Replacement 4: Cryptic Experience teaser line
idx = re.sub(
    r'<p class="section-thesis">\s*Company-first\.\s*Process with receipts\.\s*</p>',
    '<p class="section-thesis">Organized by company — each role shown with the problem, the work, and the outcome.</p>',
    idx
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(idx)

print("Executed all 4 text replacements successfully!")
