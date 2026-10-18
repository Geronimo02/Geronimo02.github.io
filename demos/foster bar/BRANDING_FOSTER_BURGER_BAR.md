# FOSTER BURGER BAR
## Manual de marca + dirección creativa + especificación web para Codex

> **Estado:** propuesta conceptual de identidad y experiencia digital, basada en los mockups aprobados y las referencias compartidas.  
> **Versión:** 1.0 — octubre de 2026.  
> **Uso:** documento maestro para implementar, refinar y mantener la web de Foster Burger Bar.  
> **Prioridad:** fidelidad visual, identidad propia, calidad de interacción, información verificable y rendimiento.

---

## 0. INSTRUCCIONES OBLIGATORIAS PARA CODEX

Actuá como **director de arte digital + diseñador de identidad + desarrollador frontend senior**. El objetivo es construir una experiencia web coherente con el nuevo concepto de **Foster Burger Bar**, tomando como referencia los mockups y las fotografías del paquete.

1. **Leé todo este archivo antes de escribir código.** Revisá también las referencias visuales y los recursos existentes del proyecto.
2. **No confundas Foster Burger Bar con Foster Club.** Son experiencias de la misma familia de marca, con una personalidad y una propuesta comercial diferentes. No sobrescribas la carpeta ni el código de la demo previa `demos/fooster club/`.
3. **No rediseñes libremente los mockups aprobados.** Usalos como referencia del lenguaje visual y la jerarquía. La composición debe adaptarse con criterio a pantallas reales, no utilizar la captura completa como imagen de fondo.
4. **No agregues React, Next.js, PHP o una base de datos por inercia.** Primero inspeccioná la tecnología existente; para una landing, catálogo y reserva por WhatsApp pueden alcanzar HTML, CSS y JavaScript.
5. **No inventes productos, precios, promociones, reseñas, teléfono, disponibilidad de mesas ni datos empresariales.** Los ejemplos visuales son ilustrativos y no deben publicarse como información real.
6. **No implementes un backend, panel administrativo ni pagos sin una decisión explícita posterior.** Este entregable define identidad y experiencia; el flujo de reservas se especifica con honestidad más abajo.
7. **Diferenciá imágenes reales del negocio de imágenes conceptuales generadas.** No presentes fotografías sintéticas de interiores/personas como prueba documental del local real. Para el sitio definitivo, privilegiá fotografías aprobadas por el negocio.
8. Trabajá por fases: **auditoría → tokens y tipografía → componentes → secciones → movimiento → responsive → QA**.
9. Antes de desplegar, entregá capturas a **1440, 1024, 768 y 390 px**, más una grabación breve de scroll/microinteracciones. **No publiques en producción sin aprobación.**

---

## 1. NOMBRE, POSICIONAMIENTO Y FAMILIA DE MARCA

### Nombre oficial propuesto

- **Marca visible:** `foster`
- **Descriptor:** `BURGER BAR`
- **Nombre completo:** **Foster Burger Bar**
- **Frase madre:** **«Un barcito donde pasan cosas lindas.»**
- **Concepto ampliado:** burgers bien hechas, cocktails, música y noches para quedarse un rato más.
- **Ubicación:** Tandil, Provincia de Buenos Aires, Argentina.

**Decisión de naming:** mantener Foster Burger Bar, sin introducir un nombre nuevo que rompa el reconocimiento de la marca. La palabra `foster` es protagonista y `BURGER BAR` contextualiza la experiencia.

### Diferencia con Foster Club

| Atributo | Foster Club | Foster Burger Bar |
|---|---|---|
| Centro de la propuesta | Burgers y pedidos | Salir, cenar, tomar algo, escuchar música |
| Sensación | Retro, informal, juguetona | Editorial, nocturna, íntima y premium |
| Paleta | Bordó/crema con acento naranja | Verde bosque/negro/crema con cobre y bordó |
| Recursos icónicos | Perritos en Vespa, diner | Logo tipográfico, grilla verde, fotografías nocturnas |
| CTA principal | Carta / pedido | Reservar martes y miércoles / ver carta |
| Tono | Divertido y espontáneo | Cercano, seguro, cálido, sofisticado sin pose |

**No reutilizar la mascota de la Vespa en la home del bar.** El vínculo entre ambas marcas lo sostienen `foster`, la buena comida y algunos detalles gráficos, no los mismos recursos visuales.

