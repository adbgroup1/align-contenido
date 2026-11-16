#!/bin/zsh
# Mueve las imágenes descargadas de ChatGPT (~/Downloads/align_<ID>_<id>.png) a public/img/<ID>/ y saca el .jpg.
# Uso (desde videos/): zsh scripts/traer-imagenes.sh
setopt null_glob
for f in ~/Downloads/align_W*_*.png; do
  b=${f:t:r}; b=${b#align_}; id=${b%%_*}; nombre=${b#*_}
  mkdir -p public/img/$id
  mv "$f" public/img/$id/$nombre.png
  sips -s format jpeg -s formatOptions 70 public/img/$id/$nombre.png --out public/img/$id/$nombre.jpg >/dev/null
  echo "$id/$nombre.jpg $(du -k public/img/$id/$nombre.jpg | cut -f1) KB"
done
