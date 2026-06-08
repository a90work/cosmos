/* ==========================================================
   KOSMOS 3.0 - MAIN BOOTSTRAPPER (ENTRY POINT)
========================================================== */

// وارد کردن ماژول‌های پروژه
import { initUI } from './ui.js';
import { initKosmosEngine } from './kosmos-engine.js';
import { initNewsletter } from './newsletter.js';

/**
 * مدیریت ثبت Service Worker برای قابلیت PWA و کارکرد آفلاین
 * این بخش با فایل sw.js که قبلاً ساخته‌ایم در ارتباط است.
 */
async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            console.log('[PWA] ServiceWorker registered with scope:', registration.scope);
        } catch (error) {
            console.error('[PWA] ServiceWorker registration failed:', error);
        }
    }
}

/**
 * مدیریت پخش صوت محیطی (Ambient Sound)
 * به دلیل محدودیت‌های مرورگر، پخش صدا باید با اولین تعامل کاربر شروع شود.
 */
function initAudioSystem() {
    const audio = document.getElementById('space-ambient');
    const audioBtn = document.getElementById('toggle-audio');
    
    if (!audio || !audioBtn) return;

    audioBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            audioBtn.textContent = 'توقف موزیک فضا ⏸️';
            audioBtn.classList.add('playing');
        } else {
            audio.pause();
            audioBtn.textContent = 'پخش موزیک فضا 🎵';
            audioBtn.classList.remove('playing');
        }
    });
}

/**
 * تابع اصلی راه‌اندازی کل پروژه (App Initialization)
 */
async function bootstrapApp() {
    console.log('%c KOSMOS 3.0 Initializing... ', 'background: #020408; color: #00d4ff; font-weight: bold;');

    try {
        // ۱. راه‌اندازی هسته گرافیکی Three.js
        initKosmosEngine();

        // ۲. راه‌اندازی رابط کاربری (Cursor, Navbar, Theme, etc.)
        initUI();

        // ۳. فعال‌سازی سیستم خبرنامه
        initNewsletter();

        // ۴. فعال‌سازی سیستم صوتی
        initAudioSystem();

        // ۵. ثبت سرویس ورکر برای حالت آفلاین
        await registerServiceWorker();

        console.log('%c KOSMOS is Ready. Enjoy the Universe! ', 'color: #00ff88;');
    } catch (error) {
        console.error('Critical error during KOSMOS bootstrap:', error);
    }
}

// اجرای اپلیکیشن پس از بارگذاری کامل DOM
document.addEventListener('DOMContentLoaded', bootstrapApp);