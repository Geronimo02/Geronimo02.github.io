import { categories as defaultCategories, products as baseProducts } from './data.mjs';

export const STORAGE_KEY_PRODUCTS = 'foster_demo_products_v1';
export const STORAGE_KEY_ORDERS = 'foster_demo_orders_v1';
export const STORAGE_KEY_CATEGORIES = 'foster_demo_categories_v1';

// Precios y disponibilidad inicial de la demo según la propuesta
const initialDemoOverrides = {
  'cheese-burger': { demoPriceArs: 12500, available: true, featured: true },
  'da-bacon': { demoPriceArs: 14900, available: true, featured: true },
  'papas-foster': { demoPriceArs: 8900, available: false, featured: false }, // Agotado por defecto
  'blue-cheese': { demoPriceArs: 15900, available: false, featured: false }, // Agotado por defecto
  'balde-x8': { demoPriceArs: 34900, available: false, featured: false },    // Agotado por defecto
};

export function getDefaultProducts() {
  return baseProducts.map(p => {
    const override = initialDemoOverrides[p.id] || {};
    return {
      ...p,
      demoPriceArs: override.demoPriceArs !== undefined ? override.demoPriceArs : (p.demoPriceArs || 9900),
      available: override.available !== undefined ? override.available : true,
      featured: override.featured !== undefined ? override.featured : p.featured,
      hidden: false,
    };
  });
}

