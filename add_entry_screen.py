import re

html_path = 'omni.html'
css_path = 'style.css'
js_path = 'script.js'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

entry_html = """
    <!-- Pre-Entry Loading Screen -->
    <div id="entry-screen">
      <div id="login-canvas-container"></div>
      <div class="entry-content">
        <h1 class="system-text">INITIALIZING SYSTEM...</h1>
        <button id="enter-btn">ENTER</button>
        <p id="loading-text">LOADING...</p>
      </div>
    </div>
"""

# Pattern to replace exactly the old login screen
pattern = r'(<!-- Phase 1: Login -->\s*)?<div id="login-screen">[\s\S]*?<button class="btn-access".*?</button>[\s\S]*?</div>[\s\S]*?</div>'
if '<div id="login-screen">' in html:
    html = re.sub(pattern, entry_html, html)
elif '<div id="entry-screen">' not in html:
    html = html.replace('<body>', f'<body>\n{entry_html}')

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

css_append = """
/* ====================================================
   PRE-ENTRY LOADING SCREEN
   ==================================================== */
#entry-screen {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: #050510;
  display: flex; align-items: center; justify-content: center;
  z-index: 99999;
  overflow: hidden;
}
#login-canvas-container {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;
}
.entry-content {
  position: relative; z-index: 10; text-align: center; color: cyan;
}
.system-text {
  margin-bottom: 20px; letter-spacing: 2px;
  animation: glitch 1s infinite alternate;
  font-family: 'Orbitron', monospace;
}
@keyframes glitch {
  0% { opacity: 0.8; text-shadow: 0 0 5px cyan; }
  100% { opacity: 1; text-shadow: 0 0 20px cyan, 0 0 40px cyan; }
}
#enter-btn {
  padding: 12px 30px; border: 1px solid cyan; background: transparent; color: cyan;
  cursor: pointer; transition: 0.3s; font-family: 'Orbitron', monospace;
  font-size: 1.2rem; letter-spacing: 2px; text-transform: uppercase;
}
#enter-btn:hover {
  background: cyan; color: black; box-shadow: 0 0 15px cyan; transform: scale(1.05);
}
#loading-text {
  margin-top: 20px; opacity: 0; font-family: monospace; font-size: 1.1rem; letter-spacing: 2px; display: block;
}
"""

with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()
if "PRE-ENTRY LOADING SCREEN" not in css:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write(css_append)

js_append = """
// ─────────────────────────────────────────────────────────────
// PRE-ENTRY LOADING ENTRY SCREEN LOGIC
// ─────────────────────────────────────────────────────────────
const enterBtn = document.getElementById("enter-btn");
const loadingText = document.getElementById("loading-text");
const entryScreen = document.getElementById("entry-screen");

if (document.getElementById('entry-screen') && typeof initLoginScreen === 'function') {
    initLoginScreen();
}

if(enterBtn) {
    enterBtn.addEventListener("click", () => {
        enterBtn.style.display = "none";
        
        gsap.to(loadingText, { opacity: 1, duration: 0.5 });
        
        // Tremendous Camera Shake logic applied to the body to retain impact!
        const shakeTl = gsap.timeline();
        for (let i = 0; i < 20; i++) {
            shakeTl.to(document.body, {
                x: Math.random() * 20 - 10,
                y: Math.random() * 20 - 10,
                rotation: Math.random() * 1.5 - 0.75, // slight tilt jitter
                duration: 0.05,
                ease: "none"
            });
        }
        shakeTl.to(document.body, { x: 0, y: 0, rotation: 0, duration: 0.05 });

        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            loadingText.innerText = "LOADING... " + progress + "%";

            // Trigger explosive scale on threejs particles as loading completes
            if (typeof loginParticles !== 'undefined' && loginParticles) {
                loginParticles.scale.x = 1 + progress * 0.02;
                loginParticles.scale.y = 1 + progress * 0.02;
            }

            if (progress >= 100) {
                clearInterval(interval);
                
                if (typeof loginCamera !== 'undefined' && loginCamera) {
                    gsap.to(loginCamera.position, { z: 0.1, duration: 1, ease: "power2.in" });
                }

                gsap.to(entryScreen, {
                    opacity: 0,
                    duration: 1,
                    delay: 0.3,
                    onComplete: () => {
                        entryScreen.style.display = "none";
                        // Free WebGL Memory safely
                        if (typeof loginAnimFrameId !== 'undefined') cancelAnimationFrame(loginAnimFrameId);
                        if(typeof loginRenderer !== 'undefined' && loginRenderer) {
                            loginRenderer.dispose();
                            loginRenderer.forceContextLoss();
                        }
                    }
                });
            }
        }, 150); // 1.5 second loading
    });
}
"""

with open(js_path, 'r', encoding='utf-8') as f:
    orig_js = f.read()
if "PRE-ENTRY LOADING ENTRY SCREEN" not in orig_js:
    with open(js_path, 'a', encoding='utf-8') as f:
        f.write(js_append)

print("SUCCESS: Injection Complete")
