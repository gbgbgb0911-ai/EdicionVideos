"""Genera variantes del logo animado (fondo blanco y 16:9) a partir de escenas/logo-intro.html y logo-outro.html.
Uso: python3 tools/logo_variantes.py   (desde la raíz del proyecto)"""
from pathlib import Path

ESC = Path(__file__).resolve().parent.parent / "escenas"
# 16:9: el logo queda centrado en (960,540) en vez de (540,960) -> desplazar rayos (+420, -420)
RAYS_V = ['x1="140" y1="1260" x2="760" y2="640"', 'x1="330" y1="1300" x2="950" y2="680"', 'x1="1180" y1="460" x2="900" y2="740"']
RAYS_H = ['x1="560" y1="840" x2="1180" y2="220"', 'x1="750" y1="880" x2="1370" y2="260"', 'x1="1600" y1="40" x2="1320" y2="320"']


def blanco(s):
    s = s.replace("--bg: #000000;", "--bg: #ffffff;")
    s = s.replace("--cyan: #3ee8dc;", "--cyan: #039991;")
    return s


def horizontal(s):
    s = s.replace('content="width=1080, height=1920"', 'content="width=1920, height=1080"')
    s = s.replace("width: 1080px; height: 1920px;", "width: 1920px; height: 1080px;")
    s = s.replace('data-width="1080" data-height="1920"', 'data-width="1920" data-height="1080"')
    s = s.replace('viewBox="0 0 1080 1920"', 'viewBox="0 0 1920 1080"')
    for v, h in zip(RAYS_V, RAYS_H):
        assert v in s, v
        s = s.replace(v, h)
    return s


for base in ("logo-intro", "logo-outro"):
    src = (ESC / f"{base}.html").read_text()
    variants = {
        f"{base}-blanco": blanco(src),
        f"{base}-169": horizontal(src),
        f"{base}-169-blanco": blanco(horizontal(src)),
    }
    for name, html in variants.items():
        assert html != src
        (ESC / f"{name}.html").write_text(html)
        print("escenas/" + name + ".html")
