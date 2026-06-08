/* ==========================================================
   KOSMOS SERVICE WORKER - CACHE VERSION 2.0
========================================================== */

const CACHE_NAME = 'kosmos-v2'; // تغییر ورژن از v1 به v2 برای از بین بردن کش‌های قدیمی مرگرها

const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/css/style.css',
    '/css/animations.css',
    '/css/responsive.css',
    '/js/main.js',
    '/js/ui.js',
    '/js/kosmos-engine.js', // فایل سه بعدی جدید به حافظه متصل شد
    '/js/newsletter.js'
];

/* INSTALL EVENT */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

/* ACTIVATE EVENT */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

/* FETCH EVENT */
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request).then(networkResponse => {
                const cloned = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, cloned);
                });
                return networkResponse;
            });
        }).catch(() => {
            return caches.match('/index.html');
        })
    );
});