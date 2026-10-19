# Negro Mercado — Contenido para la demo

Signature Content · S2 v0.1 · Relevado 19/10/2026 · Base: BRAND.md v0.2 aceptado.

**Estado:** paquete editorial y datos preparados para revisión. Material fotográfico real localizado e inspeccionado en parte; originales/derechos pendientes. No es aprobación de publicación ni selección de dirección artística. La carta se transcribió como investigación, no como lista de precios garantizada para venta.

## Objetivo y datos del negocio
El visitante debe reconocer Negro Mercado, tentarse con café/pastelería/salados/vermut, consultar la carta y resolver visita o consulta para llevar.

- Nombre: Negro Mercado.
- Categorías oficiales: cafetería de especialidad, vermutería y pastelería.
- Dirección: Avellaneda 702 y 9 de Julio, Tandil.
- Horarios: lunes a viernes 07:30–20:30; sábados y domingos 09:00–20:30. Feriados: [CONFIRMAR].
- WhatsApp publicado: https://wa.me/5491126587740. Número coherente con ficha Maps; no se envió mensaje.
- Instagram: https://www.instagram.com/negromercado.ok/
- Linktree: https://linktr.ee/Negro_Mercado_Tandil
- Carta fuente: https://www.instagram.com/stories/highlights/17961471578727361/
- Google Maps: enlace original en SOURCES.json (F02); utilizar ficha de Avellaneda, no un pin de otra sede.
- Consumo en local y para llevar: publicados por Maps/Linktree. Entrega a domicilio no ofrecida según ficha; no se auditó proveedor externo.
- Marca renovada: respetar símbolo/wordmark vigente, sin rediseñar. Familias y HEX exactos pendientes del master.
- Proveedores nombrados por carta: Las Dinas, Provoleta de Verdad y La Fuerza. No extender a exclusividad ni contrato actual fuera de la carta.

## Fuentes y prioridad
1. Carta oficial observada en dos imágenes, 19/10/2026: nombre, importe y descripción de venta.
2. Bio, Linktree y ficha Maps leídos directamente: ubicación, horarios y canales.
3. Posts oficiales: historia del alfajor, proceso de laminados y detalle de producto, con fecha/vigencia pendiente cuando no explícita.
4. Fotos de Maps: contexto espacial, con autor/fecha; no permiso de reutilización.

Ver RESEARCH-REVISION.md para URLs de cada pieza. No hacer otra ronda de investigación general sin un faltante concreto.

## Inventario
| Contenido | Estado | Fuente | Uso y límite |
|---|---|---|---|
| Dirección, categorías y horarios | ✅ texto relevado | R01/R05 | confirmar feriados antes de publicar |
| Enlaces de contacto | ✅ destino publicado | R04 | consulta; no transacción probada |
| Carta | 🟡 transcrita, 65 registros | R02 / content/menu.json | validar tamaños/columnas, precios y subopciones con local |
| Textos por sección | ✅ propuesta editorial | content/copy.json | redactados para esta demo; no citas oficiales |
| Foto protagonista producto | 🟡 referencia real inspeccionada | PHOTO-01 | vertical fuerte; falta permiso/original horizontal |
| Foto salados y laminados | 🟡 referencias reales inspeccionadas | PHOTO-04/03 | no confundir plato servido con proceso |
| Alfajor/café/cookie | 🟡 candidatos oficiales localizados | PHOTO-02/05/06 | inspeccionar original final y permiso |
| Local | 🟡 fotos Maps revisadas | PLACE-01/02/03 | pedir actuales tras reforma y autorización |
| Manos elaborando / proceso | 🟡 caption real; foto de proceso aún no seleccionada | post DRFYnmaDSnz | preparar toma propia; foto examinada es producto servido |
| Logo | 🟡 visto en identidad vigente | LOGO-01 | falta SVG/PNG original y permiso de usos |
| Reseñas | 🟡 tres referencias reales localizadas | Maps | falta permiso/selección para uso promocional; no incluir bloque por obligación |
| Reservas / catálogo de mercado / segunda sede | 🟡 antecedentes o sin flujo actual | BRAND.md | fuera del MVP sin confirmación |

