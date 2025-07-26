gsap.registerPlugin(Observer);

const bullterContainer = document.querySelector('.bullets-container');
const bullets = Array.from(document.querySelectorAll('.project-bullet'));

let activeBullet = document.querySelector('.project-bullet.active');
let hoveredInSession = false;
// ==========================================================================

let isTransitioning = false;

const counter_spans = Array.from(
    document.querySelectorAll('.project-counter span')
);
const title_spans = Array.from(
    document.querySelectorAll('.project-title span')
);
const project_descriptions = Array.from(
    document.querySelectorAll('.project-info')
);

const proj_desc_container = document.getElementsByClassName(
    'project-descriptions'
)[0];

const img_divs = Array.from(document.querySelectorAll('.image-container'));

let currentIndex = 0;
let nextIndex = (currentIndex + 1) % counter_spans.length;
let prevIndex =
    (currentIndex - 1 + counter_spans.length) % counter_spans.length;
let progress = 0;
let isAnimating = false;

// Track bullet hover
bullets.forEach((bullet, index) => {
    bullet.addEventListener('mouseenter', () => {
        if (index < currentIndex) {
            const tl = gsap.timeline();

            for (let i = currentIndex; i > index; i--) {
                tl.to(bullets[i], {
                    delay: 0.07,
                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                    duration: 0.05,
                });

                tl.set(bullets[i - 1], {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                });

                gsap.to(img_divs[i], {
                    yPercent: 105,
                    duration: 0.3,
                    ease: 'power2.out',
                });

                gsap.to(img_divs[(i + 1) % img_divs.length], {
                    yPercent: 130,
                    duration: 0.3,
                    ease: 'power2.out',
                });

                gsap.to(img_divs[(i - 1 + img_divs.length) % img_divs.length], {
                    yPercent: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                });

                gsap.to(img_divs[(i - 2 + img_divs.length) % img_divs.length], {
                    yPercent: -105,
                    duration: 0.3,
                    ease: 'power2.out',
                });

                currentIndex = index;
                nextIndex = (currentIndex + 1) % counter_spans.length;
                prevIndex =
                    (currentIndex - 1 + counter_spans.length) %
                    counter_spans.length;
            }
        }
    });
});

bullterContainer.addEventListener('mouseenter', () => {
    gsap.to(bullets, {
        scaleX: 3,
        scaleY: 2.7,
        y: (i) => i * 9,
        duration: 0.6,
        ease: 'power2.out',
    });

    gsap.to(img_divs[prevIndex], {
        yPercent: -105,
        duration: 0.3,
        ease: 'power2.out',
    });

    gsap.to(img_divs[nextIndex], {
        yPercent: 105,
        duration: 0.3,
        ease: 'power2.out',
    });
});

bullterContainer.addEventListener('mouseleave', () => {
    // Reset all bullets to normal
    bullets.forEach((bullet, index) => {
        gsap.to(bullet, {
            scaleX: index === currentIndex ? 1.4 : 1,
            scaleY: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
        });
    });

    gsap.to(img_divs[prevIndex], {
        yPercent: -130,
        duration: 0.3,
        ease: 'power2.out',
    });

    gsap.to(img_divs[nextIndex], {
        yPercent: 130,
        duration: 0.3,
        ease: 'power2.out',
    });
});

// Initialize positions
function initializePositions() {
    counter_spans.forEach((span, index) => {
        if (index === currentIndex) {
            gsap.set(span, { yPercent: 0, opacity: 1 });
        } else if (
            index ===
            (currentIndex - 1 + counter_spans.length) % counter_spans.length
        ) {
            gsap.set(span, { yPercent: 100, opacity: 0 });
        } else {
            gsap.set(span, { yPercent: -100, opacity: 0 });
        }
    });

    title_spans.forEach((span, index) => {
        if (index === currentIndex) {
            gsap.set(span, { yPercent: 0, opacity: 1 });
        } else if (
            index ===
            (currentIndex - 1 + title_spans.length) % title_spans.length
        ) {
            gsap.set(span, { yPercent: 100, opacity: 0 });
        } else {
            gsap.set(span, { yPercent: -100, opacity: 0 });
        }
    });

    img_divs.forEach((div, index) => {
        if (index === currentIndex) {
            gsap.set(div, { yPercent: 0, opacity: 1 });
        } else if (
            index ===
            (currentIndex - 1 + img_divs.length) % img_divs.length
        ) {
            gsap.set(div, { yPercent: -130, opacity: 1 });
        } else {
            gsap.set(div, { yPercent: 130, opacity: 1 });
        }
    });
}

