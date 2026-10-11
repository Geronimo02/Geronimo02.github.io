# Cener Restó — Branding y dirección de landing

## Instrucción para el asistente de desarrollo

Implementar una landing responsive de Cener Restó siguiendo este documento y la imagen de referencia aprobada por el usuario. La referencia visual define composición, atmósfera y jerarquía; este documento define contenido, comportamiento y límites. Revisar primero el proyecto existente y reutilizar su stack, componentes y convenciones. No reconstruir el proyecto ni cambiar dependencias sin necesidad.

El objetivo es que la web transmita la experiencia física de Cener: gastronomía cuidada, salones azules, mobiliario antiguo, arañas de cristal, marcos dorados, murales y encuentros culturales. La cocina y la cultura deben tener presencia propia dentro de una misma casa.

La entrega es una landing implementada y navegable. No se requiere un panel de administración, pagos, carrito ni backend de reservas en esta etapa.

## 1. Concepto e identidad

**Concepto:** Una casa para los sentidos.

**Dirección:** Casa de arte, mesa de autor.

**Personalidad:** sofisticada, cálida, artística, histórica y cercana. El cuidado se expresa en fotografía, composición y detalles; evitar lenguaje pomposo y adjetivos de lujo repetidos.

**Arquitectura de marca:**
- Cener Restó: firma principal de la propuesta gastronómica y de esta landing.
- Cener House: la casa y su universo cultural; aparece como sello, en la historia y en el pie.
- Mantener las grafías CENER RESTÓ y Cener House. No sustituir todo por un único nombre.

## 2. Referencia visual aprobada

El usuario descargará el mockup generado y lo incorporará al proyecto. Renombrar una copia como `cener-landing-referencia.png` para facilitar su identificación. Es una referencia de diseño, no un fondo para toda la web.

Respetar estos rasgos del mockup:
1. Cabecera azul baja, firma a la izquierda y navegación con reserva a la derecha.
2. Hero fotográfico amplio del salón; titular grande a la izquierda y detalles del interior visibles a la derecha.
3. Bloque marfil de presentación, con texto a la izquierda y detalle del espejo a la derecha.
4. Bloque azul de cocina, fotografía a la izquierda y texto a la derecha.
5. Bloque marfil cultural, mural a la izquierda y texto a la derecha.
6. Tipografía clásica, márgenes generosos y ornamentos muy sutiles.

Construir todos los textos, botones y secciones con HTML real. No convertir el mockup en una imagen clicable. Para las fotografías finales usar archivos originales del establecimiento autorizados; los recortes de Instagram son referencias provisionales y las imágenes del mockup son interpretaciones generadas.

## 3. Paleta

| Token sugerido | Color | Función |
|---|---|---|
| `--color-blue` | `#26364B` | Cabecera, cocina y superficies oscuras |
| `--color-ivory` | `#F3E8D8` | Fondos claros y texto sobre azul |
| `--color-ink` | `#191A1C` | Texto sobre marfil |
| `--color-bronze` | `#AD8955` | Líneas, bordes y ornamentos |
| `--color-burgundy` | `#67343D` | Acentos puntuales de cultura |

Azul y marfil dominan. Bronce y borgoña son acentos. Evitar degradados brillantes, dorado metálico artificial, neón y fondos negros en toda la página. Verificar contraste real de texto, botones y estados de foco; el bronce no debe usarse automáticamente para textos pequeños. El botón principal puede tener fondo marfil y texto azul si el bronce no cumple contraste.

## 4. Tipografía y composición

- Títulos: Cormorant Garamond, pesos 400–500. Fallback: Georgia, serif.
- Texto funcional, navegación y cuerpo: Manrope, pesos 400–600. Fallback: Arial, sans-serif.
- Botones y pequeñas firmas pueden usar serif cuando acompañen el mockup sin perder legibilidad.
- Etiquetas de sección: mayúsculas pequeñas y espaciado moderado.
- Cargar solo los pesos utilizados; preferir fuentes locales si el proyecto las admite.

Orientación desktop: contenedor máximo de 1280–1440 px, márgenes fluidos y separaciones amplias. Hero de aproximadamente 75–90 svh sin obligar a ocultar sus acciones. Titular fluido de aproximadamente 64–100 px en escritorio y 40–56 px en móvil. Cuerpo de al menos 16 px y altura de línea de 1.5. Ajustar los valores para que la fotografía y el texto respiren sin desbordamientos.

Sin tarjetas SaaS genéricas, sombras voluminosas, bordes redondeados en todas las fotos o adornos acumulados. Usar fotografías rectangulares, líneas finas y una textura de papel muy ligera en el marfil. Las fotos de comida deben conservar color y textura naturales.

## 5. Logo y escudo

