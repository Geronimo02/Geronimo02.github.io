import { business } from './hours';

/** Link de WhatsApp con mensaje precargado; null mientras no haya número confirmado. */
export function whatsappUrl(text = 'Hola Cantina Pink! Quería hacer una consulta.'): string | null {
  const n = business.whatsapp.e164;
  if (!n) return null;
  return `https://wa.me/${n.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}

export const telUrl = () => `tel:${business.phone.e164}`;