function onWheelDown() {
    if (isAnimating) return;

    const tl = gsap.timeline({
        onStart: () => {
            isAnimating = true;
        },
        onComplete: () => {
            isAnimating = false;

            currentIndex = nextIndex;
            nextIndex = (currentIndex + 1) % counter_spans.length;
            prevIndex =
                (currentIndex - 1 + counter_spans.length) %
                counter_spans.length;

            gsap.set(
                [
                    counter_spans[currentIndex],
                    title_spans[currentIndex],
                    img_divs[currentIndex],
                ],
                {
                    yPercent: 0,
                }
            );

            gsap.set([counter_spans[prevIndex], title_spans[prevIndex]], {
                yPercent: 100,
            });

            gsap.set(img_divs[prevIndex], {
                yPercent: -130,
            });

            gsap.set([counter_spans[nextIndex], title_spans[nextIndex]], {
                yPercent: -100,
            });

            gsap.set(img_divs[nextIndex], {
                yPercent: 130,
            });
        },
        onUpdate: () => {
            const progress = tl.progress();
            if (progress >= 0.4) {
                tl.set(
                    project_descriptions[nextIndex],
                    {
                        opacity: 1,
                    },
                    '<'
                );

                tl.to(
                    proj_desc_container,
                    {
                        opacity: 1,
                        duration: 0.2,
                    },
                    '<'
                );
            }
        },
    });

    // Moving previous content out
    tl.to(proj_desc_container, {
        opacity: 0,
        duration: 0.1,
    });

    tl.set(
        project_descriptions[currentIndex],
        {
            opacity: 0,
        },
        '<'
    );

    tl.to(
        counter_spans[currentIndex],
        {
            yPercent: 100,
            opacity: 0,
            duration: 3,
            ease: 'power2.out',
        },
        '<'
    );

    tl.to(
        title_spans[currentIndex],
        {
            yPercent: 100,
            opacity: 0,
            duration: 3,
            ease: 'power2.out',
        },
        '<'
    );

    tl.to(
        img_divs[currentIndex],
        {
            yPercent: -130,
            opacity: 1,
            duration: 2.6,
            ease: 'power2.out',
        },
        '<'
    );

    tl.to(
        bullets[currentIndex],
        {
            scaleX: 1,
            scaleY: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            duration: 1.6,
            ease: 'power2.out',
        },
        '<'
    );

    // Moving next content in
    tl.to(
        counter_spans[nextIndex],
        {
            yPercent: 0,
            opacity: 1,
            duration: 3,
            ease: 'power2.out',
        },
        '<'
    );

    tl.to(
        title_spans[nextIndex],
        {
            yPercent: 0,
            opacity: 1,
            duration: 3,
            ease: 'power2.out',
        },
        '<'
    );

    tl.to(
        img_divs[nextIndex],
        {
            yPercent: 0,
            opacity: 1,
            duration: 2.6,
            ease: 'power2.out',
        },
        '<'
    );

    tl.to(
        bullets[nextIndex],
        {
            scaleX: 1.4,
            scaleY: 1,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            duration: 1.6,
            ease: 'power2.out',
        },
        '<'
    );
}

function onWheelUp() {
    if (isAnimating) return;

    const tl = gsap.timeline({
        onStart: () => {
            isAnimating = true;
        },
        onComplete: () => {
            isAnimating = false;

            currentIndex = prevIndex;
            nextIndex = (currentIndex + 1) % counter_spans.length;
            prevIndex =
                (currentIndex - 1 + counter_spans.length) %
                counter_spans.length;

            gsap.set(
                [
                    counter_spans[currentIndex],
                    title_spans[currentIndex],
                    img_divs[currentIndex],
                ],
                {
                    yPercent: 0,
                }
            );

            gsap.set([counter_spans[prevIndex], title_spans[prevIndex]], {
                yPercent: 100,
            });

            gsap.set(img_divs[prevIndex], {
                yPercent: -130,
            });

            gsap.set([counter_spans[nextIndex], title_spans[nextIndex]], {
                yPercent: -100,
            });

            gsap.set(img_divs[nextIndex], {
                yPercent: 130,
            });
        },
        onUpdate: () => {
            const progress = tl.progress();
            if (progress >= 0.4) {
                tl.set(
                    project_descriptions[prevIndex],
                    {
                        opacity: 1,
                    },
                    '<'
                );

                tl.to(
                    proj_desc_container,
                    {
                        opacity: 1,
                        duration: 0.2,
                    },
                    '<'
                );
            }
        },
    });

    // Moving previous content out
    tl.to(proj_desc_container, {
        opacity: 0,
        duration: 0.1,
    });

    tl.set(
        project_descriptions[currentIndex],
        {
            opacity: 0,
        },
        '<'
    );

    tl.to(
        counter_spans[currentIndex],
        {
            yPercent: -100,
            opacity: 0,
            duration: 3,
            ease: 'power2.out',
        },
        '<'
    );

    tl.to(
        title_spans[currentIndex],
        {
            yPercent: -100,
            opacity: 0,
            duration: 3,
            ease: 'power2.out',
        },
        '<'
    );

    tl.to(
        img_divs[currentIndex],
        {
            yPercent: 130,
            opacity: 1,
            duration: 2.6,
            ease: 'power2.out',
        },
        '<'
    );

    tl.to(
        bullets[currentIndex],
        {
            scaleX: 1,
            scaleY: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            duration: 1.6,
            ease: 'power2.out',
        },
        '<'
    );

    // Moving next content in
    tl.to(
        counter_spans[prevIndex],
        {
            yPercent: 0,
            opacity: 1,
            duration: 3,
            ease: 'power2.out',
        },
        '<'
    );

    tl.to(
        title_spans[prevIndex],
        {
            yPercent: 0,
            opacity: 1,
            duration: 3,
            ease: 'power2.out',
        },
        '<'
    );

    tl.to(
        img_divs[prevIndex],
        {
            yPercent: 0,
            opacity: 1,
            duration: 2.6,
            ease: 'power2.out',
        },
        '<'
    );

    tl.to(
        bullets[prevIndex],
        {
            scaleX: 1.4,
            scaleY: 1,
            backgroundColor: 'rgba(255, 255, 255, 1)',
            duration: 1.6,
            ease: 'power2.out',
        },
        '<'
    );
}

Observer.create({
    type: 'wheel',
    onUp: (e) => {
        onWheelUp();
    },
    onDown: (e) => {
        onWheelDown();
    },
    preventDefault: true,
    wheelSpeed: 0.6,
});

initializePositions();
