# Guía para Codex / Claude Code

Trabajá en esta misma carpeta. Leer en este orden `BRAND.md`, `CONTENT.md`, `ASSETS.md`, `DESIGN.md`, `TECH-DECISIONS.md`, `PROTOTYPE-BRIEF.md`.

La versión B está aprobada. No revertir el hero, colores ni composición; la nueva **firma de marca** es el fichero de 18 homenajes con datos reales de diciembre 2025. No inventar biografías ni precios vigentes. La página es una demo privada.

Comandos: `npm run dev` (servidor); `npm run build` (dist + HTML standalone); `npm test` (Chromium Playwright). Para tests sin servidor: `python3 scripts/qa_signature.py`.

No crear repos ni publicar sin autorización. Si hay problemas de red o Chromium bloquea 127.0.0.1, no afirmar que la navegación HTTP fue verificada; revisar el HTML autónomo con `page.set_content` y marcar limitación.


## Iteración B4
El módulo #el-corte usa `assets/b4-corte.css`, `assets/b4-corte.js` y ocho PNG recortados `assets/layers/`. No modificar el catálogo para fingir precios. No cambiar la identidad B ni el fichero B2. Verificar los nuevos controles en desktop/mobile y con movimiento reducido. Ver `IMPLEMENTACION-B4.md` y `QA-B4.md`.
