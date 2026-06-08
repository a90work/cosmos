/* ==========================================
   IMPORTS
========================================== */

import { initStars } from './stars.js';

import { initGalaxy } from './galaxy.js';

import { initPlanets } from './planets.js';

import {
    initTheme,
    initProgressBar,
    initNavbar,
    initCursor,
    removeLoader
}
from './ui.js';

import {
    initNewsletter
}
from './newsletter.js';

/* ==========================================
   APP STATE
========================================== */

const App = {

    initialized: false,

    animationsPaused: false
};

/* ==========================================
   DOM READY
========================================== */

document.addEventListener(
    'DOMContentLoaded',
    bootstrap
);

/* ==========================================
   BOOTSTRAP
========================================== */

async function bootstrap() {

    if (App.initialized) return;

    App.initialized = true;

    console.log(
        '%cKOSMOS PRO',
        'color:#00d4ff;font-size:20px;font-weight:bold'
    );

    initializeCore();

    initializeVisuals();

    initializeObservers();

    initializePerformance();

    initializePWA();

    await finishLoading();
}

/* ==========================================
   CORE
========================================== */

function initializeCore() {

    initTheme();

    initNavbar();

    initProgressBar();

    initCursor();

    initNewsletter();
}

/* ==========================================
   VISUAL MODULES
========================================== */

function initializeVisuals() {

    initStars();

    initGalaxy();

    initPlanets();
}

/* ==========================================
   LOADER
========================================== */

async function finishLoading() {

    await new Promise(resolve => {

        setTimeout(resolve, 1500);

    });

    removeLoader();
}

/* ==========================================
   OBSERVERS
========================================== */

function initializeObservers() {

    revealAnimations();

    lazySections();

    animateCounters();
}

/* ==========================================
   REVEAL ELEMENTS
========================================== */

function revealAnimations() {

    const elements =
        document.querySelectorAll('.reveal');

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting)
                        return;

                    entry.target.classList
                        .add('active');

                    observer.unobserve(
                        entry.target
                    );

                });

            },

            {
                threshold: 0.15
            }
        );

    elements.forEach(el =>
        observer.observe(el)
    );
}

/* ==========================================
   LAZY SECTION OBSERVER
========================================== */

function lazySections() {

    const sections =
        document.querySelectorAll('section');

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList
                            .add('visible');

                    }

                });

            },

            {
                threshold: .1
            }
        );

    sections.forEach(section =>
        observer.observe(section)
    );
}

/* ==========================================
   COUNTERS
========================================== */

function animateCounters() {

    const counters =
        document.querySelectorAll(
            '[data-counter]'
        );

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(entry => {

                    if (
                        !entry.isIntersecting
                    )
                        return;

                    startCounter(
                        entry.target
                    );

                    observer.unobserve(
                        entry.target
                    );

                });

            }

        );

    counters.forEach(counter =>
        observer.observe(counter)
    );
}

function startCounter(el) {

    const target =
        Number(
            el.dataset.counter
        );

    let current = 0;

    const increment =
        target / 80;

    const timer =
        setInterval(() => {

            current += increment;

            if (
                current >= target
            ) {

                current = target;

                clearInterval(timer);
            }

            el.textContent =
                Math.floor(current);

        }, 16);
}

/* ==========================================
   PERFORMANCE
========================================== */

function initializePerformance() {

    visibilityOptimizer();

    reducedMotionSupport();

    passiveListeners();
}

/* ==========================================
   VISIBILITY API
========================================== */

function visibilityOptimizer() {

    document.addEventListener(
        'visibilitychange',

        () => {

            App.animationsPaused =
                document.hidden;

            document.body.classList.toggle(

                'paused',

                document.hidden

            );

        }
    );
}

/* ==========================================
   REDUCED MOTION
========================================== */

function reducedMotionSupport() {

    const media =
        window.matchMedia(

            '(prefers-reduced-motion: reduce)'
        );

    if (media.matches) {

        document.body.classList
            .add('reduced-motion');
    }
}

/* ==========================================
   PASSIVE EVENTS
========================================== */

function passiveListeners() {

    window.addEventListener(

        'scroll',

        () => {},

        {
            passive: true
        }

    );

    window.addEventListener(

        'touchstart',

        () => {},

        {
            passive: true
        }

    );
}

/* ==========================================
   SERVICE WORKER
========================================== */

function initializePWA() {

    if (
        !('serviceWorker' in navigator)
    )
        return;

    window.addEventListener(

        'load',

        async () => {

            try {

                await navigator
                    .serviceWorker
                    .register('/sw.js');

                console.log(
                    'Service Worker Registered'
                );

            }

            catch (error) {

                console.error(
                    error
                );
            }

        }
    );
}

/* ==========================================
   ERROR HANDLING
========================================== */

window.addEventListener(

    'error',

    event => {

        console.error(

            'Application Error:',

            event.error

        );

    }
);

window.addEventListener(

    'unhandledrejection',

    event => {

        console.error(

            'Promise Rejection:',

            event.reason

        );

    }
);

/* ==========================================
   GLOBAL DEBUG
========================================== */

window.KOSMOS = {

    version: '2.0.0',

    app: App
};