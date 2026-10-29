// API de pedidos en mesa de Negro Mercado: Cloudflare Worker + D1.
// Público: carta, alta de pedido (con el código de la mesa) y estado de un pedido.
// Panel: todo lo demás, protegido con PANEL_PIN (secreto del Worker).

const ADD_ONS = { 'leche-almendras': { label: 'Leche de almendras y dátiles', price: 1500 }, 'leche-avena': { label: 'Leche de avena', price: 2000 } };
const NO_MILK = ['espresso', 'espresso-largo', 'americano'];
const STATUSES = ['new', 'preparing', 'ready', 'delivered', 'cancelled'];
const TZ_OFFSET = -3 * 60 * 60 * 1000; // Argentina

const json = (data, status = 200, extra = {}) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } });
const bad = (message, status = 400) => json({ error: message }, status);

const hits = new Map(); // limitador simple por IP (por isolate; es una defensa adicional, no la única)
function limited(ip, max = 8, windowMs = 60_000) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > max;
}

function secretOf(env) { return env.TABLE_SECRET || env.PANEL_PIN || ''; }

async function hmacHex(secret, text) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(text));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
const tableToken = async (env, table) => (await hmacHex(secretOf(env), `mesa:${table}`)).slice(0, 10);

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function isPanel(request, env) {
  if (!env.PANEL_PIN) return false; // sin PIN configurado, el panel queda cerrado
  return safeEqual(request.headers.get('x-panel-pin') || '', env.PANEL_PIN);
}

const rowToProduct = (r) => ({ id: r.id, name: r.name, category: r.category, description: r.description, variants: JSON.parse(r.variants), available: !!r.available, published: !!r.published, sort: r.sort });
const rowToOrder = (r) => ({ id: r.id, number: r.number, table: r.table, customer: r.customer, notes: r.notes, items: JSON.parse(r.items), total: r.total, status: r.status, createdAt: r.created_at, updatedAt: r.updated_at });

async function setting(env, key, fallback) {
  const row = await env.DB.prepare('SELECT value FROM settings WHERE key = ?').bind(key).first();
  return row ? row.value : fallback;
}

async function createOrder(request, env) {
  const ip = request.headers.get('cf-connecting-ip') || 'local';
  if (limited(ip)) return bad('Demasiados pedidos seguidos. Esperá un minuto.', 429);
  let body;
  try { body = await request.json(); } catch { return bad('Pedido inválido.'); }

  if ((await setting(env, 'accepting', '1')) !== '1') return bad('Por ahora no estamos tomando pedidos desde la mesa. Pedile al equipo.', 409);

  const table = Number(body.table);
  const tables = Number(await setting(env, 'tables', '12'));
  if (!Number.isInteger(table) || table < 1 || table > tables) return bad('Mesa inválida.');
  const expected = await tableToken(env, table);
  if (!safeEqual(String(body.k || ''), expected)) return bad('El código de la mesa no es válido. Escaneá otra vez el QR de tu mesa.', 403);

  const lines = Array.isArray(body.items) ? body.items.slice(0, 30) : [];
  if (lines.length === 0) return bad('El pedido está vacío.');

  const items = [];
  let total = 0;
  for (const line of lines) {
    const qty = Number(line.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) return bad('Cantidad inválida.');
    const row = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(String(line.id)).first();
    if (!row || !row.published) return bad('Hay un producto que ya no está en la carta.');
    if (!row.available) return bad(`${row.name} está agotado por hoy.`, 409);
    const product = rowToProduct(row);
    const variant = product.variants.find((v) => v.label === line.variant);
    if (!variant || typeof variant.price !== 'number') return bad(`Falta confirmar el precio de ${product.name}.`);
    let addOn = null;
    if (line.addOnId) {
      addOn = ADD_ONS[line.addOnId];
      if (!addOn || product.category !== 'Cafetería' || NO_MILK.includes(product.id)) return bad('Adicional inválido.');
    }
    const unit = variant.price + (addOn ? addOn.price : 0);
    total += unit * qty;
    items.push({ id: product.id, name: product.name, variant: variant.label, addOn: addOn ? addOn.label : null, qty, unit });
  }

  const now = Date.now();
  const dayStart = Math.floor((now + TZ_OFFSET) / 86_400_000) * 86_400_000 - TZ_OFFSET;
  const last = await env.DB.prepare('SELECT COALESCE(MAX(number), 0) AS n FROM orders WHERE created_at >= ?').bind(dayStart).first();
  const number = (last?.n || 0) + 1;
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 20);
  await env.DB.prepare('INSERT INTO orders (id, number, "table", customer, notes, items, total, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(id, number, table, String(body.customer || '').slice(0, 40), String(body.notes || '').slice(0, 240), JSON.stringify(items), total, 'new', now, now).run();
  return json({ id, number, total }, 201);
}

