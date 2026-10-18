# QA — Braico B4

## Pruebas ejecutadas
- **46/46 verificaciones funcionales exitosas** en Chromium instalado localmente con HTML autocontenido cargado desde `page.set_content` (por restricción del entorno para la navegación HTTP).
- Resoluciones: 1440×900, 800×850, 390×844, 360×760.
- 8 imágenes del módulo cargadas, sin scroll horizontal ni errores de JavaScript.
- Abrir/cerrar, deslizador al 50 %, selección de queso e ingredientes, integración con el carrito y filtro de carta.
- Prueba con `prefers-reduced-motion: reduce`: estado cambia y la transición de capas se desactiva.

## Evidencia
- `qa/Braico-B4-El-Corte.gif`: secuencia completa abrir/cerrar.
- `qa/Braico-B4-Comparativa.jpg`: antes/después.
- `qa/b4-1440-open.png`, `qa/b4-390-open.png`: capturas de la escena.
- `qa/functional-checks.json`: resultados por viewport.

## Limitaciones y pendientes
- No probado en dispositivos físicos ni en despliegue HTTP público.
- PNG de ingredientes generados para demo y segmentados a partir de una imagen sintética: no son fotos reales de Carlitos.
- El montaje de capas del pan y orden visual es ilustrativo; únicamente los ingredientes nombrados se verificaron en la carta de diciembre 2025.
- El módulo es pseudo-3D CSS, no geometría Three.js real.
- No hay checkout operativo ni recepción validada por WhatsApp.
