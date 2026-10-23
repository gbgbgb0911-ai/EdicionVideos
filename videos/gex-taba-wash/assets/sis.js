/* Extras "4 sistemas": íconos de línea, cursor con toque, tipeo, contadores. Requiere gex-fx.js antes. */
(function () {
  const G = window.GEX;
  const I = {
    user: '<circle cx="24" cy="16" r="8"/><path d="M8 42c2-9 9-13 16-13s14 4 16 13"/>',
    users: '<circle cx="18" cy="16" r="7"/><circle cx="34" cy="19" r="5.5"/><path d="M4 40c1.5-8 7-11 14-11s12.5 3 14 11 M33 29c6 0 10 3 11 9"/>',
    chat: '<path d="M7 9h34v23H22l-9 8v-8H7Z"/><path d="M15 18h18 M15 24h11"/>',
    mail: '<rect x="6" y="11" width="36" height="26" rx="4"/><path d="M8 14l16 12 16-12"/>',
    phone: '<rect x="14" y="5" width="20" height="38" rx="4"/><path d="M21 37h6"/>',
    doc: '<path d="M12 5h17l9 9v29H12Z M29 5v9h9 M18 24h14 M18 31h14"/>',
    clock: '<circle cx="24" cy="24" r="17"/><path d="M24 14v10l7 5"/>',
    box: '<path d="M6 15l18-9 18 9v19l-18 9-18-9Z M6 15l18 9 18-9 M24 24v19"/>',
    truck: '<path d="M4 12h24v20H4Z M28 19h9l7 7v6H28Z"/><circle cx="13" cy="36" r="4"/><circle cx="35" cy="36" r="4"/>',
    card: '<rect x="5" y="11" width="38" height="26" rx="4"/><path d="M5 19h38 M11 29h10"/>',
    receipt: '<path d="M11 5h26v38l-4.5-3-4.5 3-4.5-3-4.5 3-4.5-3-4.5 3Z M17 15h14 M17 22h14 M17 29h8"/>',
    chart: '<path d="M6 42h36 M12 34V25 M22 34V15 M32 34V21"/>',
    store: '<path d="M6 18l4-11h28l4 11Z M9 18v24h30V18 M19 42V30h10v12"/>',
    cart: '<path d="M4 8h6l5 22h22l4-15H12"/><circle cx="18" cy="38" r="3"/><circle cx="34" cy="38" r="3"/>',
    cash: '<rect x="4" y="12" width="40" height="24" rx="4"/><circle cx="24" cy="24" r="6"/>',
    calendar: '<rect x="6" y="9" width="36" height="33" rx="4"/><path d="M6 18h36 M15 5v8 M33 5v8"/>',
    sun: '<circle cx="24" cy="24" r="8"/><path d="M24 4v6 M24 38v6 M4 24h6 M38 24h6 M10 10l4 4 M34 34l4 4 M10 38l4-4 M34 14l4-4"/>',
    check: '<path d="M10 25l9 9 19-20"/>',
    x: '<path d="M13 13l22 22 M35 13 13 35"/>',
    bell: '<path d="M12 34V22a12 12 0 0 1 24 0v12l4 4H8Z M20 42h8"/>',
    folder: '<path d="M5 12h14l4 5h20v23H5Z"/>',
    fork: '<path d="M13 5v13a4 4 0 0 0 8 0V5 M17 5v38 M33 5c-5 3-5 16 0 18v20"/>',
    basket: '<path d="M6 18h36l-4 22H10Z M16 18l6-12 M32 18l-6-12 M18 26v8 M24 26v8 M30 26v8"/>',
    shirt: '<path d="M16 6l-10 6 4 9 5-3v24h18V18l5 3 4-9-10-6c-1 4-4 6-8 6s-7-2-8-6Z"/>',
    sliders: '<path d="M8 14h32 M8 24h32 M8 34h32"/><circle cx="16" cy="14" r="4"/><circle cx="32" cy="24" r="4"/><circle cx="20" cy="34" r="4"/>',
    search: '<circle cx="21" cy="21" r="12"/><path d="M30 30l12 12"/>',
    bulb: '<path d="M17 30c0-4-6-6-6-14a13 13 0 0 1 26 0c0 8-6 10-6 14Z M18 36h12 M20 42h8"/>',
    code: '<path d="M16 14L6 24l10 10 M32 14l10 10-10 10 M27 9l-6 30"/>',
    shield: '<path d="M24 5l16 6v12c0 10-7 17-16 20-9-3-16-10-16-20V11Z M17 24l5 5 9-10"/>',
    grid: '<rect x="6" y="6" width="15" height="15" rx="3"/><rect x="27" y="6" width="15" height="15" rx="3"/><rect x="6" y="27" width="15" height="15" rx="3"/><rect x="27" y="27" width="15" height="15" rx="3"/>',
    wa: '<path d="M8 40l3-9a16 16 0 1 1 6 6Z"/><path d="M18 17c0 7 6 13 13 13l2-4-4-2-2 2c-2-1-4-3-5-5l2-2-2-4Z"/>',
    building: '<path d="M8 42V8h20v34 M28 18h12v24 M4 42h40 M14 15h8 M14 23h8 M14 31h8"/>',
    plus: '<path d="M24 10v28 M10 24h28"/>',
    alert: '<path d="M24 6l20 36H4Z M24 19v10 M24 35v1"/>',
  };
  // Reemplaza cada [data-ic] por su SVG (data-col = color del trazo, data-sw = grosor).
  G.icons = function (root) {
    (root || document).querySelectorAll("[data-ic]").forEach((el) => {
      const c = el.getAttribute("data-col") || "#0b958b";
      const sw = el.getAttribute("data-sw") || "4.5";
      el.innerHTML = '<svg viewBox="0 0 48 48" fill="none" stroke="' + c + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round">' + I[el.getAttribute("data-ic")] + "</svg>";
    });
  };

  G.cursorSvg = '<svg viewBox="0 0 46 46"><path d="M8 4l30 20-13 3-6 13Z" fill="#ffffff" stroke="#ea5a14" stroke-width="4" stroke-linejoin="round"/></svg>';

  // Crea cursor + onda dentro de `parent` (coordenadas relativas a parent).
  G.cursor = function (parent) {
    const r = document.createElement("div"); r.className = "ripple";
    const c = document.createElement("div"); c.className = "cursor"; c.innerHTML = G.cursorSvg;
    parent.appendChild(r); parent.appendChild(c);
    return { c, r };
  };
  // Mueve el cursor a (x,y) y toca.
  G.tap = function (tl, cur, x, y, t, move) {
    move = move == null ? 0.4 : move;
    tl.to(cur.c, { x: x, y: y, duration: move, ease: "power2.inOut" }, t);
    tl.to(cur.c, { keyframes: [{ scale: 0.8, duration: 0.08 }, { scale: 1, duration: 0.16 }], transformOrigin: "10% 10%", ease: "sine.out" }, t + move);
    tl.fromTo(cur.r, { x: x + 8, y: y + 6, scale: 0.2, autoAlpha: 1 }, { x: x + 8, y: y + 6, scale: 1.6, autoAlpha: 0, duration: 0.45, ease: "circ.out", immediateRender: false }, t + move);
  };

  // Escribe texto letra a letra (seek-safe).
  G.type = function (tl, el, text, t, dur) {
    const p = { n: 0 };
    el.textContent = "";
    tl.fromTo(p, { n: 0 }, { n: text.length, duration: dur, ease: "none", onUpdate: () => { el.textContent = text.slice(0, Math.round(p.n)); } }, t);
  };

  // Contador con prefijo/sufijo y separador de miles determinista.
  G.fmt = function (v, dec) {
    const s = v.toFixed(dec || 0).split(".");
    s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return s.join(".");
  };
  G.count = function (tl, el, from, to, t, dur, pre, suf, dec) {
    const p = { v: from };
    el.textContent = (pre || "") + G.fmt(from, dec) + (suf || "");
    tl.fromTo(p, { v: from }, { v: to, duration: dur, ease: "power2.out", onUpdate: () => { el.textContent = (pre || "") + G.fmt(p.v, dec) + (suf || ""); } }, t);
  };
})();

