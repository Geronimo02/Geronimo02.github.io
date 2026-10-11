# FOSTER CLUB — MASTER BRIEF PARA ANTIGRAVITY

**Proyecto:** web de marca + carta independiente + armado de pedidos por WhatsApp.  
**Marca:** Foster Club — hamburgueseria en Tandil, Argentina.  
**Version:** 1.0 — 11/10/2026.  
**Objetivo de esta entrega:** implementar una experiencia visual casi identica al *mockup Foster aprobado por el usuario* en su direccion de arte, con una navegacion inspirada en la experiencia editorial de https://madie.es/, pero con personalidad, material y copy propios de Foster Club.

> **INSTRUCCION DE MAXIMA PRIORIDAD PARA EL AGENTE**
>
> No crear una landing generica. La referencia de diseno principal es `referencias/mockup-home-aprobado.png` (o el PNG adjunto por el usuario `foster_club_burgers_y_buenas_historias.png`). Es una **referencia visual conceptual**, NO una fuente confiable de datos comerciales. Mantener la identidad Foster: logo original, bordó, crema, naranja sutil, fotos de burgers y los dos perritos en Vespa. Construir **DOS PAGINAS** reales (`/` y `/carta`) y un flujo de carrito funcional que redacte el pedido para WhatsApp. No copiar el codigo, las fotos, los textos ni la identidad de Madie.

---

## 0. Modo de trabajo esperado en Antigravity

1. Revisar el repositorio/proyecto existente antes de modificar: stack, rutas, dependencias, convenciones, componentes, estilos, assets y scripts. **Conservar el stack y componentes utiles**; no inicializar desde cero si ya hay un proyecto.
2. Encontrar los assets Foster proporcionados y crear un inventario corto: `logo`, `monograma`, `ilustracion Vespa`, `fotos burger`, `foto mesa`, `mockup aprobado`, `menu captura`.
3. Hacer una implementacion **mobile-first**, con responsive de alta calidad, no un screenshot estatico ni una pagina maquetada solo para desktop.
4. Implementar paginas, componentes, sistema de datos de carta, carrito y enlace a WhatsApp de extremo a extremo. **No dejar botones decorativos o sin accion**.
5. Antes de empezar, identificar cualquier informacion faltante en un archivo de configuracion o `TODO` claramente etiquetado. No inferir ni inventar numero oficial de WhatsApp, precios vigentes, horarios, promociones, stock, tiempos de entrega ni domicilio de clientes.
6. Al terminar: ejecutar linter, typecheck, build, y pruebas manuales en desktop (1440 px), tablet (768 px), mobile (390 px) y mobile angosto (320 px). Corregir desbordes.
7. Entregar un mini resumen con archivos modificados, funcionalidades completas, variables a configurar y capturas (si hay herramienta de navegador/capturas disponible).

### Jerarquia de referencias

1. **Mockup de Foster aprobado**: manda en composicion, tipografia, jerarquia, fotografia, mascota, paleta, CTA y ritmo de la home.
2. **Archivos de identidad de Foster**: mandan en logos, ilustraciones, fotografia real y nombres de productos.
3. **Madie** (`https://madie.es/`): inspira comportamiento, fluidez, transiciones curvas, composicion editorial, tabs, menu fullscreen y ritmo de scroll. NO proporciona activos ni contenido.
4. **Este brief**: especifica funcionalidad, arquitectura, estados, accesibilidad y reglas de negocio.

---

## 1. Marca y direccion de arte

### Concepto

**NOT JUST BURGERS. IT'S A CLUB.**

Foster es una hamburgueseria con vibra diner retro, urbana, canchera, de amigos y mesas compartidas. Look premium-editorial, pero informal y calido: **que parezca la web de Foster, no un SaaS, no un e-commerce blanco estandar, no otra web de hamburguesas con fondo negro y amarillo**.

### Logo y personajes (obligatorios)

- **Logo Foster Club original**: palabra `foster` con la firma `club.` por debajo/superpuesta. NO recrearlo escribiendo `FOSTER` con una fuente.
- **Monograma `f`** de la imagen suministrada para favicon, menu mobile, loader discreto, sticker o detalles.
- **Ilustracion de los dos perros en Vespa**: pieza grafica protagonista de la seccion "El Club" y sello mas pequeno cerca del hero. Reutilizar el asset original con fondo removido/transparencia real o versiones monocromas fieles. NO sustituir por otro animal o ilustracion AI distinta.
- Si faltan archivos recortados o alta resolucion, prepararlos desde los materiales disponibles con calidad suficiente; no hacer pasar un recorte pixelado por un SVG oficial.

### Colores (tokens iniciales a refinar con referencia original)

```css
:root {
  --color-burgundy: #4b0f12;
  --color-burgundy-deep: #2d080e;
  --color-cream: #f8e6d1;
  --color-paper: #fff9ef;
  --color-orange: #db652f;
  --color-espresso: #23120f;
  --color-muted: #8d6b60;
  --color-line: rgba(75, 15, 18, 0.23);
  --radius-card: 20px;
  --content-max: 1440px;
}
```

