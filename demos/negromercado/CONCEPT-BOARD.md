# Negro Mercado · S3 en revisión

Dos prototipos HTML autocontenidos, todavía sin render verificado. Abrir concept/index.html permite comparar A/B y encuadres de 1440/390; el selector cambia el ancho del iframe, no constituye evidencia de captura ejecutada.

| Dirección | Composición | Exploración | Carácter |
|---|---|---|---|
| A · Negro, de cerca | Foto oscura a sangre + tipografía grande | Tabs de café, pastelería y vermú | Intensa, gastronómica, directa |
| B · La pausa de Avellaneda | Lienzo crema + foto vertical arqueada | Acordeón editorial por momentos | Luminosa, pausada, cercana |

Recomendación provisional: A, por el peso del producto y acceso inmediato a carta. No hay dirección elegida por el usuario.

Ambas incluyen navegación móvil, enlaces de carta/consulta/ubicación y tratamiento de movimiento reducido. Esto describe el código, no una prueba de funcionamiento superada. Los precios se omiten porque la vigencia y leyendas de variantes siguen pendientes.

Los productos nombrados proceden de S2 y vermutería de la bio oficial. Fotografía: REPRESENTACION generada; no se presenta como foto real. El nombre de marca está compuesto tipográficamente, no se ha reconstruido un master de logo.

## Bloqueo de verificación

El script Python de captura no pudo arrancar porque falta Playwright Python. Node Playwright existe, pero su Chromium no está instalado. La descarga oficial devolvió una página Site Unavailable en lugar del archivo. Un intento de abrir una prueba por data URL en el navegador conectado fue rechazado por política de protocolos. No se intentaron vías indirectas en ese navegador.

No existen capturas reales de estos conceptos ni QA interactivo ejecutado. G0/G1/G2 no aprobados. S3 permanece en curso y S4 no empieza. Próximo paso: renderizar los HTML por una vía permitida, inspeccionar 1440/390, probar tabs/acordeón/navegación, corregir y recién entonces presentar selección final de dirección.
