# BRAICO B4 — El Corte realista (prototipo)

Abrir `index.html` con un servidor estático o abrir `Braico-B4.html` directamente con Chrome/Edge sin dependencias.

## Probar
1. Ir a «El Corte» desde la navegación.
2. Pulsar «ABRIR EL CARLITOS» o mover el deslizador para separar las capas.
3. Seleccionar cada ingrediente desde el listado lateral o tocándolo cuando esté abierto.
4. Usar «SUMAR CARLITOS A MI SELECCIÓN» para integrarlo al carrito existente.
5. La carta y todos los demás flujos anteriores se mantienen.

## Importante
Los PNG transparentes son representaciones **generadas** a partir de un mockup para una demo privada, no fotos de los productos de Braico. Los ingredientes y su denominación derivan de la carta de diciembre de 2025; el pan y el montaje son ilustrativos. Antes de publicar, confirmar precios, horarios, contacto de pedidos y derechos de fotos auténticas.

## Estructura
- `index.html`: web B4, dependiente solo de `assets/`.
- `Braico-B4.html`: HTML autocontenido para abrir directamente.
- `assets/layers/*.png`: kit de capas separado con transparencia.
- `assets/b4-corte.css`, `assets/b4-corte.js`: módulo nuevo. No se usa Three.js.
- `IMPLEMENTACION-B4.md`, `QA-B4.md`: decisiones técnicas y pruebas.
