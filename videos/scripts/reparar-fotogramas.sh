#!/bin/bash
# Repara fotogramas «en mosaico» (fallo intermitente de Chromium en la nube) de un vídeo ya renderizado.
#   bash scripts/reparar-fotogramas.sh <ID> <mp4>        (desde videos/)
# Pasa sobre todo cuando la máquina está cargada (varios renders a la vez): renderiza cada vídeo solo.
# Busca saltos bruscos de imagen (scene > 0.2), vuelve a sacar ese fotograma y los 2 siguientes (el fallo viene
# en rachas) con `remotion still` y re-codifica el vídeo con el audio original. Rehacer un fotograma bueno no
# cambia nada, así que un falso positivo no hace daño.
set -e
ID="$1"; MP4="$2"
F="--browser-executable=/opt/pw-browsers/chromium --chrome-mode=chrome-for-testing"
TMP=$(mktemp -d)
HECHOS=" "
for vuelta in 1 2 3 4; do
  ffmpeg -loglevel error -i "$MP4" -vf "scale=180:-1,select='gte(scene,0)',metadata=print:file=$TMP/s.txt" -f null -
  TODOS=$(awk '/pts_time/{split($0,a,"pts_time:");t=a[2]} /scene_score/{split($0,b,"=");n=int(t*30+0.5); if(b[2]>0.2) {print n; print n+1; print n+2}}' "$TMP/s.txt" | sort -n | uniq)
  rm -f "$TMP/s.txt"
  MALOS=""
  for n in $TODOS; do case "$HECHOS" in *" $n "*) ;; *) MALOS="$MALOS $n";; esac; done
  if [ -z "$MALOS" ]; then echo "Sin fotogramas rotos (vuelta $vuelta)."; rm -rf "$TMP"; exit 0; fi
  echo "Vuelta $vuelta · fotogramas a rehacer:$MALOS"
  mkdir -p "$TMP/f"; rm -f "$TMP/f/"*
  ffmpeg -loglevel error -i "$MP4" -q:v 1 "$TMP/f/%05d.jpg"
  for n in $MALOS; do
    [ -f "$TMP/f/$(printf %05d $((n+1))).jpg" ] || continue
    npx remotion still src/index.ts "$ID" "$TMP/f/$(printf %05d $((n+1))).jpg" --frame=$n --image-format=jpeg --jpeg-quality=95 $F >/dev/null 2>&1
    HECHOS="$HECHOS$n "
  done
  ffmpeg -loglevel error -y -framerate 30 -i "$TMP/f/%05d.jpg" -i "$MP4" -map 0:v -map 1:a -c:v libx264 -crf 17 -pix_fmt yuv420p -c:a copy -movflags +faststart "$TMP/out.mp4"
  mv "$TMP/out.mp4" "$MP4"
done
rm -rf "$TMP"
