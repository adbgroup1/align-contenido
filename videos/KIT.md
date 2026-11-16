# Kit de animación v2 — manual de piezas

*Todo vídeo nuevo se monta con `src/kit.tsx`. Ejemplo completo: `src/videos/W47-02-v2.tsx`.*

## Cómo funciona un vídeo

1. **La voz manda.** Hay un archivo de audio por cada escena y la escena dura lo que dura su frase, más
   0,35 s de aire. Si una escena necesita más tiempo (wow, CTA, cierre), se añade en `EXTRA_<ID>`.
2. **Los subtítulos salen solos** de los tiempos de cada palabra: de 3 en 3, en mayúsculas, y la palabra
   que suena en dorado.
3. **La música** suena baja todo el vídeo y baja más cuando habla la voz (atenuación automática).
4. **Cada escena** entra con zoom, desenfoque, destello y whoosh, y la cámara empuja despacio.

## Archivos

| Ruta | Qué es |
|---|---|
| `public/voz/<ID>/guion.json` | Frases de la voz, una por escena (lo escribe producción) |
| `public/voz/<ID>/voz.json` y `*.mp3` | Audio y tiempos por palabra (lo genera `scripts/voz.mjs`) |
| `public/musica/` | Pistas de fondo. Licencias en `LICENCIAS.md` |
| `public/sfx/` | Efectos de sonido sintetizados (`scripts/sfx.mjs`) |

### `guion.json`

```json
{ "escenas": [
  { "id": "hook", "texto": "Mismos cien euros al mes. Diez años de diferencia." },
  { "id": "wow",  "texto": "Lucía llega a casi doscientos mil euros." }
] }
```

- El `id` de cada escena es el que usa `ESCENAS` en el `.tsx`.
- **Los números van en letra.**
- Frases cortas, de 1 a 3 segundos. Una idea por escena.

### Comandos

```
node scripts/voz.mjs <ID>          # voz definitiva (ElevenLabs; ELEVENLABS_API_KEY y ELEVENLABS_VOICE_ID)
node scripts/voz.mjs <ID> --say    # voz provisional de macOS, solo para probar en local
node scripts/sfx.mjs               # regenera los efectos (no hace falta: ya están en el repo)
```

## Piezas

| Pieza | Para qué |
|---|---|
| `Montaje` | Monta el vídeo entero: escenas, voz, subtítulos y música. Recibe `videoId`, `voz`, `escenas`, `pista` y `extra` |
| `Escena` | Envoltorio de cada escena: fondo vivo, cámara, entrada con zoom y desenfoque, y whoosh. `fondo` = `noche`, `azul` o `claro`; `sacudidas=[s]` hace temblar la cámara en ese segundo; `sinEntrada` para el hook; `sonidoEntrada` = `whoosh`, `impacto`, `swoosh` o `null` |
| `Zona` | Caja de contenido que respeta la zona segura y deja sitio a los subtítulos |
| `Palabras` | Texto que entra palabra a palabra con muelle y desenfoque. `**así**` resalta en color; `marcador` pinta un rotulador detrás |
| `Cifra` | Contador grande con brillo, golpe al llegar y ticks de sonido |
| `Cristal` | Tarjeta de cristal con borde de color que entra desde la izquierda, la derecha, abajo o con zoom |
| `Pildora` | Etiqueta (p. ej., «Ejemplo hipotético · 6 % anual») |
| `Chispas` | Explosión de partículas en el momento wow (`en` = segundo) |
| `Sfx` | Efecto de sonido en un segundo concreto |
| `Subtitulos` | Ya lo pone `Montaje`; `subtitulos: false` en una escena lo quita (p. ej., en el cierre con marca) |

## Efectos de sonido

| Archivo | Cuándo | Volumen |
|---|---|---|
| `whoosh` | Cambio de escena (automático) | 0,28 |
| `impacto` | Hook y revelaciones fuertes | 0,5 |
| `pop` | Aparece un elemento, una tarjeta o un sello | 0,4 |
| `tick` | Contadores (automático en `Cifra`) | 0,12 |
| `riser` | 1,5 s antes del wow | 0,35 |
| `ding` | La cifra final, el wow | 0,4 |
| `click` | El botón del CTA | 0,4 |
| `swoosh` | Entrada rápida de un texto | 0,25 |

**Como mucho 1 efecto por segundo**, aparte de los ticks: si suena todo, no destaca nada.

## Reglas visuales

- Fondo siempre vivo (`Escena` ya lo pone), nunca un color plano.
- **Cada escena tiene movimiento propio:** algo crece, cuenta, entra o cambia. Un texto quieto no es una
  escena.
- El texto de pantalla resume; los subtítulos cuentan. No repitas la frase entera en los dos sitios
  cuando haya un gráfico: deja el gráfico y una etiqueta corta.
