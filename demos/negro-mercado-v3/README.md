# Negro Mercado v3

Rediseño sobre la base de `demos/negro-mercado-ferea` (no la modifica). Aprobado primero como diseño en Claude Design y luego trasladado a código.

- Home, Carta, Pedido y Productos. Carrito en `localStorage` y cierre por WhatsApp con mensaje prearmado; el pedido no se considera aceptado hasta que el local lo confirme. No hay cobro.
- Datos de carta en `src/data.ts` (copiados de ferea; transcritos de la carta compartida el 23/10/2026). Precios a confirmar con el local.
- Imágenes en `public/images`: recortes ilustrativos y fotos editoriales de la base Ferea (no son fotos del local).
- Tipografía: Baloo 2 (reemplazo del lettering del boceto), Caveat y DM Sans desde Google Fonts. Falta el logo maestro en alta resolución.
- Movimiento: aparición al scroll, parallax del hero, cinta de texto. Todo se desactiva con `prefers-reduced-motion`.

```bash
npm install
npm run dev
npm run build
```
