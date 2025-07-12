const isMobile =
    /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

if (!isMobile) {
    const mainWrapper = document.querySelector('.main-wrapper');
    mainWrapper.setAttribute('id', 'smooth-wrapper');
    document
        .querySelector('.main-wrapper > div')
        .setAttribute('id', 'smooth-content');
    let smoother = ScrollSmoother.create({
        wrapper: '#smooth-wrapper',
        content: '#smooth-content',
        smooth: 2,
        normalizeScroll: true, // optional: helps reduce inconsistencies
        effects: true, // needed if you use [data-speed] parallax
    });

    const scrollerEl = smoother.scrollTrigger.scroller; // <html> by default
    const maxScroll = ScrollTrigger.maxScroll(scrollerEl);

    let lastScroll = 0;
    let navbarIsHidden = false;

    scrollerEl.addEventListener('scroll', () => {
        const y = smoother.scrollTrigger.scroll();

        /* direction ----------------------------------------------------------- */
        if (y > lastScroll && !navbarIsHidden) {
            // scrolling down
            navbarIsHidden = true;
            hideNavbar();
        } else if (y < lastScroll && navbarIsHidden) {
            // scrolling up
            navbarIsHidden = false;
            showNavbar();
        }

        /* bottom of page ------------------------------------------------------ */
        if (y >= maxScroll - 1) {
            showNavbar(1);
        }

        lastScroll = y;
    });
}

if (isMobile) {
    const scrollEl = document.body; // This is your scroll container

    let lastY = scrollEl.scrollTop;
    let navbarHidden = false;

    scrollEl.addEventListener(
        'scroll',
        () => {
            requestAnimationFrame(() => {
                const currentY = scrollEl.scrollTop;

                // Scroll direction
                if (currentY > lastY + 4 && !navbarHidden) {
                    navbarHidden = true;
                    hideNavbar();
                } else if (currentY < lastY - 4 && navbarHidden) {
                    navbarHidden = false;
                    showNavbar();
                }

                // Reached bottom of scroll container
                const atBottom =
                    currentY + scrollEl.clientHeight >=
                    scrollEl.scrollHeight - 1;
                if (atBottom) {
                    navbarHidden = false;
                    showNavbar();
                }

                lastY = currentY;
            });
        },
        { passive: true }
    );
}

// =============================================================================
// NAVBAR ANIMATION
// =============================================================================

const navbar = document.querySelector('#main-nav');

function hideNavbar(delay = 0) {
    gsap.to(navbar, {
        yPercent: -100,
        duration: 1,
        delay: delay,
        ease: 'power2.out',
    });
}

function showNavbar(delay = 0) {
    gsap.to(navbar, {
        yPercent: 0,
        duration: 1,
        delay: delay,
        ease: 'power2.out',
    });
}

// =============================================================================
// PARAGRAPH ANIMATION
// =============================================================================

function initializeParagraphAnimation(para) {
    gsap.set(para, {
        yPercent: 100,
        opacity: 0,
    });
}

function animateParagraph(para, duration = 0.4, delay = 0.4, stagger = 0.1) {
    gsap.to(para, {
        yPercent: 0,
        opacity: 1,
        duration: duration,
        ease: 'power2.out',
        delay: delay,
        stagger: stagger,
        scrollTrigger: {
            trigger: para[0], // element that triggers scroll
            start: 'top 80%', // trigger when top of element hits 80% of viewport
        },
    });
}

// =============================================================================
// MAIN CIRCLE ANIMATION
// =============================================================================

// Main circle elements and configuration
const radius = 90;
const circumference = 2 * Math.PI * radius;

// Initialize main circle animation
function initializeMainCircle(mainCircle) {
    // Set initial opacity
    mainCircle.forEach((circle) => {
        circle.style.opacity = '0';
    });

    // Set initial state - circle is invisible
    mainCircle.forEach((circle) => {
        gsap.set(circle, {
            strokeDasharray: circumference,
            strokeDashoffset: circumference,
            transformOrigin: 'center center',
        });
    });
}