### Promesa y personalidad

- **Promesa:** una salida que combina comida, buenos tragos, música y encuentro.
- **Valores:** autenticidad, hospitalidad, calidad, disfrute y cercanía.
- **Rasgos:** nocturna, cálida, social, cuidada, elegante pero accesible.
- **Evitar:** elitismo, lujo ostentoso, sobreproducción artificial, clichés de boliche y comunicación corporativa fría.

---

## 2. SISTEMA DE LOGOTIPOS

### Logotipo principal

`foster` en letras claras, con presencia tipográfica, y `BURGER BAR` debajo en mayúsculas espaciadas. Respetar siempre que sea posible las formas del logotipo real suministrado por el negocio; **el mockup es una dirección de arte, no un archivo maestro vectorial oficial**.

**Variantes necesarias:**

1. Horizontal o principal: `foster` + descriptor `BURGER BAR`.
2. Compacta: `foster` sin descriptor para móvil si el espacio es reducido.
3. Monograma: `f` dentro de un círculo para favicon, avatar o sello; **requiere validación final del titular de la marca**.
4. Monocromo marfil sobre fondo oscuro.
5. Negativo verde oscuro sobre marfil.

**Espacio de seguridad:** al menos la altura visual de la letra `f` minúscula alrededor del logo. Evitar estiramientos, sombras intensas, biseles, degradados sobre la marca y cambios arbitrarios de proporción.

**Tratamiento de `Party`:** en las referencias hay papelería verde con `Party` en script cobrizo. Utilizarlo como recurso de campañas/noches/eventos **solo si corresponde**. **No** duplicar el texto `Burger Bar` en dos tipografías dentro del logo principal.

---

## 3. PALETA OFICIAL PROPUESTA

| Token | Valor HEX | Función |
|---|---|---|
| Forest | `#1B3A2E` | Color identitario, grillas, paneles y botones secundarios |
| Midnight | `#0D0F0F` | Fondo principal, contraste, overlays nocturnos |
| Oxblood | `#6B1F24` | Acentos de ambiente, momentos especiales, luz de fondo |
| Amber | `#C7772B` | Detalles, líneas, hover, marcadores de sección |
| Ivory | `#F1E8D9` | Títulos, texto destacado, superficies claras y botones principales |
| Warm Muted | `#BEB2A0` | Textos secundarios y subtítulos |

**Proporción orientativa:** 50% Midnight, 25% Forest, 15% fotografía, 8% Ivory y 2% Amber/Oxblood para acentos. No se trata de una regla matemática rígida sino de evitar que el cobre domine la interfaz.

### Tokens CSS iniciales

```css
:root {
  --color-forest: #1B3A2E;
  --color-midnight: #0D0F0F;
  --color-oxblood: #6B1F24;
  --color-amber: #C7772B;
  --color-ivory: #F1E8D9;
  --color-muted: #BEB2A0;
  --color-surface: #101B16;
  --color-border: rgba(241, 232, 217, 0.22);
  --color-overlay: rgba(7, 12, 10, 0.62);
  --container: 1360px;
  --radius-card: 2px;
  --radius-pill: 999px;
  --ease-editorial: cubic-bezier(.22, 1, .36, 1);
}
```

**Criterios:** asegurar contraste legible sobre fotografías y superficies oscuras. No usar cobre para párrafos pequeños si no cumple contraste suficiente; reservarlo preferentemente para acentos, etiquetas grandes o líneas.

---

## 4. TIPOGRAFÍAS Y JERARQUÍA

El moodboard trabaja una estética próxima a Recoleta / Neue Montreal / Space Mono. Para la implementación proponemos **alternativas gratuitas con licencias abiertas**, sin exigir licencias comerciales de fuentes premium:

| Uso | Fuente recomendada | Tratamiento |
|---|---|---|
| Titulares editoriales | **Fraunces** | Serif expresiva, peso 500-650, tracking ligeramente negativo |
| UI y texto | **DM Sans** | Legible, pesos 400/500/600 |
| Microcopy, horarios, numeración | **Space Mono** | Mayúsculas puntuales, letras espaciadas |
| Acentos manuscritos ocasionales | **Caveat** | Una frase breve, nunca contenido esencial |

Todas disponibles en Google Fonts. Respetar las licencias al descargarlas/autoalojarlas. Si el titular aporta el archivo del logotipo, **no reconstruir el logo simplemente escribiendo `foster` con Fraunces**.

