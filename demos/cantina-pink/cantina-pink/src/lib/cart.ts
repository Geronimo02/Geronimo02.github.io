// Estado del pedido. Vive en el navegador (localStorage); no hay servidor ni pago online.
export const CART_KEY = 'cp-cart-v1';

export type Mode = 'retiro' | 'delivery';
export type WhenKind = 'asap' | 'slot';

export interface Line { id: string; qty: number; note?: string }

export interface CartState {
  lines: Line[];
  mode: Mode;
  whenKind: WhenKind;
  slot: string;
  name: string;
  street: string;
  ref: string;
  payment: string;
  cashWith: string;
  notes: string;
}

export const MAX_QTY = 30;

export const emptyState = (): CartState => ({
  lines: [], mode: 'retiro', whenKind: 'slot', slot: '', name: '', street: '', ref: '', payment: '', cashWith: '', notes: '',
});

const str = (v: unknown, max = 300) => (typeof v === 'string' ? v.slice(0, max) : '');

/** Lee y sanea lo guardado: nunca confía en que el JSON tenga la forma esperada. */
export function load(): CartState {
  const base = emptyState();
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return base;
    const d = JSON.parse(raw);
    const lines: Line[] = Array.isArray(d.lines)
      ? d.lines
          .filter((l: any) => l && typeof l.id === 'string' && Number.isFinite(l.qty))
          .map((l: any) => ({ id: l.id, qty: Math.min(MAX_QTY, Math.max(1, Math.floor(l.qty))), note: str(l.note, 140) || undefined }))
      : [];
    return {
      ...base,
      lines,
      mode: d.mode === 'delivery' ? 'delivery' : 'retiro',
      whenKind: d.whenKind === 'asap' ? 'asap' : 'slot',
      slot: str(d.slot, 40), name: str(d.name, 80), street: str(d.street, 160),
      ref: str(d.ref, 200), payment: str(d.payment, 60), cashWith: str(d.cashWith, 20), notes: str(d.notes, 500),
    };
  } catch {
    return base;
  }
}

export function save(state: CartState, source: 'island' | 'page' = 'page') {
  try { localStorage.setItem(CART_KEY, JSON.stringify(state)); } catch { /* sin almacenamiento */ }
  window.dispatchEvent(new CustomEvent('cp:cart', { detail: { source } }));
}

export const qtyOf = (s: CartState, id: string) => s.lines.find((l) => l.id === id)?.qty ?? 0;
export const countOf = (s: CartState) => s.lines.reduce((n, l) => n + l.qty, 0);

export function setQty(s: CartState, id: string, qty: number): CartState {
  const q = Math.min(MAX_QTY, Math.floor(qty));
  if (q <= 0) return { ...s, lines: s.lines.filter((l) => l.id !== id) };
  const exists = s.lines.some((l) => l.id === id);
  return { ...s, lines: exists ? s.lines.map((l) => (l.id === id ? { ...l, qty: q } : l)) : [...s.lines, { id, qty: q }] };
}

export const addOne = (s: CartState, id: string) => setQty(s, id, qtyOf(s, id) + 1);

export const setNote = (s: CartState, id: string, note: string): CartState => ({
  ...s, lines: s.lines.map((l) => (l.id === id ? { ...l, note: note.slice(0, 140) || undefined } : l)),
});

export const clearLines = (s: CartState): CartState => ({ ...s, lines: [] });
