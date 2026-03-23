import re
import os

html_path = 'omni.html'
css_path = 'style.css'
js_path = 'script.js'

with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Hide navbar
if '<nav id="navbar" style="display: none !important;">' not in html:
    html = re.sub(r'<nav id="navbar">', r'<nav id="navbar" style="display: none !important;">', html)

# 2. Add Hub Container HTML
hub_html = """
    <!-- ══════════════════════════════════════
         CENTRAL HUB / CORE INTERFACE
    ═══════════════════════════════════════ -->
    <div id="hub-container" style="position: relative; width: 100vw; height: 100vh; overflow: hidden; display: flex; align-items: center; justify-content: center; z-index: 50;">
        <!-- Three.js neural core canvas -->
        <div id="core-canvas-container" style="position: absolute; inset: 0; z-index: 1;"></div>
        
        <!-- UI Layer -->
        <div id="hub-ui" style="position: absolute; inset: 0; z-index: 2; display: flex; align-items: center; justify-content: center;">
            <div id="core">HP.</div>
            
            <div class="portal" data-target="about" style="--angle: 0deg;">IDENTITY</div>
            <div class="portal" data-target="journey" style="--angle: 51.4deg;">JOURNEY</div>
            <div class="portal" data-target="skills" style="--angle: 102.8deg;">SKILLS</div>
            <div class="portal" data-target="projects" style="--angle: 154.2deg;">PROJECTS</div>
            <div class="portal" data-target="certificates" style="--angle: 205.7deg;">CERTS</div>
            <div class="portal" data-target="experience" style="--angle: 257.1deg;">EXPERIENCE</div>
            <div class="portal" data-target="contact" style="--angle: 308.5deg;">CONNECT</div>
        </div>
        
        <!-- Glitch Overlay Text -->
        <div id="hub-glitch-text" style="position: absolute; bottom: 15%; width: 100%; text-align: center; color: #00ffff; font-family: 'Courier New', monospace; font-size: 1.5rem; letter-spacing: 5px; opacity: 0; pointer-events: none; z-index: 10;">
            ACCESSING NODE...
        </div>
    </div>
"""

if 'id="hub-container"' not in html:
    html = html.replace('<div id="main-interface">', '<div id="main-interface">\n' + hub_html)

# 3. Modify all sections to become portal sections
sections = ['hero', 'ai-avatar', 'about', 'journey', 'skills', 'projects', 'certificates', 'experience', 'contact']
for sec in sections:
    pattern = rf'(<section\s+id="{sec}"\s+[^>]*>)'
    
    def replacer(match):
        tag = match.group(1)
        if 'portal-section' not in tag:
            if 'class="' in tag:
                tag = tag.replace('class="', 'class="portal-section ')
            else:
                tag = tag.replace('>', ' class="portal-section">')
            return f'{tag}\\n    <button class="back-btn">← Back to Hub</button>'
        return tag
        
    html = re.sub(pattern, replacer, html)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)


# 4. Append to CSS
css_append = """
/* ====================================================
   CENTRAL HUB & PORTAL NAVIGATION
   ==================================================== */
#core {
    position: relative;
    width: 140px;
    height: 140px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Orbitron', sans-serif;
    font-size: 2.5rem;
    font-weight: 800;
    color: #00ffff;
    text-shadow: 0 0 20px #00ffff;
    border: 2px solid rgba(0, 243, 255, 0.4);
    box-shadow: inset 0 0 40px rgba(0, 243, 255, 0.2), 0 0 60px rgba(0, 243, 255, 0.3);
    backdrop-filter: blur(8px);
    z-index: 10;
    transition: all 0.5s ease;
}

#core:hover {
    box-shadow: inset 0 0 60px rgba(0, 243, 255, 0.5), 0 0 80px rgba(0, 243, 255, 0.6);
    transform: scale(1.05);
}

.portal {
    position: absolute;
    color: #00ffff;
    border: 1px solid rgba(0, 243, 255, 0.5);
    padding: 14px 28px;
    border-radius: 30px;
    cursor: pointer;
    font-family: 'Orbitron', sans-serif;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 3px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    z-index: 15;
    
    transform: rotate(var(--angle)) translateY(-260px) rotate(calc(-1 * var(--angle)));
}

.portal:hover {
    background: rgba(0, 243, 255, 0.25);
    color: #fff;
    border-color: #00ffff;
    box-shadow: 0 0 25px rgba(0, 243, 255, 0.8), inset 0 0 15px rgba(0, 243, 255, 0.5);
    transform: rotate(var(--angle)) translateY(-270px) rotate(calc(-1 * var(--angle))) scale(1.15);
}

.back-btn {
    position: fixed;
    top: 30px;
    left: 30px;
    z-index: 9999;
    background: rgba(10, 10, 15, 0.85);
    border: 1px solid #bc13fe;
    color: #bc13fe;
    padding: 12px 24px;
    border-radius: 6px;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    box-shadow: 0 0 10px rgba(188, 19, 254, 0.2);
    text-transform: uppercase;
}

.back-btn:hover {
    background: rgba(188, 19, 254, 0.2);
    color: #fff;
    box-shadow: 0 0 20px rgba(188, 19, 254, 0.7), inset 0 0 10px rgba(188, 19, 254, 0.4);
    transform: translateX(-5px);
}

.portal-section {
    display: none;
    opacity: 0;
    min-height: 100vh;
    width: 100vw;
    background: var(--primary-bg);
}

.active-portal {
    display: block !important;
    z-index: 100;
}
"""

