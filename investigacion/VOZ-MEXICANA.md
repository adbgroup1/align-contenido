# Voz en off mexicana de verdad (ElevenLabs)

*Investigación del 27 nov 2026. Fuente: documentación oficial de ElevenLabs leída ese día, más dos llamadas a la API pública.*

**Leyenda:**
- **[DOC]**: verificado en la documentación oficial (con URL).
- **[API]**: comprobado llamando a la API el 27 nov.
- **[SUPOSICIÓN]**: inferencia mía o fuente de terceros. Hay que probarlo.

---

## 0. Por qué hoy suena neutra (diagnóstico)

1. **`language_code` no hace nada con multilingual_v2. [DOC]** La referencia de `with-timestamps` dice: *"This parameter is not supported for multilingual_v2 models."*
   Fuente: https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps
   Nuestro `voz.mjs` lo manda (`language_code: "es"`) y no sirve. Además, aunque funcionara, «es» no distingue México de España.
2. **multilingual_v2 no entiende etiquetas de audio. [DOC]** Las etiquetas solo aparecen documentadas para v3 y v4.
   Fuente: https://elevenlabs.io/docs/best-practices/prompting/eleven-v3
   Con v2, el acento y la actitud salen **solo de la voz elegida**.
3. **Las voces se eligieron por uso, y ese orden premia a los narradores. [SUPOSICIÓN, muy probable]** `probar-voces.mjs` busca con `sort=usage_character_count_1y`. Las voces más usadas en un año son las de narración y call center, porque son las que consumen más caracteres. De ahí salen «Corporate and Elegant», «Contact Center» o «Calm».
4. **La documentación lo dice tal cual. [DOC]** El acento lo pone la voz: *"choose a voice with an accent that matches your target language and region"*.
   Fuente: https://elevenlabs.io/docs/capabilities/text-to-speech
   Y para v3 y v4, *a delivery already in the voice's training data is easier to reproduce*: si la voz no es chilanga y con chispa, ninguna etiqueta la vuelve chilanga del todo.

**Conclusión:** la palanca nº 1 es **la voz**. La nº 2, **el modelo** (v3 o v4 con etiquetas). Los ajustes vienen en tercer lugar.

---

## 1. Modelos eleven_v3 y eleven_v4

### Contexto: hoy hay un modelo más nuevo que v3. [DOC]

Fuente: https://elevenlabs.io/docs/overview/models

| model_id | Qué es | Límite por petición |
|---|---|---|
| `eleven_v4` | El buque insignia: *"Our most emotive, high quality speech synthesis model"*. Más de 90 idiomas. | 100.000 caracteres |
| `eleven_v4_turbo` | Expresivo y en tiempo real (unos 100 ms). Con etiquetas de audio. | — |
| `eleven_v3` | La generación anterior (*"previous generation"*). Más de 70 idiomas, entre ellos `es`. | 5.000 caracteres |
| `eleven_v3_conversational` | Tiempo real (unos 165 ms). Con etiquetas de audio. | — |
| `eleven_multilingual_v2` | Lo que usamos hoy. Estable, 29 idiomas, español de España y de México. | — |
| `eleven_flash_v2_5` | Barato y rápido. | — |

### ¿Está en la API para Starter?

- **Que v3 y v4 se pueden usar por la API: [DOC].** La página de modelos dice *"Eleven v3 can also be used with the Text to Speech API"*, y la tabla de límites incluye `eleven_v4` para TTS.
- **Que estén en el plan Starter: [SUPOSICIÓN].** La documentación no restringe ninguno de los dos modelos por plan. Starter tiene acceso a la API; la Voice Library por API solo está cerrada al plan gratis ([DOC], *"The voice library is not available via the API to free tier users"*).

### ¿Funciona con `/with-timestamps`?

- **El endpoint de TTS con tiempos: [DOC].** Devuelve `alignment` y `normalized_alignment`, con `characters`, `character_start_times_seconds` y `character_end_times_seconds`. Acepta cualquier `model_id` que tenga `can_do_text_to_speech`. **Pero no nombra v3 ni v4 de forma explícita.**
- **Que v3 y v4 devuelvan alignment en este endpoint: [SUPOSICIÓN].** Hay que probarlo con una llamada. Sí está **verificado [DOC]** que el endpoint de diálogo con tiempos (punto 2), que usa `eleven_v3` por defecto, devuelve `alignment` por carácter. Es decir, v3 sí genera tiempos por carácter.

### Etiquetas de audio. [DOC]

Fuente: https://elevenlabs.io/docs/best-practices/prompting/eleven-v3. La sección de v4 dice que todo aplica también a v3.

