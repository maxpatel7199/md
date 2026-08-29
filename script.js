// ==========================================================
// PERSONALIZATION CONFIG
// ==========================================================
const LOVE_CONFIG = {
    yourName: "Max",
    partnerName: "Dhruvi",

    // Configurable Start Date
    startDate: "2023-06-18T08:00:00", // Year-Month-DayTTime

    startingChapter: "12th Standard",
    currentChapter: "3rd Year College",
    location: "Gujarat, India",

    mainMessage: "You are one of the most beautiful parts of my story.",
    signature: "Forever & Always, Max ❤️",

    memories: [
        {
            title: "Our Start Day 🌟",
            desc: "18 June 2023 — The day our beautiful story began in Gujarat.",
            image: "assets/start.jpg",
            icon: "💖"
        },
        {
            title: "12th Standard Study Days 📚",
            desc: "Late nights studying chemistry but mostly thinking of you.",
            image: "assets/school.jpg",
            icon: "📚"
        },
        {
            title: "Stepping into College 🎓",
            desc: "School classrooms became college campuses. A new chapter.",
            image: "assets/college.jpg",
            icon: "🎓"
        },
        {
            title: "3rd Year Together ♾️",
            desc: "Still walking hand-in-hand, making everyday special.",
            image: "assets/forever.jpg",
            icon: "❤️"
        }
    ]
};

// ==========================================================
// AUDIO SYSTEM & SOUND SYNTHESIZER
// ==========================================================
class SoundController {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgMusic = null;
        this.musicBtn = null;
        this.isPlaying = false;
    }

    initAudio() {
        if (!this.bgMusic) {
            this.bgMusic = document.getElementById('bg-music');
            if (this.bgMusic) {
                // Attach error listener directly to catch resource load errors
                this.bgMusic.addEventListener('error', (e) => {
                    console.error("Audio playback error event triggered:", e);
                    if (this.musicBtn) this.musicBtn.innerText = "⚠️ Audio Error";
                    this.isPlaying = false;
                    showToast("Error: Romantic song (assets/romantic.mp3) failed to load!");
                }, true);
            }
        }
        if (!this.musicBtn) {
            this.musicBtn = document.getElementById('music-btn');
        }
    }

    initContext() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playTone(frequency = 440, type = 'sine', duration = 0.1, volume = 0.08) {
        if (this.isMuted) return;
        try {
            this.initContext();
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

            gain.gain.setValueAtTime(volume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {
            console.warn("Web Audio blocked/not supported:", e);
        }
    }

    playHeartbeatSound() {
        this.playTone(85, 'sine', 0.15, 0.15);
        setTimeout(() => {
            this.playTone(65, 'sine', 0.18, 0.15);
        }, 180);
    }

    toggleMusic() {
        this.initAudio();
        if (!this.bgMusic) {
            showToast("Missing #bg-music audio element!");
            return;
        }

        if (this.isPlaying) {
            this.bgMusic.pause();
            if (this.musicBtn) this.musicBtn.innerText = "🔇 Paused";
            this.isPlaying = false;
        } else {
            const playPromise = this.bgMusic.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    if (this.musicBtn) this.musicBtn.innerText = "🎵 Playing";
                    this.isPlaying = true;
                    // Dismiss the music instruction popup
                    const popup = document.getElementById('music-instruction-popup');
                    if (popup) {
                        popup.classList.add('fade-out');
                        setTimeout(() => popup.classList.add('hidden'), 500);
                    }
                    // Resume cinematic intro sequence
                    if (typeof musicClickedResolver === 'function') {
                        musicClickedResolver();
                        musicClickedResolver = null;
                    }
                }).catch((error) => {
                    console.error("Audio playback failed:", error);
                    if (this.musicBtn) this.musicBtn.innerText = "⚠️ Audio Error";
                    this.isPlaying = false;
                    showToast("Error: Romantic song (assets/romantic.mp3) could not be loaded!");
                });
            }
        }
    }
}

const AudioCtrl = new SoundController();

// ==========================================================
// STATE MANAGEMENT & GLOBAL HELPERS
// ==========================================================
let isIntroRunning = false;
let isLoveMeterRunning = false;
let isFinalSurpriseRunning = false;
let isLetterOpen = false;
let isEasterEggStormRunning = false;

// Global Toast Message System
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'glass';
    toast.style.position = 'fixed';
    toast.style.bottom = '20px';
    toast.style.right = '20px';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '30px';
    toast.style.zIndex = '1000';
    toast.style.color = 'var(--text-primary)';
    toast.style.border = '1px solid var(--accent)';
    toast.style.boxShadow = '0 0 15px var(--accent-glow)';
    toast.style.fontFamily = 'var(--font-sans)';
    toast.style.fontSize = '0.9rem';
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 50);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

