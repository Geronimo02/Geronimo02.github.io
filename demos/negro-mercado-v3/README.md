# Negro Mercado v3

Rediseño sobre la base de `demos/negro-mercado-ferea` (no la modifica). Pedido en mesa por QR, pensado para consumir en el local: **no hay delivery ni cobro online**.

## Cómo funciona

1. Cada mesa tiene un QR con su número y un código propio (`/mesa/7/?k=…`). El código es un HMAC del número de mesa: sin el secreto del Worker no se puede inventar el QR de otra mesa.
2. La persona escanea, ve la carta con el chip «Mesa 7», suma productos y envía el pedido. Puede seguir el estado (recibido, en preparación, listo, entregado).
3. El pedido llega al **panel del salón** (`/panel/`, con PIN): tablero Nuevos / En preparación / Listos, número de mesa grande, aclaraciones, aviso sonoro y botones de estado.
4. Desde el panel también se edita la carta (precios, «hay / no hay», agregar productos), la cantidad de mesas y se imprimen los QR.

Los precios se recalculan en el servidor con la carta de la base: lo que mande el navegador no cambia el total. Los productos sin precio quedan como borrador y no se pueden pedir.

## Estructura

- `src/`: sitio (React + Vite). `Home`, `Carta`, `Pedido`, `Productos`, `Panel`.
- `worker/index.js`: API (Cloudflare Worker + D1) y entrega del sitio.
- `db/schema.sql`, `db/seed.sql`: tablas y carta inicial (transcrita de la carta compartida el 23/10/2026; precios a confirmar con el local). Incluye borradores sin precio de café de especialidad (Chemex, cold brew, affogato, café en grano) para que el local los complete desde el panel.

## Probar en local

```bash
npm install
cp .dev.vars.example .dev.vars
npm run build
npm run db:local
npx wrangler dev
```

Panel: `http://127.0.0.1:8787/panel/` (PIN de `.dev.vars`). Los QR salen de la pestaña «Mesas y QR».

## Publicar (requiere tu cuenta de Cloudflare)

Antes de publicar: `npm run check:deploy` arma el sitio y simula el deploy sin subir nada.

```bash
npx wrangler d1 create negro-mercado          # copiar database_id en wrangler.jsonc
npm run db:remote                             # crea tablas y carga la carta inicial
npx wrangler secret put PANEL_PIN
npx wrangler secret put TABLE_SECRET
npm run deploy
```

Después, entrar a `/panel/`, ajustar la cantidad de mesas e imprimir los QR. Cambiar `TABLE_SECRET` invalida los QR impresos.

## Seguridad

- El PIN del panel se compara en tiempo constante y se bloquea una IP tras 10 intentos fallidos en 10 minutos.
- El panel queda cerrado si no existe `PANEL_PIN`.
- El pedido valida mesa, código, producto, opción, stock y cantidades; ignora los precios que mande el navegador.
- Hay límite de pedidos por IP (8 por minuto). Es una defensa adicional por instancia del Worker; para un límite estricto usar las reglas de rate limiting de Cloudflare.

## Pendiente

- Confirmar precios, disponibilidad y productos de café de especialidad con el local.
- Fotos propias y logo maestro; la tipografía de títulos (Baloo 2) es un reemplazo.
- El tablero se actualiza por consulta cada 4 segundos (sin websockets). Alcanza para un salón; si crece, pasar a Durable Objects.
- Falta definir con el local cómo se paga y si se usa impresora de comandas.
