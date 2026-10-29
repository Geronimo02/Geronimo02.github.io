import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/fotos/*.{jpg,jpeg,png,webp,avif}', { eager: true });

export type FotoName =
  | 'pizza-jamon-rucula' | 'pizza-jamon-mano' | 'pizza-huevos'
  | 'milanesa-caballo' | 'mesa-milanesas' | 'empanada-salsa'
  | 'pasta-1-vacio' | 'pasta-2-pasta' | 'pasta-3-salsa' | 'pasta-4-queso' | 'pasta-5-montana';

export const foto = (name: string): ImageMetadata | undefined => {
  const hit = Object.entries(files).find(([path]) => path.split('/').pop()!.replace(/\.\w+$/, '') === name);
  return hit?.[1].default;
};

/** Textos alternativos descriptivos de cada foto real. */
export const FOTO_ALT: Record<FotoName, string> = {
  'pizza-jamon-rucula': 'Pizza con jamón, rúcula y nueces sobre una tabla redonda, en una mesa con mantel a cuadros',
  'pizza-jamon-mano': 'Una mano levanta una porción de pizza con jamón, rúcula y nueces, junto a una cerveza',
  'pizza-huevos': 'Pizza con jamón y cuatro huevos fritos, con el queso estirándose',
  'milanesa-caballo': 'Milanesa a caballo con panceta y dos huevos fritos, y un cuenco de papas fritas, sobre mantel rojo y blanco',
  'mesa-milanesas': 'Mesa con cuatro milanesas gigantes de distintas variedades sobre mantel a cuadros',
  'empanada-salsa': 'Una empanada dorada sobre una tabla de madera, con un cuenco de salsa criolla',
  'pasta-1-vacio': 'Un pan de campo ahuecado, todavía vacío, sobre el mantel a cuadros',
  'pasta-2-pasta': 'Fideos tirados con perejil adentro del pan ahuecado',
  'pasta-3-salsa': 'Pasta con salsa roja adentro del pan ahuecado',
  'pasta-4-queso': 'Pasta con salsa y queso rallado adentro del pan ahuecado',
  'pasta-5-montana': 'El pan con la pasta tapada por una montaña de queso rallado',
};
