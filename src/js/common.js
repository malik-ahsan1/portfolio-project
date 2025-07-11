// import { drawLine } from './index.js';

// // Settings
// const MIN_BLOBS = 8;
// const MAX_BLOBS = 14;
// const BLOB_POINTS = 10;
// const BLUR = 60;

// let WIDTH = window.innerWidth;
// let HEIGHT = window.innerHeight;

// const canvas = document.getElementById('liquid-bg');
// canvas.width = WIDTH;
// canvas.height = HEIGHT;
// const ctx = canvas.getContext('2d');

// function random(min, max) {
//     return min + Math.random() * (max - min);
// }

// function makeBlob() {
//     const cx = random(WIDTH * 0.1, WIDTH * 0.9);
//     const cy = random(HEIGHT * 0.1, HEIGHT * 0.9);
//     const r = random(WIDTH * 0.08, WIDTH * 0.18);
//     const points = [];

//     for (let i = 0; i < BLOB_POINTS; i++) {
//         const angle = (i / BLOB_POINTS) * Math.PI * 2;
//         points.push({
//             angle,
//             r: r * random(0.85, 1.15),
//             speed: random(0.004, 0.008),
//             phase: random(0, Math.PI * 2),
//             base: r,
//         });
//     }

//     return {
//         cx,
//         cy,
//         r,
//         points,
//         alpha: 0,
//         targetAlpha: random(0.15, 0.28),
//         growing: true,
//         life: random(20, 35) * 1000,
//         birth: performance.now(),
//     };
// }

// let blobs = [];

// function respawnBlobs(t) {
//     if (!blobs.respawnAt || t > blobs.respawnAt) {
//         const target = Math.round(random(MIN_BLOBS, MAX_BLOBS));
//         if (blobs.length > target) {
//             const toFade = blobs
//                 .filter((b) => b.growing)
//                 .slice(0, blobs.length - target);
//             for (const blob of toFade) blob.growing = false;
//         } else if (blobs.length < target) {
//             for (let i = 0; i < target - blobs.length; i++) {
//                 blobs.push(makeBlob());
//             }
//         }
//         blobs.respawnAt = t + random(6000, 12000);
//     }
// }

// function animateBlobs(blobs, t) {
//     respawnBlobs(t);
//     for (let i = blobs.length - 1; i >= 0; i--) {
//         const blob = blobs[i];
//         blob.cx += Math.sin(t / 5000 + i) * 0.35;
//         blob.cy += Math.cos(t / 4200 + i) * 0.33;

//         for (const pt of blob.points) {
//             pt.r = pt.base + Math.sin(t * pt.speed + pt.phase) * blob.r * 0.008; // very calm
//         }

//         if (blob.growing && blob.alpha < blob.targetAlpha) {
//             blob.alpha += 0.0025 * (blob.targetAlpha - blob.alpha);
//         } else if (!blob.growing) {
//             blob.alpha -= 0.0035;
//             if (blob.alpha <= 0) blobs.splice(i, 1);
//         }

//         if (blob.growing && t - blob.birth > blob.life) {
//             blob.growing = false;
//         }
//     }
// }

// function drawBlob(blob) {
//     ctx.save();
//     ctx.beginPath();

//     const pts = blob.points;
//     let first = true;

//     for (let i = 0; i < pts.length; i++) {
//         const p1 = pts[i];
//         const p2 = pts[(i + 1) % pts.length];
//         const angle1 = p1.angle;
//         const angle2 = p2.angle;
//         const x1 = blob.cx + Math.cos(angle1) * p1.r;
//         const y1 = blob.cy + Math.sin(angle1) * p1.r;
//         const x2 = blob.cx + Math.cos(angle2) * p2.r;
//         const y2 = blob.cy + Math.sin(angle2) * p2.r;

//         const cx = (x1 + x2) / 2;
//         const cy = (y1 + y2) / 2;

//         if (first) {
//             ctx.moveTo(cx, cy);
//             first = false;
//         } else {
//             ctx.quadraticCurveTo(x1, y1, cx, cy);
//         }
//     }

//     ctx.closePath();
//     ctx.globalAlpha = blob.alpha;
//     ctx.filter = `blur(${BLUR}px)`;
//     ctx.fillStyle = '#fff';
//     ctx.globalCompositeOperation = 'lighten';
//     ctx.fill();
//     ctx.restore();
// }

// function render(t) {
//     ctx.clearRect(0, 0, WIDTH, HEIGHT);
//     animateBlobs(blobs, t);
//     for (const blob of blobs) drawBlob(blob);
//     requestAnimationFrame(render);
// }

// render(0);

// // Noise filter overlay ---
// const noiseDiv = document.getElementById('noise');
// const noiseCanvas = document.createElement('canvas');
// const NOISE_SIZE = 256;
// noiseCanvas.width = NOISE_SIZE;
// noiseCanvas.height = NOISE_SIZE;
// const nctx = noiseCanvas.getContext('2d');

// function updateNoise() {
//     const imageData = nctx.createImageData(NOISE_SIZE, NOISE_SIZE);
//     for (let i = 0; i < imageData.data.length; i += 4) {
//         const val = 120 + Math.random() * 120;
//         imageData.data[i] = val;
//         imageData.data[i + 1] = val;
//         imageData.data[i + 2] = val;
//         imageData.data[i + 3] = Math.random() * 90 + 70; // alpha
//     }
//     nctx.putImageData(imageData, 0, 0);
//     noiseDiv.style.backgroundImage = `url(${noiseCanvas.toDataURL(
//         'image/png'
//     )})`;
//     noiseDiv.style.backgroundRepeat = 'repeat';
// }

// setInterval(updateNoise, 80);
// updateNoise();

// // Responsive
// window.addEventListener('resize', () => {
//     WIDTH = window.innerWidth;
//     HEIGHT = window.innerHeight;
//     canvas.width = WIDTH;
//     canvas.height = HEIGHT;
// });

const toggleBtn = document.getElementById('menu-toggle');
const closeBtn = document.getElementById('menu-close');
const navMenu = document.getElementById('nav-menu');
const menuLinks = navMenu.querySelectorAll('.nav-menu-link'); // or '.nav-menu-link a'
const animatedLineNav = document.getElementById('animated-line-nav');
const navBottomLinks = document.querySelector('.nav-bottom-links');

function animateMobileNav() {
    navMenu.classList.remove('hidden');
    navMenu.style.display = 'flex'; // Optional if you're using Tailwind

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.to(navMenu, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.2,
    });

    tl.from(
        menuLinks,
        {
            y: 30,
            opacity: 0,
            stagger: 0.06,
            duration: 0.25,
        },
    );

    tl.from(
        navBottomLinks,
        {
            y: 30,
            opacity: 0,
            duration: 0.5,
            stagger: 0.12,
        },
        '-=0.2'
    );

    // drawLine(animatedLineNav, 0.5); // Optional
}

toggleBtn.addEventListener('click', () => {
    navMenu.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    navMenu.style.overflow = 'auto';
    navMenu.style.webkitOverflowScrolling = 'touch';

    animateMobileNav();
});

closeBtn.addEventListener('click', () => {
    gsap.to(navMenu, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.3,
        onComplete: () => {
            navMenu.classList.add('hidden');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            navMenu.style.overflow = '';
            navMenu.style.webkitOverflowScrolling = '';
        },
    });
});
