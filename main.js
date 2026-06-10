/* ═══════════════════════════════════════════════════════════
   FAYAADH ADHLI NUGROHO — Portfolio JS
   Handles: Particles · Scroll · Ring Animations · Counters
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── DATA ─────────────────────────────────────────────────── */
const SCORES = [
  { label: 'Penalaran Umum',                score: 620.06, color: '#C9A84C' },
  { label: 'Pengetahuan & Pemahaman Umum',  score: 505.16, color: '#8B9BAD' },
  { label: 'Pemahaman Bacaan & Menulis',    score: 505.90, color: '#8B9BAD' },
  { label: 'Pengetahuan Kuantitatif',       score: 425.62, color: '#C05252' },
  { label: 'Literasi Bahasa Inggris',       score: 617.81, color: '#C9A84C' },
  { label: 'Penalaran Matematika',          score: 604.61, color: '#C9A84C' },
  { label: 'Literasi B.I. (Saintek)',       score: 571.46, color: '#7B9E8C' },
  { label: 'Literasi B.I. (Soshum)',        score: 355.07, color: '#A07060' },
];

const MAX_SCORE = 1000;

/* ─── PARTICLES ─────────────────────────────────────────────── */
function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const count = 30;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.width = p.style.height = (Math.random() * 3 + 1) + 'px';
    p.style.animationDuration = (Math.random() * 12 + 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.opacity = Math.random() * 0.6;
    // Vary colors: gold vs white
    p.style.background = Math.random() > 0.5 ? '#C9A84C' : 'rgba(245,243,239,0.6)';
    container.appendChild(p);
  }
}

/* ─── NAVBAR SCROLL ─────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) {
        current = sec.id;
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── REVEAL ON SCROLL ──────────────────────────────────────── */
function initReveal() {
  // Add reveal class to key elements
  const targets = [
    '.score-card',
    '.timeline-item',
    '.ptn-card',
    '.scores-chart',
    '.radar-table-wrap',
    '.section-title',
    '.section-sub',
  ];

  targets.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * 0.08) + 's';
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ─── SCORE RING ANIMATION ──────────────────────────────────── */
function animateRing(circleFg, score, max) {
  const circumference = 2 * Math.PI * 50; // r=50 → ~314
  const fraction = Math.min(score / max, 1);
  const offset = circumference * (1 - fraction);

  // Trigger animation after a tiny delay
  requestAnimationFrame(() => {
    circleFg.style.strokeDashoffset = offset;
  });
}

function initScoreRings() {
  const cards = document.querySelectorAll('.score-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const score = parseFloat(card.dataset.score);
        const max   = parseFloat(card.dataset.max || 1000);
        const ring  = card.querySelector('.ring-fg');
        if (ring) animateRing(ring, score, max);
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(c => observer.observe(c));
}

/* ─── METRIC RING ANIMATION (PTN Cards) ─────────────────────── */
function animateMetricRing(ring, pct) {
  const circumference = 2 * Math.PI * 32; // r=32 → ~201
  const offset = circumference * (1 - pct / 100);
  requestAnimationFrame(() => {
    ring.style.strokeDashoffset = offset;
  });
}

function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initMetricRings() {
  const ptnCards = document.querySelectorAll('.ptn-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const rings = card.querySelectorAll('.mring-fg');
        const vals  = card.querySelectorAll('.metric-val');

        rings.forEach((ring, i) => {
          const pct = parseInt(ring.dataset.pct);
          animateMetricRing(ring, pct);
          if (vals[i]) {
            setTimeout(() => animateCounter(vals[i], pct, 1500), 100);
          }
        });

        // Animate detail bars
        card.querySelectorAll('.detail-fill').forEach((bar, idx) => {
          setTimeout(() => {
            bar.style.width = bar.style.width; // trigger reflow
          }, idx * 100);
        });

        observer.unobserve(card);
      }
    });
  }, { threshold: 0.2 });

  ptnCards.forEach(c => observer.observe(c));
}

