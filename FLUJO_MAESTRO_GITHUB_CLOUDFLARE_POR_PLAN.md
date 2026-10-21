# FLUJO MAESTRO: PUBLICACION DE WEBS COMERCIALES EN CLOUDFLARE

**Version:** 2.1 | **Fecha de referencia y verificacion de limites:** 2026-10-20
**Destinatario:** Claude Code, Codex, Antigravity o agente de desarrollo con acceso autorizado a GitHub y Cloudflare.
**Alcance:** despliegue y mantenimiento tecnico por tipo de servicio vendido. **NO** modificar el sistema existente de propuestas, plantillas, documentos comerciales ni precios internos.

**Modelo de proyecto:** las webs de clientes son landings, no tiendas completas. Cuando la landing muestra productos, el alcance tecnico objetivo incluye un **mini panel de catalogo** para que el negocio edite productos, precios, fotos y disponibilidad: D1 para datos y R2 Standard para fotos nuevas. Una landing sin productos no necesita ese panel. El pedido puede continuar por WhatsApp; el panel no convierte la web en una tienda con pagos.

**Objetivo economico:** intentar que el unico gasto externo recurrente del cliente sea el registro/renovacion del dominio. La landing estatica P1-P3 puede quedar dentro de Pages Free. El mini panel tambien puede operar dentro de cuotas Free, pero R2 requiere activar una suscripcion y puede generar cargos de uso si se excede la cuota. Verificar consumo, titularidad y servicios externos antes de presupuestar; no vender "hosting gratis garantizado".

---

## 0. PROMPT DE EJECUCION (COPIAR Y PEGAR)

Actua como arquitecto full-stack y responsable de despliegue de mis webs comerciales. Lee y ejecuta el proceso definido en `FLUJO_MAESTRO_GITHUB_CLOUDFLARE_POR_PLAN.md`.

Tu objetivo es inspeccionar la web actual, identificar el plan contratado y desplegarla con el minimo costo y complejidad compatibles con su alcance, utilizando GitHub como fuente de verdad y Cloudflare para el hosting. Reutiliza la base HTML/CSS/JavaScript existente; no migres a React, Next.js ni PHP por costumbre.

**Datos de esta ejecucion:**
- Cliente/proyecto: [NOMBRE]
- Repositorio y carpeta: [URL_REPO_Y_RUTA]
- Alcance: [P1 LANDING SIN CATALOGO | P2 + MINI PANEL P4 | P3 + MINI PANEL P4 | PILOTO SIN PANEL]
- Estado: [DEMO VISUAL | PILOTO OPERATIVO | PRODUCCION]
- Dominio: [DOMINIO | PENDIENTE]
- WhatsApp comercial confirmado: [NUMERO | PENDIENTE]
- Productos, precios, fotos y modalidad de entrega: [CONFIRMADOS | PENDIENTES POR CAMPO]
- Mini panel de catalogo: [NO | SI; campos editables y quien tendra acceso]
- Carga de fotos nuevas desde el panel: [SI | NO]
- R2 Standard y facturacion de uso: [CUENTA/SUSCRIPCION VERIFICADAS | PENDIENTE]
- Hosting Cloudflare: [CUENTA Y PROYECTO SI EXISTE | PENDIENTE]

Audita arquitectura, archivos, rutas, dependencias, datos ficticios, reglas del repositorio, herramientas disponibles, estado de GitHub/Cloudflare y cuotas. Elige la ruta A o B, explica brevemente la decision y avanza con los cambios reversibles, pruebas y preview que ya esten autorizados por este pedido. Pide datos que falten solo si impiden avanzar. Conserva la demo original y no publiques datos ficticios como reales.

Antes de una accion externa irreversible o con costo que aun no este autorizada (compra de dominio, DNS/nameservers, publicacion productiva o migracion de D1 remota), presenta el resultado concreto, su URL de preview si existe y el cambio exacto para aprobar. Si la autorizacion ya consta en la conversacion, no la vuelvas a pedir. Nunca inventes resultados, accesos, costos, credenciales ni URLs publicadas. Al finalizar deja un informe tecnico y comercial breve.

---

## 0.1 CONFIGURACION INICIAL DEL AGENTE (UNA SOLA VEZ)

Instalar y autorizar la integracion oficial con Cloudflare en la herramienta que realmente uses. NO suponer que esta instalada. La conexion con GitHub/Cloudflare siempre requiere las autorizaciones del usuario.

**Claude Code:** abrir el proyecto con `claude` y ejecutar:

```text
/plugin marketplace add cloudflare/skills
/plugin install cloudflare@cloudflare
```

Verificar con `claude mcp list`. Ante solicitud de OAuth, autenticar en el navegador.

**Codex:** abrir `/plugins`, buscar Cloudflare e instalar. Verificar conexion del MCP con la opcion correspondiente y completar OAuth.

**Antigravity u otro IDE/agente:** comprobar si admite MCP remoto con autenticacion OAuth. En ese caso, configurar el MCP oficial `https://mcp.cloudflare.com/mcp` siguiendo instrucciones de la herramienta. Si no admite esa conexion, usar Wrangler CLI desde la terminal del proyecto; autenticarse con `npx wrangler login` y verificar con `npx wrangler whoami`. NO pegar API tokens privados en el chat.

