// MODO DEMO: no hay servidor ni base de datos. Todo vive en el navegador (localStorage)
// con datos ficticios. La interfaz es la misma que tendría una API real, así que
// reemplazar este archivo por llamadas a un backend no toca el resto del sitio.
import { menu as staticMenu, type MenuItem } from './data';

export type OrderItem = { id: string; name: string; variant: string; addOn: string | null; qty: number; unit: number };
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PanelOrder = { id: string; number: number; table: number; customer: string; notes: string; items: OrderItem[]; total: number; status: OrderStatus; createdAt: number; updatedAt: number };
export type PanelProduct = { id: string; name: string; category: string; description: string; variants: { label: string; price: number | null }[]; available: boolean; published: boolean; sort: number };

export const DEMO_PIN = '1234';
const K = { orders: 'nm-demo-orders', products: 'nm-demo-products', settings: 'nm-demo-settings' };
const ADD_ONS: Record<string, { label: string; price: number }> = {
  'leche-almendras': { label: 'Leche de almendras y dátiles', price: 1500 },
  'leche-avena': { label: 'Leche de avena', price: 2000 },
};
const NO_MILK = ['espresso', 'espresso-largo', 'americano'];

const read = <T,>(key: string, fallback: T): T => {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
};
const write = (key: string, value: unknown) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sin almacenamiento */ } };
const wait = <T,>(v: T, ms = 120) => new Promise<T>((r) => setTimeout(() => r(v), ms));
const slug = (s: string) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
const fail = (message: string, status = 400): never => { throw Object.assign(new Error(message), { status }); };

// Productos de ejemplo de café de especialidad (precios ficticios para la demo).
const demoExtras: PanelProduct[] = [
  { id: 'chemex', name: 'Filtrado Chemex', category: 'Café de especialidad', description: 'Café de origen, método filtrado.', variants: [{ label: 'Único', price: 9500 }], available: true, published: true, sort: 100 },
  { id: 'cold-brew', name: 'Cold brew', category: 'Café de especialidad', description: 'Infusión en frío, servida con hielo.', variants: [{ label: 'Único', price: 6800 }], available: true, published: true, sort: 101 },
  { id: 'affogato', name: 'Affogato', category: 'Café de especialidad', description: 'Helado con un espresso por encima.', variants: [{ label: 'Único', price: 8200 }], available: true, published: true, sort: 102 },
  { id: 'cafe-en-grano', name: 'Café en grano 250 g', category: 'Café de especialidad', description: 'Para llevar a casa.', variants: [{ label: '250 g', price: 18000 }], available: true, published: true, sort: 103 },
];

function products(): PanelProduct[] {
  const saved = read<PanelProduct[] | null>(K.products, null);
  if (saved) return saved;
  const base: PanelProduct[] = staticMenu.map((m, i) => ({ id: m.id, name: m.name, category: m.category, description: m.description || '', variants: m.variants.map((v) => ({ ...v })), available: true, published: m.published, sort: i }));
  const all = [...base, ...demoExtras];
  write(K.products, all);
  return all;
}

const settings = () => read<{ tables: number; accepting: boolean }>(K.settings, { tables: 12, accepting: true });

function seedOrders(): PanelOrder[] {
  const now = Date.now();
  const mk = (n: number, table: number, customer: string, notes: string, items: OrderItem[], status: OrderStatus, minsAgo: number): PanelOrder => ({
    id: `demo${n}`, number: n, table, customer, notes, items, total: items.reduce((s, i) => s + i.unit * i.qty, 0), status, createdAt: now - minsAgo * 60000, updatedAt: now - minsAgo * 60000,
  });
  return [
    mk(1, 3, 'Martina', 'Sin azúcar, por favor', [{ id: 'latte', name: 'Latte', variant: 'D', addOn: 'Leche de avena', qty: 1, unit: 8000 }, { id: 'medialuna', name: 'Medialuna dulce', variant: 'Único', addOn: null, qty: 2, unit: 2200 }], 'new', 2),
    mk(2, 5, 'Lucas', '', [{ id: 'cold-brew', name: 'Cold brew', variant: 'Único', addOn: null, qty: 2, unit: 6800 }], 'preparing', 7),
    mk(3, 8, '', 'Para compartir', [{ id: 'vermu-compartir', name: 'La fuerza de compartir', variant: 'Único', addOn: null, qty: 1, unit: 39000 }], 'ready', 12),
  ];
}
const orders = () => read<PanelOrder[] | null>(K.orders, null) ?? (() => { const s = seedOrders(); write(K.orders, s); return s; })();

export function resetDemo() { Object.values(K).forEach((k) => { try { localStorage.removeItem(k); } catch { /* nada */ } }); try { localStorage.removeItem('negro-mercado-v3-ultimo-pedido'); } catch { /* nada */ } }

