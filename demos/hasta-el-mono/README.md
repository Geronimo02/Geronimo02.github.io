# Hasta el Moño — edición Afiche de mostrador

## Abrir
- **Demo actual (Cloudflare):** https://hasta-el-mono-web.pages.dev/
- **Enlace anterior (GitHub Pages):** https://geronimo02.github.io/demos/hasta-el-mono/
- **Local:** abrir `index.html` con Chrome/Edge. Para editar, usar `index.html`, `styles.css`, `app.js` y `assets/` desde esta carpeta.

## Repositorio y despliegue actuales
- Fuente de la demo: repositorio privado `Geronimo02/hasta-el-mono`, rama `main`; [abrir en GitHub](https://github.com/Geronimo02/hasta-el-mono). Esta carpeta del portfolio queda como copia de referencia.
- Proyecto Cloudflare Pages: `hasta-el-mono-web`, con despliegue automático desde el repositorio propio. Raíz de compilación `.`, comando `node build-pages.mjs`, salida `dist`.
- El proyecto anterior `hasta-el-mono` de Cloudflare fue eliminado. Los cambios para la demo actual se hacen en el repositorio nuevo.
- La salida pública contiene solo los archivos del sitio y `assets/`. El mini panel, D1 y R2 todavía no forman parte de esta demo.

## Si el cliente acepta
Confirmar precios, fotos, condiciones de entrega, datos de contacto, dominio y titularidad. Si se contrata el mini panel, agregarlo al proyecto independiente con D1 y R2; las ediciones hechas desde el panel no requieren commits.

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
