# Auditoría visual — Ferea Café

Referencia primaria: https://fereacafe.framer.website/  
Inspección visual realizada el 23/10/2026 mediante navegador Edge con capturas de escritorio y móvil. El enlace editable de Framer no se usó como fuente de diseño.

## Verificado

| Área | Observación |
| --- | --- |
| Header desktop | Franja crema, navegación a la izquierda, marca centrada y CTA tipo píldora a la derecha. Regla punteada inferior. En 1440 px, header de aproximadamente 87 px. |
| Hero desktop | Fondo crema, titular marrón `FRESHLY` a la izquierda, `BREWED` blanco sobre bloque tostado inclinado, foto de vaso/derrame/café en el lado derecho. Texto y CTA debajo del titular. Alto visual cercano al primer viewport. |
| Hero móvil | Logo a la izquierda e icono de menú a la derecha. Titular reducido a `FRESHLY` y banda `BREWED`; texto y CTA debajo. La foto principal no aparece en la captura móvil de 390 px. La sección siguiente entra cerca del borde inferior del viewport. |
| Tipografía | Titulares grandes: `Fira Sans Extra Condensed`, peso 900. Navegación, botones y cuerpo: `Akshar`. Estilos computados del hero desktop: `FRESHLY` 200 px/180 px, `BREWED` 120 px/108 px. |
| Colores de referencia | Crema cercano a `#F3EFEA`; marrón de títulos `#7E4124`; tostado de bandas y escenas cercano a `#AC6D36`; gris arena `#E7DFD3`. Son muestras inspeccionadas, no guía oficial. |
| Home | Tras el hero: escena tostada redondeada con título centrado, foto grande y texto; carta destacada en carrusel; escena arena de oficio; franja tipográfica; local; escena editorial; oferta; testimonios; blog; FAQ; CTA y footer. |
| Carta | Hero tipográfico con segunda línea inclinada. Columna lateral redondeada de categorías y contenido en dos columnas con nombres, tamaños, precios y enlaces. En 1440 px, el bloque de categorías comienza alrededor de 660 px desde arriba. |
| About | Hero tipográfico, historia cronológica, atributos, números y equipo. La adaptación de Negro Mercado toma su lenguaje editorial, pero omite fechas, métricas y equipo no proporcionados. |
| Footer | CTA grande antes de un pie con marca, enlaces, dirección y horarios. |

## Interacciones

- **VERIFICADO:** el carrusel de carta de home expone controles de paginación; el FAQ usa paneles expandibles en su estructura accesible.
- **VERIFICADO:** en móvil el header pasa a logo + icono; el hero reordena y oculta la fotografía principal. El menú abre un panel claro bajo el header y el icono se convierte en una X.
- **VERIFICADO:** los títulos entran con opacidad y desplazamiento cercano a 50 px; algunos elementos decorativos cambian levemente de posición al hacer scroll. Los controles de carta y los estados del FAQ están presentes.
- **INFERIDO:** hovers de enlaces y botones incluyen movimiento/desplazamiento de texto; el DOM contiene textos duplicados, pero no se pudo medir la transición con precisión.
- **NO VERIFICADO:** curva exacta de animaciones, sticky header y transición entre páginas. No se incorporaron como hechos confirmados.
- **PROPUESTO para Negro Mercado:** acceso al carrito, selector de variante, leche vegetal en cafés compatibles, búsqueda de carta y revisión antes de WhatsApp.

## Límites

Se guardaron capturas de página completa de la home de referencia en escritorio y móvil, además de vistas clave, en `qa/`. La inspección de otros estados no permite afirmar una reproducción exacta de cada transición. No se usaron fotos, logo ni textos de Ferea en el resultado.
