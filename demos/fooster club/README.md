# Foster Club · demo

Demo estática basada en `Foster_Club_Implementacion_Completa_Antigravity.md` y el mockup `Foster Club_ Burgers y Buenas Historias.png`.

## Ver localmente

Desde esta carpeta:

```sh
node server.mjs
```

Abrí `http://127.0.0.1:4173/` para la home y `http://127.0.0.1:4173/carta/` para la carta independiente. No hay instalación de dependencias. Para desplegar en un hosting estático, publicar esta carpeta con soporte de `index.html` en subdirectorios.

## Datos editables

- `data.mjs`: categorías, productos, precios y `config` comercial.
- `config.address`, `config.openingHours`, `config.phoneNumber` y `config.instagramUrl`: datos de la ficha compartida para la sección de contacto.
- `config.whatsappNumber`: número oficial internacional sin `+`, espacios ni símbolos.
- `config.pickupEnabled` y `config.deliveryEnabled`: activar solo modalidades confirmadas.
- `config.orderingLive`: activar al final, tras verificar número, catálogo, precios, disponibilidad, extras y modalidad.
- `config.demoOrderingEnabled`: permite armar y finalizar un pedido **solo dentro de la demo**, con `demoPriceArs` ficticios. El resumen no se envía ni se cobra. Se desactiva automáticamente cuando `orderingLive` pasa a `true`.
- Cada producto necesita `priceArs` entero, `verified: true`, `available: true` y `orderingEnabled: true` para permitir compra. Los adicionales se agregan en `modifiers` de los productos a los que realmente correspondan, con precio y verificación propios.

El carrito de prueba admite productos, cantidades, notas, total ficticio y una pantalla final de simulación. El armado de mensaje para WhatsApp sigue implementado, pero **no hay precios reales ni un canal de pedidos confirmado y no se puede enviar un pedido real**. La dirección, el celular, los horarios y el Instagram mostrados se tomaron de la captura compartida para la demo; la ficha anterior del brief decía Constitución 511, mientras que la captura más reciente dice 501.

Las imágenes de ambientación adjuntas son piezas conceptuales generadas. Las fotos de `assets/stock/` son genéricas e ilustrativas: **no representan las recetas exactas ni productos verificados de Foster**. Antes de publicar para clientes, reemplazarlas por fotografías reales o confirmar su uso con Foster. El catálogo transcribe una captura anterior y requiere revisión de nombres, ingredientes, existencia y alérgenos.

Fotos de carta descargadas de Unsplash bajo su [licencia](https://unsplash.com/license): [burger 01](https://unsplash.com/photos/burger-with-lettuce-and-tomato-b-ur-6LsdOI), [burger 02](https://unsplash.com/photos/a-close-up-of-a-juicy-cheeseburger-with-melted-cheese-TG96QBkkx9c), [burger 03](https://unsplash.com/photos/cheeseburger-with-pickles-and-melted-cheese-served-with-fries-77265qWj-Gk), [bagel 01](https://unsplash.com/photos/a-plate-with-a-bagel-sandwich-on-it-cD8EnibHS8o), [bagel 02](https://unsplash.com/photos/a-bagel-sandwich-sitting-on-top-of-a-blue-plate-3GwwvEPhT2A), [pollo](https://unsplash.com/photos/fried-chicken-pieces-with-a-side-of-dipping-sauce-jKIkCcXsois), [papas](https://unsplash.com/photos/french-fries-on-white-background-nXjvUlE8418), [aros de cebolla](https://unsplash.com/photos/onion-rings-on-white-paper-AuXET-GaEqA), [milkshake](https://unsplash.com/photos/a-chocolate-milkshake-with-a-straw-in-a-glass-bottle-5kw_1amI7OU), [veggie burger](https://unsplash.com/photos/selective-focus-photography-of-burger-CDbmzuFBc5E), [burger con papas](https://unsplash.com/photos/burger-with-fries-on-plate-eHLMHx2gohs), [mac & cheese](https://unsplash.com/photos/a-bowl-of-macaroni-and-cheese-Vkx_ZpQwQgE), [agua](https://unsplash.com/photos/a-bottle-of-water-Orjd1V7VIwc), [agua con gas ilustrativa](https://unsplash.com/photos/a-glass-of-water-on-a-wooden-table-62jUt0VKPds), [gaseosa](https://unsplash.com/photos/a-can-of-soda-sitting-on-top-of-a-table-eR7dpK-DBMY) y [bebida saborizada](https://unsplash.com/photos/lemonade-in-glass-on-the-table-x33agN5W5TI).

## Comprobaciones

```sh
node --test cart-core.test.mjs
node --test demo-order.test.mjs
node --check app.mjs
node --check data.mjs
```
