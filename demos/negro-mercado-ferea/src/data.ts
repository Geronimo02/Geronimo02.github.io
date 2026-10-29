export type Variant = { label: string; price: number };
export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description?: string;
  variants: Variant[];
  image?: string;
  published: boolean;
  source: 'carta-aportada' | 'instagram';
};

export const business = {
  name: 'Negro Mercado',
  address: 'Avellaneda 702, esquina 9 de Julio, Tandil, Buenos Aires',
  hoursWeek: 'Lunes a viernes · 07:30–20:30',
  hoursWeekend: 'Sábados y domingos · 09:00–20:30',
  instagram: 'https://www.instagram.com/negromercado.ok/',
  whatsapp: '5491126587740',
  map: 'https://www.google.com/maps/search/?api=1&query=Avellaneda+702%2C+Tandil%2C+Buenos+Aires',
};

// Transcribed from the menu image supplied in chat on 23 Oct 2026. S/D/T are
// preserved literally because the image does not define the variant names.
export const menu: MenuItem[] = [
  { id: 'espresso', name: 'Espresso', category: 'Cafetería', variants: [{label:'S',price:4200},{label:'D',price:4900}], image:'/images/coffee-croissant.jpg', published:true, source:'carta-aportada' },
  { id: 'espresso-largo', name: 'Espresso largo', category: 'Cafetería', variants: [{label:'S',price:4200}], published:true, source:'carta-aportada' },
  { id: 'macchiato', name: 'Macchiato', category: 'Cafetería', variants: [{label:'S',price:4300},{label:'D',price:5000}], published:true, source:'carta-aportada' },
  { id: 'cortado-chico', name: 'Cortado chico', category: 'Cafetería', variants: [{label:'S',price:4500}], published:true, source:'carta-aportada' },
  { id: 'cortado-vaso', name: 'Cortado en vaso', category: 'Cafetería', variants: [{label:'S',price:4800}], published:true, source:'carta-aportada' },
  { id: 'magic', name: 'Magic', category: 'Cafetería', variants: [{label:'D',price:5500}], published:true, source:'carta-aportada' },
  { id: 'americano', name: 'Americano', category: 'Cafetería', variants: [{label:'D',price:5200}], published:true, source:'carta-aportada' },
  { id: 'cappuccino', name: 'Cappuccino', category: 'Cafetería', variants: [{label:'S',price:5200},{label:'D',price:6500}], published:true, source:'carta-aportada' },
  { id: 'cappuccino-italiano', name: 'Cappuccino italiano', category: 'Cafetería', description:'Chocolate amargo y canela.', variants: [{label:'S',price:6000},{label:'D',price:7000}], published:true, source:'carta-aportada' },
  { id: 'latte', name: 'Latte', category: 'Cafetería', variants: [{label:'S',price:5200},{label:'D',price:6000}], published:true, source:'carta-aportada' },
  { id: 'flat-white', name: 'Flat white', category: 'Cafetería', variants: [{label:'D',price:5800},{label:'T',price:6800}], published:true, source:'carta-aportada' },
  { id: 'mocaccino', name: 'Mocaccino', category: 'Cafetería', variants: [{label:'S',price:6000},{label:'D',price:7000}], published:true, source:'carta-aportada' },
  { id: 'aerocano', name: 'Aerocano', category: 'Fríos', variants: [{label:'Único',price:6000}], published:true, source:'carta-aportada' },
  { id: 'coffee-tonic', name: 'Coffee Tonic', category: 'Fríos', variants: [{label:'Único',price:7500}], published:true, source:'carta-aportada' },
  { id: 'iced-latte', name: 'Iced Latte', category: 'Fríos', variants: [{label:'Único',price:5500}], published:true, source:'carta-aportada' },
  { id: 'vainilla-latte', name: 'Vainilla Latte', category: 'Fríos', variants: [{label:'Único',price:6000}], published:true, source:'carta-aportada' },
  { id: 'iced-flat', name: 'Iced Flat', category: 'Fríos', variants: [{label:'Único',price:6500}], published:true, source:'carta-aportada' },
  { id: 'mocca-frio', name: 'Mocca', category: 'Fríos', variants: [{label:'Único',price:7000}], published:true, source:'carta-aportada' },
  { id: 'red-matcha', name: 'Red Matcha Latte', category: 'Fríos', variants: [{label:'Único',price:8000}], published:true, source:'carta-aportada' },
  { id: 'pomelada', name: 'Pomelada con frutos rojos', category: 'Bebidas frías', description:'500 ml', variants: [{label:'Único',price:5500}], published:true, source:'carta-aportada' },
  { id: 'limonada', name: 'Limonada con menta y jengibre', category: 'Bebidas frías', description:'500 ml', variants: [{label:'Único',price:5500}], published:true, source:'carta-aportada' },
  { id: 'exprimido', name: 'Exprimido de naranja', category: 'Bebidas frías', variants: [{label:'350 ml',price:5500},{label:'500 ml',price:6000}], published:true, source:'carta-aportada' },
  { id: 'licuado-fruta', name: 'Licuado de banana, frutilla o naranja y durazno', category: 'Bebidas frías', variants: [{label:'Único',price:6500}], published:true, source:'carta-aportada' },
  { id: 'licuado-detox', name: 'Licuado detox', category: 'Bebidas frías', description:'Espinaca, ananá, manzana verde, pepino, limón y jengibre.', variants: [{label:'Único',price:7000}], published:true, source:'carta-aportada' },
  { id: 'agua', name: 'Agua con o sin gas', category: 'Bebidas frías', description:'500 ml', variants: [{label:'Único',price:3500}], published:true, source:'carta-aportada' },
  { id: 'leche-almendras', name: 'Leche de almendras y dátiles', category: 'Adicionales', variants: [{label:'Adicional',price:1500}], published:false, source:'carta-aportada' },
  { id: 'leche-avena', name: 'Leche de avena', category: 'Adicionales', variants: [{label:'Adicional',price:2000}], published:false, source:'carta-aportada' },
  { id: 'v60', name: 'Filtrado V60', category: 'Filtrados y té', description:'Dos tazas', variants: [{label:'Único',price:9000}], published:true, source:'carta-aportada' },
  { id: 'te-hebras', name: 'Té en hebras', category: 'Filtrados y té', description:'Black Tea, Black tea con naranjas y flores de azahar, Chai, Hibiscus o Ginger green tea.', variants: [{label:'Único',price:6000}], published:true, source:'carta-aportada' },
  { id: 'vermu-vaso', name: 'Vaso de vermú', category: 'Vermutería', description:'Rojo, blanco o primavera con soda.', variants: [{label:'Único',price:8000}], published:true, source:'carta-aportada' },
  { id: 'vermu-compartir', name: 'La fuerza de compartir', category: 'Vermutería', description:'Botella de rojo, blanco o primavera con dos sifones.', variants: [{label:'Único',price:39000}], published:true, source:'carta-aportada' },
];

export const categories = ['Todos', 'Cafetería', 'Fríos', 'Bebidas frías', 'Filtrados y té', 'Vermutería'];
export const coffeeAddOns = [{id:'leche-almendras',label:'Leche de almendras y dátiles',price:1500},{id:'leche-avena',label:'Leche de avena',price:2000}];
export const formatARS = (value: number) => new Intl.NumberFormat('es-AR', { style:'currency', currency:'ARS', maximumFractionDigits:0 }).format(value);
