import menuData from '../data/menu.json';

export type Recorte = 'pizza' | 'milanesa' | 'pasta' | 'empanada' | 'flan';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number | null;
  priceVerified: boolean;
  unit?: string;
  online: boolean;
  mesa: boolean;
  tags: string[];
  image: Recorte | null;
  /** Nombre de una foto real en src/assets/fotos (sin extensión). */
  foto?: string;
  /** Id de la categoría; se completa al cargar la carta. */
  category?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  kicker: string;
  items: MenuItem[];
}

export const menu = menuData as unknown as {
  updatedAt: string;
  verified: boolean;
  currency: string;
  dailySpecial: { active: boolean; label: string; itemId: string; note: string; verified: boolean };
  categories: MenuCategory[];
};

for (const c of menu.categories) for (const i of c.items) i.category = c.id;

export const PENDING = '[COMPLETAR]';

export const allItems = (): MenuItem[] => menu.categories.flatMap((c) => c.items);

export const findItem = (id: string): MenuItem | undefined => allItems().find((i) => i.id === id);

export const isOrderable = (i: MenuItem): boolean => i.online && typeof i.price === 'number' && i.price > 0;

export function formatPrice(value: number | null): string {
  if (value === null) return 'Consultar';
  return '$' + Math.round(value).toLocaleString('es-AR');
}

/** En las descripciones, lo que sigue a [COMPLETAR] es una nota interna: no se muestra como texto. */
export function splitPending(text: string): { text: string; pending: boolean; note: string } {
  const i = text.indexOf(PENDING);
  if (i === -1) return { text: text.trim(), pending: false, note: '' };
  return { text: text.slice(0, i).trim(), pending: true, note: text.slice(i + PENDING.length).trim() };
}

export const dailySpecialItem = (): MenuItem | undefined =>
  menu.dailySpecial.active ? findItem(menu.dailySpecial.itemId) : undefined;
