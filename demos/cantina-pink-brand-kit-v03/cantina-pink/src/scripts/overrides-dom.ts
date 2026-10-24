// Parche liviano de la carta con los cambios de /admin. Sin dependencias pesadas: también lo usa /mesa (página liviana del QR).
import { parsePublicOverrides, type Overrides } from '../lib/carta-store';

export const peso = (n: number) => '$' + Math.round(n).toLocaleString('es-AR');

export function patchDom(ov: Overrides) {
  document.querySelectorAll<HTMLElement>('[data-price-text]').forEach((el) => {
    const id = el.dataset.priceText!;
    if (el.dataset.priceBase === undefined) el.dataset.priceBase = el.textContent ?? '';
    el.textContent = ov.prices[id] ? peso(ov.prices[id]) : el.dataset.priceBase;
  });
  document.querySelectorAll<HTMLElement>('[data-price-note]').forEach((el) => { el.hidden = !!ov.prices[el.dataset.priceNote!]; });
  document.querySelectorAll<HTMLElement>('[data-soldout-for]').forEach((el) => { el.hidden = !ov.soldOut.includes(el.dataset.soldoutFor!); });
}

/** Trae los cambios vigentes. Si no hay servidor o falla, devuelve null y la web sigue con la carta base. */
export async function fetchOverrides(): Promise<Overrides | null> {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), 3500);
  try {
    const res = await fetch('/api/menu', { signal: ctl.signal, headers: { accept: 'application/json' } });
    if (!res.ok || !(res.headers.get('content-type') ?? '').includes('json')) return null;
    return parsePublicOverrides(await res.json());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
