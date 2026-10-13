# MALABAR EVENTOS — Branding y landing premium (dirección ROYAL · v3 interactiva)

**Proyecto:** Landing editorial premium inspirada en la referencia ROYAL + cotizador de eventos conectado a WhatsApp  
**Ubicación:** Tandil, Provincia de Buenos Aires, Argentina. Dirección pública de referencia: Av. Don Bosco 411 (confirmar antes de publicar).  
**Instagram:** https://www.instagram.com/malabareventos_/  
**Maps:** https://www.google.com/maps/place/Malabar+Eventos/@-37.3531415,-59.1317049,17z/

> Este documento es una propuesta de branding y especificación web basada en las imágenes y videos enviados. No debe interpretarse como una lista confirmada de servicios, capacidades o políticas comerciales de Malabar. Validar esos datos con el cliente antes del lanzamiento.

## 0. NUEVA REFERENCIA PRIORITARIA — ROYAL (octubre de 2026)

**Referencia aprobada por el cliente:** https://royaltemplate.framer.website/?ref=land-book.com  
**Dirección elegida:** arquitectura de lujo + minimalismo editorial + imagen real de alto impacto + animación discreta + CTA muy claro.

### Qué tomar de ROYAL

- **Impacto inmediato:** hero panorámico al 100% del viewport, foto arquitectónica real, titular enorme y botón de acción simple.
- **Navegación sobria:** logo tipográfico / isotipo M a la izquierda, secciones centradas, CTA de consulta destacado a la derecha; menú transparente sobre hero y fondo carbón tras el scroll.
- **Escala editorial:** secciones extensas con márgenes amplios, etiquetas numeradas, titulares sans de 60–110 px en desktop y ritmo visual arquitectónico.
- **Galería de "propiedades":** convertir las fichas de residencias de ROYAL en **tarjetas fotográficas de tipos de eventos**. Cada tarjeta debe preseleccionar su tipo en el cotizador.
- **Relato del lugar:** en lugar de "Our Story / Founder", mostrar el carácter de Malabar, la arquitectura, el entorno y detalles de la experiencia.
- **Comunidades/ambientes:** en vez de distritos o propiedades, imágenes reales de salón, recepción, barra, exteriores, gastronomía y montajes.
- **Prueba social:** testimonios únicamente reales, verificables y autorizados. Si no hay testimonios, usar fotos con personas y eventos reales, sin citas inventadas.
- **Cierre comercial:** bloque con fondo carbón, titular muy grande y CTA «Organizá tu evento».

### Qué NO copiar

- No usar nombres, textos ni fotografías de ROYAL ni clonar su layout pixel a pixel. Es una referencia de dirección de arte, no licencia para reutilizar assets.
- No meter búsqueda inmobiliaria, fichas de propiedades, blog de real estate ni newsletter innecesaria.
- No exagerar efectos parallax, poner autoplay con sonido ni sacrificar performance.
- No ocultar el cotizador detrás de la estética: el objetivo principal sigue siendo **generar solicitudes completas por WhatsApp**.

### Mockup HTML incluido

Ver `preview/index.html`, que muestra una landing conceptual responsive construida con fotos reales. Para verla, abrir el archivo en un navegador o servir la carpeta raíz con un servidor local. Usa `../assets/` para las imágenes. Incluye un formulario navegable de 4 pasos y resumen de consulta. **El número de WhatsApp está sin configurar intencionalmente**, para no atribuir un número equivocado a Malabar. Tras aprobar el diseño, integrar y validar el contacto real.

### Textos principales versión ROYAL

- **H1:** `Momentos extraordinarios. Un lugar único.`
- **Bajada hero:** `Eventos sociales y corporativos en un entorno único de Tandil.`
- **Hero CTA:** `Organizá tu evento` / `Conocé el espacio`
- **Introducción:** `Un lugar que transforma cada encuentro en algo para recordar.`
- **Eventos:** `Tu celebración. A tu manera.`
- **Espacio:** `Diseñado para sentirse diferente.`
- **Experiencia:** `Los momentos se viven en los detalles.`
- **Bloque emocional:** `Hay celebraciones que no se olvidan.`
- **Galería:** `La experiencia, en imágenes.`
- **Formulario:** `Tu próximo evento empieza acá.`
- **Cierre:** `Lo extraordinario se celebra.`

