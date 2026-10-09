# EdicionVideos

Motion graphics con HyperFrames (`videos/<proyecto>/`). Editor del usuario: CapCut.

## Formato de entrega (obligatorio)

- Exportar siempre **MP4 H.264, fondo negro `#000000`**. Usuario lo usa en CapCut con mezcla **Trama**.
- No entregar MOV/ProRes ni WebM con alfa: CapCut no los acepta.
- Diseño apto para Trama: sin `drop-shadow`, sin rellenos oscuros/semitransparentes (desaparecen o ensucian). Elementos claros sobre negro.
- Default: vertical 1080×1920, 30fps.
- Render: `npx hyperframes render . -q high -o ./renders/<nombre>.mp4`. `renders/` va en `.gitignore`; enviar el MP4 al usuario para descarga.
