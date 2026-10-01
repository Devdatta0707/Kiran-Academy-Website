/* ═══════════════════════════════════════════════════
   THE KIRAN ACADEMY — script.js
   Particles · Typewriter · Custom Cursor · Tilt Cards
   Ticker · Timeline Reveal · FAQ · Form · Navbar
═══════════════════════════════════════════════════ */
'use strict';

/* ─────────────────────────────────────────────────
   UTILITY — run after DOM ready
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initParticles();
  initTypewriter();
  initScrollReveal();
  initTimelineReveal();
  initPlacementsTicker();
  initTiltCards();
  initFaq();
  initDemoForm();
  initFloatCta();
  initSmoothScroll();
  initActiveNav();
});

/* ═══════════════════════════════════════════════════
   1. CUSTOM CURSOR
═══════════════════════════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0;   // mouse
  let rx = 0, ry = 0;   // ring (lagged)

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  /* Ring follows with lag */
  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  /* Hover state on interactive elements */
  const hoverEls = document.querySelectorAll(
    'a, button, .course-card, .bento-card, .loc-card, .faq-item, input, select, .partners-row span'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  /* Hide when leaving window */
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ═══════════════════════════════════════════════════
   2. NAVBAR
═══════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navMenu');
  if (!navbar) return;

  /* Scroll state */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hamburger */
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      toggle.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    /* Close on link click */
    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    /* Close on outside click */
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ═══════════════════════════════════════════════════
   3. PARTICLE CANVAS
═══════════════════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: null, y: null };
  const NEON = '0,245,196';
  const COUNT = window.innerWidth < 768 ? 40 : 80;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  /* Particle class */
  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.r    = Math.random() * 1.8 + .4;
      this.vx   = (Math.random() - .5) * .4;
      this.vy   = (Math.random() - .5) * .4;
      this.life = Math.random();
      this.maxLife = .4 + Math.random() * .5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life += .003;

      /* Subtle mouse repulsion */
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * .6;
          this.vx += (dx / dist) * force * .04;
          this.vy += (dy / dist) * force * .04;
        }
      }

      /* Dampen velocity */
      this.vx *= .99;
      this.vy *= .99;

      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H || this.life > this.maxLife) {
        this.reset();
      }
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * .6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${NEON},${alpha})`;
      ctx.fill();
    }
  }

  /* Init particles */
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  /* Draw connections */
  function drawConnections() {
    const DIST = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          const alpha = (1 - d / DIST) * .15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${NEON},${alpha})`;
          ctx.lineWidth   = .5;
          ctx.stroke();
        }
      }
    }
  }

  /* Animation loop */
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
}

/* ═══════════════════════════════════════════════════
   4. TYPEWRITER
═══════════════════════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = [
    'Dream',
    'Software',
    'Full Stack',
    'Data Science',
    'Tech'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let deleting  = false;
  let paused    = false;

  function type() {
    const current = words[wordIndex];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIndex);
      if (charIndex === current.length) {
        paused = true;
        setTimeout(() => { paused = false; deleting = true; }, 1800);
      }
    } else {
      el.textContent = current.slice(0, --charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
      }
    }

    if (!paused) {
      const speed = deleting ? 60 : 110;
      setTimeout(type, speed);
    }
  }
  type();
}

/* ═══════════════════════════════════════════════════
   5. SCROLL REVEAL (general sections)
═══════════════════════════════════════════════════ */
function initScrollReveal() {
  const targets = [
    '.course-card',
    '.bento-card',
    '.salary-node',
    '.loc-card',
    '.faq-item',
    '.section-tag',
    '.section-title',
    '.section-sub',
    '.demo-left',
    '.demo-right',
  ];

  const style = document.createElement('style');
  style.textContent = `
    .sr-hidden { opacity:0; transform:translateY(30px); transition:opacity .65s ease, transform .65s ease; }
    .sr-visible { opacity:1; transform:translateY(0); }
  `;
  document.head.appendChild(style);

  const elements = [];
  targets.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('sr-hidden');
      el.style.transitionDelay = `${i * 70}ms`;
      elements.push(el);
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sr-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════════════════════════════════════════
   6. TIMELINE REVEAL
═══════════════════════════════════════════════════ */
function initTimelineReveal() {
  const items = document.querySelectorAll('.tl-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  items.forEach((item, i) => {
    item.style.transitionDelay = `${i * 120}ms`;
    observer.observe(item);
  });
}

