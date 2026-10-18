// Carta FICTICIA para mostrar el flujo completo. Nombres, preparaciones y precios son de ejemplo.
// Al pasar a una carta real: reemplazar products, cambiar revision, poner demo:false y confirmar whatsappNumber.
// Los importes se guardan como centavos enteros: $ 12.500 = 1250000.
window.SUSHI_FAN_MENU = {
  revision: 'demo-2026-10-10',
  demo: true,
  whatsappNumber: null,
  products: [
    {
      id: 'tabla-fan', category: 'Tablas', name: 'Tabla Fan', pieces: '24 piezas',
      description: 'Selección de rolls y nigiris para compartir.',
      photo: 'img/demo-rolls-mixtos.jpg',
      variants: [
        { id: '12', name: '12 piezas', priceCents: 1890000 },
        { id: '24', name: '24 piezas', priceCents: 3490000 }
      ]
    },
    {
      id: 'tabla-salmon', category: 'Tablas', name: 'Tabla Salmón', pieces: '12 piezas',
      description: 'Combinación de rolls y nigiris de salmón.',
      photo: 'img/demo-tabla.jpg',
      variants: [
        { id: '6', name: '6 piezas', priceCents: 1290000 },
        { id: '12', name: '12 piezas', priceCents: 2250000 }
      ]
    },
    {
      id: 'maki-salmon', category: 'Rolls', name: 'Maki Salmón', pieces: '8 piezas',
      description: 'Arroz, salmón y alga nori.',
      photo: 'img/demo-maki-salmon.jpg',
      variants: [
        { id: '8', name: '8 piezas', priceCents: 1190000 },
        { id: '16', name: '16 piezas', priceCents: 2150000 }
      ]
    },
    {
      id: 'maki-veggie', category: 'Rolls', name: 'Maki Veggie', pieces: '8 piezas',
      description: 'Arroz, pepino y alga nori.',
      photo: 'img/demo-maki-clasico.jpg',
      variants: [
        { id: '8', name: '8 piezas', priceCents: 980000 },
        { id: '16', name: '16 piezas', priceCents: 1790000 }
      ]
    },
    {
      id: 'roll-fusion', category: 'Rolls', name: 'Roll Fusión', pieces: '8 piezas',
      description: 'Roll de autor con cobertura crocante.',
      photo: 'img/demo-rolls-fusion.jpg',
      variants: [
        { id: '8', name: '8 piezas', priceCents: 1240000 },
        { id: '16', name: '16 piezas', priceCents: 2290000 }
      ]
    },
    {
      id: 'nigiri-salmon', category: 'Nigiri & sashimi', name: 'Nigiri Salmón', pieces: '4 piezas',
      description: 'Arroz de sushi coronado con salmón.',
      photo: 'img/demo-nigiri.jpg',
      variants: [
        { id: '4', name: '4 piezas', priceCents: 890000 },
        { id: '8', name: '8 piezas', priceCents: 1690000 }
      ]
    },
    {
      id: 'sashimi-salmon', category: 'Nigiri & sashimi', name: 'Sashimi Salmón', pieces: '6 piezas',
      description: 'Cortes de salmón fresco.',
      photo: 'img/demo-sashimi.jpg',
      variants: [
        { id: '6', name: '6 piezas', priceCents: 1090000 },
        { id: '12', name: '12 piezas', priceCents: 2090000 }
      ]
    },
    {
      id: 'gyozas', category: 'Entradas', name: 'Gyozas Doradas', pieces: '6 o 12 unidades',
      description: 'Empanaditas japonesas doradas.',
      photo: 'img/demo-gyoza.jpg',
      variants: [
        { id: '6', name: '6 unidades', priceCents: 820000 },
        { id: '12', name: '12 unidades', priceCents: 1490000 }
      ]
    },
    {
      id: 'empanaditas', category: 'Entradas', name: 'Empanaditas Orientales', pieces: '6 unidades',
      description: 'Bocados dorados para empezar la mesa.',
      photo: 'img/demo-dumplings.jpg',
      variants: [
        { id: '6', name: '6 unidades', priceCents: 790000 },
        { id: '12', name: '12 unidades', priceCents: 1450000 }
      ]
    }
  ]
};

window.SUSHI_FAN_MENU.products.forEach(product => {
  if (product.variants?.length && !Number.isSafeInteger(product.priceCents)) {
    const defaultVariant = product.variants[product.variants.length - 1];
    if (Number.isSafeInteger(defaultVariant.priceCents)) product.priceCents = defaultVariant.priceCents;
  }
});

try {
  const savedCatalog = JSON.parse(localStorage.getItem('sushi_fan_admin_catalog_v1') || 'null');
  if (Array.isArray(savedCatalog)) {
    const overrides = new Map(savedCatalog.map(item => [item.id, item]));
    window.SUSHI_FAN_MENU.products = window.SUSHI_FAN_MENU.products
      .map(product => ({ ...product, ...(overrides.get(product.id) || {}) }));
  }
} catch {
  // The public demo keeps its default catalog if local storage is unavailable.
}