### Tokens CSS concretos (referencia flexible)

```css
:root {
  --coal: #181b18;
  --cream: #f7f6f2;
  --gold: #b69b74;
  --muted: #6a6d68;
  --section-padding-desktop: 140px;
  --content-max: 1460px;
  --page-gutter-desktop: 56px;
  --page-gutter-mobile: 16px;
}
.hero { min-height: 780px; height: 100svh; }
.display { font-size: clamp(53px, 7.8vw, 120px); line-height: .99; letter-spacing: -.073em; font-weight: 500; }
.section-heading { font-size: clamp(43px, 5.5vw, 88px); line-height: 1.07; letter-spacing: -.068em; font-weight: 500; }
```

### Motion y navegación (v3 aprobada)

- Hero fotográfico sticky: su marco se reduce durante el primer tramo de scroll y el texto se desvanece gradualmente.
- Titular editorial: lectura por palabras que ganan contraste con el desplazamiento.
- Tipos de eventos: selector vertical sticky de 4 ocasiones + escenario fotográfico que cambia al avanzar por la sección.
- El espacio: imagen arquitectónica que se expande visualmente a ancho completo con clip-path ligado al scroll.
- Galería horizontal: 5 fotografías avanzan lateralmente mientras el usuario sigue haciendo scroll vertical; en mobile es carrusel nativo desplazable con el dedo.
- Parallax ligero en gastronomía y sección emocional, revelado de titulares y transiciones entre pasos del formulario.
- Barra de progreso vertical de página y cursor contextual para elegir tipos de eventos (desktop).
- **Sin bloquear el scroll natural**; en pantallas <=950 px se desactivan los segmentos sticky pesados. `prefers-reduced-motion` deshabilita scrub/pinning y muestra siempre las opciones de eventos.
- Los formularios sólo **preparan consultas**; no hacen reservas ni envíos automáticos.


## V3 / Criterio de experiencia interactiva (13 de octubre de 2026)

**Objetivo de la versión:** que un visitante recorra Malabar como una experiencia audiovisual, sin sacrificar lo esencial: descubrir el espacio y solicitar cotización por WhatsApp. Referencia visual: https://royaltemplate.framer.website/ (inspiración, no copia del diseño ni de los assets de terceros).

### Secuencia del scroll en desktop

| Momento | Movimiento | Recurso real |
|---|---|---|
| 1. Hero (177svh) | La portada queda fija, el marco de la foto pasa de 100% a ~90% y se redondea; el titular se desvanece | `01-exterior-atardecer.webp` |
| 2. Concepto | Palabras de la frase principal ganan contraste según la posición de lectura, con el marcado en gris respetado | Texto editorial |
| 3. Eventos (~292svh) | Selector fijo con 4 categorías que activan fotos diferentes; cada categoría conduce al cotizador con tipo preseleccionado | lounge, recepción, barra, fachada |
| 4. Espacio | Foto panorámica arranca con márgenes y se expande a ancho completo | `02-exterior-panorama.webp` |
| 5. Experiencia | Movimiento de imagen de amplitud acotada, entrada editorial de textos | `05-gastronomia.webp` |
| 6. Galería (~262svh) | Carril de 5 fotografías se mueve horizontalmente con el scroll vertical; barra fina marca el avance | 5 fotos propias |
| 7. Cotizador | Reveal de entrada y transiciones suaves por paso sin alterar validación ni el WhatsApp | Formulario existente |

### Mobile / tablet / accesibilidad

- <=950 px: hero normal sin sticky prolongado, eventos apilados, galeria **deslizable con el dedo** y sin scroll horizontal forzado de la página.
- `prefers-reduced-motion: reduce`: **sin animaciones asociadas al scroll**, con contenido visible y grilla de eventos navegable. No ocultar titulares ni impedir cotizar.
- Navegación por teclado y links semánticos. La animación es ornamental: la información principal y los CTA no dependen de ella.
- Audio: ningún sonido automático, tampoco se reproducen los videos de origen sin decisión del visitante.

### Implementación del prototipo y migración a producción

