# QA visual y funcional

Fecha: 23/10/2026.

## Comparación

| Punto | Resultado |
| --- | --- |
| Hero desktop | Conserva fondo crema, gran titular condensado a la izquierda, banda inclinada y producto recortado a la derecha. El vaso, líquido y granos son una ilustración transparente provisional. |
| Hero mobile | Conserva titular, banda, texto y CTA sin fotografía principal, igual que el estado móvil observado. |
| Carta desktop | Hero tipográfico, categorías laterales y productos en dos columnas. El buscador y carrito son extensiones funcionales. |
| Carta mobile | Categorías horizontales, una columna de productos, carrito en el header. |
| Secciones posteriores | Se restituyeron las escenas de catálogo con recortes, oficio con tarjetas fijas y escaladas por scroll, galería de tres imágenes, “Cada taza”, propuesta de acompañamiento, bloque editorial central, tarjetas de novedades y CTA fotográfico. El contenido se adaptó sin promociones, reseñas ni publicaciones inventadas. |

## Pruebas realizadas

- `npm run build`: pasó sin errores TypeScript ni Vite.
- Navegación visual en Edge: home y carta en desktop y móvil.
- Anchos solicitados 320, 375, 390, 768, 1024, 1280 y 1440: `scrollWidth <= innerWidth` en todos.
- Carrito: agregar, aumentar cantidad, subtotal, revisión y persistencia tras recarga verificados.
- Leche de avena: personalización de latte y subtotal verificados.
- Menú móvil: apertura y enlaces visibles verificados.
- Consola del navegador: sin errores ni advertencias durante la comprobación.
- Nueva paleta y movimiento: comprobados en 320, 390, 768, 1024 y 1440 px sin desbordamiento horizontal ni errores; apariciones tras scroll y carrusel operativos. En modo de movimiento reducido, las secciones permanecen visibles.
- Reconstrucción de alta fidelidad: comprobados 320, 375, 390, 768, 1024, 1280 y 1440 px. La escena fija de oficio permanece en el viewport a mitad del recorrido; hay tarjetas visibles y sin errores de consola. Se verificaron panel móvil, controles del carrusel, carrito, FAQ y ruta `/productos/`.

## Pendientes y límites

- No se envió un pedido real por WhatsApp durante QA. El sitio abre un mensaje prearmado y comunica que la aceptación depende del local.
- Se guardaron capturas full page de la home de Ferea en escritorio y móvil, además de los hero y páginas clave, en `qa/`.
- No hay fotografías propias para cotejar recortes equivalentes. Las fotos actuales están etiquetadas como ilustrativas.
- El menú cargado cubre solamente la página de carta aportada. Faltan pastelería, laminados y salados, además de disponibilidad y confirmación final de precios.
- La tienda `/productos/` permanece sin artículos publicados hasta recibir productos, stock y condiciones comerciales confirmados.