La referencia recibida es un afiche con el escudo de Cener House: árbol central, columnas, figuras aladas laterales, ornamentos entrelazados y cinta con el nombre.

Conservar esa identidad. Los ángeles de las esquinas, “Cena de 14 de Febrero” y “Curado por 21 Entorno” son elementos del afiche, no partes del logo. No incorporarlos automáticamente al identificador principal.

Usos:
- Header: firma tipográfica CENER RESTÓ, legible y de tamaño moderado.
- Presentación o footer: escudo completo como sello, con espacio alrededor.
- Favicon: futuro símbolo simplificado aprobado; no reducir el escudo completo a un tamaño ilegible.

La reconstrucción generada del escudo es una propuesta raster sobre transparencia, no el archivo oficial ni un SVG exacto. Preferir el original vectorial cuando esté disponible. No inventar una fecha de fundación, premios, lema o nuevos emblemas. No presentar un PNG renombrado como SVG. Usar CSS para la firma tipográfica mientras falte un archivo oficial utilizable.

## 6. Contenido y recorrido

### Cabecera

Firma: CENER RESTÓ.

Navegación: La casa · Cocina · Cultura · Visitanos.

Acción principal: Reservar mesa.

Anclas sugeridas: `#la-casa`, `#cocina`, `#cultura`, `#visitanos`.

### Hero

Fotografía real del salón azul, con araña, mesas y murales. Oscurecer de forma gradual la zona del texto; mantener visible la casa.

**H1:** Una casa para los sentidos.

**Bajada:** Cocina, arte y encuentros en Tandil.

**Acciones:** Reservar mesa · Explorar la casa.

**Firma pequeña:** CENER HOUSE · TANDIL.

El segundo botón lleva a `#la-casa`. Mantener un único H1 y no introducir texto adicional para llenar espacio.

### La casa

**Etiqueta:** LA CASA.

**H2:** Cada rincón invita a quedarse.

**Texto:** Una mesa, una obra, una conversación. En Cener, la cocina y la cultura comparten casa.

Fotografía de espejo, mural o detalle del salón. Sello ornamental pequeño y de baja intensidad. Evitar agregar una historia del edificio, del fundador o de su antigüedad sin información confirmada.

### Cocina

**Etiqueta:** COCINA.

**H2:** La cocina también es una forma de expresión.

**Texto:** Una propuesta para descubrir con todos los sentidos, en una casa que invita a compartir.

**Acción:** Ver la carta.

Usar fotografías originales de platos. La carta debe abrir una página, sección o archivo vigente y legible en móvil. No transcribir precios de una captura antigua ni inventar platos, ingredientes, restricciones dietarias o disponibilidad. Afirmaciones específicas sobre productores, estacionalidad o curaduría requieren confirmación del establecimiento antes de publicación.

### Cultura

**Etiqueta:** CULTURA.

**H2:** La casa está viva.

**Texto:** Arte, música y encuentros que hacen de cada visita una experiencia distinta.

Usar fotografía de un mural o de un encuentro real. Cuando haya eventos confirmados, incorporar agenda con nombre, disciplina, fecha, hora y acción correspondiente. No inventar artistas, fechas, entradas ni cupos.

Si no hay agenda cargada, mostrar “Conocé los próximos encuentros en Instagram” con enlace al perfil facilitado por el usuario. No incluir un botón “Explorar cultura” que no lleve a contenido útil.

La agenda puede tener composiciones más expresivas y afiches propios, manteniendo la paleta y la claridad. El hip hop y las expresiones urbanas pertenecen al contenido real de los encuentros; no aplicarlos como decoración genérica de toda la web.

### Galería

Recorrido breve opcional con fotos reales: salón, detalle, plato y encuentro. Evitar duplicar todas las imágenes de las secciones anteriores. Usar una cuadrícula editorial simple, sin carrusel automático. Si hay ampliación, permitir cerrarla con teclado y devolver el foco al elemento de origen.

### Visitanos y footer

**H2:** Te esperamos en Cener.

Dirección de referencia aportada en el enlace: 14 de Julio 467, Tandil, Buenos Aires. Confirmar antes de publicar.

Mostrar horarios y contacto únicamente cuando se hayan validado. Ofrecer enlace a Google Maps y reserva. Preferir un enlace a Maps sobre un iframe pesado que se cargue al abrir la página.

Footer con Cener Restó / Cener House, Instagram, ubicación y reserva. No usar reseñas ficticias, puntuaciones desactualizadas ni logos de medios sin respaldo.

## 7. Enlaces y reservas

Instagram aportado: https://www.instagram.com/cener.resto/