- **Prototipo local**: HTML/CSS/JavaScript nativo con `position: sticky`, `requestAnimationFrame`, `IntersectionObserver`, `clip-path` y `transform` para funcionar sin CDN, build ni hosting. Las animaciones son genuinamente controladas por la posición del scroll (no son solo entradas estáticas).
- **Stack sugerido de producción**: React/Next.js o Astro; si el proyecto ya incluye GSAP + ScrollTrigger, portar las timelines a `ScrollTrigger` con `scrub` y `matchMedia`. *El prototipo actual es equivalente funcional en JavaScript nativo y no incluye GSAP como dependencia.*
- Nodos clave: `.hero-stage`, `.hero-frame`, `.event-story`, `.story-choice`, `.space-photo-frame`, `.gallery-pin`, `.gallery-track`, `#event-form`.
- `motion_v3.css` y `motion_v3.js` son los componentes fuente de esta iteración; `preview/index.html` ya los lleva integrados para que abra directamente.
- Cuidados: no animar el padre fijado con sticky/pin, no usar listeners de scroll sin `requestAnimationFrame`, evitar reflow continuo, reducir trabajo en dispositivos modestos.
- Todo texto e imagen con personas deben contar con permiso de uso comercial antes de publicar.

### Archivos y uso

- **Vista previa sin dependencias:** `MALABAR_V3_PREVIEW.html` (fotografías embebidas; hace falta conexión solo para cargar la fuente Manrope).
- **Sitio editable:** `preview/index.html` + `assets/*.webp` (mantener estructura). `assets/*.mp4` son clips adicionales para la evolución final.
- **Capturas QA:** `RECORRIDO_V3_DESKTOP.png` y `RECORRIDO_V3_MOBILE.png`.
- **Validación:** `pytest -q tests/test_motion_v3.py` con Python, pytest, Playwright y Chromium.

### Estado comercial antes de lanzar

El número real de WhatsApp se mantiene **vacío** en `WHATSAPP_BUSINESS_E164` para evitar envíos a un contacto inventado. El visitante puede completar el formulario, obtener el mensaje estructurado y copiarlo; la apertura de WhatsApp se habilita al configurar el número real. No se confirma reserva ni disponibilidad automáticamente.

---

## 1. Objetivo del sitio

Crear una presencia digital que **genere deseo de celebrar en Malabar** y convierta el interés en consultas **bien calificadas**. La venta no es solamente el alquiler de un salón: es la posibilidad de organizar un evento memorable en un entorno especial, con estética cuidada y una propuesta personalizada.

**Conversión principal:** completar el formulario "Organizá tu evento" y abrir WhatsApp con el brief preescrito.  
**Conversión secundaria:** consultar por WhatsApp desde el menú, las tarjetas de eventos y el footer.  
**Sin promesas falsas:** el sitio solicita propuestas; NO confirma reservas, fechas disponibles, precios finales ni servicios no verificados.

## 2. Concepto de marca

### Posicionamiento
Un espacio contemporáneo y cálido, inmerso en el paisaje de Tandil, pensado para eventos sociales y corporativos que merecen una experiencia especial.

### Frase principal sugerida
**Momentos extraordinarios. Un lugar único.**

Variantes para testear:
- **El lugar. El momento. Tu historia.**
- **Celebremos algo extraordinario.**
- **Un espacio a la altura de tus mejores momentos.**

**Personalidad:** elegante sin ostentación, cálida, natural, moderna, experiencial, cercana.  
**No buscar:** estética de boliche, lujo dorado artificial, renders genéricos, bancos de fotos, efectos saturados, una landing que parezca una plataforma de alquiler por horas.

### Relato de marca
"Hay lugares que se sienten distintos desde el primer momento. La arquitectura, la naturaleza y cada encuentro crean el escenario para celebrar como lo imaginaste. En Malabar, cada evento tiene su propia historia."

### Tono de voz
Frases breves, sensoriales, seguras. Tuteo/voseo natural para público argentino: "Tu evento", "Contanos", "Vení a conocerlo", "Diseñemos tu celebración". Evitar superlativos absolutos no demostrables y fórmulas impersonales.

## 3. Sistema visual

| Rol | Color | HEX | Uso |
|---|---|---|---|
| Carbón | Negro cálido | `#191B18` | Hero oscuro, menú, footer, overlays |
| Marfil | Blanco crema | `#F5F0E7` | Fondos claros, titulares invertidos |
| Champagne | Dorado mate | `#B69B74` | CTA de acento, líneas finas, detalles |
| Oliva | Verde natural | `#6F7766` | Piezas secundarias, secciones naturaleza |
| Nogal | Marrón madera | `#6B5140` | Referencias a arquitectura, detalles |
| Piedra | Gris arena | `#D5CEC3` | Bordes, separadores, fondos de formularios |

