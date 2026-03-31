/* ============================================
   WHATNEXT — JAVASCRIPT
   Preloader | Navbar | Particles | Animations
   Counter | Testimonials | Portfolio | Form
   ============================================ */

"use strict";

/* ==== HELPERS ==== */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ==== PRELOADER ==== */
(function initPreloader() {
  const preloader = $('#preloader');
  if (!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1800);
  });
  document.body.style.overflow = 'hidden';
})();

/* ==== NAVBAR ==== */
(function initNavbar() {
  const navbar = $('#navbar');
  const hamburger = $('#hamburger');
  const navLinks = $('#navLinks');
  const mobileOverlay = $('#mobileOverlay');
  if (!navbar) return;

  // Scroll behaviour
  function handleScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    const backToTop = $('#backToTop');
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Hamburger toggle
  function closeMenu() {
    hamburger?.classList.remove('open');
    navLinks?.classList.remove('open');
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }
  function openMenu() {
    hamburger?.classList.add('open');
    navLinks?.classList.add('open');
    mobileOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  hamburger?.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });
  mobileOverlay?.addEventListener('click', closeMenu);

  // Close on nav link click
  $$('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
      // Active link
      $$('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Active section tracking
  const sections = $$('section[id]');
  const options = { rootMargin: `-${navbar.offsetHeight + 10}px 0px -50% 0px` };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        $$('.nav-link').forEach(l => l.classList.remove('active'));
        const link = $(`.nav-link[href="#${e.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, options);
  sections.forEach(s => observer.observe(s));
})();

/* ==== BACK TO TOP ==== */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ==== PARTICLE CANVAS ==== */
(function initParticles() {
  const canvas = $('#particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animFrame;

  const GOLD = '#D4AF37';
  const GOLD_LIGHT = '#F0D060';

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.1,
      color: Math.random() > 0.5 ? GOLD : GOLD_LIGHT,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    };
  }

  function initParticles() {
    const count = Math.min(120, Math.floor((W * H) / 8000));
    particles = Array.from({ length: count }, createParticle);
  }

  function drawLine(p1, p2, dist, maxDist) {
    const alpha = (1 - dist / maxDist) * 0.12;
    ctx.beginPath();
    ctx.strokeStyle = `rgba(212,175,55,${alpha})`;
    ctx.lineWidth = 0.5;
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const maxDist = 120;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.pulse += p.pulseSpeed;
      const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,175,55,${a})`;
      ctx.fill();

      // Lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p2.x - p.x;
        const dy = p2.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < maxDist) drawLine(p, p2, dist, maxDist);
      }
    }
    animFrame = requestAnimationFrame(draw);
  }

  function start() {
    resize();
    initParticles();
    draw();
  }

  const ro = new ResizeObserver(() => {
    resize();
    initParticles();
  });
  ro.observe(canvas.parentElement);
  start();
})();

