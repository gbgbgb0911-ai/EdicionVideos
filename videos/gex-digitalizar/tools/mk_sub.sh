#!/usr/bin/env bash
# Uso: tools/mk_sub.sh <archivo> "<título>" <duración> '<chunks JSON>' '<audio extra>'
f="$1"; "$(dirname "$0")/mk.sh" full "$2" > "$f"
cat >> "$f" <<EOT
      .ck .pp { font-size: 50px; }
    </style>
  </head>
  <body>
    <div id="stage" data-composition-id="main" data-start="0" data-duration="$3" data-fps="60" data-width="1080" data-height="1920">
      <section id="scene" class="scene clip" data-start="0" data-duration="$3" data-track-index="0">
        <div id="cap"></div>
      </section>
      <audio id="s-in" src="assets/sfx/pop.wav" data-start="0.02" data-volume="0.2"></audio>
      $5
    </div>
    <script>
      const tl = gsap.timeline({ paused: true });
      GEX.captions(tl, document.getElementById("cap"), $4);
      window.__timelines["main"] = tl;
      tl.seek(0);
    </script>
  </body>
</html>
EOT
