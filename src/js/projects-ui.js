gsap.registerPlugin(Observer, SplitText);

// keep this outside so you can kill it later if needed
let idleTween = null;
let idleTimeout = null;

let progress = 0;
const SPEED = 0.0007;
const clamp = gsap.utils.clamp(0, 1);

let infoMovedUp = false;
let infoMovedDown = false;
let isAnimating = false;

const cards = Array.from(document.querySelectorAll('.card'));
const numbers = Array.from(document.querySelectorAll('.rotating-numbers span'));
const names = Array.from(document.querySelectorAll('.rotating-names span'));
const years = Array.from(document.querySelectorAll('.rotating-years span'));
const roles = Array.from(document.querySelectorAll('.rotating-roles span'));
const imageMap = Array.from(document.querySelectorAll('.image-mask'));
const descriptions = Array.from(
    document.querySelectorAll('.rotating-descriptions .desc-block')
);

const descLineSplits = [];

document.fonts.ready.then(() => {
    descriptions.forEach((desc, index) => {
        const split = SplitText.create(desc, {
            type: 'lines',
            linesClass: 'description-line',
            autoSplit: true,
            mask: 'lines',
        });

        // Hide all except the first
        if (index > 0) {
            gsap.set(split.lines, {
                yPercent: 100,
                opacity: 0,
            });

            // Also hide the container span
            gsap.set(desc, {
                zIndex: 0,
            });
        } else {
            gsap.set(desc, {
                zIndex: 1,
            });
        }

        descLineSplits.push(split);
    });
});

let currentIndex = 0;
let nextIndex = (currentIndex + 1) % cards.length;
let prevIndex = (currentIndex - 1 + cards.length) % cards.length;

function moveImagesUp(val) {
    gsap.to(cards[currentIndex], {
        duration: 1,
        ease: 'expo.out',
        clipPath: `polygon(0% 0%, ${100 - val}% 0%, ${100 - val}% ${
            100 - val
        }%, 0% ${100 - val}%)`,
    });

    gsap.to(cards[currentIndex].querySelector('.img-wrapper'), {
        scale: 1 - gsap.utils.interpolate(0, 0.4, val / 100),
    });

    gsap.to(cards[currentIndex].querySelector('img'), {
        duration: 1,
        ease: 'expo.out',
        translateX: `${gsap.utils.interpolate(0, -50, val / 100)}%`,
        translateY: `${gsap.utils.interpolate(0, -50, val / 100)}%`,
    });

    gsap.to(cards[nextIndex], {
        duration: 1,
        ease: 'expo.out',
        clipPath: `polygon(${100 - val}% ${100 - val}%, 100% ${
            100 - val
        }%, 100% 100%, ${100 - val}% 100%)`,
    });

    gsap.to(cards[nextIndex].querySelector('.img-wrapper'), {
        scale: 1.4 - gsap.utils.interpolate(0, 0.4, val / 100),
    });

    gsap.to(cards[nextIndex].querySelector('img'), {
        duration: 1,
        ease: 'expo.out',
        translateX: `${50 - gsap.utils.interpolate(0, 50, val / 100)}%`,
        translateY: `${50 - gsap.utils.interpolate(0, 50, val / 100)}%`,
    });
}

