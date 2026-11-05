/* Helpers de animación GEX — deterministas y seek-safe (todo vive en el timeline pausado). */
(function () {
  const COLORS = ["#1fc4b8", "#fe6820", "#3ee8dc", "#ffffff"];

  // PRNG con semilla: mismas posiciones en cada render.
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Parte el texto de `el` en palabras (.w) y letras (.c). Respeta spans hijos (p. ej. .or).
  function split(el) {
    const words = [];
    const chars = [];
    function walk(node) {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
            const w = document.createElement("span");
            w.className = "w";
            Array.from(part).forEach((ch) => {
              const c = document.createElement("span");
              c.className = "c";
              c.textContent = ch;
              w.appendChild(c);
              chars.push(c);
            });
            frag.appendChild(w);
            words.push(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    }
    walk(el);
    return { words, chars };
  }

  // Partículas de marca (puntos, anillos, diagonales "/") en una capa de fondo.
  function particles(layer, n, seed, area) {
    const r = rng(seed);
    const box = Object.assign({ x0: 40, x1: 1040, y0: 120, y1: 1350 }, area || {});
    const out = [];
    for (let i = 0; i < n; i++) {
      const p = document.createElement("div");
      p.className = "fx-p";
      p.style.left = Math.round(box.x0 + r() * (box.x1 - box.x0)) + "px";
      p.style.top = Math.round(box.y0 + r() * (box.y1 - box.y0)) + "px";
      const inner = document.createElement("i");
      const kind = r();
      const col = COLORS[Math.floor(r() * COLORS.length)];
      if (kind < 0.45) {
        const s = Math.round(8 + r() * 12);
        inner.className = "fx-dot";
        Object.assign(inner.style, { width: s + "px", height: s + "px", background: col });
      } else if (kind < 0.7) {
        const s = Math.round(22 + r() * 26);
        inner.className = "fx-ring";
        Object.assign(inner.style, { width: s + "px", height: s + "px", color: col });
      } else {
        inner.className = "fx-dash";
        Object.assign(inner.style, { height: Math.round(30 + r() * 40) + "px", background: col, transform: "rotate(45deg)" });
      }
      p.appendChild(inner);
      layer.appendChild(p);
      out.push({ el: p, inner, dx: (r() - 0.5) * 120, dy: -(40 + r() * 140), rot: (r() - 0.5) * 200, delay: r() * 0.5 });
    }
    return out;
  }

  // Partículas: aparecen (inner), derivan todo el clip (wrapper) y se apagan antes de t1.
  function ambient(tl, parts, t0, t1) {
    parts.forEach((p) => {
      tl.fromTo(p.inner, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 0.9, duration: 0.35, ease: "back.out(3)" }, t0 + p.delay);
      tl.fromTo(p.el, { x: 0, y: 0, rotation: 0 }, { x: p.dx, y: p.dy, rotation: p.rot, duration: t1 - t0, ease: "none" }, t0);
      tl.to(p.inner, { autoAlpha: 0, scale: 0.4, duration: 0.25, ease: "power2.in" }, t1 - 0.3);
    });
  }

  // Flotación suave en un rango [t0, t1]; termina en y=0 (repeticiones impares).
  function float(tl, el, t0, t1, amp, period) {
    amp = amp == null ? 12 : amp;
    period = period || 1.4;
    const half = period / 2;
    let reps = Math.max(1, Math.floor((t1 - t0) / half) - 1);
    if (reps % 2 === 0) reps -= 1;
    tl.fromTo(el, { y: 0 }, { y: -amp, duration: half, ease: "sine.inOut", yoyo: true, repeat: Math.max(1, reps) }, t0);
  }

  // Entrada de letras/palabras con estilos variados.
  function reveal(tl, els, t, style, opts) {
    const o = Object.assign({ stagger: 0.035, duration: 0.45 }, opts || {});
    const S = {
      rise: [{ yPercent: 120, rotation: 8, autoAlpha: 0 }, { yPercent: 0, rotation: 0, autoAlpha: 1, ease: "back.out(2)" }],
      pop: [{ scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, ease: "back.out(3)" }],
      drop: [{ y: -140, autoAlpha: 0 }, { y: 0, autoAlpha: 1, ease: "bounce.out" }],
      slide: [{ x: -80, autoAlpha: 0 }, { x: 0, autoAlpha: 1, ease: "expo.out" }],
      flip: [{ rotationX: -90, autoAlpha: 0, transformPerspective: 600 }, { rotationX: 0, autoAlpha: 1, transformPerspective: 600, ease: "power3.out" }],
    }[style || "rise"];
    tl.fromTo(els, S[0], Object.assign({}, S[1], { duration: o.duration, stagger: o.stagger }), t);
  }

  // Golpe de énfasis.
  function punch(tl, el, t, s) {
    tl.to(el, { keyframes: [{ scale: s || 1.15, duration: 0.1 }, { scale: 1, duration: 0.3 }], ease: "sine.inOut" }, t);
  }

  // Salida en piezas: cada elemento sale en una dirección distinta.
  function scatter(tl, els, t, seed) {
    const r = rng(seed || 7);
    Array.from(els).forEach((el, i) => {
      const dir = i % 2 === 0 ? -1 : 1;
      tl.to(el, { x: dir * (120 + r() * 160), y: -(40 + r() * 120), rotation: dir * (10 + r() * 25), autoAlpha: 0, duration: 0.32, ease: "power3.in" }, t + i * 0.03);
    });
  }

  window.GEX = { rng, split, particles, ambient, float, reveal, punch, scatter };
})();
