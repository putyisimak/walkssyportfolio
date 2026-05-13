// ── animated grid background ──
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

let W, H, cols, rows;
const CELL = 60;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  cols = Math.ceil(W / CELL) + 1;
  rows = Math.ceil(H / CELL) + 1;
}

resize();
window.addEventListener('resize', resize);

let t = 0;

function drawGrid() {
  ctx.clearRect(0, 0, W, H);

  // grid lines
  ctx.strokeStyle = 'rgba(0, 80, 200, 0.08)';
  ctx.lineWidth = 1;

  for (let x = 0; x < cols; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CELL, 0);
    ctx.lineTo(x * CELL, H);
    ctx.stroke();
  }
  for (let y = 0; y < rows; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CELL);
    ctx.lineTo(W, y * CELL);
    ctx.stroke();
  }

  // glowing dots at intersections
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const phase = (x * 0.5 + y * 0.3 + t * 0.008) % (Math.PI * 2);
      const alpha = (Math.sin(phase) + 1) / 2;
      if (alpha < 0.05) continue;

      const px = x * CELL;
      const py = y * CELL;

      ctx.beginPath();
      ctx.arc(px, py, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 120, 255, ${alpha * 0.5})`;
      ctx.fill();
    }
  }

  // occasional streak
  const streakX = (t * 0.4) % (W + 100) - 50;
  const grad = ctx.createLinearGradient(streakX - 80, 0, streakX + 80, 0);
  grad.addColorStop(0, 'transparent');
  grad.addColorStop(0.5, 'rgba(0, 140, 255, 0.06)');
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(streakX - 80, 0, 160, H);

  t++;
  requestAnimationFrame(drawGrid);
}

drawGrid();

// ── skill bar animation on scroll ──
const fills = document.querySelectorAll('.skill-fill');

const skillObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el  = entry.target;
      const pct = el.getAttribute('data-w');
      el.style.width = pct + '%';
      skillObs.unobserve(el);
    }
  });
}, { threshold: 0.2 });

fills.forEach(f => skillObs.observe(f));

// ── scroll reveal ──
const revealEls = document.querySelectorAll('.glass-card, .section-title, .section-tag, .hero-stats, .tech-badges');

const revealStyle = document.createElement('style');
revealStyle.textContent = `
  .reveal-target {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal-target.revealed {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(revealStyle);

revealEls.forEach((el, i) => {
  el.classList.add('reveal-target');
  el.style.transitionDelay = (i % 4) * 0.08 + 's';
});

const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

revealEls.forEach(el => revealObs.observe(el));

// ── nav active link highlight ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current
      ? 'var(--blue3)'
      : 'var(--muted)';
  });
}, { passive: true });

// ── discord copy ──
function copyDiscord() {
  const tag = 'walkssy.';
  navigator.clipboard.writeText(tag).then(() => {
    const label = document.getElementById('discord-label');
    label.textContent = 'Copied!';
    setTimeout(() => { label.textContent = 'Discord — click to copy'; }, 2000);
  });
}

window.copyDiscord = copyDiscord;