**Relación visual:** fondos principalmente marfil y carbón, fotografías inmersivas a sangre, detalles champagne muy puntuales. Evitar un tono dorado dominante. Los colores acompañan las fotografías sin competir con ellas.

### Tipografía
- **Titulares editoriales:** `Manrope` o `Neue Montreal`/`Satoshi` (pesos 400–600, tracking negativo fuerte, interlineado ajustado): el look ROYAL de referencia es predominantemente **sans-serif**, arquitectónico y contemporáneo, no de serif clásica.
- **Navegación, botones, formulario y cuerpo:** `Manrope` (400/500/600/700), legible y moderna.
- **Pequeñas etiquetas:** uppercase Manrope con tracking moderado, nunca textos largos en mayúsculas.
- **Importante:** evitar mezclar fuentes ornamentales de eventos/casamientos; este proyecto debe sentirse premium arquitectónico.

### Logo
**Conservar la M geométrica de Malabar**: la marca aparece instalada en la fachada y ya está asociada al lugar. Buscar el original vectorial SVG/AI/PDF y preparar versión positiva, negativa, monocroma y favicon. La captura de Instagram NO debe utilizarse como logo definitivo.

### Fotografía y video
- Hero: exterior arquitectónico al atardecer; mostrar tanto el edificio como el paisaje, con gradiente oscuro de apoyo sobre el texto.
- Alternar escala: plano general de exterior, interior con invitados, detalles de barra, gastronomía y ambientación.
- Utilizar **personas reales y eventos reales**, no fotos stock.
- No oscurecer todas las fotos: conservar luz cálida y atmósfera editorial.
- Los videos provistos son verticales o casi verticales: usar en sección experiencia/galería y móvil; evitar estirarlos como hero horizontal en desktop.
- No usar como pieza principal el material promocional con el logo de un tercero (Mashmu) sin permiso.

## 4. Arquitectura de la web (one-page premium)

### 4.1 Navbar
Logo M + MALABAR. Enlaces: **El espacio · Eventos · Experiencia · Galería · Ubicación**. CTA visible: **Cotizá tu evento**. En mobile, botón CTA fijo de manera discreta (sin tapar contenido).

### 4.2 Hero inmersivo
**Eyebrow:** MALABAR · TANDIL  
**Título:** Momentos extraordinarios. Un lugar único.  
**Subtítulo:** Eventos sociales y corporativos en un entorno único de Tandil.  
**CTA principal:** Organizá tu evento  
**CTA secundario:** Conocé el espacio  
**Visual:** `assets/01-exterior-atardecer.webp`; foto fullscreen con oscurecido gradual abajo, crop priorizando fachada y luz del horizonte. H1 grande en blanco sobre parte inferior de la imagen; reservar la composición hero 100svh como en la referencia ROYAL.

### 4.3 Presentación / propuesta
**Título:** Un escenario para vivirlo todo.  
**Texto:** "En Malabar, cada celebración empieza con una idea y se convierte en un encuentro único. Un entorno natural, espacios con personalidad y la posibilidad de crear una propuesta a tu medida."  
**Visual:** composición editorial de exterior e interior. Evitar estadísticas de capacidad o trayectoria sin información verificada.

### 4.4 Tipos de eventos: vender la ocasión
En desktop, un selector editorial sticky con cuatro fotografías que cambian al hacer scroll. En mobile/reduced motion, cuatro tarjetas grandes en una grilla. Todos los CTA *preseleccionan* el tipo de evento en el formulario:

1. **Casamientos y civiles** — "Un día importante merece un escenario inolvidable." 
2. **Eventos corporativos** — "Encuentros que conectan personas, equipos e ideas." 
3. **Cumpleaños y celebraciones** — "Festejá a tu manera, en un lugar que se siente distinto." 
4. **Eventos especiales** — "Brindis, despedidas y celebraciones diseñadas alrededor de tu idea." 

No afirmar exclusividad, tipo de ceremonia, servicios propios ni instalaciones técnicas hasta confirmarlos.

