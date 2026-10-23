import { openStatus } from '../lib/hours';

export const CART_KEY = 'cp-cart-v1';

function setupReveals() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in), [data-tender]:not(.is-in)');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((el) => io.observe(el));
}

function setupOpenStatus() {
  const s = openStatus();
  document.querySelectorAll<HTMLElement>('[data-open-status]').forEach((el) => {
    el.textContent = s.label;
    el.dataset.open = String(s.open);
  });
}

export function updateCartCount() {
  let count = 0;
  try {
    const raw = localStorage.getItem(CART_KEY);
    const lines: { qty: number }[] = raw ? JSON.parse(raw).lines ?? [] : [];
    count = lines.reduce((n, l) => n + (l.qty || 0), 0);
  } catch { /* almacenamiento no disponible */ }
  document.querySelectorAll<HTMLElement>('[data-cart-count]').forEach((el) => {
    el.hidden = count === 0;
    el.textContent = String(count);
  });
}

document.addEventListener('astro:page-load', () => {
  setupReveals();
  setupOpenStatus();
  updateCartCount();
});
window.addEventListener('cp:cart', updateCartCount);
