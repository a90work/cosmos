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

/* ==========================================\
   MODIFIED CURSOR & HOVER EFFECTS
========================================== */
export function addCursorHoverEffects() {
    // انتخاب تمام دکمه‌ها، لینک‌ها و اینپوت‌ها شامل دکمه‌هایی که داینامیک اضافه شده‌اند
    const hoverTargets = document.querySelectorAll('a, button, input, [role="button"], #back-to-top');
    const ring = document.getElementById('cursor-ring');
    
    if (!ring) return;

    hoverTargets.forEach(target => {
        // حذف رویدادهای قبلی برای جلوگیری از تکرار مجدد روی المان‌های ثابت
        target.removeEventListener('mouseenter', handleMouseEnter);
        target.removeEventListener('mouseleave', handleMouseLeave);

        target.addEventListener('mouseenter', handleMouseEnter);
        target.addEventListener('mouseleave', handleMouseLeave);
    });
}

function handleMouseEnter() {
    const ring = document.getElementById('cursor-ring');
    if (ring) ring.classList.add('cursor-hover');
}

function handleMouseLeave() {
    const ring = document.getElementById('cursor-ring');
    if (ring) ring.classList.remove('cursor-hover');
}

/* ==========================================\
   FIXED LOADER REMOVAL (WITH TRANSITION HARMONY)
========================================== */
export function removeLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    // اضافه کردن کلاس انیمیشن خروج از CSS
    loader.classList.add('loader-hide');
    
    // حذف فیزیکی از DOM دقیقاً پس از اتمام زمان ترنزیشن CSS (0.8 ثانیه)
    setTimeout(() => {
        loader.remove();
    }, 800);
}

/* ==========================================\
   BOOTSTRAP ALL UI FUNCTIONS
========================================== */
export function initUI() {
    initTheme();
    initNavbar();
    initProgressBar();
    initCursor();
    createBackToTop(); // ابتدا دکمه ساخته می‌شود
    initActiveLinks();
    initKeyboardUX();
    disableHeavyEffects();
    
    // اعمال افکت کرسر پس از ساخته شدن تمام المان‌ها (حتی المان‌های داینامیک)
    addCursorHoverEffects();
    
    // تابع حذف خودکار لودر از اینجا پاک شد تا توسط تابع اصلی (main.js) پس از لود Three.js مدیریت شود.
}