---
name: align-produccion
description: Agente 6 de ALIGN. Cada día convierte en reels (Remotion, kit v2, voz mexicana, música y efectos) o en carruseles (láminas de 1080×1350) los guiones aprobados por el manager, hasta 3 por ejecución, pasa control de calidad con nota de viralidad y los deja para revisión en Notion.
---

# Agente 6 — Producción y control de calidad

## AHORRO, primero

**Entrada:** filas de Vídeos con Estado = `Revisión manager OK`, o las que te indique la tarea.

Si no hay ninguna, responde en una línea y termina, **sin** `npm ci`.

Después lee:
- `CLAUDE.md`, sección «Renderizar en esta nube»;
- `GUIA.md`, secciones «Para quién: México», «Lo que sabemos hoy» y «Voz, música y sonido»;
- la hipótesis de cada guion (debajo de su tabla) y `investigacion/EXPERIMENTOS.md`: **el vídeo tiene que probar
  esa hipótesis de verdad**, y lo que ESCALA se monta con lo que hizo funcionar al original;
- `videos/KIT.md`, entero: es el manual de las piezas (incluye «Imágenes generadas»);
- `investigacion/TECNICAS.md`: elige **al menos 2 técnicas** de la lista «Por implementar» o «En el kit» que
  encajen con el guion. **Si no existe**, apúntalo en la «Nota del manager» de cada vídeo y saca las técnicas
  de las fichas de `investigacion/fichas/` que cite su «Patrón».
- **El formato y la pieza son los que pone el Patrón** (`Reel · A/B · …` o `Carrusel · Lista · …`), y se tienen que
  notar.

**Corres cada día y haces hasta 3 piezas por ejecución.** Se publica 1 al día, así que no se puede parar.
- **Orden:** primero lo más antiguo por ID, pero **los que tienen alguna `IMAGEN:` sin `.jpg` esperan** a que
  Andrés las haga. Si llevan 2 días o más en `Revisión manager OK` y siguen sin imágenes, dibuja esas escenas en
  código y apúntalo en «Nota del manager».
- Haz commit y push después de cada pieza, no al final, para no perder trabajo si la sesión se corta. Lo que no te dé
  tiempo a hacer se queda en `Revisión manager OK` para mañana.

## v4 (27 nov): estilos, personajes y control de variedad

- **El estilo y el cierre son los que pone el guion** (`ESTILO`, `CIERRE`). Usa la biblioteca `videos/src/estilos/`
  (manual en `KIT.md`, «Estilos»). **Si el estilo no existe, constrúyelo** con su ficha de `investigacion/ESTILOS.md`,
  añádelo a `src/estilos/` y documéntalo en `KIT.md`. Nunca lo resuelvas con el muñeco blob y un rótulo.
- **Antes de renderizar:** `node scripts/variedad.mjs <ID> --estilo … --formato … --cierre … --pista … --tema …`.
  Si da error, **cambia el vídeo** (otra pista, otro cierre) o, si es el estilo, apúntalo en «Nota del manager» y
  pasa al siguiente. Haz commit de `registro.json`.
- **Voz:** en `guion.json` pon `"modelo": "eleven_v3"`, el `"reparto"` (personaje → rol de `voces.json`,
  «personajes», o voice_id) y en cada escena su `"personaje"`. Copia las etiquetas de actuación del guion tal cual.
  Si `voz.mjs` avisa de que v3 falló o de que no hay tiempos («tiempos estimados»), apúntalo en «Nota del manager».
- **Subtítulos:** elige el estilo con `subtitulos=` en `Montaje` (`karaoke`, `caja`, `limpio` o `ninguno`); en
  estilos donde el texto ya está en pantalla (chat, notas, cinética), `ninguno`.
- **Cierre:** `CtaCrecer` solo si el guion dice `CIERRE: tarjeta`. Siempre `<Aviso />` al final.
- **Ejemplos:** W49-25 (chat), W49-26 (telenovela), W49-27 (banco), W49-28 (cinética) y W49-29 (noticiero).

## Si es un carrusel

1. Lee el guion lámina a lámina.
2. **Composición** en `videos/src/videos/<ID>.tsx`: una composición de **1080×1350**, con **un fotograma por
   lámina** (lámina 1 = fotograma 0, lámina 2 = fotograma 1…). Regístrala en `Root.tsx` con `durationInFrames` =
   número de láminas. Usa los colores y la tipografía de `brand.ts` y dibujos en código del kit.
   - **La portada lo es todo:** título enorme, contraste fuerte y algo que pida deslizar (una flecha, «desliza →»
     o la lámina siguiente asomando).
   - Texto grande y legible en el móvil, como mucho 25 palabras por lámina, y la última con el CTA y el aviso legal.
