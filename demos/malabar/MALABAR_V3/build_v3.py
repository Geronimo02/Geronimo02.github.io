from pathlib import Path
import re

ROOT=Path(__file__).resolve().parent
source=(ROOT/'v2_base.html').read_text(encoding='utf-8')


def once(old,new):
    global source
    if source.count(old)!=1:
        raise ValueError(f'Expected once ({source.count(old)}): '+old[:90])
    source=source.replace(old,new,1)

once('<title>MALABAR \u2014 Momentos extraordinarios \u00b7 Tandil</title>',
     '<title>MALABAR \u2014 Experiencias extraordinarias en Tandil</title>')
once('</style>', '\n'+(ROOT/'motion_v3.css').read_text()+'\n  </style>')
once('  <main>', '  <div class="site-progress" aria-hidden="true"><span class="site-progress-fill"></span></div>\n  <main>')
once('    <section class="hero" id="inicio" aria-label="Malabar, eventos en Tandil">',
     '    <div class="hero-stage" id="hero-stage">\n    <section class="hero" id="inicio" aria-label="Malabar, eventos en Tandil">\n      <div class="hero-frame" aria-hidden="true"></div>')
once('      <span class="hero-scroll">SCROLL PARA DESCUBRIR &nbsp; \u2193</span>\n    </section>',
     '      <span class="hero-scroll">SCROLL PARA DESCUBRIR &nbsp; \u2193</span>\n    </section>\n    </div><!-- /hero-stage -->')

story = '''
        <div class="event-story" aria-label="Descubri eventos mientras recorres la pagina">
          <div class="event-story-choices">
            <div class="event-story-overline">ELEG\u00cd EL MOTIVO. NOSOTROS PONEMOS EL ESCENARIO.</div>
            <a href="#organizar" class="story-choice is-active" data-event="Casamiento o civil" aria-current="step"><small>01</small><strong>Casamientos<br>y civiles</strong><span class="story-cta" aria-hidden="true">\u2197</span></a>
            <a href="#organizar" class="story-choice" data-event="Evento corporativo"><small>02</small><strong>Eventos<br>corporativos</strong><span class="story-cta" aria-hidden="true">\u2197</span></a>
            <a href="#organizar" class="story-choice" data-event="Cumplea\u00f1os o celebraci\u00f3n"><small>03</small><strong>Cumplea\u00f1os y<br>celebraciones</strong><span class="story-cta" aria-hidden="true">\u2197</span></a>
            <a href="#organizar" class="story-choice" data-event="Evento especial"><small>04</small><strong>Eventos<br>especiales</strong><span class="story-cta" aria-hidden="true">\u2197</span></a>
            <div class="story-bottom"><span>DESLIZ\u00c1 PARA DESCUBRIR \u2193</span><span class="story-live-index">01 / 04</span></div>
          </div>
          <figure class="event-story-frame">
            <div class="event-story-image is-active"><img src="../assets/06-ambientacion-lounge.webp" alt="Ambientacion de lounge para celebraciones en Malabar" loading="lazy"></div>
            <div class="event-story-image"><img src="../assets/03-recepcion-corporativa.webp" alt="Recepcion corporativa realizada en Malabar" loading="lazy"></div>
            <div class="event-story-image"><img src="../assets/04-barra-evento.webp" alt="Invitados reunidos en la barra del evento" loading="lazy"></div>
            <div class="event-story-image"><img src="../assets/01-exterior-atardecer.webp" alt="Fachada y entorno de Malabar al atardecer" loading="lazy"></div>
            <figcaption class="event-story-caption"><span class="event-caption-label">Un momento inolvidable</span><strong>MALABAR / TANDIL</strong></figcaption>
          </figure>
        </div>
'''
once('        <div class="event-grid">',story+'        <div class="event-grid">')
once('        <div class="space-hero" role="img" aria-label="Fachada y acceso principal de Malabar Eventos"></div>',
     '        <div class="space-photo-stage"><div class="space-photo-frame" role="img" aria-label="Fachada y acceso principal de Malabar Eventos"><span>LA ARQUITECTURA DEL ENCUENTRO</span></div></div>')
once('    <section class="moment"><div><p>', '    <section class="moment"><div class="moment-content"><p>')

slides = [
    ('03-recepcion-corporativa.webp', '01 / 05', 'Momentos compartidos', 'Recepcion de invitados durante un evento en Malabar'),
    ('06-ambientacion-lounge.webp', '02 / 05', 'Dise\u00f1ado para encontrarnos', 'Espacio lounge y mobiliario en el salon'),
    ('05-gastronomia.webp', '03 / 05', 'El sabor del encuentro', 'Mesa de catering en evento de Malabar'),
    ('04-barra-evento.webp', '04 / 05', 'Brindis que se recuerdan', 'Barra e invitados durante un evento'),
    ('02-exterior-panorama.webp', '05 / 05', 'Un escenario diferente', 'Vista exterior de Malabar al atardecer'),
]
cards='\n'.join(f'''          <figure class="gallery-card" role="listitem"><img loading="lazy" src="../assets/{fname}" alt="{alt}"><figcaption><strong>{title}</strong><small>{num}</small></figcaption></figure>''' for fname,num,title,alt in slides)
gallery_markup=f'''<section class="gallery" id="galeria">
      <div class="gallery-pin">
        <div class="wrap gallery-head"><div class="section-head"><div><span class="eyebrow">05 / MOMENTOS REALES</span><h2>La experiencia,<br>en im\u00e1genes.</h2></div><p>Desliz\u00e1 para recorrer escenas reales del espacio: encuentros, detalles, gastronom\u00eda y brindis.</p></div></div>
        <div class="gallery-viewport" aria-label="Galeria de fotos de Malabar; deslizamiento horizontal en pantallas pequenas">
          <div class="gallery-track" role="list">
{cards}
          </div>
        </div>
        <div class="wrap gallery-foot"><div class="gallery-meter" aria-hidden="true"><i></i></div><span class="gallery-label">SCROLL / EXPLOR\u00c1 LOS MOMENTOS</span><a class="line-link" href="https://www.instagram.com/malabareventos_/" target="_blank" rel="noopener noreferrer">Ver Instagram <span class="arr">\u2197</span></a></div>
      </div>
    </section>'''
pattern=r'<section class="gallery" id="galeria">.*?</section>'
source,n=re.subn(pattern,lambda m:gallery_markup,source,count=1,flags=re.S)
assert n==1,'gallery not found'

once('  <div class="mobile-fixed">', '  <div class="motion-cursor" aria-hidden="true">ELEGIR \u2197</div>\n  <div class="mobile-fixed">')
once('  </script>\n</body>', '  </script>\n  <script>\n'+(ROOT/'motion_v3.js').read_text()+'\n  </script>\n</body>')

# Avoid a duplicate fixed mobile CTA covering active input fields.
source=source.replace("document.querySelector('.mobile-fixed').classList.toggle('visible', window.scrollY > window.innerHeight * .7);", "document.querySelector('.mobile-fixed').classList.toggle('visible', window.scrollY > window.innerHeight * .7 && document.getElementById('organizar').getBoundingClientRect().top > window.innerHeight * .72);")
(ROOT/'preview/index.html').write_text(source,encoding='utf-8')
print('Wrote',ROOT/'preview/index.html','characters',len(source))
