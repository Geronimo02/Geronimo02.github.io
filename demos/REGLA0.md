# REGLA 0 — VERIFICACIÓN OBLIGATORIA DE SKILLS

Antes de diseñar, programar, modificar templates, crear una demo o realizar
cualquier cambio en el repositorio, verificar las skills REALMENTE disponibles
en el entorno.

No asumir que una skill existe por conocer su nombre.
No inventar skills.
No simular haber utilizado una skill.

## PASO 1 — INSPECCIONAR EL ENTORNO

Consultar el catálogo real de skills disponible.

Analizar especialmente skills relacionadas con:
- UI/UX
- diseño web
- frontend
- responsive design
- accesibilidad
- SEO
- performance
- Core Web Vitals
- testing
- QA visual
- browser testing
- imágenes/assets
- copy/contenido cuando corresponda
- deployment/hosting cuando corresponda

También detectar cualquier otra skill disponible que pueda aportar valor
específicamente al proyecto actual. No limitar la búsqueda únicamente a esta lista.

---

## PASO 2 — LEER LAS SKILLS

Para cada skill potencialmente útil:

1. Obtener su nombre exacto.
2. Confirmar que está disponible.
3. Leer su descripción.
4. Leer su SKILL.md / skill.md o instrucciones equivalentes cuando estén disponibles.
5. Entender:
   - qué hace
   - cuándo debe utilizarse
   - qué herramientas utiliza
   - qué limitaciones posee
   - qué flujo exige
   - en qué fase de este proyecto tendría sentido aplicarla

No alcanza con listar una skill. Hay que comprender sus instrucciones antes de recomendarla.

---

## PASO 3 — PRESENTAR LA SELECCIÓN

Antes de comenzar un template nuevo o una tarea importante, mostrar:

| Skill | Disponible | Para qué sirve | Aplicación en este proyecto | Recomendación |
|---|---|---|---|---|

Indicar para cada una:
- nombre exacto
- fuente/catálogo
- disponibilidad
- uso concreto
- fase donde se aplicará
- qué resultado esperamos obtener
- si conviene usarla o descartarla
- motivo

Después recomendar una combinación mínima suficiente.

---

## PASO 4 — APROBACIÓN

Para:
- un template nuevo
- modificación importante de un template
- cambio importante de arquitectura
- nueva categoría de landing
- cambio importante del sistema

mostrar primero las skills recomendadas y esperar aprobación.
No modificar archivos antes de esta aprobación.

---

## EXCEPCIÓN PARA PRODUCCIÓN DE DEMOS

Si las skills necesarias YA fueron verificadas, aprobadas y utilizadas anteriormente,
para demos sucesivas basadas en un template aprobado NO es necesario preguntar
nuevamente cuáles utilizar.

Sin embargo, antes de ejecutar la tarea:
1. confirmar que siguen disponibles
2. leer las instrucciones necesarias
3. utilizar realmente las skills correspondientes

---

## PROTOCOLO ANTES DE HACER CUALQUIER COSA

1. Leer las instrucciones del repositorio.
2. Entender qué tarea se está solicitando.
3. Verificar las skills realmente disponibles.
4. Leer las instrucciones de las skills pertinentes.
5. Determinar cuáles tienen sentido para esta tarea.
6. Si la tarea requiere aprobación de skills, presentarlas y esperar.
7. Recién después: investigar → planificar → diseñar → implementar → verificar.


---

## REGLAS TÉCNICAS PARA TODAS LAS WEBS

### A. Animaciones siempre visibles
- NO usar `prefers-reduced-motion` (ni en CSS ni con `matchMedia` en JS). Si el usuario tiene desactivadas las animaciones de Windows, la web igual tiene que verse animada.
- Referencia: FIGLIO, Foster, Hasta el moño. Ver `motion-preference.test.mjs`, que prueba ambas configuraciones.

### B. Íconos sin emojis
- NO usar caracteres de texto como íconos: `↗ → ← ↑ ↓ ★ ☆ ✦ × ✓ ✕` ni emojis. En mobile (iOS/Android) se dibujan como emoji a color y se ven mal.
- Usar siempre los íconos vectoriales de `icons.css` (máscaras SVG que toman el color del texto): `icon-arrow` (↗), `icon-arrow-right`, `icon-arrow-left`, `icon-arrow-up`, `icon-arrow-down`, `icon-close`, `icon-check`, `icon-sparkle`, `icon-star`, `icon-star-empty`. Para un ícono solo, sumar `icon-flush`.
- Los proyectos con build copian `icons.css` dentro de su `src/`.
- Excepción: el texto del mensaje de WhatsApp puede llevar emojis, porque ahí sí los renderiza WhatsApp.
- Si una web vieja ya usa un símbolo de texto, como mínimo debe llevar el selector de texto `U+FE0E` (`↗︎`) para que el celular no lo dibuje como emoji. Lo ideal sigue siendo el ícono de `icons.css`.