**Pauta:** fondo crema donde se lee la carta; burgundy en hero/menu fullscreen/footer; naranja solamente para la reticula, notas visuales y CTAs puntuales. No introducir rosa de Madie.

### Tipografias

- **Archivo Black**: titulares principales, titulares de secciones y nombres en destaque.
- **DM Sans**: parrafos, interfaz, botones, descripciones.
- **DM Mono**: categorias, precios, metadatos, indices y elementos editoriales.
- Texto outline combinado con solido, usando `-webkit-text-stroke` con fallback legible. En movil nunca permitir quiebres absurdos o overflow.
- Mantener el *logo como asset*, no sustituirlo por alguna de esas fuentes.

### Fotografia y elementos graficos

- Priorizar fotos reales de Foster: burger apetitosa con cheddar, papas en bandejas, mesas cromadas, empaques y amigos.
- Foto hero grande, alto contraste y degradado borgona/negro suave detras del texto; no aplicar tantos filtros que deje de verse la comida.
- Curvas organicas separando secciones mediante SVG/CSS; lineas finas; reticula naranja sobre borgona en bloques puntuales; etiquetas manuscritas como `GOOD BURGERS. HAPPIER PEOPLE.`; sellos circulares lentos, sin sobrecargar.
- Las imagenes del mockup son una composicion generada: no asumir que todos esos productos, empaques, labels, locales o vasos existan realmente.

---

## 2. Arquitectura de navegacion

### Rutas REALES

| Ruta | Rol | Requisito |
| --- | --- | --- |
| `/` | Landing editorial Foster Club | Igual de aspiracional que el mockup, navegacion completa, CTA a la carta |
| `/carta` | **Pagina exclusiva de carta completa** | Menu filtrable, detalle de producto, variantes/extras, carrito, WhatsApp |
| `/#el-club` | Ancla / bloque de marca | Scroll accesible desde header y menu |
| `/#galeria` | Galeria | Scroll accesible |
| `/#ubicacion` | Como llegar | Mapa/Google Maps |
| `*` | Not found | 404 con identidad Foster y vuelta a home |

> No resolver `/carta` solamente con un tab o modal en el inicio. Debe ser una **URL independiente y compartible**. En la home puede haber un teaser de la carta, pero todos los CTA "Ver carta" deben llevar a `/carta`.

### Header

- Logo real a la izquierda con link a `/`.
- Desktop: Inicio / Carta / El Club / Galeria / Como llegar / CTA `PEDI AHORA` -> `/carta` (o anchor CTA pedido en carta).
- Mobile: logo + icono carrito (con badge real) + boton menu.
- Header preferentemente sticky con fondo translúcido/borgona ajustado por seccion; nunca tapar el contenido.
- **Menu fullscreen inspirado en Madie**: borgona, links gigantes crema, entrada por stagger, botoncito cerrar, Instagram, ubicacion y contacto solamente cuando sean datos validos. Bloquear scroll del body mientras esta abierto, foco atrapado y cierre con Esc. Un link seleccionado cierra menu y navega.
- Link `Carta` siempre accesible, incluso con menu cerrado.

---

## 3. HOME — `/` — referencia exacta: mockup aprobado

### 3.1 Hero (primer impacto)

**Composicion:** seccion de fondo borgona muy oscuro, con grilla retro apenas visible, fotografias de burger + papas a la derecha ocupando aprox. 55 % del ancho desktop. Izquierda: titulares gigantes mix outline/solid. Logo/header arriba. Mascota chica en esquina inferior de la imagen. Borde inferior con onda crema, no corte recto.

**Copy sugerido:**

```
NOT JUST
BURGERS.
IT'S A CLUB.

Burgers, amigos y buenas historias.
Un club para los que disfrutan las cosas simples y bien hechas.

[ VER CARTA -> ]  [ COMO LLEGAR ]
```

- Label manuscrita/rotada: `GOOD BURGERS. HAPPIER PEOPLE.`
- `VER CARTA` -> `/carta`.
- `COMO LLEGAR` -> `/#ubicacion`.
- `PEDI AHORA` -> `/carta` (nunca abrir WhatsApp con pedido vacio).
- Hero tablet/mobile: apilar titular, foto protagonista y CTA; evitar que el texto cubra la hamburguesa. CTA visibles sin scroll innecesario.

### 3.2 Preview de carta / `NUESTRAS BURGERS`

Fondo crema, ondas suaves. Dos areas: intro editorial izquierda y 2–3 columnas de preview en desktop a la derecha. Mostrar una seleccion editable desde el dataset: Burgers / Bagels / Milkshakes y opcional Fried Chicken. Nombre, descripcion muy corta y precio **solo si esta confirmado**. CTA naranja/crema `VER CARTA COMPLETA` -> `/carta`.

> La home no reemplaza la pagina `/carta`. Evitar repetir la carta completa aqui.