/* Extras Taba Wash: zapatilla, burbujas, barrido de transición. */
(function () {
  const G = window.GEX;
  // Zapatilla de perfil (relleno de color + suela blanca).
  G.shoe = function (fill, stripe) {
    stripe = stripe || "#ffffff";
    return '<svg viewBox="0 0 140 70"><path d="M8 52C8 42 12 32 22 30L50 25C58 14 70 8 84 8L93 10C97 22 107 30 122 36C132 40 135 46 135 52V56H8Z" fill="' + fill + '"/>' +
      '<rect x="5" y="54" width="132" height="12" rx="6" fill="#ffffff" stroke="#cfdcdb" stroke-width="3"/>' +
      '<path d="M58 22l9 8M66 17l9 8M74 13l9 8" stroke="' + stripe + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M36 46C66 48 94 42 118 35" fill="none" stroke="' + stripe + '" stroke-width="5" stroke-linecap="round"/></svg>';
  };
  G.shoes = function (root) {
    (root || document).querySelectorAll("[data-shoe]").forEach((el) => {
      el.innerHTML = G.shoe(el.getAttribute("data-shoe"), el.getAttribute("data-stripe"));
    });
  };
  // Barrido de marca (3 franjas diagonales) que cruza la pantalla en t.
  G.wipe = function (tl, parent, t, w, h) {
    w = w || 1080; h = h || 1920;
    const cols = ["#1fc4b8", "#fe6820", "#ffffff"];
    cols.forEach((c, i) => {
      const b = document.createElement("div");
      b.style.cssText = "position:absolute;top:" + (-h * 0.25) + "px;left:0;width:" + Math.round(w * 0.42) + "px;height:" + Math.round(h * 1.5) + "px;background:" + c + ";z-index:40;";
      parent.appendChild(b);
      gsap.set(b, { rotation: 18, x: -w * 0.9 });
      tl.fromTo(b, { x: -w * 0.9 }, { x: w * 1.4, duration: 0.55, ease: "power3.inOut", immediateRender: false }, t + i * 0.06);
    });
  };
})();
