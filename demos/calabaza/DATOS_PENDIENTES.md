# Calabaza — datos pendientes para publicar

La demo local presenta Belgrano y Centro, usa fotos reales del directorio `img/`, copias comprimidas en `img/optimized/` y una carta de muestra. El visitante elige el local en el ticket; el pedido abre su WhatsApp con una **consulta de muestra** precargada, que la persona envía desde WhatsApp. **No publicar esta versión como carta operativa** hasta validar los puntos siguientes con el restaurante.

## Sucursales y contacto

- Belgrano: Belgrano 1301, WhatsApp `2494 250786` (`5492494250786` en el enlace), lunes a sábados de 10:00 a 00:00. La dirección y el número coinciden con [Turismo Tandil](https://www.tandil.tur.ar/gastronomia-calabaza-belgrano-23); el horario lo facilitó el usuario.
- Centro: Mitre 587, WhatsApp `2494 515627` (`5492494515627` en el enlace), lunes a sábados de 10:00 a 16:00 y de 19:00 a 00:00. Estos datos los facilitó el usuario y reemplazan la duda anterior sobre la numeración.
- Confirmar los pines precisos de Google Maps de ambas sucursales. Hoy los botones hacen una búsqueda por nombre y dirección.
- Si reciben reservas y cómo se confirman.
- Ambos locales informan restaurante, delivery y take away. Confirmar tarifas, zonas, tiempos y condiciones de cada modalidad. Faltan los enlaces directos a sus perfiles de PedidosYa.

## Contenido

- Carta actual de cada sucursal: categorías, platos, descripciones, precios, disponibilidad y restricciones alimentarias verificadas. Confirmar si comparten exactamente la misma carta.
- Platos destacados con fotografías que correspondan a cada producto y fotos del local Belgrano. Las fotos actuales del local son de Centro y se identifican como tales.
- Si cada local ofrece viandas: menú con fechas, precios, disponibilidad, límite horario, entrega y condiciones de packs.
- Texto de historia y relación de Emilio Juan Pardo con el local, aprobado por el equipo.
- Tapa oficial de *Cocinero de Tandil* para reemplazar la presentación tipográfica provisional.
- Autorización de uso de fotografías del local y del equipo.
- Reseñas verificadas, si se desea incluirlas.

## Dónde actualizar

- `config.js`: sucursales, números de WhatsApp, modalidades, categorías, productos y viandas.
- `index.html`: portada, relato, bloque del libro, locales y contacto.
- `carta.html`: textos de la carta y formulario de revisión.
- `menu.js`: arma el mensaje con sucursal, productos, cantidades, observaciones, nombre, modalidad y dirección cuando corresponde; abre el WhatsApp del local seleccionado. La confirmación del pedido ocurre en la conversación con el restaurante.

El carrito guarda ID, cantidad y observación en `localStorage`. Al cargar, descarta productos eliminados o agotados y recalcula siempre con el precio vigente de `config.js`. En móvil y tableta, el botón fijo con el subtotal abre el ticket como panel superpuesto: los productos se desplazan dentro del panel y el subtotal y la acción para completar el pedido permanecen visibles. Nombre, modalidad, dirección y observaciones se completan en un segundo paso dentro del mismo ticket, con la acción de WhatsApp siempre visible.

La sección semanal visible es **solo una muestra compartida**. El visitante ve cinco platos ya cargados y puede marcar la semana entera con un toque; no elige entre toda la carta cada día. Esa marca no se guarda, no se mezcla con el carrito y no genera un pedido. El precio mostrado es la suma orientativa de los cinco días, **no** un pack confirmado.

Para que Calabaza cargue la semana, editar `viandas.weekMenu` en `config.js`: un objeto por día con `day`, `dish`, `detail` y `price`. Completar `viandas.weekStart` con el lunes en formato `AAAA-MM-DD` para mostrar las fechas. Confirmar servicio, disponibilidad, modalidades, fecha límite y condiciones de **cada sucursal** antes de poner `viandas.enabled` en `true` y quitar `demoPreview`; si sus menús difieren, separar los datos por local. `packEnabled` sigue en `false` hasta que el negocio confirme un pack. Esta fase no incluye un panel de administración: la carga se hace en la configuración del sitio.

La ruleta toma hasta ocho productos de `products` con `available: true` y `roulette: true`. `wheelLabel` define el nombre breve de cada porción de la rueda. No da descuentos ni premios; los agotados dejan de participar. Al aprobar la carta, elegir los platos participantes y reemplazar productos e imágenes juntos.

## Inventario usado

| Archivo | Uso |
| --- | --- |
| `img/logo.jpg` | Logo original de Centro, conservado sin usar en la landing general |
| `img/Logotipo circular de Calabaza Centro.png` | Logo circular de Centro, conservado para aplicaciones de esa sucursal |
| `img/optimized/logo-circular.png` | Copia liviana del logo circular de Centro, disponible para una página propia de la sucursal |
| `img/optimized/favicon.svg` | Monograma simplificado para pestañas pequeñas |
| `img/Calabaza chef minimalista y amable.png` | Carrito vacío |
| `img/Hoja de sprites del chef calabaza.png` | Sugerencia de la cocina |
| `img/Hoja de sprites del chef calabaza 2 .png` | Aviso en carta |
| `img/SaveInta.com_654139747_17978513588994039_5218750582585030478_n.jpg` | Portada |
| `img/SaveInta.com_663244737_18336632332174591_8573944528832571278_n.jpg` | Cocina |
| `img/SaveInta.com_655193720_17959566845924768_508236729214283005_n.jpg` | Equipo de Centro |
| `img/SaveInta.com_467432103_18126148513391254_3725899172489631315_n.jpg` | Fachada |
| `img/SaveInta.com_652767351_17967018510040017_7976712248620947283_n.jpg` | Salón |
| `img/SaveInta.com_655253765_18115419730656595_621985521149323897_n.jpg` | Vereda |
| `img/SaveInta.com_467324534_18126148489391254_8069213003687011207_n.jpg` | Entrada |

La carta usa seis fotos de Unsplash para ilustrar productos **de muestra**. No son fotografías de platos confirmados de Calabaza: cada tarjeta lo indica y sus descripciones y precios siguen pendientes de aprobación. Reemplazar cada foto y producto de forma conjunta cuando llegue la carta validada de cada sucursal.

| Archivo ilustrativo | Foto original / autor |
| --- | --- |
| `img/optimized/tarta-espinaca.jpg` | [Quiche · Sergio Arze](https://unsplash.com/photos/plate-of-dessert-oeTdlanecpY) |
| `img/optimized/tarta-porción.jpg` | [Porción de quiche · Diego Arenas de Rodrigo](https://unsplash.com/photos/slice-of-quiche-with-a-side-salad-qr-8HqqjqGQ) |
| `img/optimized/pasta-verde.jpg` | [Pasta · Eaters Collective](https://unsplash.com/photos/pasta-dish-on-white-plate-ddZYOtZUnBk) |
| `img/optimized/ravioles.jpg` | [Ravioles · charlesdeluvio](https://unsplash.com/photos/plate-of-ravioli-on-a-marble-table-hQckRlItq4c) |
| `img/optimized/brownies.jpg` | [Brownies · pariwat pannium](https://unsplash.com/photos/a-plate-of-brownies-sitting-on-top-of-a-table-ow8CAjVzjwQ) |
| `img/optimized/flan.jpg` | [Flan · Kamara Rahmat](https://unsplash.com/photos/sweet-flan-dessert-with-caramel-sauce-and-a-spoon-gynfA2P1dis) |

Los archivos originales aportados por el restaurante se conservan intactos. Sus copias JPG se recomprimieron a calidad 82 y la mascota se redimensionó a 160 px. El favicon utiliza un monograma simplificado.
