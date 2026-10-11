const money = value => `$${value.toLocaleString('es-AR')}`;
const validPrice = value => Number.isSafeInteger(value) && value >= 0;

export function makeLineId(productId, selectedOptions = [], note = '') {
  const options = selectedOptions
    .map(option => [String(option.optionId), Number(option.quantity)])
    .sort((a, b) => a[0].localeCompare(b[0]));
  return JSON.stringify([String(productId), options, String(note).trim()]);
}

export function addLine(cart, input) {
  const quantity = Number(input.quantity);
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) return cart;
  const selectedOptions = (input.selectedOptions || []).map(option => ({ optionId: String(option.optionId), quantity: Number(option.quantity) }));
  if (selectedOptions.some(option => !Number.isSafeInteger(option.quantity) || option.quantity < 1 || option.quantity > 20)) return cart;
  const note = String(input.note || '').trim().slice(0, 180);
  const lineId = makeLineId(input.productId, selectedOptions, note);
  const found = cart.find(line => line.lineId === lineId);
  if (found) return cart.map(line => line.lineId === lineId ? { ...line, quantity: Math.min(99, line.quantity + quantity) } : line);
  return [...cart, { lineId, productId: String(input.productId), quantity, selectedOptions, note }];
}

export function changeQuantity(cart, lineId, quantity) {
  if (!Number.isSafeInteger(quantity) || quantity < 0 || quantity > 99) return cart;
  if (quantity === 0) return cart.filter(line => line.lineId !== lineId);
  return cart.map(line => line.lineId === lineId ? { ...line, quantity } : line);
}

function findOption(product, optionId) {
  return (product.modifiers || []).flatMap(group => group.options || []).find(option => option.id === optionId);
}

function validLine(line, products) {
  if (!line || typeof line.productId !== 'string' || !Number.isSafeInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) return false;
  const product = products.find(item => item.id === line.productId);
  if (!product || !product.verified || !product.available || !product.orderingEnabled || !validPrice(product.priceArs)) return false;
  if (!Array.isArray(line.selectedOptions) || typeof line.note !== 'string' || line.note.length > 180) return false;
  if (line.lineId !== makeLineId(line.productId, line.selectedOptions, line.note)) return false;
  const seen = new Set();
  return line.selectedOptions.every(selected => {
    if (!selected || typeof selected.optionId !== 'string' || seen.has(selected.optionId)) return false;
    seen.add(selected.optionId);
    const option = findOption(product, selected.optionId);
    return option && option.available && option.verified && validPrice(option.priceArs) && Number.isSafeInteger(selected.quantity) && selected.quantity >= 1 && selected.quantity <= 20;
  });
}

export function revalidateCart(cart, products) {
  if (!Array.isArray(cart)) return [];
  return cart.filter(line => validLine(line, products)).slice(0, 100).reduce((lines, line) => addLine(lines, line), []);
}

export function getTotals(cart, products) {
  const valid = revalidateCart(cart, products);
  let productsTotal = 0;
  let extrasTotal = 0;
  for (const line of valid) {
    const product = products.find(item => item.id === line.productId);
    productsTotal += product.priceArs * line.quantity;
    for (const selected of line.selectedOptions) {
      const option = findOption(product, selected.optionId);
      extrasTotal += option.priceArs * selected.quantity * line.quantity;
    }
  }
  return { productsTotal, extrasTotal, total: productsTotal + extrasTotal, count: valid.reduce((sum, line) => sum + line.quantity, 0), valid: valid.length === cart.length };
}

export function buildWhatsAppMessage(cart, products, details) {
  const valid = revalidateCart(cart, products);
  if (!valid.length || valid.length !== cart.length) return null;
  const totals = getTotals(valid, products);
  const lines = ['Hola, Foster Club! Quiero hacer un pedido:', '', '*Pedido Foster Club*'];
  for (const line of valid) {
    const product = products.find(item => item.id === line.productId);
    lines.push(`${line.quantity} x ${product.name}`);
    for (const selected of line.selectedOptions) lines.push(`  + ${findOption(product, selected.optionId).label} x${selected.quantity}`);
    if (line.note) lines.push(`  Indicaciones: ${line.note}`);
  }
  lines.push('', `Subtotal productos: ${money(totals.productsTotal)}`, `Adicionales: ${money(totals.extrasTotal)}`, `TOTAL ESTIMADO: ${money(totals.total)}`, '');
  if (details.name?.trim()) lines.push(`Nombre: ${details.name.trim().slice(0, 80)}`);
  if (details.mode?.trim()) lines.push(`Modalidad: ${details.mode.trim().slice(0, 50)}`);
  if (details.address?.trim()) lines.push(`Dirección: ${details.address.trim().slice(0, 150)}`);
  if (details.notes?.trim()) lines.push(`Notas: ${details.notes.trim().slice(0, 200)}`);
  lines.push('', 'El pedido queda sujeto a confirmación del local. ¡Gracias!');
  return lines.join('\n');
}

export function whatsappUrl(number, message) {
  if (!number || !/^[1-9]\d{7,14}$/.test(number) || !message) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
