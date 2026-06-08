/* ==========================================
   CONFIG
========================================== */

const CONFIG = {

    endpoint: null,

    successMessage:
        'عضویت شما با موفقیت ثبت شد ✨',

    errorMessage:
        'خطایی رخ داد. دوباره تلاش کنید.'
};

/* ==========================================
   PUBLIC API
========================================== */

export function initNewsletter() {

    const form =
        document.getElementById(
            'newsletter-form'
        );

    if (!form)
        return;

    form.addEventListener(

        'submit',

        handleSubmit
    );
}

/* ==========================================
   SUBMIT
========================================== */

async function handleSubmit(
    event
) {

    event.preventDefault();

    const form =
        event.currentTarget;

    const input =
        form.querySelector(
            'input[type="email"]'
        );

    const email =
        input.value.trim();

    if (
        !isValidEmail(email)
    ) {

        toast(
            'ایمیل معتبر نیست',
            'error'
        );

        shake(input);

        return;
    }

    const button =
        form.querySelector(
            'button'
        );

    setLoading(
        button,
        true
    );

    try {

        await saveEmail(
            email
        );

        input.value = '';

        toast(
            CONFIG.successMessage,
            'success'
        );

        updateMessage(
            CONFIG.successMessage,
            true
        );

    }

    catch (error) {

        console.error(
            error
        );

        toast(
            CONFIG.errorMessage,
            'error'
        );

        updateMessage(
            CONFIG.errorMessage,
            false
        );
    }

    finally {

        setLoading(
            button,
            false
        );
    }
}

/* ==========================================
   EMAIL VALIDATION
========================================== */

function isValidEmail(
    email
) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}

/* ==========================================
   SAVE EMAIL
========================================== */

async function saveEmail(
    email
) {

    if (
        !CONFIG.endpoint
    ) {

        await fakeRequest();

        return;
    }

    const response =
        await fetch(

            CONFIG.endpoint,

            {

                method: 'POST',

                headers: {

                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify({

                        email
                    })
            }
        );

    if (
        !response.ok
    ) {

        throw new Error(
            'API Error'
        );
    }

    return response.json();
}

/* ==========================================
   DEMO REQUEST
========================================== */

function fakeRequest() {

    return new Promise(

        resolve => {

            setTimeout(

                resolve,

                1200

            );
        }
    );
}

/* ==========================================
   BUTTON LOADING
========================================== */

function setLoading(

    button,

    loading

) {

    if (!button)
        return;

    button.disabled =
        loading;

    button.dataset.originalText ??=
        button.textContent;

    button.textContent =
        loading
            ? 'در حال ارسال...'
            : button.dataset
                .originalText;
}

/* ==========================================
   MESSAGE AREA
========================================== */

function updateMessage(

    message,

    success

) {

    const box =
        document.getElementById(
            'newsletter-message'
        );

    if (!box)
        return;

    box.textContent =
        message;

    box.className =
        success
            ? 'newsletter-success'
            : 'newsletter-error';
}

/* ==========================================
   TOAST
========================================== */

function toast(

    message,

    type = 'success'

) {

    const toast =
        document.createElement(
            'div'
        );

    toast.className =
        `toast toast-${type}`;

    toast.textContent =
        message;

    document.body.appendChild(
        toast
    );

    requestAnimationFrame(
        () => {

            toast.classList.add(
                'show'
            );
        }
    );

    setTimeout(() => {

        toast.classList.remove(
            'show'
        );

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3500);
}

/* ==========================================
   INPUT SHAKE
========================================== */

function shake(
    element
) {

    element.classList.add(
        'shake'
    );

    setTimeout(

        () => {

            element.classList.remove(
                'shake'
            );

        },

        500
    );
}