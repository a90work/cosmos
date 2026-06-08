// بخش تابع تغییر موقعیت با اسکرول کدهای جاوااسکریپت اصلاح شود:
function onSpaceScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;

    // بهینه‌سازی فواصل برای جلوگیری از دفرمه شدن شیدر یا نزدیک شدن بیش از حد به هاله زمین
    camera.position.z = 250 - (progress * 220); // به جای ۲۳۲، روی ۳۰ واحد فاصله امن متوقف می‌شود
    camera.position.y = 90 - (progress * 78);   // شیب ملایم‌تر حرکت عمودی دوربین
    camera.position.x = Math.sin(progress * Math.PI) * 20;
    camera.rotation.z = progress * 0.25;

    camera.lookAt(0, 0, 0);
}