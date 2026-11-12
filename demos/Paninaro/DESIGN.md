# DESIGN — Braico B4 / El Corte

## Concepto y personalidad
Una esquina con nombres propios. La experiencia B2+B3 se conserva y se amplía con «El Corte», un vistazo fotorrealista —de demostración— a los ingredientes auténticamente listados para Carlitos.

## Paleta (mantener la marca)
- `#073821` verde oscuro: panel de El Corte
- `#003d25` verde Braico: cuerpo y botones
- `#d41122` rojo Braico: barras, controles y acentos
- `#f4e8ce` crema: texto, botones y cartelas
- `#0a2319` verde profundo: profundidad de escenario

## Tipografía
Conservar las familias y escalas de B3, sin introducir tipografías externas nuevas. Títulos display rotundos, etiquetas comprimidas de mostrador, cuerpo legible en crema.

## Composición B4
La columna izquierda mantiene el relato y CTAs; la columna derecha contiene una escena oscura con el sándwich cerrado o siete recortes apilados y un índice de ingredientes. En mobile, los ingredientes y su descripción se convierten en una ficha debajo de la escena.

## Motion
Transformaciones CSS de 900–950 ms, ease `cubic-bezier(.17,.8,.19,1)`; slider interactivo con arrastre fluido, sin Three.js; opción `prefers-reduced-motion`; botones por ingrediente con foco y estados accesibles.

## Contraejemplos
No brillos sci-fi, no modelos 3D rotatorios gratuitos, no atribuir fotografías generadas al negocio, no inventar tipo de pan ni orden de armado reales.

## Límite del prototipo
La calidad visual surge de capas generadas y recortadas. La fotorrealidad de los PNG no asegura coincidencia con el producto real: cuando Braico facilite fotografías, reemplazar capas para lograr fidelidad comercial.
