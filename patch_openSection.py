import re

js_path = 'script.js'

with open(js_path, 'r', encoding='utf-8') as f:
    js = f.read()

new_openSection = """window.openSection = function(targetId) {
  let mappedTarget = targetId;
  const isHomeSubSection = (targetId === 'hero' || targetId === 'about' || targetId === 'ai-avatar' || targetId === 'home-view');
  if (isHomeSubSection) {
      mappedTarget = 'home-view';
  }

  // If already at mappedTarget, just handle scrolling natively!
  const targetContainer = document.getElementById(mappedTarget);
  if (targetContainer && targetContainer.style.display === 'block') {
      if (isHomeSubSection && targetId !== 'home-view' && targetId !== 'hero') {
          const subTarget = document.getElementById(targetId);
          if (subTarget) subTarget.scrollIntoView({ behavior: 'smooth' });
          return;
      }
      if (mappedTarget === 'home-view' && (targetId === 'home-view' || targetId === 'hero')) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
      }
  }

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

    if(targetContainer) {
        targetContainer.style.display = "block";
        
        if (isHomeSubSection && targetId !== 'home-view' && targetId !== 'hero') {
            const subTarget = document.getElementById(targetId);
            if(subTarget) {
                // Instantly align screen so the user emerges into the exact component
                subTarget.scrollIntoView({ behavior: 'instant' });
            } else {
                window.scrollTo(0,0);
            }
        } else {
            window.scrollTo(0, 0);
        }

        gsap.to(targetContainer, { opacity: 1, duration: 0.8 });
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
"""

pattern = r'window\.openSection\s*=\s*function\(targetId\)\s*\{[\s\S]*?\}, 500\);\s*};?'
if re.search(pattern, js):
    js = re.sub(pattern, new_openSection + "\n};", js)
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js)
    print("SUCCESS: REPLACED OPENSECTION")
else:
    print("FAILED TO FIND OPENSECTION")
