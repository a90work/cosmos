/* ==========================================
   THEME MANAGER
========================================== */

const STORAGE_KEY = 'kosmos-theme';

export function initTheme() {

    const button =
        document.getElementById(
            'theme-toggle'
        );

    if (!button) return;

    const savedTheme =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (savedTheme === 'light') {

        document.body.classList
            .add('light');

        button.textContent = '☀️';
    }

    button.addEventListener(

        'click',

        () => {

            document.body.classList
                .toggle('light');

            const isLight =
                document.body.classList
                .contains('light');

            localStorage.setItem(

                STORAGE_KEY,

                isLight
                    ? 'light'
                    : 'dark'
            );

            button.textContent =
                isLight
                    ? '☀️'
                    : '🌙';
        }
    );
}

/* ==========================================
   NAVBAR
========================================== */

export function initNavbar() {

    const navbar =
        document.getElementById(
            'navbar'
        );

    if (!navbar) return;

    const updateNavbar = () => {

        if (
            window.scrollY > 50
        ) {

            navbar.classList
                .add('scrolled');

        } else {

            navbar.classList
                .remove('scrolled');
        }
    };

    updateNavbar();

    window.addEventListener(

        'scroll',

        updateNavbar,

        { passive: true }

    );
}

/* ==========================================
   PROGRESS BAR
========================================== */

export function initProgressBar() {

    const progress =
        document.getElementById(
            'scroll-progress'
        );

    if (!progress) return;

    const update = () => {

        const scrollTop =
            window.scrollY;

        const height =
            document.documentElement
            .scrollHeight -
            window.innerHeight;

        const percentage =
            (scrollTop / height) * 100;

        progress.style.width =
            percentage + '%';
    };

    update();

    window.addEventListener(

        'scroll',

        update,

        { passive: true }

    );
}

/* ==========================================
   CUSTOM CURSOR
========================================== */

export function initCursor() {

    if (
        window.matchMedia(
            '(pointer: coarse)'
        ).matches
    ) {
        return;
    }

    const cursor =
        document.getElementById(
            'cursor'
        );

    const ring =
        document.getElementById(
            'cursor-ring'
        );

    if (!cursor || !ring)
        return;

    let mouseX = 0;
    let mouseY = 0;

    let ringX = 0;
    let ringY = 0;

    document.addEventListener(

        'mousemove',

        e => {

            mouseX = e.clientX;
            mouseY = e.clientY;

            cursor.style.left =
                mouseX + 'px';

            cursor.style.top =
                mouseY + 'px';
        }
    );

    function animateRing() {

        ringX +=
            (mouseX - ringX) * 0.15;

        ringY +=
            (mouseY - ringY) * 0.15;

        ring.style.left =
            ringX + 'px';

        ring.style.top =
            ringY + 'px';

        requestAnimationFrame(
            animateRing
        );
    }

    animateRing();

    addCursorHoverEffects();
}

function addCursorHoverEffects() {

    const targets =
        document.querySelectorAll(

            'a, button, .card'

        );

    const ring =
        document.getElementById(
            'cursor-ring'
        );

    if (!ring) return;

    targets.forEach(el => {

        el.addEventListener(

            'mouseenter',

            () => {

                ring.style.transform =
                    'translate(-50%, -50%) scale(1.6)';
            }
        );

        el.addEventListener(

            'mouseleave',

            () => {

                ring.style.transform =
                    'translate(-50%, -50%) scale(1)';
            }
        );
    });
}

/* ==========================================
   LOADER
========================================== */

export function removeLoader() {

    const loader =
        document.getElementById(
            'loader'
        );

    if (!loader)
        return;

    loader.classList
        .add('loader-hide');

    setTimeout(() => {

        loader.remove();

    }, 900);
}

/* ==========================================
   SMOOTH SCROLL
========================================== */

export function scrollToElement(
    selector
) {

    const element =
        document.querySelector(
            selector
        );

    if (!element)
        return;

    element.scrollIntoView({

        behavior: 'smooth',

        block: 'start'
    });
}

/* ==========================================
   BACK TO TOP
========================================== */

export function createBackToTop() {

    const button =
        document.createElement(
            'button'
        );

    button.id =
        'back-to-top';

    button.innerHTML =
        '↑';

    document.body
        .appendChild(button);

    button.addEventListener(

        'click',

        () => {

            window.scrollTo({

                top: 0,

                behavior:
                    'smooth'
            });

        }
    );

    const update = () => {

        button.classList.toggle(

            'visible',

            window.scrollY > 600

        );
    };

    update();

    window.addEventListener(

        'scroll',

        update,

        { passive: true }

    );
}

/* ==========================================
   ACTIVE NAV LINK
========================================== */

export function initActiveLinks() {

    const sections =
        document.querySelectorAll(
            'section'
        );

    const navLinks =
        document.querySelectorAll(
            '.nav-links a'
        );

    const observer =
        new IntersectionObserver(

            entries => {

                entries.forEach(

                    entry => {

                        if (
                            !entry.isIntersecting
                        )
                            return;

                        const id =
                            entry.target.id;

                        navLinks.forEach(

                            link => {

                                link.classList
                                    .remove(
                                        'active'
                                    );

                                if (

                                    link.getAttribute(
                                        'href'
                                    ) ===
                                    '#' + id

                                ) {

                                    link.classList
                                        .add(
                                            'active'
                                        );
                                }
                            }
                        );
                    }
                );
            },

            {
                threshold: .4
            }
        );

    sections.forEach(

        section => {

            observer.observe(
                section
            );

        }
    );
}

/* ==========================================
   KEYBOARD ACCESSIBILITY
========================================== */

export function initKeyboardUX() {

    document.addEventListener(

        'keydown',

        event => {

            if (
                event.key === 'Escape'
            ) {

                document.activeElement
                    ?.blur();
            }
        }
    );
}

/* ==========================================
   REDUCED MOTION
========================================== */

export function disableHeavyEffects() {

    const reduce =
        window.matchMedia(

            '(prefers-reduced-motion: reduce)'
        );

    if (!reduce.matches)
        return;

    document.body.classList
        .add(
            'reduced-motion'
        );
}

/* ==========================================
   INIT ALL UI
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
}