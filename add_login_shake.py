import re

html_path = 'omni.html'
css_path = 'style.css'
js_path = 'script.js'

# 1. Inject HTML for login screen
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

login_html = """
    <!-- Phase 1: Login -->
    <div id="login-screen">
      <div id="login-canvas-container"></div>
      <div id="login-content">
        <button class="btn-access" onclick="initiateBreach()">Access System</button>
      </div>
    </div>
"""

if '<div id="login-screen">' not in html:
    html = html.replace('<body>', f'<body>\n{login_html}')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)

# 2. Append CSS
css_append = """
/* ====================================================
   SYSTEM BREACH LOGIN STYLES WITH SHAKE
   ==================================================== */
#login-screen {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  z-index: 99999;
  display: flex;
  align-items: center; justify-content: center;
  background-color: #000;
  overflow: hidden;
}
#login-canvas-container {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;
}
#login-content {
  position: relative; z-index: 10; text-align: center;
}
.btn-access {
  padding: 1rem 3rem; font-size: 1.5rem; background: transparent; color: #00ffff;
  border: 1px solid #00ffff; cursor: pointer; font-family: 'Orbitron', monospace;
  text-transform: uppercase; letter-spacing: 4px; transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0,255,255,0.2), inset 0 0 10px rgba(0,255,255,0.1);
}
.btn-access:hover {
  background: rgba(0, 255, 255, 0.1);
  box-shadow: 0 0 30px rgba(0,255,255,0.6), inset 0 0 20px rgba(0,255,255,0.4);
  text-shadow: 0 0 10px #00ffff; transform: scale(1.05);
}
"""
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()
if "SYSTEM BREACH LOGIN STYLES" not in css:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write(css_append)

# 3. Append JS
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
        size: 0.1, color: 0x00ffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending
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

if (document.getElementById('login-screen')) {
    initLoginScreen();
}

window.initiateBreach = function() {
    const btn = document.querySelector('.btn-access');
    if (btn) {
        btn.style.pointerEvents = 'none';
        btn.innerHTML = 'BREACHING...';
    }

    // Advanced Screen Shake Routine via GSAP timeline targeting the body
    const shakeTl = gsap.timeline();
    for (let i = 0; i < 20; i++) {
        shakeTl.to(document.body, {
            x: Math.random() * 30 - 15,
            y: Math.random() * 30 - 15,
            rotation: Math.random() * 1.5 - 0.75, // slight tilt jitter
            duration: 0.05,
            ease: "none"
        });
    }
    shakeTl.to(document.body, { x: 0, y: 0, rotation: 0, duration: 0.05 });

    const tl = gsap.timeline();

    // 1. Warp/glitch animation on Three.js particles
    tl.to(loginCamera.position, {
        z: 0.1, duration: 1.5, ease: "power2.in",
        onUpdate: () => {
            if(loginParticles) {
                loginParticles.scale.x = 1 + Math.random() * 0.5;
                loginParticles.scale.y = 1 + Math.random() * 0.5;
            }
        }
    })
    // 2. Fade out Login Screen
    .to("#login-screen", {
        opacity: 0, duration: 1, ease: "power1.out",
        onComplete: () => {
            cancelAnimationFrame(loginAnimFrameId);
            if (loginRenderer) {
                loginRenderer.dispose();
                loginRenderer.forceContextLoss();
            }
            document.getElementById('login-screen').style.display = 'none';
        }
    }, "-=0.2");
};
"""
with open(js_path, 'r', encoding='utf-8') as f:
    orig_js = f.read()
if "SYSTEM BREACH LOGIN" not in orig_js:
    with open(js_path, 'a', encoding='utf-8') as f:
        f.write(js_append)

print("SUCCESS")
