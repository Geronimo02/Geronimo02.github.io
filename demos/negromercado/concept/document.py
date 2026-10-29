from pathlib import Path
import json, html, datetime
p=Path(__file__).resolve().parent.parent
def write(name,obj):
    dest=p/name;dest.parent.mkdir(parents=True,exist_ok=True)
    dest.write_text(json.dumps(obj,indent=2,ensure_ascii=False)+'\n' if not isinstance(obj,str) else obj)
directions=[]
for key,title,concept,narrative,layout,motion,mobile,signature in [
('a','Negro, de cerca','Gastronomía en primer plano: deseo de producto y acceso directo a carta.','El antojo abre la visita; carta por momentos y cierre en la esquina.','Fotografía oscura a sangre, gran titular superpuesto; segunda escena crema en dos columnas con tabs.','Entrada breve del titular, transición de contenido al cambiar pestañas, hover de CTA.','Hero de 775px con recorte al 65%; tipografía 79px; segunda escena apilada y tabs con teclado.','Un café en Negro, subrayado gestual y contraste nocturno/crema.'),
('b','La pausa de Avellaneda','Una pausa luminosa y cercana, con protagonismo del tiempo compartido.','Primero la invitación a quedarse, luego los momentos del día y la dirección.','Portada crema asimétrica con foto vertical de remate arqueado; cinta editorial y acordeón azul grisáceo.','Entrada suave de escena, hover de CTA, apertura nativa de secciones.','Título 77px, foto de 330px debajo de copy; cinta reducida y acordeón amplio.','Acá, el tiempo es tuyo; fotografía cálida y gran arco como gesto editorial propuesto.')]:
    directions.append(dict(id=key,title=title,concept=concept,narrative=narrative,layout=layout,typography='Bricolage Grotesque 800 + DM Sans 400 (propuesta OFL, no fuentes originales confirmadas)',imagery='REPRESENTACION: imágenes generadas, explícitamente rotuladas; originales del negocio pendientes',motion=motion,mobile=mobile,cta='Carta oficial; WhatsApp general sin texto preenviado; cómo llegar',signature=signature,source_priority='marca',identity_traces=['Identidad renovada observada: minúsculas redondeadas → tratamiento tipográfico propuesto, no logo oficial','Crema/verde/azul de la marca → paleta interpretada, HEX no master','Bio café/pastelería/vermú → categorías y narrativa de momentos','Avellaneda 702 → cierre de visita con horario oficial'],risks=['Sin capturas ni revisión visual de render','Imágenes ilustrativas; no muestran el negocio ni productos exactos','Original de logo y validación comercial pendientes'],reference_status='Referencias inspeccionadas; aplicación escrita en código, resultado visual no verificado'))
board=dict(version='1',business='Negro Mercado',mode='demo',selected=None,selection_status='pendiente',approval_record='',recommended='a',stage_status='in_progress_render_pending',directions=directions)
write('concept/board.json',board)
items=[]
for id,url,kind,observed,principle,anchor,keys,dont in [
('R01','https://gails.com/','visual','Portada comercial con producto a sangre, texto superpuesto y dos accesos claros; inspección visual directa de la home.','Dominancia fotográfica y texto corto con CTA de carta.','Oferta de café y pastelería, producto como atractivo principal.',['a'],'No copiar tipografía serif, rojo, fotos, marca ni composición exacta.'),
('R02','https://lacabra.com/pages/east-village','visual','Página de local: campo fotográfico vertical junto a texto, dirección, horario y Directions; inspeccionada sin overlays.','Vincular una invitación editorial con datos para visitar.','Esquina Avellaneda 702 y horarios publicados.',['b'],'No copiar imágenes, paleta literal, logo ni atribuir su interior a Negro Mercado.'),
('R03','https://ui.aceternity.com/components/tabs','component','Se inspeccionó demo y se pulsó Services: estado activo en píldora, panel cambia con jerarquía por capas.','Tabs con estado visible y recambio de contenido; adaptación propia con ARIA y teclado.','Café, pastelería y vermú como entradas naturales a la carta.',['a'],'No copiar código del componente, stack React, púrpura SaaS ni tarjetas apiladas.'),
('R04','https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/','motion','Documentación oficial consultada sobre condiciones responsive y reduced motion; no se ejecutó un demo GSAP.','Adaptar presentación por viewport y suprimir movimiento si el sistema lo pide.','Pausa tranquila y acceso móvil claro.',['a','b'],'No afirmar uso de GSAP: se implementó CSS y Web Animations nativos; no se añadió la dependencia.')]:
    items.append(dict(id=id,url=url,priority='P2',kind=kind,status='verified' if id!='R04' else 'partial',decision='inspiration_only',observed=observed,principle=principle,brand_anchor=anchor,concept_path='concept/directions/'+keys[0]+'/index.html',concept_screen=None,applied_to=keys,implementation_status='written_not_render_verified',license_checked='not_applicable_inspiration',dont_copy=dont))