// Dynamic configuration synchronization with DOM
function applyDynamicConfiguration() {
    const updateText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    const updateHTML = (id, html) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    };

    updateText('step-msg-1', `Hey ${LOVE_CONFIG.partnerName}... ❤️`);
    updateText('cinematic-names', `${LOVE_CONFIG.yourName} + ${LOVE_CONFIG.partnerName}`);

    const spelledContainer = document.getElementById('dhruvi-spelled-name');
    if (spelledContainer) {
        spelledContainer.innerHTML = '';
        const name = LOVE_CONFIG.partnerName.toUpperCase();
        for (let i = 0; i < name.length; i++) {
            const span = document.createElement('span');
            span.className = 'spell-letter';
            span.textContent = name[i];
            spelledContainer.appendChild(span);
        }
        const heartSpan = document.createElement('span');
        heartSpan.className = 'spell-letter-heart';
        heartSpan.textContent = '❤️';
        spelledContainer.appendChild(heartSpan);
    }

    updateText('heart-max', `${LOVE_CONFIG.yourName} ❤️`);
    updateText('heart-dhruvi', `${LOVE_CONFIG.partnerName} ❤️`);
    updateHTML('hearts-merged', `<h1>${LOVE_CONFIG.yourName.toUpperCase()} + ${LOVE_CONFIG.partnerName.toUpperCase()}</h1><div class="infinity-animation-wrap"><svg class="infinity-svg" viewBox="0 0 100 50" width="120" height="60"><path class="infinity-path" d="M30 25 C10 10, 10 40, 30 25 C50 10, 70 10, 70 25 C70 40, 50 40, 30 25 Z" fill="none" stroke-width="2"/><text class="infinity-heart-particle p1">❤️</text><text class="infinity-heart-particle p2">💖</text><text class="infinity-heart-particle p3">💕</text></svg></div>`);

    const partnerTitle = document.querySelector('.partner-name-title');
    if (partnerTitle) partnerTitle.textContent = `${LOVE_CONFIG.yourName} & ${LOVE_CONFIG.partnerName}`;

    const subtitleQuote = document.querySelector('.romantic-subtitle-quote');
    if (subtitleQuote) subtitleQuote.textContent = `"From ${LOVE_CONFIG.startingChapter} studying to walking our dream together."`;

    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length >= 4) {
        const badge2 = timelineItems[1].querySelector('.timeline-badge');
        if (badge2) badge2.textContent = LOVE_CONFIG.startingChapter;
        const title2 = timelineItems[1].querySelector('h3');
        if (title2) title2.textContent = `${LOVE_CONFIG.startingChapter} 📚❤️`;

        const badge4 = timelineItems[3].querySelector('.timeline-badge');
        if (badge4) badge4.textContent = LOVE_CONFIG.currentChapter.split(' ')[0] + ' ' + (LOVE_CONFIG.currentChapter.split(' ')[1] || '');
        const title4 = timelineItems[3].querySelector('h3');
        if (title4) title4.textContent = `${LOVE_CONFIG.currentChapter} ❤️`;
        const desc4 = timelineItems[3].querySelector('p');
        if (desc4) desc4.textContent = `And now I'm in my ${LOVE_CONFIG.currentChapter.toLowerCase()}, but when I look back, 18 June still feels special.`;
    }

    const msgCardHeader = document.querySelector('.msg-card-header');
    if (msgCardHeader) msgCardHeader.textContent = `${LOVE_CONFIG.partnerName} ❤️`;

    const reflectTitle = document.querySelector('.reflect-title');
    if (reflectTitle) reflectTitle.textContent = `${LOVE_CONFIG.partnerName} ❤️`;

    const bookCoverTitle = document.querySelector('.book-cover h3');
    if (bookCoverTitle) bookCoverTitle.textContent = `${LOVE_CONFIG.yourName} & ${LOVE_CONFIG.partnerName}`;

    const reflectionTextLines = document.querySelectorAll('.story-reveal-line');
    if (reflectionTextLines.length >= 10) {
        reflectionTextLines[3].textContent = `From ${LOVE_CONFIG.startingChapter.toLowerCase()}...`;
        reflectionTextLines[7].textContent = `and now into my ${LOVE_CONFIG.currentChapter.toLowerCase()}...`;
    }

    const gujaratCredit = document.querySelector('.gujarat-credit');
    if (gujaratCredit) {
        const stateName = LOVE_CONFIG.location.split(',')[0].trim();
        gujaratCredit.textContent = `Made with all my heart, in ${stateName}, for ${LOVE_CONFIG.partnerName}. ❤️`;
    }

    updateText('eq-step-1', LOVE_CONFIG.yourName.toUpperCase());
    updateText('eq-step-3', LOVE_CONFIG.partnerName.toUpperCase());
    const eqForeverH2 = document.querySelector('#eq-forever-text h2');
    if (eqForeverH2) eqForeverH2.textContent = `${LOVE_CONFIG.yourName.toUpperCase()} + ${LOVE_CONFIG.partnerName.toUpperCase()} = FOREVER`;

    const letterPreviewText = document.querySelector('.letter-preview p');
    if (letterPreviewText) letterPreviewText.textContent = `${LOVE_CONFIG.partnerName}, there's something I want you to read... 💌`;

    const finalForeverHeading = document.querySelector('.forever-heading');
    if (finalForeverHeading) finalForeverHeading.textContent = `${LOVE_CONFIG.yourName} ❤️ ${LOVE_CONFIG.partnerName}`;
}

// Global debug logger for click events
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button, [role="button"], .glass-btn, .memory-card, .book, #interactive-main-heart, #interactive-envelope');
    if (btn) {
        let name = btn.id || btn.className || btn.tagName;
        if (btn.innerText) {
            name += ` ("${btn.innerText.trim().substring(0, 30)}")`;
        }
        console.log(`BUTTON CLICKED: ${name}`);
    }
});

// ==========================================================
// ADVANCED CANVAS BACKGROUND SYSTEM
// ==========================================================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let stars = [];
let shootingHearts = [];
let fireworkParticles = [];
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Handle window resizing
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initStars();
});

function initStars() {
    stars = [];
    const density = width < 768 ? 40 : 100;
    for (let i = 0; i < density; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2,
            twinkleSpeed: Math.random() * 0.015 + 0.005,
            phase: Math.random() * Math.PI
        });
    }
}

function createShootingHeart() {
    if (document.hidden) return;
    shootingHearts.push({
        x: -50,
        y: Math.random() * height * 0.6,
        vx: Math.random() * 3 + 2,
        vy: Math.random() * 1.5 + 0.5,
        size: Math.random() * 6 + 5,
        alpha: 1
    });
}
setInterval(createShootingHeart, 10000); // Trigger diagonal shooting hearts occasionally

