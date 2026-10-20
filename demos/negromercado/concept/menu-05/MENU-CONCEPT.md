# Carta 05 · Un rato en Negro

El usuario acepta el híbrido 04 y la propuesta de carta: selección breve en portada, cuatro categorías (cafecito, pastelería, para comer, vermú), filas legibles con precio a la derecha y carta completa dentro del sitio. «dale mandamos esa» autoriza materializar esta exploración. No autoriza publicar ni confirma vigencia comercial de precios.

## Entregables y funcionamiento previsto

`index.html` es una maqueta HTML autocontenida de la sección carta, no una implementación completa del híbrido 04. Se genera con `python concept/menu-05/build.py` desde la raíz del proyecto. `template.html` y `menu.js` son las fuentes editables. No sustituye C-v3 ni modifica la web publicada.

- Selección inicial de tres cafés, tabs con navegación de teclado, ARIA y alternativa de movimiento reducido.
- «Ver toda la carta» abre un diálogo nativo con cierre visible, Escape, foco modal y regreso al botón inicial.
- Carta completa: los 65 registros de content/menu.json, agrupados en cuatro categorías y subgrupos. El té, bebidas frías y agregados están bajo cafecito; desayunos y brunch bajo para comer. Nada se excluye de la búsqueda.
- Búsqueda por nombre/descripción, independiente de categoría, sin distinción de acentos; estado sin resultados.
- Encabezado/categorías pegados al borde superior de la carta completa. En móvil ocupa pantalla completa; la fotografía se reduce y los productos mantienen prioridad.
- Entrada de taza 800ms y transición de selección 200ms, sin movimiento continuo ni scroll obligatorio. Son decisiones propias, no timings medidos de referencias.

## Fidelidad al contenido

Se utiliza la transcripción oficial relevada el 19/10/2026. Precios en ARS con aviso visible de validación pendiente. Para variantes de columnas ambiguas no se inventan tamaños: la fila dice «Consultar variantes» y, dentro de la carta completa, un desplegable muestra importes originales con su columna y explicación. Null no se transforma en cero. Los precios de variantes inequívocas aparecen directamente. No hay stock confirmado, pedidos, checkout ni reservas.

Símbolo JPEG original intacto. Nombre tipográfico propuesto con Bricolage Grotesque; no es el wordmark definitivo del tablero. Taza generada existente = REPRESENTACION; rotulada imagen ilustrativa. Licencias de fuentes y procedencia en concept/assets/.

## Referencias aplicadas

Continúa la selección inspeccionada en hybrid-04/HYBRID-CONCEPT.md: Never Coffee aporta calma y espacio alrededor del producto; Goodboybob aporta protagonismo fotográfico del café; Escape aporta escala del titular. No se descargan fotos ni código de esas webs. La adaptación de tabs accesibles ya explorada en C se implementa aquí con JS nativo, sin copiar un paquete.

## Verificación y límites

Sintaxis de JS, JSON, 65 IDs únicos, ausencia de tokens de plantilla e imágenes embebidas decodificables comprobadas. Ver checks.json. No hay captura real de navegador ni QA visual/interactivo ejecutado en esta revisión. No confundir la vista generada `menu-boceto.webp` con captura del HTML: presenta la dirección y selecciona pastelería para explicar precios; el HTML abre cafecito y la carta completa contiene todos los datos, no solo las filas de la imagen.
