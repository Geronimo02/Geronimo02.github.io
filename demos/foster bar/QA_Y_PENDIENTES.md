# Foster Burger Bar — revisión previa a publicación

## Implementación

- Home completa en `index.html`; carta independiente en `carta/index.html`; solicitudes de reserva en `reservas/index.html`.
- HTML, CSS y JavaScript sin framework ni backend. La solicitud se prepara en el navegador y se copia para enviarla a `@fosterburgerbar`; no se almacena ni confirma una mesa.
- Las fechas se validan para martes y miércoles desde hoy. El horario preferido debe ser desde las 19:00 h.
- Las siete fotografías del kit son conceptuales y se identifican como tales en la web.
- La marca tipográfica es provisional: el kit no incluye el logo maestro. No se usó el monograma propuesto; el favicon es una marca geométrica neutra.
- Los controles e indicadores usan SVG. En tablet y móvil se omitió la etiqueta duplicada del pie del hero para dejar espacio a la nota de reservas.

## Revisión visual y funcional

- Capturas reales de la home a 1440, 1024, 768 y 390 px en `qa/home-*.png`.
- Capturas de carta y reservas a 1440 y 390 px en `qa/carta-*.png` y `qa/reservas-*.png`.
- Estado de solicitud preparada y copiada en `qa/reserva-solicitud-390.png`.
- Grabación real de scroll, reveals y controles de galería en `qa/recorrido-interacciones.webm`.
- Rutas con HTTP 200, sin errores de JavaScript ni desborde horizontal del documento. Menú móvil, Escape, galería, validación de día y copia del mensaje comprobados.
- Revisión automatizada axe a 1440 y 390 px: cero infracciones detectadas. `prefers-reduced-motion: reduce` deja visibles todos los contenidos. Resultados en `qa/verificacion.json` y `qa/accesibilidad.json`.

## Diferencias conscientes respecto de los mockups

- Los mockups muestran productos, precios, dirección, WhatsApp y un interior como si fueran información real. La implementación los omite o marca como conceptuales porque el kit no los verifica.
- La carta presenta categorías y fotografías, con espacio para incorporar los productos confirmados. No inventa platos ni precios.
- La reserva no simula confirmación: prepara una solicitud para que la persona la envíe por Instagram. Para confirmar cupos en línea haría falta definir canal oficial y sistema de disponibilidad.
- El wordmark reproduce la jerarquía visual mediante tipografía provisional; deberá sustituirse por el archivo oficial del logo antes del lanzamiento.

## Datos que faltan para publicar

1. Logo maestro aprobado y permiso comercial para las fotografías conceptuales, o fotos reales que las sustituyan.
2. Carta vigente con nombres, ingredientes, precios y categorías definitivas.
3. Dirección exacta confirmada; el manual menciona Juncal 595, pero solicita verificarla.
4. Canal oficial para reservas y política de confirmación. Si no se usa Instagram, reemplazar la salida actual.
5. Dominio final para completar sitemap y URLs canónicas.

No se modificó `demos/fooster club/` ni se publicó esta web.
