document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('blogForm');
    const urlInput = document.getElementById('youtubeUrl');
    const loading = document.getElementById('loading');
    const output = document.getElementById('blogOutput');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        output.innerHTML = '';
        loading.style.display = 'block';
        const url = urlInput.value.trim();
        try {
            const res = await fetch('/generate_blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });
            const data = await res.json();
            loading.style.display = 'none';
            if (res.ok && data.blog_post) {
                output.innerHTML = data.blog_post;
                animateBlogParagraphs();
            } else {
                output.innerHTML = `<div style='color:#ff6600;font-weight:bold;'>${data.error || 'Failed to generate blog post.'}</div>`;
            }
        } catch (err) {
            loading.style.display = 'none';
            output.innerHTML = `<div style='color:#ff6600;font-weight:bold;'>Network error. Please try again.</div>`;
        }
    });

    // Animate paragraphs on scroll
    function animateBlogParagraphs() {
        const paragraphs = document.querySelectorAll('.blog-output p');
        const reveal = () => {
            paragraphs.forEach(p => {
                const rect = p.getBoundingClientRect();
                if (rect.top < window.innerHeight - 40) {
                    p.classList.add('visible');
                }
            });
        };
        reveal();
        window.addEventListener('scroll', reveal);
    }
});

// --- Animated Live Wallpaper and Cursor Trail ---

// Get the canvas and context
const canvas = document.getElementById('live-bg');
const ctx = canvas.getContext('2d');

// Resize canvas to fill the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- Particle System for Live Wallpaper ---
const particles = [];
const PARTICLE_COUNT = 60;
const colors = ['#00eaff', '#ff6bcb', '#8f5cff', '#ffe484'];

for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 1.5 + Math.random() * 2.5,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 0.3 + Math.random() * 0.5
    });
}

// --- Minimal Cursor Trail Animation with Idle Fadeout ---
const cursorTrail = [];
const TRAIL_LENGTH = 32; // More dots for smoothness
let lastMouseMove = Date.now();
let trailAlpha = 1; // Opacity multiplier for fading
const IDLE_FADE_DELAY = 1000; // ms before fading starts
const IDLE_FADE_SPEED = 0.04; // fadeout speed per frame

window.addEventListener('mousemove', (e) => {
    cursorTrail.push({ x: e.clientX, y: e.clientY, t: Date.now() });
    if (cursorTrail.length > TRAIL_LENGTH) cursorTrail.shift();
    lastMouseMove = Date.now();
    trailAlpha = 1; // Instantly restore trail on movement
});

// --- Animation Loop ---
function animate() {
    // Draw animated gradient background
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#10131a');
    grad.addColorStop(0.5, '#1a233a');
    grad.addColorStop(1, '#2a183a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Animate and draw particles
    for (let p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
    }

    // Handle idle fadeout
    const idleTime = Date.now() - lastMouseMove;
    if (idleTime > IDLE_FADE_DELAY && trailAlpha > 0) {
        trailAlpha -= IDLE_FADE_SPEED;
        if (trailAlpha < 0) trailAlpha = 0;
    } else if (idleTime <= IDLE_FADE_DELAY) {
        trailAlpha = 1;
    }

    // Draw minimal cursor trail (only if visible)
    if (trailAlpha > 0) {
        for (let i = 0; i < cursorTrail.length; i++) {
            const t = cursorTrail[i];
            // Fade out the whole trail as mouse is idle
            ctx.save();
            ctx.globalAlpha = (0.08 + 0.18 * (i / TRAIL_LENGTH)) * trailAlpha;
            ctx.beginPath();
            ctx.arc(t.x, t.y, 3 + 2 * (i / TRAIL_LENGTH), 0, 2 * Math.PI);
            ctx.fillStyle = '#00eaff';
            ctx.fill();
            ctx.restore();
        }
    }

    requestAnimationFrame(animate);
}
animate();

// --- End of Live Wallpaper and Cursor Animation --- 