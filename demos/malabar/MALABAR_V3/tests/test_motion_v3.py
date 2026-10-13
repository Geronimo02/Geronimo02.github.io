"""Browser regression tests: Malabar v3 editorial scroll + quote flow.
Run: pytest -q tests/test_motion_v3.py
"""
import base64
import re
from pathlib import Path
import pytest
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]


def html():
    markup=(ROOT/'preview/index.html').read_text(encoding='utf-8')
    for name in set(re.findall(r'\.\./assets/([\w.-]+\.webp)',markup)):
        data=base64.b64encode((ROOT/'assets'/name).read_bytes()).decode('ascii')
        markup=markup.replace('../assets/'+name,'data:image/webp;base64,'+data)
    markup=re.sub(r'<link[^>]+fonts\.googleapis\.com[^>]*>', '',markup)
    markup=re.sub(r'<link[^>]+fonts\.gstatic\.com[^>]*>', '',markup)
    return markup


@pytest.fixture(scope='module')
def runner():
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
        yield browser
        browser.close()


def page(runner,width=1440,height=900,reduced=False):
    context=runner.new_context(viewport={'width':width,'height':height},reduced_motion='reduce' if reduced else 'no-preference')
    tab=context.new_page()
    errors=[]
    tab.on('pageerror',lambda exc:errors.append(str(exc)))
    tab.set_content(html(),wait_until='domcontentloaded',timeout=20000)
    tab.wait_for_timeout(130)
    return context,tab,errors


def scroll_to(tab,y):
    tab.evaluate('(n)=>window.scrollTo({top:n,behavior:"instant"})',y)
    tab.wait_for_timeout(240)


def test_hero_resizes_and_title_fades_on_desktop(runner):
    context,tab,errors=page(runner)
    assert tab.locator('.hero-stage .hero-frame').count()==1
    scroll_to(tab,480)
    frame=tab.locator('.hero-frame')
    scale=frame.evaluate("el=>new DOMMatrix(getComputedStyle(el).transform).a")
    alpha=tab.locator('.hero-content').evaluate('el=>Number(getComputedStyle(el).opacity)')
    assert .85 < scale < 1,scale
    assert alpha < .95,alpha
    assert not errors,errors
    context.close()


def test_words_reveal_by_scroll_progress(runner):
    context,tab,errors=page(runner)
    words=tab.locator('#concepto .motion-word')
    assert words.count()>=8
    scroll_to(tab,tab.locator('#concepto').evaluate('el=>el.offsetTop')+250)
    vals=words.evaluate_all('nodes=>nodes.map(n=>Number(getComputedStyle(n).opacity))')
    assert vals[0] > vals[-1],vals
    assert not errors,errors
    context.close()


def test_pinned_events_activate_photos_as_you_scroll(runner):
    context,tab,errors=page(runner)
    assert tab.locator('.event-story .event-story-image').count()==4
    scroll_to(tab,tab.locator('#eventos').evaluate('el=>el.offsetTop')+1150)
    selected=tab.locator('.event-story .story-choice.is-active')
    assert selected.count()==1
    assert selected.first.get_attribute('data-event')!='Casamiento o civil'
    assert tab.locator('.event-story-image.is-active').count()==1
    assert not errors,errors
    context.close()


def test_space_image_expands_as_page_moves(runner):
    context,tab,errors=page(runner)
    target=tab.locator('.space-photo-frame')
    assert target.count()==1
    space_start=tab.locator('#espacio').evaluate('el=>el.offsetTop')
    scroll_to(tab,space_start-450)
    clip1=target.evaluate('el=>getComputedStyle(el).clipPath')
    scroll_to(tab,space_start+700)
    clip2=target.evaluate('el=>getComputedStyle(el).clipPath')
    assert clip1!=clip2,(clip1,clip2)
    assert not errors,errors
    context.close()


def test_gallery_travels_horizontally_during_vertical_scroll(runner):
    context,tab,errors=page(runner)
    track=tab.locator('.gallery-track')
    assert track.locator('.gallery-card').count()>=4
    gallery_start=tab.locator('#galeria').evaluate('el=>el.offsetTop')
    scroll_to(tab,gallery_start-200)
    initial=track.evaluate('el=>getComputedStyle(el).transform')
    scroll_to(tab,gallery_start+1000)
    final=track.evaluate('el=>getComputedStyle(el).transform')
    assert initial!=final,(initial,final)
    assert tab.evaluate('document.documentElement.scrollWidth<=innerWidth+2')
    assert not errors,errors
    context.close()


def test_quote_flow_still_prepares_detailed_whatsapp_message(runner):
    context,tab,errors=page(runner)
    tab.locator('input[value="Evento corporativo"]').check()
    tab.locator('#next').click()
    tab.locator('#sinFecha').check()
    tab.locator('#invitados').select_option(label='61 a 100')
    tab.locator('#next').click()
    tab.locator('input[value="Gastronomía / recepción"]').check()
    tab.locator('#next').click()
    tab.locator('#nombre').fill('Ana Demo')
    tab.locator('#telefono').fill('+5492494444444')
    tab.locator('#consentimiento').check()
    tab.locator('#next').click()
    summary=tab.locator('#summary-text').inner_text()
    assert 'Ana Demo' in summary and 'Evento corporativo' in summary and '61 a 100' in summary
    assert tab.locator('#wa-link').is_hidden()  # No invented number before launch.
    assert not errors,errors
    context.close()


def test_mobile_is_native_scroll_and_no_horizontal_overflow(runner):
    context,tab,errors=page(runner,width=390,height=844)
    assert tab.evaluate('document.documentElement.scrollWidth<=innerWidth+2')
    assert tab.locator('.event-story').is_hidden()
    assert tab.locator('.event-grid').is_visible()
    assert tab.locator('.gallery-track').evaluate('el=>getComputedStyle(el).transform')=='none'
    tab.locator('#mobile-toggle').click()
    assert tab.locator('#nav-links').evaluate('el=>el.classList.contains("open")')
    assert not errors,errors
    context.close()


def test_reduced_motion_skips_scrub_and_keeps_content_visible(runner):
    context,tab,errors=page(runner,reduced=True)
    scroll_to(tab,500)
    assert tab.locator('.hero-frame').evaluate('el=>getComputedStyle(el).transform')=='none'
    assert tab.locator('#concepto .statement').is_visible()
    assert tab.locator('#organizar').is_visible()
    assert not errors,errors
    context.close()


def test_very_small_phone_has_no_page_overflow(runner):
    context,tab,errors=page(runner,width=320,height=820)
    assert tab.evaluate('document.documentElement.scrollWidth<=innerWidth+2')
    assert not errors,errors
    context.close()
