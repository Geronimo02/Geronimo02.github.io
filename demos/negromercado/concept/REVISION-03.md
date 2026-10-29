# C-v3 · un café en la carta

El usuario acepta continuar esta base y pide sumar un café en la carta. Se interpreta «mandarle eso» como continuar el diseño: no hay destinatario ni instrucción de enviar mensajes. No se contacta a terceros.

- Taza de flat white y plato crema, recortados con transparencia, debajo del título «El antojo manda». Imagen protagonista, no ícono decorativo.
- Imagen de hasta 355px en escritorio y 275px en móvil. Carta alineada al centro de la composición en escritorio; orden vertical en móvil.
- Entrada de 850ms al aparecer, sin repetición continua. En movimiento reducido queda estática. La imagen sigue visible sin soporte de IntersectionObserver.
- Croissant: recorrido lateral reducido de 15% a 10,5% de viewport en escritorio; 19% a 17% en móvil; giro máximo de -5,5°/+7° y pequeño desfase entre mitades. Busca una apertura más contenida, no una simulación física de rotura.
- Paleta y logo aportado preservados. No se modifica la web publicada.

## Medio visual

**REPRESENTACION de demo**. No existe todavía foto autorizada del café exacto del local. Asset: assets/menu-coffee.webp, 900×900 con alpha. Generación integrada, original en generated_images/exec-32e516a9-93dd-4a25-a7ec-e8d03d208eec.png. Copia optimizada WebP calidad 88. El HTML incluye rótulo «Imagen ilustrativa» al lado del recurso. El flat white figura en la carta relevada; no se deduce de la imagen tamaño, vajilla real ni disponibilidad.

Prompt de producción: fotografía natural de un flat white en taza gruesa de cerámica crema con plato a juego, vista elevada a 55°, asa a la derecha, pequeño corazón de latte art, textura y burbujas discretas; recorte transparente sin mesa, granos, croissant, texto, logo, manos ni ambiente; luz difusa; ilustración genérica para demo, no foto real de un negocio.

Fallback: imagen estática con texto alternativo y carta accesible. Sustitución futura: fotografía autorizada del café del local con encuadre equivalente. No se publica hasta resolver derechos y validación de datos.

## Comprobación

Sintaxis JavaScript, decodificación de las cinco imágenes embebidas y destinos de anclas internas comprobados. Registro en c-static-checks.json. Render 1440/390 y ejecución de interacciones siguen **NO PROBADOS**. No se presenta una imagen generada como captura del sitio. El video anterior es un estudio de movimiento de la revisión anterior, no evidencia de esta versión.
