# Scroll 09 · vertido controlado por el usuario

Pedido vigente: el video automático no sirve; el scroll debe controlar la acción. El usuario autoriza usar Three.js u otra tecnología adecuada. Esta revisión implementa una prueba interactiva aislada, no un rediseño ni una web completa nueva.

## Probar

Abrir index.html directamente en un navegador moderno con JavaScript y WebGL. Es autocontenido: Three.js r160, fuentes y texturas embebidas. No requiere npm, servidor ni acceso a servicios de video. Bajar avanza, frenar conserva estado y subir retrocede. El slider sincroniza la posición de scroll. Un enlace permite saltar a carta. El recorrido extra de la escena es 80svh; no se secuestra la rueda ni se bloquea la navegación. Reduced motion elimina recorrido sticky y muestra estado final, conservando control manual. Sin WebGL, fotografía estática con aviso. El fallback no prueba soporte de cada navegador.

Regenerar: `python concept/scroll-09/build.py` desde demos/negromercado. Fuentes editables template.html, scene.js, progress.js y fragment.glsl. Dependencia MIT vendorizada de https://github.com/mrdoob/three.js/tree/r160 ; licencia adjunta. Versión fijada por reproducibilidad, no afirmación de ser la última.

## Qué hace realmente

Three.js ejecuta un ShaderMaterial sobre una fotografía ilustrativa. El chorro, el leve desplazamiento de superficie y la transición entre dos texturas de café dependen solo de uProgress. No hay reloj, autoplay, video remoto ni consumo de créditos de video. Es una composición WebGL de 2.5D, NO una simulación física de fluidos ni una taza modelada completamente en 3D. El corazón final se revela desde una segunda textura, no se calcula físicamente a partir de leche. Esa diferencia importa al evaluar el gesto y el realismo.

El primer ensayo dibujaba una espiral geométrica evidente; se rechazó internamente y se reemplazó por el estado fotográfico final y mezcla localizada dentro del café. El vertido es ilustrativo y puede requerir refinamiento antes de un sitio final.

## Fidelidad y límites

Logo y titular conservan los gráficos raster de revision-06 como recortes CSS, con texto accesible separado. No se sustituyen por una fuente parecida ni se presenta este recurso como master vectorial. Es una decisión de prototipo para conservar exactamente el lenguaje visual elegido. El área de fotografía de la prueba es una composición nueva inspirada en P1, no una captura pixel a pixel del boceto.

Al terminar aparece carta-07 como **boceto estático** explícitamente rotulado, no se finge que sus tabs/buscador funcionan dentro de una imagen. El objetivo de esta entrega es evaluar scroll de café. La carta funcional y el resto del sitio siguen pendientes de integración fiel.

## Medios y derechos

- coffee-before.webp: image_gen, edición de la placa de motion-08 para retirar chorro/latte art, salida original generated_images/exec-05def21b-3ecb-4a61-9c4a-ce5fb960feac.png.
- coffee-after.webp: image_gen, edición registrada del mismo café para incorporar corazón de leche sin chorro, salida original generated_images/exec-6132ff8d-783c-4ffb-abd4-b7784073873b.png.
- Ambas son REPRESENTACION, no fotos auténticas del negocio; rótulo visible en la prueba. Mantener encuadre, taza, croissant y sombras fue instrucción de generación, no garantía de coincidencia de píxeles.
- Artes P1 de logo/titular y carta: bocetos propios previos generados; fuentes/procedencia en revision-06/ y carta-07/.
- DM Sans y licencia OFL ya documentados en concept/assets/.
- No se usa, exporta ni publica el video de HeyGen; no se incluyen enlaces de acceso ni identificadores de ese servicio.

## Comprobaciones realizadas

JS syntax; imágenes embebidas decodificables; módulo Three.js sin imports externos; relación entre posición de scroll y progreso (inicio, centro, fin, límites y recorrido nulo). Shader compilado, enlazado y renderizado con Mesa EGL/OpenGL a cinco posiciones. Mismo progreso produce mismos píxeles al repetirlo y al regresar desde un progreso mayor. Ver shader-checks.json.

Los renders de shader-renders/ son frames reales del shader GPU, **no capturas de navegador ni pruebas DOM**. Se inspeccionaron visualmente estado medio y final, corrigiendo la espiral inicial. El HTML/scroll, composición completa y responsive todavía NO se probaron en navegador: no hay Chromium local disponible. No declarar G3 ni FPS/rendimiento de dispositivos aprobados.

No se publica ni modifica main. Antes de producción: prueba real de navegador/móvil, revisar integración visual, depurar peso y accesibilidad, resolver assets definitivos de marca y sustituir representaciones cuando existan originales autorizados.
