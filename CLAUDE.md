# ALIGN · sistema de contenido — instrucciones comunes para todos los agentes

Trabajas en la nube, sin nadie delante. Este repositorio es tu disco: lo que no hagas *commit* y *push*
desaparece al terminar.

## Qué es ALIGN

- Marca de finanzas personales de Alain De La Bastide.
- Público: hispanohablantes en España de 22 a 40 años, sin formación financiera.
- Hacemos **3 vídeos cortos por semana**, educativos y animados (Remotion, sin cara), para Instagram Reels,
  YouTube Shorts y TikTok.
- **El objetivo es llevar gente a alignbyadb.com**, donde están el curso y la llamada gratuita con Alain.
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

- **Si la fuente Inter no carga** (Google Fonts bloqueado), sigue con la fuente del sistema y apúntalo en la
  nota del manager. No te pares por eso.

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

- **Al terminar:** `git add -A && git commit -m "<agente>: <qué>" && git push`.
  - Si el push falla por cambios remotos: `git pull --rebase` y otra vez `git push`.
- **No inventes datos.** Lo que no se vea, «sin dato».
- **Nunca borres filas de Notion ni posts de Metricool.**
- **Avisar a Andrés:** usa la herramienta de notificación push (PushNotification) **solo** cuando la skill lo
  diga.
- **Termina siempre con un resumen de 3–5 líneas** de lo que has hecho.
