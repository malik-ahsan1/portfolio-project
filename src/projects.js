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

let scrollTimeout = null;
let snapTween = null;

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

let currentSpan = 0;
let translateY = 0;
let imageTranslateY = 0;

function mapValue(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

// Initialize positions
function initializePositions() {
    counter_spans.forEach((span, index) => {
        if (index === currentSpan) {
            gsap.set(span, { yPercent: 0, opacity: 1 });
        } else if (
            index ===
            (currentSpan - 1 + counter_spans.length) % counter_spans.length
        ) {
            gsap.set(span, { yPercent: 100, opacity: 0 });
        } else {
            gsap.set(span, { yPercent: -100, opacity: 0 });
        }
    });

    title_spans.forEach((span, index) => {
        if (index === currentSpan) {
            gsap.set(span, { yPercent: 0, opacity: 1 });
        } else if (
            index ===
            (currentSpan - 1 + title_spans.length) % title_spans.length
        ) {
            gsap.set(span, { yPercent: 100, opacity: 0 });
        } else {
            gsap.set(span, { yPercent: -100, opacity: 0 });
        }
    });

    img_divs.forEach((div, index) => {
        if (index === currentSpan) {
            gsap.set(div, { yPercent: 0, opacity: 1 });
        } else if (
            index ===
            (currentSpan - 1 + img_divs.length) % img_divs.length
        ) {
            gsap.set(div, { yPercent: -130, opacity: 1 });
        } else {
            gsap.set(div, { yPercent: 130, opacity: 1 });
        }
    });
}

function update() {
    gsap.set(counter_spans[currentSpan], {
        yPercent: translateY,
        opacity: mapValue(Math.abs(translateY), 0, 100, 1, 0),
    });

    gsap.set(title_spans[currentSpan], {
        yPercent: translateY,
        opacity: mapValue(Math.abs(translateY), 0, 100, 1, 0),
    });

    gsap.set(bullets[currentSpan], {
        scaleX: mapValue(Math.abs(translateY), 100, 0, 1.1, 1.4),
        backgroundColor: `rgba(255, 255, 255, ${mapValue(
            Math.abs(translateY),
            100,
            0,
            0.4,
            1
        )})`,
    });

    gsap.set(img_divs[currentSpan], {
        yPercent: imageTranslateY,
    });

    if (translateY > 30 || translateY < -30) {
        if (translateY > 0 && imageTranslateY < 0) {
            if (translateY > 60 && imageTranslateY <= -60) {
                snapBack(true, false);
            } else {
                gsap.set(
                    counter_spans[(currentSpan + 1) % counter_spans.length],
                    {
                        yPercent: translateY - 30 - 100,
                        opacity: mapValue(
                            Math.abs(translateY - 30 - 100),
                            0,
                            100,
                            1,
                            0
                        ),
                    }
                );
                gsap.set(title_spans[(currentSpan + 1) % title_spans.length], {
                    yPercent: translateY - 30 - 100,
                    opacity: mapValue(
                        Math.abs(translateY - 30 - 100),
                        0,
                        100,
                        1,
                        0
                    ),
                });
                gsap.set(bullets[(currentSpan + 1) % bullets.length], {
                    scaleX: mapValue(Math.abs(translateY), 0, 100, 1.1, 1.4),
                    backgroundColor: `rgba(255, 255, 255, ${mapValue(
                        Math.abs(translateY),
                        0,
                        100,
                        0.4,
                        1
                    )})`,
                });
                gsap.set(img_divs[(currentSpan + 1) % img_divs.length], {
                    yPercent: imageTranslateY + 130,
                });
            }
        } else {
            if (translateY < -60 && imageTranslateY >= 60) {
                snapBack(false, true);
            } else {
                gsap.set(
                    counter_spans[
                        (currentSpan - 1 + counter_spans.length) %
                            counter_spans.length
                    ],
                    {
                        yPercent: translateY + 30 + 100,
                        opacity: mapValue(
                            Math.abs(translateY + 30 + 100),
                            0,
                            100,
                            1,
                            0
                        ),
                    }
                );
                gsap.set(
                    title_spans[
                        (currentSpan - 1 + title_spans.length) %
                            title_spans.length
                    ],
                    {
                        yPercent: translateY + 30 + 100,
                        opacity: mapValue(
                            Math.abs(translateY + 30 + 100),
                            0,
                            100,
                            1,
                            0
                        ),
                    }
                );
                gsap.set(
                    bullets[
                        (currentSpan - 1 + bullets.length) % bullets.length
                    ],
                    {
                        scaleX: mapValue(
                            Math.abs(translateY),
                            0,
                            100,
                            1.1,
                            1.4
                        ),
                        backgroundColor: `rgba(255, 255, 255, ${mapValue(
                            Math.abs(translateY),
                            0,
                            100,
                            0.4,
                            1
                        )})`,
                    }
                );
                gsap.set(
                    img_divs[
                        (currentSpan - 1 + img_divs.length) % img_divs.length
                    ],
                    {
                        yPercent: imageTranslateY - 130,
                    }
                );
            }
        }
    }
}

function snapBack(toNext = false, toPrev = false) {
    if (snapTween) snapTween.kill();
    isTransitioning = true;

    // If moving to next or prev, shift translateY to continue animation smoothly
    if (toNext || toPrev) {
        translateY = toNext ? translateY - 130 : translateY + 130;
        imageTranslateY = toNext ? imageTranslateY + 130 : imageTranslateY - 130;
    }

    project_descriptions[currentSpan].style.opacity = '0';

    if (toNext) {
        currentSpan = (currentSpan + 1) % counter_spans.length;
    } else if (toPrev) {
        currentSpan =
            (currentSpan - 1 + counter_spans.length) % counter_spans.length;
    }

    const nextIndex = (currentSpan + 1) % counter_spans.length;
    const prevIndex =
        (currentSpan - 1 + counter_spans.length) % counter_spans.length;

    const nextSpan = counter_spans[nextIndex];
    const prevSpan = counter_spans[prevIndex];

    const nextTitleSpan = title_spans[nextIndex];
    const prevTitleSpan = title_spans[prevIndex];

    const nextBullet = bullets[nextIndex];
    const prevBullet = bullets[prevIndex];

    const nextImageDiv = img_divs[nextIndex];
    const prevImageDiv = img_divs[prevIndex];

    const setCurrent = gsap.quickSetter(img_divs[currentSpan], 'yPercent');
    const setNext = gsap.quickSetter(nextImageDiv, 'yPercent');
    const setPrev = gsap.quickSetter(prevImageDiv, 'yPercent');

    const tweenData = { y: translateY, yImage: imageTranslateY };

    snapTween = gsap.to(tweenData, {
        y: 0,
        yImage: 0,
        duration: 2.2,
        ease: 'expo.out',
        onUpdate: function () {
            translateY = tweenData.y;
            imageTranslateY = tweenData.yImage;

            if (translateY < 25 && translateY > -25) {
                proj_desc_container.style.opacity = '1';
            }

            if (toNext || toPrev) {
                gsap.set(project_descriptions[currentSpan], {
                    opacity: mapValue(Math.abs(tweenData.y), 0, 30, 1, 0),
                });

                gsap.set(toNext ? prevSpan : nextSpan, {
                    yPercent: toNext ? tweenData.y + 130 : tweenData.y - 130,
                    opacity: mapValue(
                        Math.abs(
                            toNext ? tweenData.y + 130 : tweenData.y - 130
                        ),
                        0,
                        100,
                        1,
                        0
                    ),
                });

                gsap.set(toNext ? prevTitleSpan : nextTitleSpan, {
                    yPercent: toNext ? tweenData.y + 130 : tweenData.y - 130,
                    opacity: mapValue(
                        Math.abs(
                            toNext ? tweenData.y + 130 : tweenData.y - 130
                        ),
                        0,
                        100,
                        1,
                        0
                    ),
                });

                gsap.set(toNext ? prevBullet : nextBullet, {
                    scaleX: mapValue(
                        Math.abs(
                            toNext ? tweenData.y + 130 : tweenData.y - 130
                        ),
                        100,
                        0,
                        1.1,
                        1.4
                    ),
                    backgroundColor: `rgba(255, 255, 255, ${mapValue(
                        Math.abs(
                            toNext ? tweenData.y + 100 : tweenData.y - 100
                        ),
                        100,
                        0,
                        0.4,
                        1
                    )})`,
                });

                gsap.set(counter_spans[currentSpan], {
                    yPercent: tweenData.y,
                    opacity: mapValue(Math.abs(tweenData.y), 0, 100, 1, 0),
                });

                gsap.set(title_spans[currentSpan], {
                    yPercent: tweenData.y,
                    opacity: mapValue(Math.abs(tweenData.y), 0, 100, 1, 0),
                });

                gsap.set(bullets[currentSpan], {
                    scaleX: mapValue(Math.abs(tweenData.y), 100, 0, 1.1, 1.4),
                    backgroundColor: `rgba(255, 255, 255, ${mapValue(
                        Math.abs(tweenData.y),
                        100,
                        0,
                        0.4,
                        1
                    )})`,
                });

                if (toNext) {
                    setPrev(tweenData.yImage - 130);
                } else {
                    setNext(tweenData.yImage + 130);
                }
                setCurrent(tweenData.yImage);
            } else {
                gsap.set(project_descriptions[currentSpan], {
                    opacity: mapValue(Math.abs(tweenData.y), 0, 30, 1, 0),
                });

                gsap.set(bullets[currentSpan], {
                    scaleX: mapValue(Math.abs(tweenData.y), 100, 0, 1.1, 1.4),
                    backgroundColor: `rgba(255, 255, 255, ${mapValue(
                        Math.abs(tweenData.y),
                        100,
                        0,
                        0.4,
                        1
                    )})`,
                });

                gsap.set(tweenData.y > 0 ? nextBullet : prevBullet, {
                    scaleX: mapValue(
                        Math.abs(
                            tweenData.y > 0
                                ? tweenData.y - 130
                                : tweenData.y + 130
                        ),
                        100,
                        0,
                        1.1,
                        1.4
                    ),
                    backgroundColor: `rgba(255, 255, 255, ${mapValue(
                        Math.abs(
                            tweenData.y > 0
                                ? tweenData.y - 100
                                : tweenData.y + 100
                        ),
                        100,
                        0,
                        0.4,
                        1
                    )})`,
                });

                gsap.set(counter_spans[currentSpan], {
                    yPercent: tweenData.y,
                    opacity: mapValue(Math.abs(tweenData.y), 0, 100, 1, 0),
                });

                gsap.set(title_spans[currentSpan], {
                    yPercent: tweenData.y,
                    opacity: mapValue(Math.abs(tweenData.y), 0, 100, 1, 0),
                });

                gsap.set(counter_spans[nextIndex], {
                    yPercent: tweenData.y - 30 - 100,
                    opacity: mapValue(
                        Math.abs(tweenData.y - 30 - 100),
                        0,
                        100,
                        1,
                        0
                    ),
                });

                gsap.set(title_spans[nextIndex], {
                    yPercent: tweenData.y - 30 - 100,
                    opacity: mapValue(
                        Math.abs(tweenData.y - 30 - 100),
                        0,
                        100,
                        1,
                        0
                    ),
                });


                gsap.set(counter_spans[prevIndex], {
                    yPercent: tweenData.y + 30 + 100,
                    opacity: mapValue(
                        Math.abs(tweenData.y + 30 + 100),
                        0,
                        100,
                        1,
                        0
                    ),
                });

                gsap.set(title_spans[prevIndex], {
                    yPercent: tweenData.y + 30 + 100,
                    opacity: mapValue(
                        Math.abs(tweenData.y + 30 + 100),
                        0,
                        100,
                        1,
                        0
                    ),
                });

                setCurrent(tweenData.yImage);
                setNext(tweenData.yImage + 130);
                setPrev(tweenData.yImage - 130);

            }
        },
        onComplete: function () {
            translateY = 0;

            gsap.set(counter_spans[currentSpan], { yPercent: 0, opacity: 1 });
            gsap.set(counter_spans[nextIndex], { yPercent: -100, opacity: 0 });
            gsap.set(counter_spans[prevIndex], { yPercent: 100, opacity: 0 });

            gsap.set(title_spans[currentSpan], { yPercent: 0, opacity: 1 });
            gsap.set(title_spans[nextIndex], { yPercent: -100, opacity: 0 });
            gsap.set(title_spans[prevIndex], { yPercent: 100, opacity: 0 });

            gsap.set(img_divs[currentSpan], { yPercent: 0, opacity: 1 });
            gsap.set(img_divs[nextIndex], { yPercent: 130, opacity: 1 });
            gsap.set(img_divs[prevIndex], { yPercent: -130, opacity: 1 });
            snapTween = null;
            isTransitioning = false;
        },
    });
}

function onWheel(e) {
    e.preventDefault();

    proj_desc_container.style.opacity = '0';

    if (snapTween) {
        snapTween.kill();
        snapTween = null;
        isTransitioning = false;
    }

    clearTimeout(scrollTimeout);
    let deltaY = e.deltaY * 0.05;
    translateY += deltaY;
    imageTranslateY -= deltaY;
    update();

    scrollTimeout = setTimeout(() => {
        if (!isTransitioning && translateY > -60 && translateY < 60) {
            snapBack(); // just snap to center
        }
    }, 100);
}

initializePositions();
window.addEventListener('wheel', onWheel, { passive: false });
update();
