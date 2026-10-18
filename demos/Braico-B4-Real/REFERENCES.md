# Braico — Laboratorio de referencias
**Estado:** selección de principios, no clonación. P1 significa prioridad visual. Instagram inaccesible durante el relevamiento.

| Ref | Estado | Evidencia aprendida / aplicada | No copiar |
|---|---|---|---|
| P1: carta BRAICO DIC 2025 (4 pp) | **verificada visualmente** | Verde forestal y rojo, logo manuscrito, nombre/homenaje, banderolas, sandwiches reales, foto de esquina y grilla editorial de productos | No copiar maquetación completa del PDF ni reclamar logos como propios |
| El Eco de Tandil, nota de 27/06/2025 | verificada (texto + fotos) | La historia barrial y los nombres de vecinos inspiran un relato de herencia REAL, no italianidad decorativa | No copiar textos ni fotografías periodísticas |
| Tandil Turismo, ficha Braico | verificada (texto) | Datos operativos, ubicación y oferta/al paso → CTA «Cómo llegar», carta, consulta | No hacer del sitio un directorio turístico |
| Zingerman's Deli /menus | verificada (texto), visual no inspeccionado | Agrupar el menú por objetivos de usuario y permitir acceder directo a sandwiches vs otros alimentos | No copiar interface ni promociones |
| All'Antico Vinaio oficial | verificada (texto), visual no inspeccionado | Dar relevancia a menú y locación con producto protagonista; inspiración por modelo de sandwichería | No copiar marcas, fotos o estética |
| Instagram @braico.tandil | NO VERIFICADA | Canal de referencia aportado por usuario; requiere capturas para validar diseño actual del feed | No inferir posts, campañas ni seguidores |

## Matriz de traducción P1 → diseño (3 caminos)
| Variable | A · El álbum de la esquina | B · Los nombres en grande | C · Esquina 195 |
|---|---|---|---|
| Composición | Editorial asimétrica con foto de fachada a derecha | Tipografía protagonista enorme + sandwich cortado en diagonal | Fotografía oscura enmarcada y mapa/rótulo de calles como recorrido |
| Escala | Serif display cálida + microdatos de archivo | Grotesca/condensada expansiva y cintas tricolores | Display condensada tipo señalética + secuencias de coordenadas |
| Fotografía | Fachada y productos como documento de historia | Sandwich macros de primera escena | Fachada, paisaje de esquina, detalle de vitrina |
| Espacio negativo | Blanco/crema amplio para relato | Verde masivo, superposición fuerte | Oscuro nocturno y columnas geométricas |
| Ritmo | Lectura como revista por capítulos | Golpe visual y selección inmediata de productos | Trayecto: dónde → qué → acercate |
| Mobile | Historia y CTA primero, foto debajo | Titular en 3/4 líneas y foto ocupando centro | Dirección y acción para visitar siempre visibles |
| CTA | Conocé los homenajes | Explorá los sándwiches | Abrí la carta / cómo llegar |


## B3 · Laboratorio de efectos e interacciones (18/10/2026)

| Ref | Observado / documentación | Adaptación Braico | No copiar / estado |
| --- | --- | --- | --- |
| https://tympanus.net/codrops/2016/11/23/tilt-hover-effects/ | Tilt sobre imágenes por capas | Hero con tilt mínimo y perspectiva sobre foto auténtica | No clonar composiciones, ni paquetes de fotos ajenas; documentación consultada |
| https://tympanus.net/codrops/2021/04/28/rotated-3d-letters-and-image-hover-effect/ | Menú tipográfico con imagen y rotación 3D | Nombre del homenaje aparece como ficha que entra al mostrador | No copiar código, documentado por autor |
| https://gsap.com/docs/v3/Plugins/ScrollTrigger/ | Revelaciones vinculadas al viewport y scrub | Revelación de titulares y grilla cuando entran al viewport | Sin librería porque nativo alcanza; API oficial verificada |
| https://motion.dev/docs/inview | inView basado en IntersectionObserver | Entrada una sola vez para titulares/secciones | Implementación propia sin importar Motion |
| https://ui.shadcn.com/docs/components/base/drawer | Componente drawer adaptable a mobile | Se conserva el cajón de selección accesible existente | No se copia UI ni instala React; documentación oficial |
| https://tympanus.net/codrops/2015/05/28/image-tilt-effect/ | Profundidad simulada con capas | Exploración gráfica propia de ingredientes de CARLITOS usando CSS 3D | No asset externo ni foto falsa |

**Motivo firma:** receta gráfica de Carlitos que se separa y se junta. Ingredientes exactos tomados de la carta de dic 2025. La visualización es abstracta, no un sandwich real ni una promesa de preparación. CSS 3D, no WebGL.
