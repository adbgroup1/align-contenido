# ALIGN · sistema de contenido — instrucciones comunes para todos los agentes

Trabajas en la nube, sin nadie delante. Este repositorio es tu disco: lo que no hagas *commit* y *push*
desaparece al terminar.

## Qué es ALIGN

- Marca de finanzas personales de Alain De La Bastide.
- Público: hispanohablantes en España de 22 a 40 años, sin formación financiera.
- Hacemos **2 vídeos cortos por semana**, educativos y animados (Remotion, sin cara), para Instagram Reels
  (@alignbyadb) y YouTube Shorts (@ALIGNbyADB). TikTok está aparcado.
- **El objetivo es crecer a corto plazo:** seguidores, compartidos, guardados y comentarios (CTA en `GUIA.md`).
  alignbyadb.com, con el curso y la llamada, se queda en la bio y no se empuja en el vídeo.
- **Antes de trabajar, lee `GUIA.md`:** marca, pilares, palabras clave y reglas de contenido.

## Dónde está cada cosa

### Notion (conector «Notion»; espacio ADB GROUP)

| Qué | ID |
|---|---|
| Página «ALIGN · Contenido» | `418cc81e-aca2-802b-82f1-dafb078bbea2` |
| Base «Vídeos», data source | `collection://91319184-53cd-4484-bc27-348e3f1a5a3a` |
| Base «Investigación», data source | `collection://418cc81e-aca2-811d-821b-000b03502156` |
| Página «Aprendizajes» | `418cc81e-aca2-812d-9af6-dbe8044484e0` |
| Página «Resúmenes semanales» | `418cc81e-aca2-81de-aa81-fb279bb6cec8` |

- **Una fila de «Vídeos» = un vídeo.** El título (`ID`) tiene el formato `W47-01`.
  - Al crear filas con el conector, la propiedad título se llama **`userDefined:ID`**, no `ID`.
  - «Semana» es un select: si la opción de la semana (`2026-W47`) no existe, añádela antes con
    `notion-update-data-source` **listando también todas las opciones existentes**.
- El guion completo va **dentro de la página** de esa fila.
- **«Estado»** recorre: `Idea → Guion → Revisión manager OK → Renderizado → Tu revisión → Aprobado →
  Programado → Publicado → Analizado`, más `Devuelto`, `Cambios pedidos` y `Descartado`.
- **«Tu decisión» y «Tus comentarios» los rellena Andrés.** Nunca los cambies tú, salvo para vaciarlos
  después de aplicar unos cambios.

### Metricool (conector «Metricool»)

| Qué | Valor |
|---|---|
| Marca | ALIGN |
| `blogId` | `5900765` |
| Zona horaria | `Europe/Madrid` |

### Repositorio

| Ruta | Qué hay |
|---|---|
| `videos/` | Proyecto Remotion (plantilla de estilo en `src/brand.ts` y `src/Scenes.tsx`) |
| `media/<semana>/<ID>.mp4` y `.jpg` | Vídeos renderizados y miniaturas |
| `semanas/<semana>/` | Ideas, hooks y notas del manager |
| `.claude/skills/` | Las instrucciones de cada agente |

- **URL pública de un vídeo:**
  `https://raw.githubusercontent.com/adbgroup1/align-contenido/main/media/<semana>/<ID>.mp4`.
  Es la que se pone en Notion («Enlace vídeo») y en Metricool.
- **Semana:**
  - de trabajo (los agentes del sábado y del domingo producen para la semana siguiente):
    `date -d "next monday" +%G-W%V`;
  - del lunes en curso: `date +%G-W%V`.

## Renderizar en esta nube

La nube no puede descargar el Chrome de Remotion. Usa siempre el Chromium que trae instalado:

```
cd videos && npm ci --no-audit --no-fund
npx remotion render src/index.ts <ID> ../media/<semana>/<ID>.mp4 \
  --browser-executable=/opt/pw-browsers/chromium --chrome-mode=chrome-for-testing
```