✅ significa contenido utilizable editorialmente, no que el negocio aprobó su publicación. Permisos y vigencia se registran por separado.

## HERO CONTENT PACKAGE
**Mensaje propuesto:** “Un café en Negro.”
**Apoyo:** “Pastelería de la casa, algo salado y vermú. Encontranos en Avellaneda 702, Tandil.”
**Prueba real:** oferta declarada en bio/carrusel y carta; fotografía oficial de muffin partido en manos con textura y relleno, no imagen sintética.
**CTA principal:** Ver la carta → #carta.
**CTA secundario:** Cómo llegar → ficha Google Maps.
**Sujeto candidato:** café servido acompañado de pastelería real; PHOTO-01 aporta un enfoque de producto abierto como alternativa visual fuerte, sin imponer layout ni un único producto como identidad total.

- 1440: solicitar toma horizontal 16:9 del producto real en tercio derecho, 35–45% izquierdo con fondo despejado para texto; si solo existe el vertical, componer foto y texto como áreas independientes. No estirar ni inventar contenido fotográfico.
- 390: vertical 4:5 o 9:16 según propuesta, mantener pieza/manos completas y texto fuera de zonas de detalle. PHOTO-01 tiene fondo oscuro libre arriba; validar contraste y crop final en S3.
- Alternativa ilustrativa: fondo de luz/textura abstracta y composición tipográfica con marca autorizada, identificado como representación. Nunca simular una fotografía del local o plato.
- Conversión: acceder a carta o ubicación sin reproducir video obligatorio, completar formularios ni resolver una animación.

## Carta estructurada y control de vigencia
Paquete: [content/menu.json](content/menu.json). 65 registros incluyen cafés, leches vegetales como agregados, variedades de té, variantes de panificados, combos y brunch; no son 65 productos de stock confirmados.

Importes capturados el 19/10/2026. En la fuente se ven dos páginas y en la primera la interfaz indicaba 2 d. No se infiere fecha de entrada en vigor. Moneda ARS. Separador de miles visual: punto. Los guiones de la fuente se guardan como null, nunca como precio cero.

**Columnas de cafés/combos:** se conservan en orden. Las abreviaturas manuscritas no permiten asignar con seguridad chico/mediano/grande o simple/doble/triple; [CONFIRMAR] leyenda con negocio. No crear variantes vendibles con nombres inventados. Para expresado de naranja sí hay 350/500 ml explícitos. Las líneas de rellenos de medialuna/croissant se registran como variantes de producto con importe observado, sin tratarlas como recargos acumulables.

**Descripciones:** la carta prevalece sobre captions previos. Ejemplo: la focca vegana en la carta incorpora pasta de morrones ahumados, mientras un caption habla de aceite verde; no fusionar ambas recetas. Opciones keto/sin gluten/veganas son declaraciones publicadas, no certificación ni garantía de ausencia de contaminación cruzada.