### Escala orientativa

- **Hero H1:** `clamp(3.4rem, 6.4vw, 7rem)`; line-height `0.94–1.02`.
- **Título de sección H2:** `clamp(2.5rem, 4.2vw, 5rem)`; line-height `1.02–1.1`.
- **Título de tarjetas H3:** `clamp(1.25rem, 1.7vw, 1.85rem)`.
- **Párrafos:** `1rem–1.125rem`, line-height `1.5–1.7`.
- **Microetiquetas:** `0.68rem–0.8rem`, tracking `0.14–0.22em`.

Evitar que la tipografía editorial reduzca el espacio para leer. No ajustar la home a una altura fija solo para imitar la proporción del mockup vertical.

---

## 5. LENGUAJE GRÁFICO

**Grilla:** retícula fina cobre/verde inspirada en las tarjetas originales de Foster. Usar como textura secundaria (sección conceptual, fondo de reservas, papelería), a opacidad muy baja; no cubrir todas las fotografías con líneas.

**Geometría:** recortes rectangulares, bordes finos, separadores horizontales, módulos asimétricos y espaciados generosos. Priorizar líneas editoriales sobre sombras de tarjeta tipo SaaS.

**Acentos:** flechas pequeñas, numeración, trazo manuscrito corto, algún sello `f`, pequeños indicadores `BURGERS / COCKTAILS / MUSIC / PEOPLE`.

**Fotografía:** tomas nocturnas, luces ámbar/rojas, barras y metales con reflejos, hamburguesas de tamaño realista, cocktails, manos, música y encuentros auténticos. Mantener color grading consistente y margen de aire para texto.

**No hacer:** neón excesivo, renders hiperbrillantes, hamburguesas enormes e irreales, vidrio falso, decoraciones arbitrarias, iconografía cartoon, emojis en la web premium, bloques con esquinas demasiado redondeadas.

---

## 6. TONO DE VOZ Y COPY

### Cómo habla Foster Burger Bar

- Español rioplatense natural. Cercano, directo, elegante sin sonar distante.
- Oraciones breves, con personalidad. Se puede usar `vení`, `reservá`, `quedate` y `pasá`.
- Comunicar **el plan completo**, no solo vender una hamburguesa.
- No prometer exclusividad, capacidad, fechas de shows ni disponibilidad no verificada.

### Mensajes aprobados / de referencia

**Tagline principal:**

> Un barcito donde pasan cosas lindas.

**Presentación corta:**

> Smash burgers, cocktails, buena música y noches que se quedan.

**Experiencia:**

> Noches que se viven distinto.

**Social:**

> Buenas burgers. Mejores noches.

**Frases auxiliares:**

- Para los que siempre se quedan un rato más.
- El plan siempre es mejor acá.
- Música, tragos, burgers y buena gente.
- Una buena noche empieza con un buen plan.

### Textos operativos respaldados por el perfil compartido

- **Horario:** martes a domingo, desde las 19:00 h.
- **Reservas:** solamente martes y miércoles.
- **Take away:** derivar a `@fosterclubb`.
- **Instagram del bar:** `@fosterburgerbar`.
- **Dirección mostrada en el perfil:** Juncal 595, Tandil (confirmar antes de publicar).

No inventar hora de cierre ni un WhatsApp oficial. No afirmar que otras noches existe reserva online. Si se usa la frase «por orden de llegada», verificarla con el negocio antes de publicarla.

### No usar

- «La mejor hamburguesa de Tandil» como afirmación factual sin respaldo.
- «Reservas confirmadas 24/7» si no existe ese sistema.
- Precios del mockup como si fueran actuales.
- Fotos generadas como si documentaran el espacio físico real.
- Lenguaje genérico de ecommerce: «compra ya», «descuentos increíbles», «oferta imperdible».

---

## 7. SISTEMA DE FOTOGRAFÍA Y ASSETS

Los mockups muestran una **dirección visual**. La carpeta del paquete adjunto contiene fotografías conceptuales generadas en horizontal `16:9` (1672 × 941 px) para construir la demo. Su uso comercial definitivo requiere aprobación y, cuando se describan las instalaciones reales, deben sustituirse por fotos autorizadas del lugar.

### Referencias visuales incluidas

