# MALABAR / v3 Interactiva

## Empeza por aca

1. Abri `MALABAR_V3_PREVIEW.html` en Chrome/Edge. Contiene las fotos embebidas y **los efectos de scroll funcionando**, sin servidor.
2. En desktop, baja despacio para ver el hero que se contrae, el relato de eventos, la imagen que se expande y la galeria horizontal. En mobile, desplaza naturalmente con el dedo.
3. Mira las capturas `RECORRIDO_V3_DESKTOP.png` y `RECORRIDO_V3_MOBILE.png` para una vista general.
4. Para adaptar el sitio desde VS Code, usa `preview/index.html` y conserva `assets/` al mismo nivel; lee `BRANDING_MALABAR_V3.md`.
5. Los archivos `motion_v3.css` y `motion_v3.js` contienen el movimiento agregado al prototipo v2, por si queres integrar esa logica en tu app.

## Limitaciones del prototipo

- Se genera una **solicitud**, no una reserva. Sin pagos ni disponibilidad real.
- El WhatsApp Business no esta configurado: completar `WHATSAPP_BUSINESS_E164` con el numero real en formato internacional (sin + ni espacios) para habilitar el boton wa.me. Hasta entonces el cliente puede copiar el mensaje.
- Los servicios, la capacidad, la direccion exacta, el logotipo oficial y los derechos para publicar imagenes de invitados o material de terceros deben confirmarse con Malabar.
- Es una **interpretacion original** inspirada en el sitio ROYAL; no contiene sus fotos ni codigo fuente.
- Para que la preview funcione sin internet, el motor de scroll usa JavaScript nativo en lugar de depender de GSAP por CDN. Las mismas escenas se pueden portar a ScrollTrigger al llevarlo a un proyecto de produccion.
- Las tipografias usan Manrope de Google Fonts cuando hay conexion; offline usa fuentes del sistema.

## Pruebas

`pytest -q tests/test_motion_v3.py` (requiere pytest, playwright y un navegador Chromium instalado).
