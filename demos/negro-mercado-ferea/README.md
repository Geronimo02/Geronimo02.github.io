# Negro Mercado

Implementación nueva, independiente de la carpeta anterior `demos/negromercado`.

## Ejecutar

```bash
npm install
npm run dev
```

`npm run build` genera `dist/`, incluidas entradas estáticas para `/carta/` y `/productos/`.

## Estructura

- `src/data.ts`: datos del negocio, carta y precios transcritos de la imagen aportada por el usuario el 23/10/2026.
- `src/Home.tsx` y `src/home.css`: home editorial, escenas y movimiento ligado al scroll.
- `src/App.tsx`: carta, productos, navegación, carrito y cierre por WhatsApp.
- `src/styles.css`: sistema visual compartido y responsive.
- `public/images`: símbolo de la marca y fotos editoriales ilustrativas.
- `qa`: capturas de comparación y pruebas visuales.

El carrito persiste en `localStorage`. El botón final abre WhatsApp con un mensaje prearmado; el pedido no se considera aceptado hasta que el local lo confirme. No hay cobro ni modalidad de entrega inventada.

La identidad visual usa verde oscuro y negro, con superficies claras verdosas. El movimiento editorial está documentado en `MOTION-AUDIT.md` y respeta la preferencia de movimiento reducido del sistema.

## Datos pendientes

La imagen de carta compartida cubre cafetería, fríos, bebidas frías, filtrados, té y vermú. Faltan las páginas de pastelería, laminados, salados y cualquier producto para comprar. Faltan también fotografías propias del local y los productos, y un archivo maestro del logo en alta resolución. Los precios y la disponibilidad deben confirmarse antes de uso público.
