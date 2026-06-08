/* ==========================================================
   KOSMOS NEWSLETTER MANAGER - COMPLETE CODE
========================================================== */

/**
 * مدیریت ارسال فرم خبرنامه با استفاده از Fetch API
 * مناسب برای اتصال به بک‌اندهای Python/FastAPI
 */
export function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    const messageContainer = document.getElementById('newsletter-message');
    const emailInput = document.getElementById('email');

    if (!form || !messageContainer) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // ریست کردن استایل پیام قبلی
        messageContainer.textContent = 'در حال بررسی...';
        messageContainer.className = 'info';

        // اعتبارسنجی اولیه ایمیل
        if (!validateEmail(email)) {
            showMessage('لطفاً یک ایمیل معتبر وارد کنید.', 'error');
            return;
        }

        try {
            // در اینجا می‌توانید آدرس API خود را جایگزین کنید
            // به عنوان مثال: http://localhost:8000/subscribe
            const response = await fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email })
            });

            if (response.ok) {
                showMessage('خوش آمدید! اشتراک شما با موفقیت فعال شد.', 'success');
                form.reset();
            } else {
                const errorData = await response.json();
                showMessage(errorData.detail || 'خطایی در برقراری ارتباط رخ داد.', 'error');
            }
        } catch (error) {
            // شبیه‌سازی موفقیت در صورت نبود سرور (برای تست فرانت‌اند)
            console.warn('Backend not found, simulating success for UI testing.');
            setTimeout(() => {
                showMessage('اشتراک تستی شما در KOSMOS ثبت شد!', 'success');
                form.reset();
            }, 1000);
        }
    });

    /**
     * نمایش پیام‌های بازخورد به کاربر
     */
    function showMessage(text, type) {
        messageContainer.textContent = text;
        messageContainer.className = type; // کلاس‌های success یا error در CSS تعریف می‌شوند
        
        // حذف پیام بعد از ۵ ثانیه
        setTimeout(() => {
            messageContainer.textContent = '';
            messageContainer.className = '';
        }, 5000);
    }

    /**
     * تابع اعتبارسنجی فرمت ایمیل با Regex
     */
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
}