3. `cd videos && npx tsc --noEmit`.
4. **Renderiza cada lámina:**
   `npx remotion still src/index.ts <ID> ../media/<semana>/<ID>/0<n>.jpg --frame=<n-1> --image-format=jpeg` con los
   flags de navegador de `CLAUDE.md`. Copia la portada también como `media/<semana>/<ID>.jpg`.
5. **Mira cada lámina con Read:** se lee, no se corta y se entiende sola.
6. **Nota de viralidad** (portada, deslizar, guardable, gracia, México y acabado). Si es menor de 7, corrige y
   vuelve a renderizar (2 vueltas como máximo).
7. Commit y push. Comprueba con `curl -sI` que la URL raw de cada lámina da 200.
8. **Notion:** Estado = `Tu revisión`; «Enlace vídeo» = la URL de la portada; «Nota viralidad». Dentro de la página,
   arriba, las URLs de todas las láminas en orden y una imagen incrustada de cada una.

## Si es un reel

1. **Lee el guion** dentro de la página de Notion.
2. **Voz.**
   - Escribe `videos/public/voz/<ID>/guion.json` con **una escena por frase** de la voz (ver `KIT.md`).
   - Los números van en letra: «cien euros», «seis por ciento».
   - Después, `cd videos && node scripts/voz.mjs <ID>`. La voz la elige el propio script desde `videos/voces.json`:
     reparte las voces de `rotacion` (H6) y apunta cuál lleva cada vídeo en `asignadas`. **Haz commit de
     `voces.json`** y pon en «Nota del manager» qué voz lleva («Voz: Regina»). Solo si el guion pide una voz
     concreta, `"voz": "<voice_id>"` en su `guion.json`.
   - **El texto de la voz, en español de México**, tal cual lo dice el guion (pesos, quincena…).
   - **Si falla** (sin clave o sin red): no hagas un vídeo mudo. Apunta el error exacto en «Nota del
     manager», deja la fila como estaba y pasa al siguiente.
3. **Imágenes y dibujos.** Las filas `DIBUJO:` se hacen en código (`KIT.md`, «Dibujos en código»). Antes de
   montar una `IMAGEN:`, pregúntate si esa escena quedaría mejor dibujada en código (pista de `GUIA.md`,
   «Lo que sabemos hoy», punto «Imagen o dibujo»); si es así, dibújala y apúntalo en «Nota del manager». Para las
   que se quedan como imagen:
   - **Primero mira `public/img/<ID>/`:** si ya están los `.jpg` (los hace Andrés con Claude en local, skill
     `align-imagenes`), no escribas otro `imagenes.json`. Usa su `revision.json` (lo deja la Investigación
     de cada noche):
     - imágenes `aprobada` o `corregida`: úsalas tal cual;
     - `rehacer` o `sin imagen`: dibuja esa escena en código o móntala con piezas del kit, y apúntalo en
       «Nota del manager»;
     - **si no hay `revision.json`** o falta alguna imagen en él (llegó después de las 03:00), revísala tú
       antes de montar con el «Paso 0» de `.claude/skills/align-investigacion/SKILL.md`.
   - Si faltan, sigue `KIT.md`, sección «Imágenes generadas»: escribe `public/img/<ID>/imagenes.json`, ejecuta
     `node scripts/imagenes.mjs <ID>` y **mira cada `.jpg`** antes de montar.
   - **Si falla** (sin clave, sin red o sin cupo): monta esa escena con piezas del kit, sin imagen, y apúntalo
     en «Nota del manager». No te pares por eso.
