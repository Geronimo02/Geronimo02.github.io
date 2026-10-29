# Negro Mercado v3 (demo)

Rediseño sobre la base de `demos/negro-mercado-ferea` (no la modifica). **Es una demo con datos ficticios**: no hay servidor, base de datos ni cuentas. Todo se guarda en el navegador (`localStorage`).

## Qué muestra

1. **Pedido en mesa por QR.** Cada mesa tiene un link/QR (`/mesa/6/`). Quien lo abre ve el chip «Mesa 6», arma el pedido y lo envía. Puede seguir el estado: recibido, en preparación, listo, entregado.
2. **Panel del salón** en `/panel/` — **PIN 1234**. Tablero Nuevos / En preparación / Listos con el número de mesa grande, aclaraciones y aviso sonoro; los pedidos de más de 10 minutos se marcan en rojo.
3. Desde el panel se edita la carta (precios, «hay / no hay», agregar productos), se cambia la cantidad de mesas y se imprimen los QR. «Restablecer demo» vuelve a los datos de ejemplo.

Sin delivery ni cobro online: es para consumir en el local.

## Datos ficticios

- Los precios de la carta vienen de la carta compartida (a confirmar con el local). Los productos de café de especialidad (Chemex, cold brew, affogato, café en grano) y los 3 pedidos de ejemplo del panel son inventados para la demo.
- Imágenes ilustrativas, no fotos del local. La tipografía de títulos (Baloo 2) es un reemplazo del lettering del boceto.

## Alcance de la demo

- El cliente y el panel comparten datos **solo dentro del mismo navegador** (por ejemplo, dos pestañas). Para mostrarlo: abrí `/panel/` en una pestaña y `/mesa/6/` en otra. Entre dos dispositivos distintos no se sincroniza.
- Sin seguridad real: el PIN está en el código y los QR no llevan código de mesa. Es a propósito.
- Si el local lo quiere de verdad, `src/api.ts` es el único archivo a reemplazar por un backend (misma interfaz). En el historial de git hay una versión con Cloudflare Worker + D1 (commit `774862a`).

## Correr y publicar

```bash
npm install
npm run dev      # desarrollo
npm run build    # genera dist/ (sitio estático, con una carpeta por ruta)
```

`dist/` se puede subir a cualquier hosting estático (GitHub Pages, Cloudflare Pages, Netlify).