export function getDefaultOrders() {
  return [
    {
      id: 'PED-1018',
      customer: 'Lucas Martínez',
      phone: '249 455-8912',
      address: 'Av. España 482, Piso 2A',
      paymentMethod: 'Mercado Pago (QR)',
      notes: 'Sin cebolla en una burger, dip de salsa aparte.',
      timestamp: 'Hace 4 min',
      timeISO: new Date(Date.now() - 4 * 60000).toISOString(),
      items: '2 × Cheese Burger, 1 × Papas Foster',
      itemsList: [
        { name: 'Cheese Burger', qty: 2, price: 12500, subtotal: 25000, note: 'Una sin cebolla' },
        { name: 'Papas Foster', qty: 1, price: 8900, subtotal: 8900, note: 'Dip aparte' },
      ],
      itemsCount: 3,
      total: 33900,
      mode: 'Delivery',
      status: 'Pendiente',
    },
    {
      id: 'PED-1017',
      customer: 'Camila Rodriguez',
      phone: '249 462-1104',
      address: 'Retiro por barra Constitución 501',
      paymentMethod: 'Efectivo en mostrador',
      notes: 'Pasa a retirar en 15 minutos.',
      timestamp: 'Hace 14 min',
      timeISO: new Date(Date.now() - 14 * 60000).toISOString(),
      items: '1 × Da Bacon, 1 × Papas clásicas, 1 × Oreo Milkshake',
      itemsList: [
        { name: 'Da Bacon', qty: 1, price: 14900, subtotal: 14900, note: 'Punto medio' },
        { name: 'Papas clásicas', qty: 1, price: 5900, subtotal: 5900, note: '' },
        { name: 'Oreo Milkshake', qty: 1, price: 8900, subtotal: 8900, note: '' },
      ],
      itemsCount: 3,
      total: 29700,
      mode: 'Retiro en local',
      status: 'Confirmado',
    },
    {
      id: 'PED-1016',
      customer: 'Gonzalo Torres',
      phone: '249 433-7281',
      address: 'Pinto 640',
      paymentMethod: 'Mercado Pago (Transferencia)',
      notes: 'Tocar timbre 1. Extra servilletas.',
      timestamp: 'Hace 28 min',
      timeISO: new Date(Date.now() - 28 * 60000).toISOString(),
      items: '2 × Underground, 1 × Aros de cebolla',
      itemsList: [
        { name: 'Underground', qty: 2, price: 14500, subtotal: 29000, note: '' },
        { name: 'Aros de cebolla', qty: 1, price: 6900, subtotal: 6900, note: 'Bien crocantes' },
      ],
      itemsCount: 3,
      total: 35900,
      mode: 'Delivery',
      status: 'Confirmado',
    },
    {
      id: 'PED-1015',
      customer: 'Sofía Benítez',
      phone: '249 470-3329',
      address: 'Retiro por barra Constitución 501',
      paymentMethod: 'Tarjeta de débito',
      notes: 'Esperan en mesa exterior.',
      timestamp: 'Hace 42 min',
      timeISO: new Date(Date.now() - 42 * 60000).toISOString(),
      items: '1 × Trufa Melt Bagel, 1 × Gaseosa',
      itemsList: [
        { name: 'Trufa Melt Bagel', qty: 1, price: 15900, subtotal: 15900, note: '' },
        { name: 'Gaseosas', qty: 1, price: 3500, subtotal: 3500, note: 'Coca-Cola común' },
      ],
      itemsCount: 2,
      total: 19400,
      mode: 'Retiro en local',
      status: 'Confirmado',
    },
    {
      id: 'PED-1014',
      customer: 'Mateo Álvarez',
      phone: '249 412-9098',
      address: 'General Rodríguez 214',
      paymentMethod: 'Mercado Pago',
      notes: 'Dejar en conserjería.',
      timestamp: 'Hace 1 hora',
      timeISO: new Date(Date.now() - 65 * 60000).toISOString(),
      items: '1 × Balde x4, 2 × Gaseosas',
      itemsList: [
        { name: 'Balde x4', qty: 1, price: 19900, subtotal: 19900, note: 'Salsa barbacoa' },
        { name: 'Gaseosas', qty: 2, price: 3500, subtotal: 7000, note: '1 Coca Zero, 1 Sprite' },
      ],
      itemsCount: 3,
      total: 26900,
      mode: 'Delivery',
      status: 'Confirmado',
    },
    {
      id: 'PED-1013',
      customer: 'Valentina Díaz',
      phone: '249 488-1200',
      address: 'Retiro por mostrador',
      paymentMethod: 'Efectivo',
      notes: 'Paga justo.',
      timestamp: 'Hace 1 hora',
      timeISO: new Date(Date.now() - 80 * 60000).toISOString(),
      items: '1 × Crispy Queen, 1 × Papas Foster',
      itemsList: [
        { name: 'Crispy Queen', qty: 1, price: 14900, subtotal: 14900, note: '' },
        { name: 'Papas Foster', qty: 1, price: 8900, subtotal: 8900, note: '' },
      ],
      itemsCount: 2,
      total: 23800,
      mode: 'Retiro en local',
      status: 'Confirmado',
    },
    {
      id: 'PED-1012',
      customer: 'Joaquín Pereyra',
      phone: '249 467-5544',
      address: 'Belgrano 1102',
      paymentMethod: 'Mercado Pago (Transferencia)',
      notes: 'Casa con rejas blancas.',
      timestamp: 'Hace 2 horas',
      timeISO: new Date(Date.now() - 110 * 60000).toISOString(),
      items: '2 × Da Bacon, 2 × Milkshake Cookie',
      itemsList: [
        { name: 'Da Bacon', qty: 2, price: 14900, subtotal: 29800, note: 'Ambas bien cocidas' },
        { name: 'Cookie Milkshake', qty: 2, price: 8900, subtotal: 17800, note: '' },
      ],
      itemsCount: 4,
      total: 47600,
      mode: 'Delivery',
      status: 'Confirmado',
    },
    {
      id: 'PED-1011',
      customer: 'Martina Rossi',
      phone: '249 490-2311',
      address: 'Retiro en local',
      paymentMethod: 'Mercado Pago',
      notes: 'Sin aderezos.',
      timestamp: 'Hace 2 horas',
      timeISO: new Date(Date.now() - 130 * 60000).toISOString(),
      items: '1 × Veggie Burger, 1 × Agua sin gas',
      itemsList: [
        { name: 'Veggie Burger', qty: 1, price: 12900, subtotal: 12900, note: '' },
        { name: 'Agua sin gas', qty: 1, price: 2900, subtotal: 2900, note: '' },
      ],
      itemsCount: 2,
      total: 15800,
      mode: 'Retiro en local',
      status: 'Confirmado',
    },
    {
      id: 'PED-1010',
      customer: 'Ignacio Gómez',
      phone: '249 444-1877',
      address: 'San Martín 320',
      paymentMethod: 'Efectivo',
      notes: '',
      timestamp: 'Hace 3 horas',
      timeISO: new Date(Date.now() - 170 * 60000).toISOString(),
      items: '1 × Bandeja 420, 2 × Gaseosas',
      itemsList: [
        { name: 'Bandeja 420', qty: 1, price: 21900, subtotal: 21900, note: 'Para compartir' },
        { name: 'Gaseosas', qty: 2, price: 3500, subtotal: 7000, note: '' },
      ],
      itemsCount: 3,
      total: 28900,
      mode: 'Delivery',
      status: 'Confirmado',
    },
    {
      id: 'PED-1009',
      customer: 'Florencia Castro',
      phone: '249 423-9988',
      address: 'Retiro en local',
      paymentMethod: 'Transferencia',
      notes: '',
      timestamp: 'Hace 3 horas',
      timeISO: new Date(Date.now() - 195 * 60000).toISOString(),
      items: '1 × Salmón Bagel, 1 × Agua saborizada',
      itemsList: [
        { name: 'Salmón Bagel', qty: 1, price: 14900, subtotal: 14900, note: '' },
        { name: 'Agua saborizada', qty: 1, price: 3500, subtotal: 3500, note: 'Pomelo' },
      ],
      itemsCount: 2,
      total: 18400,
      mode: 'Retiro en local',
      status: 'Confirmado',
    },
    {
      id: 'PED-1008',
      customer: 'Nicolás Herrera',
      timestamp: 'Hace 4 horas',
      timeISO: new Date(Date.now() - 230 * 60000).toISOString(),
      items: '2 × Cheese Burger, 1 × Papas clásicas',
      itemsCount: 3,
      total: 30900,
      mode: 'Delivery',
      status: 'Confirmado',
    },
    {
      id: 'PED-1007',
      customer: 'Julieta Morales',
      timestamp: 'Hace 4 horas',
      timeISO: new Date(Date.now() - 250 * 60000).toISOString(),
      items: '1 × Onion Ranch, 1 × Chocolate & Maní Shake',
      itemsCount: 2,
      total: 22800,
      mode: 'Retiro en local',
      status: 'Confirmado',
    },
    {
      id: 'PED-1006',
      customer: 'Bautista Romero',
      timestamp: 'Hace 5 horas',
      timeISO: new Date(Date.now() - 290 * 60000).toISOString(),
      items: '1 × Cheeky Chik, 1 × Papas Foster',
      itemsCount: 2,
      total: 22800,
      mode: 'Delivery',
      status: 'Confirmado',
    },
    {
      id: 'PED-1005',
      customer: 'Agustina Silva',
      timestamp: 'Hace 5 horas',
      timeISO: new Date(Date.now() - 320 * 60000).toISOString(),
      items: '1 × Cheese Burger Jr, 1 × Nuggets x5',
      itemsCount: 2,
      total: 20800,
      mode: 'Retiro en local',
      status: 'Confirmado',
    },
    {
      id: 'PED-1004',
      customer: 'Facundo Ramos',
      timestamp: 'Hace 6 horas',
      timeISO: new Date(Date.now() - 370 * 60000).toISOString(),
      items: '1 × Brunch Bagel, 1 × Café/Bebida',
      itemsCount: 2,
      total: 16400,
      mode: 'Retiro en local',
      status: 'Confirmado',
    },
    {
      id: 'PED-1003',
      customer: 'Milagros Vega',
      timestamp: 'Hace 7 horas',
      timeISO: new Date(Date.now() - 410 * 60000).toISOString(),
      items: '2 × Underground, 2 × Gaseosas',
      itemsCount: 4,
      total: 36000,
      mode: 'Delivery',
      status: 'Confirmado',
    },
    {
      id: 'PED-1002',
      customer: 'Rodrigo Ponce',
      timestamp: 'Hace 8 horas',
      timeISO: new Date(Date.now() - 470 * 60000).toISOString(),
      items: '1 × Funghi Bagel, 1 × Agua sin gas',
      itemsCount: 2,
      total: 16800,
      mode: 'Retiro en local',
      status: 'Confirmado',
    },
    {
      id: 'PED-1001',
      customer: 'Lucía Fernández',
      timestamp: 'Hace 8 horas',
      timeISO: new Date(Date.now() - 500 * 60000).toISOString(),
      items: '1 × Da Bacon, 1 × Papas clásicas',
      itemsCount: 2,
      total: 20800,
      mode: 'Delivery',
      status: 'Confirmado',
    },
  ];
}

