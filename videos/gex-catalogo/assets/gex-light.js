/* Extras para el estilo panel blanco: tipeo, cursor con toque. Requiere gex-fx.js antes. */
(function () {
  const G = window.GEX;
  G.COLORS = ["#1fc4b8", "#fe6820", "#039991"];

  // Escribe `text` en `el` letra por letra entre t y t+dur (seek-safe vía proxy).
  G.type = function (tl, el, text, t, dur, caret) {
    const p = { n: 0 };
    const node = typeof el === "string" ? document.querySelector(el) : el;
    node.textContent = "";
    tl.fromTo(p, { n: 0 }, { n: text.length, duration: dur, ease: "none", onUpdate: () => {
      node.textContent = text.slice(0, Math.round(p.n)) + (caret && p.n < text.length ? "|" : "");
    } }, t);
  };

  // Mueve el cursor a (x,y) y toca: onda + pequeño "press".
  G.tap = function (tl, cursor, ripple, x, y, t, move) {
    move = move == null ? 0.45 : move;
    tl.to(cursor, { x: x, y: y, duration: move, ease: "power2.inOut" }, t);
    tl.to(cursor, { keyframes: [{ scale: 0.82, duration: 0.08 }, { scale: 1, duration: 0.15 }], ease: "sine.out" }, t + move);
    tl.fromTo(ripple, { x: x + 6, y: y + 4, scale: 0.2, autoAlpha: 1 }, { x: x + 6, y: y + 4, scale: 1.6, autoAlpha: 0, duration: 0.45, ease: "circ.out" }, t + move);
  };

  // Partículas suaves en tonos de marca para fondo claro.
  G.lightParticles = function (layer, n, seed, area) {
    const parts = G.particles(layer, n, seed, area);
    const r = G.rng(seed + 99);
    parts.forEach((p) => {
      const col = G.COLORS[Math.floor(r() * G.COLORS.length)];
      if (p.inner.className === "fx-ring") p.inner.style.color = col;
      else p.inner.style.background = col;
    });
    return parts;
  };
})();

/* Prendas en SVG (relleno de color + línea oscura) para catálogos de ropa. */
(function () {
  const PATHS = {
    polo: "M22 10l10-4c2 4 6 6 8 6s6-2 8-6l10 4 12 14-10 8-6-6v38H26V26l-6 6-10-8Z",
    casaca: "M24 8l10-2 6 8 6-8 10 2 14 16-8 10-6-6v40H24V28l-6 6-8-10Z M40 14v52",
    vestido: "M30 6h20l-2 14 14 46H18l14-46Z M30 6l-4 8 M50 6l4 8",
    jean: "M24 6h32l4 64H44L40 30l-4 40H20Z M24 14h32",
    polera: "M22 12l12-6c2 6 4 8 6 8s4-2 6-8l12 6 12 18-10 6-6-6v36H26V30l-6 6-10-6Z M32 6c0 8 4 12 8 12s8-4 8-12",
  };
  window.GEX.garment = function (kind, fill) {
    return `<svg viewBox="0 0 80 76"><path d="${PATHS[kind]}" fill="${fill}" stroke="#12201f" stroke-width="2.5" stroke-linejoin="round"/></svg>`;
  };
})();

/* Catálogo: llena `grid` con tarjetas de producto. items: [tipo, color, nombre]. */
(function () {
  window.GEX.CATALOGO = [["polo", "#7fd8cf", "Polo básico"], ["vestido", "#ffb48a", "Vestido"], ["casaca", "#c9d3d2", "Casaca"], ["jean", "#8fb3e6", "Jean"], ["polera", "#ffd27a", "Polera"], ["polo", "#ff9f9f", "Polo oversize"]];
  window.GEX.tiles = function (grid, items) {
    (items || window.GEX.CATALOGO).forEach(([k, col, nm]) => {
      const t = document.createElement("div");
      t.className = "tile";
      t.innerHTML = `<div class="img" style="background:${col}33">${window.GEX.garment(k, col)}</div><div class="nm">${nm}</div><div class="bt">WhatsApp</div>`;
      grid.appendChild(t);
    });
    return grid.querySelectorAll(".tile");
  };
})();

/* Iconos de interfaz. */
(function () {
  window.GEX.waIcon = function (s, bg) {
    return `<svg viewBox="0 0 64 64" width="${s}" height="${s}"><circle cx="32" cy="32" r="30" fill="${bg || "#25d366"}"/><path d="M20 46l3-9a14 14 0 1 1 6 5Z" fill="none" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="M27 26c0 6 5 11 11 11l2-3-4-2-2 2c-2-1-3-2-4-4l2-2-2-4Z" fill="#fff"/></svg>`;
  };
  window.GEX.cursorSvg = '<svg viewBox="0 0 46 46"><path d="M8 4l30 20-13 3-6 13Z" fill="#12201f" stroke="#fff" stroke-width="3" stroke-linejoin="round"/></svg>';
})();
