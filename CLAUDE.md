# EdicionVideos

Motion graphics con HyperFrames (`videos/<proyecto>/`). Editor del usuario: CapCut. Marca: GEX (teal `#1fc4b8` / `#039991`, naranja `#fe6820`, fuente Outfit, logo en `videos/gex-motion/assets/logo-v2/`).

## Formato de entrega (obligatorio)

- Exportar siempre **MP4 H.264, fondo negro `#000000`**. Usuario quita el negro en CapCut (Trama o chroma key).
- No entregar MOV/ProRes ni WebM con alfa: CapCut no los acepta.
- Composición base vertical 1080×1920, pero **render en 4K 60fps alta calidad**:
  `npx hyperframes render . -c escenas/<x>.html --resolution portrait-4k --fps 60 --crf 10 -o ./renders/<nombre>.mp4`
  (16:9: `--resolution landscape-4k`). `renders/` va en `.gitignore`; enviar el MP4 al usuario.
- Diseño apto para quitar el negro: sin `drop-shadow`, sin rellenos oscuros/semitransparentes, sin tonos oscuros (usar teal `#1fc4b8`, no `#039991`, para líneas/texto). Trazos ≥5px. Elementos claros sobre negro.

## Estilo de animación (pedido del usuario: "más animado")

- Nada quieto: durante el "hold" siempre hay movimiento ambiental (flotar, deriva, pulsos, giros lentos, partículas/acentos que se mueven, brillos que barren).
- Texto por palabra o letra (stagger), no bloques enteros.
- Acentos gráficos de marca en movimiento (diagonales "/", anillos, chispas naranjas) además del contenido.
- Salidas animadas (piezas que salen en direcciones distintas), no solo fade.
- Ritmo rápido tipo TikTok: entradas 0.3–0.5s, golpes/rebotes en palabras clave.

## Sonido (premium, pedido del usuario: nada de "disparos de videojuego barato")

- Usar SIEMPRE el kit `assets-shared/sfx-premium/` (generado con `python3 tools/sfx_premium.py assets-shared/sfx-premium`); copiarlo a `assets/sfx/` de cada proyecto. No usar el kit viejo.
- Mapa: `whoosh` entradas · `whoosh-out` salidas · `pop` apariciones · `click` toques de cursor · `tick` listas/checks · `ding` palabra clave · `success` logro/confirmación · `impact` sellos/números grandes · `shimmer` brillos/chispas.
- Menos es más: no sonar en cada micro-animación; 3–6 sonidos por escena. No apilar >2 al mismo tiempo.
- Volumen moderado (`data-volume` 0.25–0.5; whoosh ≤0.5). El video lleva la voz del usuario encima.
- Prohibido: ondas cuadradas/sierra, ataques secos, ruido blanco crudo, tonos 8-bit.
