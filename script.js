document.addEventListener('DOMContentLoaded', () => {
    // ─────────────────────────────────────────────────────────────
    // GLOBAL BACKGROUND PARTICLES
    // ─────────────────────────────────────────────────────────────
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.color = Math.random() > 0.5 ? '#00f3ff' : '#bc13fe';
            this.opacity = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width)  this.x = 0;
            if (this.x < 0)             this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0)             this.y = canvas.height;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
        }
    }

    function initParticles() {
        for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        ctx.strokeStyle = '#00f3ff';
        ctx.lineWidth = 0.2;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.globalAlpha = (1 - dist / 150) * 0.2;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    initParticles();
    animateParticles();

    // ─────────────────────────────────────────────────────────────
    // HERO STARFIELD (hero-local canvas with parallax)
    // ─────────────────────────────────────────────────────────────
    const heroSection = document.getElementById('hero');
    const starCanvas  = document.getElementById('hero-starfield');
    const sCtx        = starCanvas ? starCanvas.getContext('2d') : null;
    let stars = [];

    function initStarfield() {
        if (!starCanvas || !sCtx) return;
        starCanvas.width  = heroSection.clientWidth;
        starCanvas.height = heroSection.clientHeight;
        stars = [];
        const count = 180;
        for (let i = 0; i < count; i++) {
            stars.push({
                x:          Math.random() * starCanvas.width,
                y:          Math.random() * starCanvas.height,
                r:          Math.random() * 1.5 + 0.3,
                speed:      Math.random() * 0.25 + 0.05,
                depth:      Math.random() * 2 + 0.5,
                twinkle:    Math.random() * Math.PI * 2,
                color:      Math.random() > 0.85 ? '#bc13fe' : '#00f3ff',
                baseOpacity:Math.random() * 0.5 + 0.2
            });
        }
    }

    let parallaxDX = 0, parallaxDY = 0;
    let targetDX = 0, targetDY = 0;

    function drawStarfield() {
        if (!starCanvas || !sCtx) return;
        sCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
        const time = performance.now() * 0.001;
        stars.forEach(s => {
            const px = s.x + parallaxDX * s.depth * 0.4;
            const py = s.y + parallaxDY * s.depth * 0.3;
            s.y -= s.speed;
            if (s.y < 0) {
                s.y = starCanvas.height;
                s.x = Math.random() * starCanvas.width;
            }
            s.twinkle += 0.02;
            const opacity = s.baseOpacity + Math.sin(s.twinkle + time) * 0.2;
            sCtx.beginPath();
            sCtx.arc(px, py, s.r, 0, Math.PI * 2);
            sCtx.fillStyle = s.color;
            sCtx.globalAlpha = Math.max(0, Math.min(1, opacity));
            sCtx.shadowBlur = 6;
            sCtx.shadowColor = s.color;
            sCtx.fill();
        });
        sCtx.shadowBlur = 0;
        sCtx.globalAlpha = 1;
    }

    function starfieldLoop() {
        parallaxDX += (targetDX - parallaxDX) * 0.06;
        parallaxDY += (targetDY - parallaxDY) * 0.06;
        drawStarfield();
        requestAnimationFrame(starfieldLoop);
    }

    initStarfield();
    starfieldLoop();
    window.addEventListener('resize', initStarfield);

    // ─────────────────────────────────────────────────────────────
    // HERO FRAME — clip-path ASSEMBLY on first mouseenter
    // ─────────────────────────────────────────────────────────────
    const heroFrame = document.getElementById('heroFrame');
    let assembled = false;

    if (heroSection && heroFrame) {
        heroSection.addEventListener('mouseenter', () => {
            if (!assembled) {
                assembled = true;
                setTimeout(() => heroFrame.classList.add('assembled'), 80);
            }
        });
        // Also assemble on load after a delay for page-load experience
        setTimeout(() => {
            if (!assembled) {
                assembled = true;
                heroFrame.classList.add('assembled');
            }
        }, 1500);
    }

    // ─────────────────────────────────────────────────────────────
    // HUD CORNERS — mouse tracking
    // ─────────────────────────────────────────────────────────────
    const hudCorners = {
        tl: document.getElementById('hudTL'),
        tr: document.getElementById('hudTR'),
        bl: document.getElementById('hudBL'),
        br: document.getElementById('hudBR'),
    };

    window.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 992) return;
        const rect = heroSection ? heroSection.getBoundingClientRect() : null;

        // Parallax target for starfield
        if (rect && e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top  && e.clientY <= rect.bottom) {
            targetDX = (e.clientX - rect.left - rect.width  / 2) / rect.width  * 30;
            targetDY = (e.clientY - rect.top  - rect.height / 2) / rect.height * 20;
        }

        // HUD corner tracking — each bracket nudges toward cursor
        const push = 8;
        if (hudCorners.tl) {
            const fx = (e.clientX / window.innerWidth  - 0.1) * push;
            const fy = (e.clientY / window.innerHeight - 0.15) * push;
            hudCorners.tl.style.transform = `translate(${fx}px, ${fy}px)`;
        }
        if (hudCorners.tr) {
            const fx = (e.clientX / window.innerWidth  - 0.9) * push;
            const fy = (e.clientY / window.innerHeight - 0.15) * push;
            hudCorners.tr.style.transform = `translate(${fx}px, ${fy}px)`;
        }
        if (hudCorners.bl) {
            const fx = (e.clientX / window.innerWidth  - 0.1) * push;
            const fy = (e.clientY / window.innerHeight - 0.85) * push;
            hudCorners.bl.style.transform = `translate(${fx}px, ${fy}px)`;
        }
        if (hudCorners.br) {
            const fx = (e.clientX / window.innerWidth  - 0.9) * push;
            const fy = (e.clientY / window.innerHeight - 0.85) * push;
            hudCorners.br.style.transform = `translate(${fx}px, ${fy}px)`;
        }

        // Hero content subtle 3D tilt
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            const x = (window.innerWidth  / 2 - e.pageX) / 60;
            const y = (window.innerHeight / 2 - e.pageY) / 60;
            heroContent.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg)`;
        }
    });

    // ─────────────────────────────────────────────────────────────
    // HUD READOUTS
    // ─────────────────────────────────────────────────────────────
    const readoutTR = document.getElementById('readoutTR');
    const readoutTL = document.getElementById('readoutTL');
    const readoutBR = document.getElementById('readoutBR');

    function rndHex(bytes) {
        let s = '';
        for (let i = 0; i < bytes; i++) s += Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase() + ' ';
        return s.trim();
    }

    // Top-right: scrolling hex packets
    if (readoutTR) {
        let hexLines = [];
        for (let i = 0; i < 5; i++) hexLines.push(rndHex(4));
        readoutTR.innerHTML = hexLines.map(l => `<div>${l}</div>`).join('');
        setInterval(() => {
            hexLines.shift();
            hexLines.push(rndHex(4));
            readoutTR.innerHTML = hexLines.map(l => `<div>${l}</div>`).join('');
        }, 200);
    }

    // Top-left: GPS-style coordinates
    if (readoutTL) {
        let lat = 30.7333, lon = 76.7794;
        function updateCoords() {
            lat += (Math.random() - 0.5) * 0.0002;
            lon += (Math.random() - 0.5) * 0.0002;
            readoutTL.innerHTML =
                `<div>LAT ${lat.toFixed(4)}&deg;N</div>` +
                `<div>LON ${lon.toFixed(4)}&deg;E</div>` +
                `<div>ALT 387m</div>` +
                `<div>SIG&nbsp;OK</div>`;
        }
        updateCoords();
        setInterval(updateCoords, 800);
    }

    // Bottom-right: system status
    if (readoutBR) {
        const statuses = ['NOMINAL', 'ONLINE', 'READY', 'ACTIVE'];
        function updateStatus() {
            readoutBR.innerHTML =
                `<div>SYS ${statuses[Math.floor(Math.random() * statuses.length)]}</div>` +
                `<div>MEM ${(Math.random() * 20 + 60).toFixed(1)}%</div>` +
                `<div>NET &#8593;${(Math.random() * 5).toFixed(1)}MB/s</div>` +
                `<div>UP ${Math.floor(performance.now()/1000)}s</div>`;
        }
        updateStatus();
        setInterval(updateStatus, 1200);
    }

    // ─────────────────────────────────────────────────────────────
    // CPU PROGRESS BARS (bottom-left)
    // ─────────────────────────────────────────────────────────────
    const cpuBarsEl = document.getElementById('cpuBars');
    const cpuChannels = ['CPU', 'GPU', 'RAM', 'SSD'];

    if (cpuBarsEl) {
        cpuBarsEl.innerHTML = cpuChannels.map(ch => `
            <div class="cpu-bar-row">
                <span class="cpu-bar-label">${ch}</span>
                <div class="cpu-bar-track">
                    <div class="cpu-bar-fill" id="bar-${ch}" style="width:${(Math.random()*50+20).toFixed(0)}%"></div>
                </div>
            </div>
        `).join('');

        setInterval(() => {
            cpuChannels.forEach(ch => {
                const bar = document.getElementById(`bar-${ch}`);
                if (bar) bar.style.width = `${(Math.random() * 60 + 20).toFixed(0)}%`;
            });
        }, 900);
    }

    // ─────────────────────────────────────────────────────────────
    // TAGLINE — typewriter animation
    // ─────────────────────────────────────────────────────────────
    const taglineEl = document.getElementById('taglineText');
    const taglineFull = 'SYSTEM ONLINE // PORTFOLIO_INIT_v1.0';

    if (taglineEl) {
        let i = 0;
        function typeTagline() {
            if (i <= taglineFull.length) {
                taglineEl.textContent = taglineFull.slice(0, i);
                i++;
                setTimeout(typeTagline, 55);
            }
        }
        setTimeout(typeTagline, 600);
    }

    // ─────────────────────────────────────────────────────────────
    // TEXT SCRAMBLE — hero title subtitle cycling
    // ─────────────────────────────────────────────────────────────
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }
        setText(newText) {
            const oldText = this.el.innerText;
            const length  = Math.max(oldText.length, newText.length);
            const promise = new Promise(resolve => this.resolve = resolve);
            this.queue = [];
            for (let i = 0; i < length; i++) {
                const from  = oldText[i] || '';
                const to    = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end   = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }
            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }
        update() {
            let output = '', complete = 0;
            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];
                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span style="opacity:0.5;font-family:'Courier New',monospace">${char}</span>`;
                } else {
                    output += from;
                }
            }
            this.el.innerHTML = output;
            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }
        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    const heroTitleEl = document.getElementById('heroTitle');
    if (heroTitleEl) {
        const phrases = [
            'FUTURE-READY DEVELOPER',
            'AI & ML ENTHUSIAST',
            'STRATEGIC PROBLEM SOLVER'
        ];
        const fx = new TextScramble(heroTitleEl);
        let counter = 0;
        const next = () => {
            fx.setText(phrases[counter]).then(() => setTimeout(next, 3000));
            counter = (counter + 1) % phrases.length;
        };
        next();
    }

    // ─────────────────────────────────────────────────────────────
    // SCROLL REVEAL
    // ─────────────────────────────────────────────────────────────
    const reveals = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.1 });
    reveals.forEach(reveal => revealObserver.observe(reveal));

    // ─────────────────────────────────────────────────────────────
    // DOSSIER LIVE TERMINAL (Cinematic Boot sequence)
    // ─────────────────────────────────────────────────────────────
    const terminalBody = document.getElementById('dtBody');
    const terminalContainer = document.getElementById('dossierTerminal');
    let terminalTriggered = false;

    const terminalLines = [
        { text: "> INIT SYS_CORE...", type: "" },
        { text: "PROFILE VERIFIED", type: "dt-success" },
        { text: "AI MODULE ACTIVE // v9.2", type: "dt-success" },
        { text: "> SCANNING ARCHIVES...", type: "" },
        { text: "JOURNEY INDEXED", type: "dt-success" },
        { text: "PROJECTS LOADED", type: "dt-success" },
        { text: "> ESTABLISHING UPLINK...", type: "" },
        { text: "SIGNAL LOCKED", type: "dt-success" },
        { text: "NEURAL LINK STABLE", type: "dt-success" },
        { text: "> AWAITING COMMAND_INPUT_", type: "dt-warn" }
    ];

    const typeTerminal = async () => {
        if(terminalTriggered || !terminalBody) return;
        terminalTriggered = true;
        
        for(let i = 0; i < terminalLines.length; i++) {
            const lineData = terminalLines[i];
            const div = document.createElement('div');
            div.className = `dt-line ${lineData.type}`;
            terminalBody.appendChild(div);
            
            // Typewriter effect per line
            let charIndex = 0;
            await new Promise(resolve => {
                const typeChar = () => {
                    if(charIndex < lineData.text.length) {
                        div.innerHTML += lineData.text.charAt(charIndex);
                        charIndex++;
                        setTimeout(typeChar, 15 + Math.random() * 25);
                    } else {
                        setTimeout(resolve, 150 + Math.random() * 200);
                    }
                };
                typeChar();
            });
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    };

    if(terminalContainer) {
        const terminalObserver = new IntersectionObserver((entries) => {
            if(entries[0].isIntersecting) {
                setTimeout(typeTerminal, 500); // 500ms delay to let the fade-in happen first
            }
        }, { threshold: 0.4 });
        terminalObserver.observe(terminalContainer);
    }
    
    // ─────────────────────────────────────────────────────────────
    // NAVBAR SCROLL + ACTIVE LINK
    // ─────────────────────────────────────────────────────────────
    const navbar   = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');

        let current = '';
        sections.forEach(section => {
            if (pageYOffset >= (section.offsetTop - 200)) current = section.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) link.classList.add('active');
        });
    });

    // ─────────────────────────────────────────────────────────────
    // SMOOTH SCROLL
    // ─────────────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ─────────────────────────────────────────────────────────────
    // CONTACT FORM MOCKUP
    // ─────────────────────────────────────────────────────────────
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;
            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;
            setTimeout(() => {
                btn.innerHTML = 'Transmission Complete! <i class="fas fa-check"></i>';
                btn.style.borderColor = '#00ff00';
                btn.style.color = '#00ff00';
                contactForm.reset();
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.style.borderColor = '';
                    btn.style.color = '';
                    btn.disabled = false;
                }, 3000);
            }, 1500);
    });
    }

    // ─────────────────────────────────────────────────────────────
    // ABOUT ME — CYBERNETIC DOSSIER JS
    // ─────────────────────────────────────────────────────────────

    // ── Binary Code Canvas (visible on section mousemove) ──
    const binaryCanvas  = document.getElementById('binary-canvas');
    const aboutSection  = document.getElementById('about');
    const bCtx          = binaryCanvas ? binaryCanvas.getContext('2d') : null;
    const binaryChars   = '01アイウエオカキクケコ{}[]<>/\\;:=+*#@!%&';
    let binaryColumns   = [];
    let binaryAnimFrame = null;
    let binaryVisible   = false;

    function initBinaryCanvas() {
        if (!binaryCanvas || !bCtx || !aboutSection) return;
        binaryCanvas.width  = aboutSection.clientWidth;
        binaryCanvas.height = aboutSection.clientHeight;
        const cols = Math.floor(binaryCanvas.width / 14);
        binaryColumns = Array.from({ length: cols }, () => Math.random() * binaryCanvas.height);
    }

    function drawBinary() {
        if (!bCtx || !binaryCanvas) return;
        bCtx.fillStyle = 'rgba(5, 5, 5, 0.08)';
        bCtx.fillRect(0, 0, binaryCanvas.width, binaryCanvas.height);
        bCtx.font = '12px "Courier New", monospace';
        binaryColumns.forEach((y, i) => {
            const char = binaryChars[Math.floor(Math.random() * binaryChars.length)];
            bCtx.fillStyle = i % 7 === 0 ? 'rgba(255,0,255,0.25)' : 'rgba(0,243,255,0.18)';
            bCtx.fillText(char, i * 14, y);
            binaryColumns[i] = y > binaryCanvas.height + Math.random() * 1000 ? 0 : y + 14;
        });
        binaryAnimFrame = requestAnimationFrame(drawBinary);
    }

    if (aboutSection && binaryCanvas) {
        initBinaryCanvas();
        window.addEventListener('resize', initBinaryCanvas);
        aboutSection.addEventListener('mouseenter', () => {
            if (!binaryVisible) {
                binaryVisible = true;
                binaryCanvas.classList.add('visible');
                drawBinary();
            }
        });
        aboutSection.addEventListener('mouseleave', () => {
            binaryVisible = false;
            binaryCanvas.classList.remove('visible');
            if (binaryAnimFrame) { cancelAnimationFrame(binaryAnimFrame); binaryAnimFrame = null; }
        });
    }

    // ── Decrypt Text Animation (scroll-triggered) ──
    const decryptEls  = document.querySelectorAll('.decrypt-text');
    const dChars      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>{}[]';
    const decryptedSet = new WeakSet();

    function decryptReveal(el) {
        if (decryptedSet.has(el)) return;
        decryptedSet.add(el);
        const finalHTML = el.innerHTML;
        const plainText = el.textContent.trim();
        let frame = 0;
        const totalFrames = 38;
        function step() {
            if (frame >= totalFrames) { el.innerHTML = finalHTML; return; }
            const progress = frame / totalFrames;
            let output = '';
            for (let i = 0; i < plainText.length; i++) {
                if (plainText[i] === ' ') {
                    output += ' ';
                } else if (i / plainText.length < progress) {
                    output += plainText[i];
                } else {
                    output += `<span style="color:rgba(0,243,255,0.45)">${dChars[Math.floor(Math.random() * dChars.length)]}</span>`;
                }
            }
            el.innerHTML = output;
            frame++;
            requestAnimationFrame(step);
        }
        el.innerHTML = '';
        setTimeout(step, 120);
    }

    const decryptObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                setTimeout(() => decryptReveal(entry.target), 250);
            }
        });
    }, { threshold: 0.2 });
    decryptEls.forEach(el => decryptObserver.observe(el));

    // ── HUD Bars live update ──
    const aboutCPU     = document.getElementById('cpuFill');
    const aboutRAM     = document.getElementById('ramFill');
    const aboutNET     = document.getElementById('netFill');
    const sysStatusEl  = document.getElementById('sysStatus');
    const hudCoordsEl  = document.getElementById('hudCoords');
    const dossCoordsEl = document.getElementById('dossierCoords');
    const sysStats     = ['ONLINE', 'ACTIVE', 'NOMINAL', 'READY'];

    setInterval(() => {
        if (aboutCPU) aboutCPU.style.width = `${(Math.random()*50+30).toFixed(0)}%`;
        if (aboutRAM) aboutRAM.style.width = `${(Math.random()*40+35).toFixed(0)}%`;
        if (aboutNET) aboutNET.style.width = `${(Math.random()*30+60).toFixed(0)}%`;
        if (sysStatusEl) sysStatusEl.textContent = sysStats[Math.floor(Math.random()*sysStats.length)];
    }, 1100);

    setInterval(() => {
        const lat = (30.7333 + (Math.random()-0.5)*0.002).toFixed(4);
        const lon = (76.7794 + (Math.random()-0.5)*0.002).toFixed(4);
        if (hudCoordsEl)  hudCoordsEl.textContent  = `[${lat}, ${lon}]`;
        if (dossCoordsEl) dossCoordsEl.textContent = `[${lat}\u00b0N, ${lon}\u00b0E]`;
    }, 1500);

    // ─────────────────────────────────────────────────────────────
    // AVATAR TALK LOGIC + SKILL POPUP
    // ─────────────────────────────────────────────────────────────
    const holoAvatar     = document.getElementById('holoAvatar');
    const avatarMouth    = document.getElementById('avatarMouth');
    const avatarDatastream = document.getElementById('avatarDatastream');
    const adsBody        = document.getElementById('adsBody');

    // Skill-specific data profiles
    const skillProfiles = {
        'B.Tech': [
            '[ Skill Profile: B.Tech ]',
            '> Degree: CSE @ LPU',
            '> Status: In Progress. CGPA 8.14',
            '> Analysis: Foundation OPTIMAL.'
        ],
        'Python': [
            '[ Skill Profile: Python ]',
            '> Lang Level: Proficiency HIGH',
            '> Modules: NumPy, Pandas, TF',
            '> Analysis: Core tool. READY.'
        ],
        'Machine Learning': [
            '[ Skill Profile: Machine_Learning ]',
            '> Domain: AI/ML Engineering',
            '> Models: Regression, CNN, RF',
            '> Analysis: Proficiency HIGH.'
        ],
        'Data Analysis': [
            '[ Skill Profile: Data_Analysis ]',
            '> Tools: Pandas, Matplotlib',
            '> Status: Active deployment.',
            '> Analysis: Pipeline ONLINE.'
        ],
        'Django': [
            '[ Skill Profile: Django ]',
            '> Framework: Python Web Stack',
            '> Status: Proficiency HIGH.',
            '> Analysis: MVP ready. GO.'
        ]
    };

    let talkTimeout = null;
    let popupTypeTimeout = null;

    // Start talking animation on avatar
    function startTalking(durationMs) {
        if (!avatarMouth) return;
        avatarMouth.classList.add('talking');
        clearTimeout(talkTimeout);
        talkTimeout = setTimeout(() => avatarMouth.classList.remove('talking'), durationMs);
    }

    // Type lines into the popup one by one
    function typeIntoPopup(lines, charDelayMs = 28, lineDelayMs = 320) {
        if (!adsBody) return;
        adsBody.innerHTML = '';
        let lineIndex = 0;
        let charIndex = 0;
        let currentLineEl = null;

        function nextChar() {
            if (lineIndex >= lines.length) return;
            if (charIndex === 0) {
                currentLineEl = document.createElement('div');
                adsBody.appendChild(currentLineEl);
            }
            const line = lines[lineIndex];
            if (charIndex < line.length) {
                currentLineEl.textContent += line[charIndex];
                charIndex++;
                popupTypeTimeout = setTimeout(nextChar, charDelayMs);
            } else {
                lineIndex++;
                charIndex = 0;
                if (lineIndex < lines.length) {
                    popupTypeTimeout = setTimeout(nextChar, lineDelayMs);
                }
            }
        }
        nextChar();
    }

    // Show the data-stream popup for a given skill
    function showSkillPopup(skill) {
        if (!avatarDatastream || !adsBody) return;
        clearTimeout(popupTypeTimeout);
        adsBody.innerHTML = '';
        avatarDatastream.classList.add('visible');
        const lines = skillProfiles[skill] || [`[ Skill Profile: ${skill} ]`, '> Status: Proficiency HIGH.', '> Analysis: COMPLETE.'];
        typeIntoPopup(lines);
        // Avatar talks for the duration of typing
        const talkDur = lines.join('').length * 30 + 500;
        startTalking(talkDur);
    }

    // Hide popup + stop talking
    function hideSkillPopup() {
        if (avatarDatastream) avatarDatastream.classList.remove('visible');
        clearTimeout(popupTypeTimeout);
        clearTimeout(talkTimeout);
        if (avatarMouth) avatarMouth.classList.remove('talking');
    }

    // Attach hover events to all keyword spans (including those re-injected by decrypt)
    function attachKeywordHovers() {
        document.querySelectorAll('.glitch-keyword[data-skill]').forEach(kw => {
            if (kw._avatarBound) return; // don't double-bind
            kw._avatarBound = true;
            kw.addEventListener('mouseenter', () => showSkillPopup(kw.dataset.skill));
            kw.addEventListener('mouseleave', () => hideSkillPopup());
        });
    }

    // Attach immediately + re-attach after decrypt animations finish
    attachKeywordHovers();
    setTimeout(attachKeywordHovers, 2000);
    setTimeout(attachKeywordHovers, 5000);

    // ── Random Idle: look around ──
    const lookDirections = ['look-left', 'look-right'];
    function randomLookAround() {
        if (!holoAvatar) return;
        const dir = lookDirections[Math.floor(Math.random() * 2)];
        holoAvatar.classList.remove('look-left', 'look-right');
        void holoAvatar.offsetWidth; // reflow to restart animation
        holoAvatar.classList.add(dir);
        setTimeout(() => holoAvatar.classList.remove(dir), 2100);
    }

    // Look around every 4–8 seconds
    function scheduleLookAround() {
        const delay = 4000 + Math.random() * 4000;
        setTimeout(() => {
            randomLookAround();
            scheduleLookAround();
        }, delay);
    }
    scheduleLookAround();

    // ── Random Idle: spontaneous talking (2–3 sec bursts) ──
    function scheduleIdleTalk() {
        const delay = 6000 + Math.random() * 8000;
        setTimeout(() => {
            // Only talk idly when popup is NOT shown
            if (avatarDatastream && !avatarDatastream.classList.contains('visible')) {
                const dur = 2000 + Math.random() * 1000;
                startTalking(dur);
            }
            scheduleIdleTalk();
        }, delay);
    }
    scheduleIdleTalk();

    // ═══════════════════════════════════════════════════════
    // AI AVATAR ASSISTANT — CORE JS
    // ═══════════════════════════════════════════════════════
    const avSVG         = document.getElementById('avatarSVG');
    const avArm         = document.getElementById('svgWaveArm');
    const avLidL        = document.getElementById('avLidL');
    const avLidR        = document.getElementById('avLidR');
    const avMouthOpen   = document.getElementById('avMouthOpen');
    const avSoundwave   = document.getElementById('avSoundwave');
    const avDialogue    = document.getElementById('avDialogueText');
    const avLog         = document.getElementById('avLog');
    const btnAvTalk     = document.getElementById('btnAvTalk');
    const btnAvInit     = document.getElementById('btnAvInit');
    const btnMuteAv     = document.getElementById('btnMuteAv');
    const muteIcon      = document.getElementById('muteIcon');
    const arpVLBtns     = document.querySelectorAll('.arp-vl-btn');
    const avHoloWrap    = document.getElementById('avHoloWrap');
    const avCoords2     = document.getElementById('avHudCoords2');

    let avMuted       = false;
    let avSpeaking    = false;
    let avBlinkTimer  = null;
    let avMouthTimer  = null;

    // Voice lines
    const avGreeting = "Hello. I'm Hardik. Welcome to my portfolio.";

    // ── Speech Synthesis ──
    function avSpeak(text, onEnd) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.rate  = 0.88;
        utt.pitch = 0.85;
        utt.volume= avMuted ? 0 : 1;

        // Pick a slightly deeper English voice
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find(v => /Google|Microsoft|Alex|Daniel/i.test(v.name) && /en/i.test(v.lang));
        if (preferred) utt.voice = preferred;

        utt.onstart = () => {
            avSpeaking = true;
            avSoundwave && avSoundwave.classList.add('active');
            avSVG && avSVG.classList.add('av-speaking');
            startAvMouth();
            logAvLine(text, 'av');
        };
        utt.onend = utt.onerror = () => {
            avSpeaking = false;
            avSoundwave && avSoundwave.classList.remove('active');
            avSVG && avSVG.classList.remove('av-speaking');
            stopAvMouth();
            if (typeof onEnd === 'function') onEnd();
        };
        window.speechSynthesis.speak(utt);
    }

    // ── Typewriter dialogue display ──
    let avTypeTimer = null;
    function avTypeText(text) {
        if (!avDialogue) return;
        avDialogue.textContent = '';
        clearTimeout(avTypeTimer);
        let i = 0;
        function tick() {
            if (i >= text.length) return;
            avDialogue.textContent += text[i++];
            avTypeTimer = setTimeout(tick, 26);
        }
        tick();
    }

    // Log a line in the terminal
    function logAvLine(text, cls='sys') {
        if (!avLog) return;
        const el = document.createElement('div');
        el.className = `arp-line ${cls}`;
        const prefix = cls === 'av' ? '[HARDIK] ' : cls === 'usr' ? '[USR] ' : '[SYS] ';
        el.textContent = prefix + text;
        avLog.appendChild(el);
        avLog.scrollTop = avLog.scrollHeight;
    }

    // ── Avatar wave arm ──
    function avWave(times = 1) {
        if (!avArm) return;
        let count = 0;
        function doWave() {
            avArm.classList.remove('waving');
            void avArm.offsetWidth; // reflow
            avArm.classList.add('waving');
            avArm.addEventListener('animationend', () => {
                avArm.classList.remove('waving');
                count++;
                if (count < times) setTimeout(doWave, 300);
            }, { once: true });
        }
        doWave();
    }

    // ── Eyelid blink (JS direct style manipulation for SVG compatibility) ──
    function avBlink() {
        if (!avLidL || !avLidR) return;
        // Close lids
        avLidL.style.transform = 'scaleY(1)';
        avLidR.style.transform = 'scaleY(1)';
        setTimeout(() => {
            // Open lids
            avLidL.style.transform = 'scaleY(0)';
            avLidR.style.transform = 'scaleY(0)';
        }, 120);
    }

    function scheduleAvBlink() {
        const delay = 2500 + Math.random() * 4000;
        avBlinkTimer = setTimeout(() => {
            avBlink();
            // Double blink occasionally
            if (Math.random() < 0.25) setTimeout(avBlink, 250);
            scheduleAvBlink();
        }, delay);
    }
    scheduleAvBlink();

    // ── Mouth open/close during speech ──
    function startAvMouth() {
        if (!avMouthOpen) return;
        clearInterval(avMouthTimer);
        avMouthTimer = setInterval(() => {
            const ry = Math.random() < 0.5 ? (2 + Math.random() * 7).toFixed(1) : '0';
            avMouthOpen.setAttribute('ry', ry);
        }, 130);
    }
    function stopAvMouth() {
        clearInterval(avMouthTimer);
        if (avMouthOpen) avMouthOpen.setAttribute('ry', '0');
    }

    // ── Initial greeting on load ──
    function avGreet() {
        avWave(2);
        avTypeText(avGreeting);
        logAvLine('Speech module activated', 'sys');
        setTimeout(() => avSpeak(avGreeting), 800);
    }

    // Slight delay to let voices load
    setTimeout(() => {
        if (window.speechSynthesis) {
            // Ensure voices are loaded
            if (window.speechSynthesis.getVoices().length === 0) {
                window.speechSynthesis.onvoiceschanged = avGreet;
            } else {
                avGreet();
            }
        } else {
            // No speech support — still wave and type
            avWave(2);
            avTypeText(avGreeting);
        }
    }, 1200);

    // ── Talk to Me button ──
    if (btnAvTalk) {
        btnAvTalk.addEventListener('click', () => {
            if (avSpeaking) { window.speechSynthesis?.cancel(); return; }
            avWave(1);
            avTypeText(avGreeting);
            avSpeak(avGreeting);
            logAvLine('Replay requested by user', 'usr');
        });
    }

    // ── Initialize Profile button ──
    if (btnAvInit) {
        btnAvInit.addEventListener('click', () => {
            const initText = 'Initializing profile. Scanning identity matrix... Access granted. Neural interface online. Welcome, Hardik.';
            avWave(1);
            avTypeText(initText);
            avSpeak(initText);
            logAvLine('Profile initialization triggered', 'usr');
        });
    }

    // ── Quick phrase buttons ──
    arpVLBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const line = btn.dataset.line;
            if (!line) return;
            avTypeText(line);
            avSpeak(line);
            logAvLine('Quick phrase: ' + btn.textContent.trim(), 'usr');
        });
    });

    // ── Mute toggle ──
    if (btnMuteAv) {
        btnMuteAv.addEventListener('click', () => {
            avMuted = !avMuted;
            if (muteIcon) {
                muteIcon.className = avMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
            }
            if (avMuted) {
                window.speechSynthesis?.cancel();
                logAvLine('Voice output muted', 'sys');
            } else {
                logAvLine('Voice output enabled', 'sys');
            }
        });
    }

    // ── Hover glow intensify ──
    if (avHoloWrap) {
        avHoloWrap.addEventListener('click', () => {
            if (!avSpeaking) {
                avWave(1);
                avTypeText(avGreeting);
                avSpeak(avGreeting);
            }
        });
    }

    // ── Flickering coord for avatar panel ──
    setInterval(() => {
        if (avCoords2) {
            const lat = (30.7333 + (Math.random()-0.5)*0.002).toFixed(4);
            const lon = (76.7794 + (Math.random()-0.5)*0.002).toFixed(4);
            avCoords2.textContent = `[${lat}°N, ${lon}°E]`;
        }
    }, 2000);

    // ═══════════════════════════════════════════════════════
    // ROBOTIC DOG CURSOR COMPANION LOGIC
    // ═══════════════════════════════════════════════════════
    const roboDog = document.getElementById('roboDog');
    if (roboDog && window.innerWidth > 768) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let dogX = mouseX;
        let dogY = mouseY;
        let isMoving = false;
        let moveTimer = null;

        // Make the dog visible after a short initial delay
        setTimeout(() => roboDog.classList.add('visible'), 1500);

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            if (!isMoving) {
                isMoving = true;
                roboDog.classList.add('moving');
            }
            
            clearTimeout(moveTimer);
            moveTimer = setTimeout(() => {
                isMoving = false;
                roboDog.classList.remove('moving');
            }, 100);
        });

        // Loop for smooth linear interpolation (lerp)
        function animateDog() {
            const dx = mouseX - dogX;
            const dy = mouseY - dogY;
            
            // Lerp factor
            dogX += dx * 0.08;
            dogY += dy * 0.08;
            
            // Flip the SVG based on direction
            // Note: because the SVG faces right, we flip when moving left
            let scaleX = dx < 0 ? -1 : 1;
            
            // Optional: slight rotation based on horizontal speed
            let rot = dx * 0.1;
            if (rot > 15) rot = 15;
            if (rot < -15) rot = -15;

            // Apply transform. The dog follows slightly below and to the right of the actual cursor
            roboDog.style.transform = `translate3d(${dogX + 15}px, ${dogY + 15}px, 0) scaleX(${scaleX}) rotate(${rot}deg)`;
            
            requestAnimationFrame(animateDog);
        }
        animateDog();

        // ── Interaction: Hover over interactive UI elements ──
        const interactives = document.querySelectorAll('a, button, .c-tilt, .holo-id-card, .card, .glitch-keyword, .contact-card, .btn');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', () => roboDog.classList.add('alert'));
            el.addEventListener('mouseleave', () => roboDog.classList.remove('alert'));
        });
    }

    // ═══════════════════════════════════════════════════════
    // 3D GLASSMORPHISM TILT EFFECT (.c-tilt)
    // ═══════════════════════════════════════════════════════
    const tiltCards = document.querySelectorAll('.c-tilt');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate rotation degrees (max 8 degrees tilt)
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // ═══════════════════════════════════════════════════════
    // CINEMATIC BACKGROUND PARALLAX
    // ═══════════════════════════════════════════════════════
    const cyberLayers = document.querySelectorAll('.cyber-layer');
    if (cyberLayers.length > 0) {
        window.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const moveX = e.clientX - centerX;
            const moveY = e.clientY - centerY;

            cyberLayers.forEach(layer => {
                const speed = layer.getAttribute('data-speed') || 0;
                // use transform for smooth hardware-accelerated movement
                layer.style.transform = `translate3d(${moveX * speed}px, ${moveY * speed}px, 0)`;
            });
        });
    }
    // ═══════════════════════════════════════════════════════
    // PROJECT GATEWAY PORTAL INTERACTION
    // ═══════════════════════════════════════════════════════
    const portals = document.querySelectorAll('.project-gateway');
    
    portals.forEach(portal => {
        const overlayText = portal.querySelector('.pg-status-text');
        const enterBtn = portal.querySelector('.pg-enter-btn');
        let hoverTimer = null;
        let isTyping = false;

        portal.addEventListener('mouseenter', () => {
            if(!overlayText || isTyping) return;
            const targetText = overlayText.getAttribute('data-type') || "INITIALIZING PROJECT GATEWAY...";
            overlayText.innerHTML = "";
            isTyping = true;
            
            clearTimeout(hoverTimer);
            let charIndex = 0;
            
            const typeNext = () => {
                if(charIndex < targetText.length && isTyping) {
                    overlayText.innerHTML += targetText.charAt(charIndex);
                    charIndex++;
                    hoverTimer = setTimeout(typeNext, 20 + Math.random() * 20);
                }
            };
            hoverTimer = setTimeout(typeNext, 150);
        });
        
        portal.addEventListener('mouseleave', () => {
            isTyping = false;
            clearTimeout(hoverTimer);
            if(overlayText) overlayText.innerHTML = "";
        });

        // Cinematic Click Transition
        if(enterBtn) {
            enterBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Audio cue optional (if available) - we'll just run visually for now
                const flash = document.createElement('div');
                flash.style.position = 'fixed';
                flash.style.top = '0'; flash.style.left = '0';
                flash.style.width = '100vw'; flash.style.height = '100vh';
                flash.style.background = 'var(--neon-blue)';
                flash.style.zIndex = '9999';
                flash.style.opacity = '0';
                flash.style.pointerEvents = 'none';
                flash.style.transition = 'opacity 0.1s ease';
                flash.style.mixBlendMode = 'screen';
                document.body.appendChild(flash);
                
                document.body.style.transition = 'transform 0.5s cubic-bezier(0.8, 0, 0.2, 1), filter 0.5s ease';
                document.body.style.transform = 'scale(1.5)';
                document.body.style.filter = 'blur(10px) brightness(1.5)';
                
                requestAnimationFrame(() => {
                    flash.style.opacity = '0.8';
                });
                
                setTimeout(() => {
                    document.body.style.transform = '';
                    document.body.style.filter = '';
                    flash.style.opacity = '0';
                    setTimeout(() => flash.remove(), 200);
                    // simulate navigation
                    // window.location.href = '#'; 
                }, 500);
            });
        }
    });

});



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

// Interactive Projects Click Handler
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => {
            const link = card.getAttribute("data-link");
            if (link) window.open(link, "_blank");
        });
    });
});

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

// ─────────────────────────────────────────────────────────────
// MINIMAL PORTAL SYSTEM
// ─────────────────────────────────────────────────────────────
window.openSection = function(targetId) {
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

};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(".project-card").forEach(card => {
        card.addEventListener("click", () => {
            const link = card.getAttribute("data-link");
            if (link) window.open(link, "_blank");
        });
    });
});

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
