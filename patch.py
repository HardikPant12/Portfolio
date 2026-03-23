import os

js_path = 'script.js'

js_append = """
// ─────────────────────────────────────────────────────────────
// PRE-ENTRY LOADING ENTRY SCREEN LOGIC (PATCH)
// ─────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
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
});
"""

with open(js_path, 'a', encoding='utf-8') as f:
    f.write(js_append)

print("SUCCESS PATCH")
