# Estado de la demo y datos pendientes

La carta vive en `carta.html`. `index.html` presenta el restó y enlaza a esa página desde el hero y las llamadas a pedir. Los dos archivos comparten el mismo carrito. `menu.js` contiene **productos, descripciones, variantes y precios ficticios** para demostrar el recorrido completo: selección en la web, carrito, datos de delivery o retiro y mensaje preparado en WhatsApp. No representa la carta vigente de Sushi Fan.

En modo demo (`demo: true`), el mensaje se marca como prueba y se abre con `https://wa.me/?text=...`, sin destinatario. Así se puede probar el flujo sin enviar un pedido ficticio al negocio.

## Para pasar a pedidos reales

1. Reemplazar los productos de `menu.js` por la carta actual de **delivery / take away** confirmada por Sushi Fan: nombre, descripción, piezas o tamaño, variantes y precio. Cada `priceCents` es un entero: $12.500 se escribe `1250000`.
2. Cambiar `revision` para avisar a los carritos guardados que cambió la carta.
3. Cambiar `demo` a `false` y completar `whatsappNumber` con el número de pedidos confirmado por el negocio. El número `5492494333204` figura en el brief como referencia, pero debe confirmarse antes de utilizarse.
4. Sustituir las fotos de muestra por fotos originales que correspondan a cada producto. Confirmar además horarios, costos y zonas de envío, mínimos, medios de pago y tiempos si se publicarán en la web.

El carrito guarda sólo identificadores, variantes y cantidades, y recalcula precios desde la carta vigente. El pedido se confirma cuando responde el local.

## Fotos de muestra

Las nueve fotos de productos provienen de [Pixabay](https://pixabay.com/service/license-summary/). La imagen de portada de la carta proviene de [Unsplash](https://unsplash.com/license). Todas se guardaron localmente. Son ilustrativas, no fotos de productos reales de Sushi Fan.

| Archivo | Fuente |
|---|---|
| `demo-maki-salmon.jpg` | https://cdn.pixabay.com/photo/2020/05/15/10/59/maki-5173232_1280.jpg |
| `demo-maki-clasico.jpg` | https://cdn.pixabay.com/photo/2015/04/10/15/59/maki-716432_640.jpg |
| `demo-rolls-mixtos.jpg` | https://cdn.pixabay.com/photo/2021/07/31/17/14/sushi-6512533_640.jpg |
| `demo-rolls-fusion.jpg` | https://cdn.pixabay.com/photo/2020/05/15/10/59/sushi-5173229_640.jpg |
| `demo-nigiri.jpg` | https://cdn.pixabay.com/photo/2020/07/21/08/42/nigiri-5425623_1280.jpg |
| `demo-gyoza.jpg` | https://cdn.pixabay.com/photo/2015/05/10/05/07/gyoza-760510_640.jpg |
| `demo-dumplings.jpg` | https://cdn.pixabay.com/photo/2020/09/09/12/47/dumplings-5557529_640.jpg |
| `demo-sashimi.jpg` | https://cdn.pixabay.com/photo/2017/06/17/17/11/sashimi-2412779_640.jpg |
| `demo-tabla.jpg` | https://cdn.pixabay.com/photo/2015/04/10/16/00/sushi-716447_640.jpg |
| `demo-carta-hero.jpg` | https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1600&q=82 |

No publicar la demo como carta real hasta reemplazar los datos ficticios y confirmar el destinatario de WhatsApp.
