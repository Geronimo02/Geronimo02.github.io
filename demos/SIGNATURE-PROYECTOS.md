# Signature — Protocolo de continuidad de demos

**Repositorio de referencia:** \`Geronimo02/Geronimo02.github.io\` · **Ubicacion:** \`demos/<slug-del-negocio>/\`.
**Objetivo:** que cualquier chat de ChatGPT, Claude/Codex o sesion de VS Code pueda reconstruir el estado REAL de un proyecto sin depender de memoria conversacional. Este documento es un protocolo de trabajo, no una autorizacion para publicar.

## Arranque de un chat nuevo
1. Verificar skills disponibles de verdad; leer \`demos/REGLA0.md\` y las instrucciones de la skill pertinente.
2. Buscar en GitHub \`demos/<slug>/PROYECTO.md\`. Si existe, leerlo junto con \`AGENTS.md\`, \`DECISIONES.md\` y los documentos de la etapa activa. **NO** asumir que un chat nuevo hereda todo el contexto.
3. Si no existe el negocio, crear \`demos/<slug>/\` con \`PROYECTO.md\`, \`DECISIONES.md\` y \`AGENTS.md\` mínimos: identidad/URL aportadas, estado DEMO, etapa inicial, fuentes por verificar y próxima acción. **La documentación se inicia en ese momento**, no hay trabajo previo obligatorio para el usuario.
4. Confirmar en una frase lo recuperado: etapa, última decisión aprobada, rechazos, bloqueos y próximo entregable. Resolver la etapa activa, no reiniciar todo.
5. Al terminar un paso relevante, actualizar \`PROYECTO.md\` y \`DECISIONES.md\`, guardar sus entregables y subirlos al repositorio (en la rama de trabajo; no modificar la web publicada sin autorización).

## Secuencia por etapas (una por vez)
| Etapa | Skill / responsabilidad | Guardar en carpeta del negocio | Condicion de salida |
|---|---|---|---|
| 0. Inicio | Signature Studio | \`PROYECTO.md\`, \`AGENTS.md\`, \`DECISIONES.md\` | Nombre, URL/identidad y alcance DEMO o real identificados |
| 1. Marca | Brand Kit | \`BRAND.md\`, archivos de identidad autorizados | ADN visual + datos con fuente/estado |
| 2. Contenido | Signature Content | \`CONTENT.md\`, \`ASSETS.md\`, shot list | Contenido reutilizable y faltantes claros |
| 3. Concepto | Signature Concept o exploracion creativa de Signature Web | \`REFERENCES.md\`, \`CREATIVE-BRIEF.md\`, \`CREATIVE-AUDIT.md\`, previews y capturas | Direccion original + atractiva + comercial, aprobada explicitamente |
| 4. Desarrollo | Signature Web / VS Code | \`DESIGN.md\`, \`TECH-DECISIONS.md\`, \`PROTOTYPE-BRIEF.md\`, \`site/\` o archivos del sitio | Demo funcional y fiel al concepto |
| 5. Pruebas | Web/Launch segun alcance | \`QA_REPORT.md\`, \`VISUAL-QA.md\`, capturas | QA tecnico y artistico; aprobacion |
| 6. Publicacion | Signature Launch | \`ENTREGA.md\` | **Solo** con autorizacion expresa |

> Los G0/G1/G2 de creatividad (Signature Web) y los gates de Studio tienen significados distintos: registrar nombre completo + etapa + evidencia, nunca solo "G1 PASS" sin aclaracion.

## Contrato de memoria
- \`PROYECTO.md\`: nombre, fuentes, alcance, etapa exacta, enlace a la rama/preview, siguiente accion y pendientes.
- \`DECISIONES.md\`: **aprobado / rechazado / provisional / pendiente**, motivo y fecha; no revivir diseños ya rechazados.
- \`REFERENCES.md\`: cada referencia visual realmente inspeccionada con URL, captura o descripcion observada, parte aprovechable, traduccion a UI y evidencia en el prototipo. Una URL sin inspeccion **no cuenta como referencia aplicada**.
- \`AGENTS.md\`: instrucciones operativas para futuras sesiones y VS Code.
- Cada dato del negocio indica **confirmado / inferido / pendiente** y su fuente. No convertir inferencias en hechos.

## Criterio visual y comercial
La identidad no exige dibujos literales del negocio. Una propuesta debe ser propia de esa marca **y** ofrecer direccion de arte de alto nivel, fotografia protagonista cuando corresponda, tipografia y movimiento intencionales, un recorrido de conversion real y una composicion mobile trabajada. Si deriva en infografias, indices o mockups genericos, se rechaza y corrige antes de pedir seleccion.

Catalogo a investigar segun el proyecto (no implica usar todo): https://styles.refero.design/ , https://21st.dev/ , https://ui.aceternity.com/ , https://gsap.com/ , https://spline.design/ , https://webild.io/ , https://bklit.com/ , https://horizonx.so/ , https://motionsites.ai/ . Verificar acceso, licencias, rendimiento y pertinencia; documentar el ejemplo concreto usado.

## Seguridad y publicacion
Este repositorio es **PUBLICO**. Todo archivo y rama es potencialmente visible, incluso si no se muestra en el portfolio. Guardar aqui solamente documentacion y activos **publicables**. Nunca subir claves, tokens, datos privados del cliente, contratos, presupuestos no publicos, fotografías sin derechos de redistribucion ni archivos \`.env\`. \`noindex\` **no es privacidad**. Material confidencial: repositorio privado aparte, con un enlace no sensible en \`PROYECTO.md\`.
Crear archivos de memoria o ramas **no autoriza** desplegar una web, modificar \`main\`, cambiar DNS ni publicar contenido del cliente.
