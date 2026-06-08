/* ==========================================================
   KOSMOS 3.0 - ADVANCED THREE.JS GRAPHICS ENGINE
========================================================== */

// تعریف متغیرهای سراسری موتور گرافیکی
let scene, camera, renderer;
let stars, earth, sunLight, ambientLight;
let rotationSpeedFactor = 1.0;

/**
 * تابع اصلی مقداردهی و راه‌اندازی موتور گرافیکی کیهان
 */
export function initKosmosEngine() {
    const container = document.getElementById('universe-container');
    if (!container) return;

    // ۱. ساخت صحنه (Scene)
    scene = new THREE.Scene();

    // ۲. تنظیم دوربین (Camera)
    camera = new THREE.PerspectiveCamera(
        60, 
        window.innerWidth / window.innerHeight, 
        0.1, 
        1000
    );
    // موقعیت اولیه دوربین در فضا
    camera.position.z = 250;
    camera.position.y = 90;
    camera.lookAt(0, 0, 0);

    // ۳. تنظیم رندرکننده (Renderer) با بهینه‌سازی پردازنده گرافیکی
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // بهینه‌سازی برای نمایشگرهای Retina/4K
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // رندر رنگ‌های سینمایی فضا
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ۴. ایجاد عناصر کیهانی
    createSpaceBackground();
    createCelestialBodies();
    setupLights();

    // ۵. اتصال رویدادها (Events)
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('scroll', () => onSpaceScroll(camera), { passive: true });
    setupPanelControls();

    // ۶. آغاز حلقه انیمیشن و رندر
    animate();
}

/**
 * ساخت پس‌زمینه زنده کیهانی با ۵۰,۰۰۰ ستاره پردازش شده توسط GPU
 */
function createSpaceBackground() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 50000;
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
        // پخش کردن ستاره‌ها در فواصل دور دست
        positions[i]     = (Math.random() - 0.5) * 1000;
        positions[i + 1] = (Math.random() - 0.5) * 1000;
        positions[i + 2] = (Math.random() - 0.5) * 1000;

        // تنوع رنگی ستاره‌ها (سفید، متمایل به آبی و شیری)
        colors[i]     = 0.8 + Math.random() * 0.2;
        colors[i + 1] = 0.8 + Math.random() * 0.2;
        colors[i + 2] = 0.9 + Math.random() * 0.1;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // شیدر ذرات ستاره
    const starsMaterial = new THREE.PointsMaterial({
        size: 0.7,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
}

/**
 * ساخت اجرام آسمانی (به عنوان نمونه شبیه‌ساز زمین)
 */
function createCelestialBodies() {
    // ساخت کره زمین با متریال با کیفیت و واکنش به نور
    const earthGeometry = new THREE.SphereGeometry(40, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
        color: 0x0d2b45,
        roughness: 0.4,
        metalness: 0.1,
        wireframe: false
    });

    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);
}

/**
 * تنظیم نورپردازی داینامیک کیهانی
 */
function setupLights() {
    // نور محیطی ضعیف پس‌زمینه فضا
    ambientLight = new THREE.AmbientLight(0x1a233a, 0.6);
    scene.add(ambientLight);

    // نور مستقیم خورشید با رنگ خیره‌کننده نئونی
    sunLight = new THREE.DirectionalLight(0x00d4ff, 2.8);
    sunLight.position.set(100, 50, 100);
    scene.add(sunLight);
}

/**
 * مدیریت تغییر اندازه پنجره مرورگر برای جلوگیری از دفرمه شدن المان‌ها
 */
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * سینماتیک حرکت دوربین همگام با اسکرول صفحه کاربر
 * اصلاح شده: جلوگیری از برخورد دوربین با مدل‌ها و حفظ زاویه دید اصولی
 */
export function onSpaceScroll(cameraInstance) {
    if (!cameraInstance) return;

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    // بهینه‌سازی فواصل برای جلوگیری از دفرمه شدن شیدر یا نزدیک شدن بیش از حد به هاله زمین
    cameraInstance.position.z = 250 - (progress * 220); // روی ۳۰ واحد فاصله امن متوقف می‌شود
    cameraInstance.position.y = 90 - (progress * 78);   // شیب ملایم‌تر حرکت عمودی دوربین
    cameraInstance.position.x = Math.sin(progress * Math.PI) * 20;
    cameraInstance.rotation.z = progress * 0.25;

    cameraInstance.lookAt(0, 0, 0);
}

/**
 * اتصال اینپوت‌های رنج پنل کنترل فرانت‌اند به مشخصات موتور گرافیکی
 */
function setupPanelControls() {
    const rotationSlider = document.getElementById('rotation-speed');
    const intensitySlider = document.getElementById('sun-intensity');

    rotationSlider?.addEventListener('input', (e) => {
        rotationSpeedFactor = parseFloat(e.target.value);
    });

    intensitySlider?.addEventListener('input', (e) => {
        if (sunLight) {
            sunLight.intensity = parseFloat(e.target.value);
        }
    });
}

/**
 * حلقه انیمیشن مستمر فضا (Render Loop)
 */
function animate() {
    requestAnimationFrame(animate);

    const deltaSpeed = 0.002 * rotationSpeedFactor;

    // چرخش مداوم و زنده اجرام آسمانی و ستاره‌ها در پس‌زمینه
    if (earth) {
        earth.rotation.y += deltaSpeed;
    }
    if (stars) {
        stars.rotation.y += deltaSpeed * 0.2;
        stars.rotation.x += deltaSpeed * 0.05;
    }

    renderer.render(scene, camera);
}