let arrowTween = null;

// Animate main circle drawing
function animateCircle(mainCircle, innerContent) {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: mainCircle[0], // element that triggers scroll
            start: 'top 80%', // trigger when top of element hits 80% of viewport
        },
    });

    // Animate the circle drawing and rotation
    mainCircle.forEach((circle) => {
        gsap.to(circle, {
            rotate: 360,
            strokeDashoffset: 0,
            opacity: 2,
            duration: 2.2,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: mainCircle[0], // element that triggers scroll
                start: 'top 80%', // trigger when top of element hits 80% of viewport
            },
        });
    });

    // Animate arrow appearance
    arrowTween = gsap.to(innerContent, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: mainCircle[0], // element that triggers scroll
            start: 'top 80%', // trigger when top of element hits 80% of viewport
        },
    });

    return tl;
}

// =============================================================================
// CIRCLE INTERACTION
// =============================================================================

// Hero circle state variables
let isHovering = false;
const maxDistance = 110; // Maximum distance the circle can move from center

// Initialize circle interactions
function initializeCircle(
    detectionArea,
    topCircle,
    bottomCircle,
    getInnerContent,
    onClick,
    mouseenter,
    mouseleave
) {
    // Set initial arrow state
    gsap.set(getInnerContent(), {
        opacity: 0,
        x: 0,
        y: -25,
    });

    // Click event
    detectionArea.addEventListener('click', onClick);

    // Mouse enter event
    detectionArea.addEventListener('mouseenter', mouseenter);

    // Mouse leave event
    detectionArea.addEventListener('mouseleave', mouseleave);

    // Mouse move event
    detectionArea.addEventListener('mousemove', (e) => {
        if (!isHovering) return;
        if (arrowTween) arrowTween.kill();

        // Get container bounds
        const rect = detectionArea.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate mouse position relative to container center
        const mouseX = e.clientX - rect.left - centerX;
        const mouseY = e.clientY - rect.top - centerY;

        // Calculate distance from center
        const distance = Math.sqrt(mouseX * mouseX + mouseY * mouseY);

        let targetX, targetY;

        if (distance <= maxDistance) {
            // Mouse is within allowed range
            targetX = mouseX;
            targetY = mouseY;
        } else {
            // Limit movement to maxDistance
            const angle = Math.atan2(mouseY, mouseX);
            targetX = Math.cos(angle) * maxDistance;
            targetY = Math.sin(angle) * maxDistance;
        }

        // Animate elements to follow mouse
        gsap.to(topCircle, {
            x: targetX,
            y: targetY,
            duration: 1.5,
            ease: 'expo.out',
        });

        gsap.to(bottomCircle, {
            x: targetX * 0.3,
            y: targetY * 0.3,
            duration: 1.5,
            ease: 'expo.out',
        });

        gsap.to(getInnerContent(), {
            x: targetX * 0.35,
            y: targetY * 0.35,
            duration: 1.5,
            ease: 'expo.out',
        });
    });
}

// =============================================================================
// LINE ANIMATION FUNCTIONALITY
// =============================================================================

// Calculate line length for stroke-dash animation
export function calculateLineLength(animatedLine) {
    const svg = animatedLine.closest('svg');
    const rect = svg.getBoundingClientRect();
    return rect.width;
}

// Set initial state - line is invisible
function initializeLine(animatedLine) {
    let lineLength = calculateLineLength(animatedLine);

    gsap.set(animatedLine, {
        strokeDasharray: lineLength,
        strokeDashoffset: lineLength,
    });
}

// Animate line drawing from left to right
export function drawLine(animatedLine, duration = 1.5) {
    // Animate the line drawing
    gsap.to(animatedLine, {
        strokeDashoffset: 0,
        duration: duration,
        ease: 'power2.inOut',

        scrollTrigger: {
            trigger: animatedLine, // element that triggers scroll
            start: 'top 80%', // trigger when top of element hits 80% of viewport
        },
    });
}

