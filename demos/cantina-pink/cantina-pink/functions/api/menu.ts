// GET /api/menu: cambios vigentes de la carta (precios, agotados, promo). Público y cacheable unos segundos.
// Si el almacenamiento no está configurado, devuelve "sin cambios" y la web usa la carta base (menu.json).
import { EMPTY_OVERRIDES } from '../../src/lib/carta-store';

interface Env { CARTA?: { get(key: string): Promise<string | null> } }

export const onRequestGet = async ({ env }: { env: Env }): Promise<Response> => {
  let body = JSON.stringify(EMPTY_OVERRIDES);
  try {
    const raw = await env.CARTA?.get('overrides');
    if (raw) body = raw;
  } catch {
    // KV caído: la web sigue con la carta base
  }
  return new Response(body, {
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=20', 'x-content-type-options': 'nosniff' },
  });
};
