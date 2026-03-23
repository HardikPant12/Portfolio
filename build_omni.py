import os
import re

html_path = 'index.html'
omni_path = 'omni.html'
css_path = 'style.css'
js_path = 'script.js'

# Read index.html to extract body
with open(html_path, 'r', encoding='utf-8') as f:
    html_content = f.read()

# match everything inside <body>...</body>
body_match = re.search(r'<body[^>]*>(.*?)</body>', html_content, re.IGNORECASE | re.DOTALL)
if body_match:
    body_content = body_match.group(1)
    # remove the existing script tag: <script src="script.js"></script>
    body_content = re.sub(r'<script\s+src="script\.js"\s*></script>', '', body_content, flags=re.IGNORECASE)
else:
    body_content = "<!-- Content not found in index.html -->"

# Create omni.html
omni_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Omni-System Breach</title>
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>

  <!-- Phase 1: Login -->
  <div id="login-screen">
    <div id="login-canvas-container"></div>
    <div id="login-content">
      <button class="btn-access" onclick="initiateBreach()">Access System</button>
    </div>
  </div>

  <!-- Phase 2: Main Interface -->
  <div id="main-interface">
{body_content}
  </div>

  <!-- GSAP -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
  <!-- Three.js -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <!-- YOUR SCRIPT (MUST BE LAST) -->
  <script src="script.js"></script>

</body>
</html>
"""

with open(omni_path, 'w', encoding='utf-8') as f:
    f.write(omni_html)

# Append to style.css
css_append = """

/* ====================================================
   SYSTEM BREACH LOGIN STYLES
   ==================================================== */
#login-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
  overflow: hidden;
}

#login-canvas-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

#login-content {
  position: relative;
  z-index: 10;
  text-align: center;
}

.btn-access {
  padding: 1rem 3rem;
  font-size: 1.5rem;
  background: transparent;
  color: #00FFFF;
  border: 1px solid #00FFFF;
  cursor: pointer;
  font-family: 'Orbitron', 'Share Tech Mono', monospace;
  text-transform: uppercase;
  letter-spacing: 4px;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0,255,255,0.2), inset 0 0 10px rgba(0,255,255,0.1);
}

.btn-access:hover {
  background: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 30px rgba(0,255,255,0.6), inset 0 0 20px rgba(0,255,255,0.4);
  text-shadow: 0 0 10px #00FFFF;
  transform: scale(1.05);
}

#main-interface {
  display: none;
  opacity: 0;
}

nav {
  opacity: 0;
}
"""

with open(css_path, 'r', encoding='utf-8') as f:
    orig_css = f.read()
if "SYSTEM BREACH LOGIN STYLES" not in orig_css:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write(css_append)

# Append to script.js
js_append = """

// ─────────────────────────────────────────────────────────────
// SYSTEM BREACH LOGIN & UNLOCK (THREE.JS + GSAP)
// ─────────────────────────────────────────────────────────────
let loginScene, loginCamera, loginRenderer, loginParticles;
let loginAnimFrameId;

function initLoginScreen() {
    const container = document.getElementById('login-canvas-container');
    if (!container) return;

    loginScene = new THREE.Scene();
    loginCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    loginCamera.position.z = 10;

    loginRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    loginRenderer.setSize(window.innerWidth, window.innerHeight);
    loginRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(loginRenderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 40;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x00ffff,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    loginParticles = new THREE.Points(geometry, material);
    loginScene.add(loginParticles);

    function animate() {
        loginAnimFrameId = requestAnimationFrame(animate);
        loginParticles.rotation.y += 0.002;
        loginParticles.rotation.x += 0.001;
        loginRenderer.render(loginScene, loginCamera);
    }
    animate();

    window.addEventListener('resize', () => {
        if (!loginCamera || !loginRenderer) return;
        loginCamera.aspect = window.innerWidth / window.innerHeight;
        loginCamera.updateProjectionMatrix();
        loginRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Call init on load
if (document.getElementById('login-screen')) {
    initLoginScreen();
}

// The breach function triggered by the button
window.initiateBreach = function() {
    const btn = document.querySelector('.btn-access');
    if (btn) {
        btn.style.pointerEvents = 'none';
        btn.innerHTML = 'BREACHING...';
    }

    const tl = gsap.timeline();

    // 1. Warp/glitch animation on Three.js particles
    tl.to(loginCamera.position, {
        z: 0.1,
        duration: 1.5,
        ease: "power2.in",
        onUpdate: () => {
            // Glitch effect: scale particles rapidly
            loginParticles.scale.x = 1 + Math.random() * 0.5;
            loginParticles.scale.y = 1 + Math.random() * 0.5;
        }
    })
    // 2. Fade out Login Screen and dissolve particles
    .to("#login-screen", {
        opacity: 0,
        duration: 1,
        ease: "power1.out",
        onComplete: () => {
            // Destroy Three.js to free memory
            cancelAnimationFrame(loginAnimFrameId);
            if (loginRenderer) {
                loginRenderer.dispose();
                loginRenderer.forceContextLoss();
            }
            document.getElementById('login-screen').style.display = 'none';
        }
    }, "-=0.2")
    // 3. Reveal Main Interface
    .set("#main-interface", { display: "block" })
    .to("#main-interface", {
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
    })
    // 4. Reveal Navbar with delay
    .to("nav", {
        opacity: 1,
        duration: 1,
        delay: 0.5
    }, "-=1"); 
};
"""

with open(js_path, 'r', encoding='utf-8') as f:
    orig_js = f.read()
if "SYSTEM BREACH LOGIN" not in orig_js:
    with open(js_path, 'a', encoding='utf-8') as f:
        f.write(js_append)

print("SUCCESS")
