---
name: align-ideas-andres
description: Agente «Ideas de Andrés» de ALIGN. Cada noche a las 02:30 recoge los vídeos que a Andrés le gustan personalmente (links de Instagram, TikTok o YouTube que manda desde Notion o desde el buzón de Jarvis, con su nota), los estudia con lo que se pueda ver desde la nube y deja una ficha en Investigación con «Origen» = Andrés, para que el agente de Ideas la tenga en la bolsa.
---

# Agente — Ideas de Andrés

Lee antes `CLAUDE.md`. De `GUIA.md` basta la sección de originalidad. Para el formato de la ficha y de la fila
de Notion, sigue `.claude/skills/align-investigacion/SKILL.md` («Ficha con el plan B» y «Fila de Notion»).

**Por qué existe (19 nov 2026, pedido por Andrés):** además de lo que encuentra Investigación, Andrés quiere
mandar vídeos que le gustan a él. **Sus ideas entran como una más** (decidido por Andrés): no tienen cupo fijo
en la semana; el agente de Ideas decide si las usa, igual que con las demás fichas. Lo que las distingue es
«Origen» = `Andrés` y su nota, que dice qué le gusta.

## De dónde llegan

1. **Notion, base «Ideas de Andrés»** (`collection://41dcc81e-aca2-81d6-b33d-000b6dbb6c6c`). Andrés comparte el
   reel desde el móvil (Compartir → Notion). Pendientes = filas con «Estado» vacío.
   - El link está en «URL». Si está vacía, búscalo en el título o en el cuerpo de la página.
   - «Nota» es lo que le gusta (opcional). Si no hay nota, mira también el cuerpo de la página.
2. **Buzón de Jarvis**: mensajes con `para: Ideas de Andrés` (o `todos` con links) sin respuesta, como dice
   `CLAUDE.md`. Un mensaje puede traer varios links; el texto que los acompaña es la nota.

## AHORRO, lo primero (tras el buzón)

Si no hay filas pendientes en «Ideas de Andrés» ni mensajes del buzón para ti, responde
«Sin ideas de Andrés pendientes» y termina. No hagas `npm ci`. **Este agente no mira cuántas fichas hay sin
usar en Investigación:** lo de Andrés se procesa siempre.

**Como mucho 10 links por noche.** Si hay más, los más antiguos primero; el resto, la noche siguiente.

## Qué hacer con cada link

1. **Duplicados:** si ya hay una fila en Investigación con ese «Enlace» (o una ficha en `investigacion/fichas/`
   con ese id), no repitas la ficha: pon «Origen» = `Andrés` en esa fila, añade su nota dentro y sigue.
2. **Según la plataforma:**
   - **YouTube** (`youtube.com/shorts/…`, `youtu.be/…`): igual que Investigación. Primero
     `node scripts/ver-videos.mjs <url>` (plan A, Gemini, **un solo intento por noche**; si sale con el código 3,
     no vuelvas a llamarlo). Si falla, `node scripts/datos-videos.mjs <id>` y escribe tú la ficha (plan B).
   - **Instagram o TikTok:** la nube no puede ver el vídeo (la red está cerrada y piden iniciar sesión).
     **No intentes saltártelo** ni descargarlo por otras vías. En su lugar:
     a. **Busca el mismo vídeo en YouTube** con WebSearch (cuenta del creador, frase del texto, «shorts»). Si
        lo encuentras y es claramente el mismo, trátalo como un link de YouTube y apunta los dos enlaces.
     b. Si no, prueba **WebFetch** del link para leer el texto público del post (autor, pie, miniatura). Si
        devuelve un muro de inicio de sesión, déjalo.
     c. Con lo que tengas (nota de Andrés, pie del post, cuenta del creador y lo que diga WebSearch de esa
        cuenta), escribe la ficha con `"fuente": "andres"` y `"visto": false`. Todo lo que no se ve va como
        `"sin dato"`. **Haz la ficha aunque no haya nota ni pie:** basta con el id y el enlace; se completa al
        verla en el Mac.
     d. **Esa idea queda «Sin ver», nunca «No se pudo»** (regla de Andrés, 25 nov: «quiero que todas las ideas
        que pase se vean de una manera u otra»). Se termina de ver en el Mac con la skill `align-ver-ideas`.
   - **Otro sitio:** WebFetch y lo mismo del punto c.
3. **La ficha** va en `investigacion/fichas/<id>.json`, con el formato de siempre y además:
   - `"origen": "andres"`, `"nota_andres": "<su nota tal cual>"` y `"enlace_original": "<link que mandó>"`;
   - `id`: el de YouTube si lo hay; si no, `ig-<código del reel>`, `tt-<id del vídeo>` o `web-<AAAAMMDD-n>`;
   - **La nota de Andrés manda:** si dice «me gusta el gancho», el `hook` y `idea_para_ALIGN` se centran en
     eso. No te inventes por qué le gusta si no lo dice.
   - `idea_para_ALIGN`: una idea propia para ALIGN con ese patrón, nunca una copia.
4. **Fila en Investigación** (como en la skill de Investigación), con **«Origen» = `Andrés`**, «Plataforma»
   la del link que mandó, «Enlace» ese link y «Por qué funciona» empezando por «Le gusta a Andrés: <nota>».
   Si la ficha no ha visto el vídeo, dilo ahí («sin ver el vídeo: por su nota y el pie del post»).
   Dentro de la página, el resumen de la ficha y, si hay, el enlace de YouTube equivalente.
5. **Cierra el origen:**
   - Notion: en la fila de «Ideas de Andrés», «Ficha» = URL de la fila de Investigación y «Estado»:
     - `Procesada` solo si **has visto el vídeo** (YouTube con Gemini) o al menos su ficha de datos con
       miniatura y comentarios (plan B). «Respuesta» = una línea con lo que has sacado.
     - `Sin ver` si no has podido ver el vídeo (Instagram, TikTok, o sin nada en YouTube). «Respuesta» =
       «No he podido ver el vídeo desde la nube (<motivo>). Se verá en el Mac: abre una sesión y di "mira las
       ideas"».
     - `No se pudo`, **solo** si el link está roto o no es un vídeo. Nunca porque la nube no lo vea.
   - Buzón: contesta como dice `CLAUDE.md` (archivo `buzon/…-ideas-de-andres.md`), con una línea por link.
6. **Commit y push:** `git add -A && git commit -m "ideas-andres: <n> fichas" && git push`.

## Reglas

- **Patrones, nunca contenido:** no copies frases, guiones, imágenes ni música del vídeo.
- **Nada personal en el repo** (es público): la nota de Andrés se copia, pero sin nombres de terceros que no sean
  el creador público del vídeo, ni teléfonos, correos o claves.
- No toques Vídeos ni escribas guiones: de eso se encarga Semana.
- **Avisa siempre que algo quede sin ver.** Al terminar, si alguna idea ha quedado `Sin ver`, manda **un** aviso
  por correo (regla «Avisar a Andrés» de `CLAUDE.md`): asunto «ALIGN: N ideas tuyas sin ver» y, en el detalle, una
  línea por link con el motivo y «Abre una sesión en el Mac y di "mira las ideas"». Si todo se vio, sin correo.

**Termina:** una línea, p. ej., «3 ideas de Andrés: 1 vista (YouTube), 2 sin ver (Instagram; aviso enviado)».
