import type { MenuItem } from './data';

export type OrderItem = { id: string; name: string; variant: string; addOn: string | null; qty: number; unit: number };
export type OrderStatus = 'new' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type PanelOrder = { id: string; number: number; table: number; customer: string; notes: string; items: OrderItem[]; total: number; status: OrderStatus; createdAt: number; updatedAt: number };
export type PanelProduct = { id: string; name: string; category: string; description: string; variants: { label: string; price: number | null }[]; available: boolean; published: boolean; sort: number };

async function request<T>(path: string, init: RequestInit = {}, pin?: string): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { 'content-type': 'application/json', ...(pin ? { 'x-panel-pin': pin } : {}), ...(init.headers || {}) },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error((data as { error?: string }).error || 'No pudimos completar la acción.'), { status: res.status });
  return data as T;
}

export const api = {
  menu: () => request<{ items: (MenuItem & { available: boolean })[]; accepting: boolean }>('/api/menu'),
  createOrder: (body: { table: number; k: string; customer: string; notes: string; items: { id: string; variant: string; addOnId?: string; qty: number }[] }) =>
    request<{ id: string; number: number; total: number }>('/api/orders', { method: 'POST', body: JSON.stringify(body) }),
  order: (id: string) => request<{ number: number; table: number; status: OrderStatus; items: OrderItem[]; total: number; createdAt: number }>(`/api/orders/${id}`),
  panel: {
    orders: (pin: string) => request<{ orders: PanelOrder[]; now: number }>('/api/panel/orders', {}, pin),
    setStatus: (pin: string, id: string, status: OrderStatus) => request<{ ok: true }>(`/api/panel/orders/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }, pin),
    products: (pin: string) => request<{ products: PanelProduct[] }>('/api/panel/products', {}, pin),
    saveProduct: (pin: string, p: Partial<PanelProduct> & { name: string; category: string; variants: PanelProduct['variants'] }, creating: boolean) =>
      request<unknown>(creating ? '/api/panel/products' : `/api/panel/products/${p.id}`, { method: creating ? 'POST' : 'PUT', body: JSON.stringify(p) }, pin),
    settings: (pin: string) => request<{ tables: number; accepting: boolean }>('/api/panel/settings', {}, pin),
    saveSettings: (pin: string, s: { tables: number; accepting: boolean }) => request<{ ok: true }>('/api/panel/settings', { method: 'PUT', body: JSON.stringify(s) }, pin),
    qr: (pin: string, mesa: number) => request<{ table: number; url: string }>(`/api/panel/qr?mesa=${mesa}`, {}, pin),
  },
};