- **Voz:**
  - `[laughs]`, `[laughs harder]`, `[starts laughing]`, `[wheezing]`
  - `[whispers]`, `[sighs]`, `[exhales]`
  - `[sarcastic]`, `[curious]`, `[excited]`, `[crying]`, `[snorts]`, `[mischievously]`
- **Efectos:** `[gunshot]`, `[applause]`, `[clapping]`, `[explosion]`, `[swallows]`, `[gulps]`.
- **Acento y especiales:** `[strong X accent]` (ejemplo de la documentación: `[strong French accent]`), además de `[sings]`, `[woo]` y `[fart]`.
  - Están marcadas como **experimentales**: *"may be less consistent across different voices"*.
  - Para nosotros: `[strong Mexican accent]`. [SUPOSICIÓN] Que funcione bien en español no está garantizado.
- **Sintaxis:** entre corchetes, en inglés y dentro del texto, justo antes de la frase a la que afectan. Son *"natural-language instructions, not an enum"*, así que también valen etiquetas de dirección general como `[auctioneer]`.
  Fuente: https://elevenlabs.io/docs/capabilities/text-to-dialogue
- **Puntuación [DOC]:**
  - los puntos suspensivos (`...`) meten pausa y peso;
  - las MAYÚSCULAS dan énfasis;
  - la puntuación normal marca el ritmo.

### Estabilidad «Creative / Natural / Robust»

- **Qué significa cada nivel: [DOC, en una versión espejo de la documentación de v3]**:
  - **Creative:** más emoción, pero puede alucinar.
  - **Natural:** lo más parecido a la grabación original.
  - **Robust:** muy estable, pero responde poco a las etiquetas.
  Fuente: https://cdntest.elevenlabs.io/docs/best-practices/prompting
- **El parámetro en la API: [DOC].** `voice_settings.stability` es un número con 0,5 por defecto: más bajo da más rango emocional y más alto, más monotonía.
- **La equivalencia Creative ≈ 0,0, Natural ≈ 0,5 y Robust ≈ 1,0: [SUPOSICIÓN].** No está publicada.

### Otros datos

- **`language_code`: [DOC].** Es un código ISO 639-1 (`es`) y solo vale para los modelos que lo admiten; con v2 no.
  - Que v3 y v4 lo apliquen: [SUPOSICIÓN].
  - En cualquier caso, **no fija el acento mexicano**: solo el idioma.
- **Velocidad (`speed`): [DOC].** De 0,7 a 1,2, con 1,0 por defecto. Los valores extremos bajan la calidad.

### Coste. [DOC]

Fuente: https://elevenlabs.io/pricing/api

| Modelo | Precio por 1.000 caracteres |
|---|---|
| v3 | 0,08 $ |
| v4 | 0,08 $ |
| v2 Multilingual | 0,08 $ |
| v3 Conversational | 0,04 $ |
| v4 Turbo | 0,04 $ |
| Flash | 0,04 $ |

- **Pasar de v2 a v3 o v4 no cuesta más.** El precio por carácter es el mismo.
- La tasa de créditos de los planes propios no se publica por modelo. [SUPOSICIÓN] Debería ser 1 crédito por carácter, igual que hoy.
- **Ojo:** las etiquetas entre corchetes son caracteres y probablemente también se cobran. [SUPOSICIÓN]

---

## 2. Endpoint de diálogo (varias voces en un audio). [DOC]

Fuente: https://elevenlabs.io/docs/api-reference/text-to-dialogue/convert-with-timestamps

- **Endpoints:**
  - `POST /v1/text-to-dialogue/with-timestamps`;
  - `/v1/text-to-dialogue/stream/with-timestamps`, la versión en streaming.
