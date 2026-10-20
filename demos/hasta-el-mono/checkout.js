(function (root) {
  function validateOrder({ customerName = '', fulfillment, address = '', items = [] }) {
    const errors = {};
    if (!customerName.trim()) errors.customerName = 'Ingresá tu nombre.';
    if (!items.some(item => item.quantity > 0)) errors.items = 'Agregá al menos un producto.';
    if (fulfillment === 'delivery' && !address.trim()) errors.address = 'Ingresá la dirección de entrega.';
    return errors;
  }

  function buildOrderMessage({ customerName, fulfillment, address = '', notes = '', items }) {
    const selectedItems = items.filter(item => item.quantity > 0);
    const lines = [
      'Hola, quiero hacer un pedido en Hasta el Moño.',
      '',
      `Nombre: ${customerName.trim()}`,
      'Productos:',
      ...selectedItems.map(item => `${item.quantity} × ${item.name}`),
      '',
      `Modalidad: ${fulfillment === 'delivery' ? 'Delivery' : 'Retiro por el local'}`
    ];
    if (fulfillment === 'delivery') lines.push(`Dirección: ${address.trim()}`);
    if (notes.trim()) lines.push(`Observaciones: ${notes.trim()}`);
    lines.push('', '¿Pueden confirmar disponibilidad y precio final?');
    return lines.join('\n');
  }

  function buildWhatsAppUrl(phone, message) {
    const number = String(phone || '').replace(/[\s()+-]/g, '');
    if (!/^\d{10,15}$/.test(number)) throw new Error('Número de WhatsApp inválido.');
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  const checkout = { buildOrderMessage, buildWhatsAppUrl, validateOrder };
  if (typeof module !== 'undefined' && module.exports) module.exports = checkout;
  else root.HastaCheckout = checkout;
})(typeof window !== 'undefined' ? window : globalThis);