| ID | Categoría | Producto | Importe ARS observado | Nota |
|---|---|---|---|---|
| nm-001 | cafeteria | Espresso | 4.200 / 4.900 / — |  |
| nm-002 | cafeteria | Espresso largo | 4.200 / — / — |  |
| nm-003 | cafeteria | Macchiato | 4.300 / 5.000 / — |  |
| nm-004 | cafeteria | Cortado chico | 4.500 / — / — |  |
| nm-005 | cafeteria | Cortado en vaso | 4.800 / — / — |  |
| nm-006 | cafeteria | Magic | — / 5.500 / — |  |
| nm-007 | cafeteria | Americano | — / 5.200 / — |  |
| nm-008 | cafeteria | Cappuccino | 5.200 / 6.500 / — |  |
| nm-009 | cafeteria | Cappuccino italiano | 6.000 / 7.000 / — | Chocolate amargo y canela. |
| nm-010 | cafeteria | Latte | 5.200 / 6.000 / — |  |
| nm-011 | cafeteria | Flat white | — / 5.800 / 6.800 |  |
| nm-012 | cafeteria | Mocaccino | 6.000 / 7.000 / — |  |
| nm-013 | agregados | Leche de almendras y dátiles | 1.500 |  |
| nm-014 | agregados | Leche de avena | 2.000 |  |
| nm-015 | filtrados | Filtrado V60 | 9.000 | Dos tazas. |
| nm-016 | cafes-frios | Aerocano | — / 6.000 |  |
| nm-017 | cafes-frios | Coffee tonic | — / 7.500 |  |
| nm-018 | cafes-frios | Iced latte | 5.500 / — |  |
| nm-019 | cafes-frios | Vainilla latte | 6.000 / — |  |
| nm-020 | cafes-frios | Iced flat | — / 6.500 |  |
| nm-021 | cafes-frios | Mocca | 7.000 / — |  |
| nm-022 | cafes-frios | Red matcha latte | 8.000 / — |  |
| nm-023 | te | Black tea | 6.000 |  |
| nm-024 | te | Black tea con naranjas y flores de azahar | 6.000 |  |
| nm-025 | te | Chai | 6.000 |  |
| nm-026 | te | Hibiscus | 6.000 |  |
| nm-027 | te | Ginger green tea | 6.000 |  |
| nm-028 | bebidas-frias | Pomelada con frutos rojos | 5.500 | 500 ml. |
| nm-029 | bebidas-frias | Limonada con menta y jengibre | 5.500 | 500 ml. |
| nm-030 | bebidas-frias | Exprimido de naranja | 5.500 / 6.000 | 350 / 500 ml. |
| nm-031 | bebidas-frias | Licuado de banana, frutilla o naranja y durazno | 6.500 |  |
| nm-032 | bebidas-frias | Licuado detox | 7.000 | Espinaca, ananá, manzana verde, pepino, limón y jengibre. |
| nm-033 | bebidas-frias | Agua con o sin gas | 3.500 | 500 ml. |
| nm-034 | vermu | Vaso de vermú La Fuerza | 8.000 | Rojo, blanco o primavera con soda. |
| nm-035 | vermu | La Fuerza de compartir | 39.000 | Botella de rojo, blanco o primavera con dos sifones. |
| nm-036 | pasteleria | Medialuna dulce | 2.200 |  |
| nm-037 | pasteleria | Medialuna con pata ahumada y provoleta | 6.000 | Pata ahumada Las Dinas y Provoleta de Verdad. |
| nm-038 | pasteleria | Croissant | 5.000 |  |
| nm-039 | pasteleria | Croissant con pata ahumada y provoleta | 10.000 | Pata ahumada y Provoleta de Verdad. |
| nm-040 | pasteleria | Croissant con huevo y palta | 14.900 | Huevo, palta, rúcula y parmesano. |
| nm-041 | pasteleria | Cookie doble chocolate | 5.500 |  |
| nm-042 | pasteleria | Cookie vainilla | 5.500 |  |
| nm-043 | pasteleria | Pepa de frutos rojos y pistachos | 7.500 |  |
| nm-044 | pasteleria | Alfajor de almendras | 7.800 |  |
| nm-045 | pasteleria | Muffin de zanahoria | 5.000 |  |
| nm-046 | pasteleria | Muffin de limón | 6.700 |  |
| nm-047 | pasteleria | Brownie húmedo de chocolate 60% y nuez | 8.000 |  |
| nm-048 | pasteleria | Chipá | 3.000 |  |
| nm-049 | pasteleria | Scon de queso | 5.800 |  |
| nm-050 | tostados-y-sambuches | Jamón y queso | 15.900 | Pata ahumada Las Dinas y Provoleta de Verdad en pan de molde. |
| nm-051 | tostados-y-sambuches | Veggie | 14.900 | Provoleta de Verdad, huevo a la plancha, tomates confitados y albahaca fresca en pan de molde multicereal. |
| nm-052 | tostados-y-sambuches | Pesto | 14.000 | Provoleta de Verdad y pesto de albahaca, nuez y parmesano en pan de molde multicereal. |
| nm-053 | tostados-y-sambuches | Focca crudo | 25.900 | Jamón crudo Las Dinas, tomates confitados, rúcula fresca y manteca de hierbas en pan de focaccia. |
| nm-054 | tostados-y-sambuches | Focca vegana | 17.000 | Berenjenas, zucchinis y zanahorias en escabeche, verdes, tomate fresco y pasta de morrones ahumados en pan de focaccia. |
| nm-055 | desayunos-y-meriendas | Latte + medialuna | 6.800 / 7.800 |  |
| nm-056 | desayunos-y-meriendas | Latte + tostadas | 8.800 / 9.800 | Opción vegana. Queso crema y dulce artesanal, pasta de maní o miel casera. |
| nm-057 | desayunos-y-meriendas | Proteico | 12.500 | Huevos revueltos y palta con crema de yogurt y pasta de morrones ahumados + sésamo en tostón de pan de campo. Opción keto/sin gluten anunciada; alcance a confirmar. |
| nm-058 | desayunos-y-meriendas | Huevos turcos | 15.000 | Salsa de yogurt, aceite rojo, queso feta de oveja y ciboulette. |
| nm-059 | desayunos-y-meriendas | Yogurt | 14.500 | Granola casera, banana y compota de temporada. |
| nm-060 | desayunos-y-meriendas | French toast | 15.900 | Crema de vainilla y naranja, compota de temporada y pistachos en pan brioche. |
| nm-061 | desayunos-y-meriendas | Pancakes | 12.000 | Anunciados como keto. Pasta de maní, frutos rojos y coco rallado. |
| nm-062 | algo-mas-de-morfi | Tortilla de papa | 14.000 | Pasta de morrones ahumados. |
| nm-063 | algo-mas-de-morfi | Tarta del día | 16.500 |  |
| nm-064 | algo-mas-de-morfi | Omelette de espinaca y queso | 12.000 | Crema de yogurt. |
| nm-065 | brunch | Brunch zarpado | 66.000 | Dos latte medianos y dos jugos, o dos vermú. Yogurt con granola casera, banana y frutos rojos. Huevos turcos. Tostado a elección. French toast. Opcional sin gluten anunciado; confirmar condiciones. |