### 3.3 `MAS QUE BURGERS` / El Club

Fondo crema, titular mezclando outline y solido. Copy:

> Foster Club es un punto de encuentro. Buena comida, musica, amigos y una actitud simple: disfrutar.

Incluir muy grande la ilustracion real de **dos perros en Vespa**, manteniendo fidelidad a la referencia. Integrar sello manuscrito `SAME BURGERS. DIFFERENT STORIES.` Animar el asset por entrada lateral leve, con pausa para reduced-motion. Ancla `id="el-club"`.

### 3.4 Galeria

Franja editorial de 4–6 fotos autenticas. Desktop mosaico horizontal/carrusel; mobile scroll-snap y swipes. Fotos reales de papas, mesa compartida, burger, milkshakes **solo si realmente se disponen del material**. Superponer etiqueta `GOOD FOOD. BETTER COMPANY.`

CTA Instagram -> `https://www.instagram.com/fosterclubb/` (enlace proporcionado por el usuario). Ancla `id="galeria"`.

### 3.5 Ubicacion + footer

Fondo borgona, encabezado gigante `TE ESPERAMOS / en Tandil.` Mapa o ilustracion estilizada de la zona con enlace a la ficha Google Maps del usuario:

`https://www.google.com/maps/place/foster+club/@-37.3330057,-59.1344799,53m/data=!3m1!1e3!4m6!3m5!1s0x95911f9eaa1cea91:0xdd658182fc477ac6!8m2!3d-37.3330508!4d-59.1341719!16s%2Fg%2F11zd4yztqg`

- **Direccion de trabajo:** `Constitucion 511, Tandil, Buenos Aires`, encontrada en directorios/ficha comercial, **validar antes de lanzamiento**.
- **Horario:** pendiente de confirmacion en fuente oficial; NO usar horarios inventados que aparecen en el mockup.
- **WhatsApp / telefono / email:** pendiente de validacion; **NO usar el numero, mail ni las franjas horarias ilustrativas generadas en el mockup**.
- Instagram: enlace real provisto por el usuario.
- Mini logo Foster en footer, links reales y creditos discretos. Ancla `id="ubicacion"`.

---

## 4. CARTA — `/carta` — **pagina independiente, desarrollarla por completo**

### Vision

La pagina de carta es la segunda experiencia estrella del sitio. Debe ser utilizable de verdad para elegir y pedir, **pero verse como la extension editorial de la home**, no como una plantilla Shopify o una app de delivery ajena a Foster.

### 4.1 Above the fold de Carta

**Desktop:** header Foster arriba y banda borgona de aproximadamente 260–360 px; sobre ella:

```
FOSTER CLUB / MENU

LA
CARTA.

Elegí lo que se te antoja.
Nosotros nos encargamos del resto.
```

- Imagen recortada de burger, papas o mascota en la derecha de la banda hero, sin competir con el titulo.
- Un pequeño sticker `BUENAS BURGERS, MEJOR PLAN.`
- Transicion curva del hero borgona hacia el cuerpo crema.
- Directamente debajo, una barra de categorias horizontal tipo pills muy cuidada; en desktop se puede acompanar de indice vertical, en mobile scroll horizontal con snap. La categoria activa cambia al hacer clic y se mantiene visible al scrollear.

### 4.2 Filtros y categorias

Orden sugerido del menu (editable desde configuracion):

1. `BURGERS`
2. `BAGELS`
3. `FRIED CHICKEN`
4. `SIDES / PAPAS`
5. `MILKSHAKES`
6. `MENU INFANTIL`
7. `BEBIDAS`

**Nota:** `ADICIONALES` pertenece por defecto a las opciones de personalizacion del producto; si la marca prefiere venta individual, habilitar tambien una categoria adicional.

Experiencia:
- Opcion `VER TODO` por defecto + categorias. Filtro inmediato sin recargar pagina.
- Click en categoria hace scroll suave a bloque (modo secciones) o filtra cards (modo filtrado). Elegir un patron consistente: **preferido secciones con anclas + barra sticky**, muy editorial y mas cercano a Madie.
- Cada bloque tiene `numero de categoria`, `heading grande`, linea divisoria, intro corta y productos.
- No usar paginacion para una carta de este tamano.
- Link directo opcional a `?categoria=burgers` y/o `#burgers`, para compartir.
- Si una categoria no tiene productos `disponibles`, no mostrarla como disponible o indicar temporalmente sin productos.

### 4.3 Composicion de productos

**Desktop:** grid editorial de dos columnas; en algunas categorias una columna con filas anchas (no todas las cards identicas). Ficha con foto (cuando exista), nombre grande, ingredientes, badges verdaderos y precio alineado a derecha. Divisores burgona muy finos; cremas con leve textura de papel; abundante aire y tipografia cuidada. Fotos recortadas y encuadres generosos, no iconitos genericos.

**Mobile:** una sola columna. Foto (si existe) de 100–140 px a un lado o arriba segun categoria, texto legible, nombre, precio confirmado, boton `+` con area tactil >= 44px. Chips de categorias sticky y carrito fijo abajo.