### 4.5 Espacio / ambientes
**Título:** Cada rincón tiene algo para contar.  
Presentar tres ejes visuales con fotos reales: **El salón**, **El entorno**, **Los detalles**. Fotografías de arquitectura de madera y vidrio, ambiente interior y jardín/exterior. El video de carpa se puede mostrar como ejemplo de montaje/evento, sin afirmar que está incluida en la contratación.

### 4.6 Gastronomía y personalización
**Título:** Los detalles hacen la experiencia.  
Intro: "Cada evento tiene su propio ritmo. Contanos qué imaginás para la recepción, la propuesta gastronómica, la barra y la ambientación."  
Usar fotos de catering y barra. Presentar las siguientes como **opciones a consultar**, no como servicios confirmados o paquetes incluidos:
- Gastronomía / recepción / menú.
- Barra y bebidas.
- Ambientación / mobiliario / iluminación.
- Música / sonido / experiencias.
- Ceremonias, montajes y carpas, si aplica.

CTA **Contanos cómo lo imaginás** → paso 3 del formulario.

### 4.7 Galería y video
**Título:** Momentos que hablan por sí solos.  
La v3 usa una **galería horizontal controlada por scroll vertical** en desktop, con cinco fotos reales y captions; en mobile, desplazamiento horizontal natural con snap. Los videos verticales originales se mantienen en los assets para la eventual versión definitiva, sin forzar autoplay ni audio.

### 4.8 Reseñas o testimonios
Sección opcional, únicamente con reseñas verificables y permiso para citar. No usar testimonios ficticios ni cantidad de eventos inventada. Si aún no hay aprobaciones, reemplazar con fotos de eventos reales.

### 4.9 Formulario de cotización (principal CTA)
**Título:** Imaginá tu evento. Nosotros te ayudamos a hacerlo realidad.  
**Subtítulo:** Contanos algunos detalles y recibí una propuesta personalizada.  
Etiqueta principal: **Solicitar propuesta** o **Cotizar mi evento**. NO "Reserva confirmada", porque todavía no existe agenda ni confirmación automática.

### 4.10 Ubicación + cierre
**Título:** Un lugar para desconectarse y celebrar.  
**Subtítulo:** "Descubrí Malabar en el entorno del Dique de Tandil."  
Mapa embebido opcional con lazy loading. Dirección *sujeta a confirmación*: Av. Don Bosco 411, Tandil. Botones **Cómo llegar** y **Consultar fecha**.

### 4.11 Footer
Logo, Instagram, ubicación, link de Maps, contacto por WhatsApp, breve disclaimer sobre consultas sujetas a disponibilidad.

## 5. Formulario en 4 pasos — brief listo para cotizar

**Experiencia ideal:** modal amplio o sección dedicada `#organiza-tu-evento`, ~2 minutos para completar, barra de progreso, preguntas breves, controles grandes touch-friendly y posibilidad de volver sin perder datos. Al pulsar CTA de una tarjeta, preseleccionar su tipo de evento.

### Paso 1: Qué querés celebrar
- `tipoEvento` obligatorio: Casamiento/Civil · Corporativo · Cumpleaños · Despedida/Brindis · Otro.
- `descripcionTipo` solo si elige Otro.
- Si **corporativo**: `empresa` opcional, `formatoCorporativo` (reunión, presentación, capacitación, festejo, networking, otro).
- Si **casamiento/civil**: `ceremoniaEnLugar` (sí/no/a definir).

### Paso 2: Cuándo y cuántas personas
- `fecha`: preferida, o "Aún no tengo fecha".
- `fechaAlternativa`: opcional.
- `flexibleFecha`: sí/no.
- `invitados`: número aproximado o rango estimado (obligatorio cuando se conoce; permitir "A definir").
- `turno`: día/tarde/noche/a definir.
- `duracion`: opcional.
- `espacio`: interior/exterior/ambos/a definir (preferencia; sujeto a disponibilidad).