## Selección editorial para dar identidad
- **Alfajor de almendras:** historia concreta ligada a los comienzos; evita un “desde siempre” inventado.
- **Muffin de limón:** producto abierto y relleno visible; imagen propia de alto apetito.
- **Laminados:** textura, fermentación y trabajo comunicado por la marca; diferenciar foto del producto de foto de proceso.
- **Focca vegana:** contrapunto salado con descripción tomada de carta actual.
- **Café y vermú:** categorías permanentes publicadas; no sugerir que es un bar nocturno.

Matchamango, regalos, gift cards y aniversario quedan como material de publicaciones para validar; no se mezclan automáticamente con carta permanente.

## Copy por sección — propuesta, no citas

### hero
- **Titular:** Un café en Negro.
- **Bajada:** Pastelería de la casa, algo salado y vermú. Encontranos en Avellaneda 702, Tandil.
- **CTAs:** Ver la carta / Cómo llegar.
- **Fuente:** bio, carta, producto oficial y Avellaneda verificados.

### carta
- **Titular:** ¿Café, algo dulce o vermú?
- **Bajada:** Del espresso al alfajor de almendras. Explorá la carta de Negro Mercado y elegí qué te tienta.
- **CTA:** Consultar para llevar

### oficio
- **Titular:** Laminados, tiempo y manos.
- **Bajada:** Las medialunas y otros laminados llevan fermentación y seguimiento antes de pasar por el horno. En Negro, la pastelería también se cuenta desde su elaboración.
- **CTA:** Ver la pastelería
- **Fuente:** publicación oficial DRFYnmaDSnz; revisar original de proceso antes de asignar visual.

### almendras
- **Titular:** El alfajor que nos acompaña.
- **Bajada:** El de almendras está con Negro desde sus comienzos. Una pieza que fue cambiando hasta encontrar su versión de hoy.
- **CTA:** Encontralo en la carta
- **Fuente:** publicación oficial DOEdP-dET8a.

