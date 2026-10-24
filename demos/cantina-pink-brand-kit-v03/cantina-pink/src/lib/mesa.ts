// "Tu mesa": cada unidad del pedido es un plato redondo visto desde arriba.
// Con foto real si el producto la tiene; si no, una ilustración de su categoría; si no, un plato liso con iniciales.
import type { MenuItem } from './menu';

const BY_CATEGORY: Record<string, string> = {
  pizzas: 'pizza', milanesas: 'milanesa', pastas: 'pasta', empanadas: 'empanada', postres: 'flan', 'picadas-sandwiches': 'milanesa',
};

export interface Plate { src: string | null; label: string }

export function plateFor(item: Pick<MenuItem, 'foto' | 'image' | 'category' | 'name'>): Plate {
  if (item.foto) return { src: `/mesa/${item.foto}.webp`, label: item.name };
  const art = item.image ?? BY_CATEGORY[item.category ?? ''];
  if (art) return { src: `/mesa/${art}.svg`, label: item.name };
  return { src: null, label: item.name };
}

export function initials(name: string): string {
  const parts = name.split(/\s+/).filter((w) => w.length > 2);
  return (parts.length ? parts : [name]).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

/** Cuántos platos se dibujan como máximo; el resto se resume en "+N". */
export const MAX_PLATES = 16;

/** Diámetro de cada plato según cuántos haya, para que siempre entren en la mesa. */
export const plateSize = (count: number) => (count <= 3 ? 92 : count <= 6 ? 76 : count <= 10 ? 62 : 50);

/** Giro leve y estable por plato: parecen apoyados a mano, y no cambian entre renders. */
export const plateTilt = (id: string, k: number) => ((id.length * 7 + k * 37) % 13) - 6;