**Estados visuales:** hover, focus, presionado, producto agotado, imagen ausente, precio no confirmado. Las cards deben ser clickeables tambien con teclado.

### 4.4 Ficha/detalle de producto

Al tocar una burger/producto, abrir un **drawer lateral en desktop** y un **bottom sheet mobile** (puede usarse una pagina detalle accesible si arquitectura existente lo exige). Contenido:

- Foto real o placeholder de marca, nombre, ingredientes, precio, alergenos si estan confirmados, descripcion.
- Cantidad con controles `- / +`, minimo 1 y tope razonable configurable.
- Extras segun categoria, y solo si corresponden al producto: medallon extra, cheddar extra, bacon, papas, aros, etc. **No asignar precios ni asumir disponibilidad de extras desde el diseno**.
- Grupo `Elegí tus adicionales` con precio de cada extra en ARS solo si se verifico.
- Campo `Indicaciones para este producto` (ej. sin cebolla), texto corto. No prometer que modificaciones incompatibles son posibles.
- CTA ancho `AGREGAR AL PEDIDO` con subtotal dinamico.
- Drawer se cierra por X, tecla Escape y overlay; restaurar foco al producto anterior; no cerrar mientras el usuario interactua.

**IMPORTANTE:** si precio no confirmado de un producto o adicional, no permitir que el carrito cierre un total falso. Ofrecer **modo carta visual sin pedidos** hasta que los datos tengan `priceArs` validados, o marcar el producto como `orderingEnabled: false` con explicacion clara.

### 4.5 Carrito UX

- Icono de carrito arriba con badge numerico persistente.
- Desktop: drawer a la derecha (aprox. 420–480 px) con overlay translucido, filas ordenadas, cantidad, extras, observaciones, eliminar, subtotal y CTA.
- Mobile: **barra inferior fija** `VER MI PEDIDO (N) · $TOTAL` (solo si hay items/precios validos), que abre bottom sheet o drawer full-screen. Respetar safe-area iOS y no tapar ultimo item del menu.
- Permitir modificar cantidades y eliminar productos desde el carrito.
- Si hay repeticion del mismo producto con **los mismos extras y observaciones**, consolidar lineas; si cambian extras/observaciones, mantener lineas distintas.
- Carrito vacio con copy de Foster + `VOLVER A LA CARTA`.
- Mostrar importe monetario con `Intl.NumberFormat('es-AR', {style:'currency',currency:'ARS', maximumFractionDigits:0})`.
- Persistir carrito en `localStorage` con version de esquema (`foster-cart-v1`) solo del lado cliente; manejar SSR/hidratacion; al cargar validar productos, precios y disponibilidad contra el catalogo actual y alertar si cambiaron.
- No necesitar cuenta ni registro.
- No usar Stripe, MercadoPago ni checkout online sin aprobacion; **esto es armador de pedido para WhatsApp**.

### 4.6 Finalizar pedido via WhatsApp

Cuando el cliente toca `ENVIAR PEDIDO POR WHATSAPP`:

1. Confirmar que existen items validos y que el negocio tiene numero oficial en formato internacional E.164 SIN `+`, espacios, guiones ni simbolos. Ejemplo de **formato**, no numero real: `54911XXXXXXXX`.
2. Pedir **nombre** (recomendado requerido para recepcion), **tipo de pedido** (`Retiro en local` o `Delivery` SOLO si Foster confirma ambos canales), **direccion** solo si delivery real esta habilitado, y un campo de **observaciones generales**. No prometer disponibilidad ni horario de entrega.
3. Revalidar items/precios, moneda ARS y extras.
4. Construir un texto legible con el detalle completo. Usar `encodeURIComponent` y abrir `https://wa.me/${numero}?text=${mensajeCodificado}` desde el clic; `target="_blank"` y `rel="noopener noreferrer"` si se usa `window.open`/link.
5. **NO vaciar el carrito automaticamente** al abrir WhatsApp: abrir una URL no garantiza que el cliente haya enviado el mensaje. Ofrecer limpiar manualmente/confirmar despues.
6. Si numero oficial falta, ocultar/deshabilitar `ENVIAR` e indicar configuracion pendiente; nunca inventar un numero.
7. Confirmar explicitamente en interfaz: `El pedido se enviara por WhatsApp. No queda confirmado hasta que el local te responda.`

**Ejemplo de texto esperado (solo ejemplo, no pedido real ni precios reales):**

```text
Hola, Foster Club! Quiero hacer un pedido:

*Pedido Foster Club*
1 x Underground
  + Extra cheddar x1
  Observaciones: sin pepinillos
2 x Papas clasicas
1 x Milkshake Oreo

Subtotal productos: $[TOTAL_PRODUCTOS]
Adicionales: $[TOTAL_ADICIONALES]
TOTAL ESTIMADO: $[TOTAL]

Nombre: [NOMBRE]
Modalidad: Retiro en local
Notas: [NOTAS]

El pedido queda sujeto a confirmacion del local. Gracias!
```

