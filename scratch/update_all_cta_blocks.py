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

cta_replacement = '''    <section class="section cta-block cta-block--compact" id="contact" aria-label="Contact">
      <div class="cta-inner">
        <p class="cta-headline">Available for remote operations, partnership coordination, support, and automation roles.</p>
        <div class="cta-actions">
          <button type="button" class="btn btn-cta-primary" data-copy-email="carpisonoah@gmail.com">Copy email 📋</button>
          <a href="mailto:carpisonoah@gmail.com" class="btn btn-cta-outline">Open mail app ↗</a>
          <a href="https://www.linkedin.com/in/noah-carpiso" target="_blank" rel="noopener noreferrer" class="btn btn-cta-outline">LinkedIn ↗</a>
          <a href="Noah-David-Carpiso-Resume.pdf" download="Noah-David-Carpiso-Resume.pdf" class="btn btn-cta-outline">Resume ↓</a>
        </div>
        <p style="margin-top:0.75rem; font-family:var(--font-mono); font-size:12px; color:var(--text-3);">Direct email: carpisonoah@gmail.com</p>
      </div>
    </section>'''

for f_path in html_files:
    if not os.path.exists(f_path):
        continue
    with open(f_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace <div class="cta-block" ... </div> or <section class="section cta-block ... </section>
    content = re.sub(
        r'<(?:div|section)[^>]*class="[^"]*cta-block[^"]*"[\s\S]*?</(?:div|section)>',
        cta_replacement,
        content
    )

    with open(f_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Standardized CTA blocks updated cleanly across all HTML files!")
