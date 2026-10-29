import { openStatus } from '../lib/hours';
import { initOverrides, getOverrides } from '../lib/overrides';

export const CART_KEY = 'cp-cart-v1';

function setupReveals() {
  const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in), [data-tender]:not(.is-in)');
  if (!('IntersectionObserver' in window) || false) {
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

function setupFab() {
  const fab = document.querySelector<HTMLElement>('[data-fab]');
  if (!fab) return;
  const update = () => fab.classList.toggle('is-on', scrollY > 420);
  update();
  window.addEventListener('scroll', update, { passive: true });
  document.addEventListener('astro:before-swap', () => window.removeEventListener('scroll', update), { once: true });
}

interface Promo { id: string; active: boolean; title: string; text: string; startsAt: string; endsAt: string; cta?: { label: string; href: string } }
// Fechas sin zona horaria se interpretan en hora de Argentina (UTC-3, sin horario de verano).
const arTime = (v: string) => new Date(/(Z|[+-][0-9]{2}:[0-9]{2})$/.test(v) ? v : v + ':00-03:00').getTime();

function setupPromo() {
  const bar = document.querySelector<HTMLElement>('[data-promo]');
  if (!bar) return;
  let promos: Promo[] = [];
  try { promos = JSON.parse(bar.dataset.promos ?? '[]'); } catch { /* sin promos */ }
  const ov = getOverrides().promo;
  const fromAdmin: Promo[] = ov && ov.active ? [{ id: 'admin-' + ov.startsAt, active: true, title: ov.title, text: ov.text, startsAt: ov.startsAt, endsAt: ov.endsAt, cta: ov.ctaHref ? { label: ov.ctaLabel || 'Ver', href: ov.ctaHref } : undefined }] : [];
  promos = [...fromAdmin, ...promos];
  const preview = new URLSearchParams(location.search).get('promo') === 'preview';
  const now = Date.now();
  const live = (p: Promo) => p.active && now >= arTime(p.startsAt) && now <= arTime(p.endsAt);
  const dismissed = (p: Promo) => { try { return sessionStorage.getItem('cp-promo-x:' + p.id) === '1'; } catch { return false; } };
  const pick = preview ? promos[0] : promos.find((p) => live(p) && !dismissed(p));
  if (!pick) { bar.hidden = true; return; }
  bar.querySelector('[data-promo-title]')!.textContent = pick.title;
  bar.querySelector('[data-promo-body]')!.textContent = pick.text;
  bar.querySelector<HTMLElement>('[data-promo-preview]')!.hidden = !preview;
  const cta = bar.querySelector<HTMLAnchorElement>('[data-promo-cta]')!;
  cta.hidden = !pick.cta;
  if (pick.cta) { cta.textContent = pick.cta.label; cta.href = pick.cta.href; }
  bar.hidden = false;
  const close = bar.querySelector('[data-promo-close]')!;
  close.addEventListener('click', () => {
    bar.hidden = true;
    try { sessionStorage.setItem('cp-promo-x:' + pick.id, '1'); } catch { /* sin almacenamiento */ }
  }, { once: true });
}

window.addEventListener('cp:overrides', () => setupPromo());

document.addEventListener('astro:page-load', () => {
  initOverrides();
  setupFab();
  setupPromo();
  setupReveals();
  setupOpenStatus();
  updateCartCount();
});
window.addEventListener('cp:cart', updateCartCount);
