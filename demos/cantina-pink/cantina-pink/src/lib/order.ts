// Armado y validación del pedido. Código puro (sin DOM ni JSON importados) para poder probarlo en Node.

export interface OrderLine { name: string; qty: number; unitPrice: number; note?: string }

export interface OrderData {
  orderId: string;
  createdLabel: string;
  mode: 'retiro' | 'delivery';
  whenLabel: string;
  name: string;
  street: string;
  ref: string;
  payment: string;
  cashWith: number | null;
  notes: string;
  lines: OrderLine[];
  /** null = a confirmar por WhatsApp; 0 = gratis */
  deliveryFee: number | null;
  shopAddress: string;
}

export const money = (n: number) => '$' + Math.round(n).toLocaleString('es-AR');

export const subtotalOf = (lines: OrderLine[]) => lines.reduce((t, l) => t + l.qty * l.unitPrice, 0);

export function totalsOf(o: Pick<OrderData, 'lines' | 'mode' | 'deliveryFee'>) {
  const subtotal = subtotalOf(o.lines);
  const fee = o.mode === 'delivery' ? o.deliveryFee : 0;
  return { subtotal, fee, total: subtotal + (fee ?? 0), feePending: o.mode === 'delivery' && o.deliveryFee === null };
}

const RULE = '----------------';
const clean = (t: string) => t.replace(/[*_~`]/g, '').replace(/\s+/g, ' ').trim();

export function newOrderId(now = new Date(), rand: () => number = Math.random): string {
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const suffix = Array.from({ length: 3 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(rand() * 32)]).join('');
  return `CP-${dd}${mm}-${suffix}`;
}

export function buildMessage(o: OrderData): string {
  const t = totalsOf(o);
  const units = o.lines.reduce((n, l) => n + l.qty, 0);
  const out: string[] = [];

  out.push('*PEDIDO WEB - CANTINA PINK*');
  out.push(`Pedido N° ${o.orderId} - hecho ${o.createdLabel}`);
  out.push(RULE);

  out.push('👤 *CLIENTE*');
  out.push(`Nombre: ${clean(o.name)}`);
  out.push(RULE);

  if (o.mode === 'retiro') {
    out.push('🛍️ *MODALIDAD: RETIRO EN EL LOCAL*');
    out.push(`Lugar: ${o.shopAddress}`);
    out.push(`🕒 Retiro: ${o.whenLabel}`);
  } else {
    out.push('🛵 *MODALIDAD: DELIVERY*');
    out.push(`📍 Dirección: ${clean(o.street)}`);
    if (o.ref.trim()) out.push(`Referencias: ${clean(o.ref)}`);
    out.push(`🕒 Entrega: ${o.whenLabel}`);
  }
  out.push(RULE);

  out.push('🍽️ *DETALLE DEL PEDIDO*');
  o.lines.forEach((l, i) => {
    out.push(`${i + 1}) ${l.qty} x ${l.name}`);
    out.push(`    ${money(l.unitPrice)} c/u = ${money(l.qty * l.unitPrice)}`);
    if (l.note?.trim()) out.push(`    Aclaración: ${clean(l.note)}`);
  });
  out.push(RULE);

  out.push(`Productos: ${units}`);
  out.push(`Subtotal: ${money(t.subtotal)}`);
  if (o.mode === 'delivery') {
    out.push(t.feePending ? 'Envío: a confirmar' : t.fee === 0 ? 'Envío: gratis' : `Envío: ${money(t.fee ?? 0)}`);
  }
  out.push(`*TOTAL${t.feePending ? ' (sin envío)' : ''}: ${money(t.total)}*`);
  out.push(RULE);

  out.push('💳 *PAGO*');
  out.push(o.mode === 'retiro' ? `${o.payment} (se abona al retirar)` : `${o.payment} (se abona al recibir)`);
  if (o.cashWith && o.cashWith > t.total) {
    out.push(`Abona con ${money(o.cashWith)} - vuelto ${money(o.cashWith - t.total)}`);
  } else if (o.cashWith && o.cashWith <= t.total) {
    out.push(`Abona con ${money(o.cashWith)}`);
  }

  if (o.notes.trim()) {
    out.push(RULE);
    out.push('📝 *ACLARACIONES*');
    out.push(clean(o.notes));
  }

  out.push(RULE);
  out.push('Precios y disponibilidad según la web, sujetos a confirmación. ¿Me confirman el pedido y el horario? ¡Gracias!');
  return out.join('\n');
}

export function waLink(e164: string, text: string): string {
  return `https://wa.me/${e164.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
}

export type Errors = Partial<Record<'soldout' | 'lines' | 'name' | 'street' | 'when' | 'payment' | 'cashWith' | 'min', string>>;

export interface ValidateInput {
  lineCount: number;
  mode: 'retiro' | 'delivery';
  name: string;
  street: string;
  whenOk: boolean;
  payment: string;
  paymentOptions: string[];
  cashWith: number | null;
  subtotal: number;
  minOrder: number | null;
  /** Nombres de productos del pedido que las dueñas marcaron como agotados. */
  soldOutNames?: string[];
}

export function validate(v: ValidateInput): Errors {
  const e: Errors = {};
  if (v.soldOutNames && v.soldOutNames.length > 0) e.soldout = `Se agotó por hoy: ${v.soldOutNames.join(', ')}. Sacalo del pedido para seguir.`;
  if (v.lineCount === 0) e.lines = 'Agregá al menos un producto desde la carta.';
  if (v.name.trim().length < 2) e.name = 'Decinos tu nombre para llamarte cuando esté listo.';
  if (v.mode === 'delivery' && v.street.trim().length < 5) e.street = 'Escribí la calle, número y, si hay, piso o depto.';
  if (!v.whenOk) e.when = v.mode === 'retiro' ? 'Elegí el día y la hora de retiro.' : 'Elegí el día y la hora de entrega.';
  if (!v.payment || !v.paymentOptions.includes(v.payment)) e.payment = 'Elegí cómo vas a pagar.';
  if (v.cashWith !== null && v.cashWith <= 0) e.cashWith = 'Ingresá un monto válido o dejalo vacío.';
  if (v.mode === 'delivery' && v.minOrder !== null && v.subtotal < v.minOrder) {
    e.min = `El pedido mínimo para delivery es ${money(v.minOrder)}. Te faltan ${money(v.minOrder - v.subtotal)}.`;
  }
  return e;
}

/** Si el link supera esto, WhatsApp puede cortarlo: se ofrece solo "Copiar pedido". */
export const MAX_WA_URL = 6000;
