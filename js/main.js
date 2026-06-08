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
            // استفاده از './sw.js' به جای '/sw.js' برای هماهنگی با گیت‌هاب
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
/**
 * تابع اصلی راه‌اندازی کل پروژه (App Initialization)
 */
async function bootstrapApp() {
    console.log('%c KOSMOS 3.0 Initializing... ', 'background: #020408; color: #00d4ff; font-weight: bold;');

    try {
        // ۱. راه‌اندازی هسته گرافیکی Three.js
        initKosmosEngine();

        // ۲. راه‌اندازی رابط کاربری
        initUI();

        // ۳. فعال‌سازی سیستم خبرنامه و صوت
        initNewsletter();
        initAudioSystem();

        // ۴. ثبت سرویس ورکر
        await registerServiceWorker();

        // ۵. حذف لودر صفحه دقیقاً پس از اینکه مطمئن شدیم تمام کامپوننت‌ها رندر شده‌اند
        // به این ترتیب کاربر پرش تصویری یا صفحه سفید نخواهد دید.
        import('./ui.js').then(uiModule => {
            uiModule.removeLoader();
        });

        console.log('%c KOSMOS 3.0 Ready! ', 'background: #00d4ff; color: #020408; font-weight: bold;');
    } catch (error) {
        console.error('Critical error during bootstrap:', error);
        // در صورت بروز خطای شدید، لودر حذف می‌شود تا سایت کاملاً قفل نشود
        import('./ui.js').then(uiModule => uiModule.removeLoader());
    }
}

// اجرای اپلیکیشن پس از بارگذاری کامل DOM
document.addEventListener('DOMContentLoaded', bootstrapApp);