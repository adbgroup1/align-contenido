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
