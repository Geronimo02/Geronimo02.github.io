# Comparador de conceptos

Abrir index.html en un navegador, sin servidor ni dependencias de red. Incluye ambos estudios embebidos. Cada directions/{a,b}/index.html también funciona por separado.

build.py regenera los estudios desde fuentes y assets locales. document.py actualiza contratos/documentación. verify.cjs prepara capturas y pruebas con Node Playwright, pero NO pudo ejecutarse por falta de Chromium. Si el navegador está disponible: `node concept/verify.cjs` (requiere CODEX_PRIMARY_RUNTIME_NODE_MODULES o adaptar la ruta al Playwright local).

Las capturas pendientes están documentadas en screens/capture-results.json; no hay PNG inventados. No desplegar este proyecto: es exploración S3, no dirección aprobada.
