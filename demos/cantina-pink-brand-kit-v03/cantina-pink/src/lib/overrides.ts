// Cambios de la carta hechos desde /admin, aplicados en memoria sobre menu.json.
import { allItems } from './menu';
import { EMPTY_OVERRIDES, type Overrides } from './carta-store';
import { patchDom, fetchOverrides } from '../scripts/overrides-dom';

let current: Overrides = EMPTY_OVERRIDES;
const base = new Map<string, { price: number | null; verified: boolean }>();

export const getOverrides = () => current;
export const isSoldOut = (id: string) => current.soldOut.includes(id);

export function applyOverrides(ov: Overrides) {
  for (const item of allItems()) {
    if (!base.has(item.id)) base.set(item.id, { price: item.price, verified: item.priceVerified });
    const b = base.get(item.id)!;
    item.price = ov.prices[item.id] ?? b.price;
    item.priceVerified = item.id in ov.prices ? true : b.verified;
  }
  current = ov;
  patchDom(ov);
  window.dispatchEvent(new CustomEvent('cp:overrides'));
}

export async function initOverrides() {
  const ov = await fetchOverrides();
  if (ov) applyOverrides(ov);
}