- `referencias/branding-moodboard.png`: paleta, tipografías y sistema visual.
- `referencias/home-aprobada.png`: composición de landing premium.
- `referencias/carta-reservas-contacto.png`: composición de carta, reservas y contacto.

### Imágenes horizontales de trabajo

| Archivo | Uso recomendado | Encuadre esperado |
|---|---|---|
| `assets/hero-burger-cocktail.webp` | Hero, marketing | Burger y cocktail; conservar aire para texto |
| `assets/cocktail-signature.webp` | Cócteles, carrusel | Vaso principal, reflejos cálidos |
| `assets/dj-vinyl.webp` | Música, experiencia | Vinilo/mesa de DJ, luz roja/ámbar |
| `assets/social-amigos.webp` | Ambiente social | Grupo en mesa, gente/encuentro |
| `assets/loaded-fries.webp` | Carta, sides | Plato para compartir |
| `assets/ambiente-bar.webp` | Experiencia, reservas | Interior de bar conceptual |
| `assets/burger-closeup.webp` | Carta, destacados | Burger en primer plano |

**Nota clave:** son piezas conceptuales y no fotografías verificadas del establecimiento. La prioridad visual es reemplazar en producción `ambiente-bar` y `social-amigos` por fotos reales aprobadas; y usar fotos reales de productos cuando estén disponibles.

### Reglas técnicas

- Servir `webp` o `avif`; mantener original para edición si está disponible.
- Aplicar `object-fit: cover` y definir `object-position` por imagen, nunca un crop automático ciego.
- Usar `width`/`height` o `aspect-ratio` para evitar CLS.
- Precargar solamente la imagen crítica del hero y usar `loading="lazy"` para el resto.
- No imprimir texto dentro de fotografías de interfaz: titulares, etiquetas y CTA deben ser HTML accesible.
- Añadir `alt` descriptivo; decoraciones puras pueden tener `alt=""`.

---

## 8. EXPERIENCIA WEB Y ARQUITECTURA DE CONTENIDOS

La web debe sentirse como un restaurante/bar premium real, con la precisión y el ritmo del último mockup aprobado. Inspirarse en la fluidez y composición modular de la referencia aportada por el usuario, sin copiar estructura propietaria, textos, código o marca de terceros.

### Home `/`

**01 — Header**
- Logo real/validado a la izquierda.
- Navegación: `Inicio`, `Carta`, `Reservas`, `Galería`, `Contacto`.
- CTA primario `Reservar mesa` claramente condicionado a martes y miércoles.
- Header transparente al inicio y fondo oscuro/verde al hacer scroll.

**02 — Hero editorial**
- Fotografía de burger/cocktail o ambiente de bar, preferentemente imagen real del negocio si está disponible.
- Título dominante: **«Un barcito donde pasan cosas lindas.»**
- Bajada: «Smash burgers, cocktails, buena música y noches que se quedan.»
- CTA primario `Reservar mesa`, CTA secundario `Ver carta`.
- Acento manuscrito único: `Good food. Better nights.`
- Contraste controlado y composición con texto independiente de la fotografía.

**03 — Destacados de la carta**
- Título `DESTACADOS DE LA CARTA`.
- Módulos editoriales para burger, acompañamiento y cocktail, con foto, nombre, descripción breve y precio **solo si está verificado**.
- CTA `Ver carta completa`.
- Usar datos separados del layout, para actualizar sin rehacer componentes.

**04 — La experiencia Foster**
- Fotografía real o conceptual de música/vida nocturna, layout asimétrico.
- Título `Noches que se viven distinto.`
- Copy sobre música, cocktails, personas y encuentro.
- Detalles gráficos reducidos: grilla, numeración, pequeño trazo escrito.

**05 — Reservas**
- Texto principal `Reservas solo martes y miércoles.`
- Horario general `Martes a domingo desde las 19:00 h`.
- CTA `Solicitar reserva` o `Reservar mesa`, sujeto al mecanismo real.
- Refuerzo de la alternativa take away en Foster Club.

**06 — Galería horizontal**
- Fotografías de burgers, cocktails, DJs, personas y ambiente; controles táctiles/accesibles.
- Cambios de imagen suaves, sin autoplay agresivo.

**07 — Contacto y footer**
- Dirección a verificar, Google Maps, Instagram `@fosterburgerbar` y derivación a `@fosterclubb` para take away.
- Información clara sobre cuándo se aceptan reservas.
- Logo, navegación secundaria y copyright sin fecha inventada.