function moveImagesDown(val) {
    gsap.to(cards[currentIndex], {
        duration: 1,
        ease: 'expo.out',
        clipPath: `polygon(0% 0%, ${100 - val}% 0%, ${100 - val}% ${
            100 - val
        }%, 0% ${100 - val}%)`,
    });

    gsap.to(cards[currentIndex].querySelector('.img-wrapper'), {
        scale: 1 - gsap.utils.interpolate(0, 0.4, val / 100),
    });

    gsap.to(cards[currentIndex].querySelector('img'), {
        duration: 1,
        ease: 'expo.out',
        translateX: `${gsap.utils.interpolate(0, -50, val / 100)}%`,
        translateY: `${gsap.utils.interpolate(0, -50, val / 100)}%`,
    });

    gsap.to(cards[nextIndex], {
        duration: 1,
        ease: 'expo.out',
        clipPath: `polygon(${100 - val}% ${100 - val}%, 100% ${
            100 - val
        }%, 100% 100%, ${100 - val}% 100%)`,
    });

    gsap.to(cards[nextIndex].querySelector('.img-wrapper'), {
        scale: 1.4 - gsap.utils.interpolate(0, 0.4, val / 100),
    });

    gsap.to(cards[nextIndex].querySelector('img'), {
        duration: 1,
        ease: 'expo.out',
        translateX: `${50 - gsap.utils.interpolate(0, 50, val / 100)}%`,
        translateY: `${50 - gsap.utils.interpolate(0, 50, val / 100)}%`,
    });
}

function moveInfoUp() {
    gsap.to(
        [
            names[currentIndex],
            numbers[currentIndex],
            roles[currentIndex],
            years[currentIndex],
        ],
        {
            duration: 1,
            ease: 'power2.out',
            translateY: '-100%',
            opacity: '0',
            onComplete: () => {
                infoMovedUp = false; // Set infoMoved to true when starting the animation
            },
        }
    );

    // 1. Hide current paragraph
    gsap.set(descLineSplits[currentIndex].lines, {
        yPercent: -100,
        opacity: 0,
    });
    // Lower its z-index
    gsap.set(descriptions[currentIndex], { zIndex: 0 });

    const currentImage = imageMap[currentIndex];

    gsap.to(currentImage, {
        height: '0px',
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
            gsap.set(currentImage, {
                borderRadius: '9999px',
            });
        },
    });

    gsap.to(currentImage.querySelector('.image-inner'), {
        duration: 1,
        ease: 'power2.out',
        borderWidth: '0px',
    });

    gsap.to(
        [
            names[nextIndex],
            numbers[nextIndex],
            roles[nextIndex],
            years[nextIndex],
        ],
        {
            duration: 1,
            ease: 'power2.out',
            translateY: '0%',
            opacity: '1',
        }
    );

    // 2. Show next paragraph
    gsap.set(descriptions[nextIndex], { zIndex: 1 });

    gsap.to(descLineSplits[nextIndex].lines, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.1,
        ease: 'power2.out',
    });

    const nextImage = imageMap[nextIndex];

    gsap.set(nextImage, {
        borderRadius: '0px',
    });

    gsap.to(nextImage, {
        height: '94px',
        duration: 1,
        ease: 'power2.out',
    });

    gsap.to(nextImage.querySelector('.image-inner'), {
        duration: 1,
        ease: 'power2.out',
        borderWidth: '4px',
    });
}

function moveInfoDown() {
    gsap.to(
        [
            names[currentIndex],
            numbers[currentIndex],
            roles[currentIndex],
            years[currentIndex],
        ],
        {
            duration: 1,
            ease: 'power2.out',
            translateY: '0%',
            opacity: '1',
            onComplete: () => {
                infoMovedDown = false; // Set infoMoved to true when starting the animation
            },
        }
    );

    // 2. Show next paragraph
    gsap.set(descriptions[currentIndex], { zIndex: 1 });

    gsap.to(descLineSplits[currentIndex].lines, {
        yPercent: 0,
        opacity: 1,
        stagger: 0.1,
        ease: 'power2.out',
    });

    const currentImage = imageMap[currentIndex];

    gsap.set(currentImage, {
        borderRadius: '0px',
    });

    gsap.to(currentImage, {
        height: '94px',
        duration: 1,
        ease: 'power2.out',
    });

    gsap.to(currentImage.querySelector('.image-inner'), {
        duration: 1,
        ease: 'power2.out',
        borderWidth: '4px',
    });

    gsap.to(
        [
            names[nextIndex],
            numbers[nextIndex],
            roles[nextIndex],
            years[nextIndex],
        ],
        {
            duration: 1,
            ease: 'power2.out',
            translateY: '100%',
            opacity: '0',
        }
    );

    // 1. Hide current paragraph
    gsap.set(descLineSplits[nextIndex].lines, {
        yPercent: 100,
        opacity: 0,
    });
    // Lower its z-index
    gsap.set(descriptions[nextIndex], { zIndex: 0 });

    const nextImage = imageMap[nextIndex];

    gsap.to(nextImage, {
        height: '0px',
        duration: 1,
        ease: 'power2.out',
        onComplete: () => {
            gsap.set(nextImage, {
                borderRadius: '9999px',
            });
        },
    });

    gsap.to(nextImage.querySelector('.image-inner'), {
        duration: 1,
        ease: 'power2.out',
        borderWidth: '0px',
    });
}

