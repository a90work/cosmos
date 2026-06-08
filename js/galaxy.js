/* ==========================================
   GALAXY ENGINE
========================================== */

let canvas;
let ctx;

let width;
let height;

let particles = [];

let mouseX = 0;
let mouseY = 0;

let rotation = 0;

let paused = false;

/* ==========================================
   CONFIG
========================================== */

const CONFIG = {

    particleCount: 1200,

    arms: 4,

    radius: 260,

    rotationSpeed: 0.0007
};

/* ==========================================
   PUBLIC API
========================================== */

export function initGalaxy() {

    canvas =
        document.getElementById(
            'galaxy-canvas'
        );

    if (!canvas)
        return;

    ctx =
        canvas.getContext(
            '2d'
        );

    resizeCanvas();

    generateGalaxy();

    bindEvents();

    animate();
}

/* ==========================================
   RESIZE
========================================== */

function resizeCanvas() {

    width =
        canvas.parentElement
            .clientWidth;

    height =
        500;

    canvas.width = width;
    canvas.height = height;
}

/* ==========================================
   PARTICLE
========================================== */

class Particle {

    constructor() {

        const arm =
            Math.floor(

                Math.random() *
                CONFIG.arms

            );

        const angle =
            (
                arm /
                CONFIG.arms
            ) *
            Math.PI * 2;

        const distance =
            Math.random() *
            CONFIG.radius;

        const spread =
            distance * 0.15;

        this.baseAngle =
            angle +
            distance * 0.03 +
            random(
                -spread * 0.01,
                spread * 0.01
            );

        this.distance =
            distance;

        this.size =
            Math.random() * 2 + 0.5;

        this.color =
            pickColor();
    }

    draw() {

        const centerX =
            width / 2 +
            mouseX * 0.02;

        const centerY =
            height / 2 +
            mouseY * 0.02;

        const angle =
            this.baseAngle +
            rotation;

        const x =
            centerX +
            Math.cos(angle) *
            this.distance;

        const y =
            centerY +
            Math.sin(angle) *
            this.distance;

        ctx.beginPath();

        ctx.arc(

            x,

            y,

            this.size,

            0,

            Math.PI * 2

        );

        ctx.fillStyle =
            this.color;

        ctx.fill();
    }
}

/* ==========================================
   CREATE GALAXY
========================================== */

function generateGalaxy() {

    particles = [];

    for (

        let i = 0;

        i < CONFIG.particleCount;

        i++

    ) {

        particles.push(

            new Particle()

        );
    }
}

/* ==========================================
   COLORS
========================================== */

function pickColor() {

    const colors = [

        '#00d4ff',
        '#7c3aed',
        '#ffffff',
        '#4cc9f0',
        '#ff006e'
    ];

    return colors[
        Math.floor(
            Math.random() *
            colors.length
        )
    ];
}

/* ==========================================
   UPDATE
========================================== */

function update() {

    rotation +=
        CONFIG.rotationSpeed;
}

/* ==========================================
   DRAW CORE GLOW
========================================== */

function drawCore() {

    const gradient =
        ctx.createRadialGradient(

            width / 2,

            height / 2,

            0,

            width / 2,

            height / 2,

            120

        );

    gradient.addColorStop(

        0,

        'rgba(255,255,255,.9)'
    );

    gradient.addColorStop(

        .3,

        'rgba(0,212,255,.5)'
    );

    gradient.addColorStop(

        1,

        'rgba(0,212,255,0)'
    );

    ctx.beginPath();

    ctx.arc(

        width / 2,

        height / 2,

        120,

        0,

        Math.PI * 2

    );

    ctx.fillStyle =
        gradient;

    ctx.fill();
}

/* ==========================================
   DRAW
========================================== */

function draw() {

    ctx.clearRect(

        0,

        0,

        width,

        height

    );

    drawCore();

    particles.forEach(

        particle =>
            particle.draw()

    );
}

/* ==========================================
   LOOP
========================================== */

function animate() {

    if (!paused) {

        update();

        draw();
    }

    requestAnimationFrame(
        animate
    );
}

/* ==========================================
   HELPERS
========================================== */

function random(min, max) {

    return (

        Math.random() *
        (max - min)

    ) + min;
}

/* ==========================================
   EVENTS
========================================== */

function bindEvents() {

    window.addEventListener(

        'resize',

        resizeCanvas,

        {
            passive: true
        }
    );

    document.addEventListener(

        'mousemove',

        event => {

            mouseX =
                event.clientX -
                window.innerWidth / 2;

            mouseY =
                event.clientY -
                window.innerHeight / 2;
        }
    );

    document.addEventListener(

        'visibilitychange',

        () => {

            paused =
                document.hidden;
        }
    );
}