async function panelRoutes(request, env, url) {
  const path = url.pathname.replace(/^\/api\/panel/, '');
  const method = request.method;

  if (path === '/orders' && method === 'GET') {
    const dayStart = Math.floor((Date.now() + TZ_OFFSET) / 86_400_000) * 86_400_000 - TZ_OFFSET;
    const { results } = await env.DB.prepare("SELECT * FROM orders WHERE status IN ('new','preparing','ready') OR created_at >= ? ORDER BY created_at ASC LIMIT 200").bind(dayStart).all();
    return json({ orders: results.map(rowToOrder), now: Date.now() });
  }

  const order = path.match(/^\/orders\/([a-z0-9]+)$/);
  if (order && method === 'PATCH') {
    const body = await request.json().catch(() => ({}));
    if (!STATUSES.includes(body.status)) return bad('Estado inválido.');
    const res = await env.DB.prepare('UPDATE orders SET status = ?, updated_at = ? WHERE id = ?').bind(body.status, Date.now(), order[1]).run();
    return res.meta.changes ? json({ ok: true }) : bad('Pedido no encontrado.', 404);
  }

  if (path === '/products' && method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM products ORDER BY sort ASC, name ASC').all();
    return json({ products: results.map(rowToProduct) });
  }
  if (path === '/products' && method === 'POST') {
    const b = await request.json().catch(() => ({}));
    const err = validateProduct(b, true);
    if (err) return bad(err);
    const id = String(b.id || slug(b.name));
    const exists = await env.DB.prepare('SELECT id FROM products WHERE id = ?').bind(id).first();
    if (exists) return bad('Ya existe un producto con ese nombre.', 409);
    const max = await env.DB.prepare('SELECT COALESCE(MAX(sort), 0) AS n FROM products').first();
    await env.DB.prepare('INSERT INTO products (id, name, category, description, variants, available, published, sort) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(id, b.name.trim(), b.category.trim(), String(b.description || '').slice(0, 300), JSON.stringify(cleanVariants(b.variants)), b.available === false ? 0 : 1, b.published === false ? 0 : 1, (max?.n || 0) + 1).run();
    return json({ id }, 201);
  }
  const prod = path.match(/^\/products\/([a-z0-9-]+)$/);
  if (prod && method === 'PUT') {
    const b = await request.json().catch(() => ({}));
    const err = validateProduct(b, false);
    if (err) return bad(err);
    const res = await env.DB.prepare('UPDATE products SET name = ?, category = ?, description = ?, variants = ?, available = ?, published = ? WHERE id = ?')
      .bind(b.name.trim(), b.category.trim(), String(b.description || '').slice(0, 300), JSON.stringify(cleanVariants(b.variants)), b.available ? 1 : 0, b.published ? 1 : 0, prod[1]).run();
    return res.meta.changes ? json({ ok: true }) : bad('Producto no encontrado.', 404);
  }

  if (path === '/settings' && method === 'GET') return json({ tables: Number(await setting(env, 'tables', '12')), accepting: (await setting(env, 'accepting', '1')) === '1' });
  if (path === '/settings' && method === 'PUT') {
    const b = await request.json().catch(() => ({}));
    const tables = Number(b.tables);
    if (!Number.isInteger(tables) || tables < 1 || tables > 80) return bad('Cantidad de mesas inválida (1 a 80).');
    await env.DB.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind('tables', String(tables)).run();
    await env.DB.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value').bind('accepting', b.accepting ? '1' : '0').run();
    return json({ ok: true });
  }

  if (path === '/qr' && method === 'GET') {
    const table = Number(url.searchParams.get('mesa'));
    const tables = Number(await setting(env, 'tables', '12'));
    if (!Number.isInteger(table) || table < 1 || table > tables) return bad('Mesa inválida.');
    return json({ table, url: `${url.origin}/mesa/${table}/?k=${await tableToken(env, table)}` });
  }

  return bad('No encontrado.', 404);
}

const slug = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
function cleanVariants(v) {
  return (Array.isArray(v) ? v : []).slice(0, 6).map((x) => ({ label: String(x.label || 'Único').slice(0, 20), price: x.price === null || x.price === '' ? null : Math.round(Number(x.price)) }));
}
function validateProduct(b, creating) {
  if (!b || typeof b.name !== 'string' || b.name.trim().length < 2 || b.name.length > 80) return 'Poné un nombre (2 a 80 letras).';
  if (typeof b.category !== 'string' || !b.category.trim()) return 'Elegí una categoría.';
  const vs = cleanVariants(b.variants);
  if (vs.length === 0) return 'Cargá al menos una opción.';
  if (vs.some((v) => v.price !== null && (!Number.isFinite(v.price) || v.price < 0 || v.price > 500_000))) return 'Hay un precio inválido.';
  if (creating && !slug(b.name)) return 'Nombre inválido.';
  return null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    try {
      if (url.pathname === '/api/menu' && request.method === 'GET') {
        const { results } = await env.DB.prepare('SELECT * FROM products WHERE published = 1 ORDER BY sort ASC, name ASC').all();
        return json({ items: results.map(rowToProduct), accepting: (await setting(env, 'accepting', '1')) === '1' });
      }
      if (url.pathname === '/api/orders' && request.method === 'POST') return await createOrder(request, env);
      const status = url.pathname.match(/^\/api\/orders\/([a-z0-9]+)$/);
      if (status && request.method === 'GET') {
        const row = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(status[1]).first();
        if (!row) return bad('Pedido no encontrado.', 404);
        const o = rowToOrder(row);
        return json({ number: o.number, table: o.table, status: o.status, items: o.items, total: o.total, createdAt: o.createdAt });
      }
      if (url.pathname.startsWith('/api/panel')) {
        if (!isPanel(request, env)) return bad('PIN incorrecto.', 401);
        return await panelRoutes(request, env, url);
      }
      return bad('No encontrado.', 404);
    } catch (error) {
      console.error('api error', error && error.message);
      return bad('Error interno. Probá de nuevo.', 500);
    }
  },
};
