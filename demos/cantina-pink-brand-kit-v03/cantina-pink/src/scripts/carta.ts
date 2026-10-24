// Botones "Agregar" de la carta. Delegación de eventos: un solo listener para todos los platos.
import { load, save, qtyOf, setQty, addOne, MAX_QTY } from '../lib/cart';
import { isSoldOut } from '../lib/overrides';

let toastTimer = 0;
let bound = false;

function toast(text: string) {
  const el = document.querySelector<HTMLElement>('[data-toast]');
  if (!el) return;
  el.textContent = text;
  el.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => el.classList.remove('is-on'), 2200);
}

const addButton = (name: string) =>
  `<button type="button" class="btn btn--wine add-btn" data-act="add" aria-label="Agregar ${name} al pedido">Agregar</button>`;

const stepper = (name: string, qty: number) => `
  <div class="stepper" role="group" aria-label="Cantidad de ${name}">
    <button type="button" data-act="dec" aria-label="Sacar uno de ${name}">−</button>
    <output aria-live="polite">${qty}</output>
    <button type="button" data-act="inc" aria-label="Agregar uno más de ${name}"${qty >= MAX_QTY ? ' disabled' : ''}>+</button>
  </div>`;

function render() {
  const state = load();
  document.querySelectorAll<HTMLElement>('[data-add]').forEach((box) => {
    const id = box.dataset.add!;
    const name = box.dataset.name ?? 'el producto';
    const qty = qtyOf(state, id);
    const wasFocused = box.contains(document.activeElement);
    const act = (document.activeElement as HTMLElement | null)?.dataset.act;
    box.innerHTML = isSoldOut(id) ? '<span class="soldout-btn">Agotado</span>' : qty > 0 ? stepper(name, qty) : addButton(name);
    box.classList.toggle('in-cart', qty > 0);
    if (wasFocused) box.querySelector<HTMLElement>(`[data-act="${act === 'add' ? 'inc' : act}"]`)?.focus() ?? box.querySelector<HTMLElement>('button')?.focus();
  });
}

function onClick(e: Event) {
  const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-act]');
  const box = btn?.closest<HTMLElement>('[data-add]');
  if (!btn || !box) return;
  const id = box.dataset.add!;
  const name = box.dataset.name ?? 'Producto';
  let state = load();
  const before = qtyOf(state, id);
  if (btn.dataset.act === 'add' || btn.dataset.act === 'inc') state = addOne(state, id);
  else if (btn.dataset.act === 'dec') state = setQty(state, id, before - 1);
  save(state);
  const after = qtyOf(state, id);
  render();
  if (after > before) toast(`${name} sumado: ${after} en tu pedido`);
  else if (after === 0) toast(`${name} salió del pedido`);
}

function init() {
  render();
  if (!bound) {
    bound = true;
    document.addEventListener('click', onClick);
    window.addEventListener('cp:cart', (e) => { if ((e as CustomEvent).detail?.source !== 'page') render(); });
    window.addEventListener('storage', render);
    window.addEventListener('cp:overrides', render);
  }
}
document.addEventListener('astro:page-load', init);
