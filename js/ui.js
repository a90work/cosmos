/* ==========================================================
   KOSMOS UI & FRONTIER MANAGER - COMPLETE CODE
========================================================== */

const STORAGE_KEY = 'kosmos-theme';

/* ==========================================
   THEME MANAGER
========================================== */
export function initTheme() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === 'light') {
        document.body.classList.add('light');
        button.textContent = '☀️';
    }

    button.addEventListener('click', () => {
        document.body.classList.toggle('light');
        const isLight = document.body.classList.contains('light');

        localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark');
        button.textContent = isLight ? '☀️' : '🌙';
    });
}

/* ==========================================
   NAVBAR BACKGROUND SCROLL EFFECT
========================================== */
export function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const updateNavbar = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };

    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });
}

/* ==========================================
   SCROLL PROGRESS BAR
========================================== */
export function initProgressBar() {
    const progress = document.getElementById('scroll-progress');
    if (!progress) return;

    const update = () => {
        const scrollTop = window.scrollY;
        const height = document.documentElement.scrollHeight - window.innerHeight;
        const percentage = height > 0 ? (scrollTop / height) * 100 : 0;
        progress.style.width = percentage + '%';
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
}

/* ==========================================
   PERFORMANCE CUSTOM CURSOR (GPU ACCELERATED)
========================================== */
export function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) {
        return;
    }

    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');

    if (!cursor || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // استفاده از translate3d به جای left/top برای عملکرد ۶۰ فریم بر ثانیه بدون لگ
        cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    function animateRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;

        requestAnimationFrame(animateRing);
    }

    animateRing();
    addCursorHoverEffects();
}

function addCursorHoverEffects() {
    const targets = document.querySelectorAll('a, button, .card, input, textarea');
    const ring = document.getElementById('cursor-ring');

    if (!ring) return;

    targets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            ring.classList.remove('cursor-hover');
        });
    });
}

/* ==========================================
   SMOOTH LOADER REMOVAL
========================================== */
export function removeLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    loader.classList.add('loader-hide');
    setTimeout(() => {
        loader.remove();
    }, 900);
}

/* ==========================================
   SMOOTH SCROLL TO ELEMENT
========================================== */
export function scrollToElement(selector) {
    const element = document.querySelector(selector);
    if (!element) return;

    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

/* ==========================================
   BACK TO TOP BUTTON CREATION
========================================== */
export function createBackToTop() {
    const button = document.createElement('button');
    button.id = 'back-to-top';
    button.innerHTML = '↑';
    button.setAttribute('aria-label', 'بازگشت به بالا');
    document.body.appendChild(button);

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const update = () => {
        if (window.scrollY > 600) {
            button.classList.add('visible');
        } else {
            button.classList.remove('visible');
        }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
}

/* ==========================================
   DYNAMIC ACTIVE NAV LINK OBSERVER
========================================== */
export function initActiveLinks() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            });
        },
        { threshold: 0.4 }
    );

    sections.forEach(section => {
        observer.observe(section);
    });
}

/* ==========================================
   KEYBOARD UX & ACCESSIBILITY
========================================== */
export function initKeyboardUX() {
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            document.activeElement?.blur();
        }
    });
}

/* ==========================================
   OS REDUCED MOTION ACCESSIBILITY
========================================== */
export function disableHeavyEffects() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const applyMotionSettings = () => {
        if (reduce.matches) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
    };

    applyMotionSettings();
    reduce.addEventListener('change', applyMotionSettings);
}

/* ==========================================
   BOOTSTRAP ALL UI FUNCTIONS
========================================== */
export function initUI() {
    initTheme();
    initNavbar();
    initProgressBar();
    initCursor();
    createBackToTop();
    initActiveLinks();
    initKeyboardUX();
    disableHeavyEffects();
    
    // اجرای خودکار حذف لودر پس از لود کامل تمام عناصر فرانت‌اند
    removeLoader();
}