### local
- **Titular:** La esquina es Avellaneda y 9 de Julio.
- **Bajada:** Café, pastelería y vermú en Avellaneda 702, Tandil. Vení al local o consultanos por take away.
- **CTA:** Cómo llegar

### contact
- **Titular:** Para llevar, escribinos.
- **Bajada:** Consultá por WhatsApp qué hay disponible y coordiná tu retiro con el local.
- **CTA:** Consultar por WhatsApp

### footer
- **Datos:** Avellaneda 702 · Tandil; Lun–Vie 7:30–20:30 / Sáb–Dom 9–20:30; Instagram oficial.
- **Rótulo demo:** Propuesta de sitio para Negro Mercado · Demo no oficial.

## Estructura sugerida para que Concept decida composición
1. Apertura: producto real + marca renovada + carta/ubicación.
2. Selección de la casa: alfajor, muffin, café/salado; no obligar a una grilla uniforme.
3. Carta: categorías y acceso claro a consulta take away.
4. Elaboración: proceso de laminados y pieza con historia, combinables si mejora el ritmo.
5. La esquina: local actual, ubicación, horarios.
6. Cierre: consulta para llevar, Instagram y datos.

Este orden es de contenido, no wireframe aprobado. S3 puede cambiarlo preservando producto, identidad, conversión y fuentes. No hay referentes visuales P1 específicos del usuario; las piezas oficiales son evidencia de identidad.

## Datos y reglas funcionales
| Módulo | Campos / origen | Estados y reglas | Responsable / dependencia |
|---|---|---|---|
| Carta | id, categoría, nombre, descripción, variantes, ARS, fecha, stock desconocido; menu.json | filtros, vacío, precio pendiente, dato no disponible; no convertir null a 0 | local valida carta; frontend muestra solo datos válidos |
| Consulta WhatsApp | destino 5491126587740, texto precargado | encodeURIComponent; abre app/web; mensaje queda editable; éxito = apertura/intento, nunca pedido aceptado | usuario envía; local confirma |
| Ubicación | enlace F02, Avellaneda 702 | enlace externo accesible; alternativa con texto copiable si mapa no carga | sin API de disponibilidad ni ubicación del visitante |
| Horarios | semana/fin de semana publicados | no “abierto ahora” hasta definir feriados y timezone America/Argentina/Buenos_Aires | local actualiza excepciones |
| Media | manifest, autorización, alt, desktop/mobile | fallback explícito si falla; no cambiar producto por foto falsa | titular entrega originales/permiso |

**MVP:** carta navegable y consulta general. No necesita carrito para demostrar conversión. Si se propone preselección en S3, primero resolver variantes/precios; el resumen debe decir estimado y nunca confirmar stock ni entrega. Sin pagos, login, reservas con cupo ni inventario real. Quién mantiene carta/precios y frecuencia: [CONFIRMAR] con negocio antes de panel.

Mensaje precargado propuesto: “Hola, Negro Mercado. Quería consultar qué tienen disponible para llevar y cómo coordinar el retiro.” No envía mensajes automáticamente.

## Reseñas: referencias, no bloque aprobado
Tres reseñas públicas localizadas durante S1 en la ficha Maps aportada. Fechas relativas tal como las mostraba la interfaz el 19/10/2026; no se inventa día de calendario:
- Manuela Soler — “Hace 3 meses”: referencia a croissant de rúcula/palta/huevo y pago previo. Extracto: “Me encantó el croissant de rúcula palta y huevo”.
- katherine Cardenas — “Hace 3 meses”: café, tostadas, medialunas y muffin. Extracto: “La atención 10 puntos”.
- Rocio Ibarra — “Hace 6 meses”: variedad, atención y flat white. Extracto: “El flat white 10/10”.
Fuente común: ficha Google Maps F02, sección reseñas. Conservar autoría y no unir frases de distintas personas. No publicar testimonios promocionales sin revisar permiso/atribución; no hacen falta para rellenar la home. Puntuación dinámica: no se congela como garantía.

