from pathlib import Path
import base64,re
D=Path(__file__).resolve().parent;P=D.parents[1]
def data(path,mime):return 'data:'+mime+';base64,'+base64.b64encode(path.read_bytes()).decode()
js=(D/'scene.js').read_text().replace('__THREE_URL__',data(D/'vendor/three.module.min.js','text/javascript')).replace('__PROGRESS_URL__',data(D/'progress.js','text/javascript'))
values={'BODY':data(P/'concept/assets/body.ttf','font/ttf'),'ART':data(P/'concept/revision-06/boceto-corregido.webp','image/webp'),'PLATE':data(D/'coffee-before.webp','image/webp'),'FINAL':data(D/'coffee-after.webp','image/webp'),'MENU':data(P/'concept/carta-07/carta-completa-boceto.webp','image/webp'),'FRAGMENT':(D/'fragment.glsl').read_text(),'SCENE':js}
s=re.sub(r'@@(BODY|ART|PLATE|FINAL|MENU|FRAGMENT|SCENE)@@',lambda m:values[m[1]],(D/'template.html').read_text());(D/'index.html').write_text(s);Path('/workspace/scratch/0e8193c5555e/negro-mercado-scroll.html').write_text(s);print('Self-contained HTML:',len(s),'characters')
