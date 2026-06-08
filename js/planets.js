/* ==========================================
   PLANET DATA
========================================== */

const PLANETS = [

    {
        name: 'عطارد',
        english: 'Mercury',
        size: 28,
        color: '#a0a0a0',
        speed: 0.03,
        description:
            'نزدیک‌ترین سیاره به خورشید'
    },

    {
        name: 'زهره',
        english: 'Venus',
        size: 40,
        color: '#e7c27d',
        speed: 0.02,
        description:
            'داغ‌ترین سیاره منظومه'
    },

    {
        name: 'زمین',
        english: 'Earth',
        size: 42,
        color: '#2b90ff',
        speed: 0.025,
        description:
            'خانه ما در کیهان'
    },

    {
        name: 'مریخ',
        english: 'Mars',
        size: 35,
        color: '#d14c32',
        speed: 0.022,
        description:
            'سیاره سرخ'
    },

    {
        name: 'مشتری',
        english: 'Jupiter',
        size: 70,
        color: '#d3a679',
        speed: 0.01,
        description:
            'بزرگ‌ترین سیاره'
    },

    {
        name: 'زحل',
        english: 'Saturn',
        size: 60,
        color: '#e7cf9f',
        speed: 0.012,
        description:
            'سیاره حلقه‌ها'
    },

    {
        name: 'اورانوس',
        english: 'Uranus',
        size: 50,
        color: '#89d8ff',
        speed: 0.009,
        description:
            'غول یخی'
    },

    {
        name: 'نپتون',
        english: 'Neptune',
        size: 48,
        color: '#3c63ff',
        speed: 0.008,
        description:
            'دورترین سیاره'
    }
];

/* ==========================================
   PUBLIC API
========================================== */

export function initPlanets() {

    const container =
        document.getElementById(
            'planet-grid'
        );

    if (!container)
        return;

    createPlanetCards(
        container
    );
}

/* ==========================================
   CREATE CARDS
========================================== */

function createPlanetCards(
    container
) {

    PLANETS.forEach(

        planet => {

            const card =
                document.createElement(
                    'article'
                );

            card.className =
                'planet-card card reveal';

            card.innerHTML = `

                <canvas
                    class="planet-canvas">
                </canvas>

                <h3>
                    ${planet.name}
                </h3>

                <span>
                    ${planet.english}
                </span>

                <p>
                    ${planet.description}
                </p>

            `;

            container.appendChild(
                card
            );

            const canvas =
                card.querySelector(
                    'canvas'
                );

            createPlanetRenderer(
                canvas,
                planet
            );
        }
    );
}

/* ==========================================
   PLANET RENDERER
========================================== */

function createPlanetRenderer(
    canvas,
    planet
) {

    const ctx =
        canvas.getContext(
            '2d'
        );

    canvas.width = 240;
    canvas.height = 240;

    let rotation = 0;

    let paused = false;

    function drawPlanet() {

        ctx.clearRect(

            0,
            0,

            canvas.width,
            canvas.height
        );

        const x =
            canvas.width / 2;

        const y =
            canvas.height / 2;

        drawGlow(
            ctx,
            x,
            y,
            planet
        );

        drawBody(
            ctx,
            x,
            y,
            planet,
            rotation
        );

        if (
            planet.english ===
            'Saturn'
        ) {

            drawRing(
                ctx,
                x,
                y
            );
        }
    }

    function animate() {

        if (!paused) {

            rotation +=
                planet.speed;

            drawPlanet();
        }

        requestAnimationFrame(
            animate
        );
    }

    document.addEventListener(

        'visibilitychange',

        () => {

            paused =
                document.hidden;
        }
    );

    animate();
}

/* ==========================================
   PLANET BODY
========================================== */

function drawBody(

    ctx,

    x,

    y,

    planet,

    rotation

) {

    const gradient =
        ctx.createRadialGradient(

            x - 20,

            y - 20,

            10,

            x,

            y,

            planet.size

        );

    gradient.addColorStop(
        0,
        '#ffffff'
    );

    gradient.addColorStop(
        .3,
        planet.color
    );

    gradient.addColorStop(
        1,
        darken(
            planet.color,
            30
        )
    );

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.rotate(
        rotation
    );

    ctx.beginPath();

    ctx.arc(

        0,

        0,

        planet.size,

        0,

        Math.PI * 2

    );

    ctx.fillStyle =
        gradient;

    ctx.fill();

    drawPlanetLines(
        ctx,
        planet
    );

    ctx.restore();
}

/* ==========================================
   PLANET TEXTURE
========================================== */

function drawPlanetLines(
    ctx,
    planet
) {

    ctx.strokeStyle =
        'rgba(255,255,255,.12)';

    ctx.lineWidth = 2;

    for (

        let i = -4;

        i <= 4;

        i++

    ) {

        ctx.beginPath();

        ctx.arc(

            0,

            i * 8,

            planet.size * 0.9,

            0,

            Math.PI

        );

        ctx.stroke();
    }
}

/* ==========================================
   SATURN RING
========================================== */

function drawRing(
    ctx,
    x,
    y
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.rotate(
        -.4
    );

    ctx.beginPath();

    ctx.ellipse(

        0,

        0,

        90,

        28,

        0,

        0,

        Math.PI * 2

    );

    ctx.strokeStyle =
        'rgba(255,255,255,.35)';

    ctx.lineWidth = 6;

    ctx.stroke();

    ctx.restore();
}

/* ==========================================
   GLOW
========================================== */

function drawGlow(

    ctx,

    x,

    y,

    planet

) {

    const glow =
        ctx.createRadialGradient(

            x,

            y,

            planet.size,

            x,

            y,

            planet.size * 2.5

        );

    glow.addColorStop(

        0,

        `${planet.color}66`
    );

    glow.addColorStop(

        1,

        'transparent'
    );

    ctx.beginPath();

    ctx.arc(

        x,

        y,

        planet.size * 2.5,

        0,

        Math.PI * 2

    );

    ctx.fillStyle =
        glow;

    ctx.fill();
}

/* ==========================================
   COLOR UTILITY
========================================== */

function darken(
    color,
    amount
) {

    const num =
        parseInt(
            color.slice(1),
            16
        );

    let r =
        (num >> 16) - amount;

    let g =
        ((num >> 8) & 255)
        - amount;

    let b =
        (num & 255)
        - amount;

    r = Math.max(r, 0);
    g = Math.max(g, 0);
    b = Math.max(b, 0);

    return `rgb(${r},${g},${b})`;
}