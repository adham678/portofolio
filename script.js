// ---------- PARTICLE BACKGROUND ----------
(function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');

    let w, h;
    let particles = [];

    const COUNT = 120;
    const MAX_SPEED = 0.4;
    const CONNECT_DIST = 120;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * MAX_SPEED * 2;
            this.vy = (Math.random() - 0.5) * MAX_SPEED * 2;
            this.r = Math.random() * 1.8 + 0.8;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < COUNT; i++) {
        particles.push(new Particle());
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECT_DIST) {
                    const alpha = 1 - dist / CONNECT_DIST;

                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108,140,255,${alpha * 0.25})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawLines();
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        particles.forEach(p => {
            p.x = Math.random() * w;
            p.y = Math.random() * h;
        });
    });
})();

// ---------- TYPING EFFECT ----------
(function typeEffect() {
    const el = document.getElementById('typed-name');
    const text = 'Adham Youness';

    let i = 0;
    let isDeleting = false;

    function type() {
        if (!isDeleting) {
            if (i < text.length) {
                el.textContent = text.slice(0, i + 1);
                i++;
                setTimeout(type, 80);
            } else {
                setTimeout(() => {
                    isDeleting = true;
                    setTimeout(type, 1200);
                }, 800);
            }
        } else {
            if (i > 0) {
                el.textContent = text.slice(0, i - 1);
                i--;
                setTimeout(type, 40);
            } else {
                isDeleting = false;
                setTimeout(type, 400);
            }
        }
    }

    setTimeout(type, 600);
})();

// ---------- SCROLL REVEAL ----------
(function scrollReveal() {
    const prefersReducedMotion =
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const targets = document.querySelectorAll('.will-reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
        targets.forEach(el => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(section => observer.observe(section));
})();

// ---------- SCROLL PROGRESS ----------
(function scrollProgress() {
    const bar = document.getElementById('scroll-progress');

    function update() {
        const scrollTop = window.scrollY;
        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = docHeight > 0
            ? (scrollTop / docHeight) * 100
            : 0;

        bar.style.width = progress + '%';
    }

    window.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    update();
})();

// ---------- ACTIVE NAV ----------
(function activeNav() {
    const navLinks = document.querySelectorAll('#section-nav a');
    const sections = Array.from(navLinks)
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const link = document.querySelector(
                `#section-nav a[href="#${entry.target.id}"]`
            );

            if (!link) return;

            if (entry.isIntersecting) {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    }, {
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
})();

// ---------- SMOOTH SCROLL ----------
document.querySelectorAll('#section-nav a, .scroll-cue').forEach(link => {
    link.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            e.preventDefault();

            const navHeight =
                document.getElementById('section-nav').offsetHeight + 20;

            const top =
                target.getBoundingClientRect().top +
                window.scrollY -
                navHeight;

            window.scrollTo({
                top,
                behavior: 'smooth'
            });
        }
    });
});