- Colores solo de `brand.ts`. Lucía/Marcos u opciones A/B: `accent` frente a `gold`.
- El contenido cabe entre y=250 e y=1260; los subtítulos van encima de y=1440.

## Imágenes generadas (método «imágenes + kit»)

*Probado el 15 nov 2026 con «El colchón». Ejemplo completo: `src/videos/EJ-colchon.tsx`.*

Para escenas que piden un objeto o una situación concreta (una hucha, una casa bajo la lluvia, una
planta que brota) se genera **una imagen fija por escena** y el kit le da el movimiento: zoom lento,
partículas, texto cinético, voz, subtítulos y música. **No se usan modelos de vídeo**: son caros, lentos y
no caben en la nube.

### Cuándo usarlo

- Úsalo cuando la escena gana con un objeto real y reconocible (metáforas: colchón, lluvia, semilla, tarro).
- Para cifras, comparaciones y gráficos, el kit sin imágenes sigue siendo mejor (`Cifra`, `Cristal`, barras,
  curvas).
- Lo normal es mezclar las dos cosas: 2–4 escenas con imagen y el resto con piezas del kit. El CTA va siempre
  sin imagen (`fondo="claro"`).

### Paso a paso

1. **Encargos:** en `public/img/<ID>/imagenes.json` (formato en la cabecera de `scripts/imagenes.mjs`).
   - **`estilo`:** el mismo bloque para todo el vídeo. Base de ALIGN: «Clean minimal 3D render, soft
     studio lighting, deep navy blue background (#0F172A), cobalt blue (#1D4ED8) and pale periwinkle
     (#C7D7FE) accents, subtle glossy materials, shallow depth of field.»
   - **Un `prompt` por imagen, en inglés:** describe el objeto y lo que pasa, no la composición. El script
     añade solo la regla de composición (objeto en la franja central, arriba y abajo libres) y el «sin texto».
   - **Mismo objeto en varias escenas:** pon `"ref": "<id de la primera>"` y escribe «the same jar…».
2. **Generar:** `node scripts/imagenes.mjs <ID>`.
   - Por defecto usa Gemini (`GEMINI_API_KEY`, ya está en la nube); con `--openai` usa OpenAI.
   - Con `--plan`, revisa los encargos sin gastar nada.
   - Las imágenes que ya existen no se rehacen: para repetir una, `--solo <id> --forzar`.
   - Salen un `.png` (referencia, no se sube) y un `.jpg` de ~200 KB, que es el que usa el vídeo.
3. **Revisarlas antes de montar.** Mira cada `.jpg`.
   - **Rehaz la imagen (como mucho 2 veces) si:**
     - sale texto o algún logo;
     - el objeto cambia entre escenas;
     - está fuera de la franja central;
     - tiene manos o caras raras.
4. **Montar:** en cada escena, `<Foto src="img/<ID>/<id>.jpg" />` es el **primer hijo** de `<Escena>`, y
   después va el texto en una `Zona` con `top={250} bottom={1050} justify="flex-start"`.
5. Voz, música, render y control de calidad: igual que cualquier vídeo del kit.

### Piezas

| Pieza | Para qué |
|---|---|
| `Foto` | Imagen a pantalla completa con zoom lento y oscurecido arriba (texto) y abajo (subtítulos). `zoom=[inicio, fin]`, `subir` = px que sube durante la escena, `sombra` = 0–1 |
| `Lluvia` | Gotas animadas por encima de una `Foto` (imprevistos, problemas, «tormenta») |

### Reglas de imagen

- **Una idea por imagen.** Fondo oscuro y limpio; nada de escenas recargadas.
- **Movimiento siempre:** alterna acercar (`zoom=[1, 1.15]`) y alejar (`[1.15, 1]`) entre escenas
  seguidas. Añade una partícula o un `Sfx` donde pase algo.
- **Nada de personas reconocibles, marcas, billetes reales ni logotipos.** Monedas genéricas, sí.
- **Las cifras nunca van dentro de la imagen:** van en `Cifra` o en `Palabras`, para poder comprobarlas.

### Sin API (a mano, desde ChatGPT web)

**Es el método actual (16 nov 2026):** lo hace Claude en local con Andrés delante; pasos en la skill
`align-imagenes`. Andrés o Claude en local pueden generarlas en chatgpt.com, en **un solo chat** (así el
tarro sale igual en todas), con los mismos textos de `imagenes.json`.
- Guárdalas como `public/img/<ID>/<id>.png` y conviértelas a `.jpg` con
  `ffmpeg -i x.png -q:v 3 x.jpg` (en Mac: `sips -s format jpeg x.png --out x.jpg`).
- El script verá que ya existen y no las rehará.
