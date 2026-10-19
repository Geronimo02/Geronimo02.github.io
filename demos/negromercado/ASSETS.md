# Negro Mercado — Activos S2

19/10/2026 · Inventario de referencias reales; permisos de redistribución pendientes.

Se revisaron Instagram, destacada MENÚ, Linktree y la galería de Google Maps (ver RESEARCH-REVISION.md). No se marca una foto como inexistente porque no esté licenciada: existe como referencia y falta el original/permiso.

| ID | URL | Tipo | Autor/titular conocido | Uso | Permiso/licencia | Atribución | Archivo | Estado |
|---|---|---|---|---|---|---|---|---|
| LOGO-01 | https://www.instagram.com/negromercado.ok/p/DeADrQuG6z8/ | logo/piezas | Negro Mercado; diseñador no identificado | header/identidad | Pendiente | A acordar | No incluido; destino: `logo.svg` | Solo referencia |
| MENU-01 | https://www.instagram.com/stories/highlights/17961471578727361/ | carta fotográfica | Negro Mercado; autor gráfico no identificado | datos carta | Pendiente | A acordar | No incluido; destino: `carta-oficial.webp` | Solo referencia |
| PHOTO-01 | https://www.instagram.com/negromercado.ok/reel/DalzASvJ5zP/ | video/fotografía producto | publicado por Negro Mercado; fotógrafo no identificado | hero/producto | Pendiente | A acordar | No incluido; destino: `hero-muffin-limon.webp` | Solo referencia |
| PHOTO-02 | https://www.instagram.com/negromercado.ok/p/DOEdP-dET8a/ | fotografía producto | publicado por Negro Mercado; fotógrafo no identificado | pieza propia/historia | Pendiente | A acordar | No incluido; destino: `producto-alfajor-almendras.webp` | Solo referencia |
| PHOTO-03 | https://www.instagram.com/negromercado.ok/p/DRFYnmaDSnz/ | fotografía/proceso | publicado por Negro Mercado; fotógrafo no identificado | oficio | Pendiente | A acordar | No incluido; destino: `oficio-laminados.webp` | Solo referencia |
| PHOTO-04 | https://www.instagram.com/negromercado.ok/p/DalYQoJMMQN/ | fotografía producto | publicado por Negro Mercado; fotógrafo no identificado | salados | Pendiente | A acordar | No incluido; destino: `producto-focca-vegana.webp` | Solo referencia |
| PHOTO-05 | https://www.instagram.com/negromercado.ok/p/DNrrfb62tpl/ | fotografía café | publicado por Negro Mercado; fotógrafo no identificado | café | Pendiente | A acordar | No incluido; destino: `producto-espresso.webp` | Solo referencia |
| PHOTO-06 | https://www.instagram.com/negromercado.ok/p/DN9AuXBkoqt/ | fotografía producto | publicado por Negro Mercado; fotógrafo no identificado | pastelería | Pendiente | A acordar | No incluido; destino: `producto-cookie.webp` | Solo referencia |
| PHOTO-07 | https://www.instagram.com/negromercado.ok/p/DP17siXkqhW/ | fotografía bebida | publicado por Negro Mercado; fotógrafo no identificado | bebida especial | Pendiente | A acordar | No incluido; destino: `bebida-especial.webp` | Solo referencia |
| PLACE-01 | https://www.google.com/maps/place/?q=place_id:ChIJURFvL-kfkZURd40Hh7qqF0E | fotografía interior | Martin Silveira · Maps · feb 2024 | local/barra | Pendiente | A acordar | No incluido; destino: `local-barra.webp` | Solo referencia |
| PLACE-02 | https://www.google.com/maps/place/?q=place_id:ChIJURFvL-kfkZURd40Hh7qqF0E | fotografía esquina | German Torres · Maps · sept 2024 | local/visita | Pendiente | A acordar | No incluido; destino: `local-esquina.webp` | Solo referencia |
| PLACE-03 | https://www.google.com/maps/place/?q=place_id:ChIJURFvL-kfkZURd40Hh7qqF0E | fotografía fachada | Mudanzas juani ariel carabajal · Maps · oct 2026 | ubicación | Pendiente | A acordar | No incluido; destino: `local-fachada.webp` | Solo referencia |

## Inspección y calidad
- PHOTO-01: imagen 1320×2347, muffin en manos sobre negro, inspeccionada localmente. Vertical fuerte para portada mobile; no fabricar versión horizontal expandiendo el producto.
- PHOTO-04: imagen 1440×1920, focca en manos, inspeccionada localmente. Textura y producto llenan casi todo el encuadre; no colocar texto pequeño sobre el relleno.
- PHOTO-03: imagen 1440×1440, laminado sobre plato blanco, madera y verde, inspeccionada localmente. No es foto del equipo elaborando, aunque su caption describa el proceso.
- MENU-01: dos páginas de 640×1138 leídas. Aptas como fuente de transcripción; poco convenientes como carta de imagen en móvil. Se guarda texto estructurado, no copia gráfica pública.
- PHOTO-02/05/06/07: candidatos localizados en publicaciones oficiales/feed; falta inspección final del original seleccionado.
- PLACE-01/02: foto histórica de barra y esquina; PLACE-03: fachada publicada en oct 2026. No confundir fecha de publicación con fecha de toma. Fuente y autor en manifest.

## Estado de entrega
Los archivos `content/menu.json`, `content/copy.json` y `content/media-manifest.json` son el paquete persistente. Las imágenes de investigación permanecen temporales, fuera del repositorio público. No existe todavía un paquete fotográfico licenciado. Los nombres de destino no se presentan como archivos ya existentes.

## Optimización al recibir originales
- Fotos: conservar original autorizado; exportar WebP/AVIF, desktop 1600–2000 px y mobile 800–1000 px según encuadre, sin ampliar una fuente pequeña.
- Hero mobile puede usar vertical dedicado; no forzar un único recorte para 1440 y 390.
- Logo: SVG original del titular, no trazado automático desde avatar. Fuentes/íconos: registrar licencia cuando se seleccionen en S3.
- Alt: describir el encuadre real, sin inventar ingredientes, manos/personas, sucursales o certificaciones.
- Videos: poster estático, sin autoplay con audio, respetar reduced motion; no extraer una pista musical sin licencia.

## Derechos y plan B
No hay autorización aportada para redistribuir fotos o capturas de terceros en una rama pública. Las fuentes de marca tampoco prueban que quien publica sea el titular de todas las fotos. Registrar permiso, alcance, fecha y atribución al recibirlo. Las fotos con personas reconocibles requieren revisión adicional.
Plan B de demo: presentar referencias enlazadas en Concept y producir un fondo abstracto propio si hace falta; no generar el local, el alfajor ni el muffin como si fueran fotos del negocio. No se generaron imágenes en S2.

## Assets de exploración S3
Dos WebP generados y dos fuentes OFL en concept/assets/, procedencia en PROVENANCE.md. REPRESENTACION rotulada, no fotos reales del negocio. Incluidos en los HTML offline. Originales/licencias de fotos reales siguen pendientes.

## Revisión C
Símbolo JPEG del usuario intacto; croissant-split.webp generado con alpha; direction-c-artwork.webp boceto generado; motion-study.mp4 estudio audiovisual de 5s, no captura del HTML. Fuentes ya licenciadas. Ver concept/REVISION-02.md.