function createHeartFirework(x, y) {
    const numPoints = 65;
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 2;
        const scale = width < 768 ? 8 : 14;
        // parametric heart equations
        const hx = scale * 16 * Math.pow(Math.sin(t), 3);
        const hy = -scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

        const speed = Math.random() * 0.15 + 0.85;
        fireworkParticles.push({
            x: x,
            y: y,
            vx: hx * 0.12 * speed,
            vy: hy * 0.12 * speed,
            size: Math.random() * 3 + 1.5,
            alpha: 1,
            color: `hsl(${Math.random() * 40 + 330}, 100%, ${Math.random() * 20 + 60}%)`,
            decay: Math.random() * 0.012 + 0.008
        });
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    // 1. Twinkling stars
    const starColor = getComputedStyle(document.body).getPropertyValue('--star-color').trim();
    ctx.fillStyle = starColor;
    stars.forEach(star => {
        star.phase += star.twinkleSpeed;
        ctx.globalAlpha = Math.abs(Math.sin(star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    // 2. Diagonal shooting hearts
    shootingHearts.forEach((sh, idx) => {
        sh.x += sh.vx;
        sh.y += sh.vy;
        sh.alpha -= 0.004;

        if (sh.alpha <= 0 || sh.x > width + 50 || sh.y > height + 50) {
            shootingHearts.splice(idx, 1);
            return;
        }

        ctx.globalAlpha = sh.alpha;
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
        ctx.beginPath();
        const x = sh.x, y = sh.y, s = sh.size;
        ctx.moveTo(x, y + s / 4);
        ctx.quadraticCurveTo(x, y, x - s / 2, y);
        ctx.quadraticCurveTo(x - s, y, x - s, y + s / 2);
        ctx.quadraticCurveTo(x - s, y + s, x, y + s * 1.4);
        ctx.quadraticCurveTo(x + s, y + s, x + s, y + s / 2);
        ctx.quadraticCurveTo(x + s, y, x + s / 2, y);
        ctx.quadraticCurveTo(x, y, x, y + s / 4);
        ctx.closePath();
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    // 3. Firework explosions
    fireworkParticles.forEach((fp, idx) => {
        fp.x += fp.vx;
        fp.y += fp.vy;
        fp.vy += 0.04; // gravity
        fp.alpha -= fp.decay;

        if (fp.alpha <= 0) {
            fireworkParticles.splice(idx, 1);
            return;
        }

        ctx.globalAlpha = fp.alpha;
        ctx.fillStyle = fp.color;
        ctx.beginPath();
        ctx.arc(fp.x, fp.y, fp.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.globalAlpha = 1;

    requestAnimationFrame(animateCanvas);
}

initStars();
animateCanvas();


// ==========================================================
// INTERACTION PARTICLE OVERLAYS
// ==========================================================
const particleOverlay = document.getElementById('particle-overlay');
let lastTrailTime = 0;

function spawnTrailParticle(x, y) {
    const now = Date.now();
    if (now - lastTrailTime < 60) return; // rate limit trail particles for performance
    lastTrailTime = now;

    const particle = document.createElement('div');
    particle.className = 'burst-particle';

    const isHeart = Math.random() > 0.4;
    const size = Math.random() * 0.8 + 0.3;

    if (isHeart) {
        particle.innerText = ['❤️', '💖', '💕', '✨'][Math.floor(Math.random() * 4)];
        particle.style.fontSize = `${size}rem`;
        particle.style.filter = 'drop-shadow(0 0 3px var(--accent))';
    } else {
        const px = Math.random() * 4 + 2;
        particle.style.width = `${px}px`;
        particle.style.height = `${px}px`;
        particle.style.borderRadius = '50%';
        particle.style.backgroundColor = '#fff';
        particle.style.boxShadow = '0 0 6px #fff';
    }

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    const tx = (Math.random() - 0.5) * 45;
    const ty = -Math.random() * 45 - 15;

    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--ty', `${ty}px`);

    particleOverlay.appendChild(particle);

    setTimeout(() => {
        if (particle.parentNode) particle.remove();
    }, 800);
}

// Sparkle / Heart Burst explosion
function createExplosion(x, y, count = 18) {
    const symbols = ['❤️', '💖', '💕', '💗', '✨'];
    for (let i = 0; i < count; i++) {
        const p = document.createElement('div');
        p.className = 'burst-particle';

        const isHeart = Math.random() > 0.4;
        if (isHeart) {
            p.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            p.style.fontSize = `${Math.random() * 1.1 + 0.5}rem`;
            p.style.filter = 'drop-shadow(0 0 4px var(--accent))';
        } else {
            const size = Math.random() * 6 + 2;
            p.style.width = `${size}px`;
            p.style.height = `${size}px`;
            p.style.backgroundColor = '#fff';
            p.style.borderRadius = '50%';
            p.style.boxShadow = '0 0 8px #fff';
        }

        p.style.left = `${x}px`;
        p.style.top = `${y}px`;

        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 110 + 60;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        p.style.setProperty('--tx', `${tx}px`);
        p.style.setProperty('--ty', `${ty}px`);

        particleOverlay.appendChild(p);
        setTimeout(() => { if (p.parentNode) p.remove(); }, 800);
    }
}

// Global click listeners
document.addEventListener('mousemove', (e) => {
    if (window.innerWidth >= 768) spawnTrailParticle(e.clientX, e.clientY);
});
document.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    spawnTrailParticle(touch.clientX, touch.clientY);
});
document.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button') || e.target.closest('.glass') || e.target.closest('.letter-modal-content') || e.target.closest('.book')) return;
    createExplosion(e.clientX, e.clientY);
});


// ==========================================================
// CINEMATIC SEQUENCE TIMELINE (INTRO STAGES)
// ==========================================================
const sleep = ms => new Promise(r => setTimeout(r, ms));

let musicClickedResolver = null;
const musicClickedPromise = new Promise(resolve => {
    musicClickedResolver = resolve;
});

async function runCinematicIntro() {
    const step1 = document.getElementById('step-msg-1');
    const step2 = document.getElementById('step-msg-2');
    const step3 = document.getElementById('step-msg-3');
    const popup = document.getElementById('music-instruction-popup');

    // Stage 1: Hey Dhruvi
    await sleep(800);
    if (step1) step1.classList.remove('hidden');
    await sleep(2200);
    if (step1) step1.style.opacity = 0;

    // Stage 2: Surprise Message
    await sleep(800);
    if (step1) step1.classList.add('hidden');
    if (step2) step2.classList.remove('hidden');
    await sleep(2200);
    if (step2) step2.style.opacity = 0;

    // Wait for visitor to turn on music before continuing the surprise
    await sleep(800);
    if (step2) step2.classList.add('hidden');
    
    // Display the instruction overlay pointing to the Music button
    if (popup) popup.classList.remove('hidden');

    // Wait until existing music button resolves this promise
    await musicClickedPromise;

    // Stage 3: Date Prompt & Remember button (surprise continues)
    await sleep(800);
    if (step3) {
        step3.style.opacity = 1;
        step3.classList.remove('hidden');
    }
}

// ==========================================================
// ACCURATE RELATIONSHIP LIVE TIMER (Years, Months, Days, Time-aware)
// ==========================================================
function getRelationshipTime(startDate) {
    const start = new Date(startDate);
    const now = new Date();

    let diffMs = now.getTime() - start.getTime();
    if (diffMs < 0) {
        return { years: 0, months: 0, days: 0, hours: 0, mins: 0, secs: 0 };
    }

    let temp = new Date(start.getTime());

    let years = now.getFullYear() - start.getFullYear();
    temp.setFullYear(temp.getFullYear() + years);
    if (temp > now) {
        years--;
        temp = new Date(start.getTime());
        temp.setFullYear(temp.getFullYear() + years);
    }

    let months = now.getMonth() - temp.getMonth();
    if (months < 0) months += 12;

    temp.setMonth(temp.getMonth() + months);
    if (temp > now) {
        months--;
        if (months < 0) {
            months += 12;
            years--;
        }
        temp = new Date(start.getTime());
        temp.setFullYear(temp.getFullYear() + years);
        temp.setMonth(temp.getMonth() + months);
    }

    let remainingMs = now.getTime() - temp.getTime();

    const oneSecond = 1000;
    const oneMinute = oneSecond * 60;
    const oneHour = oneMinute * 60;
    const oneDay = oneHour * 24;

    let days = Math.floor(remainingMs / oneDay);
    remainingMs %= oneDay;

    let hours = Math.floor(remainingMs / oneHour);
    remainingMs %= oneHour;

    let mins = Math.floor(remainingMs / oneMinute);
    remainingMs %= oneMinute;

    let secs = Math.floor(remainingMs / oneSecond);

    return { years, months, days, hours, mins, secs };
}

function updateCounterDisplay() {
    const { years, months, days, hours, mins, secs } = getRelationshipTime(LOVE_CONFIG.startDate);

    const yr = document.getElementById('years-count');
    const mo = document.getElementById('months-count');
    const dy = document.getElementById('days-count');
    const hr = document.getElementById('hours-count');
    const mn = document.getElementById('mins-count');
    const sc = document.getElementById('secs-count');

    if (yr) yr.innerText = years;
    if (mo) mo.innerText = months;
    if (dy) dy.innerText = days;
    if (hr) hr.innerText = hours;
    if (mn) mn.innerText = mins;
    if (sc) sc.innerText = secs;
}

// Performant intersection observer for scroll-triggered visual sequences
function initIntersectionObservers() {
    const scrollSnapContainer = document.getElementById('main-experience');
    if (!scrollSnapContainer) return;

    const observerOptions = {
        root: scrollSnapContainer,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sec = entry.target;

                // 1. Reveal Timeline steps sequentially
                if (sec.id === 'timeline-section') {
                    const steps = sec.querySelectorAll('.timeline-item');
                    steps.forEach((step, idx) => {
                        if (!step.classList.contains('show-step')) {
                            setTimeout(() => {
                                step.classList.add('show-step');
                            }, idx * 400);
                        }
                    });
                    observer.unobserve(sec);
                }

                // 2. Reveal Story message lines line-by-line
                if (sec.id === 'personal-msg-section') {
                    const lines = sec.querySelectorAll('.story-reveal-line');
                    lines.forEach((line, idx) => {
                        if (!line.classList.contains('show-line')) {
                            setTimeout(() => {
                                line.classList.add('show-line');
                            }, idx * 600);
                        }
                    });
                    observer.unobserve(sec);
                }

                // 3. College classroom reflection delays
                if (sec.id === 'college-life-section') {
                    const reflects = sec.querySelectorAll('.reflect-text, .reflect-title');
                    reflects.forEach((ref, idx) => {
                        if (!ref.classList.contains('show-reflect')) {
                            setTimeout(() => {
                                ref.classList.add('show-reflect');
                            }, idx * 500);
                        }
                    });
                    observer.unobserve(sec);
                }

                // 4. Equation solver
                if (sec.id === 'equation-section') {
                    const blocks = sec.querySelectorAll('.eq-block, .eq-operator, .eq-heart-result');
                    blocks.forEach((bl, idx) => {
                        if (!bl.classList.contains('eq-show')) {
                            setTimeout(() => {
                                bl.classList.add('eq-show');
                                if (idx === blocks.length - 1) {
                                    setTimeout(() => {
                                        const eqForever = document.getElementById('eq-forever-text');
                                        if (eqForever) eqForever.classList.remove('hidden');
                                    }, 500);
                                }
                            }, idx * 400);
                        }
                    });
                    observer.unobserve(sec);
                }
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('.scroll-section');
    sections.forEach(sec => {
        sectionObserver.observe(sec);
    });
}

// DOM content load flow execution
document.addEventListener('DOMContentLoaded', () => {
    // 1. Audit check for all critical elements on the page
    const elementsToAudit = [
        'begin-btn', 'theme-btn', 'music-btn', 'interactive-main-heart',
        'interactive-envelope', 'open-letter-btn', 'close-letter-btn',
        'fireworks-btn', 'final-surprise-btn', 'restart-experience-btn',
        'years-count', 'months-count', 'days-count', 'hours-count', 'mins-count', 'secs-count'
    ];
    elementsToAudit.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`Missing critical DOM element: #${id}`);
        }
    });

    // 2. Load theme preferences from local storage
    try {
        const savedTheme = localStorage.getItem('love-theme');
        if (savedTheme === 'theme-soft') {
            document.body.classList.replace('theme-midnight', 'theme-soft');
            const themeBtn = document.getElementById('theme-btn');
            if (themeBtn) themeBtn.innerText = "☀️ Soft Love";
        }
    } catch (e) { }

    // 3. Synchronize configurations dynamically
    applyDynamicConfiguration();

    // 4. Render memories cards dynamically
    const memoriesGrid = document.getElementById('memories-grid');
    if (memoriesGrid) {
        memoriesGrid.innerHTML = '';
        LOVE_CONFIG.memories.forEach(mem => {
            const card = document.createElement('div');
            card.className = 'memory-card glass';

            const img = new Image();
            img.src = mem.image;
            img.onload = () => {
                card.appendChild(img);
                img.className = 'card-photo';
            };
            img.onerror = () => {
                const fallback = document.createElement('div');
                fallback.className = 'card-placeholder-bg';
                card.appendChild(fallback);
            };

            card.innerHTML += `
                <div class="card-glare"></div>
                <div class="card-content">
                    <div class="card-icon">${mem.icon}</div>
                    <h3 class="card-title">${mem.title}</h3>
                    <p class="card-desc">${mem.desc}</p>
                </div>
            `;

            // Pointer events for mobile responsiveness (prevents stuck hover state)
            card.addEventListener('pointermove', (e) => {
                if (e.pointerType === 'touch') return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const rotX = -((y / rect.height) - 0.5) * 16;
                const rotY = ((x / rect.width) - 0.5) * 16;

                card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;

                const glare = card.querySelector('.card-glare');
                if (glare) glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.15) 0%, transparent 60%)`;
            });

            card.addEventListener('pointerleave', () => {
                card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
                const glare = card.querySelector('.card-glare');
                if (glare) glare.style.background = `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 60%)`;
            });

            card.addEventListener('click', (e) => {
                AudioCtrl.playTone(523.25, 'triangle', 0.2);
                createExplosion(e.clientX, e.clientY);
            });

            memoriesGrid.appendChild(card);
        });
    }

    // 5. Initialize intersection observers for scrolls
    initIntersectionObservers();

    // 6. Execute Cinematic Intro
    runCinematicIntro();

    // 7. Bind interactive main heart click listener
    const mainHt = document.getElementById('interactive-main-heart');
    if (mainHt) {
        mainHt.addEventListener('click', (e) => {
            AudioCtrl.playHeartbeatSound();
            createExplosion(e.clientX, e.clientY, 25);
            mainHt.classList.remove('heartbeat-active');
            void mainHt.offsetWidth; // trigger reflow
            mainHt.classList.add('heartbeat-active');
        });
    }

    // 8. Bind Escape keydown to close letter modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const letterModal = document.getElementById('letter-modal');
            if (letterModal && !letterModal.classList.contains('hidden')) {
                const closeBtn = document.getElementById('close-letter-btn');
                if (closeBtn) closeBtn.click();
            }
        }
    });

    // 9. Bind click outside modal to close
    const letterModal = document.getElementById('letter-modal');
    if (letterModal) {
        letterModal.addEventListener('click', (e) => {
            if (e.target === letterModal) {
                const closeBtn = document.getElementById('close-letter-btn');
                if (closeBtn) closeBtn.click();
            }
        });
    }
});

// Cinematic Intro button handler
const beginBtn = document.getElementById('begin-btn');
const oneDateOverlay = document.getElementById('one-date-cinematic');
const nameRevealOverlay = document.getElementById('name-reveal-cinematic');
const mainExperience = document.getElementById('main-experience');

if (beginBtn) {
    beginBtn.addEventListener('click', async () => {
        if (isIntroRunning) return;
        isIntroRunning = true;

        AudioCtrl.playTone(523.25, 'triangle', 0.3, 0.12);
        setTimeout(() => AudioCtrl.playTone(659.25, 'sine', 0.5, 0.12), 150);

        // 1. Fade out the date prompt screen
        const seqContainer = document.getElementById('intro-sequence-container');
        if (seqContainer) seqContainer.style.opacity = 0;
        await sleep(800);
        if (seqContainer) seqContainer.classList.add('hidden');

        // 2. Start One Date Cinematic (glowing core particle)
        if (oneDateOverlay) oneDateOverlay.classList.remove('hidden');
        const core = document.getElementById('cinematic-particle');
        await sleep(800);
        if (core) {
            core.style.transform = 'scale(15)';
            core.style.opacity = 0;
        }

        // Zoom in numbers
        await sleep(800);
        const num = document.getElementById('cinematic-number');
        if (num) {
            num.classList.remove('hidden');
            await sleep(50);
            num.classList.add('zoom-active');
        }
        AudioCtrl.playTone(329.63, 'sine', 0.4);
        await sleep(1200);
        if (num) num.style.opacity = 0;

        // Zoom in Month
        await sleep(600);
        const month = document.getElementById('cinematic-month');
        if (month) {
            month.classList.remove('hidden');
            await sleep(50);
            month.classList.add('zoom-active');
        }
        AudioCtrl.playTone(392, 'sine', 0.4);
        await sleep(1200);
        if (month) month.style.opacity = 0;

        // Zoom in Heart
        await sleep(600);
        const heart = document.getElementById('cinematic-heart');
        if (heart) {
            heart.classList.remove('hidden');
            await sleep(50);
            heart.classList.add('zoom-active');
        }
        AudioCtrl.playTone(523.25, 'sine', 0.6);
        await sleep(1200);
        if (heart) heart.style.opacity = 0;

        // Zoom in statements
        await sleep(600);
        const phr = document.getElementById('cinematic-phrase');
        if (phr) {
            phr.classList.remove('hidden');
            await sleep(50);
            phr.classList.add('zoom-active');
        }
        await sleep(1500);
        if (phr) phr.style.opacity = 0;

        const names = document.getElementById('cinematic-names');
        if (names) {
            names.classList.remove('hidden');
            await sleep(50);
            names.classList.add('zoom-active');
        }
        await sleep(1500);
        if (names) names.style.opacity = 0;

        const footer = document.getElementById('cinematic-footer');
        if (footer) {
            footer.classList.remove('hidden');
            await sleep(50);
            footer.classList.add('zoom-active');
        }
        await sleep(1800);

        // Fade out Date overlay
        if (oneDateOverlay) oneDateOverlay.style.opacity = 0;
        await sleep(1000);
        if (oneDateOverlay) oneDateOverlay.classList.add('hidden');

        // 3. Name Reveal & Heart Merge Cinematic
        if (nameRevealOverlay) nameRevealOverlay.classList.remove('hidden');
        await sleep(200);

        // Spell letters
        const letters = document.querySelectorAll('.spell-letter, .spell-letter-heart');
        for (let i = 0; i < letters.length; i++) {
            await sleep(350);
            letters[i].classList.add('spell-show');
            AudioCtrl.playTone(400 + i * 80, 'sine', 0.15);
        }
        await sleep(1000);

        // Heart merge process
        const hMax = document.getElementById('heart-max');
        const hDhruvi = document.getElementById('heart-dhruvi');
        const hMerged = document.getElementById('hearts-merged');

        if (hMax) hMax.style.transform = 'translateX(60px)';
        if (hDhruvi) hDhruvi.style.transform = 'translateX(-60px)';
        await sleep(2000);

        if (hMax) hMax.style.opacity = 0;
        if (hDhruvi) hDhruvi.style.opacity = 0;
        if (hMerged) hMerged.classList.remove('hidden');
        AudioCtrl.playTone(523.25, 'triangle', 0.5);
        createHeartFirework(window.innerWidth / 2, window.innerHeight * 0.45);
        await sleep(2500);

        // Exit Cinematic to Main Experience
        const introScr = document.getElementById('intro-screen');
        if (introScr) introScr.style.opacity = 0;
        await sleep(1000);
        if (introScr) introScr.classList.add('hidden');

        // Unveil Main experience
        if (mainExperience) mainExperience.classList.remove('hidden');
        document.body.style.overflowY = 'auto'; // allow scrolling

        // Start main beating heart
        const mainHt = document.getElementById('interactive-main-heart');
        if (mainHt) {
            mainHt.classList.add('heartbeat-active');
            const pulseGlow = document.querySelector('.heart-pulse-glow');
            if (pulseGlow) pulseGlow.classList.add('pulse-glow-active');
        }
        AudioCtrl.playHeartbeatSound();

        // Heartbeats recurring timer
        setInterval(() => {
            const finalOverlay = document.getElementById('final-surprise-overlay');
            if (!document.hidden && finalOverlay && finalOverlay.classList.contains('hidden')) {
                AudioCtrl.playHeartbeatSound();
            }
        }, 1800);
    });
}

// Initialize continuous relationship counter checks
setInterval(updateCounterDisplay, 1000);
updateCounterDisplay();



// ==========================================================
// GLOWING BOOK TURNING (Future Chapters)
// ==========================================================
const book = document.getElementById('glowing-book');
const bookPageContent = document.getElementById('book-page-content');

const BOOK_PAGES = [
    {
        title: "Chapter 1: The Beginning ❤️",
        text: "School days in 12th standard, where everyday life met a beautiful dream. June 18 marks the spark."
    },
    {
        title: "Chapter 2: Growing Together",
        text: "Classes changed, studies increased, but sharing laughs with you made every challenge completely disappear."
    },
    {
        title: "Chapter 3: School to College",
        text: "Stepping into university, new campuses, new friends. Yet, you remained my favorite anchor."
    },
    {
        title: "Chapter 4: 3rd Year",
        text: "And now in my 3rd year, still creating beautiful memories, and holding your hand through it all."
    },
    {
        title: "Chapter ∞: Whatever Comes Next...",
        text: "I hope I get to write it with you. Hand in hand, for all the chapters yet to unfold."
    }
];

let currentBookPageIndex = -1; // -1 represents closed cover

book.addEventListener('click', (e) => {
    e.stopPropagation();
    AudioCtrl.playTone(440, 'triangle', 0.2);

    currentBookPageIndex++;

    if (currentBookPageIndex >= BOOK_PAGES.length) {
        // Reset book
        book.classList.remove('open');
        currentBookPageIndex = -1;

        setTimeout(() => {
            bookPageContent.innerHTML = `
                <div class="page-inner-content">
                    <h4>The Cover</h4>
                    <p>Tap to open the book of our future plans and chapters.</p>
                </div>
            `;
        }, 500);
    } else {
        book.classList.add('open');

        // Flip page content with slight delay to mimic page turning
        bookPageContent.style.transform = "rotateY(-90deg)";

        setTimeout(() => {
            const pageData = BOOK_PAGES[currentBookPageIndex];
            bookPageContent.innerHTML = `
                <div class="page-inner-content">
                    <h4>${pageData.title}</h4>
                    <p>${pageData.text}</p>
                </div>
            `;
            bookPageContent.style.transform = "rotateY(0deg)";

            // Spawn tiny heart burst from book
            const rect = book.getBoundingClientRect();
            createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);
        }, 200);
    }
});


// ==========================================================
// CALCULATING LOVE METER
// ==========================================================
const loveMeterBtn = document.getElementById('love-meter-btn');
const meterBarContainer = document.getElementById('meter-bar-container');
const meterBarFill = document.getElementById('meter-bar-fill');
const meterPercentage = document.getElementById('meter-percentage');
const meterResult = document.getElementById('meter-result-text');

if (loveMeterBtn) {
    loveMeterBtn.addEventListener('click', () => {
        if (isLoveMeterRunning) return;
        isLoveMeterRunning = true;

        AudioCtrl.playTone(392, 'triangle', 0.2);
        loveMeterBtn.classList.add('hidden');
        if (meterBarContainer) meterBarContainer.classList.remove('hidden');
        if (meterResult) {
            meterResult.classList.remove('hidden');
            meterResult.innerText = "Calculating...";
        }

        let percent = 0;
        const interval = setInterval(() => {
            percent += Math.floor(Math.random() * 4) + 1;
            if (percent >= 100) {
                percent = 100;
                clearInterval(interval);

                AudioCtrl.playTone(880, 'sine', 0.5);
                createHeartFirework(window.innerWidth / 2, window.innerHeight * 0.4);

                setTimeout(() => {
                    if (meterResult) meterResult.innerText = "Calculation failed.\nLove is too big to calculate. ❤️\n\n∞";
                    if (meterBarContainer) {
                        const rect = meterBarContainer.getBoundingClientRect();
                        createExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
                    }
                }, 500);
            }
            if (meterBarFill) meterBarFill.style.width = `${percent}%`;
            if (meterPercentage) meterPercentage.innerText = `${percent}%`;

            if (percent % 10 === 0) {
                AudioCtrl.playTone(250 + percent * 5, 'sine', 0.05);
            }
        }, 45);
    });
}


// ==========================================================
// THE ENVELOPE & LOVE LETTER
// ==========================================================
const interactiveEnvelope = document.getElementById('interactive-envelope');
const openLetterBtn = document.getElementById('open-letter-btn');
const letterModal = document.getElementById('letter-modal');
const closeLetterBtn = document.getElementById('close-letter-btn');
const typewriterLetter = document.getElementById('typewriter-letter');

const LETTER_TEXT = `Dear ${LOVE_CONFIG.partnerName} ❤️,

Sometimes I think about how one ordinary day can become such an important part of your life.

For me, that day was 18 June.

I was starting ${LOVE_CONFIG.startingChapter.toLowerCase()}, and I had no idea that I was also starting one of the most beautiful chapters of my life.

Time has moved so quickly.
School became college.
College became ${LOVE_CONFIG.currentChapter.toLowerCase()}.
So many things have changed.

But when I think about the journey, one thing still feels incredibly special.

You.

Thank you for being part of my story.

And if life is a book, I don't want our story to end here.

I want more pages.
More memories.
More laughter.
More moments.
More us.

${LOVE_CONFIG.signature}`;

let letterTypingTimer = null;

function runTypewriter(text, index, container, callback) {
    if (index < text.length) {
        container.innerHTML = text.substring(0, index + 1) + '<span class="typed-cursor">|</span>';

        if (text[index] !== ' ' && index % 3 === 0) {
            AudioCtrl.playTone(850 + Math.random() * 250, 'sine', 0.03, 0.05);
        }

        letterTypingTimer = setTimeout(() => {
            runTypewriter(text, index + 1, container, callback);
        }, 30);
    } else {
        container.innerHTML = text;
        if (callback) callback();
    }
}

function openLetterFlow() {
    if (isLetterOpen) return;
    isLetterOpen = true;

    AudioCtrl.playTone(440, 'triangle', 0.3);
    if (interactiveEnvelope) interactiveEnvelope.classList.add('open');

    setTimeout(() => {
        if (letterModal) {
            letterModal.classList.remove('hidden');
            setTimeout(() => {
                letterModal.classList.add('show');
                if (typewriterLetter) {
                    typewriterLetter.innerHTML = "";
                    clearTimeout(letterTypingTimer);
                    runTypewriter(LETTER_TEXT, 0, typewriterLetter);
                }
            }, 100);
        }
    }, 600);
}

if (interactiveEnvelope) interactiveEnvelope.addEventListener('click', openLetterFlow);
if (openLetterBtn) openLetterBtn.addEventListener('click', openLetterFlow);

if (closeLetterBtn) {
    closeLetterBtn.addEventListener('click', () => {
        AudioCtrl.playTone(330, 'sine', 0.2);
        clearTimeout(letterTypingTimer);
        if (letterModal) letterModal.classList.remove('show');

        setTimeout(() => {
            if (letterModal) letterModal.classList.add('hidden');
            if (interactiveEnvelope) interactiveEnvelope.classList.remove('open');
            isLetterOpen = false;
        }, 500);
    });
}


// ==========================================================
// CELEBRATE FIREWORKS BUTTON
// ==========================================================
const celebrateBtn = document.getElementById('fireworks-btn');

celebrateBtn.addEventListener('click', () => {
    AudioCtrl.playTone(261.63, 'sine', 0.3);
    setTimeout(() => AudioCtrl.playTone(523.25, 'triangle', 0.3), 150);

    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const rx = Math.random() * (width - 200) + 100;
            const ry = Math.random() * (height * 0.5) + 100;
            createHeartFirework(rx, ry);
        }, i * 400);
    }
});


// ==========================================================
// SECRET EASTER EGG (HEART STORM)
// ==========================================================
const easterEggHeart = document.getElementById('hidden-easter-heart');
let easterEggCount = 0;

easterEggHeart.addEventListener('click', (e) => {
    e.stopPropagation();
    AudioCtrl.playTone(587.33, 'triangle', 0.15);
    createExplosion(e.clientX, e.clientY, 5);

    easterEggCount++;
    if (easterEggCount >= 5) {
        triggerEasterEggStorm();
        easterEggCount = 0;
    }
});

function triggerEasterEggStorm() {
    AudioCtrl.playTone(783.99, 'sine', 0.5, 0.15);

    // Spawn Storm Message
    const stormMsg = document.createElement('div');
    stormMsg.className = 'glass';
    stormMsg.style.position = 'fixed';
    stormMsg.style.top = '30%';
    stormMsg.style.left = '50%';
    stormMsg.style.transform = 'translate(-50%, -50%)';
    stormMsg.style.zIndex = '999';
    stormMsg.style.textAlign = 'center';
    stormMsg.innerHTML = `
        <h3 style="color: var(--accent); font-family: var(--font-serif); font-size: 1.8rem; margin-bottom: 10px;">SECRET MESSAGE UNLOCKED ❤️</h3>
        <p style="font-family: var(--font-cursive); font-size: 1.5rem; line-height: 1.4;">
            Dhruvi,<br>if you found this, you were supposed to. 😌❤️<br><br>
            Max loves you more than this website can possibly explain.
        </p>
    `;
    document.body.appendChild(stormMsg);

    setTimeout(() => {
        stormMsg.style.opacity = 0;
        setTimeout(() => stormMsg.remove(), 800);
    }, 5000);

    // Heart storm spawn (100 floating hearts)
    for (let i = 0; i < 90; i++) {
        setTimeout(() => {
            const h = document.createElement('div');
            h.className = 'floating-heart';
            h.innerText = ['❤️', '💖', '💕', '💓', '💗'][Math.floor(Math.random() * 5)];
            h.style.left = `${Math.random() * 100}%`;
            h.style.fontSize = `${Math.random() * 2.2 + 0.8}rem`;
            h.style.animationDuration = `${Math.random() * 4.5 + 2.5}s`;

            document.body.appendChild(h);
            setTimeout(() => h.remove(), 7000);
        }, i * 35);
    }
}


// ==========================================================
// CINEMATIC FINAL SURPRISE
// ==========================================================
const finalSurpriseBtn = document.getElementById('final-surprise-btn');
const finalOverlay = document.getElementById('final-surprise-overlay');
const yesBtn = document.getElementById('forever-yes');
const noBtn = document.getElementById('forever-no');
const finalForeverScreen = document.getElementById('final-forever-screen');
const restartBtn = document.getElementById('restart-experience-btn');

const FINAL_QUOTES = [
    "Dhruvi...",
    "There's something I want you to know.",
    "Maybe no one ever hurt you the way I did...",
    "...but no one will ever love you the way I do. ❤️",
    "Because I don't want to be just a chapter in your story.",
    "I want to be there for the chapters we haven't written yet.",
    `${LOVE_CONFIG.yourName} ❤️ ${LOVE_CONFIG.partnerName}`,
    "Forever & Always ♾️"
];

let finalTypingTimer = null;

// Promise helper to chain typewriter animations sequentially
function typeQuote(text, container, callback) {
    return new Promise((resolve) => {
        runTypewriter(text, 0, container, () => {
            if (callback) callback();
            resolve();
        });
    });
}

if (finalSurpriseBtn) {
    finalSurpriseBtn.addEventListener('click', async () => {
        if (isFinalSurpriseRunning) return;
        isFinalSurpriseRunning = true;

        AudioCtrl.playTone(523.25, 'triangle', 0.3);

        // Clear all paragraphs
        const ids = ['fq-1', 'fq-2', 'fq-3', 'fq-4', 'fq-5', 'fq-6', 'fq-7', 'fq-8', 'fq-9', 'fq-10'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = "";
        });

        const choiceBlock = document.getElementById('final-choice-block');
        if (choiceBlock) {
            choiceBlock.classList.add('hidden');
            choiceBlock.classList.remove('show');
        }

        // 1. Reveal overlay
        if (finalOverlay) {
            finalOverlay.classList.remove('hidden');
            setTimeout(() => finalOverlay.classList.add('show'), 50);
        }

        // 2. Play heartbeat sound
        setTimeout(() => AudioCtrl.playHeartbeatSound(), 1000);

        try {
            // Step 1: Dhruvi...
            await sleep(2000);
            await typeQuote(FINAL_QUOTES[0], document.getElementById('fq-1'));

            // Step 2: There's something...
            await sleep(1500);
            await typeQuote(FINAL_QUOTES[1], document.getElementById('fq-2'));

            // Step 3: Maybe no one...
            await sleep(1800);
            await typeQuote(FINAL_QUOTES[2], document.getElementById('fq-3'));

            // Step 4: ...but no one will ever love you... (trigger heart burst when ❤️ appears!)
            await sleep(2000);
            await typeQuote(FINAL_QUOTES[3], document.getElementById('fq-4'), () => {
                createExplosion(window.innerWidth / 2, window.innerHeight * 0.45, 25);
                AudioCtrl.playTone(650, 'sine', 0.4, 0.15);
            });

            // Step 5: Because I don't want to be...
            await sleep(2200);
            await typeQuote(FINAL_QUOTES[4], document.getElementById('fq-5'));

            // Step 6: I want to be there...
            await sleep(1800);
            await typeQuote(FINAL_QUOTES[5], document.getElementById('fq-6'));

            // Step 7: Max ❤️ Dhruvi (glowing title)
            await sleep(2000);
            await typeQuote(FINAL_QUOTES[6], document.getElementById('fq-9'));
            AudioCtrl.playTone(523.25, 'triangle', 0.25);

            // Step 8: Forever & Always ♾️
            await sleep(1500);
            await typeQuote(FINAL_QUOTES[7], document.getElementById('fq-10'));
            AudioCtrl.playTone(659.25, 'sine', 0.35);
            createHeartFirework(window.innerWidth / 2, window.innerHeight * 0.45);

            // Show interactive block
            await sleep(2000);
            if (choiceBlock) {
                choiceBlock.classList.remove('hidden');
                setTimeout(() => choiceBlock.classList.add('show'), 50);
            }
        } catch (e) {
            console.error("Error in final surprise typewriter execution:", e);
        }
    });
}

// Final choice click triggers massive fireworks
function triggerMassiveFinalBurst(e) {
    AudioCtrl.playTone(880, 'sine', 0.6);
    createExplosion(e.clientX, e.clientY, 40);

    createHeartFirework(window.innerWidth / 3, window.innerHeight / 2);
    createHeartFirework(window.innerWidth * 2 / 3, window.innerHeight / 2);

    setTimeout(() => {
        if (finalForeverScreen) {
            finalForeverScreen.classList.remove('hidden');
            setTimeout(() => finalForeverScreen.classList.add('show'), 50);
        }
    }, 600);
}

if (yesBtn) yesBtn.addEventListener('click', triggerMassiveFinalBurst);
if (noBtn) noBtn.addEventListener('click', triggerMassiveFinalBurst);

// Restart story resets all dynamic state flags
if (restartBtn) {
    restartBtn.addEventListener('click', () => {
        AudioCtrl.playTone(330, 'sine', 0.2);

        if (finalForeverScreen) finalForeverScreen.classList.remove('show');
        if (finalOverlay) finalOverlay.classList.remove('show');

        setTimeout(() => {
            if (finalForeverScreen) finalForeverScreen.classList.add('hidden');
            if (finalOverlay) finalOverlay.classList.add('hidden');

            // Reset state flags
            isLoveMeterRunning = false;
            isFinalSurpriseRunning = false;
            isLetterOpen = false;
            isIntroRunning = false;

            // Reset meter elements
            if (loveMeterBtn) loveMeterBtn.classList.remove('hidden');
            if (meterBarContainer) meterBarContainer.classList.add('hidden');
            if (meterResult) {
                meterResult.classList.add('hidden');
                meterResult.innerText = "";
            }
            if (meterBarFill) meterBarFill.style.width = "0%";

            // Reset book
            const bookEl = document.getElementById('glowing-book');
            const pageContent = document.getElementById('book-page-content');
            if (bookEl) bookEl.classList.remove('open');
            currentBookPageIndex = -1;
            if (pageContent) {
                pageContent.innerHTML = `
                    <div class="page-inner-content">
                        <h4>The Cover</h4>
                        <p>Tap to open the book of our future plans and chapters.</p>
                    </div>
                `;
            }

            // Scroll back to top
            const snapContainer = document.getElementById('main-experience');
            if (snapContainer) snapContainer.scrollTop = 0;
        }, 600);
    });
}

// ==========================================================
// UTILITIES: THEME TOGGLE & PERSISTENT CONTROLS
// ==========================================================
const themeBtn = document.getElementById('theme-btn');
if (themeBtn) {
    themeBtn.addEventListener('click', () => {
        AudioCtrl.playTone(587.33, 'triangle', 0.15);
        if (document.body.classList.contains('theme-midnight')) {
            document.body.classList.replace('theme-midnight', 'theme-soft');
            themeBtn.innerText = "☀️ Soft Love";
            try { localStorage.setItem('love-theme', 'theme-soft'); } catch (e) { }
        } else {
            document.body.classList.replace('theme-soft', 'theme-midnight');
            themeBtn.innerText = "🌙 Midnight Love";
            try { localStorage.setItem('love-theme', 'theme-midnight'); } catch (e) { }
        }
    });
}

const musicBtn = document.getElementById('music-btn');
if (musicBtn) {
    musicBtn.addEventListener('click', () => {
        AudioCtrl.playTone(523.25, 'triangle', 0.15);
        AudioCtrl.toggleMusic();
    });
}