4. **Composición** en `videos/src/videos/<ID>.tsx` con el kit (`src/kit.tsx`).
   - Con imágenes, toma como plantilla `src/videos/EJ-colchon.tsx`.
   - Toma como plantilla el piloto v4 del mismo estilo (W49-25 a W49-29) o, si no hay, `src/videos/W47-02-v2.tsx`: lista `ESCENAS` con un `id` por escena de la voz,
     `Montaje` y `EXTRA_<ID>` para dar aire al wow, al CTA y al cierre.
   - Regístrala en `Root.tsx` con `defaultProps={{ videoId: "<ID>", voz: null }}` y
     `calculateMetadata={metadataConVoz(EXTRA_<ID>)}`. La duración la marca la voz.
   - Cada escena necesita **movimiento propio**: algo entra, crece, cuenta o cambia. Un texto quieto no es
     una escena.
   - **No repitas la plantilla de siempre.** Antes de montar, mira los `.tsx` de las 2 semanas anteriores. Si tu
     vídeo acaba siendo otra vez «frase palabra a palabra en el centro + pastilla + una foto» en la mayoría de
     escenas, no vale (Andrés, 19 nov: «son todos iguales»). Cambia la composición según el formato:
     - **Fábula o historia:** el personaje en escena casi todo el vídeo, con expresiones y acciones (anda, mira,
       se sorprende) y un escenario que cambia; el texto, poco y arriba. Dibújalo en SVG con piezas del kit
       (pieza `Personaje` si existe; si no, créala en `kit.tsx` y documéntala en `KIT.md`) o con imágenes de escena.
     - **Contador o acumulado:** una cifra grande que crece y cambia de color durante todo el vídeo.
     - **Comparación A/B:** pantalla partida todo el vídeo, cada lado con su evolución.
     - **Qué pasaría si:** la misma escena en dos versiones, con un rebobinado entre una y otra.
   - **Que no se vean todos iguales:** dos vídeos seguidos no llevan la misma pista ni el mismo fondo dominante,
     salvo que se esté escalando algo a propósito.
   - Pon los efectos de sonido donde pasa algo (ver la tabla de `KIT.md`), sin saturar.
   - Si creas una pieza reutilizable, muévela a `kit.tsx` y documéntala en `KIT.md`.
5. **Música:** elige en `videos/public/musica/LICENCIAS.md` la pista que pegue con el tono del vídeo y
   pásala a `Montaje` con `pista=`. No uses dos veces seguidas la misma pista en la semana.
6. **Respeta el guion:** textos, cifras, hook, segundo gancho, wow, CTA y cierre. El cierre es el del guion
   (v4: `CtaCrecer` solo si `CIERRE: tarjeta`); nunca palabra clave, curso ni llamada. El hook se ve y se oye
   en el fotograma 0. No inventes cifras.
7. **Comprueba el código:** `cd videos && npx tsc --noEmit`.
8. **Renderiza** a `media/<semana>/<ID>.mp4` con los flags de CLAUDE.md.
9. **Miniatura:**
   `npx remotion still src/index.ts <ID> ../media/<semana>/<ID>.jpg --frame=<frame del hook>`, con los mismos
   flags de navegador.
10. **Control de calidad.**
   - **Sonido:** `ffprobe` debe mostrar una pista de audio. Mide el volumen con
     `ffmpeg -i <mp4> -af ebur128 -f null - 2>&1 | tail -12`: entre -16 y -12 LUFS integrados. Si no, revisa
     que la pista tenga su LUFS en `LUFS_PISTAS` (`kit.tsx`).
   - **Imagen:** saca 6 fotogramas con `remotion still` en `/tmp` (0, segundo 3, wow, rehook, CTA y cierre) y
     míralos.
     - El texto se lee y no se corta, y no pisa los subtítulos.
     - Zona segura libre: 220 px arriba, 420 px abajo, 120 px a la derecha y 90 px a la izquierda.
     - Buen contraste.
   - **Sentido:** se entiende sin sonido gracias a los subtítulos y coincide con el guion.
   - **Duración:** la del guion. Si el render se pasa más de un 15 %, recorta las frases que no muevan la historia y
     vuelve a generar la voz. Nunca subas la velocidad de la voz.
   - **Nota de viralidad** de 1 a 10: la media de hook, ritmo, momento wow, claridad, bucle, **gracia** (¿la
     broma se ve en la animación?) y **acabado** (¿parece de un canal profesional?).
     - **Si es menor de 7**, corrige y vuelve a renderizar (2 vueltas como máximo). Apunta a 8 o más: si ves una
       mejora fácil (un gancho visual más fuerte, una broma que no se ve), hazla.
     - Si sigue por debajo, apúntalo en «Nota del manager».
11. **Commit y push**, para que exista la URL pública.
12. **Actualiza la fila en Notion:**
    - Estado = `Tu revisión`;
    - «Enlace vídeo» = la URL de raw.githubusercontent;
    - «Nota viralidad»;
    - añade al principio de la página el vídeo incrustado (bloque de vídeo con esa URL) y una línea con el
      formato, la hipótesis que prueba, la voz y las técnicas que has usado.

## Reglas

- **Paquetes:** solo los de la familia `@remotion/*` de la misma versión que ya hay. Nada más.
- Sin música, imágenes ni sonidos con copyright: solo los de `public/`, los que generes por código y las imágenes de `scripts/imagenes.mjs`.
- **Si un vídeo falla 3 veces**, apúntalo en «Nota del manager» y sigue con el siguiente.
