# Handoff — Cantina Pink
**Estado:** Propuesta, requiere aprobación.

## Fuente de verdad
Leer BRAND.md antes de implementar y usar design-tokens.css; CONTENT.md es provisional. No reemplazar contenido sin verificación ni asumir que colores propuestos son los originales.

## Rutas / secciones
- `/`: hero, especialidades confirmadas, breve historia, galería real, ubicación, contacto.
- `/carta`: categorías ancladas, lista de ítems reales, descripción, variantes, precios y advertencias verificadas. Prohibido inventar productos.
- `/visitanos`: horarios oficiales, mapa con enlace externo, canal de consulta para grupos.

## Datos
Entidad `menu_category`: id, name, order, source, updated_at.
Entidad `menu_item`: id, category_id, name, description:null|string, price:null|number, variants:[], availability:null|bool, source, verified_at. `null` significa no publicado o no verificado, nunca 0.
Entidad `business_info`: address, phone, opening_hours, contact_links, booking_policy, updated_at, verified_by.

## Interacciones
- Botón carta navega a catálogo.
- Contacto abre canal oficial solo cuando su enlace esté confirmado.
- Consultas de grupos son consultas, no reservas confirmadas.
- Filtros y anchors accesibles por teclado, con estado activo visible.
- Errores: mostrar mensaje «No pudimos cargar la carta. Volvé a intentar» y reintentar; estado vacío deliberado sin productos inventados.

## Calidad exigida
- 360px, 390px, 768px, 1280px, 1440px sin scroll horizontal.
- Touch >=44px, contraste WCAG AA, foco visible, navegación por teclado, imágenes alt útiles.
- Modo `prefers-reduced-motion`; fuentes optimizadas y hero sin layout shift.
- QR, reservas con cupos, pagos, pedidos automáticos y stock NO están incluidos ni confirmados.

## Checklist de aceptación
- [ ] Cliente aprobó conceptos, tono, paleta y tipografías.
- [ ] Logo real auditado; no creado ni retocado silenciosamente.
- [ ] Fotos originales autorizadas, comprimidas y correctamente atribuidas.
- [ ] Horarios/contacto corroborados por negocio.
- [ ] Carta revisada ítem por ítem con el menú oficial.
- [ ] Estados de carga/error/vacío/teclado comprobados.


## Actualización con material visual 2026-10-23
La identidad actual utiliza mantel rojo/blanco, crema/borgoña, logotipo vintage contorneado, primeros planos de platos y piezas gráficas de humor. Aplicar los tokens v0.2 y usar fotografías individuales originales con permiso, no recortes de la captura del feed. La paleta fucsia anterior queda descartada.


## Corrección obligatoria v0.3
Los tokens finales **de esta versión** están en `design-tokens.css` / `brand.json`; descartar las variables rosas de versiones antiguas. No implementar pagos ni reservas en tiempo real sin backend y aprobación del cliente. Hero exige foto original. Usar `assets/` solo como referencia, no como asset de producción. CTA primario a carta validada y secundario a ubicación. Criterio de aceptación: aspecto reconocible aun sin logo, contraste AA para texto de interfaz, targets ≥44px, reduced motion operativo, carta sin precios inventados.
