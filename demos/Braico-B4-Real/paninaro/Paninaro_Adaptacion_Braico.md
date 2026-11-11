# Braico → Paninaro: cambios listos para implementar

**Dirección:** conservar la composición de Braico que aparece en el video aportado. **Versión:** 1.0, 2026-11-11. El trabajo de esta entrega es identidad y contenido de adaptación; el código fuente de Braico no fue aportado.

## 1. Cabecera e identidad

- Logo: `assets/originals/paninaro-logo-crema.png`.
- Símbolo: `assets/originals/paninaro-emblema-footer.png`.
- Tokens de aplicación: `design-tokens.css`.
- Navegación propuesta: **La carta · Santo Stefano · Los locales · Catering**.
- CTA principal: **Pedir en Glovo**, al enlace exacto de `content/channels.json`.
- Conservar el peso de la tipografía, el aire, la retícula y la escala del diseño existente. El kit identifica la tipografía observada de Paninaro para resolverla al integrar; no cambia silenciosamente toda la estructura.

## 2. Hero

**Copy propuesto:**

> ELIGE TU SANTO.
>
> Schiacciata toscana, salumi y formaggi. Descubre los ingredientes de cada receta y encuentra tu próxima focaccia.

CTA: **Ver la carta** · **Pedir en Glovo**.

La foto de portada oficial está en `paninaro-hero-focaccia.jpg`. El recorte debe mantener visibles las dos mitades del sándwich y el relleno. No etiquetar esa foto como Santo Stefano sin confirmación del negocio; para la ficha sí usar la imagen asociada al producto en Glovo.

La banda de nombres de Braico puede usar los nombres del catálogo escogido. Si se usa la edición PDF: Santo Stefano, San Giovanni, San Lorenzo, San Siro, Santa Maria, Santa Rosalia, San Ambrosio, San Michele, San Rocco y San Giuseppe. No mezclarla silenciosamente con las variantes nuevas de Glovo.

## 3. Sección interactiva

**Carlitos → Santo Stefano.**

Ingredientes publicados: **mortadella, burrata, pesto de pistacchio** en schiacciata toscana. Archivo completo: `content/interactive-product.json`.

**Copy propuesto:**

> SANTO STEFANO,
> CAPA A CAPA.
>
> Mortadella, burrata y pesto de pistacchio. Explora los ingredientes de esta schiacciata.

Orden visual propuesto: tapa de schiacciata → pesto de pistacchio → burrata → mortadella → base. El orden físico, cantidades, grosor y técnica de montaje no se publican; el negocio debe validarlos si la representación pretende ser exacta.

### Material disponible y piezas que faltan

- Disponible: fotografía real del producto completo, `paninaro-santo-stefano-glovo-original.jpg`.
- Disponible: nombres y lista de rellenos confirmados en dos fuentes.
- Pendiente: piezas independientes transparentes para una animación de desarmado realista. No están publicadas por la marca.
- Aplicación inmediata honesta: usar la foto real con controles que explican cada ingrediente. En la siguiente fase se pueden producir capas ilustrativas coherentes, identificadas como representación, o solicitar una sesión fotográfica del montaje.

No reutilizar el Carlitos de Braico cambiándole el nombre; sus ingredientes y su imagen no representan Santo Stefano.

## 4. Tres fichas para la primera adaptación

| Producto | Ingredientes publicados en carta | Carta PDF Verano 2026 | Glovo observado 2026-11-11 |
|---|---|---:|---:|
| Santo Stefano | Mortadella, burrata, pesto de pistacchio | 12,50 € | 14,50 € |
| Santa Maria | Porchetta DOP, crema de patata asada, scamorza affumicata, salsa de mostaza | 12,50 € | 14,50 € |
| Santa Rosalia | Parmigiana de berenjena, pesto, albahaca, Parmigiano Reggiano [V] | 12,50 € | 14,50 € |

Selección editorial `proposed`, no ranking comercial. La carta se transcribió en `content/products.json` (52 productos únicos). El catálogo Glovo se conserva separado en `content/glovo-products.json` (27 productos observados), con diferencias de surtido y precio.

**Regla de implementación:** decidir explícitamente qué canal representa una pantalla. Para una demo comercial inicial se puede omitir el precio y enlazar a Glovo, o mostrarlo con su fuente y fecha. No usar 12,50 € como promesa de precio de entrega.

## 5. Dos ubicaciones

**Copy propuesto:** `NOS VEMOS EN EL BORN. O EN GRÀCIA.`

| Local | Dirección publicada | Teléfono | Acción |
|---|---|---|---|
| Born | C/ Rec, 18, Barcelona | +34 934 596 443 | Cómo llegar · Llamar |
| Gràcia | C/ Sèneca, 33, Barcelona | +34 937 933 072 | Cómo llegar · Llamar |

Contenido en `content/locations.json`. Horarios: no confirmados en las fuentes primarias, no imprimir horarios supuestos. El enlace Maps de Born viene del sitio; una búsqueda de Maps por dirección para Gràcia se identifica como enlace construido, no ficha oficial verificada. No se inventan fachadas ni se comparte una foto de un local entre ambos.

## 6. Pedidos y catering

- **Pedir en Glovo:** `https://glovoapp.com/es/es/barcelona/paninaro-barcelona/` (enlace publicado; redirige a la tienda con `/stores/`).
- **Ver catering:** `https://catering.soypaninaro.com/es/`.
- **Contacto:** `mailto:ciao@soypaninaro.com`.
- **Instagram:** `https://www.instagram.com/soypaninaro/`.

El sitio publica un único enlace de delivery. Glovo resuelve cobertura y entrega cuando la persona informa su dirección. No se afirma que ese enlace asigne un local concreto.

**Mi selección de Braico:** reemplazar su acción principal por el acceso a Glovo. Una selección local no puede transferirse automáticamente al carrito de Glovo con el enlace observado. No se implementa un checkout propio ni se presentan consultas como pedidos confirmados.

## 7. Qué recibe el implementador

Identidad original, fotografías grandes, catálogo estructurado, textos, canales, locales, tokens y especificación de Santo Stefano. Los cambios se aplican sobre el repositorio real de Braico cuando esté disponible; esta entrega no modifica ni publica una web.
