# Auditoría de movimiento

Referencia: https://fereacafe.framer.website/. Inspección con Edge y Playwright el 23/10/2026, sin modo de movimiento reducido.

Revisión adicional: dos grabaciones de pantalla aportadas por el usuario el 24/10/2026, con el recorrido de home y carta.

## Verificado en la referencia

- El hero entra con opacidad de 0 a 1 y desplazamiento horizontal de aproximadamente 50 px. Una de sus animaciones observadas dura 1050 ms.
- Los titulares de las secciones entran al viewport desde unos 50 px más abajo, aumentando la opacidad hasta 1. En la sección inicial y la carta destacada se observó una transición cercana a 650–750 ms.
- Algunos elementos decorativos cambian suavemente de posición al hacer scroll.
- La carta destacada muestra controles de paginación y el FAQ tiene estados abiertos y cerrados.
- El DOM de enlaces incluye texto duplicado para un efecto de desplazamiento en hover; su duración exacta no se pudo medir.
- La escena “Made with care” fija las tarjetas durante aproximadamente 2.500 px de scroll. Las tarjetas se trasladan horizontalmente y cambian de escala (se observó una reducción cercana a `0.8`) hasta que aparece la siguiente.
- En móvil, el icono de menú pasa a una X y abre un panel claro bajo el header; el contenido de la página sigue visible debajo.
- En la escena de testimonios, tarjetas laterales se desplazan horizontalmente y tienen una ligera rotación.
- Las grabaciones muestran granos aislados alrededor de las bebidas y una carta de dos columnas con categorías visibles mientras se recorren los productos.

## Adaptación implementada

- Entrada escalonada de titular, banda, texto y foto del hero, con traslación y opacidad.
- El vaso del hero entra completo en los anchos comprobados. Cinco granos independientes flotan alrededor; se reutilizan en historia y “Cada taza”.
- Aparición de secciones y tarjetas al entrar en pantalla mediante `IntersectionObserver` y CSS.
- Recortes de producto en hero, historia y escena “Cada taza”, con desplazamiento leve actualizado con `requestAnimationFrame` durante el scroll.
- Carrusel horizontal de productos ilustrativos con controles, paginación, scroll suave y ajuste a tarjeta.
- Secuencia de tres tarjetas fija durante el scroll de la sección de oficio; la posición, escala y opacidad cambian según el progreso del scroll nativo.
- La carta conserva una barra de categorías fija en escritorio y móvil. Las categorías desplazan hacia cada bloque y los productos aparecen al entrar en pantalla.
- Tarjetas laterales editoriales que entran en la escena verde central. No se inventaron citas de clientes.
- Franja tipográfica continua, etiquetas deslizantes en botones, panel móvil claro, carrito y FAQ animados.
- `prefers-reduced-motion: reduce` elimina los movimientos y mantiene todo el contenido visible.

Las distancias y duraciones se aproximan a lo observado; no se afirma equivalencia exacta con las curvas o secuencias internas de Framer.