function scheduleIdleSnapInfoDown() {
    clearTimeout(idleTimeout); // reset the 500 ms / 2 s timer
    idleTimeout = setTimeout(() => {
        // only run if user left us in the middle
        if (progress > 0 && progress < 1) {

            // kill a previous idle tween if one is still running
            if (idleTween) idleTween.kill();

            const tweenObj = { value: progress }; // store current progress

            idleTween = gsap.to(tweenObj, {
                value: 0,
                duration: 0.5,
                ease: 'power2.out',
                onUpdate() {
                    progress = tweenObj.value; // keep your global in sync
                    moveImagesDown(progress * 100); // redraw

                    if (progress <= 0.25 && !infoMovedDown) {
                        infoMovedDown = true;
                        moveInfoDown(); // move info down
                    }
                },
                onComplete() {
                    idleTween = null; // tidy up
                },
            });
        }
    }, 1500);
}

function scheduleIdleSnapInfoUp() {
    clearTimeout(idleTimeout); // reset the 500 ms / 2 s timer
    idleTimeout = setTimeout(() => {
        // only run if user left us in the middle
        if (progress > 0 && progress < 1) {

            // kill a previous idle tween if one is still running
            if (idleTween) idleTween.kill();

            const tweenObj = { value: progress }; // store current progress

            idleTween = gsap.to(tweenObj, {
                value: 1,
                duration: 0.5,
                ease: 'power2.out',
                onUpdate() {
                    progress = tweenObj.value; // keep your global in sync
                    moveImagesUp(progress * 100); // redraw

                    if (progress >= 0.75 && !infoMovedUp) {
                        infoMovedUp = true;
                        moveInfoUp(); // move info down
                    }
                },
                onComplete() {
                    idleTween = null; // tidy up
                },
            });
        }
    }, 1500);
}

Observer.create({
    type: 'wheel,touch,pointer',
    onUp: (self) => {
        if (self.deltaY < 0 && currentIndex < 0) {
            return;
        }

        if (progress <= 0 && currentIndex > 0) {
            currentIndex--;
            nextIndex = Math.min(currentIndex + 1, cards.length - 1);
            progress = 1; // Reset progress for previous card
            infoMovedDown = false; // Reset infoMoved for next scroll
        }

        if (progress <= 0.25 && !infoMovedDown) {
            infoMovedDown = true;
            moveInfoDown();
        }

        progress += self.deltaY * SPEED;
        progress = clamp(progress);

        moveImagesDown(progress * 100);

        scheduleIdleSnapInfoDown();
    },
    onDown: (self) => {
        if (self.deltaY > 0 && currentIndex === cards.length - 1) return; // at last card, scrolling down

        progress += self.deltaY * SPEED;
        progress = clamp(progress);

        moveImagesUp(progress * 100);

        if (progress >= 0.75 && !infoMovedUp) {
            infoMovedUp = true;
            moveInfoUp();
        }

        if (progress >= 1) {
            if (currentIndex < cards.length - 1) {
                currentIndex++;
                nextIndex = Math.min(currentIndex + 1, cards.length - 1);
                progress = 0;
                infoMovedUp = false; // Reset infoMoved for next scroll
            }
        }

        scheduleIdleSnapInfoUp();
    },
    preventDefault: true,
    wheelSpeed: 0.6,
});