### Paso 3: Cómo imaginás la experiencia
- `necesidades`: selección múltiple con **Quiero asesoramiento** como alternativa: gastronomía, recepción, barra de tragos, ambientación, mobiliario, DJ/música, sonido/iluminación, proyector/micrófono (para corporativo), ceremonia o montaje exterior, otras.
- **Preguntas condicionales:** si marca gastronomía, preguntar por formato preferido (recepción/picada, finger food, menú servido, a definir) y dietas relevantes (opcional); si marca barra, pedir estilo (sin alcohol, coctelería, barra general, a definir); si marca música, preguntar DJ, playlist, música en vivo o a definir; si marca montaje exterior, pedir preferencia de sector/carpas y aclarar que disponibilidad se confirma luego.
- **Casamiento/civil:** preguntar si desea ceremonia en el lugar y servicio posterior. **Corporativo:** pedir si necesita proyección/micrófono, formato de presentación y posible coffee break. Estas preguntas aparecen solo cuando corresponden, para no saturar el formulario.
- `estilo`: elegante, relajado, empresarial, festivo, todavía no sé (opcional).
- `presupuesto`: opcional y editable, preferible `rangoPresupuesto` configurable desde negocio; también "Prefiero recibir opciones".
- `comentarios`: texto libre con detalles especiales, accesibilidad, alergias, etc. No exigir datos sensibles.

Importante: estos son **requerimientos de cotización**, no una promesa de que Malabar proporcione todos los servicios directamente.

### Paso 4: Contacto y resumen
- `nombre` obligatorio.
- `telefono` obligatorio y validado como número telefónico.
- `email` opcional.
- `contactoPreferido` WhatsApp/llamada/email (opcional; siempre habrá entrega por WhatsApp desde el navegador).
- `consentimiento` obligatorio: "Acepto que Malabar me contacte para responder mi consulta".
- Mostrar **resumen editable** antes de enviar, con CTA "Enviar consulta por WhatsApp".
- Mostrar aclaración: "Se abrirá WhatsApp con todos los datos. Revisá y enviá el mensaje para completar tu consulta".

### Comportamiento al enviar
1. Validar los campos necesarios y guardar temporalmente en el estado del navegador (no enviar a servidor sin consentimiento explícito).
2. Armar texto claro, estructurado por secciones. Sustituir vacíos por "A definir" o no incluir campos vacíos no esenciales.
3. Construir `https://wa.me/<NUMERO_E164>?text=<MENSAJE_ENCODED>` con `encodeURIComponent`.
4. Abrir enlace de WhatsApp desde el click del usuario. **Esto no envía el mensaje automáticamente**: el visitante debe presionar Enviar en WhatsApp.
5. No inventar `<NUMERO_E164>`: solicitar **WhatsApp Business real de Malabar** (con código de país y área, solo dígitos). El número público de Google Maps no necesariamente es el WhatsApp que quieren atender.
6. Si se conserva `https://wa.link/malabareventos`, verificar si soporta textos personalizados; en caso de duda, usar `wa.me` con número validado.
7. Botón secundario "Copiar resumen" por si el navegador bloquea WhatsApp.

### Mensaje generado (ejemplo)

```text
Hola, equipo de MALABAR 👋
Quisiera solicitar una propuesta para organizar un evento.

🎉 TIPO DE EVENTO
Corporativo — presentación y encuentro de equipo
Empresa: Ejemplo S.A.

📅 FECHA Y ASISTENCIA
Fecha preferida: 14/11/2026
Fecha flexible: Sí
Personas: 70 aproximadamente
Horario: Tarde / noche
Espacios: Interior + exterior

✨ SERVICIOS QUE ME INTERESAN
• Recepción y gastronomía
• Barra de bebidas
• Sonido / micrófono
• Ambientación

🎨 ESTILO Y DETALLES
Estilo: Elegante y relajado
Presupuesto: Prefiero recibir opciones
Comentarios: Queremos hacer una presentación y luego un brindis.

👤 DATOS DE CONTACTO
Nombre: Ana Pérez
WhatsApp: +54 ...
Email: ana@example.com

¿Me podrían compartir opciones, disponibilidad y presupuesto? ¡Gracias!
```

### Función JS de referencia

```js
function crearLinkWhatsApp(numeroE164, mensaje) {
  const numero = String(numeroE164 ?? '').replace(/\D/g, '');
  if (!/^\d{10,15}$/.test(numero)) {
    throw new Error('Configurá el número real de WhatsApp de Malabar en formato internacional.');
  }
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

// Ejecutar desde un click, no automáticamente al cargar la página.
// El contacto ve el texto prellenado y lo envía manualmente desde WhatsApp.
```

## 6. Diseño responsive y microinteracciones