/* ─── DETAIL BAR ANIMATION ──────────────────────────────────── */
function initDetailBars() {
  const bars = document.querySelectorAll('.detail-fill');

  // Store original widths, then reset to 0 for animation
  bars.forEach(bar => {
    const targetWidth = bar.style.width;
    bar.dataset.targetWidth = targetWidth;
    bar.style.width = '0';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        card.querySelectorAll('.detail-fill').forEach((bar, i) => {
          setTimeout(() => {
            bar.style.width = bar.dataset.targetWidth;
          }, i * 150);
        });
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.ptn-card').forEach(c => observer.observe(c));
}

/* ─── CHART BARS (SCORES SECTION) ───────────────────────────── */
function buildChartBars() {
  const container = document.getElementById('chartBars');
  if (!container) return;

  const maxScore = Math.max(...SCORES.map(s => s.score));

  SCORES.forEach(item => {
    const pct = (item.score / maxScore * 100).toFixed(1);

    const row = document.createElement('div');
    row.className = 'chart-bar-row';
    row.innerHTML = `
      <div class="chart-bar-label">${item.label}</div>
      <div class="chart-bar-track">
        <div class="chart-bar-fill" data-target-width="${pct}%" style="background:${item.color};width:0"></div>
      </div>
      <div class="chart-bar-val">${item.score.toFixed(0)}</div>
    `;
    container.appendChild(row);
  });

  // Animate bars on scroll
  const chart = document.querySelector('.scores-chart');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.chart-bar-fill').forEach((fill, i) => {
          setTimeout(() => {
            fill.style.width = fill.dataset.targetWidth;
          }, i * 120);
        });
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  if (chart) barObserver.observe(chart);
}

/* ─── SMOOTH HOVER GLOW on PTN cards ────────────────────────── */
function initCardTilt() {
  document.querySelectorAll('.ptn-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -4;
      const rotY = ((x - cx) / cx) * 4;

      card.style.transform = `translateY(-6px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ─── TIMELINE HOVER ────────────────────────────────────────── */
function initTimelineHover() {
  document.querySelectorAll('.tl-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.borderColor = 'rgba(201,168,76,0.3)';
    });
    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('tl-card-active')) {
        card.style.borderColor = '';
      }
    });
  });
}

/* ─── CURSOR DOT (subtle) ───────────────────────────────────── */
function initCursorDot() {
  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: 6px;
    height: 6px;
    background: #C9A84C;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%,-50%);
    transition: transform 0.1s ease, opacity 0.3s ease;
    opacity: 0;
  `;
  document.body.appendChild(dot);

  let mx = 0, my = 0;
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.opacity = '0.8';
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
  });
}

/* ─── SCROLL PROGRESS BAR ───────────────────────────────────── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    background: linear-gradient(90deg, #8A6E2F, #C9A84C, #E4C472);
    z-index: 2000;
    width: 0%;
    transition: width 0.1s linear;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total = document.body.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ─── TODAY DATE DISPLAY ────────────────────────────────────── */
function initTodayDate() {
  const el = document.getElementById('todayDate');
  if (!el) return;
  const now = new Date();
  const days   = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
  const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  el.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

/* ─── COUNTDOWN TIMER ───────────────────────────────────────── */
function initCountdown() {
  const daysEl  = document.getElementById('cdt-days');
  const hoursEl = document.getElementById('cdt-hours');
  const minsEl  = document.getElementById('cdt-mins');
  if (!daysEl) return;

  // Deadline: 2 Juli 2026 23:59:59 WIB (UTC+7)
  const deadline = new Date('2026-07-02T23:59:59+07:00');

  function tick() {
    const now  = new Date();
    const diff = deadline - now;

    if (diff <= 0) {
      daysEl.textContent  = '00';
      hoursEl.textContent = '00';
      minsEl.textContent  = '00';
      return;
    }

    const totalSec = Math.floor(diff / 1000);
    const d  = Math.floor(totalSec / 86400);
    const h  = Math.floor((totalSec % 86400) / 3600);
    const m  = Math.floor((totalSec % 3600)  / 60);

    daysEl.textContent  = String(d).padStart(2, '0');
    hoursEl.textContent = String(h).padStart(2, '0');
    minsEl.textContent  = String(m).padStart(2, '0');
  }

  tick();
  setInterval(tick, 30000); // update every 30s
}

/* ─── SCHEDULE CARD REVEAL ──────────────────────────────────── */
function initScheduleReveal() {
  const cards = document.querySelectorAll('.sched-card, .planb-track, .planb-option, .urgency-item, .decision-branch');
  cards.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.08}s, transform 0.6s ease ${i * 0.08}s`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  cards.forEach(el => obs.observe(el));
}

/* ─── INIT ──────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  buildChartBars();
  initReveal();
  initScoreRings();
  initMetricRings();
  initDetailBars();
  initCardTilt();
  initTimelineHover();
  initCursorDot();
  initScrollProgress();
  initTodayDate();
  initCountdown();
  initScheduleReveal();
});