**Importante:** las skills explican como usar la plataforma, el MCP consulta/opera sobre la cuenta segun permisos, y Wrangler permite desarrollo, migraciones y despliegues. Ni la skill ni el MCP garantizan por si solos poder crear una integracion Git desde API; completar esa conexion desde el dashboard si fuera necesario.

---

## 1. REGLAS INNEGOCIABLES

1. Nunca tocar ni regenerar plantillas/propuestas comerciales ya existentes: este flujo empieza una vez seleccionado el plan.
2. Mantener un repositorio GitHub como fuente de verdad; preferir conexion Git nativa y despliegue automatico desde la rama de produccion.
3. No crear proyectos nuevos o bases D1 sin revisar si ya existen; no duplicar recursos innecesariamente.
4. No cambiar la tecnologia del sitio sin justificacion tecnica verificada.
5. Separar DEMO VISUAL, PILOTO OPERATIVO y PRODUCCION. Una demo visual no recibe pedidos; un piloto puede abrir el WhatsApp real solo si numero, productos y permiso para probarlo estan confirmados. Los precios no confirmados se omiten y el negocio confirma el total por chat.
6. Nunca usar credenciales en codigo fuente, archivos publicos, prompts de salida, commits o logs. Usar secrets/bindings de Cloudflare.
7. Antes de desplegar a produccion, modificar DNS/nameservers, migrar D1 remota, activar pedidos reales, activar la suscripcion R2 o crear un gasto, comprobar si la conversacion ya lo autorizo. Si falta autorizacion, mostrar el cambio exacto y pedirla una sola vez.
8. El panel no es seguro solo por esconder `/admin`. Autenticacion y autorizacion deben proteger tambien la API y cada operacion de escritura.
9. Si falta autorizacion o la conexion de Cloudflare no puede realizar una accion, presentar los pasos manuales exactos del dashboard; nunca simularla.
10. En cada venta entregar accesos y titularidad de dominio claros; el dominio debe quedar a nombre del cliente. Preferir cuenta Cloudflare y repo propios del cliente, con acceso delegado para mantenimiento. Si se usa una cuenta de agencia, documentar cuotas compartidas y plan de traspaso.

## 2. CATALOGO DE PLANES Y ARQUITECTURA

| Plan | Tarifa inicial interna orientativa (ARS) | Funcionalidades | Infraestructura elegida |
|---|---:|---|---|
| P1 - Landing profesional | $200.000 | Landing responsive, secciones, CTA, contacto, SEO inicial | GitHub + Cloudflare Pages estatico |
| P2 - Catalogo / carta | $250.000 | P1 + carta/categorias, fotos, precios confirmados o "consultar", consultas por producto | GitHub + Cloudflare Pages estatico |
| P3 - Carrito y pedido por WhatsApp | $300.000 | P2 + cantidades, variantes/adicionales, carrito, observaciones, enlace WhatsApp | GitHub + Cloudflare Pages estatico; localStorage opcional |
| P4 - Modulo mini panel de catalogo | Cotizacion aparte | Se suma a una landing P2/P3 aceptada: alta/edicion de productos, precios, fotos y disponibilidad; API y acceso seguro. Sin pagos ni gestion de ventas. | Pages + Functions + D1 + R2 Standard para fotos nuevas (preferido al evolucionar una demo); Worker + Static Assets + D1 + R2 si hay una razon tecnica concreta. |

**Aclaraciones comerciales:**
- SEO inicial, configuracion del hosting y publicacion se incluyen en P1-P3 dentro del alcance pactado; no prometer posicionamiento en Google.
- Dominio: comprado por el cliente, o primer anio incluido si se pacta explicitamente; aclarar renovacion posterior.
- Mantenimiento OPCIONAL: basico $15.000 ARS/mes (supervision y hasta 2 cambios menores), activo $30.000 ARS/mes (hasta 4 cambios menores/promociones, segun contrato). Sin plan: cambios posteriores a presupuesto. Los costos de terceros se informan por separado.
- El mini panel P4 forma parte del alcance tecnico objetivo para landings de cliente con productos. La tabla conserva la tarifa comercial interna previa: acordar por escrito su inclusion/cotizacion y, en su caso, cuota operativa. **NO** se incluye automaticamente en mantenimiento basico ni activo; este documento no modifica precios comerciales.
- El objetivo "solo pagar el dominio" vale mientras el proyecto use los recursos incluidos en Free y no contrate otros servicios (correo con casillas, pasarela de pago, etc.). Con carga de fotos R2, el uso superior a la cuota Free puede generar cargos aun sin cambiar de plan. Verificar consumo, limites y condiciones vigentes.
- P3 no es una pasarela de e-commerce con pago online: prepara el pedido en WhatsApp. El negocio confirma el pedido.
- P4 no conoce pedidos confirmados ni ventas reales solo por registrar un clic a WhatsApp. Gestionar pedidos reales requiere un flujo adicional acordado con el negocio.

### 2.1 Presupuesto de infraestructura Free (referencia 20/10/2026)

