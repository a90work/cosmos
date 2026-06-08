/* ==========================================
   CACHE
========================================== */

const CACHE_NAME =
    'kosmos-v1';

const STATIC_ASSETS = [

    '/',

    '/index.html',

    '/manifest.json',

    '/css/style.css',
    '/css/animations.css',
    '/css/responsive.css',

    '/js/main.js',
    '/js/ui.js',
    '/js/stars.js',
    '/js/galaxy.js',
    '/js/planets.js',
    '/js/newsletter.js'
];

/* ==========================================
   INSTALL
========================================== */

self.addEventListener(

    'install',

    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            )

            .then(cache => {

                return cache.addAll(
                    STATIC_ASSETS
                );
            })

        );

        self.skipWaiting();
    }
);

/* ==========================================
   ACTIVATE
========================================== */

self.addEventListener(

    'activate',

    event => {

        event.waitUntil(

            caches.keys()

            .then(keys => {

                return Promise.all(

                    keys.map(key => {

                        if (

                            key !==
                            CACHE_NAME

                        ) {

                            return caches
                                .delete(
                                    key
                                );
                        }

                    })

                );

            })

        );

        self.clients.claim();
    }
);

/* ==========================================
   FETCH
========================================== */

self.addEventListener(

    'fetch',

    event => {

        event.respondWith(

            caches.match(
                event.request
            )

            .then(response => {

                if (response) {

                    return response;
                }

                return fetch(
                    event.request
                )

                .then(networkResponse => {

                    const cloned =
                        networkResponse.clone();

                    caches.open(
                        CACHE_NAME
                    )

                    .then(cache => {

                        cache.put(

                            event.request,

                            cloned

                        );

                    });

                    return networkResponse;
                });

            })

            .catch(() => {

                return caches.match(
                    '/index.html'
                );

            })

        );

    }
);