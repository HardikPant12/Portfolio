import re

html_path = 'omni.html'
css_path = 'style.css'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update navbar link and essentially ALL back buttons to point to home-view
html = html.replace("openSection('hero')", "openSection('home-view')")

# 2. Remove .section class from hero, ai-avatar, about, and wrap them in a unified #home-view .section
html = re.sub(r'<section\s+id="hero"\s+class="hero\s*section">', '<div id="home-view" class="section">\n<section id="hero" class="hero">', html)
html = re.sub(r'<section\s+id="ai-avatar"\s+class="avatar-section\s*section">', '<section id="ai-avatar" class="avatar-section">', html)
html = re.sub(r'<section\s+id="about"\s+class="about\s*dossier-section\s*section">', '<section id="about" class="about dossier-section">', html)

# 3. Remove the back buttons ONLY from those three components (since they are now part of the home-view)
back_btn_pattern = r'\s*<button onclick="openSection\(\'home-view\'\)" class="back-btn">← Back to Home</button>'
html = re.sub(r'(<section id="hero" class="hero">)' + back_btn_pattern, r'\1', html)
html = re.sub(r'(<section id="ai-avatar" class="avatar-section">)' + back_btn_pattern, r'\1', html)
html = re.sub(r'(<section id="about" class="about dossier-section">)' + back_btn_pattern, r'\1', html)

# 4. Close the div before journey
html = re.sub(r'(<section id="journey"\s+class="journey\s*section">)', r'</div>\n\n    \1', html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

css = re.sub(r'#hero\s*\{\s*display:\s*block;\s*opacity:\s*1;\s*\}', '#home-view {\n  display: block;\n  opacity: 1;\n}', css)

with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)

print("SUCCESS: Restored Home View")
