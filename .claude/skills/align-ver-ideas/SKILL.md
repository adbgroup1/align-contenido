---
name: align-ver-ideas
description: Ver en el Mac, en el Chrome de Andrés, las ideas suyas que la nube no ha podido ver (reels de Instagram o TikTok, sobre todo). Claude abre cada vídeo, lo recorre fotograma a fotograma, lee el pie y los comentarios, y completa la ficha de Investigación como «vista». Úsala cuando Andrés diga «mira las ideas», «mira mis ideas» o similar, o cuando el parte diario avise de ideas sin ver.
---

# Ver las ideas de Andrés (semiautomático, en el Mac)

**Por qué (25 nov 2026, Andrés):** «cuando te pase una idea y no la puedas ver dímelo; quiero que todas las ideas
que pase se vean de una manera u otra, ya sea como hacemos con ChatGPT o como sea». La nube no abre Instagram ni
TikTok, así que esas ideas se ven aquí, igual que las imágenes de ChatGPT: **en una sesión del Mac, en el Chrome
de Andrés y con él delante.** Nunca en una tarea programada.

## Qué hay que ver

1. `git pull --ff-only` en `repo-nube/`.
2. En Notion, base «Ideas de Andrés» (`collection://41dcc81e-aca2-81d6-b33d-000b6dbb6c6c`): filas con «Estado» =
   `Sin ver`. Añade las fichas de `investigacion/fichas/` con `"origen": "andres"` y `"visto": false` (las del
   buzón de Jarvis no tienen fila en Notion). Si Andrés pasa un link nuevo en la propia sesión, va también.
   Si no hay ninguna, dilo y termina.

## Cómo se ve cada vídeo (Claude in Chrome)

- Abre el link en una pestaña nueva. Si Instagram o TikTok piden iniciar sesión, **pídele a Andrés que lo haga
  él**; no escribas contraseñas ni te saltes avisos o CAPTCHAs.
- **No descargues el vídeo.** Solo se mira, como lo miraría Andrés.
- **Recorrerlo:** pausa el `<video>` y llévalo a cada momento con JavaScript
  (`v=document.querySelector('video'); v.pause(); v.currentTime=T`), con una captura en cada uno:
  0 s, 1 s, 2 s, 3 s y después cada 2 s hasta el final (`v.duration`). Si hay un corte de escena entre dos
  capturas, mete otra en medio. Así salen el gancho de 0–3 s, las escenas, los textos en pantalla y el cierre.
- **Sonido:** Claude no lo oye. Apunta lo que se ve (nombre del audio, subtítulos, si habla alguien a cámara) y lo
  que no, `"sin dato"`. Si la nota de Andrés habla del sonido, pregúntale en una línea qué se oye.
- **Texto:** `get_page_text` para el pie, la cuenta, las vistas o «me gusta» y los comentarios visibles (los
  5–10 más arriba, para ver de qué se ríe la gente).

## Completar la ficha

- Reescribe `investigacion/fichas/<id>.json` con el formato de siempre (`align-investigacion`), ahora con datos
  vistos: `"fuente": "chrome"`, `"visto": true`, sin el campo `aviso`, y rellena escenas, hook, ritmo, cierre,
  tipografía, color, cámara y recetas de Remotion. Conserva `origen`, `nota_andres` y `enlace_original`.
- Si la ficha no tenía nota, la idea para ALIGN sale de lo que se ve. **Pregúntale a Andrés en una línea qué
  le gustó** si no queda claro, y guárdalo en `nota_andres`.
- `idea_para_ALIGN`: el patrón aplicado a ALIGN, nunca una copia.

## Cerrar

- **Investigación (Notion):** si ya hay fila con ese enlace, actualízala («Por qué funciona» con «Visto en el
  Mac»); si no, créala como dice `align-investigacion`, con «Origen» = `Andrés`.
- **Ideas de Andrés (Notion):** «Estado» = `Procesada`, «Ficha» = URL de la fila de Investigación y
  «Respuesta» = una línea con lo que has visto. Usa `"allow_async": false`.
- **Commit y push:** `git add -A && git commit -m "ver-ideas: <n> ideas vistas en el Mac" && git push`.
- A Andrés, una línea por idea: qué técnica tiene y qué idea sale para ALIGN.

## Reglas

- **Patrones, nunca contenido:** no copies frases, guion, imágenes ni música.
- Las capturas no se guardan en el repo (es público): solo la ficha.
- Si el vídeo ya no existe o es privado, «Estado» = `No se pudo` y díselo a Andrés.