Ubicación aportada: https://www.google.com/maps/place/Cener+House/@-37.3295131,-59.1394904,56m/data=!3m1!1e3!4m15!1m8!3m7!1s0x95911f99c31b8ce9:0xbf803df31b459b7a!2s14+de+Julio+467,+B7000+Tandil,+Provincia+de+Buenos+Aires!3b1!8m2!3d-37.3295602!4d-59.139425!16s%2Fg%2F11rg5ync2m!3m5!1s0x95911ff2c62d1079:0x955360f76bca0bde!8m2!3d-37.3295235!4d-59.1394574!16s%2Fg%2F11v67pk130

El canal de reservas está pendiente de confirmación. No utilizar un teléfono obtenido de una referencia antigua sin validarlo. Centralizar la URL de reserva en la configuración del proyecto.

Para la demo, mientras falte el canal, los botones de reserva llevan a `#visitanos`, donde se explica que las consultas pueden hacerse desde el perfil de Instagram. Si se configura WhatsApp, abrir el contacto con mensaje breve y codificado correctamente: “Hola, quisiera consultar disponibilidad para reservar una mesa en Cener Restó.” No afirmar que la mesa está confirmada por abrir WhatsApp.

## 8. Assets y nombres sugeridos

El usuario incorporará los archivos descargados. Usar estas convenciones para copias destinadas al proyecto:

| Archivo sugerido | Contenido | Estado |
|---|---|---|
| `cener-landing-referencia.png` | Mockup aprobado | Referencia, no asset de fondo |
| `cener-salon-hero.webp` | Salón azul original | A aportar en buena resolución |
| `cener-detalle-espejo.webp` | Espejo y mural | A aportar |
| `cener-cocina-01.webp` | Plato original | A aportar |
| `cener-cocina-02.webp` | Segundo plato original | A aportar |
| `cener-cultura.webp` | Mural o encuentro | A aportar |
| `cener-house-escudo.png` | Reconstrucción transparente | Propuesta; sustituir por original si se obtiene |

Estos nombres son convenciones propuestas, no archivos que este documento haya creado. Adaptar rutas al framework existente. No dejar imágenes rotas si falta un recurso; explicar el faltante al desarrollador y usar las referencias disponibles de forma provisional en la demo.

## 9. Responsive, interacción y accesibilidad

- Desktop: conservar las composiciones alternadas de la referencia.
- Mobile: una columna, texto y acciones en orden lógico; recortar cada fotografía según su sujeto. No achicar toda la versión desktop.
- Menú móvil accesible con botón, estado expandido, cierre con Escape y manejo de foco si usa un panel modal.
- Reserva fija inferior solo en móvil, sin tapar contenido y respetando el área segura del dispositivo.
- Botones de al menos 44 px de alto, foco visible y enlaces descriptivos.
- No introducir scroll horizontal a 320 px de ancho.
- Encabezado fijo, si se usa, no debe ocultar títulos al navegar por anclas.
- Animaciones discretas de opacidad y desplazamiento de 250–500 ms. Respetar `prefers-reduced-motion`.
- Nada de música automática, scroll secuestrado, parallax obligatorio o video pesado de apertura.
- Texto alternativo descriptivo para fotos; ornamentos decorativos sin lectura redundante.

## 10. Rendimiento, SEO y revisión

Optimizar fotografías, generar tamaños responsive y definir dimensiones para evitar saltos de layout. Cargar con prioridad la imagen hero y diferir imágenes posteriores. Usar WebP/AVIF según soporte del proyecto. Mantener el contenido principal disponible sin depender de animaciones.

Título sugerido: Cener Restó | Cocina, arte y encuentros en Tandil.

Descripción sugerida: Descubrí Cener Restó, una casa donde la cocina, el arte y los encuentros comparten lugar en Tandil. Conocé la propuesta y consultá por tu reserva.

Usar imagen social real autorizada. Datos estructurados de restaurante solo con información confirmada; no incluir puntuaciones, precios ni horarios inventados.

Antes de entregar: revisar escritorio y móvil, botones de reserva y carta, anclas, navegación con teclado, contraste, recortes, ausencia de textos desbordados y archivos faltantes. Ejecutar build y los controles ya existentes que correspondan. Comparar visualmente el resultado con el mockup aprobado.

## 11. Información pendiente para publicar

- Canal oficial y enlace de reservas.
- Horarios actuales.
- Carta vigente y formato de consulta.
- Archivo oficial de logo y escudo, si existe.
- Fotografías originales autorizadas.
- Eventos activos, fechas y condiciones de acceso.
- Confirmación del texto de cocina, curaduría y dirección.

Los faltantes no impiden preparar la demo visual; deben impedir presentar datos inventados como oficiales. Conservar el diseño aprobado y documentar qué debe completarse antes de publicación.
