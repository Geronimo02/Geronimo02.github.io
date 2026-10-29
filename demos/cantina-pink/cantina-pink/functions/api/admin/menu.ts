// GET/PUT /api/admin/menu: panel de las dueñas. Protegido con la contraseña ADMIN_PASSWORD (secret de Cloudflare).
// Todo lo que entra se valida con sanitizeOverrides; el navegador nunca decide qué se guarda.
import menu from '../../../src/data/menu.json';
import { sanitizeOverrides, EMPTY_OVERRIDES, MAX_BODY_BYTES } from '../../../src/lib/carta-store';

interface KV { get(key: string): Promise<string | null>; put(key: string, value: string): Promise<void> }
interface Env { CARTA?: KV; ADMIN_PASSWORD?: string }

const VALID_IDS = new Set<string>((menu as { categories: { items: { id: string }[] }[] }).categories.flatMap((c) => c.items.map((i) => i.id)));

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow', 'x-content-type-options': 'nosniff' },
  });

const sha256 = async (s: string) => new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s)));

/** Compara hashes (largo fijo) en tiempo constante para no filtrar la contraseña por tiempos de respuesta. */
async function authorized(request: Request, env: Env): Promise<boolean> {
  const given = (request.headers.get('authorization') ?? '').replace(/^Bearer /, '');
  const [a, b] = await Promise.all([sha256(given), sha256(env.ADMIN_PASSWORD ?? '')]);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

async function guard(request: Request, env: Env): Promise<Response | null> {
  if (!env.ADMIN_PASSWORD || env.ADMIN_PASSWORD.length < 8) return json({ error: 'El panel no está configurado: falta el secret ADMIN_PASSWORD (mínimo 8 caracteres).' }, 503);
  if (!env.CARTA) return json({ error: 'Falta configurar el almacenamiento KV con el nombre CARTA.' }, 503);
  if (!(await authorized(request, env))) {
    await new Promise((r) => setTimeout(r, 600)); // frena los intentos a fuerza bruta
    return json({ error: 'Contraseña incorrecta.' }, 401);
  }
  return null;
}

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  const denied = await guard(request, env);
  if (denied) return denied;
  const raw = await env.CARTA!.get('overrides');
  return json({ ok: true, overrides: raw ? JSON.parse(raw) : EMPTY_OVERRIDES });
};

export const onRequestPut = async ({ request, env }: { request: Request; env: Env }): Promise<Response> => {
  const denied = await guard(request, env);
  if (denied) return denied;

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return json({ error: 'El pedido es demasiado grande.' }, 413);
  let body: unknown;
  try { body = JSON.parse(text); } catch { return json({ error: 'El cuerpo no es JSON válido.' }, 400); }

  const result = sanitizeOverrides(body, VALID_IDS);
  if (!result.ok) return json({ error: 'Hay datos inválidos.', details: result.errors }, 400);

  await env.CARTA!.put('overrides', JSON.stringify(result.value));
  return json({ ok: true, overrides: result.value });
};

export const onRequest = async ({ request }: { request: Request }): Promise<Response> =>
  json({ error: `Método ${request.method} no permitido.` }, 405);
