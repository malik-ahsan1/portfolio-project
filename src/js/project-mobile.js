class MobileCarousel {
    constructor() {
        this.currentIndex = 0;
        this.totalSlides = 7;
        this.isAnimating = false;
        this.startX = 0;
        this.currentX = 0;
        this.threshold = 30; // Minimum distance to trigger slide change

        this.track = document.getElementById('carousel-track');
        this.container = document.getElementById('carousel-container');
        this.bullets = document.querySelectorAll('.bullet');
        this.slides = document.querySelectorAll('.carousel-slide');

        this.init();
    }

    init() {
        this.setupTrack();
        this.setupEventListeners();
        this.updateUI();
        this.animateInitialLoad();
    }

    setupTrack() {
        // Set initial position
        gsap.set(this.track, { x: 0 });
    }

    setupEventListeners() {
        // Bullet navigation
        this.bullets.forEach((bullet, index) => {
            bullet.addEventListener('click', () => {
                if (!this.isAnimating) {
                    this.goToSlide(index);
                }
            });
        });

        // Touch events
        this.container.addEventListener(
            'touchstart',
            (e) => {
                if (this.isAnimating) return;
                this.startX = e.touches[0].clientX;
                this.startY = e.touches[0].clientY; // Track Y to distinguish horizontal vs vertical
                this.currentX = this.startX;
            },
            { passive: true }
        );

        this.container.addEventListener(
            'touchmove',
            (e) => {
                if (this.isAnimating) return;

                this.currentX = e.touches[0].clientX;
                const currentY = e.touches[0].clientY;

                // Calculate deltas
                const deltaX = this.currentX - this.startX;
                const deltaY = currentY - this.startY;

                // If horizontal movement is greater than vertical, prevent default browser behavior
                if (
                    Math.abs(deltaX) > Math.abs(deltaY) &&
                    Math.abs(deltaX) > 10
                ) {
                    e.preventDefault(); // This prevents browser back navigation
                }
            },
            { passive: false }
        ); // Must be false to allow preventDefault

        this.container.addEventListener(
            'touchend',
            (e) => {
                if (this.isAnimating) return;

                const deltaX = this.currentX - this.startX;

                // Only trigger if moved enough
                if (Math.abs(deltaX) > this.threshold) {
                    if (deltaX > 0) {
                        // Swiped right - go to previous slide
                        this.goToPreviousSlide();
                    } else {
                        // Swiped left - go to next slide
                        this.goToNextSlide();
                    }
                }
            },
            { passive: true }
        );

        // Mouse events for desktop testing
        this.container.addEventListener('mousedown', (e) => {
            if (this.isAnimating) return;
            this.startX = e.clientX;
            this.currentX = this.startX;
            this.isMouseDown = true;
            e.preventDefault(); // Prevent text selection
        });

        this.container.addEventListener('mousemove', (e) => {
            if (this.isAnimating || !this.isMouseDown) return;
            this.currentX = e.clientX;
            e.preventDefault();
        });

        this.container.addEventListener('mouseup', (e) => {
            if (this.isAnimating || !this.isMouseDown) return;
            this.isMouseDown = false;

            const deltaX = this.currentX - this.startX;

            if (Math.abs(deltaX) > this.threshold) {
                if (deltaX > 0) {
                    this.goToPreviousSlide();
                } else {
                    this.goToNextSlide();
                }
            }
        });

        // Prevent context menu and other gestures
        this.container.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Prevent browser pull-to-refresh and other gestures
        this.container.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });

        this.container.addEventListener('gesturechange', (e) => {
            e.preventDefault();
        });

        this.container.addEventListener('gestureend', (e) => {
            e.preventDefault();
        });
    }

    goToNextSlide() {
        if (this.currentIndex < this.totalSlides - 1) {
            this.goToSlide(this.currentIndex + 1);
        }
    }

    goToPreviousSlide() {
        if (this.currentIndex > 0) {
            this.goToSlide(this.currentIndex - 1);
        }
    }

    goToSlide(index) {
        if (
            this.isAnimating ||
            index === this.currentIndex ||
            index < 0 ||
            index >= this.totalSlides
        ) {
            return;
        }

        this.isAnimating = true;
        this.currentIndex = index;

        const targetX = -index * window.innerWidth;

        gsap.to(this.track, {
            x: targetX,
            duration: 0.5,
            ease: 'power2.out',
            onComplete: () => {
                this.isAnimating = false;
                this.animateSlideContent();
            },
        });

        this.updateUI();
    }

    updateUI() {
        // Update bullets
        this.bullets.forEach((bullet, index) => {
            bullet.classList.toggle('active', index === this.currentIndex);
        });

        // Animate bullets
        gsap.to(this.bullets[this.currentIndex], {
            scale: 1.2,
            duration: 0.3,
            ease: 'power2.out',
        });

        this.bullets.forEach((bullet, index) => {
            if (index !== this.currentIndex) {
                gsap.to(bullet, {
                    scale: 1,
                    duration: 0.3,
                    ease: 'power2.out',
                });
            }
        });
    }

    animateSlideContent() {
        const currentSlide = this.slides[this.currentIndex];
        const projectImage = currentSlide.querySelector('.project-image');
        const projectInfo = currentSlide.querySelector('.project-info--mobile');

        // Reset all other slides
        this.slides.forEach((slide, index) => {
            if (index !== this.currentIndex) {
                const img = slide.querySelector('.project-image');
                const info = slide.querySelector('.project-info--mobile');

                gsap.set(img, { scale: 1.05, opacity: 0.7 });
                gsap.set(info, { y: 30, opacity: 0 });
            }
        });

        // Animate current slide
        gsap.to(projectImage, {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
        });

        gsap.to(projectInfo, {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: 0.1,
            ease: 'power2.out',
        });
    }

    animateInitialLoad() {
        // Animate first slide on load
        gsap.fromTo(
            this.slides[0].querySelector('.project-image'),
            {
                scale: 1.2,
                opacity: 0,
            },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
            }
        );

        gsap.fromTo(
            this.slides[0].querySelector('.project-info--mobile'),
            {
                y: 50,
                opacity: 0,
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.3,
                ease: 'power2.out',
            }
        );

        // Animate bullets
        gsap.fromTo(
            this.bullets,
            {
                scale: 0,
                opacity: 0,
            },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                delay: 0.5,
                stagger: 0.1,
                ease: 'back.out(1.7)',
            }
        );

        // Reset all other slides
        this.slides.forEach((slide, index) => {
            if (index !== this.currentIndex) {
                const img = slide.querySelector('.project-image');
                const info = slide.querySelector('.project-info--mobile');

                gsap.set(img, { scale: 1.05, opacity: 0.7 });
                gsap.set(info, { y: 30, opacity: 0 });
            }
        });
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MobileCarousel();
});
