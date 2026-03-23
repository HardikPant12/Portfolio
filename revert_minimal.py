import re

html_path = 'index.html'
omni_path = 'omni.html'
css_path = 'style.css'
js_path = 'script.js'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Update Navbar Links for the Minimal Portal
nav_links_replacement = """<ul class="nav-links" style="cursor:pointer; list-style: none;">
                <li onclick="openSection('hero')"><a>Home</a></li>
                <li onclick="openSection('about')"><a>About</a></li>
                <li onclick="openSection('journey')"><a>Journey</a></li>
                <li onclick="openSection('skills')"><a>Skills</a></li>
                <li onclick="openSection('projects')"><a>Projects</a></li>
                <li onclick="openSection('certificates')"><a>Certs</a></li>
                <li onclick="openSection('experience')"><a>Experience</a></li>
                <li onclick="openSection('contact')"><a>Connect</a></li>
            </ul>"""

html = re.sub(r'<ul class="nav-links">.*?</ul>', nav_links_replacement, html, flags=re.DOTALL)

# 2. Add Portal Overlay right after <body>
if '<div id="portal-overlay"></div>' not in html:
    html = html.replace('<body>', '<body>\n    <div id="portal-overlay"></div>')

# 3. Add ".section" to all major sections and inject back-btn
sections_list = ['hero', 'ai-avatar', 'about', 'journey', 'skills', 'certificates', 'experience', 'contact', 'projects']

for sec in sections_list:
    pattern = rf'(<section\s+id="{sec}"\s+class=")([^"]*)(")'
    def class_replacer(match):
        classes = match.group(2)
        if 'section' not in classes.split():
            return f'{match.group(1)}{classes} section{match.group(3)}'
        return match.group(0)
    
    html = re.sub(pattern, class_replacer, html)
    
    if sec != 'projects':
        btn_html = r'\1\n    <button onclick="openSection(\'projects\')" class="back-btn">← Back to Projects</button>'
        html = re.sub(rf'(<section\s+id="{sec}"[^>]*>)', btn_html, html, count=1)

# 4. Integrate GSAP + three (if needed) at bottom of body
gsap_scripts = """
    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="script.js"></script>
</body>
"""
html = re.sub(r'<script src="script\.js"></script>\s*</body>', gsap_scripts, html)


# 5. RE-APPLY The "Smart Campus Helpdesk" Project Replacement exactly as implemented previously
new_projects_grid = """<div class="projects-grid">
                <!-- Project 1 -->
                <div class="glass project-card c-tilt reveal project-gateway" data-gateway="bio" data-link="https://github.com/Rahul99699/A-Unified-Multi-Source-Plant-Health-Vision-System-for-Cross-Crop-Disease-Detection-and-Early-Diagnos">
                    <div class="pg-top-module">
                        <div class="pg-scanner">
                            <i class="fas fa-leaf pg-icon"></i>
                            <div class="pg-radar"></div>
                            <div class="pg-scanline"></div>
                        </div>
                        <div class="pg-labels">
                            <span class="pg-label">PRJ-01</span>
                            <span class="pg-label pulse-label">LIVE</span>
                            <span class="pg-label">AI MODULE</span>
                        </div>
                        <div class="pg-hover-overlay">
                            <div class="pg-status-wrap">
                                <span class="pg-status-text" data-type="INITIALIZING BIO-SCANNER..."></span>
                            </div>
                            <button class="neon-btn neon-btn-primary pg-enter-btn">ENTER PORTAL</button>
                        </div>
                    </div>
                    <div class="project-info">
                        <h3>Plant Disease Detection</h3>
                        <p>A ML/DL project identifying plant diseases from leaf images using real datasets to support early diagnosis.</p>
                        <div class="project-tech pg-tech">
                            <span class="tech-capsule"><i class="fas fa-microchip"></i> Python</span>
                            <span class="tech-capsule"><i class="fas fa-network-wired"></i> TensorFlow</span>
                            <span class="tech-capsule"><i class="fas fa-database"></i> Kaggle</span>
                        </div>
                        <div class="project-links" onclick="event.stopPropagation()">
                            <a href="https://github.com/Rahul99699/A-Unified-Multi-Source-Plant-Health-Vision-System-for-Cross-Crop-Disease-Detection-and-Early-Diagnos" target="_blank" class="project-link pg-ext-btn"><i class="fab fa-github"></i> OUTPOST</a>
                            <a href="#" class="project-link pg-ext-btn disabled"><i class="fas fa-external-link-alt"></i> UPLINK</a>
                        </div>
                    </div>
                </div>

                <!-- Project 2 -->
                <div class="glass project-card c-tilt reveal project-gateway" data-gateway="doc" data-link="https://report-card-generator-2k4o.vercel.app">
                    <div class="pg-top-module">
                        <div class="pg-scanner">
                            <i class="fas fa-file-invoice pg-icon"></i>
                            <div class="pg-radar"></div>
                            <div class="pg-scanline"></div>
                        </div>
                        <div class="pg-labels">
                            <span class="pg-label">PRJ-02</span>
                            <span class="pg-label pulse-label">ARCHIVED</span>
                            <span class="pg-label">WEB SYSTEM</span>
                        </div>
                        <div class="pg-hover-overlay">
                            <div class="pg-status-wrap">
                                <span class="pg-status-text" data-type="ACCESSING ARCHIVE NODE..."></span>
                            </div>
                            <button class="neon-btn neon-btn-primary pg-enter-btn">ENTER PORTAL</button>
                        </div>
                    </div>
                    <div class="project-info">
                        <h3>Report Card Generator</h3>
                        <p>Responsive web app for creating, previewing, and exporting student report cards with PDF support.</p>
                        <div class="project-tech pg-tech">
                            <span class="tech-capsule"><i class="fab fa-html5"></i> HTML</span>
                            <span class="tech-capsule"><i class="fab fa-css3-alt"></i> CSS</span>
                            <span class="tech-capsule"><i class="fab fa-js"></i> JavaScript</span>
                        </div>
                        <div class="project-links" onclick="event.stopPropagation()">
                            <a href="#" class="project-link pg-ext-btn disabled"><i class="fab fa-github"></i> OUTPOST</a>
                            <a href="https://report-card-generator-2k4o.vercel.app" target="_blank" class="project-link pg-ext-btn"><i class="fas fa-external-link-alt"></i> UPLINK</a>
                        </div>
                    </div>
                </div>

                <!-- Project 3 -->
                <div class="glass project-card c-tilt reveal project-gateway" data-gateway="holo" data-link="https://github.com/HardikPant12/smart-campus-helpdesk">
                    <div class="pg-top-module">
                        <div class="pg-scanner">
                            <i class="fas fa-server pg-icon"></i>
                            <div class="pg-radar"></div>
                            <div class="pg-scanline"></div>
                        </div>
                        <div class="pg-labels">
                            <span class="pg-label">PRJ-03</span>
                            <span class="pg-label pulse-label">ACTIVE NODE</span>
                            <span class="pg-label">WEB SYSTEM</span>
                        </div>
                        <div class="pg-hover-overlay">
                            <div class="pg-status-wrap">
                                <span class="pg-status-text" data-type="ESTABLISHING SECURE UPLINK..."></span>
                            </div>
                            <button class="neon-btn neon-btn-primary pg-enter-btn">ENTER PORTAL</button>
                        </div>
                    </div>
                    <div class="project-info">
                        <h3>Smart Campus Helpdesk</h3>
                        <p>A centralized system for managing campus issues, complaints, and service requests with real-time tracking.</p>
                        <div class="project-tech pg-tech">
                            <span class="tech-capsule"><i class="fab fa-python"></i> Django</span>
                            <span class="tech-capsule"><i class="fab fa-python"></i> Python</span>
                            <span class="tech-capsule"><i class="fas fa-globe"></i> Web System</span>
                        </div>
                        <div class="project-links" onclick="event.stopPropagation()">
                            <a href="https://github.com/HardikPant12/smart-campus-helpdesk" target="_blank" class="project-link pg-ext-btn"><i class="fab fa-github"></i> OUTPOST</a>
                            <a href="#" class="project-link pg-ext-btn disabled"><i class="fas fa-external-link-alt"></i> UPLINK</a>
                        </div>
                    </div>
                </div>
            </div>"""
