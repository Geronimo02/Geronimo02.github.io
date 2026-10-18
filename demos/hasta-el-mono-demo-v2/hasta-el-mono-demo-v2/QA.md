# QA — Hasta el Moño P3 V2

**17/10/2026 — prueba ejecutada con Chromium + Playwright, en archivo HTML con recursos inyectados y sin despliegue.**

| Ancho | Carga de logo y fotos | Productos demo | Desborde horizontal | Errores JS |
|---|---|---:|---|---|
| 1440 px | Correcta | 6 | No | 0 |
| 768 px | Correcta | 6 | No | 0 |
| 390 px | Correcta | 6 | No | 0 |
| 360 px | Correcta | 6 | No | 0 |

## Pruebas realizadas
- Filtro por empanadas devuelve tres artículos; filtro todos devuelve seis.
- Hover del artículo modifica la fotografía y el nombre en el panel.
- Agregar dos productos, aumentar uno y verificar subtotal de ejemplo $26.600.
- Carrito se cierra con ESC; versión mobile se abre desde barra flotante y se cierra.
- Resumen solo local: código sin fetch de pedidos, endpoints de pago ni enlace wa.me.

## Estado
- DEMO interna: precios y nombres ficticios con aviso visible.
- No conexión a WhatsApp real, no pagos, no hosting, no DNS, no publicación.
- Sin mediciones PageSpeed/Lighthouse de un servidor público. No afirmar puntajes ni Web Vitals reales.
- Imágenes originales proporcionadas para mostrar una propuesta, pendiente de autorización de publicación por el comercio.
- Faltan carta oficial y precios confirmados para pasar de DEMO a producción.