- **Cuerpo:**
  - `inputs: [{ text, voice_id }, …]`;
  - `model_id`, que por defecto es **`eleven_v3`**. La guía recomienda v4 (https://elevenlabs.io/docs/capabilities/text-to-dialogue);
  - `settings`: `{ stability, similarity, clone_strength }`;
  - `language_code` (se ignora si el modelo no lo admite);
  - `seed`.
- **Límites:**
  - como mucho **2.000 caracteres** sumando todos los `inputs[].text`;
  - como mucho 10 voces distintas.
- **Respuesta:**
  - `audio_base64`;
  - **`alignment` y `normalized_alignment` por carácter**;
  - `voice_segments`, con `voice_id`, `start_time_seconds`, `end_time_seconds`, `character_start_index`, `character_end_index` y `dialogue_input_index`.
  - **Sirve directamente para los subtítulos y para saber quién habla en cada momento.**
- **Avisos:**
  - es una función en desarrollo (*"actual results may vary"*);
  - no es determinista: conviene generar varias tomas;
  - en Starter, 21 sesiones de diálogo por WebSocket; por HTTP cuenta la concurrencia normal.

**Uso para ALIGN:**
- sketches de dos personajes, por ejemplo «yo vs. mi cartera» o «la quincena vs. yo»;
- **aunque sea una sola voz**, este endpoint es la vía *documentada* de usar v3 o v4 con tiempos por carácter, con un único `input`. [La idea es mía; los datos, de la documentación.]

---

## 3. Buscar voces mexicanas en la Voice Library

### Endpoint. [DOC]

Fuente: https://elevenlabs.io/docs/api-reference/voices/voice-library/get-shared.md

`GET /v1/shared-voices`. Parámetros:

| Parámetro | Valores |
|---|---|
| `page_size` | hasta 100 |
| `category` | `professional`, `famous`, `high_quality` |
| `gender`, `age`, `accent`, `language`, `locale`, `search` | texto |
| `use_cases[]`, `descriptives[]` | listas |
| `featured` | sí o no |
| `sort` | `created_date` (por defecto), `usage_character_count_1y`, `trending`, `cloned_by_count` |
| `page` | número de página |

Cada voz trae, entre otros campos:
- `accent`, `locale`, `age`, `descriptive`, `use_case` y `preview_url`;
- `verified_languages[]`, cada uno con `language`, `model_id`, `accent` y `locale`;
- `cloned_by_count` y `usage_character_count_7d`.

### Acentos disponibles en español. [API: `GET /v1/voices/accents?language=es`, sin clave, 27 nov]

`latin american`, `peninsular`, `andalusian`, `argentine`, `basque`, `canary islands`, `caribbean`, `chilean`, `colombian`, `cuban`, `dominican`, `ecuadorian`, `galician`, **`mexican`**, `peruvian`, `puerto rican` y `venezuelan`.

Lo que se descarta: `latin american` es el neutro y `chilean` es el chileno.

**Filtrar sin clave da 401** (*"You must be logged in to use filters"*). [API] Por eso **no he podido listar IDs**: no hay clave de ElevenLabs en el Mac, porque está en la nube.

### Valores recomendados para encontrar voces jóvenes con chispa

- **Seguros [DOC]:**
  - `language=es`;
  - `accent=mexican`;
  - `locale=es-MX`;
  - `gender=male` o `female`.
- **Valores de los textos libres [SUPOSICIÓN]**, sacados de las etiquetas de la web de la biblioteca:
  - `age=young`;
  - `use_cases`: `characters_animation`, `social_media`, `conversational` o `entertainment_tv`;
  - `descriptives`: `casual`, `playful`, `funny`, `energetic` o `upbeat`.
- **Orden:**
  - `sort=trending` o `sort=cloned_by_count`;
  - **no** `usage_character_count_1y`, que saca narradores.
- **Búsqueda de texto como red de seguridad:** `search=chilango`, `search=mexicano`, `search=CDMX`, `search=youtuber` o `search=comedia`.
- **Filtrar después, en el código:** quedarse con las voces cuyo `verified_languages` incluya `eleven_v3` o `eleven_v4` con `locale` `es-MX`, y descartar las que digan en `descriptive` o `description` «corporate», «narration», «calm» o «contact center».

### Nombres encontrados en la web (sin `voice_id` verificado)

- En la página oficial https://elevenlabs.io/text-to-speech/mexican-accent:
  - Antonio;
  - Enrique Mondragón;
  - Alejandro Ballesteros («Warm and Joyful»);
  - Francis;
  - **Mat Oyarzo («Motivating, Young and Clear»)**.
- En un tercero, https://www.famulor.io/voices/elevenlabs/languages/es/accents/mexican:
  - Abel Quiñonez;
  - Abraham;
  - Adri;
  - **Adrián Rojo («Emotional and Eloquent»)**;
  - Adriana Angel;
  - Adriel;
  - Alan;
  - Alberto.

**No encontré ninguna voz etiquetada como «chilanga» ni «comedia» con buena valoración publicada.** Lo honesto es buscarla con la API (abajo) y que decida la escucha y después los datos (H6).

**Consulta lista para ejecutar en la nube**, donde está `ELEVENLABS_API_KEY`:

```bash
curl -s -H "xi-api-key: $ELEVENLABS_API_KEY" \
 "https://api.elevenlabs.io/v1/shared-voices?language=es&accent=mexican&locale=es-MX&age=young&use_cases=characters_animation&use_cases=social_media&use_cases=conversational&sort=trending&page_size=100"
```

Si sale vacío o con pocas voces, ir quitando filtros en este orden:
1. `use_cases`;
2. `age`;
3. `locale`.

---

## 4. Ajustes de `voice_settings`

| | multilingual_v2 | v3 / v4 |
|---|---|---|
| `stability` | 0,30–0,40 (hoy 0,45) | **0,3–0,5**, entre Creative y Natural. Si alucina, subir; si ignora las etiquetas, bajar. |
| `similarity_boost` | 0,75–0,8 | 0,75 (el diálogo lo llama `similarity`; no todos los modelos lo usan) |
| `style` | 0,4–0,6. Más rango, algo más de latencia [DOC] | 0 o bajo. La actitud sale de las etiquetas. [SUPOSICIÓN] |
| `speed` | 1,05–1,12 | 1,05–1,1. Rango válido de 0,7 a 1,2 [DOC] |
| `use_speaker_boost` | true | true |

- **Rangos y efectos: [DOC]** (referencia de TTS).
- **Los números concretos: [SUPOSICIÓN].** Son un punto de partida para probar con datos.

---

## 5. Voice Design: diseñar la voz por API

- **Sí se puede por API. [DOC]**

### Paso 1: generar las muestras

`POST /v1/text-to-voice/design`. Fuente: https://elevenlabs.io/docs/api-reference/text-to-voice/design.md

| Campo | Qué hace |
|---|---|
| `voice_description` | La descripción de la voz |
| `model_id` | `eleven_multilingual_ttv_v2` por defecto, o **`eleven_ttv_v3`** |
| `text` | El texto de muestra, de 100 a 1.000 caracteres |
| `auto_generate_text` | Genera él mismo el texto de muestra |
| `guidance_scale` | 5 por defecto. Más bajo da más libertad; más alto se ciñe más al prompt, pero puede sonar robótico |
| `should_enhance` | Amplía la descripción |
| `seed` | Repite el mismo resultado |
| `loudness` | Volumen, de -1 a 1 |
| `reference_audio_base64` y `prompt_strength` | Solo con `eleven_ttv_v3` |

Devuelve `previews[]`, cada una con su `generated_voice_id` y el audio en `audio_base_64`.

### Paso 2: guardar la voz

`POST /v1/text-to-voice`, con `{ voice_name, voice_description, generated_voice_id, labels }`. Devuelve el `voice_id`. Fuente: https://elevenlabs.io/docs/api-reference/text-to-voice/create.md

### Coste y plan

- **Coste: [DOC, centro de ayuda].** Cada generación da 3 opciones y se cobra según los caracteres del texto de muestra: entre 100 y 1.000 créditos por tanda.
  Fuente: https://help.elevenlabs.io/hc/en-us/articles/29315418701073-How-much-does-Voice-Design-cost
- **Huecos de voz: [DOC, centro de ayuda; puede haber cambiado en agosto de 2026].** La voz diseñada ocupa un hueco de voz propia, y **Starter tiene 10**. Las voces guardadas de la biblioteca no ocupan hueco.
  Fuente: https://help.elevenlabs.io/hc/en-us/articles/24351056337937
- **Plan: [SUPOSICIÓN].** No se documenta ningún plan mínimo para Voice Design salvo los formatos de audio caros (MP3 a 192 kbps desde Creator y PCM a 44,1 kHz desde Pro). Starter debería poder.

### Prompt propuesto [SUPOSICIÓN]

> «Hombre mexicano de 28 años, de Ciudad de México, acento chilango marcado y coloquial, voz de creador de contenido de TikTok: rápido, juguetón, con chispa y sarcasmo amable, como si le contara un chisme a un cuate. Grabación limpia de micrófono de estudio, cercana, sin reverberación.»

- Probarlo con `eleven_ttv_v3`, `guidance_scale` de 3 a 4 y un `text` propio de unos 200 caracteres con modismos, para que el acento salga en la muestra.
- Modismos posibles: «no manches», «la neta», «quincena», «chido», «güey».

---

## RECOMENDACIÓN

1. **Modelo:** `eleven_v3`.
   - Es el que documenta las etiquetas y es el modelo por defecto del diálogo con tiempos.
   - Cuesta lo mismo que v2.
   - En paralelo, una prueba A/B con **`eleven_v4`**, que la documentación recomienda y admite las mismas etiquetas. Que gane el que mejor suene y retenga (H6).
2. **Endpoint:**
   - **Primero, probar** `POST /v1/text-to-speech/{voice_id}/with-timestamps` con `model_id: "eleven_v3"` y comprobar que llega `alignment`. **[SUPOSICIÓN: debería funcionar]**
   - **Si no llega**, usar `POST /v1/text-to-dialogue/with-timestamps` con un solo `input`, que **está documentado [DOC]** que devuelve `alignment` por carácter.
   - Para sketches de dos personajes, el mismo endpoint de diálogo.
   - Partir el texto en trozos de menos de 2.000 caracteres (nuestros reels tienen unos 400).
3. **Voz (lo que más pesa):** sustituir la rotación actual por candidatas sacadas así:
   - parámetros `language=es`, `accent=mexican`, `locale=es-MX`, `age=young`, `use_cases=characters_animation|social_media|conversational` y `sort=trending`;
   - quedarse solo con las que tengan `verified_languages` con `eleven_v3`;
   - **y además**, una voz propia de Voice Design (`eleven_ttv_v3`, el prompt de arriba), que cuesta unos 300 créditos por tanda y ocupa 1 de los 10 huecos;
   - meter de 2 a 4 candidatas en `voces.json → rotacion` y que decidan los datos.
4. **Ajustes de v3:**
   - `stability` 0,4, y bajar a 0,3 si ignora las etiquetas;
   - `similarity_boost` 0,75, `style` 0, `speed` 1,08 y `use_speaker_boost` true.
5. **Etiquetas:**
   - `[strong Mexican accent]` al principio de cada escena (experimental: comparar con y sin ella);
   - después, `[mischievously]`, `[sarcastic]`, `[excited]`, `[laughs]`, `[sighs]` y `[whispers]` en los remates;
   - como mucho 1 o 2 por frase; puntos suspensivos antes de la broma y MAYÚSCULAS en la palabra clave.
6. **El guion pesa tanto como la voz:** escribir en mexicano (quincena, «no manches», «la neta», «chido», «aguinaldo»). El modelo imita mejor el acento cuando el léxico es local. [SUPOSICIÓN razonable]
7. **Quitar `language_code: "es"` mientras se use v2**, porque con v2 no hace nada. Con v3 se puede mandar o no (no fija el acento).
8. **Coste para el plan Starter** (40.000 créditos): un reel de unos 400 caracteres por toma cuesta igual que hoy, unos 400 créditos. Con 3 tomas por vídeo para elegir, unos 1.200.

### Ejemplo de petición (Node, `fetch`)

```js
// Opción A, que hay que probar: TTS con timestamps y v3
await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps?output_format=mp3_44100_128`, {
  method: "POST",
  headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({
    model_id: "eleven_v3",
    text: "[strong Mexican accent] [excited] ¡Llegó la quincena, güey! [mischievously] Y en tres días... [sighs] ya no hay NADA. [laughs] La neta, no es mala suerte: es que no tienes un plan.",
    voice_settings: { stability: 0.4, similarity_boost: 0.75, style: 0, speed: 1.08, use_speaker_boost: true },
    apply_text_normalization: "auto",
    seed: 1234
  })
});
// Respuesta: { audio_base64, alignment: { characters, character_start_times_seconds, character_end_times_seconds }, normalized_alignment }
```

```js
// Opción B, documentada: diálogo con timestamps (1 o 2 voces)
await fetch("https://api.elevenlabs.io/v1/text-to-dialogue/with-timestamps", {
  method: "POST",
  headers: { "xi-api-key": process.env.ELEVENLABS_API_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({
    model_id: "eleven_v3",
    inputs: [
      { voice_id: VOZ_NARRADOR, text: "[strong Mexican accent] [excited] ¡Llegó la quincena, güey!" },
      { voice_id: VOZ_CARTERA,  text: "[sarcastic] Ajá... ¿y cuánto me va a durar esta vez?" }
    ],
    settings: { stability: 0.4 },
    seed: 1234
  })
});
// Respuesta: { audio_base64, alignment, normalized_alignment, voice_segments: [...] }
```

**Ojo con los subtítulos:** las etiquetas `[...]` salen en `alignment.characters`. [SUPOSICIÓN: lo más probable es que salgan con duración casi nula] Hay que quitarlas del texto de los subtítulos con una expresión regular, `/\[[^\]]*\]\s*/g`, antes de mapear las palabras, sin desalinear los índices.

### Próximo paso concreto

Una rutina de mantenimiento en la nube, donde está la clave, que:
- ejecute la consulta de la sección 3 y apunte las candidatas en `media/pruebas/voces-mx/LISTA.md`;
- pruebe la opción A con v3 para ver si llega `alignment`;
- genere 1 tanda de Voice Design.
