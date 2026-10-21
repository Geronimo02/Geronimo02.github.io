# Hasta el Moño — edición Afiche de mostrador

## Abrir
- **Online (Cloudflare):** https://hasta-el-mono.pages.dev/
- **Enlace anterior (GitHub Pages):** https://geronimo02.github.io/demos/hasta-el-mono/
- **Local:** abrir `index.html` con Chrome/Edge. Para editar, usar `index.html`, `styles.css`, `app.js` y `assets/` desde esta carpeta.

## Cloudflare Pages
- Proyecto: `hasta-el-mono`, conectado a `Geronimo02/Geronimo02.github.io` (`main`).
- URL del piloto: https://hasta-el-mono.pages.dev/
- Carpeta raíz de compilación: `demos/hasta-el-mono`.
- Comando de compilación: `node build-pages.mjs`; salida: `dist`.
- La salida pública incluye solo los archivos del sitio y `assets/`; excluye bocetos, capturas y notas internas.
- Los cambios en esta carpeta activan el despliegue automático. El mini panel, D1 y R2 todavía no forman parte de este piloto.

## Pasar de demo a cliente
1. Guardar el enlace y commit de la demo aceptada. Copiar esta carpeta a un repositorio GitHub exclusivo para Hasta el Moño, con los archivos del sitio en la raíz. Mantener la demo del portfolio como referencia.
2. Dar acceso a la integración de Cloudflare al repositorio nuevo. GitHub permite incorporarlo a los repositorios seleccionados; el acceso a **todos** los repositorios es opcional.
3. Crear un proyecto Pages nuevo conectado a la rama `main` de ese repo. Usar raíz de compilación `.`, comando `node build-pages.mjs` y salida `dist`. El proyecto piloto actual sigue ligado al repositorio del portfolio.
4. Antes de usar el dominio del cliente, validar precios, fotos, condiciones de entrega, datos de contacto y titularidad. Si se contrata el mini panel, agregarlo a ese proyecto con D1 y R2; las ediciones hechas desde el panel no requieren commits.

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
