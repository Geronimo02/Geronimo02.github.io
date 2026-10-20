# Las Pizzas del Tano — Proyecto web

**Rubro:** pizzería estilo napoletano · **Ciudad:** Tandil · **Contacto:** WhatsApp +54 249 424-1071 (público del local)
**Plan:** P3 carrito + pedido por WhatsApp (antes P2; cambio pedido por Gero el 17/10/2026) · **Estado del sitio:** DEMO (prospecto)
**Entrega comprometida:** —
**Carpeta / repo:** `Desktop\WEBS\las-pizzas-del-tano` · destino demo: `Geronimo02.github.io/demos/las-pizzas-del-tano/`

## Qué trajo el cliente
- Logo: no (se usa el wordmark público: ola.click 475 px raster; IG avatar)
- Brand kit: no → armado en etapa 1
- Fotos: no → se usan las fotos "Del propietario" de Google Maps y las de producto de ola.click (hotlink, provisorio)
- Dominio: — [CONFIRMAR si tienen]
- Redes / ficha de Google: @laspizzasdeltano (15,7 mil, verificado) · Google 4,7 (599 reseñas) · laspizzasdeltano.ola.click

## Etapas
| # | Etapa | Estado | Salida | Aprobado | Nota |
|---|---|---|---|---|---|
| 0 | Alta | ✅ | PROYECTO.md | 16/10/2026 (supuesto) | Plan P2 + DEMO asumidos por Claude; Gero puede cambiarlo |
| 1 | Marca (brand-kit) | ✅ | brand-kit/brand.json, brand-kit/BRAND.md | pendiente | |
| 2 | Contenido (signature-content) | ✅ | CONTENT.md, content/pedido-cliente.md | pendiente | pedido sin enviar |
| 3 | Diseño y build (signature-web) | ⏸️ | DESIGN.md, site/index.html | pendiente: dirección + preview | dirección A; 2 vueltas de capturas 1440/768/390 sin overflow ni errores JS |
| 4 | Entrega (signature-launch) | ⬜ | | | requiere aprobación (repo, DNS) |

## Ahora
- Etapa: 3 · Paso: preview lista para revisar · Próxima acción: Gero aprueba dirección/preview → pasar a demos/ del portfolio (signature-launch)

## Decisiones
- 17/10/2026 — Sección "Acá se brinda por el Diego": foto que pasó Gero, recortada (rembg u2net_human_seg) y animada como sticker con burbujas en la copa — Gero
- 17/10/2026 — Hero con el neón de la entrada (dirección C) + cartel ABIERTO en neón verde / CERRADO en neón rojo; el resto queda como A. Versión del horno guardada en site/index-horno.html — Gero
- 17/10/2026 — Pasa a P3: el pedido se arma en la web (comanda) y se manda por WhatsApp, sin redirigir a ola.click — Gero
- 17/10/2026 — En DEMO la comanda no envía al WhatsApp real: muestra el mensaje (Flujo Maestro §7). Para producción: CONFIG.demo=false con el número confirmado — Claude
- 16/10/2026 — Plan P2 + DEMO, pedido derivado a ola.click/WhatsApp (ya lo usan) — Claude (supuesto, a validar por Gero)
- 17/10/2026 — Se suma la referencia Domenica (Behance, pasada por Gero): pliegos editoriales en "Las de la casa" — Gero
- 16/10/2026 — Dirección A "Leña bajo el cartel de hierro" — Claude (el usuario pidió ejecución autónoma)

## Pendientes del cliente
- [ ] **Derechos de imagen de Maradona**: la foto y el uso comercial de su imagen los controla la sucesión; confirmar que el local tiene permiso o cambiar por ilustración propia antes de producción
- [ ] Logo original (vector o PNG grande) — hay dos versiones públicas distintas (ver brand kit)
- [ ] Confirmar precios (capturados 16/10/2026 en ola.click)
- [ ] Precio y regla de "pizza por mitades" (hoy no se puede sumar a la comanda)
- [ ] Costo y zona de envío; si aceptan pedidos agendados por WhatsApp; número de WhatsApp para pedidos
- [ ] Originales de las fotos (las de Google están comprimidas)
- [ ] Historia: desde cuándo, quiénes (5 preguntas al dueño)

## Provisorios a reemplazar
- [ ] "Las de la casa": las fotos de ola.click son pizzas en caja; para el recorte en círculo pedir fotos cenitales sin caja (Messi, Tana, Sicilia, Asadito, Margherita)
- [ ] Imágenes hotlinkeadas a lh3.googleusercontent.com y assets.olaclick.app → bajar originales a /img en launch
- [ ] Wordmark "Tano" en tipografía Young Serif hasta tener el logo vectorizado

## URLs
- Preview: (artifact)
- Producción: —

## Mantenimiento
- Plan: ninguno