/* ==== SCROLL REVEAL ==== */
(function initReveal() {
  const revealEls = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!revealEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();

/* ==== COUNTER ANIMATION ==== */
(function initCounters() {
  const counters = $$('.stat-num');
  if (!counters.length) return;

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ==== PORTFOLIO FILTER ==== */
(function initPortfolioFilter() {
  const filterBtns = $$('.filter-btn');
  const items = $$('.portfolio-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      items.forEach((item, i) => {
        const match = filter === 'all' || item.dataset.category === filter;
        if (match) {
          item.classList.remove('hidden');
          item.style.animationDelay = `${i * 0.05}s`;
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
})();

/* ==== TESTIMONIAL SLIDER ==== */
(function initTestimonials() {
  const track = $('#testimonialTrack');
  const prevBtn = $('#testiPrev');
  const nextBtn = $('#testiNext');
  const dotsWrap = $('#testiDots');
  if (!track) return;

  const cards = $$('.testimonial-card', track);
  let current = 0;
  let perView = getPerView();
  let maxIndex = Math.ceil(cards.length / perView) - 1;
  let autoTimer;

  function getPerView() {
    if (window.innerWidth >= 1000) return 3;
    if (window.innerWidth >= 700) return 2;
    return 1;
  }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = Math.ceil(cards.length / perView);
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    $$('.testi-dot', dotsWrap).forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    current = Math.max(0, Math.min(index, maxIndex));
    const cardWidth = cards[0].offsetWidth + 24; // gap = 24px
    track.style.transform = `translateX(-${current * perView * cardWidth}px)`;
    updateDots();
  }

  function next() { goTo(current === maxIndex ? 0 : current + 1); }
  function prev() { goTo(current === 0 ? maxIndex : current - 1); }

  prevBtn?.addEventListener('click', prev);
  nextBtn?.addEventListener('click', next);

  // Swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  });

  // Auto-play
  function startAuto() { autoTimer = setInterval(next, 4500); }
  function stopAuto() { clearInterval(autoTimer); }
  track.addEventListener('mouseenter', stopAuto);
  track.addEventListener('mouseleave', startAuto);

  // Resize
  window.addEventListener('resize', () => {
    const newPerView = getPerView();
    if (newPerView !== perView) {
      perView = newPerView;
      maxIndex = Math.ceil(cards.length / perView) - 1;
      current = 0;
      buildDots();
      goTo(0);
    }
  });

  buildDots();
  goTo(0);
  startAuto();
})();

/* ==== CONTACT FORM ==== */
(function initContactForm() {
  const form = $('#contactForm');
  const success = $('#formSuccess');
  if (!form) return;

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input) {
    input.classList.add('error');
    input.addEventListener('input', () => input.classList.remove('error'), { once: true });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#name');
    const email = $('#email');
    const message = $('#message');
    const submitBtn = $('#submitBtn');
    let valid = true;

    if (!name.value.trim()) { showError(name); valid = false; }
    if (!validateEmail(email.value)) { showError(email); valid = false; }
    if (!message.value.trim()) { showError(message); valid = false; }
    if (!valid) return;

    // Simulate submission
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';

    await new Promise(r => setTimeout(r, 1800));

    // Show success (in production, hook to a backend/EmailJS/Formspree here)
    form.style.display = 'none';
    success.style.display = 'block';
  });
})();

/* ==== SMOOTH SCROLL FOR ALL ANCHOR LINKS ==== */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = $('#navbar')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ==== CURSOR GLOW EFFECT (desktop) ==== */
(function initCursorGlow() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip mobile
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9998;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease;
    will-change: left, top;
  `;
  document.body.appendChild(glow);
  window.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
})();

/* ==== TILT EFFECT ON CARDS ==== */
(function initTilt() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  $$('.service-card, .why-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) scale(1.01) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ==== TYPWRITER EFFECT IN HERO ==== */
(function initTypewriter() {
  const words = ['Startups.', 'Businesses.', 'Innovators.', 'Visionaries.'];
  const el = document.createElement('span');
  el.className = 'gold-gradient';
  const heroTitle = $('.hero-title');
  if (!heroTitle) return;

  // Keep existing title, just add blink cursor to gold word
  const goldSpan = heroTitle.querySelector('.gold-gradient');
  if (!goldSpan) return;

  let wi = 0, ci = 0, deleting = false;
  const baseWord = goldSpan.textContent;

  // Extend title to include audience word
  heroTitle.innerHTML = `Build <span class="gold-gradient">${baseWord}</span><br />For <span id="typeTarget" class="gold-gradient"></span>`;
  const target = $('#typeTarget');
  if (!target) return;

  function type() {
    const word = words[wi];
    if (!deleting) {
      target.textContent = word.slice(0, ++ci);
      if (ci === word.length) { deleting = true; setTimeout(type, 2000); return; }
    } else {
      target.textContent = word.slice(0, --ci);
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  setTimeout(type, 2000);
})();

/* ==== SUPABASE AUTH — NAVBAR STATE ==== */
(function initNavAuth() {
  // Guard: only run if Supabase is loaded
  if (typeof supabase === 'undefined') return;

  const SUPABASE_URL = 'https://mguqaihngvjffizwxjhd.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ndXFhaWhuZ3ZqZmZpend4amhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3ODcyNTcsImV4cCI6MjA5MDM2MzI1N30.36bDE2ixqOrWG2ER02gGoRga6n7mbjRKILs_UzY7Uz0';

  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const navAuthBtn   = $('#navAuthBtn');
  const navAccountBtn = $('#navAccountBtn');
  const navAvatar    = $('#navAvatar');
  const navUserName  = $('#navUserName');

  function updateNavAuth(user) {
    if (!navAuthBtn || !navAccountBtn) return;
    if (user) {
      const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Account';
      const initial = name.charAt(0).toUpperCase();
      navAvatar.textContent = initial;
      navUserName.textContent = name.split(' ')[0]; // first name only
      navAuthBtn.style.display = 'none';
      navAccountBtn.style.display = 'flex';
    } else {
      navAuthBtn.style.display = '';
      navAccountBtn.style.display = 'none';
    }
  }

  // Check existing session
  sb.auth.getSession().then(({ data: { session } }) => {
    updateNavAuth(session?.user || null);
  });

  // Real-time auth state changes
  sb.auth.onAuthStateChange((_event, session) => {
    updateNavAuth(session?.user || null);
  });
})();