**Logica:** suma en centavos o valores enteros ARS consistentes; aplicar extras por unidad correctamente y multiplicar por cantidad. No sumar un extra una sola vez si el item tiene 3 unidades. Proteger contra `NaN`, `null`, precios negativos y filas duplicadas de mas. Para variantes de un mismo producto, usar `lineId` que incorpore variantes normalizadas.

### 4.7 Empty/loading/error states

- Carta cargando: skeleton crema/borgona sin saltos de layout.
- Sin foto: bloque bonito con logo/monograma; **no inventar una foto de producto diferente**.
- Producto sin precio: visible como informacion, pero boton de compra deshabilitado con explicacion `Consultanos precio` (sin armar total incorrecto).
- Sin productos en categoria: estado vacio editorial.
- Error al guardar carrito: informar y mantener interfaz usable.
- WhatsApp no instalado: `wa.me` abre navegador; no intentar esquemas exclusivos de app que fallen en desktop.
- Sin conexion de datos externos: menu local sigue disponible (MVP estatico).

---

## 5. Catalogo base tomado de la CAPTURA enviada

**CRITICO:** lo siguiente es una **transcripcion inicial de NOMBRES y grupos** que aparecen en la historia con el menu proporcionado por el usuario. No implica que todos sigan a la venta hoy. Los precios que se ven como `21`, `19`, `4`, etc. NO tienen una escala/currency confirmada, por lo que **no deben publicarse como `$21`, `$21.000` ni como cualquier otro valor arbitrario**. Inicializar `priceArs: null`, `verified: false`; validarlos con una carta vigente antes de habilitar ventas.

### Burgers

- `UNDERGROUND` — doble cheddar, cebolla caramelizada, pepinillos, burger sauce.
- `DA BACON` — doble cheddar, bacon crispy, chutney de bacon, alioli de ajo confitado.
- `CRISPY QUEEN` — cebolla crocante, doble provolone, BBQ casera.
- `ONION RANCH` — cheddar, salsa ranch, aros de cebolla.
- `BLUE CHEESE` — provolone, queso azul, cebolla caramelizada, rucula.
- `CHEESE BURGER` — cheddar, cebolla brunoise, ketchup, mostaza.
- `CHEEKY CHIK` — pollo frito, salsa burger, pepinillos, salsa citrica, bacon (verificar descripcion contra carta original).
- `VEGGIE BURGER` — medallon de verduras de la casa (verificar ingredientes y aptitud veggie/vegana).
- `BANDEJA 420` — producto compartido, verificar receta, disponibilidad y unidades.

### Bagels

- `SALMON` — salmon curado, queso tipo Philadelphia, pesto de rucula, ciboulette, cebolla morada (validar detalles).
- `TRUFA MELT` — doble carne smash, queso dambo, cebolla caramelizada, mayonesa trufada.
- `FUNGHI` — hongos grillados, kale, queso dambo, cebolla caramelizada y mayo trufada (validar descripcion).
- `BRUNCH BAGEL` — huevo a la plancha, bacon, queso cheddar, palta.

### Fried chicken

- `BALDE X4`
- `BALDE X8`

### Menu infantil

- `NUGGETS (X5)`
- `CHEESE BURGER JR.`
- `MAC AND CHEESE`

### Sides

- `PAPAS CLASICAS`
- `PAPAS FOSTER` — papas con queso parmesano, trufa y dip de salsa Foster (validar ingredientes).
- `AROS DE CEBOLLA`

### Milkshakes

- `OREO`
- `CHOCOLATE & MANTEQUILLA DE MANI`
- `COOKIE`

### Bebidas

- `AGUA SIN GAS`
- `AGUA CON GAS`
- `GASEOSAS` — variantes de sabor/marca solo si confirmadas.
- `AGUA SABORIZADA` — variantes solo si confirmadas.

### Adicionales / modificadores

- `MEDALLON BLEND CON DOBLE CHEDDAR`
- `PAPAS FRITAS`
- `BACON`
- `AROS DE CEBOLLA`

**No asumir** que extras se pueden sumar a todos los productos ni que un producto trae papas por defecto. Modelar elegibilidad por producto, groups/options y `maxSelections`. Variantes de bebida (marca/sabor/tamano) deben tener precios verificados o presentarse solamente como informacion.

### Estructura de datos sugerida

```ts
type CategoryId =
  | 'burgers' | 'bagels' | 'fried-chicken' | 'sides'
  | 'milkshakes' | 'kids' | 'drinks';

type ModifierOption = {
  id: string;
  label: string;
  priceArs: number | null;
  available: boolean;
  verified: boolean;
};

type ModifierGroup = {
  id: string;
  label: string;
  minSelections: number;
  maxSelections: number;
  options: ModifierOption[];
};

type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  description: string;
  priceArs: number | null;
  imageUrl: string | null;
  available: boolean;
  verified: boolean;
  featured?: boolean;
  orderingEnabled: boolean;
  badge?: string | null; // Solo si el dato es real
  allergens?: string[];  // Solo al confirmar
  modifiers?: ModifierGroup[];
};
```

