#!/usr/bin/env bash
# Uso: tools/mk.sh <full|split> "<título>" > escenas/x.html   (luego se agrega el resto con cat >>)
if [ "$1" = split ]; then
  sed -e "s|__T__|$2|" -e 's|__VW__|2160|' -e 's|__SPLIT__|    <link rel="stylesheet" href="assets/split.css" />\n|' "$(dirname "$0")/head.html" | sed 's/\\n/\n/'
else
  sed -e "s|__T__|$2|" -e 's|__VW__|1080|' -e 's/__SPLIT__//' "$(dirname "$0")/head.html"
fi