// =============================================================================
// HEADER ANIMATION
// =============================================================================

function initializeHeader(header) {
    gsap.set(header, {
        y: 20,
        opacity: 0,
    });
}

function animateHeader(header) {
    gsap.to(header, {
        y: 0,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.5,
        scrollTrigger: {
            trigger: header, // element that triggers scroll
            start: 'top 80%', // trigger when top of element hits 80% of viewport
        },
    });
}

// =============================================================================
// MOVING STRIPE ANIMATION
// =============================================================================

function createLiquidHorizontalScroll(
    movingStrip,
    duration = 8,
    direction = 'left'
) {
    gsap.to(movingStrip, {
        xPercent: direction === 'left' ? -100 : 100,
        ease: 'none',
        duration: duration,
        repeat: -1,
        modifiers: {
            xPercent: gsap.utils.wrap(-100, 0),
        },
    });
}

// =============================================================================
// FEATURED PRODUCTS ANIMATION
// =============================================================================

const featuredProjectTitles = Array.from(
    document.querySelectorAll('.project-title-featured span')
);

featuredProjectTitles.forEach((project) => {
    gsap.set(project, {
        yPercent: 100,
        opacity: 0,
    });
});

const projectImages = [
    document.querySelector('.img1'),
    document.querySelector('.img2'),
    document.querySelector('.img3'),
];

const projectInfos = [
    document.querySelector('.img1-info'),
    document.querySelector('.img2-info'),
    document.querySelector('.img3-info'),
];

const hoverText = document.querySelector('#hoverText');

// Initialize project hover interactions
function initializeProjectHover() {
    projectImages.forEach((image, index) => {
        if (!image) return;

        const overlays = projectImages.map((img) =>
            img.querySelector('.overlay')
        );

        image.addEventListener('mouseenter', () => {
            // Show hover text
            gsap.set([hoverText, projectInfos[index]], { opacity: 1 });

            // Animate current title
            gsap.to(featuredProjectTitles[index], {
                yPercent: 0,
                opacity: 1,
                duration: 0.15,
                ease: 'power1.out',
            });

            // Fade in overlays on other images
            overlays.forEach((overlay, i) => {
                if (i !== index) {
                    gsap.to(overlay, {
                        opacity: 1,
                        duration: 0.15,
                        ease: 'power1.out',
                    });
                }
            });
        });

        image.addEventListener('mouseleave', () => {
            // Hide hover text
            gsap.set([hoverText, projectInfos[index]], { opacity: 0 });

            // Hide current title
            gsap.to(featuredProjectTitles[index], {
                yPercent: -100,
                opacity: 0,
                duration: 0.15,
                ease: 'power1.out',
                onComplete: () => {
                    gsap.set(featuredProjectTitles[index], {
                        yPercent: 100,
                    });
                },
            });

            // Fade out all overlays
            overlays.forEach((overlay) => {
                gsap.to(overlay, {
                    opacity: 0,
                    duration: 0.15,
                    ease: 'power1.out',
                });
            });
        });
    });
}

// =============================================================================
// DOM ELEMENTS FOR PARAGRAPH ANIMATION
// =============================================================================
const heroPara = document.querySelectorAll('.hero-description > span > span');
const introPara = document.querySelectorAll('.intro-para > span > span');
const projectsPara = document.querySelectorAll(
    '.projects-description > span > span'
);

// =============================================================================
// DOM ELEMENTS FOR CIRCLE ANIMATION
// =============================================================================
const detectionAreaHero = document.getElementById('circle-area-hero');
const topCircleHero = document.querySelector('.circle-area-hero__top-circle');
const bottomCircleHero = document.querySelector(
    '.circle-area-hero__bottom-circle'
);
const mainCircleHero = Array.from(
    document.querySelectorAll('.mainCircle-hero')
);
const innerContentHero = document.querySelector('.circle-area-hero__arrow');

// Hero circle interaction functions
function onClickHeroCircle() {
    gsap.to(scrollObj, {
        y: -1104,
        duration: 2.2,
        ease: 'expo.inOut',
        onUpdate: () => {
            targetY = scrollObj.y;
        },
    });
}

