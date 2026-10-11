export const config = {
  brandName: 'Foster Club',
  city: 'Tandil',
  instagramUrl: 'https://www.instagram.com/fosterburgerbar/',
  googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Foster%20Club%2C%20Constituci%C3%B3n%20501%2C%20Tandil',
  address: 'Constitución 501, B7627 Tandil, Buenos Aires',
  phoneNumber: '2494206857',
  openingHours: {
    monday: '19:00–23:30',
    tuesday: 'Cerrado',
    wednesday: '11:30–14:30 y 14:00–23:30',
    thursdayToSunday: '11:30–14:30 y 19:00–23:59',
  },
  whatsappNumber: null, // Formato E.164 sin +, tras validación oficial.
  pickupEnabled: false,
  deliveryEnabled: false,
  orderingLive: false,
  demoOrderingEnabled: true,
  currency: 'ARS',
};

export const assets = {
  logo: 'logo/Imagen de ChatGPT 11 oct 2026, 15_50_30-1.png',
  monogram: 'logo/712543979_18082131692192633_3214331047355667281_n.jpg',
  mascot: 'mascota/Imagen de ChatGPT 11 oct 2026, 15_50_31-2.png',
  hero: 'assets/home/hero-burger-natural.jpg',
  burger: 'imagenes/Imagen de ChatGPT 11 oct 2026, 15_50_38-6.png',
  fries: 'imagenes/Imagen de ChatGPT 11 oct 2026, 15_50_35-4.png',
  table: 'imagenes/Imagen de ChatGPT 11 oct 2026, 15_50_36-5.png',
  shake: 'imagenes/Imagen de ChatGPT 11 oct 2026, 15_50_39-7.png',
};

export const categories = [
  { id: 'burgers', name: 'Burgers', intro: 'Las que nos trajeron hasta acá.' },
  { id: 'bagels', name: 'Bagels', intro: 'Un buen plan, entre dos panes.' },
  { id: 'fried-chicken', name: 'Fried chicken', intro: 'Crocante para compartir.' },
  { id: 'sides', name: 'Sides & papas', intro: 'Porque una más siempre entra.' },
  { id: 'milkshakes', name: 'Milkshakes', intro: 'El final feliz del plan.' },
  { id: 'kids', name: 'Menú infantil', intro: 'Para los más chicos del club.' },
  { id: 'drinks', name: 'Bebidas', intro: 'Algo fresco para acompañar.' },
];

const entries = [
  ['burgers', 'underground', 'Underground', 'Doble cheddar, cebolla caramelizada, pepinillos y burger sauce.'],
  ['burgers', 'da-bacon', 'Da Bacon', 'Doble cheddar, bacon crispy, chutney de bacon y alioli de ajo confitado.'],
  ['burgers', 'crispy-queen', 'Crispy Queen', 'Cebolla crocante, doble provolone y BBQ casera.'],
  ['burgers', 'onion-ranch', 'Onion Ranch', 'Cheddar, salsa ranch y aros de cebolla.'],
  ['burgers', 'blue-cheese', 'Blue Cheese', 'Provolone, queso azul, cebolla caramelizada y rúcula.'],
  ['burgers', 'cheese-burger', 'Cheese Burger', 'Cheddar, cebolla brunoise, ketchup y mostaza.'],
  ['burgers', 'cheeky-chik', 'Cheeky Chik', 'Pollo frito, salsa burger, pepinillos, salsa cítrica y bacon.'],
  ['burgers', 'veggie-burger', 'Veggie Burger', 'Medallón de verduras de la casa. Ingredientes por confirmar.'],
  ['burgers', 'bandeja-420', 'Bandeja 420', 'Producto para compartir. Composición por confirmar.'],
  ['bagels', 'salmon', 'Salmón', 'Salmón curado, queso crema, pesto de rúcula, ciboulette y cebolla morada.'],
  ['bagels', 'trufa-melt', 'Trufa Melt', 'Doble carne smash, queso dambo, cebolla caramelizada y mayonesa trufada.'],
  ['bagels', 'funghi', 'Funghi', 'Hongos grillados, kale, queso dambo, cebolla caramelizada y mayo trufada.'],
  ['bagels', 'brunch-bagel', 'Brunch Bagel', 'Huevo a la plancha, bacon, cheddar y palta.'],
  ['fried-chicken', 'balde-x4', 'Balde x4', 'Detalle de piezas y acompañamientos por confirmar.'],
  ['fried-chicken', 'balde-x8', 'Balde x8', 'Detalle de piezas y acompañamientos por confirmar.'],
  ['sides', 'papas-clasicas', 'Papas clásicas', 'Papas fritas para acompañar o compartir.'],
  ['sides', 'papas-foster', 'Papas Foster', 'Papas con parmesano, trufa y dip de salsa Foster.'],
  ['sides', 'aros-de-cebolla', 'Aros de cebolla', 'Porción y acompañamientos por confirmar.'],
  ['milkshakes', 'oreo', 'Oreo', 'Milkshake. Ingredientes y tamaño por confirmar.'],
  ['milkshakes', 'chocolate-mani', 'Chocolate & mantequilla de maní', 'Milkshake. Ingredientes y tamaño por confirmar.'],
  ['milkshakes', 'cookie', 'Cookie', 'Milkshake. Ingredientes y tamaño por confirmar.'],
  ['kids', 'nuggets-x5', 'Nuggets x5', 'Acompañamientos por confirmar.'],
  ['kids', 'cheese-burger-jr', 'Cheese Burger Jr.', 'Ingredientes y acompañamientos por confirmar.'],
  ['kids', 'mac-and-cheese', 'Mac and Cheese', 'Ingredientes por confirmar.'],
  ['drinks', 'agua-sin-gas', 'Agua sin gas', 'Presentación por confirmar.'],
  ['drinks', 'agua-con-gas', 'Agua con gas', 'Presentación por confirmar.'],
  ['drinks', 'gaseosas', 'Gaseosas', 'Variedades por confirmar.'],
  ['drinks', 'agua-saborizada', 'Agua saborizada', 'Variedades por confirmar.'],
];

