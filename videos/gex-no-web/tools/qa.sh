#!/usr/bin/env bash
# Uso: tools/qa.sh escenas/<escena>.html "<tiempos>"
# check/snapshot solo leen index.html: copia la escena a index.html revisa y restaura.
set -u
cd "$(dirname "$0")/.."
f="$1"; at="$2"; name="$(basename "${f%.html}")"
cp index.html /tmp/hf-index-backup.html
cp "$f" index.html
npx hyperframes check . 2>&1 | grep -E "⚠|✗|error\(s\)|Check (passed|failed)|Fix:" | sed 's/^/  /'
npx hyperframes snapshot --at "$at" --no-end -o "snapshots/$name" >/dev/null 2>&1 && echo "  snapshots/$name/contact-sheet.jpg"
cp /tmp/hf-index-backup.html index.html