function mouseenterHeroCircle() {
    isHovering = true;
}

function mouseleaveHeroCircle() {
    isHovering = false;
    // Return to resting position (center)
    gsap.to([topCircleHero, bottomCircleHero, innerContentHero], {
        x: 0,
        y: 0,
        duration: 1.5,
        ease: 'expo.out',
    });
}

// Intro circle interaction
const detectionAreaIntro = document.getElementById('circle-area-intro');
const topCircleIntro = document.querySelector('.circle-area-intro__top-circle');
const bottomCircleIntro = document.querySelector(
    '.circle-area-intro__bottom-circle'
);
const mainCircleIntro = Array.from(
    document.querySelectorAll('.mainCircle-intro')
);
let innerContentIntro = document.querySelector('.learn-more-btn__text');

function mouseenterIntroCircle() {
    isHovering = true;

    innerContentIntro.style.opacity = '0';
    innerContentIntro = document.querySelector('.circle-area-intro__arrow');
    innerContentIntro.style.opacity = '1';
}

function mouseleaveIntroCircle() {
    isHovering = false;

    innerContentIntro.style.opacity = '0';
    innerContentIntro = document.querySelector('.learn-more-btn__text');
    innerContentIntro.style.opacity = '1';

    // Return to resting position (center)
    gsap.to([topCircleIntro, bottomCircleIntro, innerContentIntro], {
        x: 0,
        y: 0,
        duration: 1.5,
        ease: 'expo.out',
    });
}

// DOM elements for projects circle
const detectionAreaProjects = document.getElementById('circle-area-projects');
const topCircleProjects = document.querySelector(
    '.circle-area-projects__top-circle'
);
const bottomCircleProjects = document.querySelector(
    '.circle-area-projects__bottom-circle'
);
const mainCircleProjects = Array.from(
    document.querySelectorAll('.mainCircle-projects')
);
let innerContentProjects = document.querySelector('.view-all-projects__text');

function mouseenterProjectsCircle() {
    isHovering = true;

    innerContentProjects.style.opacity = '0';
    innerContentProjects = document.querySelector(
        '.circle-area-projects__arrow'
    );
    innerContentProjects.style.opacity = '1';
}

function mouseleaveProjectsCircle() {
    isHovering = false;

    innerContentProjects.style.opacity = '0';
    innerContentProjects = document.querySelector('.view-all-projects__text');
    innerContentProjects.style.opacity = '1';

    // Return to resting position (center)
    gsap.to([topCircleProjects, bottomCircleProjects, innerContentProjects], {
        x: 0,
        y: 0,
        duration: 1.5,
        ease: 'expo.out',
    });
}

// Dom elements for message me cricle
const detectionAreaMessage = document.getElementById('circle-area-message-me');
const topCircleMessage = document.querySelector(
    '.circle-area-message-me__top-circle'
);
const bottomCircleMessage = document.querySelector(
    '.circle-area-message-me__bottom-circle'
);
const mainCircleMessage = Array.from(
    document.querySelectorAll('.mainCircle-message-me')
);
let innerContentMessage = document.querySelector('.view-all-message-me__text');

function mouseenterMessageCircle() {
    isHovering = true;

    innerContentMessage.style.opacity = '0';
    innerContentMessage = document.querySelector(
        '.circle-area-message-me__arrow'
    );
    innerContentMessage.style.opacity = '1';
}

function mouseleaveMessageCircle() {
    isHovering = false;

    innerContentMessage.style.opacity = '0';
    innerContentMessage = document.querySelector('.view-all-message-me__text');
    innerContentMessage.style.opacity = '1';

    // Return to resting position (center)
    gsap.to([topCircleMessage, bottomCircleMessage, innerContentMessage], {
        x: 0,
        y: 0,
        duration: 1.5,
        ease: 'expo.out',
    });
}

