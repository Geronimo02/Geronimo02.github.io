# Sushi Fan Tandil — Branding y brief para VS Code

## Objetivo

Adaptar la demo de Kazoku a Sushi Fan Tandil conservando los recursos de composición que funcionen y reemplazando toda la identidad y contenido de la marca anterior. Crear una web que presente el restó y permita elegir productos en una carta, armar un carrito y enviar el pedido completo por WhatsApp.

Este documento guía la implementación en VS Code. El trabajo solicitado en esta etapa es el brief; no realizar cambios adicionales en GitHub ni publicar automáticamente.

## Concepto de marca

Sushi Fan combina sushi, encuentros y una experiencia gastronómica cercana. Comunicar calidad, apetito y calidez: una marca para una salida al restó y para disfrutar una tablita en casa.

Personalidad: moderna, cálida, cuidada y con un toque divertido. Mantener la fotografía gastronómica como protagonista y la mascota como apoyo.

## Identidad visual

Paleta propuesta, inspirada en la identidad existente:

| Uso | Color |
|---|---|
| Fondo principal | `#0B0B0B` |
| Superficies y tarjetas | `#171717` |
| Blanco cálido / texto principal | `#F5F3EE` |
| Texto secundario | `#AAA7A2` |
| Rojo de marca / CTA | `#E52329` |
| Rojo de hover | `#F43C41` |

Negro y fotografía dominantes. Rojo en botones, indicadores, cantidades y detalles. Revisar el contraste de cada combinación; el texto pequeño sobre rojo debe seguir siendo legible.

### Tipografía

- Títulos: Manrope, pesos 600–800.
- Textos, navegación y carta: DM Sans, pesos 400–500.
- Reservar el lettering de SushiFan para el logo.
- Usar títulos contundentes, párrafos cortos y tamaños adaptados a mobile.

### Logo

Usar la nueva propuesta circular con mascota, lettering SushiFan y texto Tandil, manteniendo negro, blanco y rojo. Preparar una versión horizontal simplificada para la cabecera y una versión reducida para favicon. El sello circular funciona en Instagram, packaging y stickers.

El logo debe mantener su proporción y disponer de espacio libre alrededor. Al reducirlo, simplificar detalles que no se distingan.

### Mascota

Roll de sushi con alga negra, arroz blanco, salmón, brazos y piernas pequeños, expresión simpática, vincha roja y palitos. Ilustración 2D con contornos claros.

Poses previstas: saludando, sosteniendo palitos, presentando una tabla, señalando la carta y llevando una bolsa de take away.

Aplicaciones: bienvenida, contacto, carrito vacío y cierre del pedido. Mantenerla pequeña en la interfaz; la carta debe priorizar productos y precios.

## Fotografía

Usar originales de Sushi Fan: tablas, rolls, salmón, copas, interior y encuentros. Las capturas de Instagram sirven como referencia visual; obtener fotos originales para la versión final.

Conservar los colores naturales de la comida. Aplicar overlays oscuros solamente cuando sean necesarios para leer texto. Evitar asociar una fotografía a un producto que no representa.

Para “Quiénes somos”, se desarrolló una propuesta de los dueños con chaquetas estilo kimono negras y detalles rojos. Es una edición de vestuario con IA: revisar el parecido y obtener conformidad de los dueños antes de usarla como foto pública. La foto original sigue siendo una alternativa válida.

## Tono y textos

Español rioplatense, cercano y directo: “Vení”, “Elegí”, “Pedí”, “Disfrutá”, “Reservá”.

| Sección | Texto propuesto |
|---|---|
| Hero | Sushi, vino y buenos momentos. |
| Bajada | Tu próxima salida o tu próxima tablita en casa. Elegí cómo disfrutar Sushi Fan en Tandil. |
| Nosotros | El sushi nos reúne. |
| Carta | Encontrá tu próximo favorito. |
| Experiencia | Una mesa. Una copa. Un buen plan. |
| Delivery | Hoy se pide Sushi Fan. |
| Ubicación | Nos encontramos en Tandil. |
| Carrito vacío | Tu tablita empieza acá. |
| CTA de carta | Agregar al pedido |
| CTA final | Enviar pedido por WhatsApp |

## Estructura de la web

1. Cabecera con logo, navegación, acceso a reservas y carrito con contador de unidades.
2. Hero con producto real, presentación breve y botones “Reservar mesa” y “Armar mi pedido”.
3. Nosotros, con fotografía de los dueños y texto breve.
4. Carta interactiva para delivery / take away, con categorías y productos.
5. Experiencia del restó, con fotos y acceso a reservas.
6. Direcciones y horarios separados por local.
7. Footer con Instagram, reservas, pedidos y datos de contacto.

La carta y el carrito pueden ocupar una sección o una página propia según la estructura actual. Priorizar acceso rápido desde mobile.

## Carrito de compras y pedidos por WhatsApp

### Flujo principal

**Elegir productos → agregar al carrito → ajustar cantidades → elegir delivery o retiro → completar datos → revisar → abrir WhatsApp con todo el pedido.**

El carrito prepara una solicitud de pedido. Abrir WhatsApp no significa que el mensaje haya sido enviado ni que el local haya confirmado el pedido.

### Carta interactiva

Cada producto debe mostrar:

- Foto real, si está disponible.
- Nombre y descripción comprobados.
- Precio vigente en pesos argentinos.
- Cantidad de piezas o tamaño, cuando corresponda.
- Variantes o combinaciones reales, cuando existan.
- Botón “Agregar al pedido”.

Los productos y precios deben provenir de la carta vigente de delivery / take away. La carta del restó puede tener precios y disponibilidad diferentes; mantenerla separada.