// Fotos genéricas de demo. Ninguna representa la receta exacta de Foster.
const illustrativePhotos = {
  underground: 'burger-02', 'da-bacon': 'burger-03', 'crispy-queen': 'burger-02',
  'onion-ranch': 'burger-03', 'blue-cheese': 'burger-01', 'cheese-burger': 'burger-03',
  'cheeky-chik': 'chicken', 'veggie-burger': 'veggie', 'bandeja-420': 'platter',
  'trufa-melt': 'bagel-01', salmon: 'bagel-02',
  funghi: 'bagel-01', 'brunch-bagel': 'bagel-02', 'balde-x4': 'chicken',
  'balde-x8': 'chicken', 'papas-clasicas': 'fries', 'papas-foster': 'fries',
  'aros-de-cebolla': 'onion-rings', oreo: 'milkshake',
  'chocolate-mani': 'milkshake', cookie: 'milkshake', 'nuggets-x5': 'chicken',
  'cheese-burger-jr': 'burger-03', 'mac-and-cheese': 'mac',
  'agua-sin-gas': 'water', 'agua-con-gas': 'sparkling-glass',
  gaseosas: 'soda', 'agua-saborizada': 'lemonade',
};
const fullPhotoOverrides = {
  underground: 'imagenes/Imagen de ChatGPT 11 oct 2026, 15_50_26-2.png',
};

// Importes inventados únicamente para recorrer el carrito de esta demo.
// Nunca se usan para enviar pedidos reales ni representan precios de Foster.
const demoPrices = {
  underground: 14500, 'da-bacon': 15900, 'crispy-queen': 14900,
  'onion-ranch': 13900, 'blue-cheese': 15900, 'cheese-burger': 11900,
  'cheeky-chik': 13900, 'veggie-burger': 12900, 'bandeja-420': 21900,
  salmon: 14900, 'trufa-melt': 15900, funghi: 13900,
  'brunch-bagel': 12900, 'balde-x4': 19900, 'balde-x8': 34900,
  'papas-clasicas': 5900, 'papas-foster': 8900, 'aros-de-cebolla': 6900,
  oreo: 8900, 'chocolate-mani': 8900, cookie: 8900,
  'nuggets-x5': 9900, 'cheese-burger-jr': 10900, 'mac-and-cheese': 9900,
  'agua-sin-gas': 2900, 'agua-con-gas': 2900,
  gaseosas: 3500, 'agua-saborizada': 3500,
};

// La captura de origen no confirma vigencia, fotos individuales ni escala de precios.
// Para habilitar un producto: verificarlo con Foster, cargar priceArs, marcar
// verified/available/orderingEnabled y configurar los adicionales aplicables.
export const products = entries.map(([category, id, name, description], index) => ({
  id, category, name, description, priceArs: null, demoPriceArs: demoPrices[id],
  imageUrl: fullPhotoOverrides[id] || (illustrativePhotos[id] ? `assets/stock/${illustrativePhotos[id]}.webp` : null),
  verified: false, available: false, orderingEnabled: false,
  featured: ['underground', 'trufa-melt', 'oreo'].includes(id),
  modifiers: [], order: index,
}));
