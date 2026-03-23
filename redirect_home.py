import re

html_path = 'omni.html'
css_path = 'style.css'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# Remove all existing back buttons
html = re.sub(r'\s*<button onclick="openSection\([^)]+\)" class="back-btn">.*?</button>', '', html)

# Inject back buttons to all sections except hero
sections_list = ['ai-avatar', 'about', 'journey', 'skills', 'certificates', 'experience', 'contact', 'projects']
for sec in sections_list:
    btn_html = f'\\1\n    <button onclick="openSection(\'hero\')" class="back-btn">← Back to Home</button>'
    html = re.sub(rf'(<section\s+id="{sec}"[^>]*>)', btn_html, html, count=1)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Swap default visible section from projects to hero
css = re.sub(r'#projects\s*\{\s*display:\s*block;\s*opacity:\s*1;\s*\}', '#hero {\n  display: block;\n  opacity: 1;\n}', css)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("SUCCESS: Redirected Default Page to Home")