- **Kit v2:** los vídeos se montan con `videos/src/kit.tsx` (manual en `videos/KIT.md`). La voz se genera
  antes del render con `node scripts/voz.mjs <ID>`.
- **Imágenes de escena:** si el guion lleva `IMAGEN:`, Andrés las hace antes con Claude en local, en ChatGPT web
  (skill `align-imagenes`), y llegan en `public/img/<ID>/`. Si faltan, `node scripts/imagenes.mjs <ID>`
  (`KIT.md`, «Imágenes generadas»); hoy la API no tiene cupo, así que esas escenas se montan sin imagen.
  Nunca se usan modelos de vídeo.
- **Si la fuente Inter no carga** (Google Fonts bloqueado), sigue con la fuente del sistema y apúntalo en la
  nota del manager. No te pares por eso.

## Claves y red de la nube

La nube solo deja salir a los dominios permitidos en el entorno. Las claves van como variables de entorno;
**nunca se escriben en el repo** ni en Notion.

| Variable | Para qué | Dominio que debe estar permitido |
|---|---|---|
| `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID` | Voz en off (`scripts/voz.mjs`) | `api.elevenlabs.io` |
| `GEMINI_API_KEY` | Que Gemini vea los virales (`scripts/ver-videos.mjs`) y las imágenes de escena (`scripts/imagenes.mjs`) | `generativelanguage.googleapis.com` |
| `OPENAI_API_KEY` (opcional) | Imágenes de escena con `scripts/imagenes.mjs --openai` | `api.openai.com` |
| `GOOGLE_API_KEY` (obligatoria: la clave de Gemini está vinculada a una cuenta de servicio y no admite YouTube) | Buscar Shorts (`scripts/buscar-shorts.mjs`) | `www.googleapis.com` |

- Si falta una clave o un dominio, el script lo dice. Apúntalo y no improvises otra vía.

## Reglas de todos los agentes

- **AHORRO, lo primero de todo:** antes de leer nada más, mira en Notion si hay filas en tu estado de entrada.
  Si no hay trabajo, responde en **una línea** y termina. No hagas `npm ci` ni leas guías si no hace falta.
- **Lee solo lo necesario:** la sección concreta de Aprendizajes o del resumen, no páginas enteras; y solo la
  referencia de Investigación que cita la fila («Patrón»).
- **Si al lanzarte recibes un mensaje adicional, esa instrucción manda** (salvo las reglas de contenido de
  `GUIA.md`).
- **Nunca pongas una fila en `Aprobado`:** eso solo lo decide Andrés con «Tu decisión».
- **Originalidad:** todo es propio; de otros creadores solo se aprenden patrones (gancho, ritmo, estructura,
  giro, cierre), nunca frases, guiones, imágenes ni música.

- **Al empezar:** el repo llega con HEAD suelto. Haz
  `git config --global --add safe.directory "$PWD" && git checkout -q main && git pull -q --ff-only`.
- **Al terminar:** `git add -A && git commit -m "<agente>: <qué>" && git push`.
  - Si el push falla por cambios remotos: `git pull --rebase` y otra vez `git push`.
- **No inventes datos.** Lo que no se vea, «sin dato».
- **Nunca borres filas de Notion ni posts de Metricool.**
- **Avisar a Andrés:** **solo** cuando la skill lo diga, con un correo. Una línea de Bash:
  `curl -sL "$AVISO_URL" -H 'Content-Type: text/plain' --data-binary "<asunto>
<detalle opcional>"`
  - La primera línea es el asunto; debe responder `ok`. Como mucho 10 avisos al día.
  - `AVISO_URL` es una variable del entorno (dominios `script.google.com` y `script.googleusercontent.com`).
    Nunca la escribas en el repo ni en Notion. Si falta o no responde `ok`, dilo en el resumen.
  - No uses PushNotification: Andrés no tiene la app de Claude en el móvil.
- **Termina siempre con un resumen de 3–5 líneas** de lo que has hecho.
