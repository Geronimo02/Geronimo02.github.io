# Hasta el Moño — edición Afiche de mostrador

## Abrir
- **Online:** https://geronimo02.github.io/demos/hasta-el-mono/
- **Local:** abrir `index.html` con Chrome/Edge. Para editar, usar `index.html`, `styles.css`, `app.js` y `assets/` desde esta carpeta.

## Cloudflare Pages
- Proyecto: `hasta-el-mono`, conectado a `Geronimo02/Geronimo02.github.io` (`main`).
- Carpeta raíz de compilación: `demos/hasta-el-mono`.
- Comando de compilación: `node build-pages.mjs`; salida: `dist`.
- La salida pública incluye solo los archivos del sitio y `assets/`; excluye bocetos, capturas y notas internas.
- Los cambios en esta carpeta activan el despliegue automático. El mini panel, D1 y R2 todavía no forman parte de este piloto.

## Qué incluye
Portada editorial de nombre y bandeja, galería de fotos originales, carta interactiva, carrito con cantidades, retiro o delivery, datos del cliente, observaciones y pedido por WhatsApp. Pantalla de ubicación y video real.

## Pedido por WhatsApp
El carrito prepara un mensaje con nombre, productos, cantidades, modalidad, dirección de delivery y observaciones para `5492494694718`, número de pedidos confirmado por el usuario. En `index.html`, `data-order-phone` indica el número internacional y `data-products-confirmed` habilita el botón. La persona revisa el mensaje y toca **Enviar** dentro de WhatsApp. También puede copiar el resumen.

## Importante
El usuario confirmó los productos, pero no los precios. La página no muestra importes ni los incluye en el mensaje; el local confirma disponibilidad, precio final y costo de envío. No se conectan pagos. Las fotos no se adjuntan al mensaje de WhatsApp. El diseño se preparó a partir de material aportado por el usuario.

## Archivos
- `DESIGN.md`: dirección de arte específica y decisiones.
- `CONTENT.md`: inventario original de contenidos y faltantes.
- `QA.md`: pruebas funcionales y responsive.
- `LAUNCH-PLAN.md`: plan histórico; requiere auditoría y aprobación nueva antes de deploy.
- `preview-desktop.png`, `preview-mobile.png`, `preview-cart.png`: capturas de prueba.
