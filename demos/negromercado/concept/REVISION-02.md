# Rompé la rutina · revisión libre

19/10/2026. El usuario pidió salir de la secuencia rígida, usar las referencias como estímulo, recuperar los colores propios y explorar café/pastelería con scroll. Luego aportó el símbolo original como JPEG de 150×150. Esto autoriza la exploración, no una dirección final ni publicación.

## Dirección

Un solo camino trabajado: **Rompé la rutina**. Lienzo crema, tipografía verde de gran escala, acento azul presente y pastelería flotante en primer plano. La portada se desarrolla como una escena: dos mitades de croissant se separan y rotan con el avance del scroll; entre ellas aparece «el tiempo, en capas». Continúa una franja azul, carta por momentos, café y cierre para visitar la esquina.

El símbolo se usa como imagen original, sin reconstruirlo ni deformarlo. Su aro sugiere el encuadre orgánico de la escena de café; no se presenta ese encuadre como una nueva versión del logo. El nombre está compuesto tipográficamente: el JPEG aportado solo contiene el símbolo.

## Color corregido

Se descargaron temporalmente tres láminas de la publicación oficial de renovación y se contaron sus colores RGB dominantes. No se redistribuyen esas láminas.

| Muestra | Valor | Evidencia | Aplicación |
|---|---|---|---|
| Crema | #F5F2EB | Texto claro repetido en las láminas | Fondo principal |
| Negro | #111111 | Fondo de presentación del nuevo wordmark | Navegación y datos |
| Verde | #1B3A2B | Fondo «mismo café, misma pastelería, mismo vermú» | Titular y escena de café |
| Azul | #506C9B | Lámina azul de renovación | Gesto, sticker y franja editorial |

Son muestras de JPEG publicado, **no un manual HEX oficial**. La revisión elimina el azul grisáceo #C7D3D2 de las propuestas anteriores. El crema anterior también se reemplaza por el muestreado. Archivo de tokens: palette-observed.json.

## Movimiento y límites

- HTML en directions/c/index.html, completamente autocontenido. Funciona sin recursos externos. Tiene scroll nativo con escena sticky, actualización por requestAnimationFrame y control manual accesible «Deslizá para abrir».
- Dos capas de la misma fotografía ilustrativa, con recorte en el espacio entre las mitades. Traslación/rotación vinculada al progreso; no es una fractura física simulada ni un video real. No se afirma lo contrario.
- En movimiento reducido se elimina el recorrido largo, la escena vuelve al flujo normal y los productos quedan estáticos. La carta se puede saltear con enlace directo; no depende de completar la animación.
- Tabs con teclado, menú móvil y Escape escritos en el prototipo. Sintaxis y recursos embebidos comprobados. Render/QA interactivo del HTML siguen sin ejecutar; no se inventan capturas.
- assets/direction-c-artwork.webp es un **boceto generado**, no captura de navegador. assets/motion-study.mp4 es un **estudio audiovisual de 5 segundos**, compuesto con la imagen y tipografía; tampoco registra el HTML. Se inspeccionaron fotogramas y se comprobó su duración/formato.

## Referencias como estímulo

[Chai Theory](https://brandmotion.in/store/chai-theory-cafe) describe una secuencia continua de vertido gobernada por scroll. Se consultó su explicación, no se compró código ni se verificó visualmente su demo. Se toma la idea de un gesto gastronómico que acompaña el recorrido, cambiándolo por el croissant y una portada propia. [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) se consultó como referencia técnica de scrub/progreso; esta prueba usa JS nativo, no GSAP. GAIL’s/La Cabra dejan de imponer composición. No se afirma utilizar recursos no inspeccionados.

## Activos

logo-user-original.jpg: JPEG aportado por usuario, conservado intacto. Croissant y foto de café: REPRESENTACION generada; no son pruebas del producto exacto ni del local. Fuentes propuestas Bricolage Grotesque/DM Sans, licencias OFL adjuntas. El boceto generado usa la forma general del símbolo como referencia visual: para implementación se consume el JPEG exacto del usuario.

## Continuidad

La recomendación anterior de A queda superada por esta exploración C. No hay selección aprobada. El próximo trabajo es valorar el gesto con el usuario, ajustar el concepto y verificar el HTML en un navegador permitido. No volver a hacer S0/S1 ni exigir otra ronda documental para continuar el arte. Sin main, merge ni deploy.