// =============================================================================
// DOM ELEMENTS FOR LINE ANIMATION
// =============================================================================
const animatedLineIntro = document.getElementById('animated-line-intro');
const animatedLineProjects = document.getElementById('animated-line-projects');
const animatedLineCapabilities = document.getElementById(
    'animated-line-capabilities'
);

// =============================================================================
// DOM ELEMENTS FOR HEADER ANIMATION
// =============================================================================
const aboutHeader = document.querySelector('.about-header');
const projectsHeader = document.querySelector('.projects-header');
const capabilitiesHeader = document.querySelector('.capabilities-header');

// =============================================================================
// DOM ELEMENTS FOR MOVING STRIPE ANIMATION
// =============================================================================

const nameMovingStrip = document.querySelectorAll('.marquee');
const multiMovingStrip = document.querySelectorAll('.home-multi-c--touch');
const discMovingStrip = document.querySelectorAll('.home-disc-c--touch');
const desigMovingStrip = document.querySelectorAll('.home-desig-c--touch');

// Initialize all functionality when page loads
window.addEventListener('load', () => {
    ScrollTrigger.refresh();

    if (!isMobile) {
        initializeParagraphAnimation(heroPara);
        initializeCircle(
            detectionAreaHero,
            topCircleHero,
            bottomCircleHero,
            () => innerContentHero,
            onClickHeroCircle,
            mouseenterHeroCircle,
            mouseleaveHeroCircle
        );
        initializeMainCircle(mainCircleHero, () => innerContentHero);

        initializeLine(animatedLineIntro);
        drawLine(animatedLineIntro);

        initializeHeader(aboutHeader);
        animateHeader(aboutHeader);

        initializeParagraphAnimation(introPara);
        animateParagraph(introPara);

        initializeCircle(
            detectionAreaIntro,
            topCircleIntro,
            bottomCircleIntro,
            () => innerContentIntro,
            () => {},
            mouseenterIntroCircle,
            mouseleaveIntroCircle
        );
        initializeMainCircle(mainCircleIntro, () => innerContentIntro);
        animateCircle(mainCircleIntro, innerContentIntro);
    }

    if (isMobile) {
        document.querySelector('.stripWrap--touch').classList.add('bottom-64');
    }

    createLiquidHorizontalScroll(nameMovingStrip, 7, 'left');
    createLiquidHorizontalScroll(multiMovingStrip, 8);
    createLiquidHorizontalScroll(discMovingStrip, 13, 'r');
    createLiquidHorizontalScroll(desigMovingStrip, 12);

    if (!isMobile) {
        initializeLine(animatedLineProjects);
        drawLine(animatedLineProjects);

        initializeHeader(projectsHeader);
        animateHeader(projectsHeader);

        initializeParagraphAnimation(projectsPara);
        animateParagraph(projectsPara, 0.4, 0, 0.13);

        initializeCircle(
            detectionAreaProjects,
            topCircleProjects,
            bottomCircleProjects,
            () => innerContentProjects,
            () => {},
            mouseenterProjectsCircle,
            mouseleaveProjectsCircle
        );
        initializeMainCircle(mainCircleProjects, () => innerContentProjects);
        animateCircle(mainCircleProjects, innerContentProjects);

        initializeProjectHover();

        initializeLine(animatedLineCapabilities);
        drawLine(animatedLineCapabilities);

        initializeHeader(capabilitiesHeader);
        animateHeader(capabilitiesHeader);

        initializeCircle(
            detectionAreaMessage,
            topCircleMessage,
            bottomCircleMessage,
            () => innerContentMessage,
            () => {},
            mouseenterMessageCircle,
            mouseleaveMessageCircle
        );
        initializeMainCircle(mainCircleMessage, () => innerContentMessage);
        animateCircle(mainCircleMessage, innerContentMessage);
    }

    // // Start main circle animation after delay
    setTimeout(() => {
        if (!isMobile) {
            animateParagraph(heroPara, 0.4, 0, 0.1);
            animateCircle(mainCircleHero, innerContentHero);
        }
    }, 200);
});
