/* ==========================================================
   KOSMOS SERVICE WORKER - CACHE VERSION 3.0
========================================================== */

const CACHE_NAME = 'kosmos-v3';

// لیست تمام دارایی‌های استاتیک پروژه برای کارکرد آفلاین کامل
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './css/style.css',
    './css/animations.css',
    './css/responsive.css',
    './js/main.js',
    './js/ui.js',
    './js/kosmos-engine.js',
    './js/newsletter.js'
];

/* 1. رویداد نصب (INSTALL) - ذخیره دارایی‌های اصلی در کش */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[Service Worker] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

/* 2. رویداد فعال‌سازی (ACTIVATE) - پاکسازی کش‌های قدیمی مرورگر */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        console.log('[Service Worker] Removing old cache:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

/* 3. رویداد واکشی (FETCH) - مدیریت درخواست‌ها و پشتیبانی آفلاین */
self.addEventListener('fetch', event => {
    // نادیده گرفتن درخواست‌های افزونه‌ها یا پروتکل‌های غیر از http/https
    if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                // اگر فایل در کش موجود بود، آن را برگردان و در پس‌زمینه بروزرسانی کن
                fetch(event.request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, networkResponse);
                        });
                    }
                }).catch(() => {/* خطای شبکه در حالت آفلاین نادیده گرفته می‌شود */});
                
                return cachedResponse;
            }

            // اگر فایل در کش نبود، آن را از شبکه دریافت و در کش ذخیره کن
            return fetch(event.request).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });

                return networkResponse;
            }).catch(() => {
                // در صورت قطعی کامل شبکه و درخواست صفحه اصلی، فایل ریشه را برگردان
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});