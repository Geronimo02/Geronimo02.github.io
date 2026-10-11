const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.main-nav');
const hero = document.querySelector('.hero');
const heroVideo = document.querySelector('.hero-video');
const mobileHero = window.matchMedia('(max-width: 760px)');

function playHero() {
  if (mobileHero.matches && document.visibilityState === 'visible') {
    if (!heroVideo.currentSrc) heroVideo.load();
    heroVideo.play().catch(() => {});
  } else if (!heroVideo.paused) {
    heroVideo.pause();
  }
}

heroVideo.muted = true;
playHero();
window.addEventListener('pageshow', playHero);
document.addEventListener('visibilitychange', playHero);
heroVideo.addEventListener('pause', playHero);
heroVideo.addEventListener('playing', () => heroVideo.classList.add('is-ready'));
mobileHero.addEventListener('change', playHero);

const heroObserver = new IntersectionObserver(([entry]) => {
  document.body.classList.toggle('hero-visible', entry.isIntersecting);
}, { threshold: 0.15 });
heroObserver.observe(hero);

function closeMenu(restoreFocus = false) {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menú');
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  navigation.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') closeMenu(true);
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 760 && menuButton.getAttribute('aria-expanded') === 'true') closeMenu();
});

document.getElementById('year').textContent = new Date().getFullYear();
