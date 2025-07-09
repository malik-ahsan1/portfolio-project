function init() {
    gsap.set('.header-content', { y: 50 });
    gsap.set('.card', {
        x: -50,
        willChange: 'transform, opacity',
    });
    gsap.set('.form-container', {
        x: 50,
        willChange: 'transform, opacity',
    });
    gsap.set('.social-links a', {
        scale: 0,
        willChange: 'transform, opacity',
    });
}

window.addEventListener('load', () => {
    init();

    const tl = gsap.timeline();

    tl.to('.header-content', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
    });

    tl.to(
        '.card',
        {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power2.out',
        },
        '-=0.6'
    );

    tl.to(
        '.form-container',
        {
            x: 0,
            duration: 1,
            opacity: 1,
            ease: 'power2.out',
        },
        '-=0.8'
    );

    tl.to(
        '.social-links a',
        {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'back.out(1.7)',
        },
        '-=0.4'
    );
});

// Form interactions
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.querySelector('.success-message');
const errorMessage = document.querySelector('.error-message');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');

// Enhanced floating label functionality
const inputs = document.querySelectorAll('input, textarea');
inputs.forEach((input) => {
    const formGroup = input.closest('.form-group');
    const label = formGroup.querySelector('label');
    const placeholder = formGroup.querySelector('.input-placeholder');

    // Handle focus
    input.addEventListener('focus', () => {
        gsap.to(input, {
            duration: 0.3,
            scale: 1.02,
            ease: 'power2.out',
        });

        // Show label, hide placeholder
        gsap.to(label, { duration: 0.2, opacity: 1, ease: 'power2.out' });
        gsap.to(placeholder, { duration: 0.2, opacity: 0, ease: 'power2.out' });
    });

    // Handle blur
    input.addEventListener('blur', () => {
        gsap.to(input, {
            duration: 0.3,
            scale: 1,
            ease: 'power2.out',
        });

        // If input is empty, show placeholder and hide label
        if (!input.value.trim()) {
            gsap.to(label, { duration: 0.2, opacity: 0, ease: 'power2.out' });
            gsap.to(placeholder, {
                duration: 0.2,
                opacity: 1,
                ease: 'power2.out',
            });
        }
    });

    // Handle input changes
    input.addEventListener('input', () => {
        if (input.value.trim()) {
            gsap.to(label, { duration: 0.2, opacity: 1, ease: 'power2.out' });
            gsap.to(placeholder, {
                duration: 0.2,
                opacity: 0,
                ease: 'power2.out',
            });
        } else {
            gsap.to(label, { duration: 0.2, opacity: 0, ease: 'power2.out' });
            gsap.to(placeholder, {
                duration: 0.2,
                opacity: 1,
                ease: 'power2.out',
            });
        }
    });
});

// Form validation
function validateForm() {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    let isValid = true;
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
        errors.push('Name must be at least 2 characters');
        isValid = false;
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Please enter a valid email address');
        isValid = false;
    }
    if (!data.subject || data.subject.trim().length < 3) {
        errors.push('Subject must be at least 3 characters');
        isValid = false;
    }
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters');
        isValid = false;
    }

    return { isValid, errors, data };
}


function insertHiddenFields() {
    const fields = [
        { name: '_captcha', value: 'false' },
        { name: '_next', value: 'http://127.0.0.1:3000/src/' },
        { name: '_subject', value: 'New message from your website!' },
    ];

    fields.forEach(({ name, value }) => {
        const hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = name;
        hidden.value = value;
        form.appendChild(hidden);
    });
}

// Form submission
form.addEventListener('submit', function (e) {
    e.preventDefault();

    const validation = validateForm();

    if (!validation.isValid) {
        errorMessage.querySelector('span').textContent = validation.errors[0];
        errorMessage.classList.remove('hidden');
        gsap.from(errorMessage, {
            duration: 0.5,
            y: -20,
            opacity: 0,
            ease: 'back.out(1.7)',
        });

        // Shake animation for invalid form
        gsap.to('.form-container', {
            duration: 0.1,
            x: -10,
            yoyo: true,
            repeat: 5,
            ease: 'power2.inOut',
        });

        setTimeout(() => {
            gsap.to(errorMessage, {
                duration: 0.3,
                opacity: 0,
                y: -20,
                onComplete: () => {
                    errorMessage.classList.add('hidden');
                    gsap.set(errorMessage, { opacity: 1, y: 0 });
                },
            });
        }, 4000);

        return;
    }

    // Button loading state
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        // Reset button
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        submitBtn.disabled = false;

        gsap.to(errorMessage, {
            duration: 0.3,
            opacity: 0,
            y: -20,
            onComplete: () => {
                errorMessage.classList.add('hidden');
                gsap.set(errorMessage, { opacity: 1, y: 0 });
            },
        });

        // Show success message
        successMessage.classList.remove('hidden');
        gsap.from(successMessage, {
            duration: 0.5,
            y: -20,
            opacity: 0,
            ease: 'back.out(1.7)',
        });

        insertHiddenFields();
        // Submit form
        form.submit();

        // Reset form
        form.reset();

        // Reset all labels and placeholders
        inputs.forEach((input) => {
            const formGroup = input.closest('.form-group');
            const label = formGroup.querySelector('label');
            const placeholder = formGroup.querySelector('.input-placeholder');

            gsap.set(label, { opacity: 0 });
            gsap.set(placeholder, { opacity: 1 });
        });

        // Hide success message after 5 seconds
        setTimeout(() => {
            gsap.to(successMessage, {
                duration: 0.3,
                opacity: 0,
                y: -20,
                onComplete: () => {
                    successMessage.classList.add('hidden');
                    gsap.set(successMessage, { opacity: 1, y: 0 });
                },
            });
        }, 5000);
    }, 2000);
});

// Hover animations for contact info cards
const contactCards = document.querySelectorAll('.contact-info > div');
contactCards.forEach((card) => {
    card.addEventListener('mouseenter', () => {
        gsap.to(card, {
            duration: 0.3,
            y: -5,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            ease: 'power2.out',
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            duration: 0.3,
            y: 0,
            boxShadow: '0 0px 0px rgba(0,0,0,0)',
            ease: 'power2.out',
        });
    });
});

// Submit button hover animation
submitBtn.addEventListener('mouseenter', () => {
    gsap.to(submitBtn, {
        duration: 0.3,
        boxShadow: '0 15px 30px rgba(59, 130, 246, 0.4)',
        ease: 'power2.out',
    });
});

submitBtn.addEventListener('mouseleave', () => {
    gsap.to(submitBtn, {
        duration: 0.3,
        boxShadow: '0 0px 0px rgba(59, 130, 246, 0)',
        ease: 'power2.out',
    });
});
