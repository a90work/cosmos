/* ==========================================================
   KOSMOS 3.0 - INTEGRATED 3D ENGINE & CINEMATIC FLY-THROUGH
========================================================== */

let scene, camera, renderer;
let starfield, earthMesh, atmosphereMesh;
let clock = new THREE.Clock();

const COSMIC_CONFIG = {
    starCount: 50000, 
    earthRadius: 5
};

export function initKosmosEngine() {
    const container = document.getElementById('universe-container');
    if (!container) return;

    // ۱. ساخت صحنه و افکت مه فضایی برای تاریکی مطلق کیهان
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020408, 0.0025);

    // ۲. دوربین سینمایی عریض
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 90, 250); // موقعیت شروع در فواصل دور آسمان

    // ۳. رندرر فوق پیشرفته با کیفیت سینمایی داینامیک رنج بالا
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping; 
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // ۴. نورپردازی فیزیکی سیستم
    const ambientLight = new THREE.AmbientLight(0x111622, 1.5);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 2.8);
    sunLight.position.set(-70, 20, 60);
    scene.add(sunLight);

    // ۵. خلق ذرات معلق آسمان و کره زمین واقعی
    createStarfield();
    createEarth();

    // ۶. کنترل موقعیت دوربین با اسکرول کردن کاربر
    window.addEventListener('scroll', onSpaceScroll);
    window.addEventListener('resize', onWindowResize);

    animate();
}

function createStarfield() {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(COSMIC_CONFIG.starCount * 3);
    const colors = new Float32Array(COSMIC_CONFIG.starCount * 3);

    for (let i = 0; i < COSMIC_CONFIG.starCount * 3; i += 3) {
        const radius = Math.random() * 500 + 80;
        const u = Math.random(); const v = Math.random();
        const theta = u * 2.0 * Math.PI; const phi = Math.acos(2.0 * v - 1.0);
        
        positions[i] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i+1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i+2] = radius * Math.cos(phi);

        // رنگ‌بندی کهکشانی ذرات و ستاره‌ها
        const rand = Math.random();
        if (rand > 0.85) { colors[i] = 0.5; colors[i+1] = 0.7; colors[i+2] = 1.0; } 
        else if (rand > 0.7) { colors[i] = 1.0; colors[i+1] = 0.9; colors[i+2] = 0.6; } 
        else { colors[i] = 1.0; colors[i+1] = 1.0; colors[i+2] = 1.0; }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.75,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    starfield = new THREE.Points(geometry, material);
    scene.add(starfield);
}

function createEarth() {
    const textureLoader = new THREE.TextureLoader();
    // لود مستقیم بافت‌های باکیفیت استاندارد بدون نیاز به ذخیره فایل در پروژه
    const earthTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg');
    const specularTexture = textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg');

    // مدلسازی خود کره زمین
    const earthGeo = new THREE.SphereGeometry(COSMIC_CONFIG.earthRadius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
        map: earthTexture,
        roughness: 0.4,
        metalness: 0.1,
        roughnessMap: specularTexture // بازتاب زیبای اقیانوس‌ها در برابر خورشید
    });
    earthMesh = new THREE.Mesh(earthGeo, earthMat);
    scene.add(earthMesh);

    // افکت شیدر اتمسفر و هاله آبی رنگ دور زمین
    const atmosGeo = new THREE.SphereGeometry(COSMIC_CONFIG.earthRadius * 1.15, 64, 64);
    const atmosMat = new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
                gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
            }
        `
    });
    atmosphereMesh = new THREE.Mesh(atmosGeo, atmosMat);
    scene.add(atmosphereMesh);
}

function onSpaceScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    // هدایت قوسی و فوق خفن دوربین به سمت زمین با اسکرول به پایین صفحه
    camera.position.z = 250 - (progress * 232);
    camera.position.y = 90 - (progress * 85);
    camera.position.x = Math.sin(progress * Math.PI) * 25;
    camera.rotation.z = progress * 0.35;

    camera.lookAt(0, 0, 0);
}

function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getElapsedTime();

    // چرخش اتمسفری آرام زمین حول خودش
    if (earthMesh) earthMesh.rotation.y = delta * 0.03;
    
    // چرخش مینیاتوری کل آسمان ستاره‌ها
    if (starfield) {
        starfield.rotation.y = delta * 0.001;
        starfield.rotation.x = Math.sin(delta * 0.02) * 0.005;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}