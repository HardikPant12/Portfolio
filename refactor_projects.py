import re

# 1. Update omni.html
html_path = 'omni.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

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
new_html = re.sub(pattern, replacement, html_content, flags=re.DOTALL)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(new_html)


# 2. Update style.css
css_path = 'style.css'
css_append = """
/* Interactive Project Cards UX */
.project-card {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: scale(1.03);
}

.disabled {
  opacity: 0.4;
  pointer-events: none;
  cursor: not-allowed;
}
"""
with open(css_path, 'a', encoding='utf-8') as f:
    f.write(css_append)


# 3. Update script.js
js_path = 'script.js'
js_append = """
// Interactive Projects Click Handler
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => {
            const link = card.getAttribute("data-link");
            if (link) window.open(link, "_blank");
        });
    });
});
"""
with open(js_path, 'a', encoding='utf-8') as f:
    f.write(js_append)

print("SUCCESS: Refactored projects section")