export function getLiveCatalog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Error reading live catalog:', err);
  }
  const defaults = getDefaultProducts();
  saveLiveCatalog(defaults);
  return defaults;
}

export function saveLiveCatalog(products) {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new CustomEvent('foster-catalog-updated', { detail: products }));
  } catch (err) {
    console.error('Error saving live catalog:', err);
  }
}

export function updateProduct(id, changes) {
  const current = getLiveCatalog();
  const index = current.findIndex(p => p.id === id);
  if (index === -1) return null;
  current[index] = { ...current[index], ...changes };
  saveLiveCatalog(current);
  return current[index];
}

export function getLiveOrders() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Error reading demo orders:', err);
  }
  const defaults = getDefaultOrders();
  saveLiveOrders(defaults);
  return defaults;
}

export function saveLiveOrders(orders) {
  try {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent('foster-orders-updated', { detail: orders }));
  } catch (err) {
    console.error('Error saving demo orders:', err);
  }
}

export function addLiveOrder(newOrder) {
  const orders = getLiveOrders();
  const created = {
    id: `PED-${1000 + orders.length + 1}`,
    timestamp: 'Recién',
    timeISO: new Date().toISOString(),
    status: 'Pendiente',
    phone: '249 420-6857',
    address: 'Constitución 501, Tandil',
    paymentMethod: 'Mercado Pago (Transferencia)',
    notes: 'Pedido realizado desde la Carta web.',
    itemsList: newOrder.itemsList || [
      { name: newOrder.items || 'Selección del cliente', qty: newOrder.itemsCount || 1, price: newOrder.total, subtotal: newOrder.total }
    ],
    ...newOrder,
  };
  orders.unshift(created);
  saveLiveOrders(orders);
  return created;
}

export function updateOrderStatus(orderId, newStatus) {
  const orders = getLiveOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    saveLiveOrders(orders);
  }
  return orders;
}

export function getLiveCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('Error reading categories:', err);
  }
  return defaultCategories;
}

export function saveLiveCategories(categories) {
  try {
    localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    window.dispatchEvent(new CustomEvent('foster-categories-updated', { detail: categories }));
  } catch (err) {
    console.error('Error saving live categories:', err);
  }
}

export function resetDemoAll() {
  try {
    localStorage.removeItem(STORAGE_KEY_PRODUCTS);
    localStorage.removeItem(STORAGE_KEY_ORDERS);
    localStorage.removeItem(STORAGE_KEY_CATEGORIES);
  } catch (err) {
    console.error('Error resetting demo:', err);
  }
  const defaults = getDefaultProducts();
  const orders = getDefaultOrders();
  saveLiveCatalog(defaults);
  saveLiveOrders(orders);
  saveLiveCategories(defaultCategories);
  window.dispatchEvent(new CustomEvent('foster-demo-reset'));
  return { products: defaults, orders, categories: defaultCategories };
}