## Shot list: originales que resuelven el contenido
| # | Sección | Qué fotografiar | Encuadre / espacio | Luz / fondo | Formatos | Estado |
|---|---|---|---|---|---|---|
| 1 | Hero | Café servido y una pieza real de pastelería elegida por el local | producto a derecha, izquierda despejada; otra toma frontal | ventana lateral; fondo del propio local | horizontal 16:9 + vertical 4:5 | candidato real localizado; original horizontal pendiente |
| 2 | Pieza con historia | Alfajor de almendras entero y corte | cerca, detalle de relleno, sin texto superpuesto | misma ventana, mesa limpia | 4:5 + 1:1 | publicación localizada; original pendiente |
| 3 | Pastelería | Muffin de limón abierto | mano/producto completos, fondo oscuro libre | lateral suave, sin flash | 4:5 + 9:16 | referencia real inspeccionada |
| 4 | Salados | Focca vegana cortada | textura visible, evitar encuadre que tape producto con texto | fondo real oscuro | 4:5 + horizontal | referencia real inspeccionada |
| 5 | Oficio | Manos formando laminados / salida de bandeja | incluir utensilio/masa; no hace falta rostro | mesa de elaboración, luz disponible | 16:9 + 4:5 | toma de proceso no seleccionada |
| 6 | Local | Interior tras renovación, vista desde mesa y barra | sin caras identificables, conservar profundidad | de día, luces reales | horizontal + vertical | Maps histórico como referencia; actual pendiente |
| 7 | Ubicación | Fachada desde Avellaneda y expansión hacia esquina | cartel/entrada y entorno; sin matrículas ni menores | mañana o tarde sin contraluz fuerte | 16:9 + 4:5 | foto publicada oct 2026 localizada; permiso pendiente |
| 8 | Vermú | Vaso servido como lo entrega el local | plano mesa con bebida y ambiente | luz real lateral, sin inventar garnish | 4:5 | original de producto pendiente |

Tips: limpiar lente, usar luz de ventana sin flash, acercarse en vez de zoom digital y compartir originales por enlace/archivo sin compresión. No es necesario pedir rostros del equipo para humanizar.

## Plan B de demo
No se generaron fotos ni se inventó producto/local. Mientras faltan permisos, las piezas localizadas sirven como referencias de dirección de arte enlazadas. Si S3 necesita fondo propio: SHOT textura abstracta de papel sin objetos; SUBJECT superficie mate; LIGHT luz lateral suave; SPACE centro/izquierda limpios; PALETTE crema/negro con acento observado, sin afirmar HEX oficial; EXCLUDE texto, marcas, comidas, personas, arquitectura identificable. Si se genera, hacer cuatro variantes y seleccionar por inspección; registrar GENERADO/REPRESENTACIÓN y archivo real. Ningún prompt es un asset ya producido.

## Pedido único al negocio — borrador, no enviado
“Hola, para preparar la propuesta de Negro ya relevamos la carta, los horarios y la nueva identidad. ¿Nos pueden compartir el logo original y las fotos de producto/local que autoricen usar? Vendrían bien café con pastelería, alfajor de almendras, muffin abierto, focca, manos elaborando y el local después de la renovación. También confirmar la carta/precios, qué significan sus columnas y cómo coordinan el take away. Idealmente para el 22/10; si no llegan, seguimos con referencias para evaluar el concepto y dejamos las fotos definitivas pendientes.”

Fecha sugerida para un eventual pedido, no compromiso del negocio. No contactar sin instrucción del usuario. Si aún es prospección, no pedir material como si ya hubiera un encargo contratado.

## Validación S2 y límites para el siguiente paso
- Copy específico: usa Avellaneda, alfajor, laminados y oferta declarada, sin premios/historia inventados.
- Cada escena tiene dato propio y referencia visual identificada; no todas tienen archivo autorizado.
- JSON de carta/copy/media comprobable, importes positivos y guiones como null.
- Pendientes explícitos: leyenda de variantes, vigencia comercial/precios, master de identidad, originales/derechos, toma de proceso y fotos actuales.
- Lista para exploración S3 con pendientes declarados; NO lista para publicación ni catálogo transaccional. S3/preview no iniciados y ninguna dirección aprobada.
