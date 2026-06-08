/* ==========================================
   STAR ENGINE
========================================== */

let canvas;
let ctx;

let width;
let height;

let stars = [];
let shootingStars = [];

let mouseX = 0;
let mouseY = 0;

let paused = false;

const STAR_COUNT = 150;

/* ==========================================
   PUBLIC API
========================================== */

export function initStars() {

    canvas =
        document.getElementById(
            'star-canvas'
        );

    if (!canvas)
        return;

    ctx =
        canvas.getContext(
            '2d'
        );

    resizeCanvas();

    createStars();

    createListeners();

    animate();
}

/* ==========================================
   RESIZE
========================================== */

function resizeCanvas() {

    width =
        window.innerWidth;

    height =
        window.innerHeight;

    canvas.width = width;
    canvas.height = height;
}

/* ==========================================
   STAR CLASS
========================================== */

class Star {

    constructor() {

        this.reset();
    }

    reset() {

        this.x =
            Math.random() * width;

        this.y =
            Math.random() * height;

        this.radius =
            Math.random() * 2 + 0.5;

        this.alpha =
            Math.random();

        this.speed =
            Math.random() * 0.02;

        this.depth =
            Math.random() * 2 + 1;
    }

    update() {

        this.alpha += this.speed;

        if (
            this.alpha >= 1 ||
            this.alpha <= 0
        ) {

            this.speed *= -1;
        }
    }

    draw() {

        const offsetX =
            mouseX /
            (50 * this.depth);

        const offsetY =
            mouseY /
            (50 * this.depth);

        ctx.beginPath();

        ctx.arc(

            this.x + offsetX,

            this.y + offsetY,

            this.radius,

            0,

            Math.PI * 2

        );

        ctx.fillStyle =
            `rgba(255,255,255,${this.alpha})`;

        ctx.fill();
    }
}

/* ==========================================
   SHOOTING STAR
========================================== */

class ShootingStar {

    constructor() {

        this.reset();
    }

    reset() {

        this.x =
            Math.random() * width;

        this.y =
            -100;

        this.length =
            100 +
            Math.random() * 150;

        this.speed =
            8 +
            Math.random() * 8;

        this.opacity = 1;
    }

    update() {

        this.x += this.speed;

        this.y += this.speed;

        this.opacity -= 0.008;
    }

    draw() {

        ctx.beginPath();

        ctx.moveTo(
            this.x,
            this.y
        );

        ctx.lineTo(

            this.x - this.length,

            this.y - this.length

        );

        ctx.strokeStyle =
            `rgba(255,255,255,${this.opacity})`;

        ctx.lineWidth = 2;

        ctx.stroke();
    }

    get dead() {

        return (
            this.opacity <= 0
        );
    }
}

/* ==========================================
   CREATE STARS
========================================== */

function createStars() {

    stars = [];

    for (

        let i = 0;

        i < STAR_COUNT;

        i++

    ) {

        stars.push(
            new Star()
        );
    }
}

/* ==========================================
   SHOOTING STAR SPAWNER
========================================== */

function maybeCreateShootingStar() {

    if (
        Math.random() < 0.003
    ) {

        shootingStars.push(

            new ShootingStar()

        );
    }
}

/* ==========================================
   UPDATE
========================================== */

function update() {

    stars.forEach(

        star => star.update()

    );

    shootingStars.forEach(

        star => star.update()

    );

    shootingStars =
        shootingStars.filter(

            star => !star.dead

        );

    maybeCreateShootingStar();
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

    stars.forEach(

        star => star.draw()

    );

    shootingStars.forEach(

        star => star.draw()

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
   LISTENERS
========================================== */

function createListeners() {

    window.addEventListener(

        'resize',

        resizeCanvas,

        { passive: true }

    );

    document.addEventListener(

        'mousemove',

        event => {

            mouseX =
                event.clientX -
                width / 2;

            mouseY =
                event.clientY -
                height / 2;
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