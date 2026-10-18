# BRAICO — Decisiones técnicas para prototipo B

**Estado:** demo privada local. Arquitectura **HTML semántico + CSS nativo + JavaScript sin dependencias**. Build opcional de copia estática Node.js.

## Requisitos que explican la decisión
- URL única con estética editorial, menú filtrable, búsqueda, selección y generación de texto para consulta.
- No hay backend, autenticación, stock, cobro, precios actuales ni número verificado para pedidos.
- Publicación y SEO no solicitados. `noindex,nofollow` evita indexar accidentalmente la demo.
- Usuarios posiblemente móviles: menos JS y sin frameworks ni imágenes falsas.

## Alternativas
| Alternativa | Ventaja | Por qué no se eligió para demo |
|---|---|---|
| HTML/CSS/JS | Cero dependencias, abre en una computadora, simple para venta comercial local | **Elegida**; suficiente para el alcance actual |
| Astro | SEO y contenido compilado en producción, optimización por página | Buena evolución cuando se publique con contenido confirmado, innecesario ahora |
| React/Vite | Estado y componentes complejos | Demasiada infraestructura para selección de consulta y una sola página |
| Next.js/Supabase | SSR/backend y panel | No hay requisito real confirmado para un panel o sistema de pedidos |

## Reglas operativas
- Selección: memoria local del navegador cuando esté disponible. No se sincroniza, no es una transacción.
- Compartir: mensaje codificado para WhatsApp **sin destinatario**. La app no envía un pedido ni asume su recepción; copiar es alternativa.
- Precios, stock y horarios: deliberadamente sin cifras vigentes, con advertencia visible.
- Imágenes: WebP optimizadas recuperadas del PDF; falta autorización para publicación.
- Seguridad: sin secretos, API, registros de usuarios ni cobros. El código estático no debe fingir confirmación externa.
- Deploy: ninguno. Si se decide publicar, entrar a Signature Launch, confirmar permisos, datos y hosting.

## Reproducibilidad
`cd site && npm run dev` -> servidor Node local 4173 sin dependencias. `npm run build` -> `dist/`, más HTML autónomo `Braico-B-Preview.html`. `npm run test` usa Playwright/Chromium local y reporta limitaciones del navegador.


## Decisión específica B4
No instalar Three.js ni librerías de motion para este prototipo: las capas foto generadas se muestran como 8 PNG con CSS transforms/opacity y JavaScript mínimo; el `range` permite control progresivo del movimiento. El efecto es pseudo-3D, no un modelo 3D geométrico. La selección y el catálogo son los mismos de B3. A futuro solo justificar WebGL si el cliente proporciona los assets y se necesita perspectiva 3D físicamente coherente. El sitio actual debe mantener bajo peso y carga local sin redes.
