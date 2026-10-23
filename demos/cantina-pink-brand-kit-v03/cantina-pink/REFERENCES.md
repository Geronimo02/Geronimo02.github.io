# REFERENCES — Cantina Pink

Relevadas el 2026-10-23 desde https://www.framer.com/marketplace/templates/categories/restaurants/ (24 plantillas). Se abrieron con navegador real a 1440 y 390 px; capturas en `qa/referencias-framer/`. Son plantillas de terceros: sirven para entender método, **no se copia diseño, código, fotos ni textos**.

Elegidas por afinidad con una cantina casual y contundente (pizza, pasta, comida abundante). El resto de la lista (Aveline Dining, Luxdin, VALORE, Private Chef, YUGURE, Santo Mare, cocteles, cafés) es fine dining u otro rubro: descartadas.

| Plantilla | Vista previa | Qué hace bien | Qué NO copiar |
|---|---|---|---|
| **Slice Town** (Webestica, gratis) | https://slice-town-wbs.framer.website/ | Tono casual y ruidoso: botones tipo sticker con borde grueso y sombra dura, texto gigante fantasma detrás del plato, cinta de promos que corre, menú en tabla con dos tamaños, notas adhesivas como reseñas. Muestra que el humor visual funciona en comida popular. | Naranja saturado, foto recortada con mano, formulario de reserva (no hay sistema de reservas), promos inventadas. |
| **Smashhouse** (Gazi Efe, $59) | https://smashhouse1.framer.website/ | Un solo protagonista por pantalla con índice de capítulos y "scroll to dig in"; estado abierto/cerrado en vivo; mapas de calle dibujados en vez de iframe. Valida lo que ya hicimos (mapa dibujado + estado de horario) y la idea del plato que se arma con el scroll. | Modelos 3D (peso y costo incompatibles con celulares modestos y con Lighthouse 90+), fondo degradado oscuro. |
| **Pastora** (Framebite, gratis) | https://pastora.framer.wiki/ | Estructura clásica de restaurante (historia, menú, favoritos, reseñas, reservar). | Es el ejemplo de lo que evitamos: fotos de stock, serif fino "elegante", puntaje de OpenTable y reservas. Serviría a cualquier bodegón. |

## Conclusiones aplicadas
1. **Cinta que corre con hechos de la casa** (de Slice Town): se agregó entre el hero y las especialidades, con texto solo de lo confirmado. Pausa al pasar el mouse y queda estática con movimiento reducido.
2. **Estado abierto/cerrado y mapa dibujado** (Smashhouse): ya estaban; la referencia los confirma.
3. **Un protagonista por escena** (Smashhouse): ya lo hace "poner la mesa", con índice 01/02/03.

## Propuestas, sin aplicar (a decidir)
- Botones con borde grueso y **sombra dura** estilo sticker. Encaja con el humor del feed y con la regla de "una sola sombra", pero cambia el carácter de todos los CTA.
- **Texto gigante fantasma** detrás del plato del hero ("PASTA LIBRE"). Cuidado con el contraste y con el recorte en celular.
- Reseñas como **notas adhesivas**, solo si hay reseñas reales con nombre y fecha; hoy no hay, así que no se hace.

## Fuera de alcance
Reservas con formulario, reviews de terceros, 3D. Ninguna está confirmada para Cantina Pink (ver BRAND.md, matriz de funciones).