pattern = r'<div class="projects-grid">.*?</div>\s*</div>\s*</section>'
replacement = new_projects_grid + "\n        </div>\n    </section>"
html = re.sub(pattern, replacement, html, flags=re.DOTALL)

# WRITE output
with open(omni_path, 'w', encoding='utf-8') as f:
    f.write(html)


# 6. Apply CSS Appends
css_append = """
/* ====================================================
   MINIMAL PORTAL OVERRIDE
   ==================================================== */
#portal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, cyan, transparent);
  opacity: 0;
  pointer-events: none;
  z-index: 9999;
}

.section {
  display: none;
  opacity: 0;
}

#projects {
  display: block;
  opacity: 1;
}

/* Ensure navbar always shows */
nav#navbar, nav {
  display: block !important;
  opacity: 1 !important;
}

.back-btn {
  position: fixed;
  top: 100px;
  left: 20px;
  z-index: 9999;
  background: transparent;
  color: cyan;
  border: 1px solid cyan;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Orbitron', monospace;
  font-size: 1rem;
  transition: 0.3s ease;
  backdrop-filter: blur(4px);
}
.back-btn:hover {
  background: cyan;
  color: black;
  box-shadow: 0 0 10px cyan;
}

/* Ensure links hide underlining naturally */
.nav-links a { text-decoration: none; cursor: pointer; }
.nav-links li { cursor: pointer; }
"""
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

if "MINIMAL PORTAL OVERRIDE" not in css:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write(css_append)

# 7. Apply JS Append
js_append = """
// ─────────────────────────────────────────────────────────────
// MINIMAL PORTAL SYSTEM
// ─────────────────────────────────────────────────────────────
window.openSection = function(targetId) {
  if (window.isPortalAnimating) return;
  window.isPortalAnimating = true;

  gsap.to("#portal-overlay", {
    opacity: 1,
    scale: 2,
    duration: 0.5
  });

  setTimeout(() => {
    document.querySelectorAll(".section").forEach(sec => {
      sec.style.display = "none";
      sec.style.opacity = 0;
    });

    const target = document.getElementById(targetId);
    if(target) {
        target.style.display = "block";
        window.scrollTo(0,0);

        gsap.to(target, { opacity: 1, duration: 0.8 });
    }

    gsap.to("#portal-overlay", {
      opacity: 0,
      scale: 1,
      duration: 0.5,
      onComplete: () => {
          window.isPortalAnimating = false;
      }
    });
  }, 500);
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => {
            const link = card.getAttribute("data-link");
            if (link) window.open(link, "_blank");
        });
    });
});
"""

with open(js_path, 'r', encoding='utf-8') as f:
    orig_js = f.read()
if "MINIMAL PORTAL SYSTEM" not in orig_js:
    with open(js_path, 'a', encoding='utf-8') as f:
        f.write(js_append)

print("SUCCESS: Full Reversion and Minimal Portal setup complete")