const needPin = (pin: string) => { if (pin !== DEMO_PIN) fail('PIN incorrecto. En la demo es 1234.', 401); };

export const api = {
  menu: async () => {
    const items = products().map((p) => ({ id: p.id, name: p.name, category: p.category, description: p.description, variants: p.variants as MenuItem['variants'], published: p.published, available: p.available, image: undefined, source: 'carta-aportada' as const }));
    return wait({ items: items as (MenuItem & { available: boolean })[], accepting: settings().accepting }, 30);
  },

  createOrder: async (body: { table: number; k: string; customer: string; notes: string; items: { id: string; variant: string; addOnId?: string; qty: number }[] }) => {
    const s = settings();
    if (!s.accepting) fail('Por ahora no estamos tomando pedidos desde la mesa. Pedile al equipo.', 409);
    if (!Number.isInteger(body.table) || body.table < 1 || body.table > s.tables) fail('Mesa inválida.');
    if (!body.items.length) fail('El pedido está vacío.');
    const list = products();
    const items: OrderItem[] = body.items.map((line) => {
      const p = list.find((x) => x.id === line.id);
      if (!p || !p.published) return fail('Hay un producto que ya no está en la carta.');
      if (!p.available) return fail(`${p.name} está agotado por hoy.`, 409);
      const v = p.variants.find((x) => x.label === line.variant);
      if (!v || typeof v.price !== 'number') return fail(`Falta confirmar el precio de ${p.name}.`);
      const add = line.addOnId ? ADD_ONS[line.addOnId] : undefined;
      if (line.addOnId && (!add || p.category !== 'Cafetería' || NO_MILK.includes(p.id))) return fail('Adicional inválido.');
      return { id: p.id, name: p.name, variant: v.label, addOn: add ? add.label : null, qty: line.qty, unit: v.price + (add ? add.price : 0) };
    });
    const all = orders();
    const now = Date.now();
    const order: PanelOrder = {
      id: `o${now.toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      number: all.reduce((m, o) => Math.max(m, o.number), 0) + 1, table: body.table, customer: body.customer.slice(0, 40), notes: body.notes.slice(0, 240),
      items, total: items.reduce((t, i) => t + i.unit * i.qty, 0), status: 'new', createdAt: now, updatedAt: now,
    };
    write(K.orders, [...all, order]);
    return wait({ id: order.id, number: order.number, total: order.total });
  },

  order: async (id: string) => {
    const o = orders().find((x) => x.id === id);
    if (!o) return fail('Pedido no encontrado.', 404);
    return wait({ number: o.number, table: o.table, status: o.status, items: o.items, total: o.total, createdAt: o.createdAt }, 40);
  },

  panel: {
    orders: async (pin: string) => { needPin(pin); return wait({ orders: orders(), now: Date.now() }, 40); },
    setStatus: async (pin: string, id: string, status: OrderStatus) => {
      needPin(pin);
      write(K.orders, orders().map((o) => (o.id === id ? { ...o, status, updatedAt: Date.now() } : o)));
      return wait({ ok: true as const }, 40);
    },
    products: async (pin: string) => { needPin(pin); return wait({ products: [...products()].sort((a, b) => a.sort - b.sort) }, 40); },
    saveProduct: async (pin: string, p: Partial<PanelProduct> & { name: string; category: string; variants: PanelProduct['variants'] }, creating: boolean) => {
      needPin(pin);
      if (p.name.trim().length < 2) fail('Poné un nombre (2 a 80 letras).');
      if (!p.variants.length) fail('Cargá al menos una opción.');
      const list = products();
      if (creating) {
        const id = slug(p.name);
        if (list.some((x) => x.id === id)) fail('Ya existe un producto con ese nombre.', 409);
        write(K.products, [...list, { id, name: p.name.trim(), category: p.category.trim(), description: p.description || '', variants: p.variants, available: p.available !== false, published: p.published !== false, sort: list.reduce((m, x) => Math.max(m, x.sort), 0) + 1 }]);
      } else {
        write(K.products, list.map((x) => (x.id === p.id ? { ...x, name: p.name.trim(), category: p.category.trim(), description: p.description || '', variants: p.variants, available: !!p.available, published: !!p.published } : x)));
      }
      return wait({ ok: true }, 40);
    },
    settings: async (pin: string) => { needPin(pin); return wait(settings(), 40); },
    saveSettings: async (pin: string, s: { tables: number; accepting: boolean }) => {
      needPin(pin);
      if (!Number.isInteger(s.tables) || s.tables < 1 || s.tables > 80) fail('Cantidad de mesas inválida (1 a 80).');
      write(K.settings, s);
      return wait({ ok: true as const }, 40);
    },
    qr: async (pin: string, mesa: number) => { needPin(pin); return wait({ table: mesa, url: `${window.location.origin}/mesa/${mesa}/` }, 5); },
  },
};
