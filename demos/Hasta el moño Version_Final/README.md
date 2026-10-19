# Hasta el Moño — versión final de demo

Implementación estática y responsive basada en los bocetos guardados en `boceto/`.

## Abrir localmente

Desde esta carpeta:

```powershell
python -m http.server 8770 --bind 127.0.0.1
```

Luego abrir `http://127.0.0.1:8770/`.

## Alcance

- Hero, carta, cocina, local y CTA final reproducidos como composiciones HTML/CSS con capas independientes.
- Filtros de carta, cambio de fotografía, agregar/quitar, cantidades, subtotal, observaciones y comanda lateral.
- Menú y comanda adaptados a desktop, tablet y mobile.
- Video local de preparación con control de reproducción.
- Enlace real a Google Maps e Instagram.
- Sin WhatsApp, pagos, endpoints, analítica ni envío de pedidos.

Los nombres, variedades y precios de la carta son datos ficticios de demostración. Los horarios quedan expresamente pendientes de confirmación antes de una publicación real.

## Archivos

- `index.html`: contenido y estructura accesible.
- `styles.css`: dirección de arte, collage y responsive.
- `app.js`: interacciones de carta, video, navegación y comanda.
- `assets/`: recursos ordenados en `brand/`, `photos/`, `graphics/` y `media/`.
- `boceto/`: referencias visuales originales, conservadas sin convertirlas en fondos de página.
- `assest/`: paquete original recibido, conservado como fuente.

## Validación local

Comprobado en navegador a 1440, 768, 390 y 360 px:

- un solo `h1`;
- todos los recursos locales cargan;
- sin errores ni advertencias en consola;
- sin desborde horizontal accidental;
- filtros y cambio de fotografía operativos;
- cantidades, subtotal, observaciones y copia de comanda operativos;
- menú móvil, cierre con `Escape` y video operativos.

Las capturas de control están en `../../output/playwright/hasta-el-mono-final/` y no equivalen a una aprobación de publicación o despliegue.
