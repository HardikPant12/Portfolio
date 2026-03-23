import os

css_path = 'style.css'
js_path = 'script.js'

css_append = """
/* ====================================================
   PHYSICS-BASED CURSOR SHOCKWAVE
   ==================================================== */
.cursor-shockwave {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 999999;
  transform: translate(-50%, -50%);
  /* Creates a beautiful glass refractive lens */
  background: radial-gradient(circle, rgba(0, 243, 255, 0.02) 20%, rgba(188, 19, 254, 0.08) 60%, transparent 80%);
  border: 2px solid cyan;
  box-shadow: 0 0 15px rgba(0, 243, 255, 0.4), inset 0 0 20px rgba(188, 19, 254, 0.3);
  /* The Secret Sauce: Blurs and aggressively rotates the colors beneath the expanding ring */
  backdrop-filter: blur(6px) hue-rotate(90deg) contrast(150%);
  -webkit-backdrop-filter: blur(6px) hue-rotate(90deg) contrast(150%);
  width: 120px;
  height: 120px;
}
"""

with open(css_path, 'r', encoding='utf-8') as f:
    orig_css = f.read()
if "PHYSICS-BASED CURSOR SHOCKWAVE" not in orig_css:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write(css_append)

js_append = """
// ─────────────────────────────────────────────────────────────
// PHYSICS-BASED CURSOR SHOCKWAVE SYSTEM
// ─────────────────────────────────────────────────────────────
document.addEventListener('click', (e) => {
    // Prevent shockwave on the entry screen button clicking
    if (e.target.id === 'enter-btn' || e.target.closest('#entry-screen')) return;

    // Spawn the shockwave container perfectly at the cursor
    const wave = document.createElement('div');
    wave.classList.add('cursor-shockwave');
    wave.style.left = e.clientX + 'px';
    wave.style.top = e.clientY + 'px';
    document.body.appendChild(wave);
    
    // Scale it massively incredibly fast while fading and thinning the lens edge
    gsap.fromTo(wave, 
        { scale: 0, opacity: 1, borderWidth: "3px" },
        { 
            scale: 5 + Math.random() * 2, 
            opacity: 0, 
            borderWidth: "0px",
            duration: 0.7, 
            ease: "expo.out", 
            onComplete: () => wave.remove() 
        }
    );
});
"""

with open(js_path, 'r', encoding='utf-8') as f:
    orig_js = f.read()
if "PHYSICS-BASED CURSOR SHOCKWAVE" not in orig_js:
    with open(js_path, 'a', encoding='utf-8') as f:
        f.write(js_append)

print("SUCCESS: Added Cursor Shockwaves")