**Ejemplo de semilla SIN precio inventado:**

```ts
const products: Product[] = [
  {
    id: 'burger-underground',
    slug: 'underground',
    name: 'Underground',
    category: 'burgers',
    description: 'Doble cheddar, cebolla caramelizada, pepinillos y burger sauce.',
    priceArs: null,
    imageUrl: null,
    available: true, // existencia en captura; validar vigencia antes del lanzamiento
    verified: false,
    featured: true,
    orderingEnabled: false,
    modifiers: [],
  },
];
```

**Importante para el agente:** el sistema de compra debe implementarse y probarse con fixtures de test, pero si no llegan precios validos o numero de WhatsApp, se entrega como `configuracion pendiente`, no como un carrito que envia datos falsos a clientes reales.

---

## 6. Reglas del pedido / modelo tecnico

### Tipos utiles

```ts
type CartItem = {
  lineId: string;
  productId: string;
  quantity: number;
  selectedOptions: Array<{ optionId: string; quantity: number }>;
  note: string;
};

type OrderSettings = {
  whatsappNumber: string | null; // E.164, solo digitos, configurado por admin
  currency: 'ARS';
  pickupEnabled: boolean;
  deliveryEnabled: boolean;
  businessAddress: string | null;
};
```

### Calculo de total

```ts
const unitTotal = product.priceArs + selectedOptions.reduce(
  (sum, option) => sum + option.priceArs * option.quantity,
  0
);
const lineTotal = unitTotal * cartItem.quantity;
```

- Ejecutar solo con precios no nulos, enteros y verificados. Si hay datos invalidos, bloquear finalizar y dar feedback.
- Producto con extras distintos = lineas diferentes.
- Precio enviado por WhatsApp = calculado desde catalogo vigente, no precio viejo persistido en localStorage.
- No persistir nombre/direccion del cliente si no hace falta. Si se recolectan, que sea solo al generar el texto para WhatsApp.
- Deshabilitar delivery hasta recibir confirmacion de la marca sobre zonas/costos.
- Si se integra costo de delivery mas adelante, el total debe ser `subtotal + envio`, y mostrar si se define con el local; no declarar `TOTAL` con envio oculto.

### Configuracion comercial (editable sin buscar strings por todo el codigo)

```ts
export const fosterConfig = {
  brandName: 'Foster Club',
  city: 'Tandil',
  instagramUrl: 'https://www.instagram.com/fosterclubb/',
  googleMapsUrl: 'https://www.google.com/maps/place/foster+club/',
  address: 'Constitucion 511, Tandil', // VALIDAR
  whatsappNumber: null, // PENDIENTE - obligatorio para habilitar pedidos
  openingHours: null, // PENDIENTE
  pickupEnabled: false, // confirmar
  deliveryEnabled: false, // confirmar
  orderingLive: false, // true solamente con precios y WhatsApp verificados
  currency: 'ARS',
};
```

---

## 7. Componentes sugeridos (adaptar a stack existente)

```text
src/
  components/
    layout/
      Header
      FullscreenMenu
      Footer
      WaveDivider
    home/
      Hero
      FeaturedMenu
      ClubStory
      ScooterMascot
      Gallery
      Location
    menu/
      MenuHero
      CategoryNav
      CategorySection
      ProductCard
      ProductDetailDrawer
      QuantityStepper
      ModifierSelector
      CartButton
      CartDrawer
      CartLineItem
      OrderDetailsForm
    ui/
      Button
      Badge
      SectionHeading
      ScrollReveal
  data/
    fosterConfig
    categories
    products
  lib/
    formatPrice
    cartTotals
    cartValidation
    whatsappOrderMessage
    cartPersistence
  pages/ or app/
    home
    carta
```

**Stack recomendado** si no existe stack: React + TypeScript, Vite o Next.js segun deployment, Tailwind o CSS modular; Motion for React para transiciones. Si ya hay tecnologia instalada, NO migrar por capricho. Para estado de carrito Context + reducer o Zustand si ya existe. Evitar traer 5 librerias de animaciones para un sitio pequeno.

---

## 8. Animaciones y microinteracciones

### Landing

- Hero: imagen entra con escala suave `1.05 -> 1` y opacidad, titular sube por lineas.
- Transiciones crema/borgona con ondas organicas; **morfologia Foster**, no path calcado de Madie.
- Sticker circular gira muy lentamente; se frena con `prefers-reduced-motion`.
- Scooter/perritos aparece por un reveal horizontal suave, no rebote caricaturesco.
- Fotografias de galeria se desplazan ligeramente con scroll o drag, sin scroll-jacking.

### Carta

