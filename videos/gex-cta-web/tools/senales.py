#!/usr/bin/env python3
"""Títulos de señal (pantalla dividida, mitad superior). Mismo diseño para las 3."""
import os, subprocess
ROOT = os.path.join(os.path.dirname(__file__), "..")
S = [
    ("02a-senal-01", "01", "#ea5a14", "DEMASIADO", "TRABAJO MANUAL", 4.4,
     [('<span class="xico" style="width:44px;height:44px"></span>Ventas', "g", 1.6), ('<span class="xico" style="width:44px;height:44px"></span>Stock', "g", 2.3), ('<span class="xico" style="width:44px;height:44px"></span>Gastos', "g", 3.0)]),
    ("04a-senal-02", "02", "#0b958b", "NO TIENES INFORMACIÓN", "AL MOMENTO", 5.2,
     [("¿Cuánto vendí?", "", 1.4), ("¿Cuánto me deben?", "o", 2.4), ("¿Cuánto hay en caja?", "g", 3.4)]),
    ("06a-senal-03", "03", "#179a4a", "DEPENDES DEMASIADO", "DE UNA PERSONA", 4.2,
     [("📁 Archivos", "", 1.5), ("ƒx Fórmulas", "o", 2.2), ("🔒 Cierres", "a", 2.9)]),
]
for name, n, col, l1, l2, dur, chips in S:
    head = subprocess.run([os.path.join(ROOT, "tools/mk.sh"), "split", "Excel — Señal " + n], capture_output=True, text=True).stdout
    ch = "".join('<span class="chip %s cc" id="k%d">%s</span>' % (c, i, t) for i, (t, c, _) in enumerate(chips))
    js = "".join('      tl.fromTo("#k%d", { y: 60, scale: 0.5, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(2.6)", immediateRender: false }, %s);\n' % (i, t) for i, (_, _, t) in enumerate(chips))
    body = f'''      #hd {{ position: absolute; left: 0; right: 0; top: 130px; display: flex; justify-content: center; align-items: center; gap: 28px; }}
      #bd {{ position: relative; width: 200px; height: 200px; border-radius: 50%; background: {col}; display: flex; flex-direction: column; align-items: center; justify-content: center; flex: none; }}
      #bd small {{ font-weight: 800; font-size: 26px; letter-spacing: 0.16em; }}
      #bd b {{ font-weight: 800; font-size: 100px; line-height: 0.9; }}
      #ring {{ position: absolute; inset: -18px; border-radius: 50%; border: 6px dashed {col}; }}
      .tt {{ display: flex; flex-direction: column; }}
      #l1 {{ font-weight: 800; font-size: 60px; line-height: 1.05; white-space: nowrap; }}
      #l2 {{ font-weight: 800; font-size: 72px; line-height: 1.05; color: #1fc4b8; white-space: nowrap; }}
      #chips {{ position: absolute; left: 40px; right: 40px; top: 450px; display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }}
      .cc {{ font-size: 38px; padding: 12px 26px; gap: 12px; }}
    </style>
  </head>
  <body>
    <div id="stage" data-composition-id="main" data-start="0" data-duration="{dur}" data-fps="60" data-width="2160" data-height="1920">
      <div id="c">
        <section id="scene" class="scene clip" data-start="0" data-duration="{dur}" data-track-index="0">
          <div class="fx-layer" id="fx"></div>
          <div id="hd"><div id="bd"><span id="ring"></span><small>SEÑAL</small><b>{n}</b></div><div class="tt"><span id="l1">{l1}</span><span id="l2">{l2}</span></div></div>
          <div id="chips">{ch}</div>
        </section>
      </div>
      <audio id="s-in" src="assets/sfx/whoosh.wav" data-start="0.05" data-volume="0.45"></audio>
      <audio id="s-hit" src="assets/sfx/impact.wav" data-start="0.35" data-volume="0.38"></audio>
      <audio id="s-c" src="assets/sfx/pop.wav" data-start="{chips[0][2]}" data-volume="0.28"></audio>
      <audio id="s-c2" src="assets/sfx/tick.wav" data-start="{chips[2][2]}" data-volume="0.26"></audio>
      <audio id="s-out" src="assets/sfx/whoosh-out.wav" data-start="{dur - 0.42:.2f}" data-volume="0.4"></audio>
    </div>
    <script>
      GEX.icons();
      const tl = gsap.timeline({{ paused: true }});
      const EXIT = {dur - 0.4:.2f};
      const fx = document.getElementById("fx");
      const parts = GEX.particles(fx, 5, {int(n) * 101}, {{ x0: 20, x1: 140, y0: 140, y1: 900 }}).concat(GEX.particles(fx, 5, {int(n) * 103}, {{ x0: 940, x1: 1060, y0: 140, y1: 800 }}));
      GEX.ambient(tl, parts, 0.3, EXIT + 0.3);
      const l1 = GEX.split(document.getElementById("l1")), l2 = GEX.split(document.getElementById("l2"));
      gsap.set(".cc", {{ autoAlpha: 0 }});
      tl.fromTo("#bd", {{ scale: 0, rotation: -200 }}, {{ scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.2)" }}, 0.05);
      tl.fromTo("#bd b", {{ scale: 2.2, autoAlpha: 0 }}, {{ scale: 1, autoAlpha: 1, duration: 0.3, ease: "power4.in" }}, 0.15);
      tl.fromTo("#ring", {{ rotation: 0 }}, {{ rotation: 180, duration: EXIT, ease: "none" }}, 0);
      GEX.reveal(tl, l1.words, 0.3, "rise", {{ stagger: 0.07, duration: 0.4 }});
      GEX.reveal(tl, l2.chars, 0.55, "drop", {{ stagger: 0.025, duration: 0.4 }});
      GEX.punch(tl, "#bd", 1.2, 1.1);
{js}      tl.to(".cc", {{ y: -8, duration: 0.3, ease: "sine.inOut", yoyo: true, repeat: 3, stagger: 0.1 }}, {chips[2][2] + 0.5});
      GEX.scatter(tl, ["#bd", ".cc"], EXIT, {int(n)});
      tl.to(l1.words.concat(l2.chars), {{ y: -160, autoAlpha: 0, duration: 0.3, ease: "power3.in", stagger: 0.01 }}, EXIT);
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
'''
    open(os.path.join(ROOT, "escenas", name + ".html"), "w").write(head + body)
    print(name)
