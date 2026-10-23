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

export const PENDING = '[COMPLETAR]';

export const allItems = (): MenuItem[] => menu.categories.flatMap((c) => c.items);

export const findItem = (id: string): MenuItem | undefined => allItems().find((i) => i.id === id);

export const isOrderable = (i: MenuItem): boolean => i.online && typeof i.price === 'number' && i.price > 0;

export function formatPrice(value: number | null): string {
  if (value === null) return 'Consultar';
  return '$' + Math.round(value).toLocaleString('es-AR');
}

/** Separa el texto visible del marcador [COMPLETAR] para poder renderizarlo como placeholder. */
export function splitPending(text: string): { text: string; pending: boolean } {
  const pending = text.includes(PENDING);
  return { text: text.replace(PENDING, '').replace(/\s{2,}/g, ' ').trim(), pending };
}

export const dailySpecialItem = (): MenuItem | undefined =>
  menu.dailySpecial.active ? findItem(menu.dailySpecial.itemId) : undefined;