| Recurso | Incluido/restriccion relevante | Consecuencia para el negocio |
|---|---|---|
| Pages estatico | Las solicitudes a archivos estaticos son gratuitas e ilimitadas; Free permite 500 builds/mes, 100 proyectos/cuenta, 20.000 archivos por proyecto y 25 MiB por archivo. | P1-P3 normalmente pueden alojarse sin abono de hosting; comprimir videos/fotos grandes. |
| Monorepo en Pages | Maximo 5 proyectos Pages conectados al mismo repositorio; por defecto un cambio en cualquier carpeta dispara builds en todos. | Para clientes aceptados, preferir un repo por cliente. Si se conserva un monorepo, configurar *build watch paths*. |
| Pages Functions / Workers | En Free, 100.000 invocaciones diarias compartidas entre Functions y Workers; los archivos estaticos que no invocan codigo no consumen esa cuota. | P4 puede operar gratis a bajo volumen, pero un limite alcanzado afecta funciones/API. |
| D1 | Free: 10 bases/cuenta, 500 MB/base, 5 GB/cuenta, 5 millones de filas leidas/dia y 100.000 escritas/dia; Time Travel hasta 7 dias. | Medir consultas y almacenamiento. Si se agota la cuota diaria, D1 rechaza consultas hasta el reinicio del limite. |
| R2 Standard para fotos del panel | Free: 10 GB-mes de almacenamiento, 1 millon de operaciones Class A/mes y 10 millones Class B/mes; salida a Internet sin cargo de egress. Requiere activar una suscripcion R2 mediante el flujo de checkout. | Permite subir fotos nuevas sin costo mientras el uso quede en la cuota. El exceso de almacenamiento u operaciones es facturable; las alertas de presupuesto **no frenan** el consumo. |
| Dominio | Registro y renovacion anuales segun extension y registrador. | Es el costo externo esperado para P1-P3; verificar precio real de compra **y renovacion** antes de ofrecerlo. |