- Desktop: hero de alto impacto con imagen horizontal y gradiente oscuro; composición editorial de 2 columnas en contenido.
- Tablet y mobile: columnas apiladas, hero con recorte adaptado (NO simplemente aplastar el desktop), CTAs a ancho completo, formulario de una columna, targets táctiles >= 44px.
- Animaciones: hero sticky, narrativa fotográfica, galería horizontal, reveal editorial y transiciones del formulario. Respetar `prefers-reduced-motion` y touch; sin scroll hijacking.
- Menú sticky con cambio de fondo según scroll; no usar scrolljacking ni videos con audio automático.
- Testear contraste y lectura en fotos, navegación por teclado, labels de formularios y mensajes de error claros.
- Optimizar Core Web Vitals: usar WebP/AVIF y `srcset`, lazy load de galería, poster en videos, respetar tamaño de pantalla y evitar preload de todos los assets.

## 7. SEO y medición

**SEO title sugerido:** `Malabar Eventos | Salón para eventos sociales y corporativos en Tandil`  
**Meta description sugerida:** `Descubrí Malabar Eventos, un espacio único en Tandil para casamientos, celebraciones y eventos corporativos. Contanos tu idea y solicitá una propuesta personalizada.`

- H1 único con propuesta de valor. En H2 incluir categorías y frases naturales como "Eventos corporativos en Tandil".
- Datos estructurados `LocalBusiness` o `EventVenue` cuando se confirme dirección, contacto e información correcta.
- OpenGraph con foto exterior al atardecer y título legible.
- Eventos analíticos, sin datos personales en analytics: `cta_hero_click`, `event_type_select`, `form_start`, `form_step_complete`, `whatsapp_open`.
- Nota: `whatsapp_open` mide intención de contacto; no demuestra que se haya enviado el mensaje.

## 8. Mapa de assets incluidos

| Asset | Uso recomendado |
|---|---|
| `assets/01-exterior-atardecer.webp` | Hero desktop / OpenGraph |
| `assets/02-exterior-panorama.webp` | Sección espacio / ubicación |
| `assets/03-recepcion-corporativa.webp` | Eventos corporativos / social proof visual |
| `assets/04-barra-evento.webp` | Gastronomía y experiencia |
| `assets/05-gastronomia.webp` | Catering y personalización |
| `assets/06-ambientacion-lounge.webp` | El salón y los detalles |
| `assets/07-fachada-dia.webp` | Arquitectura y espacio |
| `assets/08-montaje-carpa-referencia.webp` | Solo referencia; validar derechos y terceros antes de publicar |
| `assets/video-exterior-carpa.mp4` | Galería de experiencias/montaje; vertical |
| `assets/video-evento-real.mp4` | Galería social/corporativa; video vertical |
| `assets/poster-video-exterior.webp` | Poster ligero del primer video |
| `assets/poster-video-evento.webp` | Poster ligero del segundo video |

Los archivos fotográficos fueron convertidos a WebP manteniendo encuadre y contenido. El video conserva sus propios créditos y debe publicarse sólo con autorización apropiada.

## 9. Datos pendientes de confirmar ANTES de lanzar

- Logo original editable SVG/AI y versiones autorizadas.
- Número **WhatsApp Business** real para `wa.me`.
- Dirección exacta, nombre oficial, contactos y horario de visitas.
- Capacidad mínima/máxima del salón, posibilidad de exterior y servicios realmente disponibles.
- Si el catering/barra es propio, tercerizado o a elección del cliente.
- Alquiler exclusivo, carpas, ambientación y proveedores habilitados (si aplica).
- Condiciones de disponibilidad, seña, cancelaciones y políticas de horario/ruido.
- Reseñas/testimonios verificables y autorización de imágenes de invitados.
- Si la web debe tener un calendario real de disponibilidad o **solo generar solicitudes**, como se propone acá.

## 10. Entregable esperado

Una landing premium completamente responsive, orientada a captar eventos sociales y corporativos. Debe tener una narrativa visual fuerte, aprovechar fotografías y videos reales y convertir la visita en una consulta estructurada por WhatsApp. La marca tiene que percibirse **elegante, cálida y deseable**, sin perder claridad ni velocidad de uso.

**Orden de prioridades de implementación:** (1) hero y navegación, (2) tipos de eventos, (3) cotizador WhatsApp, (4) galería/experiencia, (5) ubicación, SEO y refinamientos.
