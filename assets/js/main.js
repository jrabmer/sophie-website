// Navigation: Hintergrund beim Scrollen + Mobile-Menü
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav__toggle');
const menu = document.querySelector('.nav__menu');

const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

if (toggle && menu) {
  const setOpen = (open) => {
    toggle.setAttribute('aria-expanded', open);
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
}

// Parallax: Bilder in .parallax bewegen sich langsamer als die Seite
const parallaxImgs = [...document.querySelectorAll('.parallax img')];
if (parallaxImgs.length && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    parallaxImgs.forEach((img) => {
      const box = img.parentElement.getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh) return;
      // -1 (Element unten im Bild) bis 1 (oben) → max. ±12 % der Höhe verschieben
      const progress = (box.top + box.height / 2 - vh / 2) / (vh / 2 + box.height / 2);
      img.style.transform = `translate3d(0, ${(-progress * box.height * 0.12).toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', request, { passive: true });
  window.addEventListener('resize', request);
  update();
}

// Elemente beim Scrollen einblenden
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Lightbox für Portraits und Filmstills
const lightbox = document.querySelector('.lightbox');
if (lightbox) {
  const lbImg = lightbox.querySelector('img');
  let group = [];
  let index = 0;

  const show = (i) => {
    index = (i + group.length) % group.length;
    lbImg.src = group[index].href;
    lbImg.alt = group[index].querySelector('img')?.alt || '';
  };
  const close = () => { lightbox.hidden = true; document.body.style.overflow = ''; };

  document.querySelectorAll('.gallery, .stills').forEach((container) => {
    const links = [...container.querySelectorAll('a.gallery__item, a.gallery-link')];
    links.forEach((link, i) => link.addEventListener('click', (ev) => {
      ev.preventDefault();
      group = links;
      show(i);
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
    }));
  });

  lightbox.querySelector('.lightbox__close').addEventListener('click', close);
  lightbox.querySelector('.lightbox__prev').addEventListener('click', () => show(index - 1));
  lightbox.querySelector('.lightbox__next').addEventListener('click', () => show(index + 1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
}

// "Seminar anfragen" / "Training anfragen" wählt das passende Anliegen im Formular vor
const subject = document.getElementById('subject');
document.querySelectorAll('[data-subject]').forEach((a) => a.addEventListener('click', () => {
  if (subject) subject.value = a.dataset.subject;
}));

// Kontaktformular ohne Seitenwechsel absenden (server/contact.php auf dem eigenen Server)
const form = document.querySelector('.form');
if (form) {
  const status = form.querySelector('.form__status');
  const messages = {
    ok: 'Danke! Deine Nachricht ist angekommen – ich melde mich bald.',
    rate_limit: 'Du hast gerade schon einige Nachrichten geschickt. Bitte versuch es später nochmal oder schreib eine E-Mail.',
    error: 'Das hat leider nicht geklappt. Bitte versuch es nochmal oder schreib eine E-Mail.',
  };

  // Rückmeldung, wenn das Formular ohne JavaScript abgeschickt wurde (?gesendet=1 / ?fehler=1)
  const params = new URLSearchParams(location.search);
  if (params.has('gesendet')) status.textContent = messages.ok;
  if (params.has('fehler')) status.textContent = messages.error;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    status.textContent = 'Wird gesendet …';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error);
      form.reset();
      status.textContent = messages.ok;
    } catch (err) {
      status.textContent = messages[err.message] || messages.error;
    } finally {
      btn.disabled = false;
    }
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
