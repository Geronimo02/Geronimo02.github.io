// Cambios que hacen las dueñas desde /admin sobre la carta. Código puro, compartido entre el servidor
// (Cloudflare Pages Functions) y las pruebas: toda entrada se valida acá, nunca se confía en el navegador.

export interface PromoOverride {
  active: boolean;
  title: string;
  text: string;
  startsAt: string;
  endsAt: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface Overrides {
  updatedAt: string;
  prices: Record<string, number>;
  soldOut: string[];
  promo: PromoOverride | null;
}

export const EMPTY_OVERRIDES: Overrides = { updatedAt: '', prices: {}, soldOut: [], promo: null };

export const MAX_BODY_BYTES = 20_000;
export const MAX_PRICE = 2_000_000;

const DATE_RE = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}$/;
const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const text = (v: unknown, max: number) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max) : '');

/** Solo rutas internas o https: evita enlaces javascript: o data: en la cinta de promo. */
export const safeHref = (v: string) => (/^\/(?!\/)[^\s]*$/.test(v) || /^https:\/\/[^\s]+$/.test(v) ? v : '');

export type SanitizeResult = { ok: true; value: Overrides } | { ok: false; errors: string[] };

export function sanitizeOverrides(input: unknown, validIds: ReadonlySet<string>, now = new Date()): SanitizeResult {
  const errors: string[] = [];
  if (!isRecord(input)) return { ok: false, errors: ['El cuerpo debe ser un objeto JSON.'] };

  const prices: Record<string, number> = {};
  if (input.prices !== undefined) {
    if (!isRecord(input.prices)) errors.push('prices debe ser un objeto.');
    else for (const [id, p] of Object.entries(input.prices)) {
      if (!validIds.has(id)) { errors.push(`Producto desconocido: ${id.slice(0, 40)}`); continue; }
      if (p === null || p === undefined || p === '') continue;
      if (typeof p !== 'number' || !Number.isFinite(p) || !Number.isInteger(p) || p < 1 || p > MAX_PRICE) { errors.push(`Precio inválido para ${id}: tiene que ser un número entero entre 1 y ${MAX_PRICE}.`); continue; }
      prices[id] = p;
    }
  }

  const soldOut: string[] = [];
  if (input.soldOut !== undefined) {
    if (!Array.isArray(input.soldOut)) errors.push('soldOut debe ser una lista.');
    else for (const id of input.soldOut) {
      if (typeof id !== 'string' || !validIds.has(id)) { errors.push(`Producto desconocido en agotados: ${String(id).slice(0, 40)}`); continue; }
      if (!soldOut.includes(id)) soldOut.push(id);
    }
  }

  let promo: PromoOverride | null = null;
  if (input.promo !== undefined && input.promo !== null) {
    if (!isRecord(input.promo)) errors.push('promo debe ser un objeto.');
    else {
      const p = input.promo;
      const title = text(p.title, 60);
      const body = text(p.text, 220);
      const startsAt = text(p.startsAt, 16);
      const endsAt = text(p.endsAt, 16);
      const ctaLabel = text(p.ctaLabel, 30);
      const rawHref = text(p.ctaHref, 200);
      const ctaHref = safeHref(rawHref);
      if (p.active === true) {
        if (!title) errors.push('La promo necesita un título.');
        if (!DATE_RE.test(startsAt) || !DATE_RE.test(endsAt)) errors.push('La promo necesita fecha de inicio y de fin.');
        else if (endsAt <= startsAt) errors.push('La promo termina antes de empezar.');
      }
      if (rawHref && !ctaHref) errors.push('El enlace de la promo debe empezar con / o con https://.');
      promo = { active: p.active === true, title, text: body, startsAt, endsAt, ctaLabel, ctaHref };
    }
  }

  if (errors.length) return { ok: false, errors };
  return { ok: true, value: { updatedAt: now.toISOString(), prices, soldOut, promo } };
}

/** Lo que llega del servidor al navegador se vuelve a validar: si algo está mal, se ignora y se usa la carta base. */
export function parsePublicOverrides(raw: unknown): Overrides {
  if (!isRecord(raw)) return EMPTY_OVERRIDES;
  const prices: Record<string, number> = {};
  if (isRecord(raw.prices)) for (const [id, p] of Object.entries(raw.prices)) if (typeof p === 'number' && Number.isInteger(p) && p > 0 && p <= MAX_PRICE) prices[id] = p;
  const soldOut = Array.isArray(raw.soldOut) ? raw.soldOut.filter((x): x is string => typeof x === 'string').slice(0, 200) : [];
  let promo: PromoOverride | null = null;
  if (isRecord(raw.promo)) {
    const p = raw.promo;
    promo = {
      active: p.active === true, title: text(p.title, 60), text: text(p.text, 220), startsAt: text(p.startsAt, 16), endsAt: text(p.endsAt, 16),
      ctaLabel: text(p.ctaLabel, 30), ctaHref: safeHref(text(p.ctaHref, 200)),
    };
  }
  return { updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt.slice(0, 40) : '', prices, soldOut, promo };
}
