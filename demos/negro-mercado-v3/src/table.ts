// La mesa llega por el QR: /mesa/7/?k=<código>. Se guarda unas horas en este dispositivo.
export type TableInfo = { table: number; k: string; at: number };
const key = 'negro-mercado-v3-mesa';
const TTL = 6 * 60 * 60 * 1000;

export function readTable(): TableInfo | null {
  try {
    const v = JSON.parse(localStorage.getItem(key) || 'null');
    if (v && Number.isInteger(v.table) && typeof v.k === 'string' && Date.now() - v.at < TTL) return v;
  } catch { /* sin almacenamiento */ }
  return null;
}

// Si la URL es de mesa, la guarda y devuelve true (el llamador redirige a la carta).
export function captureTable(): boolean {
  const m = window.location.pathname.match(/^\/mesa\/(\d{1,2})\/?$/);
  if (!m) return false;
  const k = new URLSearchParams(window.location.search).get('k') || '';
  try { localStorage.setItem(key, JSON.stringify({ table: Number(m[1]), k, at: Date.now() })); } catch { /* sin almacenamiento */ }
  return true;
}

export function clearTable() { try { localStorage.removeItem(key); } catch { /* nada */ } }
