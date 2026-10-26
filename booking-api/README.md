# API de reservas

La landing consulta `https://portfolio-booking-api.gserratti.workers.dev`.
El Worker guarda los secretos y consulta la aplicación web de Google Apps
Script. Apps Script consulta el calendario principal de
`serrattigeronimo1@gmail.com`, crea eventos de 60 minutos con Google Meet,
invita al visitante y envía un aviso al propietario.

El formulario exige un token de Turnstile. El Worker valida el token, la acción
`booking` y el hostname `geronimo02.github.io` antes de crear una cita. La
disponibilidad se calcula con la zona `America/Argentina/Buenos_Aires`.

## Cambios futuros

- Editar reglas de horario en `apps-script/Code.gs` y publicar una nueva versión
  de la aplicación web de Apps Script.
- Editar el Worker en `src/index.js` y desplegar con `cf deploy` desde esta
  carpeta. No guardar secretos en el repositorio.
- Los secretos del Worker son `APPS_SCRIPT_URL`, `BOOKING_SECRET` y
  `TURNSTILE_SECRET`. El valor de `BOOKING_SECRET` debe coincidir con la
  propiedad homónima de Apps Script.
- Verificar una reserva desde la landing pública, la recepción de correo y que
  el horario reservado desaparezca de la disponibilidad.

Los horarios de lunes a viernes (09:00, 10:00, 11:00 y 13:00 a 17:00) reproducen
los que se observaron en la página de citas de Google el 26 de octubre de 2026.
