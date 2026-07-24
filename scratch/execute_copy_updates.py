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

replacements = [
    # 1. CTA Block
    (
        r"Available for remote community ops, partnership coordination, support, and junior automation-adjacent roles\. If you need someone who can run day-to-day operations and also build tools to make that work easier, let's talk\.",
        "Available for remote operations, partnership coordination, support, and automation roles. If you need someone who runs day-to-day operations and builds tools to cut repetitive work, let's talk."
    ),
    (
        r"Available for remote ops, community, support, partnerships, or junior\s+automation-adjacent roles\.",
        "Available for remote operations, community, support, partnerships, or automation roles."
    ),
    (
        r"Available for remote ops, support, partnerships, and junior automation-adjacent roles\.",
        "Available for remote operations, support, partnerships, and automation roles."
    ),
    (
        r"junior automation-adjacent",
        "automation"
    ),

    # 2. Project Status Tags
    (
        r"~80% WIP",
        "In Progress"
    ),
    (
        r"~80%",
        "In Progress"
    ),
    (
        r"LEARNING SYSTEM",
        "Knowledge System"
    ),

    # 3. Toolkit Language
    (
        r"n8n <em>learning</em>",
        "n8n"
    ),
    (
        r"Make <em>learning</em>",
        "Make"
    ),
    (
        r"N8N LEARNING",
        "n8n"
    ),
    (
        r"MAKE LEARNING",
        "Make"
    ),
    (
        r"AUTOMATION LEARNING PATH",
        "AUTOMATION"
    ),
    (
        r"Tools I use to build things and run operations\. Some I know well, some I'm still learning\.",
        "Tools I use to run operations and build things — grouped by how I use them."
    ),

    # 4. Reframe AI-assisted role note
    (
        r"My role: I figure out what to build and why, then use AI coding tools to put it together\. I test the output myself\. I don't claim to be a software engineer\.",
        "My role: I define the operational problem, design the workflow, and ship the tool using AI-assisted development — then test the output myself. I optimize for usefulness and shipped results."
    ),

    # 5. Clean Experience Timeline parenthetical
    (
        r"FEB 2024 – PRESENT \(PART-TIME ALONGSIDE COURSEWORK THROUGH SEPT 2025, FULL-TIME SINCE\)",
        "FEB 2024 – PRESENT · Remote · Metro Manila"
    ),
    (
        r"FEB 2024 - PRESENT \(PART-TIME ALONGSIDE COURSEWORK THROUGH SEPT 2025, FULL-TIME SINCE\)",
        "FEB 2024 – PRESENT · Remote · Metro Manila"
    ),

    # 6. Hero Subhead
    (
        r"Community operations and AI-assisted automation\. I run the day-to-day and build the tools that make it repeatable\.",
        "Remote operations and automation. I run community workflows and build the tools that make them repeatable."
    ),

    # 7. About Paragraphs
    (
        r"Since then I've supported other online projects and built a few tools on my own: knowledge bases, account utilities, esports data collectors\. I'm currently studying n8n and Make to automate the same ops patterns I used to run by hand\.",
        "Since then I've supported other online projects and built my own tools — knowledge bases, account utilities, and data collectors — and I automate the same ops patterns I used to run by hand with n8n and Make."
    ),

    # 8. Certifications Intro
    (
        r"What I'm studying right now\. Links go live when I finish each credential\.",
        "Active learning path. Credential links are added on completion."
    ),

    # 9. Projects Page Intro
    (
        r"Utilities, web scrapers, knowledge systems, and operational tools I put together using AI coding tools\. I handle product direction, research, and testing\.",
        "Utilities, scrapers, knowledge systems, and operational tools I build with AI-assisted development. I own product direction, research, and testing."
    )
]

for f_path in html_files:
    if not os.path.exists(f_path):
        continue
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    for pattern, repl in replacements:
        content = re.sub(pattern, repl, content)

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Copy updates executed across all HTML files!")