### Carta `/carta/`

- Página propia, no solo una sección con tres tarjetas.
- Categorías dinámicas según menú **real**: burgers, acompañamientos, cocktails, y otras solo si están confirmadas.
- Nombre, descripción, precio, imagen y opcionales únicamente con datos verificados.
- La carta del bar **no debe convertirse automáticamente en un checkout genérico**; su objetivo principal es explorar y decidir qué pedir al visitar el local.
- Para pedidos al paso, presentar enlace visible a `@fosterclubb`.
- Preparar estructura modular para ampliaciones futuras sin obligar a crear backend.

### Reservas `/reservas/` (solo si hace falta una vista específica)

- Si no existe sistema de reservas ni número oficial configurado, **no simular una confirmación**.
- Formulario conceptual: nombre, fecha, personas, horario preferido y medio de contacto.
- Restringir fechas seleccionables a **martes y miércoles**.
- Si se conecta a WhatsApp, enviar una **solicitud prellenada**, nunca un mensaje automático de «reserva confirmada».
- Si en el futuro se necesita confirmación y cupos reales: evaluar backend, calendario, seguridad, persistencia y administración como **otro alcance**.

---

## 9. COMPONENTES Y ESTADOS

### Botones

- **Primario:** fondo Ivory, texto Midnight, rectangular de bordes moderados; hover suavemente invertido.
- **Secundario:** borde fino Ivory/Amber y fondo transparente; hover con leve relleno Forest.
- **Tercero:** enlace textual con flecha animada, sin caja.

### Cards

- Fotografía con ratio coherente, borde `--color-border`, panel oscuro.
- Título serif; microetiqueta mono; cuerpo DM Sans.
- Transiciones cortas de imagen y flecha; nada de saltos fuertes o múltiples sombras.

### Formularios

- Fondo oscuro o forest, campos claramente etiquetados, contraste suficiente.
- Focus visible, errores inline, validación accesible, estado `enviando` y manejo honesto de fallos.
- No generar inputs falsamente interactivos.

### Navegación móvil

- Menú fullscreen o drawer oscuro, títulos amplios y acciones claras.
- Cierre accesible, bloqueo de scroll del fondo y soporte para teclado.

---

## 10. MOTION DESIGN: PREMIUM, NO RECARGADO

**La web debe tener movimiento, pero no parecer una demo de efectos.** Elegancia, ritmo y propósito.

| Elemento | Efecto sugerido | Duración orientativa |
|---|---|---|
| Hero H1 | Reveal por línea, opacity + `translateY(18px)` | 600-850 ms |
| Imagen de hero | Zoom-in casi imperceptible al cargar (`1.04 → 1`) | 900-1300 ms |
| Header | Transición de fondo al desplazarse | 250-350 ms |
| Cards | Imagen escala `1 → 1.035`; flecha avanza 4 px | 250-400 ms |
| Secciones | Reveal escalonado al entrar en viewport | 500-750 ms |
| Galería | Scroll horizontal suave, drag táctil, controles reales | según interacción |
| Botones | Color/relleno y flecha sincronizados | 180-260 ms |
| Reservas | Campos y CTA aparecen con transición ligera | 400-650 ms |

### Restricciones técnicas

- Preferir `transform` y `opacity` para no bloquear el layout.
- Usar `IntersectionObserver` para reveals simples; GSAP solo si el efecto realmente lo requiere y existe justificación.
- No usar scroll hijacking, cursor personalizado obligatorio, loaders de varios segundos ni parallax intenso en móvil.
- Respetar `prefers-reduced-motion: reduce`: desactivar movimiento no esencial sin ocultar contenido.
- Nunca dejar contenido permanentemente invisible por error de JS.

---

## 11. RESPONSIVE, RENDIMIENTO Y ACCESIBILIDAD

