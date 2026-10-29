from pathlib import Path
import json, base64, re
P=Path(__file__).resolve().parents[2]
A=P/'concept/assets'
def uri(n,m): return 'data:'+m+';base64,'+base64.b64encode((A/n).read_bytes()).decode()
t=(Path(__file__).parent/'template.html').read_text()
values={'FONT':uri('display.ttf','font/ttf'),'BODY':uri('body.ttf','font/ttf'),'CUP':uri('menu-coffee.webp','image/webp'),'LOGO':uri('logo-user-original.jpg','image/jpeg'),'DATA':json.dumps(json.loads((P/'content/menu.json').read_text()),ensure_ascii=False).replace('</','<\\/'),'SCRIPT':(Path(__file__).parent/'menu.js').read_text()}
out=re.sub(r'@@(FONT|BODY|CUP|LOGO|DATA|SCRIPT)@@',lambda m:values[m[1]],t)
(Path(__file__).parent/'index.html').write_text(out)
print('Built',len(out),'characters; 65 source records embedded')
