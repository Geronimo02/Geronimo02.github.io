export const config = {
  brandName: 'Foster Club',
  city: 'Tandil',
  instagramUrl: 'https://www.instagram.com/fosterclubb/',
  googleMapsUrl: 'https://www.google.com/maps/place/foster+club/@-37.3330057,-59.1344799,53m/data=!3m1!1e3!4m6!3m5!1s0x95911f9eaa1cea91:0xdd658182fc477ac6!8m2!3d-37.3330508!4d-59.1341719!16s%2Fg%2F11zd4yztqg',
  address: null, // Pendiente de confirmación con Foster.
  openingHours: null,
  whatsappNumber: null, // Formato E.164 sin +, tras validación oficial.
  pickupEnabled: false,
  deliveryEnabled: false,
  orderingLive: false,
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

// La captura de origen no confirma vigencia, fotos individuales ni escala de precios.
// Para habilitar un producto: verificarlo con Foster, cargar priceArs, marcar
// verified/available/orderingEnabled y configurar los adicionales aplicables.
export const products = entries.map(([category, id, name, description], index) => ({
  id, category, name, description, priceArs: null,
  imageUrl: illustrativePhotos[id] ? `assets/stock/${illustrativePhotos[id]}.webp` : null,
  verified: false, available: false, orderingEnabled: false,
  featured: ['underground', 'trufa-melt', 'oreo'].includes(id),
  modifiers: [], order: index,
}));