Las cuotas de Workers, D1 y R2 corresponden a la **cuenta**, no a un presupuesto independiente por cliente dentro de una misma cuenta. R2 Standard tiene cuota incluida, pero es un producto de facturacion por uso: la promesa "solo dominio" es un objetivo de consumo, no un tope garantizado. Configurar alertas y revisar uso; las alertas son informativas y no evitan cargos. Fuentes: [Pages limits](https://developers.cloudflare.com/pages/platform/limits/), [Pages Functions pricing](https://developers.cloudflare.com/pages/functions/pricing/), [Workers limits](https://developers.cloudflare.com/workers/platform/limits/), [D1 limits](https://developers.cloudflare.com/d1/platform/limits/), [D1 pricing](https://developers.cloudflare.com/d1/platform/pricing/), [D1 Free al exceder cuota](https://developers.cloudflare.com/d1/reference/faq/), [entrada en vigor de limites diarios D1](https://developers.cloudflare.com/changelog/product/d1/), [R2 pricing](https://developers.cloudflare.com/r2/pricing/), [R2 get started](https://developers.cloudflare.com/r2/get-started/), [alertas de presupuesto](https://developers.cloudflare.com/billing/manage/budget-alerts/), [Pages monorepos](https://developers.cloudflare.com/pages/configuration/monorepos/) y [Cloudflare Registrar](https://developers.cloudflare.com/registrar/about/). Revalidar al abrir cada proyecto real.

## 3. DESCUBRIMIENTO OBLIGATORIO ANTES DE HACER NADA

- Identificar carpeta raiz real, stack, comandos de build, dependencias, pruebas, scripts y rama de produccion.
- Confirmar si el sitio es estatico: HTML/CSS/JS, React+Vite compilado, Astro estatico u otro.
- Detectar APIs existentes, PHP/Node, variables secretas, pasarelas de pago o base de datos ya instalada.
- Inspeccionar recursos compartidos fuera de la carpeta: fuentes, `../icons.css`, imagenes, CSS, rutas absolutas y relativas. El directorio publicado debe incluir lo que necesita para funcionar.
- Detectar datos ficticios, fotos de referencia, precios de ejemplo, identidad no confirmada y destinatarios de WhatsApp.
- Distinguir datos confirmados campo por campo: producto, variante, precio, foto, telefono, retiro/delivery, zona/costo de envio. No inferir un dato a partir de otro.
- Si habra mini panel, definir quien edita, campos exactos, formatos y cantidad aproximada de fotos, y si se necesita eliminar productos/fotos. Planificar D1 para datos y R2 Standard para archivos nuevos.
- Definir el estado real: DEMO VISUAL (sin pedidos al comercio), PILOTO OPERATIVO (prueba autorizada con WhatsApp real) o PRODUCCION (dominio y operacion final).
- Leer reglas e instrucciones del repositorio (AGENTS.md, CLAUDE.md, REGLA0.md, etc.). Verificar skills reales, no inventar nombres.
- Comprobar herramienta conectada: plugin oficial Cloudflare, MCP de API, Wrangler o dashboard. Revisar permisos otorgados; solicitar autenticacion si hace falta.
- No borrar ni sobrescribir el portfolio original. Para clientes reales, preferir repo propio por cliente, privado si corresponde; para demo, usar rama/copia independiente. Revisar si ya hay un enlace GitHub Pages compartido y documentar el redireccionamiento antes de moverlo.
- Revisar titularidad del dominio, cuenta Cloudflare, repo y acceso de soporte. Consultar cuotas reales de esa cuenta antes de prometer costo mensual cero.

**Resultado de la auditoria:** nombre + repo + rama + carpeta + estado + plan + arquitectura elegida + lista de pasos + riesgos + estimacion de costos externos + autorizaciones ya existentes o pendientes.

### 3.1 Secuencia cuando un cliente acepta una demo

1. Identificar la carpeta exacta y hacer inventario de lo confirmado y lo pendiente. Guardar referencia del commit/URL de la demo aceptada.
2. Para una landing sin productos, seguir Ruta A. Para una landing aceptada con catalogo, seguir Ruta A para el sitio publico y Ruta B para el mini panel P4 (API, autenticacion, D1 y R2). Una demo o piloto puede permanecer temporalmente sin panel; un carrito que solo arma WhatsApp no requiere D1 por si mismo.
3. Preparar repo propio y limpio para el cliente; preservar la demo del portfolio. Corregir rutas para publicar desde `/`, datos ficticios, metadata y configuracion de produccion.
4. Dar a la integracion de Cloudflare acceso al repo nuevo y crear un proyecto nuevo conectado a su rama de produccion; no asumir que el proyecto piloto puede cambiar de repositorio. Se puede autorizar solo el repo nuevo sin abrir acceso a todos los repositorios de GitHub. Probar la URL `pages.dev` o `workers.dev` generada y una preview de cambios. Para P4, probar la API, el panel, D1 y subida/lectura de fotos R2 en recursos de prueba separados. Medir uso esperado frente a cuotas Free.
5. Registrar o vincular el dominio del cliente solo con titularidad, precio de compra/renovacion y cambios DNS revisados. Probar HTTPS, web y pedidos reales autorizados.
6. Entregar accesos, repo, dominio, instrucciones de actualizacion, estado de cuotas y responsabilidades de mantenimiento. Definir que ocurre con el enlace viejo de GitHub Pages.

## 4. RUTA A: LANDING PUBLICA P1, P2, P3 CON GITHUB + PAGES

**Criterio:** define la web publica. Sin mini panel es completamente estatica: no hay operaciones persistentes del lado del servidor y el carrito/WhatsApp se calculan en el navegador. Con mini panel P4, conservar la landing en Pages y sumar la Ruta B: el catalogo se consulta en la API, mientras el carrito puede seguir en el navegador.

### A.1 Preparacion

1. Preparar repo/branch independientes del sitio original, con `index.html`, pagina de carta si aplica, JS, CSS, iconos, fotos y configuraciones necesarias. Para un cliente aceptado, copiar el proyecto validado a un repo propio y mantener trazabilidad del origen; no publicar automaticamente todo `portfolio`.
2. Validar `index.html`, enlaces entre paginas, rutas, assets fuera de la raiz, rutas con espacios, favicon, canonical, sitemap y robots; configurar redirecciones solo si hacen falta.
3. Confirmar que nada incluye tokens, contrasenias o credenciales.
4. En DEMO VISUAL, marcar los datos de prueba y desactivar pedidos reales. En PILOTO OPERATIVO o PRODUCCION, exigir productos y destinatario confirmados; si faltan precios, ocultar cualquier importe de ejemplo y aclarar que el local confirma precio final. Confirmar con el negocio si acepta pedidos sin precio publicado. Solo publicar fotos, variantes y condiciones de entrega verificadas.
5. Crear una rama `feature/...` para mejoras y revision. No modificar `main` hasta que la preview apruebe los controles.

### A.2 Proyecto Pages con Git

1. Cloudflare Dashboard > Workers & Pages > Create application > Pages > Connect to Git.
2. Autorizar acceso al repositorio elegido en GitHub. Si es un proyecto del portfolio/monorepo, configurar Root directory advanced con la carpeta exacta; para un cliente definitivo preferir repo propio. Pages admite como maximo 5 proyectos por repositorio; configurar *build watch paths* para evitar builds cruzados.
3. Configuracion para HTML/CSS/JS puro, siempre que `index.html` y todos sus assets esten dentro de la carpeta de publicacion:
   - Framework preset: None.
   - Production branch: `main` o rama elegida y aprobada.
   - Root directory: `.` para repo propio; `demos/sushi-fan` u otra ruta real para monorepo.
   - Build command: campo vacio; si la interfaz lo requiere, `exit 0`.
   - Build output directory: `.` si los archivos a publicar ya estan en la raiz efectiva. Confirmarlo con el primer deploy y ajustar si existe `dist`/`public`.
4. Para Vite/React compilado, usar el build verificado del proyecto (comunmente `npm run build`, salida `dist`). No asumir Vite si la web es HTML puro.
5. Ejecutar primer deploy y verificar URL real `*.pages.dev`; no inventarla.
6. Comprobar que push a rama de produccion actualiza la web; probar una rama de preview sin afectar produccion.
   Si el proyecto queda conectado a Git pero el push no crea un deployment, no afirmar que la automatizacion funciona. Verificar en GitHub el acceso de la app y en Pages los controles de rama. Mientras se resuelve, `cf pages deployments create NOMBRE_PROYECTO --branch main` permite publicar el commit actual; comprobar su estado con `cf pages deployments list --project-name NOMBRE_PROYECTO`. Reinstalar una app compartida solo tras revisar los demas proyectos que dependen de ella.
7. Si el MCP no puede conectar la integracion Git, dejar guia/manual de dashboard; no sustituir automaticamente por Direct Upload. La conexion Git y Direct Upload son modalidades diferentes.
8. Si se mueve una demo desde una URL bajo `/demos/.../` a la raiz de un dominio, revisar enlaces y assets con rutas absolutas, `canonical`, redirecciones y cualquier enlace compartido. La URL vieja puede seguir en GitHub Pages como demo o redirigir a la nueva segun lo acordado.

### A.3 QA funcional

- Home y carta abren directo y al recargar; todos los CSS/JS/fotos/carrusel/mascotas cargan.
- Movil real: menus, scroll, botones, accesibilidad basica, tiempos de carga.
- P2: categorias, textos y consultas por producto correctos; precios solo si estan confirmados.
- P3: carrito, variantes si existen, cantidades, totales solo si hay precios confirmados, observaciones y formateo WhatsApp correctos. Probar destino y texto sin enviar un mensaje real no autorizado.
- No afirmar que un click a WhatsApp es un pedido confirmado.
- Una demo visual debe estar etiquetada; un piloto operativo debe aclarar que disponibilidad, precio/envio y aceptacion final dependen del negocio. Nunca enviar pruebas al negocio sin autorizacion.
- Un enlace `wa.me` puede precargar texto y enlaces, pero no adjunta automaticamente las fotos del carrito; si existen enlaces individuales del catalogo WhatsApp, evaluar agregarlos al resumen.
- SEO inicial: title, description, canonical real, datos estructurados verificados, sitemap, robots, etiquetas sociales, accesibilidad, images optimizadas.

### A.4 Dominio propio (si fue aprobado)

1. En Pages: Custom domains > Set up a domain.
2. Para el dominio raiz/apex puede ser necesario gestionar la zona en Cloudflare y cambiar nameservers. Para `www`/subdominio, seguir la configuracion CNAME indicada por el dashboard.
3. **Antes de modificar nameservers** revisar y conservar registros MX, SPF, DKIM, DMARC y cualquier otro servicio existente del dominio.
4. Confirmar SSL/HTTPS activo, redireccion canonica `www`/apex (segun decision), visitas y envio de consultas.
5. Entregar acceso, titularidad y renovacion anual del dominio al cliente.

## 5. RUTA B: P4 = LANDING CON MINI PANEL + API + D1 + R2

**Criterio:** el negocio debe editar productos, precios, textos, fotos y disponibilidad desde un panel sencillo, sin tocar codigo ni GitHub. La landing y el pedido por WhatsApp siguen siendo el sitio publico; el panel administra solamente el catalogo. D1 guarda datos, R2 Standard guarda fotos nuevas.

### B.1 Elegir arquitectura de menor complejidad

- Para evolucionar una demo/landing existente: conservar **Cloudflare Pages** y agregar **Pages Functions + D1 + R2 Standard** mediante bindings. Es la ruta preferida para estos proyectos porque mantiene su HTML/CSS/JS.
- Para un proyecto realmente nuevo cuyo servidor requiera otras funciones: evaluar **Cloudflare Workers + Static Assets + D1 + R2** en un unico Worker, con GitHub + auto-deploy mediante Workers Builds. No migrar una landing existente solo por moda.
- Si se necesitan funciones incompatibles con Workers, evaluar alternativas justificadas (Hostinger/Node/PHP u otro proveedor) y costos antes de decidir.
- React es una opcion de frontend, no un requisito de seguridad ni de backend. Workers/Functions usan JavaScript o TypeScript de servidor, con compatibilidad parcial de APIs Node.

### B.2 Base de datos D1

1. Verificar cuotas actuales y cuantas bases ya utiliza la cuenta. La tabla de 2.1 da la referencia de octubre 2026; consultar el dashboard y la documentacion actual antes de prometer un panel sin abono. Los limites diarios de lectura/escritura se aplican de forma efectiva desde septiembre de 2026.
2. Para la primera demo, crear una base exclusiva de DEMO. Para clientes reales, decidir explicitamente si cada cliente tendra una base aislada o una arquitectura multicliente; **nunca mezclar tenants sin controles estrictos**.
3. Crear D1 desde dashboard o Wrangler/API, previa autorizacion. Registrar nombre, ID y entorno sin exponer secretos.
4. Conectar D1 mediante binding `DB` al Worker o la Pages Function; configurar binding para preview/produccion segun entorno. En Pages, Settings > Bindings > Add > D1; volver a desplegar.
5. Crear migraciones SQL versionadas en Git, aplicar primero en una base local/de prueba y despues en produccion previa copia/punto de restauracion y aprobacion.
6. Esquema minimo sugerido: `categories`, `products` (nombre, descripcion, categoria, precio o precio pendiente, disponibilidad, orden, `image_key`/`image_url`, revision), `product_variants` solo si aplican y `admin_audit_logs` si hay identidad de editor. No crear tablas de pedidos ni guardar datos personales de compradores para editar el catalogo.
7. Guardar precios como enteros en centavos (`price_cents`) o unidad monetaria documentada. No usar numeros flotantes para importes monetarios. Verificar conversion con el carrito actual.
8. Usar consultas preparadas y binding de parametros, validacion de tipos/rangos y errores sin exponer SQL al navegador.
9. Gestionar cache del catalogo para que los cambios se reflejen de forma razonable; incorporar `revision`/version para avisar si el carrito tenia precios anteriores.
10. D1 Free ofrece Time Travel limitado (actualmente hasta 7 dias): documentar un plan de backup/exportacion adicional para clientes importantes. Probar restauracion en un entorno separado antes de depender de ella.

### B.2.1 Fotos nuevas con R2

1. Activar R2 Standard en la cuenta del cliente solo despues de revisar el flujo de suscripcion/facturacion y la autorizacion existente. Crear bucket separado para demo y produccion; registrar nombre y bindings sin exponer credenciales.
2. El panel sube la foto a una ruta administrativa autenticada. Validar tipo real de archivo (JPEG/PNG/WebP), tamano, dimensiones y limites por producto; generar clave aleatoria. No aceptar SVG ni confiar en el `Content-Type` declarado por el navegador. Comprimir/optimizar antes de subir cuando corresponda.
3. Guardar el archivo en R2 mediante binding y la clave/referencia en D1. Nunca almacenar la imagen binaria en D1 ni habilitar escritura publica al bucket. Cambiar imagen debe actualizar la referencia solo tras confirmar la subida; limpiar fotos huerfanas con un proceso controlado.
4. Para produccion, servir las fotos publicas por un subdominio del dominio del cliente vinculado al bucket, con cache y nombres versionados. `r2.dev` es para desarrollo y tiene limites; no usarlo como URL final ni dejarlo abierto si se protege el bucket. Probar que borrar/reemplazar una imagen se refleja sin mostrar una version vieja indefinidamente.
5. Vigilar almacenamiento y operaciones R2, configurar alerta de presupuesto y explicar que es **solo informativa**. Si el cliente exige un tope de gasto inflexible, no presentar R2 de uso variable como costo garantizado cero; acordar otra forma de gestionar fotos.

### B.3 API minima

- `GET /api/catalog`: consulta PUBLICA. Solo devuelve productos visibles, precios confirmados o estado "consultar", variantes, disponibilidad y URL publica de foto, nunca campos internos.
- `GET /api/admin/products`: solo administrador autenticado.
- `POST /api/admin/products` y `PATCH /api/admin/products/:id`: solo administrador autenticado; validan nombre, descripcion, categoria, precio, disponibilidad, orden y referencia de foto. Alta solo si el alcance contratado la incluye.
- `POST /api/admin/media`: solo administrador autenticado; valida archivo y lo sube a R2. Devuelve una referencia segura, no credenciales ni acceso de escritura publica.
- `DELETE /api/admin/products/:id` o desactivar producto: solo si se acuerda esa funcion; preferir ocultar para evitar enlaces rotos. Borrar archivos R2 solo cuando ya no esten referenciados.

No implementar endpoints de pedido confirmado por inferencia del click. Confirmacion real implica interaccion posterior con el negocio o una integracion oficial de mensajeria/procesamiento.

### B.4 Panel minimo reutilizable

- Acceso solo para la persona o personas designadas por el negocio.
- Lista de todos los productos con busqueda/filtro y edicion simple de nombre, descripcion, categoria, precio y disponibilidad.
- Subir o reemplazar foto desde el equipo, con vista previa, progreso y mensaje de error claro; actualizar la referencia R2/D1 al guardar.
- Cambios guardados y reflejados en la carta publica sin hacer deploy; mostrar si el precio queda pendiente/"consultar".
- Historial minimo de cambios (quien, cuando, que campo) si el mecanismo de autenticacion permite identificar al usuario. Metricas de intentos solo si se solicitan aparte; no son ventas confirmadas.
- Estados de carga/error, formulario validado, feedback de guardado, uso movil.
- Mantener branding del proyecto; desarrollar logica reutilizable sin compartir datos entre clientes.

### B.5 Seguridad obligatoria

- Autenticacion REAL para `/admin` y TODA ruta administrativa de API; verificar autorizacion en servidor en cada request.
- Evaluar Cloudflare Access cuando el dominio/subdominio y el plan lo permitan, aplicando proteccion tanto al panel como a la API. Probar tambien `pages.dev` y la URL de preview: ninguna ruta alternativa debe saltarse la proteccion. Si hay Access/JWT, validar firma, audience, issuer y expiracion en el backend segun documentacion oficial, no solo la existencia de la cabecera.
- Cloudflare permite proteger previews y `pages.dev` con Access, pero la configuracion debe probarse en cada hostname. Si la estrategia elegida no cubre alguna URL publica, cerrar esa via o implementar autenticacion auditable compatible con Workers (cookies Secure/HttpOnly/SameSite, sesion, hashing seguro, expiracion, proteccion CSRF cuando aplique y rate limiting). No entregar usuarios/contraseñas de demo publicas reutilizables en produccion.
- Separar lectura publica de escrituras privadas; restringir CORS y metodos; validacion server-side; consultas preparadas; HTTPS; secrets en Cloudflare.
- Proteger `POST /api/admin/media` igual que las escrituras D1; validar bytes, formato y tamano en servidor, limitar frecuencia/cantidad y no aceptar rutas de objeto decididas libremente por el cliente.
- No exponer `database_id`, API tokens, passwords, credenciales de admin ni PII en scripts publicos. Un ID de binding no equivale a una credencial, pero tampoco justifica publicar configuraciones sensibles.
- Pruebas negativas: anonimo no puede editar ni consultar endpoints privados; usuario sin permisos tampoco; probar intentos maliciosos.
- Rate limiting y auditoria de cambios; minimo privilegio en permisos del plugin/MCP Cloudflare.

### B.6 Publicar la ruta B

**B1 - Pages ya existente:** añadir `functions/`, binding D1 y binding R2 con la estructura correcta para su raiz de proyecto; separar recursos de preview/produccion, probar local/previews, ejecutar migraciones aprobadas y publicar codigo por Git como en Ruta A. La landing puede seguir estatica, pero el catalogo se obtiene de la API.

**B2 - Worker nuevo:** definir `wrangler.jsonc` con `main`, `compatibility_date`, `assets.directory` (ejemplo `./public`), bindings D1/R2 y variables por entorno; verificar compatibilidad del codigo. Conectar GitHub mediante Workers Builds, configurar rama + build/deploy, probar en `workers.dev`, desplegar automaticamente despues de merges aprobados. Confirmar dominio/certificado si aplica.

En ambos casos, el administrador modifica D1 y sube fotos a R2; **no necesita hacer commit en GitHub para cambiar un precio o una imagen**. El codigo fuente sigue en GitHub; el catalogo vive en D1 y las fotos editables en R2.

## 6. ACTUALIZACIONES DESPUES DE LA ENTREGA

- Landing sin mini panel (P1 o demo/piloto P2/P3): los cambios de contenido los hace el desarrollador y se publican mediante GitHub -> Cloudflare automatico.
- P4 con panel: cliente cambia precios/productos/fotos en `/admin` -> API valida -> foto a R2 y datos a D1 -> carta publica lee el nuevo valor. No requiere hacer deploy ni editar GitHub para cada cambio.
- Cambios de estructura, diseno, sistema de pedidos o seguridad del backend: versionados, probados y desplegados por GitHub; no son automaticamente "ediciones de contenido".
- Antes de cambiar menus: revisar productos que ya estan en un carrito abierto; recalcular precios y avisar, nunca confiar solo en el total enviado por el cliente.
- Monitorizar errores, uso y cuotas de Functions/Workers, D1 y R2; backups/exportaciones de catalogo y fotos, dependencias y seguridad segun criticidad del cliente.

## 7. ESTADOS DE LAS DEMOS Y PASO A CLIENTE

| Estado | Datos y WhatsApp | URL y proposito |
|---|---|---|
| DEMO VISUAL | Datos ficticios identificados; WhatsApp real de pedidos desactivado. | Portfolio o preview para mostrar el concepto. |
| PILOTO OPERATIVO | Productos y numero confirmados, pruebas autorizadas. Si no hay precios, no se muestran importes ni totales ficticios. | Enlace compartido para probar pedidos; aclarar que el local confirma disponibilidad y precio. |
| PRODUCCION | Identidad, contenido, pedido y condiciones operativas validados; dominio del cliente. | Web definitiva en Cloudflare con mantenimiento y titularidad documentados. |

- Nunca enviar pedidos de prueba al WhatsApp real del local sin permiso; abrir y verificar el enlace no equivale a tocar **Enviar**.
- Si se guarda telemetria, mostrar que son **intentos** de pedido; nunca como ventas reales.
- No guardar nombre, telefono o domicilio del visitante si solo interesa contar clics.
- Datos ficticios sembrados + posibilidad de restablecer la base solo en entorno DEMO y tras autorizacion.
- No reutilizar cuentas de administracion de prueba para clientes finales.
- Al aceptar el cliente, congelar una copia verificable de la demo, crear un repo/sitio propio y completar la lista de la seccion 8. Mantener el enlace antiguo o redirigirlo segun la decision de entrega.

### Ejemplo actual: Hasta el Moño

La demo actual esta publicada en https://hasta-el-mono-web.pages.dev/ como **piloto operativo P3**. Su fuente es el repositorio privado `Geronimo02/hasta-el-mono`, rama `main`, con los archivos del sitio en la raiz. El proyecto Cloudflare Pages `hasta-el-mono-web` se despliega automaticamente desde ese repo con compilacion `node build-pages.mjs` y salida `dist`. La carpeta original `demos/hasta-el-mono/` permanece en el portfolio como referencia; el proyecto Pages anterior `hasta-el-mono` fue eliminado. La app GitHub de Cloudflare en la cuenta `Geronimo02` tiene acceso a todos los repositorios actuales y futuros, segun autorizacion expresa del usuario. El usuario confirmo `5492494694718` como numero de pedidos y confirmo los productos, pero no los precios: el carrito pide precio final por WhatsApp sin mostrar importes de prueba. Aun no hay dominio propio ni panel D1/R2. Si el cliente acepta la landing con catalogo editable, auditar el contenido y la titularidad y seguir Ruta B para el mini panel en el repo independiente. El carrito por si solo no necesita D1/R2.

**Ficha inicial para ejecutar este flujo si lo aceptan:** proyecto `Hasta el Moño`; origen actual `Geronimo02/hasta-el-mono`, derivado de `Geronimo02/Geronimo02.github.io`, `demos/hasta-el-mono/`; landing P3 + mini panel P4; estado actual PILOTO OPERATIVO en Cloudflare Pages sin panel; WhatsApp `5492494694718`; productos confirmados; precios pendientes; dominio propio pendiente. La ficha se debe volver a validar al momento de contratar.

### Ejemplo concreto: Sushi Fan

Repo origen conocido: `Geronimo02/Geronimo02.github.io`, carpeta `demos/sushi-fan`.
- Ya dispone de `index.html`, `carta.html`, `menu.js`, `cart-core.js` y `site.js` con carrito de prueba.
- Verificar el estado actual de `menu.js` antes de usar este ejemplo; en el relevamiento inicial tenia `demo: true`, precios ilustrativos y `whatsappNumber: null`. Mantener modo demo mientras esos datos sigan sin confirmarse.
- Hay una referencia compartida a `../icons.css`: si se publica SOLO la carpeta `demos/sushi-fan`, incluir esos iconos dentro de la carpeta de despliegue y actualizar la ruta, sin romper el portfolio.
- Primera prueba recomendada: crear un despliegue de demo independiente. Si el cliente pide mini panel, presupuestar P4 y probar D1/R2 demo, autenticacion y cambios de precios/fotos antes de produccion.
- Conservar una copia de la demo original y documentar cualquier cambio de URL o repositorio.

## 8. CHECKLIST ANTES DE PRODUCCION

- [ ] Alcance del plan verificado y presupuesto/adicionales aprobados.
- [ ] Repo, raiz, rama y permisos confirmados.
- [ ] Estado DEMO VISUAL / PILOTO OPERATIVO / PRODUCCION definido; nada ficticio se promociona como real.
- [ ] Productos, telefono de pedidos y condiciones de retiro/delivery confirmados; importes visibles solo si son vigentes. Si no se publican precios, el local acepta confirmar el total por chat.
- [ ] Sitio desktop/movil y rutas directas probadas.
- [ ] SEO inicial y optimizacion de imagenes verificadas.
- [ ] P3: carrito/variantes si existen, cantidades, total solo cuando corresponda y enlace WhatsApp comprobados sin enviar un pedido no autorizado.
- [ ] P4: accesos y API privados protegidos, con pruebas de acceso no autorizado.
- [ ] P4: D1 + migraciones + backup/exportacion; R2 Standard + subidas/lecturas, acceso y cuotas/costos comprobados.
- [ ] P4: fotos cargadas desde el panel, formatos/tamano validados, cache y reemplazo probados; bucket de preview separado del productivo.
- [ ] Cuenta Cloudflare, suscripcion R2 y consumo compartido, alerta de presupuesto, precio de registro y renovacion del dominio, y servicios externos revisados. La alerta no actua como limite de gasto.
- [ ] Preview aprobada antes de merge/despliegue productivo.
- [ ] Dominio a nombre del cliente y DNS/correo revisados antes de modificarlo; repo y cuenta con acceso de entrega acordado.
- [ ] SSL, enlace publico, metricas basicas y errores revisados.
- [ ] README de despliegue, datos para soporte y guia breve del cliente entregados.

## 9. FORMATO DE ENTREGA DEL AGENTE

Presentar siempre:
1. **Diagnostico**: plan detectado, stack y estado real.
2. **Decision tecnica**: Pages estatico o Pages Functions/Workers + D1, con motivo.
3. **Cambios**: archivos creados/modificados, rama/commit/PR si existen.
4. **Recursos Cloudflare**: nombre de proyecto, D1, bucket R2, bindings y entornos realmente creados; nunca inventar IDs.
5. **URLs reales**: demo, preview y produccion (solo si fueron comprobadas).
6. **QA**: pruebas ejecutadas, resultados y pendientes.
7. **Seguridad**: autenticacion y test de accesos, manejo de secretos.
8. **Costos y limites**: plan en uso, registro/renovacion de dominio, cargos/recursos actuales, cuotas compartidas y riesgos de superar Free. Explicar si realmente se cumple "solo dominio".
9. **Acciones pendientes del usuario**: OAuth, aprobar dominio/produccion, datos reales y acceso seguro.
10. **Handover**: como cambiar contenidos, como hacer deploy, restauracion y renovacion.

## 10. REFERENCIAS OFICIALES (VERIFICAR ANTES DE EJECUTAR)

- GitHub -> Cloudflare Pages: https://developers.cloudflare.com/pages/get-started/git-integration/
- Pages Limits: https://developers.cloudflare.com/pages/platform/limits/
- Pages Monorepos y build watch paths: https://developers.cloudflare.com/pages/configuration/monorepos/ y https://developers.cloudflare.com/pages/configuration/build-watch-paths/
- Pages Functions pricing: https://developers.cloudflare.com/pages/functions/pricing/
- Static HTML en Pages: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- Pages Functions con D1: https://developers.cloudflare.com/pages/functions/bindings/
- Pages Custom Domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
- Workers + Static Assets: https://developers.cloudflare.com/workers/static-assets/
- Workers Free limits: https://developers.cloudflare.com/workers/platform/limits/
- Workers Builds con GitHub: https://developers.cloudflare.com/workers/ci-cd/builds/git-integration/
- D1 pricing y exceso de cuota: https://developers.cloudflare.com/d1/platform/pricing/ y https://developers.cloudflare.com/d1/reference/faq/
- D1 limits: https://developers.cloudflare.com/d1/platform/limits/
- D1 prepared statements: https://developers.cloudflare.com/d1/worker-api/prepared-statements/
- D1 Time Travel: https://developers.cloudflare.com/d1/reference/time-travel/
- R2 Standard pricing y activacion: https://developers.cloudflare.com/r2/pricing/ y https://developers.cloudflare.com/r2/get-started/
- R2 con Pages Functions y bucket publico: https://developers.cloudflare.com/pages/functions/bindings/ y https://developers.cloudflare.com/r2/buckets/public-buckets/
- Alertas de presupuesto (informativas): https://developers.cloudflare.com/billing/manage/budget-alerts/
- Cloudflare Access JWT: https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/application-token/
- Plugin oficial Claude Code: https://developers.cloudflare.com/agent-setup/claude-code/
- Plugin oficial Codex: https://developers.cloudflare.com/agent-setup/codex/
- Cloudflare Registrar: https://developers.cloudflare.com/registrar/about/

**Fin. La publicacion nunca se da por completada sin URL comprobada, pruebas y autorizacion correspondiente.**
