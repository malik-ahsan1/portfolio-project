gsap.registerPlugin(Observer);

// const bullterContainer = document.querySelector('.bullets-container');
const bullets = Array.from(document.querySelectorAll('.project-bullet'));

// let activeBullet = document.querySelector('.project-bullet.active');
// let hoveredInSession = false;

// Track bullet hover
// bullets.forEach((bullet) => {
//     bullet.addEventListener('mouseenter', () => {
//         activeBullet.classList.remove('active');
//         bullet.classList.add('active');
//         activeBullet = bullet;
//         hoveredInSession = true;
//     });
// });

// bullterContainer.addEventListener('mouseenter', () => {
//     hoveredInSession = false;

//     gsap.to(bullets, {
//         scaleX: 3,
//         scaleY: 2.7,
//         y: (i) => i * 9,
//         duration: 0.6,
//         ease: 'power2.out',
//     });
// });

// bullterContainer.addEventListener('mouseleave', () => {
//     // Reset all bullets to normal
//     bullets.forEach((bullet) => {
//         gsap.to(bullet, {
//             scaleX: 1,
//             scaleY: 1,
//             y: 0,
//             duration: 0.6,
//             ease: 'power2.out',
//         });

//         bullet.classList.remove('active');
//     });

//     // Re-apply active state and scale to the last hovered bullet (or original)
//     if (activeBullet) {
//         activeBullet.classList.add('active');

//         gsap.to(activeBullet, {
//             scaleX: 1.4,
//             scaleY: 1,
//             duration: 0.6,
//             ease: 'power2.out',
//         });
//     }
// });

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