/* ═══════════════════════════════════════════════════
   7. PLACEMENTS TICKER
═══════════════════════════════════════════════════ */
function initPlacementsTicker() {
  const row1 = document.getElementById('placementsRow1');
  const row2 = document.getElementById('placementsRow2');
  if (!row1 || !row2) return;

  const batch1 = [
    { name: 'Sunigdha Jagtap',    role: 'Data Analytics Intern',       date: 'Sep 2026' },
    { name: 'Aditya Kadu',        role: 'Data Analytics Intern',       date: 'Sep 2026' },
    { name: 'Chaitrali Kad',      role: 'Software Tester',             date: 'Sep 2026' },
    { name: 'Amir Shaikh',        role: 'AI / ML Engineer',            date: 'Sep 2026' },
    { name: 'Rohit Kakade',       role: 'React JS Developer',          date: 'Sep 2026' },
    { name: 'Rutuja Pawar',       role: 'Full Stack Dev Intern',       date: 'Sep 2026' },
    { name: 'Akanksha Patil',     role: 'Full Stack MERN Intern',      date: 'Sep 2026' },
    { name: 'Sandeep Ray',        role: 'Full Stack MERN Intern',      date: 'Sep 2026' },
    { name: 'Sonali Gaikwad',     role: 'Java Developer',              date: 'Sep 2026' },
    { name: 'Dhiraj Hegade',      role: 'Backend Spring Boot Intern',  date: 'Sep 2026' },
    { name: 'Shyam Lade',         role: 'Full-Stack Dev Intern',       date: 'Aug 2026' },
    { name: 'Sanket Kumbhar',     role: 'Software Developer',          date: 'Aug 2026' },
    { name: 'Hitesh Jadhav',      role: 'Full-Stack Dev Intern',       date: 'Aug 2026' },
    { name: 'Vedant Deshpande',   role: 'Associate System Engineer',   date: 'Aug 2026' },
    { name: 'Kaustubh Khadge',    role: 'C++/Python Developer',        date: 'Aug 2026' },
  ];

  const batch2 = [
    { name: 'Arjun Aware',        role: 'Programmer Analyst Trainee',  date: 'Jul 2026' },
    { name: 'Shivani Pawar',      role: 'Graduate Engineer Trainee',   date: 'Jul 2026' },
    { name: 'Prem Jagtap',        role: 'MERN Stack Intern',           date: 'Jul 2026' },
    { name: 'Prasad More',        role: 'Full Stack Developer',        date: 'Jul 2026' },
    { name: 'Swati Jogde',        role: 'QA Automation Engineer',      date: 'Jul 2026' },
    { name: 'Ankita More',        role: 'Software Dev Intern',         date: 'Jul 2026' },
    { name: 'Unnati Kolekar',     role: 'Software Developer',          date: 'May 2026' },
    { name: 'Akash Bhosale',      role: 'Quality Assurance Engineer',  date: 'May 2026' },
    { name: 'Dhanashri Bharsakle',role: 'React Developer Intern',      date: 'May 2026' },
    { name: 'Nandini Gangurde',   role: 'Technical Support Executive', date: 'Jun 2026' },
    { name: 'Ali Faiz',           role: 'AI/ML Intern',                date: 'Jun 2026' },
    { name: 'Suraj Salgar',       role: 'Java Full Stack Intern',      date: 'Jun 2026' },
    { name: 'Pratiksha Karlekar', role: 'Assistant System Engineer',   date: 'Aug 2026' },
    { name: 'Ritik Tamre',        role: 'Implementation Engineer',     date: 'Sep 2026' },
    { name: 'Ayaan Pathan',       role: 'AI / ML Intern',              date: 'Sep 2026' },
  ];

  function getInitials(name) {
    const p = name.trim().split(' ');
    return p.length === 1
      ? p[0].slice(0, 2).toUpperCase()
      : (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }

  function buildChip(p) {
    const chip = document.createElement('div');
    chip.className = 'p-chip';
    chip.innerHTML = `
      <div class="p-chip-av">${getInitials(p.name)}</div>
      <div class="p-chip-info">
        <div class="p-chip-name">${p.name}</div>
        <div class="p-chip-role">${p.role}</div>
      </div>
      <span class="p-chip-date">${p.date}</span>
    `;
    return chip;
  }

  /* Duplicate for seamless loop */
  [...batch1, ...batch1].forEach(p => row1.appendChild(buildChip(p)));
  [...batch2, ...batch2].forEach(p => row2.appendChild(buildChip(p)));

  /* Pause on hover */
  [row1, row2].forEach(row => {
    row.addEventListener('mouseenter', () => row.style.animationPlayState = 'paused');
    row.addEventListener('mouseleave', () => row.style.animationPlayState = 'running');
  });
}

/* ═══════════════════════════════════════════════════
   8. 3D TILT EFFECT ON CARDS
═══════════════════════════════════════════════════ */
function initTiltCards() {
  if (window.innerWidth < 768) return; // skip on mobile

  const cards = document.querySelectorAll('[data-tilt]');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = -dy * 8;   // max 8deg
      const rotY   =  dx * 8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02,1.02,1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
      card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      setTimeout(() => card.style.transition = '', 500);
    });
  });
}

