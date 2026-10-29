# Recursos visuales y procedencia

## Identidad

`public/images/negro-symbol.jpg`: imagen de perfil pública de [Negro Mercado en Instagram](https://www.instagram.com/negromercado.ok/), visualmente coincidente con el símbolo aportado por el usuario en el chat. Se usa sin redibujarlo. El archivo disponible mide 150 × 150 px; conviene sustituirlo por el original de alta resolución, preferiblemente con transparencia.

## Fotografías editoriales provisionales

Estas fotos **no son del local ni de productos de Negro Mercado**. El sitio las identifica como ilustrativas. Fueron descargadas de páginas marcadas como libres bajo la [licencia de Unsplash](https://unsplash.com/license) y optimizadas a un ancho máximo de 1400 px.

| Archivo | Autor / página | Uso |
| --- | --- | --- |
| `coffee-croissant.jpg` | [Mathias Reding](https://unsplash.com/photos/a-cup-of-coffee-and-a-croissant-on-a-table-RJCODpGceTQ) | Escena de oficio y propuesta de acompañamiento |
| `coffee-table.jpg` | [Fajar Imani Firdaus](https://unsplash.com/photos/a-cup-of-coffee-and-a-croissant-on-a-wooden-table-fCUHx-iVGBE) | Escenas editoriales y cierre |
| `barista.jpg` | [Zoshua Colah](https://unsplash.com/photos/barista-making-coffee-with-espresso-machine-d_n6V0RqpN0) | Oficio y escenas editoriales |
| `cafe-interior.jpg` | [Anastasia Poskaneva](https://unsplash.com/photos/a-cozy-stylish-interior-of-a-cafe-F4W6QYmUnDg) | Escena ilustrativa de interior; no representa al local |
| `coffee-pastry.jpg` | [Rizky Subagja](https://unsplash.com/photos/latte-croissant-and-book-on-cafe-table-1k7TnX5GAww) | Escena de pastelería |

## Recortes ilustrativos generados

Estos PNG con fondo transparente se generaron para aproximar las composiciones flotantes de la referencia. **No muestran productos reales de Negro Mercado.** La home los identifica como ilustraciones. No contienen logotipos ni textos generados.

| Archivo | Uso |
| --- | --- |
| `hero-cup-illustration.png` | Vaso, café y granos del hero, composición a la derecha |
| `iced-coffee-illustration.png` | Vaso frío de la historia y representación ilustrativa de Iced Latte |
| `latte-illustration.png` | Representación ilustrativa de Latte y escena “Cada taza” |
| `vermu-illustration.png` | Representación ilustrativa del vaso de vermú |
| `espresso-illustration.png` | Representación ilustrativa de espresso en la carta |
| `lemonade-illustration.png` | Representación ilustrativa de limonada en la carta |
| `coffee-bean-illustration.png` | Grano aislado para el movimiento decorativo de home |

Reemplazar estas imágenes por fotos propias autorizadas preservando el nombre de archivo o actualizando `src/Home.tsx` y `src/MenuPage.tsx`. Prioridades de fotografía: producto protagonista para hero, cafés y laminados en carta, barra, interior, fachada y vermú.

## Archivos aportados para esta revisión

- `public/images/croissant-split.webp`: croissant ilustrativo aportado por el usuario desde su exploración de concepto. Participa en el giro del inicio; no representa un producto fotografiado del local.
- `public/images/un-rato-en-negro.png` y `public/images/la-carta-manuscrita.png`: títulos gráficos aportados por el usuario. Se conservan como imágenes para respetar exactamente sus letras y trazos; los `alt` del HTML contienen el texto.
- `public/fonts/bricolage-grotesque-800.ttf`: Bricolage Grotesque 800, tomado de los recursos del concepto del usuario para los demás titulares. Se distribuye bajo la licencia SIL Open Font License incluida en `public/fonts/bricolagegrotesque-OFL.txt`.
