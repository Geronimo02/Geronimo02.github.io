import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGroupMessage, validateGroup, newConsultId } from '../src/lib/group.ts';

const base = { consultId: 'GR-2310-K7M', createdLabel: 'el jueves 23/10 a las 21:08 h', name: 'Ana López', phone: '249 444-0808', people: 12, dayLabel: 'sábado 25/10', time: '21:00', occasion: 'Cumpleaños', interests: ['Pizza libre', 'Milanesas XL para compartir'], dietary: '', notes: '' };

test('mensaje completo de consulta', () => {
  const m = buildGroupMessage({ ...base, dietary: '2 celíacos', notes: 'Llevamos torta' });
  for (const f of ['CONSULTA DE MESA PARA GRUPO - CANTINA PINK', 'GR-2310-K7M', 'Nombre: Ana López', 'Somos: 12 personas', 'Día: sábado 25/10', 'Hora de llegada: 21:00 h', 'Ocasión: Cumpleaños', '- Pizza libre', '- Milanesas XL para compartir', '2 celíacos', 'Llevamos torta', 'no una reserva confirmada']) assert.ok(m.includes(f), 'falta: ' + f);
});

test('hora a coordinar y secciones opcionales ocultas', () => {
  const m = buildGroupMessage({ ...base, time: 'a-confirmar', interests: [] });
  assert.ok(m.includes('Hora de llegada: a coordinar'));
  for (const f of ['NOS INTERESA', 'ALERGIAS', 'ACLARACIONES']) assert.ok(!m.includes(f));
});

test('el formato de WhatsApp del usuario no rompe el mensaje', () => assert.ok(buildGroupMessage({ ...base, name: '*Ana*_' }).includes('Nombre: Ana')));

test('id de consulta', () => assert.match(newConsultId(new Date(2026, 9, 23), () => 0.3), /^GR-2310-[A-Z2-9]{3}$/));

const ok = { name: 'Ana', phone: '249 444 0808', people: 8, date: '2026-10-25', time: '21:00', occasion: 'Cumpleaños', timeOptions: ['20:00', '21:00'], today: '2026-10-23', maxDate: '2027-02-20' };

test('consulta válida', () => assert.deepEqual(validateGroup(ok), {}));

test('valida campos vacíos', () => assert.deepEqual(Object.keys(validateGroup({ ...ok, name: '', phone: '1', people: null, occasion: '' })).sort(), ['name', 'occasion', 'people', 'phone']));

test('mínimo 2 y máximo 80 personas', () => {
  assert.ok(validateGroup({ ...ok, people: 1 }).people);
  assert.ok(validateGroup({ ...ok, people: 81 }).people.includes('80'));
  assert.equal(validateGroup({ ...ok, people: 80 }).people, undefined);
});

test('fecha: no pasada, no lejana y con horarios', () => {
  assert.ok(validateGroup({ ...ok, date: '2026-10-22' }).date);
  assert.ok(validateGroup({ ...ok, date: '2027-03-01' }).date);
  assert.ok(validateGroup({ ...ok, timeOptions: [] }).date.includes('cerrado'));
  assert.equal(validateGroup({ ...ok, date: '2026-10-23' }).date, undefined);
});

test('hora debe ser de la lista o "a-confirmar"', () => {
  assert.ok(validateGroup({ ...ok, time: '03:00' }).time);
  assert.equal(validateGroup({ ...ok, time: 'a-confirmar' }).time, undefined);
});