No reutilizar platos ni precios de Kazoku. Si todavía falta la carta vigente, preparar el catálogo para cargarla y bloquear la compra de productos sin precio confirmado. No inventar importes ni promociones.

### Comportamiento del carrito

- Abrir desde un botón visible con contador.
- Mostrar nombre, variante, precio unitario, cantidad y subtotal por producto.
- Permitir aumentar o reducir cantidades y eliminar productos.
- Agrupar el mismo producto y variante; mantener variantes distintas como líneas separadas.
- Calcular el subtotal del pedido de forma consistente. Trabajar con importes enteros en centavos para evitar errores de redondeo.
- Formatear precios con moneda ARS y convenciones de Argentina.
- Conservar el carrito al navegar o recargar, mediante almacenamiento local.
- Conservar únicamente identificadores, variantes y cantidades; recalcular precios desde el catálogo vigente. Si cambian precios o disponibilidad, avisar antes de enviar.
- Mostrar una pantalla vacía con acceso a la carta y bloquear el envío cuando no haya productos.
- Mantener el carrito después de abrir WhatsApp: el usuario puede volver para corregirlo.

### Datos para completar el pedido

- Nombre del cliente.
- Modalidad: delivery o retiro en Juncal 689.
- Dirección y referencia, cuando se elige delivery.
- Observaciones opcionales, por ejemplo una indicación para el pedido.

La dirección debe ser obligatoria únicamente para delivery. Solicitar sólo los datos necesarios. No guardar datos personales en el almacenamiento local por defecto.

Si no se conoce el costo de envío, mostrar “Envío a confirmar con el local”. No presentar el subtotal de productos como total final con envío incluido. Zonas de entrega, mínimos, medios de pago y tiempos se incorporan cuando el negocio los confirme.

### Mensaje de WhatsApp

Abrir una conversación con el contacto de delivery y take away. El mensaje debe incluir todos los productos, variantes, cantidades, precios y datos del cliente.

Plantilla de contenido; los campos entre llaves se reemplazan con datos reales:

```text
¡Hola, Sushi Fan! Quiero consultar este pedido:

{cantidad} × {producto y variante}
Precio unitario: {precio}
Subtotal: {subtotal de la línea}

{repetir por cada producto}

Subtotal de productos: {subtotal del pedido}
Modalidad: {Delivery / Retiro en Juncal 689}
Nombre: {nombre}
Dirección: {sólo si corresponde}
Referencia: {si se completó}
Observaciones: {si se completaron}

{Delivery: costo de envío a confirmar}
¿Me confirman disponibilidad, importe final y tiempo estimado?
```

Construir el mensaje con saltos de línea y codificarlo correctamente para la URL de WhatsApp. Número de referencia para pedidos: `5492494333204`, tomado del enlace de la carta de delivery compartido. Confirmar con el negocio que también recibe pedidos antes del lanzamiento.

Usar un enlace `https://wa.me/5492494333204?text=...` con el texto codificado. Debe funcionar en WhatsApp móvil y WhatsApp Web. El cliente revisa y envía el mensaje dentro de WhatsApp.

Debajo del botón, mostrar: **“El pedido queda confirmado cuando te responde el local.”**

Las reservas del restó utilizan su propio contacto y permanecen separadas del carrito.

### Diseño del carrito

En desktop, un panel lateral puede facilitar la revisión. En mobile, usar un panel amplio con desplazamiento propio y controles cómodos para el dedo. El resumen y el botón final deben quedar accesibles sin tapar productos o campos.

Mostrar feedback al agregar: “Agregado a tu pedido”. Usar botones claros para cantidades y una acción visible para eliminar. Mantener foco accesible, cierre con Escape y devolución del foco al botón que abrió el panel.

### Alcance inicial

Carta + carrito + solicitud de pedido por WhatsApp. No requiere pasarela de pago ni creación de cuentas. El local confirma stock, envío, pago y tiempo de preparación por WhatsApp.

## Información de referencia del negocio

Datos tomados de las capturas compartidas. Confirmar horarios y contactos con Sushi Fan antes del lanzamiento.

### Restó

- Dirección: Av. Brasil 184, Tandil.
- Horarios: jueves a domingo, 19:00 a 00:00.
- Reservas: https://walink.co/ece07c
- Carta: https://wa.me/c/5492494515187

### Delivery / Take Away

- Dirección: Juncal 689, Tandil.
- Horarios: miércoles a sábado, 19:00 a 00:00.
- Contacto de pedidos: https://walink.co/3d2361
- Carta: https://wa.me/c/5492494333204

Instagram: https://www.instagram.com/sushifantandil/

## Adaptación y verificación

- Reescribir títulos, párrafos, navegación y footer para Sushi Fan.
- Actualizar title, descripción SEO, Open Graph y datos estructurados.
- Eliminar historia, contactos, platos, precios y reseñas heredados de Kazoku y Sevilla.
- Usar sólo testimonios y puntuaciones comprobados.
- Revisar mobile, tablet y desktop: títulos, imágenes, botones y carrito sin desbordamientos.
- Verificar agregar repetidos, variantes, cambios de cantidad, eliminación, recarga y carrito vacío.
- Verificar que el mensaje contiene el pedido completo y que los cálculos coinciden.
- Verificar delivery con dirección obligatoria y retiro sin pedir dirección.
- Probar el envío preparado en WhatsApp móvil y Web, incluidos acentos, símbolos monetarios y pedidos extensos.
- Evitar confirmar pedidos o reservas automáticamente: la confirmación corresponde al local.
