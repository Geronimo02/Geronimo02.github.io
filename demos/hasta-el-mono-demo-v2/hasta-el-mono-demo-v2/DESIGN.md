# Hasta el Moño — DESIGN v2 | Afiche de mostrador

**Fecha:** 17/10/2026 · **Estado:** DEMO P3, no publicada · **Dirección elegida:** Negro de Autor, con replanteo por feedback de genericidad.

## Concepto
**Frase material:** *una bandeja de empanadas sobre azulejo negro, tapada a medias por el nombre del local como si fuera un afiche*. 

**Identidad real:** se mantiene el logotipo blanco geométrico tal como aparece en Instagram y la fachada. No se convierte en una mascota ni se transforma el logo. Las fotos del local son la materia visual; no se generan productos inexistentes.

## Motivo firma
1. Portada con lettering gigantesco "HASTA / EL MOÑO" y bandeja circular superpuesta. Es una composición específica para esta identidad y sus fotos.
2. Carta como **comanda de mostrador**: líneas horizontales, números, + para cada artículo, una foto protagonista que cambia al elegir un renglón.
3. Fotografías asimétricas de corte, preparación y horno, más un ticket de carrito (bordes de puntos y jerarquía de números).

## Paleta (sugerida, no manual de marca)
| Token | HEX | Uso |
|---|---|---|
| --ink | #10100F | fondo negro azulejo |
| --carbon | #171716 | planos oscuros |
| --milk | #F1EEE7 | papel de comanda |
| --white | #FBFAF8 | titular y logo |
| --silver | #94908B | líneas y subtítulos |
| --accent | #C68B53 | matiz gastronómico muy secundario |

## Tipografía
- Logo en imagen, no reescrito.
- `Archivo Black`: titulares editoriales a gran escala, con tracking -0.065em a -0.095em.
- `DM Sans`: rótulos, navegación, carta y anotaciones, pesos 400 a 800.
- Dos familias máximo; fallbacks de sistema si el dispositivo no está conectado.

## Arquitectura de información
Afiche hero de marca → collage de producto → carta/comanda interactiva → fotos del proceso y video → fachada, dirección, horarios → llamado final y footer.

## Interacción y movimiento
- Menú: al pasar el cursor o enfocar un renglón, actualiza la fotografía de producto; fallback con primera foto visible y lista clicable accesible.
- Cesta: abrir/cerrar drawer con ESC y foco, selector de modalidad, control de cantidades, observaciones y copia de texto solo demostrativa.
- Hero: entrada discreta de la imagen; sin scrolljacking, sin animaciones de fondo ni librerías pesadas.
- `prefers-reduced-motion`: desactiva la animación.

## Mobile
- Título y bandeja conservan composición editorial sin zoom horizontal.
- CTA ancho y visible debajo de la foto.
- Imagen de la carta encima de los renglones, interacciones por tap.
- Barra de pedido visible una vez que se agregan artículos.

## Tres anti-decisiones
1. No tarjetas genéricas en grilla para productos.
2. No hero de dos columnas con título a la izquierda y foto a la derecha.
3. No inventar historia, ingredientes confirmados, beneficios, promociones, tiempos ni reseñas; los productos/precios siguen marcados como DEMO.

## Referencias utilizadas como método (no copiar composición)
- 400º Pizzaria — disciplina tipográfica y protagonismo del producto.
- Dough / Momina Latif — lenguaje editorial aplicado a gastronomía.
- Il Forno / Cittago — orden de información y navegación de carta.
- Propios activos de Hasta el Moño — fuente de verdad para identidad, logo, fotos, fachada y tono.

## Criterios de aceptación
- Cambio de logo por otro negocio debe sentirse equivocado: foto de bandeja + lettering + dirección + comanda específica.
- Entrar a carta y añadir producto debe ser evidente.
- Todo pedido que sale es solo texto marcado como prueba, sin WhatsApp, pagos o backend.
- QA en 1440, 768, 390, 360 px, sin scroll horizontal ni errores JS.