- Referencias visuales de prueba: **1440, 1024, 768 y 390 px**.
- Contenido máximo: `1360px` aprox.; gutters proporcionales y elementos legibles.
- Hero desktop editorial con texto y fotografía; hero móvil apilado o con recorte focal ajustado, sin superposiciones.
- Categorías y cards de carta deben convertirse en una columna o carrusel táctil sin cortar descripciones.
- No fijar alturas de secciones que contengan texto variable. Usar `min-height` solo donde corresponde.
- Objetivos de Lighthouse orientativos: buena experiencia móvil, mínimo CLS, imágenes optimizadas, links funcionales y HTML semántico.
- SEO inicial: un H1 por página, `<title>` y descripción únicos, Open Graph, `alt`, sitemap y datos estructurados **solo con información verificada**.
- Contraste, foco visible, navegación de teclado, orden lógico de encabezados, labels de formulario, targets táctiles adecuados.
- No introducir loaders ni scripts de terceros que perjudiquen la carga si no son necesarios.

---

## 12. ESTRUCTURA DE ARCHIVOS SUGERIDA

Adaptar a la arquitectura real del proyecto: **no crear carpetas duplicadas si ya existe una estructura válida**.

```text
foster-burger-bar/
├── index.html
├── carta/
│   └── index.html
├── reservas/
│   └── index.html            # opcional
├── css/
│   ├── tokens.css
│   ├── components.css
│   └── pages.css
├── js/
│   ├── site.js
│   ├── gallery.js
│   └── reservations.js
├── data/
│   └── carta.js              # productos reales / modo demo identificado
├── assets/
│   ├── hero-burger-cocktail.webp
│   ├── cocktail-signature.webp
│   ├── dj-vinyl.webp
│   ├── social-amigos.webp
│   ├── loaded-fries.webp
│   ├── ambiente-bar.webp
│   └── burger-closeup.webp
└── BRANDING_FOSTER_BURGER_BAR.md
```

---

## 13. CHECKLIST DE APROBACIÓN

- [ ] Se identifica como **Foster Burger Bar**, no como Foster Club.
- [ ] Logo, descriptor y monograma aplicados sin deformaciones ni marcas duplicadas.
- [ ] Paleta y tipografías implementadas con tokens reutilizables.
- [ ] La home mantiene la estética nocturna/editorial del mockup.
- [ ] Fotografías horizontales sin cortes absurdos y prioridad a material real autorizado.
- [ ] Copy cálido y rioplatense; datos operativos y contactos verificables.
- [ ] Carta independiente, legible y basada en datos, sin precios inventados.
- [ ] Reservas solo martes y miércoles; solicitud ≠ confirmación.
- [ ] Navegación y botones cumplen la acción indicada.
- [ ] Animaciones visibles pero suaves; versión reducida para accesibilidad.
- [ ] No hay contenido que desborde a 1440/1024/768/390 px.
- [ ] HTML semántico, SEO inicial, imágenes optimizadas, teclado y focus.
- [ ] No se modificó la demo anterior de Foster Club.
- [ ] Capturas y video de QA presentados **antes de publicar**.

---

## 14. PROMPT DE EJECUCIÓN PARA CODEX (COPIAR Y PEGAR)

> Quiero implementar/refinar el branding y la web de **Foster Burger Bar** con máxima fidelidad a las referencias visuales del kit.
>
> Leé completamente `BRANDING_FOSTER_BURGER_BAR.md` y analizá `referencias/branding-moodboard.png`, `referencias/home-aprobada.png` y `referencias/carta-reservas-contacto.png`.
>
> Primero inspeccioná el proyecto y explicame qué ya existe, qué falta y cómo lo implementarías. No sobrescribas el proyecto separado de Foster Club.
>
> Respetá nombre, colores, fuentes, tono, composición fotográfica y microinteracciones del manual. Usá los assets individuales del kit, no la captura de la landing como fondo.
>
> La prioridad es una **home premium real**, con carta independiente y CTA de reservas que respete que solo se reservan mesas martes y miércoles. No inventes teléfonos, precios, promociones ni disponibilidad; si falta un dato, dejalo editable y señalalo.
>
> Conservá HTML, CSS y JavaScript cuando sea suficiente. No metas un dashboard, PHP, React, base de datos ni servicio pago sin justificarlo y consultarme.
>
> Validá desktop y móvil con capturas reales, probá los botones, animaciones, enlaces, formulario y accesibilidad. Entregá capturas comparativas y diferencias pendientes antes de hacer un push a producción.

---

### Nota final

Este documento es una **propuesta de branding y dirección digital**, no una confirmación de identidad gráfica legal ni un inventario comercial oficial. Las fotografías del kit son **conceptuales**. Validar logo maestro, menú, precios, horarios, contacto y políticas de reserva con el negocio antes del lanzamiento público.