with open(css_path, 'r', encoding='utf-8') as f:
    orig_css = f.read()
if "CENTRAL HUB & PORTAL NAVIGATION" not in orig_css:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write(css_append)

# 5. Append JS
js_append = """
// ─────────────────────────────────────────────────────────────
// CENTRAL HUB (PORTAL NAVIGATION & NEURAL CORE)
// ─────────────────────────────────────────────────────────────
let coreScene, coreCamera, coreRenderer, coreParticles;

function initNeuralCore() {
    const container = document.getElementById('core-canvas-container');
    if (!container) return;

    coreScene = new THREE.Scene();
    coreCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    coreCamera.position.z = 8;

    coreRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    coreRenderer.setSize(window.innerWidth, window.innerHeight);
    coreRenderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(coreRenderer.domElement);

    const geometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    
    const radius = 2.5;
    for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        positions[i*3] = x;
        positions[i*3+1] = y;
        positions[i*3+2] = z;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        color: 0xbc13fe, // Magenta core
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    coreParticles = new THREE.Points(geometry, material);
    coreScene.add(coreParticles);

    function animate() {
        requestAnimationFrame(animate);
        coreParticles.rotation.y += 0.003;
        coreParticles.rotation.x += 0.001;
        coreRenderer.render(coreScene, coreCamera);
    }
    animate();

    window.addEventListener('mousemove', (e) => {
        if(document.getElementById('hub-container') && document.getElementById('hub-container').style.display !== 'none') {
            const rx = (e.clientX / window.innerWidth) * 2 - 1;
            const ry = -(e.clientY / window.innerHeight) * 2 + 1;
            gsap.to(coreParticles.rotation, {
                x: ry * 0.5,
                y: rx * 0.5,
                duration: 2,
                ease: "power2.out",
                overwrite: "auto"
            });
        }
    });

    window.addEventListener('resize', () => {
        if (!coreCamera || !coreRenderer) return;
        coreCamera.aspect = window.innerWidth / window.innerHeight;
        coreCamera.updateProjectionMatrix();
        coreRenderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function playWhooshSound() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const bufferSize = ctx.sampleRate * 1.5;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.Q.value = 1;
        
        filter.frequency.setValueAtTime(100, ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(3000, ctx.currentTime + 0.3);
        filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 1.0);
        
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.3);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        noise.start();
        noise.stop(ctx.currentTime + 1.5);
    } catch (e) {
        console.log("Audio synthesis failed", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Portals click logic
    document.querySelectorAll(".portal").forEach(portal => {
        portal.addEventListener("click", () => {
            const targetId = portal.getAttribute("data-target");
            
            const glitchText = document.getElementById("hub-glitch-text");
            glitchText.innerHTML = `ACCESSING ${targetId.toUpperCase()} NODE...`;
            gsap.fromTo(glitchText, {opacity: 0, scale: 0.9}, {opacity: 1, scale: 1, duration: 0.2, yoyo: true, repeat: 3});
            
            playWhooshSound();

            if (coreParticles) {
                gsap.to(coreParticles.scale, {
                    x: 6, y: 6, z: 6,
                    duration: 1.2,
                    ease: "power2.in"
                });
            }

            // Animate hub out
            gsap.to("#hub-container", {
                scale: 1.3,
                opacity: 0,
                duration: 0.9,
                delay: 0.3,
                onComplete: () => {
                    document.getElementById("hub-container").style.display = "none";
                }
            });

            // Show selected section
            setTimeout(() => {
                const section = document.getElementById(targetId);
                if(section) {
                    section.classList.add('active-portal');
                    section.style.opacity = 0; // Force start opacity
                    window.scrollTo(0,0);
                    
                    gsap.fromTo(section, {
                        opacity: 0,
                        scale: 0.95,
                        y: 30
                    }, {
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        duration: 1,
                        ease: "power2.out"
                    });
                }
            }, 1200);
        });
    });

    // Back button logic
    document.querySelectorAll(".back-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const activeSection = btn.closest('.portal-section');
            if(!activeSection) return;

            playWhooshSound();
            
            gsap.to(activeSection, {
                opacity: 0,
                scale: 0.95,
                y: -30,
                duration: 0.6,
                onComplete: () => {
                    activeSection.classList.remove('active-portal');
                    
                    document.getElementById("hub-container").style.display = "flex";
                    
                    if(coreParticles) {
                        gsap.to(coreParticles.scale, {x: 1, y: 1, z: 1, duration: 1.5, ease: "power2.out"});
                    }
                    
                    gsap.fromTo("#hub-container", {
                        opacity: 0,
                        scale: 1.3
                    }, {
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        ease: "power2.out"
                    });
                }
            });
        });
    });
});

if (document.getElementById('core-canvas-container')) {
    initNeuralCore();
}
"""

with open(js_path, 'r', encoding='utf-8') as f:
    orig_js = f.read()
if "initNeuralCore" not in orig_js:
    with open(js_path, 'a', encoding='utf-8') as f:
        f.write(js_append)

print("SUCCESS: Refactored navigation into portals")