/* ═══════════════════════════════════════════════════
   9. FAQ ACCORDION
═══════════════════════════════════════════════════ */
function initFaq() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn    = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      /* Close all */
      items.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-a');
        const b = i.querySelector('.faq-q');
        if (a) a.classList.remove('open');
        if (b) b.setAttribute('aria-expanded', 'false');
      });

      /* Toggle clicked */
      if (!isOpen) {
        item.classList.add('open');
        answer.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ═══════════════════════════════════════════════════
   10. DEMO FORM
═══════════════════════════════════════════════════ */
function initDemoForm() {
  const form    = document.getElementById('demoForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name     = form.querySelector('#fname').value.trim();
    const phone    = form.querySelector('#fphone').value.trim();
    const email    = form.querySelector('#femail').value.trim();
    const course   = form.querySelector('#fcourse').value;
    const location = form.querySelector('#flocation').value;

    /* Validate */
    if (!name)                      return shake(form.querySelector('#fname'));
    if (!/^\d{10}$/.test(phone))    return shake(form.querySelector('#fphone'));
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return shake(form.querySelector('#femail'));
    if (!course)                    return shake(form.querySelector('#fcourse'));
    if (!location)                  return shake(form.querySelector('#flocation'));

    /* Submit animation */
    const btn = form.querySelector('.btn-submit');
    btn.style.opacity = '.6';
    btn.querySelector('span').textContent = 'Booking your seat...';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display    = 'none';
      success.style.display = 'block';
      /* Update name in success */
      const h4 = success.querySelector('h4');
      if (h4) h4.textContent = `You're in, ${name.split(' ')[0]}! 🚀`;
    }, 1200);
  });
}

function shake(el) {
  if (!el) return;
  el.style.animation = 'none';
  el.style.borderColor = '#f472b6';
  el.style.boxShadow   = '0 0 0 2px rgba(244,114,182,.25)';
  requestAnimationFrame(() => {
    el.style.animation = 'shakeInput .4s ease';
  });
  el.addEventListener('input', () => {
    el.style.borderColor = '';
    el.style.boxShadow   = '';
  }, { once: true });
}

/* Inject shake keyframe */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shakeInput {
    0%,100% { transform:translateX(0); }
    20%     { transform:translateX(-6px); }
    40%     { transform:translateX(6px); }
    60%     { transform:translateX(-4px); }
    80%     { transform:translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ═══════════════════════════════════════════════════
   11. FLOATING CTA
═══════════════════════════════════════════════════ */
function initFloatCta() {
  const cta  = document.getElementById('floatCta');
  const hero = document.getElementById('hero');
  if (!cta || !hero) return;

  const onScroll = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    cta.classList.toggle('show', heroBottom < 0);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ═══════════════════════════════════════════════════
   12. SMOOTH SCROLL
═══════════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar')?.offsetHeight || 70;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH - 10,
        behavior: 'smooth'
      });
    });
  });
}

/* ═══════════════════════════════════════════════════
   13. ACTIVE NAV HIGHLIGHT
═══════════════════════════════════════════════════ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link[href^="#"]');

  const onScroll = () => {
    let current = '';
    sections.forEach(s => {
      if (s.getBoundingClientRect().top <= 90) current = s.id;
    });
    links.forEach(l => {
      const active = l.getAttribute('href') === `#${current}`;
      l.style.color      = active ? 'var(--neon)' : '';
      l.style.fontWeight = active ? '700' : '';
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ═══════════════════════════════════════════════════
   14. HERO ENTRANCE STAGGER
═══════════════════════════════════════════════════ */
(function heroEntrance() {
  const els = ['.hero-pill', '.hero-heading', '.hero-sub', '.hero-bullets', '.hero-actions', '.hero-stats'];
  els.forEach((sel, i) => {
    const el = document.querySelector(sel);
    if (!el) return;
    el.style.cssText = `opacity:0;transform:translateY(28px);transition:opacity .7s ease ${200 + i*110}ms,transform .7s ease ${200 + i*110}ms`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity   = '1';
      el.style.transform = 'translateY(0)';
    }));
  });

  /* Orbit nodes stagger */
  document.querySelectorAll('.orbit-node').forEach((node, i) => {
    node.style.cssText = `opacity:0;transition:opacity .5s ease ${800 + i*120}ms;animation:floatNode ${3 + i * .5}s ease-in-out ${i * .4}s infinite`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      node.style.opacity = '1';
    }));
  });
})();

/* ═══════════════════════════════════════════════════
   15. COUNTER ANIMATION on stats bar numbers
═══════════════════════════════════════════════════ */
(function initHeroStats() {
  /* These are static in HTML — just add a glow pulse on load */
  const nums = document.querySelectorAll('.hstat-num');
  nums.forEach((n, i) => {
    setTimeout(() => {
      n.style.transition = 'text-shadow .4s ease';
      n.style.textShadow = '0 0 30px rgba(0,245,196,.8)';
      setTimeout(() => n.style.textShadow = '', 600);
    }, 1000 + i * 150);
  });
})();

/* ═══════════════════════════════════════════════════
   16. GLOWING BORDER on scroll for bento cards
═══════════════════════════════════════════════════ */
(function initBentoGlow() {
  const cards = document.querySelectorAll('.bento-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.style.transition = 'border-color .8s ease, box-shadow .8s ease';
        card.style.borderColor = 'rgba(0,245,196,.18)';
        card.style.boxShadow   = '0 0 40px rgba(0,245,196,.04)';
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(c => observer.observe(c));
})();
