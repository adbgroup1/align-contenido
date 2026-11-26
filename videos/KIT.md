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

Después de renderizar, **siempre** `bash scripts/reparar-fotogramas.sh <ID> ../media/<semana>/<ID>.mp4`: en la nube
Chromium a veces saca fotogramas «en mosaico» (sobre todo si hay otro render o `still` a la vez: renderiza de uno en
uno) y algunas voces dejan el vídeo a -18/-20 LUFS. El script rehace esos fotogramas y normaliza el audio a -14 LUFS.
Efectos extra propios (trompetas, bombo, sirena, cumbia, pitido, rebobinado, acorde, claxon): `bash scripts/sfx-extra.sh`
→ `public/sfx/extra/`. La clave de ElevenLabs no tiene permiso de efectos de sonido (26 nov).

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
| `CtaCrecer` | Escena de CTA de crecimiento (`GUIA.md`): `tipo` = `compartir`, `guardar`, `comentar` o `seguir`; `boton` = texto grande («MÁNDASELO», «GUÁRDALO», «¿12 o 14?»); `linea` = frase debajo. Añade sola «Síguenos para más». Ponla en la escena `cta` con `subtitulosClaros: true` |
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

## Dibujos en código (método «dibujo + kit»)

*Pista de la `GUIA.md`, «Lo que sabemos hoy», punto «Imagen o dibujo». Va en las escenas `DIBUJO:` del guion y
en las `IMAGEN:` que Producción decida dibujar.*

- **Qué es:** ilustración plana en SVG dentro del propio `.tsx`, animada con `useSpring`, `interpolate` y
  `ease`. No hace falta red, ni clave, ni que Andrés haga nada: sale entera en la nube.
- **Estilo ALIGN:** formas redondeadas y simples, 2 o 3 colores de `brand.ts` por dibujo y un color de acento,
  sombras suaves en lugar de contornos negros, y fondo `Fondo` del kit.
- **Siempre con movimiento:** algo entra con muelle, algo cambia de estado (se llena, crece, se vacía) y hay
  un gesto pequeño en bucle (respirar, parpadear, balancearse). Un dibujo quieto es peor que una foto.
- **Personajes:** cabeza y cuerpo con formas básicas, ojos que parpadean, boca que cambia con la emoción
  (contento, sorprendido, preocupado). Nunca personas reconocibles ni marcas.
- **Personajes ya hechos:** usa `Personaje`, `Escenario`, `Bocadillo` y `Rotulo` de `kit.tsx` (sección
  «Personajes y escenarios», más abajo) antes de dibujar uno nuevo.
- **Reutiliza:** si un dibujo sirve para otros vídeos (un personaje, una hucha, una cartera), muévelo a
  `src/dibujos.tsx`, con sus props (color, estado, emoción), y apúntalo en la tabla de «Piezas».
- **Míralo antes de dar el vídeo por bueno:** saca un `remotion still` de cada escena dibujada. Si parece
  casero o de presentación de clase, simplifícalo o cambia la escena a cifras y texto del kit.

## Imágenes generadas (método «imágenes + kit»)

*Probado el 15 nov 2026 con «El colchón». Ejemplo completo: `src/videos/EJ-colchon.tsx`.*

Para escenas que piden un objeto o una situación concreta (una hucha, una casa bajo la lluvia, una
planta que brota) se genera **una imagen fija por escena** y el kit le da el movimiento: zoom lento,
partículas, texto cinético, voz, subtítulos y música. **No se usan modelos de vídeo**: son caros, lentos y
no caben en la nube.

### Cuándo usarlo

- Úsalo cuando la escena gana con un objeto real y reconocible, con textura y ambiente, y no tiene que
  cambiar mucho. Si tiene que moverse o transformarse (un tarro que se llena), suele quedar mejor dibujado
  en código (ver «Dibujos en código»).
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
3. **Revisarlas antes de montar.** Mira cada `.jpg`. La revisión oficial es el «Paso 0» de
   `align-investigacion`, que deja el veredicto en `revision.json`.
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

## Personajes y escenarios (fábulas e historias)

*Añadido el 19 nov 2026 («los vídeos son todos iguales»). Ejemplos: `src/videos/W48-02.tsx` (fábula) y
`src/videos/W48-03.tsx` (historia).* Todo se dibuja en SVG con los colores de `brand.ts`: no hace falta API
de imágenes. **Nunca personas reconocibles:** los personajes son figuras redondas con ojos, cejas y boca.

| Pieza | Para qué |
|---|---|
| `Personaje` | Figura tipo «judía» con brazos, piernas y cara. Respira y parpadea sola. `x`, `y` = dónde pisan los pies (usa `SUELO_Y`); `escala` (1,6 por defecto ≈ 320 px de ancho); `color`; `expresion` = `feliz`, `neutral`, `sorpresa`, `triste`, `preocupado`, `enfadado` o `pensativo`; `pose` = `quieto`, `saluda`, `brazos-arriba`, `senala`, `piensa`, `abraza` o `encoge`; `mirar` = `izq`, `der` o `frente`; `anda` mueve las piernas y bota (la `x` la animas tú); `salto` = segundo en que da un brinco; `accesorio` = `lazo`, `gorra`, `gafas`, `santa` (gorro navideño), `casco` (de obra), `sombrero` (de palma) o `corbata` (+ `colorAccesorio`); `bigote` = bigote grande; `entra` = `izq`, `der` o `abajo` con `delay`; `semilla` desfasa respiración y parpadeo entre dos personajes |
| `Escenario` | Fondo dibujado a pantalla completa, **primer hijo de `<Escena>`**. `tipo` = `campo` (cielo, sol, nubes que se mueven, colinas; `tarde` 0–1 lo lleva al atardecer), `interior` (pared cálida, ventana, cuadro, lámpara), `tienda` (estantes y mostrador) o `calle` (noche, edificios con ventanas que se encienden). Trae una franja oscura abajo para los subtítulos |
| `SUELO_Y` | 1250: la línea del suelo. Los pies van aquí, por encima de los subtítulos |
| `Bocadillo` | Bocadillo de diálogo (o de pensamiento con `piensa`) que entra con muelle. `x`, `y` = centro arriba; `colaX` mueve la punta hacia el personaje |
| `Rotulo` | Cartel corto arriba (y=250), con `**resaltado**`. Es el texto en pantalla de las fábulas: poco y arriba, el personaje manda |

### Cómo se monta una fábula o una historia

- **El personaje está en pantalla casi todo el vídeo** y cambia de expresión y de pose en cada escena
  (sorpresa en el giro, triste en el problema, feliz en la moraleja). Un nombre y un color fijos de principio a fin.
- **El escenario cambia** cada 2–3 escenas (`interior` → `campo` → `campo` con `tarde`), y algo se mueve en
  cada escena (una polilla que vuela, una cesta que se vacía, un calendario que pasa hojas).
- **Texto en pantalla: solo `Rotulo`** y, si hace falta, la cifra (`Cifra`) en un cartel. Nada de frase palabra
  a palabra en el centro: eso es la plantilla de Explicación.
- Los objetos de la historia (tarro, cesta, móvil, polilla…) se dibujan en el `.tsx` del vídeo. Si uno se
  repite en otro vídeo, súbelo al kit.
