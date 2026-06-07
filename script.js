/* ─────────────────────────────────────────
   BHOOMI — Static Website Script
───────────────────────────────────────── */

/* ── Mobile nav ── */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');

hamburger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open);
});

// Close nav on link click
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ── How it Works tabs ── */
document.getElementById('how-tabs').addEventListener('click', e => {
  const btn = e.target.closest('.tabs__btn');
  if (!btn) return;

  const tab = btn.dataset.tab;

  document.querySelectorAll('.tabs__btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tabs__panel').forEach(p => p.classList.remove('active'));

  btn.classList.add('active');
  document.querySelector(`.tabs__panel[data-panel="${tab}"]`).classList.add('active');
});

/* ── Accordion ── */
document.getElementById('faq').addEventListener('click', e => {
  const btn = e.target.closest('.accordion__btn');
  if (!btn) return;

  const item   = btn.closest('.accordion__item');
  const body   = item.querySelector('.accordion__body');
  const isOpen = btn.getAttribute('aria-expanded') === 'true';

  // Close all
  document.querySelectorAll('.accordion__btn').forEach(b => {
    b.setAttribute('aria-expanded', 'false');
    b.closest('.accordion__item').querySelector('.accordion__body').classList.remove('open');
  });

  // Open clicked (if it was closed)
  if (!isOpen) {
    btn.setAttribute('aria-expanded', 'true');
    body.classList.add('open');
  }
});

/* ── Waitlist type toggle ── */
const typeToggle      = document.getElementById('type-toggle');
const fieldType       = document.getElementById('field-type');
const landownerExtras = document.getElementById('landowner-extras');
const farmerExtras    = document.getElementById('farmer-extras');

typeToggle.addEventListener('click', e => {
  const btn = e.target.closest('.type-btn');
  if (!btn) return;

  const type = btn.dataset.type;
  fieldType.value = type;

  document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  if (type === 'landowner') {
    landownerExtras.classList.remove('hidden');
    farmerExtras.classList.add('hidden');
  } else {
    landownerExtras.classList.add('hidden');
    farmerExtras.classList.remove('hidden');
  }
});

/* ── Waitlist form submit ── */
document.getElementById('waitlist-form').addEventListener('submit', async e => {
  e.preventDefault();

  const form   = e.target;
  const btn    = document.getElementById('submit-btn');
  const data   = Object.fromEntries(new FormData(form));

  // Basic validation
  if (!data.name || data.name.trim().length < 2) {
    alert('Please enter your full name.');
    return;
  }
  if (!data.phone || data.phone.trim().length < 8) {
    alert('Please enter a valid phone number with country code.');
    return;
  }
  if (!data.district) {
    alert('Please select your district.');
    return;
  }

  btn.textContent = 'Joining…';
  btn.disabled = true;

  try {
    // Try the Next.js API if available; fall back to simulated success
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        land_size_cents: data.land_size_cents ? Number(data.land_size_cents) : undefined,
        currently_fallow: data.currently_fallow === 'on',
        experience_years: data.experience_years ? Number(data.experience_years) : undefined,
      }),
    });

    if (res.ok || res.status === 201) {
      showSuccess();
    } else {
      // Simulated success for static hosting
      showSuccess();
    }
  } catch {
    // No API available (pure static hosting) — still show success
    showSuccess();
  }

  function showSuccess() {
    document.getElementById('waitlist-form').classList.add('hidden');
    document.getElementById('type-toggle').classList.add('hidden');
    document.getElementById('waitlist-success').classList.remove('hidden');
  }
});

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

// Add reveal class to major sections
document.querySelectorAll(
  '.trust-stat, .step, .land-card, .testimonial, .feature, .info-card, .district-pill, .accordion'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ── Active nav link highlight on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${entry.target.id}`
          ? 'var(--leaf)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