- Aparecen categorias al hacer scroll (fade + y pequena).
- Categoria sticky indica seccion activa sin sacudidas.
- Producto al hover muestra foto con scale `1.02`, linea de acento, CTA claro.
- Drawer detalle abre en 200–300 ms; fondo oscurece suavemente.
- Al agregar un producto, feedback `AGREGADO` y badge de carrito se actualiza; pequena animacion de escala no invasiva.
- Carrito aparece desde derecha en desktop y desde abajo en mobile.
- Moverse por categorias no debe reiniciar el carrito ni recargar la pagina.

### Preferencias de movimiento

- Animar `transform`/`opacity`, evitar parallax excesivo.
- Respetar `prefers-reduced-motion: reduce` (sin desplazamientos largos, animaciones opcionales, transiciones instantaneas).
- No bloquear scroll natural ni hacer autoplays sonoros.

---

## 9. Responsive (medidas de referencia)

| Viewport | Home | Carta |
| --- | --- | --- |
| >= 1280 px | Hero split 45/55; titulares enormes, galeria horizontal | Cabecera editorial; indice lateral opcional; items 2 col; carrito drawer lateral |
| 768–1279 px | Hero ajustado; textos legibles, fotos proporcionales | Grid 1–2 col; tabs sticky, drawer |
| 375–767 px | Hero apilado con fotografia protagonista; menu fullscreen | Chips horizontal sticky, productos 1 col, boton carrito fijo abajo, bottom sheet |
| 320–374 px | Hero y nav sin overflow; boton grande | Cards compactas, precios sin corte, modal a ancho completo |

- Botones tactiles minimo 44x44 px y distancia suficiente.
- Padding horizontal escalable 16–24 mobile y 40–80 desktop.
- Texto mobile >= 14 px salvo microetiquetas decorativas.
- Evitar que sticky header + sticky categorias tapen el ancla (`scroll-margin-top`).
- Respetar `env(safe-area-inset-bottom)` para barra de carrito en iOS.
- Reservar altura inferior para barra fija, para que no tape el footer ni el ultimo producto.

---

## 10. Accesibilidad, performance y SEO

### Accesibilidad

- Correcta jerarquia H1/H2/H3, botones reales, enlaces reales; no usar `div` con onClick sin teclado.
- `aria-label` en iconos solo visuales; contador del carrito anunciado con etiqueta util.
- Dialog/drawer con foco atrapado/restaurado, `aria-modal`, escape, overlay.
- Contraste AA en textos y acciones, especialmente orange/cream y outline.
- Fotos con `alt` descriptivo; decorativos `alt=""`.
- Inputs con label y validacion; indicar precio no disponible y error de WhatsApp.

### Performance

- LCP hero optimizado (WebP/AVIF, preload/prioridad solo imagen hero), lazy en galeria y menu fuera del viewport.
- `srcset`/`sizes`, reservar dimensiones para evitar CLS.
- Sin iframes pesados de Instagram; usar link + fotos locales autorizadas.
- Mapas: mini mapa visual estatico con enlace a Google Maps es aceptable si el embed penaliza carga.
- Animaciones eficientes sin librerias superpuestas.

### SEO

- `/`: `Foster Club | Burgers en Tandil` con description autentica.
- `/carta`: `Carta | Foster Club Tandil` con description de oferta general.
- Open Graph con fotografia real autorizada de Foster, logo original y URL absoluta.
- Schema `Restaurant`/`Menu` solo con datos confirmados; no schema de precio/horario falso.
- Enlaces internos claros Home ↔ Carta y link a Maps.

---

## 11. Contenido comercial: VERIFICAR ANTES DE PUBLICAR

| Dato | Estado | Accion |
| --- | --- | --- |
| Instagram oficial `@fosterclubb` | Link aportado por el usuario | Usar https://www.instagram.com/fosterclubb/ |
| Direccion `Constitucion 511, Tandil` | Hallada en ficha/directorio externo | Confirmar contra negocio antes de publicacion |
| Coordenadas Maps | Link proporcionado por usuario | Usar ese link para `Como llegar` |
| Horarios | No confirmados por negocio | Placeholder/config; no copiar del mockup |
| WhatsApp comercial | NO confirmado | Obligatorio antes de activar pedido |
| Pickup o delivery | NO confirmado | Desactivados hasta confirmar modalidad |
| Carta exacta vigente | Captura de Instagram, puede quedar antigua | Confirmar productos/descripciones |
| Precios | Numeros en captura sin escala monetaria validada | `priceArs: null` hasta verificar |
| Extras | Captura sugiere algunos | Confirmar compatibilidad/precio por producto |
| Fotos/branding de alta definicion | Hay referencias adjuntas | Sustituir por originales si existen |

**ATENCION:** el mockup aprobado tiene texto ficticio de ejemplo (direccion Santamarina 748, mail, telefono, horarios y precios). **Esos datos NO son reales ni deben copiarse a produccion.** Tampoco mostrar la fecha 2024 del pie del mockup; usar ano actual dinamico.

---

## 12. Criterios de aceptacion funcional y visual

