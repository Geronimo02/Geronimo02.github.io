// Consulta de mesa para grupos. Código puro (sin DOM) para poder probarlo en Node.
// Es una CONSULTA, nunca una reserva confirmada: no hay sistema de cupos.

export const OCCASIONS = ['Cumpleaños', 'Despedida', 'Reunión de trabajo', 'Encuentro de amigos o familia', 'Otra ocasión'] as const;
export const INTERESTS = ['Pizza libre', 'Pasta libre', 'Milanesas XL para compartir', 'Picada', 'Todavía no sé, quiero ver opciones'] as const;

export interface GroupData {
  consultId: string;
  createdLabel: string;
  name: string;
  people: number;
  dayLabel: string;
  time: string;
  occasion: string;
  interests: string[];
  dietary: string;
  notes: string;
}

const RULE = '----------------';
const clean = (t: string) => t.replace(/[*_~`]/g, '').replace(/\s+/g, ' ').trim();

export function newConsultId(now = new Date(), rand: () => number = Math.random): string {
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const suffix = Array.from({ length: 3 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(rand() * 32)]).join('');
  return `GR-${dd}${mm}-${suffix}`;
}

export function buildGroupMessage(g: GroupData): string {
  const out: string[] = [];
  out.push('*CONSULTA DE MESA PARA GRUPO - CANTINA PINK*');
  out.push(`Consulta N° ${g.consultId} - hecha ${g.createdLabel}`);
  out.push(RULE);
  out.push('👤 *CONTACTO*');
  out.push(`Nombre: ${clean(g.name)}`);
  out.push(RULE);
  out.push('🍽️ *LA MESA*');
  out.push(`Somos: ${g.people} ${g.people === 1 ? 'persona' : 'personas'}`);
  out.push(`🗓️ Día: ${g.dayLabel}`);
  out.push(`🕒 Hora de llegada: ${g.time === 'a-confirmar' ? 'a coordinar' : g.time + ' h'}`);
  out.push(`Ocasión: ${g.occasion}`);
  if (g.interests.length) {
    out.push(RULE);
    out.push('⭐ *NOS INTERESA*');
    g.interests.forEach((i) => out.push(`- ${i}`));
  }
  if (g.dietary.trim()) {
    out.push(RULE);
    out.push('🥗 *ALERGIAS O RESTRICCIONES*');
    out.push(clean(g.dietary));
  }
  if (g.notes.trim()) {
    out.push(RULE);
    out.push('📝 *ACLARACIONES*');
    out.push(clean(g.notes));
  }
  out.push(RULE);
  out.push('Es una consulta, no una reserva confirmada. ¿Tienen lugar para el grupo ese día y a esa hora? ¡Gracias!');
  return out.join('\n');
}

export type GroupErrors = Partial<Record<'name' | 'people' | 'date' | 'time' | 'occasion', string>>;

export interface GroupInput {
  name: string; people: number | null; date: string; time: string; occasion: string;
  timeOptions: string[]; today: string; maxDate: string;
}

export function validateGroup(v: GroupInput): GroupErrors {
  const e: GroupErrors = {};
  if (v.name.trim().length < 2) e.name = 'Decinos tu nombre para poder contestarte.';
  if (v.people === null || !Number.isInteger(v.people) || v.people < 2) e.people = 'Contanos cuántas personas son (desde 2).';
  else if (v.people > 80) e.people = 'Para más de 80 personas escribinos directo por WhatsApp o llamanos.';
  if (!v.date || v.date < v.today) e.date = 'Elegí un día desde hoy en adelante.';
  else if (v.date > v.maxDate) e.date = 'Podés consultar hasta 120 días hacia adelante.';
  else if (v.timeOptions.length === 0) e.date = 'Ese día el local está cerrado. Elegí otro.';
  if (!e.date && !v.timeOptions.concat('a-confirmar').includes(v.time)) e.time = 'Elegí una hora de llegada o "a coordinar".';
  if (!v.occasion || !(OCCASIONS as readonly string[]).includes(v.occasion)) e.occasion = 'Elegí la ocasión.';
  return e;
}
