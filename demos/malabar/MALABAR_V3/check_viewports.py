from pathlib import Path
import re,base64
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parent
h=(R/'preview/index.html').read_text(encoding='utf-8')
for name in set(re.findall(r'\.\./assets/([\w.-]+\.webp)',h)):
 h=h.replace('../assets/'+name,'data:image/webp;base64,'+base64.b64encode((R/'assets'/name).read_bytes()).decode())
h=re.sub(r'<link[^>]+fonts\.googleapis\.com[^>]*>', '',h)
with sync_playwright() as p:
 b=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for w in [320,360,390,430,600,768,900,950,951,1024,1280,1440,1920]:
  context=b.new_context(viewport={'width':w,'height':820})
  page=context.new_page();errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(h,wait_until='domcontentloaded')
  page.wait_for_timeout(110)
  row=page.evaluate('''() => { const t=document.querySelector('.hero h1').getBoundingClientRect();const g=document.querySelector('.gallery').getBoundingClientRect();return {overflow:document.documentElement.scrollWidth-innerWidth,heroRight:Math.round(t.right),heroScrollWidth:document.querySelector('.hero h1').scrollWidth,heroWidth:Math.round(t.width),hasStory:getComputedStyle(document.querySelector('.event-story')).display,galPosition:getComputedStyle(document.querySelector('.gallery-pin')).position}}''')
  print(f'width={w}: {row} errors={len(errors)}')
  if w==320:page.screenshot(path=str(R/'QA_MOBILE_320.png'))
  assert not errors,(w,errors)
  assert row['overflow']<=2,(w,row)
  context.close()
 b.close()
