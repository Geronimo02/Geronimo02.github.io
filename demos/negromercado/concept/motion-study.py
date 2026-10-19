"""Standalone motion study, NOT a browser recording or a website screenshot."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math, subprocess
p=Path(__file__).resolve().parent
out=Path('/tmp/nm-motion-frames');out.mkdir(exist_ok=True)
cream='#f5f2eb';green='#1b3a2b';blue='#506c9b'
display=lambda size:ImageFont.truetype(str(p/'assets/display.ttf'),size)
body=lambda size:ImageFont.truetype(str(p/'assets/body.ttf'),size)
pastry=Image.open(p/'assets/croissant-split.webp').convert('RGBA').resize((760,507),Image.Resampling.LANCZOS)
halves=[]
for box in [(0,0,399,507),(399,0,760,507)]:
    layer=Image.new('RGBA',pastry.size);layer.paste(pastry.crop(box),(box[0],0));halves.append(layer)
logo=Image.open(p/'assets/logo-user-original.jpg').convert('RGBA').resize((47,47))
for i in range(120):
    t=i/119;progress=min(1,max(0,t*2.4)) if t<.55 else max(0,(1-t)/.45);k=progress*progress*(3-2*progress)
    im=Image.new('RGBA',(960,640),cream);d=ImageDraw.Draw(im)
    im.alpha_composite(logo,(28,13));d.text((82,20),'negro mercado',font=display(25),fill='#111111')
    d.text((651,28),'la carta     la esquina     venite ↗',font=body(12),fill='#111111')
    d.text((69,77-k*20),'rompé',font=display(172),fill=green,stroke_width=0)
    d.text((177,205-k*20),'la rutina.',font=display(148),fill=green)
    d.line((560,345-k*20,837,336-k*20),fill=blue,width=5)
    if k>.45:
        d.text((409,404),'el tiempo,',font=display(31),fill=green);d.text((416,434),'en capas.',font=display(31),fill=green)
    for n,layer in enumerate(halves):
        sign=-1 if n==0 else 1;rot=layer.rotate(-sign*k*11,resample=Image.Resampling.BICUBIC,expand=False)
        im.alpha_composite(rot,(round(100+sign*k*135),round(105+k*12)))
    d=ImageDraw.Draw(im);d.ellipse((818,318,923,423),fill=blue);d.text((870,348),'un café',font=display(20),fill=cream,anchor='mm');d.text((870,373),'en negro',font=display(20),fill=cream,anchor='mm')
    d.text((35,529),'CAFÉ · PASTELERÍA · VERMÚ',font=body(10),fill='#111111');d.text((740,529),'AVELLANEDA 702 · TANDIL',font=body(10),fill='#111111')
    d.rectangle((0,557,960,640),fill=blue);d.text((35,556),'el tiempo, en capas.',font=display(71),fill=cream)
    d.text((35,623),'ESTUDIO DE MOVIMIENTO · REPRESENTACIÓN ILUSTRATIVA · NO ES UNA CAPTURA DEL SITIO',font=body(8),fill=cream)
    im.convert('RGB').save(out/f'{i:04}.png')
subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','24','-i',str(out/'%04d.png'),'-c:v','libx264','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart',str(p/'assets/motion-study.mp4')],check=True)
print('120 frames / 5s / illustrative motion study; not browser QA')
