# Música de fondo — pistas y licencias

Solo se usan pistas de esta lista. **Producción** elige por tono y no repite la misma pista dos vídeos seguidos.

Las pistas de Pixabay tienen la **Pixabay Content License**: uso comercial gratis y sin atribución. No se
pueden vender ni redistribuir tal cual, aunque sí ir dentro de nuestros vídeos. Las eligió Andrés el 15 nov 2026.

**Volumen:** cada pista suena muy distinta (de -5,6 a -19,5 LUFS). El kit las iguala con `LUFS_PISTAS` en
`src/kit.tsx`. **Si añades una pista, mide su LUFS** (`ffmpeg -i x.mp3 -af ebur128 -f null - 2>&1 | grep ' I:' | tail -1`)
y apúntalo allí.

| Archivo | Duración | Tono | Encaja con | Origen |
|---|---|---|---|---|
| `lofi-polaroids.mp3` | 2:08 | Lo-fi cálido, tranquilo | Ahorro, hábitos, sistema | [Pixabay · FASSounds](https://pixabay.com/music/beats-lofi-polaroids-632981/) |
| `quiet-courtyard.mp3` | 2:12 | Lo-fi suave, íntimo | Colchón, errores comunes | [Pixabay · Artur_Aravidi_Music](https://pixabay.com/music/beats-a-quiet-courtyard-lofi-621847/) |
| `lay-back.mp3` | 0:44 | Lo-fi relajado (se repite en bucle) | Vídeos cortos y ligeros | [Pixabay · Grumpynora](https://pixabay.com/music/lofi-lay-back-619255/) |
| `long-day.mp3` | 3:06 | Lo-fi con ritmo | Nómina, día a día | [Pixabay · PurrpleCat](https://pixabay.com/music/beats-long-day-518602/) |
| `minimal-ambient-tech.mp3` | 1:44 | Ambient tecnológico | Datos, cifras, interés compuesto | [Pixabay · AleXZavesa](https://pixabay.com/music/ambient-minimal-ambient-technology-632734/) |
| `piano-strings-light.mp3` | 2:15 | Piano y cuerdas, seguro y optimista | Largo plazo, el tiempo | [Pixabay · zec53](https://pixabay.com/music/modern-classical-piano-and-strings-ambient-confident-and-light-full-633882/) |
| `tech-synthpop.mp3` | 2:07 | Synth pop con energía | Mitos, comparativas A/B | [Pixabay · MiroMaxMusic](https://pixabay.com/music/synth-pop-technology-synthpop-no-copyright-633148/) |
| `sunlight.mp3` | 2:12 | House suave y luminoso | Experimentos, temas positivos | [Pixabay · SoSimpleAudio](https://pixabay.com/music/house-sunlight-633626/) |
| `pad-align.wav` | 0:38 | Pad ambiental calmado | Reserva | Generada por código (`scripts/musica-pad.mjs`). Propia |
