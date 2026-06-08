/* ==========================================================
   KOSMOS MAIN BOOTSTRAP - VERSION 3.0 (PRO)
========================================================== */

import { initKosmosEngine } from './kosmos-engine.js';
import { initUI } from './ui.js';
import { initNewsletter } from './newsletter.js';

const App = {
    initialized: false
};

document.addEventListener('DOMContentLoaded', bootstrap);

async function bootstrap() {
    if (App.initialized) return;
    App.initialized = true;

    console.log(
        '%cKOSMOS 3.0 - CINEMATIC ENGINE ACTIVE',
        'color:#00d4ff;font-size:16px;font-weight:bold;background:#020408;padding:8px;'
    );

    try {
        // اجرای موتور ۳بعدی فضا
        initKosmosEngine();

        // اجرای سیستم یکپارچه رابط کاربری و فرانت‌اند
        initUI();
        
        // اجرای ماژول خبرنامه
        initNewsletter();

        // فعال‌سازی قابلیت PWA و آفلاین
        initializePWA();
    } catch (error) {
        console.error('Core init error:', error);
    }
}

function initializePWA() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', async () => {
        try {
            await navigator.serviceWorker.register('/sw.js');
        } catch (e) {
            console.error('SW registration error:', e);
        }
    });
}