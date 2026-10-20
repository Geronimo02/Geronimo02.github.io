# Un rato en Negro · híbrido 04

El usuario acepta la exploración de branding («siiiiiii, esto va») y pide combinarla con referencias web de cafeterías: animada y sofisticada, un punto medio. La aceptación se refiere al lenguaje del tablero, no a un logo final vectorizado ni publicación.

## Resultado de esta revisión

web-boceto.webp es un **boceto generado** de tres escenas consecutivas en escritorio. No es captura del HTML ni prueba de animación. El prototipo funcional existente sigue en directions/c/index.html (C-v3); todavía no se convirtió este nuevo boceto a código.

### 1. Un rato en Negro

Cabecera crema con nombre propuesto, navegación legible y CTA. Título expresivo verde y un gesto manuscrito azul. Primer plano de café vertiéndose como imagen protagonista; croissant recortado y sello de marca como acentos. Franja ajedrezada corta que conecta con el nuevo sistema gráfico. No llenar todo el fondo de patrones.

### 2. Qué te tienta

La carta baja la intensidad: fondo crema, taza grande a la izquierda, categorías y filas limpias a la derecha, sin precios no validados. El latte art y la cerámica aportan deseo; la jerarquía y el espacio aportan sofisticación. La taza ilustrativa existente sirve para la prueba; la fotografía final del producto del local está pendiente de permiso/original.

### 3. El día sigue, el vermú también

Escena verde, luz más baja, vaso protagonista y menos estímulos. Hace visible la vermutería que figura en la bio oficial, en lugar de presentar a Negro solamente como tienda de café. La copa del boceto es ilustrativa; no se deduce marca, receta ni servicio exacto.

## Referencias realmente abiertas

| Referencia | Observación directa desktop | Qué se toma |
|---|---|---|
| [Goodboybob](https://goodboybob.com/) | Hero con video macro de café/leche, cabecera mínima y CTA discreto; recorrido a escena tripartita de arte/fotografía. Se inspeccionaron video DOM y screenshots; uno de sus videos había avanzado a 37 s. | Sensación táctil del café y producción visual con protagonismo. No se afirmó que su video estuviera vinculado al scroll. |
| [Never Coffee](https://nevercoffeelab.com/) | Fondo claro, cabecera contenida, gran fotografía de mesa y fila de productos con alternancia de bolsa/bebida, bordes suaves y espacio. | La marca puede ser colorida mientras la interfaz mantiene calma. No se adopta su arcoíris ni se afirmó una animación de scroll no observada. |
| [Escape](https://escape.cafe/en-us) | Titular de escala muy grande, navegación lateral, escenas fotográficas superpuestas y cambios de escala/encuadre durante el recorrido. Se pulsó Menu y se confirmó estado expandido y sus enlaces en DOM. | Ritmo editorial y escala tipográfica. No se copia su navegación lateral ni se afirma duración/easing medidos. |
| [Café Pista](https://cafepista.com/en) | Hero de packaging fotográfico con titular serif sobre imagen y CTA pequeño. | Referencia secundaria de continuidad packaging/web; no define la composición principal. |
| [Wogan](https://wogancoffee.com/) | Marca ampliada en portada, packaging, verde, grillas comerciales y separación ondulada hacia fotografía. | Referencia secundaria para aplicar un símbolo a varias escalas. No se utiliza su personaje, verde ni formato de tienda. |

Inspección realizada en escritorio. Mobile de estas referencias **no verificado** en esta revisión. Son fuentes de inspiración; no se descargaron ni redistribuyeron sus fotos/videos, ni se compró o copió código. Los screenshots vistos en el navegador no se empaquetan como assets del sitio.

## Dirección de movimiento propuesta, todavía sin implementar

Una acción protagonista por momento, acompañada por microinteracciones contenidas.

1. Café: clip macro corto, sin audio, visible solamente cuando corresponde; imagen estática equivalente para movimiento reducido. No descargar el video de Goodboybob: hace falta clip propio autorizado o una representación nueva rotulada.
2. Croissant: conservar el gesto del prototipo C, con recorrido corto y separación contenida. Coordinarlo con la pausa del clip de café para que no compitan dos focos de movimiento. Evitar convertir la portada en varios metros de scroll obligatorio.
3. Carta: entrada única de taza de 650–850ms y cambio de categoría de 180–230ms. Lectura y controles siempre disponibles sin completar animación.
4. Vermú: escena más quieta, transición suave de foto y texto. Ningún giro continuo de objetos ni cursor personalizado obligatorio.

Estas duraciones son decisiones propias propuestas, no mediciones de las referencias. El boceto no demuestra FPS, responsive ni funcionamiento. No cerrar G2/G3 con esta imagen.

## Marca y medios

Se conserva la paleta muestreada F5F2EB/111111/1B3A2B/506C9B y se combina con la evolución gráfica que gustó al usuario. El wordmark del render es boceto, no master. El símbolo de los renders puede variar: conservar el JPEG original para la implementación hasta tener master autorizado.

Todo el material gastronómico del boceto es REPRESENTACION generada. No muestra el interior del local ni vajilla, servicio o productos exactos. Los rótulos no deben desaparecer al convertir a HTML. Copy propuesto, no slogans oficiales. No hay precios ni promociones inventadas.

Procedencia del boceto: generación integrada con referencias propias del tablero de marca, taza y croissant. Original generado: generated_images/exec-eaf844c4-0162-4382-bef2-403c823749c9.png; copia WebP calidad 88 en esta carpeta. Prompt: página desktop vertical de tres escenas, branding propio crema/verde/azul/negro, hero macro café + tipo expresiva, carta tranquila con taza y tabs, vermú verde; balance entre alegría y sofisticación; todo rotulado como exploración ilustrativa.

## Siguiente paso

Revisar con el usuario la combinación visible; trasladar la dirección a una nueva revisión funcional preservando identidad y obteniendo evidencia real de render cuando el navegador lo permita. Esta revisión no publica ni sustituye la web vigente.
