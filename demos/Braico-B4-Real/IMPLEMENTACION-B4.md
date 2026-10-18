# Implementación Braico B4 — El Corte

## Idea rectora
La **receta de Carlitos se abre ante el visitante**. Momento wow ligado a un ítem auténtico de la carta, no un modelo 3D genérico.

## Evidencia → Decisión UI
1. Carlitos existe en la carta: módulo central con su nombre y CTA; no placeholder.
2. Sus ingredientes (mortadela con pistachos, Tybo, pepinillos, Dijon, aceite): recortes PNG seleccionables y descripciones comprobables.
3. Chacabuco 195 y los 18 homenajes son parte de la identidad: marcos y numeración del módulo; se conserva el fichero de nombres B2.

## Sistema visual
Verde `#073821` y verde muy oscuro `#0a2319`, rojo `#d41122`, crema `#f4e8ce`. El color brillante pertenece a la comida; la interfaz es austera.

## Interacción
- Pantalla cerrada: foto fotorrealista generada, con indicación de abrir.
- Botón o deslizador: foto se disuelve, siete piezas PNG emergen y se separan verticalmente en ~900 ms, y pueden examinarse.
- Fichas por ingrediente: foco y selección con clic o teclado; el detalle se actualiza y permite entender el contenido.
- «VOLVER A ARMAR»: regresa al estado original.
- Respeto por `prefers-reduced-motion` y navegación con teclado.
- «SUMAR CARLITOS»: reutiliza catálogo y carrito B3 (no envía compra a un número real).

## Assets
Recortes en `assets/layers`: `pan-superior.png`, `dijon.png`, `pepinillos.png`, `mortadela-pistachos.png`, `queso-tybo.png`, `aceite-oliva.png`, `pan-inferior.png`, `carlitos-entero.png`.

Se extrajeron de un mockup fotorrealista generado para **este prototipo** y no constituyen fotografías de Braico. Al tener fuentes independientes por capa, cuando existan fotos auténticas bastará reemplazarlas con igual ratio y ajustar recortes.

## Fase cliente
Fotos de Carlitos cerrado y en 3/4 con iluminación unificada + ingredientes por separado o material de producto autorizado. Confirmación de pan, orden real, tamaño, contenido y permiso de uso. Fotografía de producto auténtica reemplazará las representaciones actuales.

## Decisión tecnológica
CSS transforms + JS nativo. Motivo: evita carga de Three.js en móviles y permite iterar. Si las fotografías auténticas justifican profundidad física, valorar WebGL/Three con presupuestos de rendimiento y fallback.