write('REFERENCE-APPLICATION.json',dict(business='Negro Mercado',user_reference_urls=[],items=items,selection_note='No reference marked selected until screenshot evidence exists. Sources actually inspected; implementation awaits rendering.'))
write('REFERENCES.md','''# Referencias inspeccionadas · S3

No se tomó una plantilla. Se estudiaron recursos concretos y se escribieron composiciones propias. REFERENCE-APPLICATION.json distingue la inspección de la referencia de la verificación del resultado: ninguna aplicación se marca seleccionada/verificada sin captura.

| Fuente | Observación y traducción |
|---|---|
| [GAIL’s](https://gails.com/) | Foto dominante de pastelería y CTA sobre imagen → A: hero oscuro a sangre, copy corto y carta inmediata. No se usan sus fotos ni código. |
| [La Cabra East Village](https://lacabra.com/pages/east-village) | Foto vertical + datos del local → B: portada asimétrica y cierre con dirección/horarios. Sin atribuir su arquitectura a Negro. |
| [Aceternity Tabs](https://ui.aceternity.com/components/tabs) | Demo pulsada: estado activo y cambio de panel → A: tabs nativos accesibles con transición de 240ms. No se copia código. |
| [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) | Consulta documental sobre condiciones y reduced motion → ambas: CSS responsive y movimiento reducido; no se usa la librería GSAP. |

Refero fue consultado solo a nivel de entrada, no se obtuvo una pantalla concreta aplicable. 21st.dev y Spline no se registran como utilizados. No se suma 3D sin función comercial para esta cafetería. No se finge usar todas las bibliotecas.

La referencia de máxima prioridad sigue siendo la identidad renovada del Instagram oficial, documentada en BRAND.md. Las fuentes comerciales anteriores inspiran principios, no assets licenciados.
''')
write('CONCEPT-BOARD.md','''# Negro Mercado · S3 en revisión

Dos prototipos HTML autocontenidos, todavía sin render verificado. Abrir concept/index.html permite comparar A/B y encuadres de 1440/390; el selector cambia el ancho del iframe, no constituye evidencia de captura ejecutada.

| Dirección | Composición | Exploración | Carácter |
|---|---|---|---|
| A · Negro, de cerca | Foto oscura a sangre + tipografía grande | Tabs de café, pastelería y vermú | Intensa, gastronómica, directa |
| B · La pausa de Avellaneda | Lienzo crema + foto vertical arqueada | Acordeón editorial por momentos | Luminosa, pausada, cercana |

Recomendación provisional: A, por el peso del producto y acceso inmediato a carta. No hay dirección elegida por el usuario.

Ambas incluyen navegación móvil, enlaces de carta/consulta/ubicación y tratamiento de movimiento reducido. Esto describe el código, no una prueba de funcionamiento superada. Los precios se omiten porque la vigencia y leyendas de variantes siguen pendientes.

Los productos nombrados proceden de S2 y vermutería de la bio oficial. Fotografía: REPRESENTACION generada; no se presenta como foto real. El nombre de marca está compuesto tipográficamente, no se ha reconstruido un master de logo.

## Bloqueo de verificación

El script Python de captura no pudo arrancar porque falta Playwright Python. Node Playwright existe, pero su Chromium no está instalado. La descarga oficial devolvió una página Site Unavailable en lugar del archivo. Un intento de abrir una prueba por data URL en el navegador conectado fue rechazado por política de protocolos. No se intentaron vías indirectas en ese navegador.

No existen capturas reales de estos conceptos ni QA interactivo ejecutado. G0/G1/G2 no aprobados. S3 permanece en curso y S4 no empieza. Próximo paso: renderizar los HTML por una vía permitida, inspeccionar 1440/390, probar tabs/acordeón/navegación, corregir y recién entonces presentar selección final de dirección.
''')
write('concept/README.md','''# Comparador de conceptos

Abrir index.html en un navegador, sin servidor ni dependencias de red. Incluye ambos estudios embebidos. Cada directions/{a,b}/index.html también funciona por separado.

build.py regenera los estudios desde fuentes y assets locales. document.py actualiza contratos/documentación. verify.cjs prepara capturas y pruebas con Node Playwright, pero NO pudo ejecutarse por falta de Chromium. Si el navegador está disponible: `node concept/verify.cjs` (requiere CODEX_PRIMARY_RUNTIME_NODE_MODULES o adaptar la ruta al Playwright local).

Las capturas pendientes están documentadas en screens/capture-results.json; no hay PNG inventados. No desplegar este proyecto: es exploración S3, no dirección aprobada.
''')
write('concept/assets/PROVENANCE.md','''# Assets del concepto

- dark.webp / sun.webp: imágenes generadas el 19/10/2026 para explorar dirección artística. REPRESENTACION. No muestran Negro Mercado, personas reales ni productos exactos del negocio. Versiones optimizadas a 1400x933, WebP calidad 84. Se usan únicamente rotuladas como ilustración. Reemplazo por originales autorizados pendiente.
- Prompt dark: premium editorial food photograph; dark tabletop; green ceramic flat white cup, torn croissant on plate on right, left negative space; no text/logos/buildings/people; generic conceptual illustration, not actual business.
- Prompt sun: premium editorial photograph; warm cream tabletop, golden croissant, ivory espresso cup, forest green linen, vermouth and orange upper right, afternoon sun; no text/logos/buildings/people; generic conceptual illustration.
- display.ttf: Bricolage Grotesque 800; body.ttf: DM Sans 400. Descargadas mediante CSS oficial de Google Fonts. Propuesta de diseño, no fuentes originales confirmadas de Negro. Licencias OFL adjuntas, obtenidas de google/fonts (ofl/bricolagegrotesque/OFL.txt y ofl/dmsans/OFL.txt).
- Referencias fotográficas reales permanecen como enlaces en S2, no se redistribuyen. No se usa foto del interior de otro café para representar este negocio.
''')
write('concept/screens/capture-results.json',dict(status='not_tested',captures=[],interactive_tests='not_run',reason='Python Playwright absent; Node Chromium absent; official browser download unavailable; browser data URL blocked by URL policy',no_workaround_attempted=True))
state=json.loads((p/'PROJECT-STATE.json').read_text());state.update(updated_at=datetime.datetime.now(datetime.timezone.utc).isoformat(),stage='S3',next_stage='S3',approval_status='Continuación S3 autorizada; conceptos preparados, render y selección pendientes',next_action='Render y QA permitidos a 1440/390, correcciones y presentación para elegir dirección; no S4',publish_authorized=False)
state['stages']['S2'].update(status='accepted_for_concept',user_approved=True,approval_scope='Usuario continúa a S3; no validación del negocio de precios, derechos ni stock')
state['stages']['S3'].update(status='in_progress_render_pending',user_approved=False,evidence=['CONCEPT-BOARD.md','REFERENCE-APPLICATION.json','REFERENCES.md','concept/board.json','concept/index.html','concept/directions/a/index.html','concept/directions/b/index.html'],open_issues=['Render y capturas 1440/390','QA interactivo','Selección de dirección por usuario','Originales autorizados de fotos y logo'])
state['validation'].update(s3_static='pending',s3_visual='not_tested',s3_interactive='not_tested');state['decisions'].append(dict(date='2026-10-19',status='authorized_by_user',decision='«seguimos nomas» autoriza explorar S3; no aprobar una dirección ni publicar'))
write('PROJECT-STATE.json',state)
with (p/'SESSION-RESUME.md').open('a') as f:f.write('\n## S3 · avance del 19/10/2026\nUsuario autoriza seguir. Dos conceptos y comparador offline en concept/. Referencias inspeccionadas y aplicación escrita; REFERENCE-APPLICATION.json no marca selected sin capturas. A recomendación provisional, no elegida. Imágenes generadas rotuladas REPRESENTACION; fuentes OFL adjuntas. Bloqueo técnico de render documentado en CONCEPT-BOARD.md; sin capturas ni pruebas interactivas ejecutadas. Próximo: render permitido 1440/390, revisar, corregir y presentar elección. No S4 ni deploy.\n')
with (p/'DECISIONES.md').open('a') as f:f.write('\n### S3 · continuación autorizada\n- Usuario pide seguir e insiste en assets, referencias, componentes y animación. Se inspeccionaron GAIL’s, La Cabra y Aceternity Tabs; GSAP como referencia documental.\n- Se construyen A fotográfica oscura y B editorial luminosa, con composiciones e interacción diferentes. A recomendada provisionalmente.\n- Sin originales licenciados, se generan imágenes genéricas rotuladas; no son pruebas del negocio.\n- Capturas bloqueadas por el entorno y protocolo del navegador; no se inventa QA. S3 en curso, no selección ni publicación.\n')
with (p/'AGENTS.md').open('a') as f:f.write('\n11. S3 autorizada y dos prototipos preparados en concept/. Prevalece el estado in_progress_render_pending: NO existen capturas verificadas ni elección. Leer CONCEPT-BOARD.md y concept/screens/capture-results.json. No afirmar S3 terminada; renderizar por vía permitida antes de solicitar aprobación final de diseño.\n')
with (p/'ASSETS.md').open('a') as f:f.write('\n## Assets de exploración S3\nDos WebP generados y dos fuentes OFL en concept/assets/, procedencia en PROVENANCE.md. REPRESENTACION rotulada, no fotos reales del negocio. Incluidos en los HTML offline. Originales/licencias de fotos reales siguen pendientes.\n')
print('Documentation saved')