- [ ] `/` reproduce la direccion visual del mockup Foster aprobado: hero borgona/fotografico, headline outline/solido, ondas crema, preview carta, mascota grande, galeria y ubicacion.
- [ ] **`/carta` existe como pagina autonoma**, no solo modal o seccion ancla.
- [ ] Header navega correctamente; logo lleva home; `Ver carta` y `Pedi ahora` llevan a `/carta`.
- [ ] Menu fullscreen se abre/cierra y permite teclado/Escape.
- [ ] Carta muestra las categorias disponibles y sus productos desde datos editables.
- [ ] Cada producto puede abrir un detalle usable en desktop y mobile.
- [ ] Se pueden seleccionar cantidad, notas y extras configurados para el producto.
- [ ] Carrito agrupa correctamente iguales y separa variantes diferentes.
- [ ] Carrito persiste entre Home y Carta al refrescar la pagina, si esta habilitado pedido.
- [ ] Total suma correctamente unidades y extras, sin NaN ni inventar precios.
- [ ] Mobile tiene barra fija de pedido que no tapa contenido.
- [ ] WhatsApp genera mensaje ordenado y link codificado correctamente **cuando este configurado numero real**.
- [ ] Sin numero/price data verificable NO permite enviar pedidos y explica por que.
- [ ] No hay lorem ipsum, links rotos, botones falsos ni textos de Madie visibles en produccion.
- [ ] Logo y perritos Foster estan implementados fielmente, sin sustituciones genericas.
- [ ] No hay scroll horizontal en mobile ni elementos desbordados.
- [ ] `prefers-reduced-motion` funciona.
- [ ] Build/lint/typecheck pasan; errores e imagenes ausentes tratados con gracia.

### Pruebas manuales minimas de pedido (con datos de TEST solamente)

1. Agregar 1 Underground sin extras -> carrito muestra 1 linea.
2. Agregar otra Underground sin extras -> debe quedar una linea x2.
3. Agregar una Underground con extra cheddar -> nueva linea independiente.
4. Cambiar cantidad desde carrito -> total se recalcula.
5. Borrar una linea -> actualiza badge y total.
6. Refrescar la pagina -> persiste y se valida el carrito.
7. Abrir detalle en mobile -> se puede cerrar con X/Escape/backdrop y navegar con teclado.
8. Generar texto a WhatsApp -> incluye todas las unidades, extras y notas, sin `undefined`/`NaN`, solo con numero real en config de testing.
9. Con precio `null` o numero WhatsApp `null` -> no se puede completar pedido erroneo.
10. Abrir link WhatsApp -> no vacia carrito automaticamente.

---

## 13. Entregables esperados del agente

1. **Pagina Home `/` completamente maquetada y responsive**.
2. **Pagina Carta `/carta` completamente maquetada y responsive**.
3. **Sistema de carrito funcional** y armado de mensaje WhatsApp condicionado a datos reales.
4. **Datos editables**: catalogo, precios, categorias, telefono, horarios, modalides y stock simple.
5. **Assets organizados** en el proyecto, originales de Foster usados siempre que sean legibles.
6. README corto: como editar menu/precios, como configurar WhatsApp, como desplegar y que queda pendiente del cliente.
7. QA visual y funcional + resumen final con los casos probados.

---

## 14. PROMPT FINAL — PEGAR EN ANTIGRAVITY JUNTO CON ESTE DOCUMENTO

> **Implementa la web completa de Foster Club usando TODO este markdown como especificacion principal.** Debes construir una landing premium en `/` visualmente fiel al mockup aprobado `referencias/mockup-home-aprobado.png`, y ademas la pagina INDEPENDIENTE `/carta` con categorias, fotos, fichas de producto, adicionales, cantidades, carrito persistente y envio de pedido a WhatsApp. El aspecto visual de `/carta` debe ser tan trabajado y editorial como la home: crema/borgona, grandes titulares, tabs sticky, lineas finas y transiciones organicas. Toma Madie como referencia de experiencia visual y animaciones, pero conserva exclusivamente la marca Foster. Antes de programar revisa el repositorio y reutiliza el stack existente. No inventes precios, horarios, direccion, telefono, stock ni fotos de productos: marca esos campos como pendientes y asegura que no se puedan enviar pedidos incorrectos hasta su validacion. El sistema de carrito y su mensaje WhatsApp deben estar realmente implementados y probados con fixtures de test, no ser un simple boton. Cierra con QA en desktop y mobile, lint/typecheck/build, y un resumen de configuracion pendiente.

---

## Anexos y links

- **Mockup aprobado:** `referencias/mockup-home-aprobado.png` / `foster_club_burgers_y_buenas_historias.png`.
- **Referencia interactiva:** https://madie.es/
- **Foster Instagram:** https://www.instagram.com/fosterclubb/
- **Foster Google Maps:** https://www.google.com/maps/place/foster+club/
- **Otras referencias:** menu y fotos proporcionadas por el usuario en la conversacion.

**Fin del brief.**
