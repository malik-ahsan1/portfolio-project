// =============================================================================
// MOBILE CAROUSEL FUNCTIONALITY
// =============================================================================

// Carousel elements
const carousel = document.getElementById('carousel');
const bullets = document.querySelectorAll('.bullet--touch');
const slides = document.querySelectorAll('.carousel-slide--touch');

let currentIndex = 0;
let isScrolling = false;

// Update bullets based on current slide
function updateBullets(activeIndex) {
    bullets.forEach((bullet, index) => {
        if (index === activeIndex) {
            gsap.to(bullet, {
                opacity: 1,
                scale: 1.2,
                duration: 0.3,
                ease: 'power2.out',
            });
        } else {
            gsap.to(bullet, {
                opacity: 0.4,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
            });
        }
    });
}

// Detect which slide is currently in view
function detectCurrentSlide() {
    const scrollLeft = carousel.scrollLeft;
    const slideWidth = carousel.clientWidth;
    const newIndex = Math.round(scrollLeft / slideWidth);

    if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        updateBullets(currentIndex);
    }
}

// Smooth scroll to specific slide
function scrollToSlide(index) {
    const slideWidth = carousel.clientWidth;
    const targetScrollLeft = index * slideWidth;

    gsap.to(carousel, {
        scrollLeft: targetScrollLeft,
        duration: 0.8,
        ease: 'power3.out',
    });
}

// Initialize carousel functionality
function initializeCarousel() {
    // Set up scroll event listener with throttling
    let scrollTimeout;
    carousel.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            detectCurrentSlide();
        }, 50);
    });

    // Add click functionality to bullets
    bullets.forEach((bullet, index) => {
        bullet.addEventListener('click', () => {
            scrollToSlide(index);
        });

        // Add hover effect
        bullet.addEventListener('mouseenter', () => {
            if (index !== currentIndex) {
                gsap.to(bullet, {
                    opacity: 0.7,
                    duration: 0.2,
                });
            }
        });

        bullet.addEventListener('mouseleave', () => {
            if (index !== currentIndex) {
                gsap.to(bullet, {
                    opacity: 0.4,
                    duration: 0.2,
                });
            }
        });
    });

    // Initialize first bullet as active
    updateBullets(0);

    // Add touch/swipe support for better mobile experience
    let startX = 0;
    let isDragging = false;

    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    carousel.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        const threshold = 50;

        if (Math.abs(diffX) > threshold) {
            if (diffX > 0 && currentIndex < slides.length - 1) {
                // Swipe left - next slide
                scrollToSlide(currentIndex + 1);
            } else if (diffX < 0 && currentIndex > 0) {
                // Swipe right - previous slide
                scrollToSlide(currentIndex - 1);
            }
        }
    });
}

// =============================================================================
// INITIALIZATION
// =============================================================================

// Initialize when page loads
window.addEventListener('load', () => {
    initializeCarousel();

    // Add entrance animation for slides
    gsap.fromTo(
        '.carousel-slide--touch',
        {
            opacity: 0,
            y: 50,
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            delay: 0.3,
        }
    );

    // Add entrance animation for bullets
    gsap.fromTo(
        '.bullet--touch',
        {
            opacity: 0,
            scale: 0,
        },
        {
            opacity: 0.4,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: 'back.out(1.7)',
            delay: 0.5,
        }
    );

    // Set first bullet as active after animation
    setTimeout(() => {
        updateBullets(0);
    }, 800);
});
