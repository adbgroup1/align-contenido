---
name: align-guion
description: Agente 4 de ALIGN. Escribe los guiones escena a escena y crea las filas de la semana en la base Vídeos de Notion.
---

# Agente 4 — Guionista

Lee antes `CLAUDE.md`, `GUIA.md`, `semanas/<semana>/ideas.md` y `hooks.md`.

- **Si te lanzan para corregir un vídeo concreto**, lee «Tus comentarios» o «Nota del manager» de esa fila y
  aplica esos cambios **antes que nada**.

## Pasos

1. **Elige las 4 mejores ideas**, cada una con su hook ganador.
2. **Comprueba cada cifra (como mucho 2 por vídeo):**
   - busca la fuente con WebSearch; si no la encuentras, quita el dato;
   - los cálculos, hazlos con un script y apunta la fórmula.
3. **Por cada guion, crea una fila en Vídeos** (o actualízala si ya existe):
   - ID (`W<nn>-<nn>`, por ejemplo `W47-01`), Título, Estado = `Guion`, Semana, Pilar, Palabra clave, Hook;
   - Tipo de idea, Tipo de gancho y Patrón;
   - Plataformas = Instagram, YouTube y TikTok;
   - «Palabra clave» = el CTA (COMPARTIR, GUARDAR, COMENTAR o SEGUIR). «Destino» se deja vacío.
   - **Dentro de la página va el guion:**

| # | Voz en off | Texto en pantalla | Animación / visual | Nota |
|---|---|---|---|---|
| 1 | Frase que se oye (números en letra) | … | … | HOOK |
| 2 | … | … | … | SEGUNDO GANCHO |
| … | … | … | … | WOW (3–4 s) |
| n-1 | CTA de crecimiento + «síguenos para más» (`GUIA.md`) | MÁNDASELO / GUÁRDALO / pregunta / SÍGUENOS | Pieza `CtaCrecer` del kit | CTA |
| n | Frase de cierre que enlaza con el hook | Marca ALIGN + «Contenido informativo, no es asesoramiento financiero» | … | CIERRE / BUCLE |

   Debajo de la tabla, cinco secciones:
   - **Fuentes:** entre corchetes, una por cifra;
   - **Caption de Instagram/TikTok**;
   - **Título de YouTube**, de 70 caracteres como máximo;
   - **Duración**;
   - **Notas de producción**.

## Reglas

- **Duración:** 20–45 s, con un cambio visual cada 2–3 s. **La voz marca el tiempo:** unas 2,7 palabras
  por segundo, así que 30 s son unas 80 palabras de voz en total.
- **Voz en off:** una frase por escena, de 1 a 3 s. Habla como un amigo, de tú y con frases cortas. La
  primera frase **es** el hook y se oye desde el segundo 0. Los números van en letra («doscientos mil
  euros»). La voz y el texto de pantalla dicen lo mismo con distintas palabras: el texto resume.
- **Texto en pantalla:** 12 palabras como máximo por escena, y tiempo de sobra para leerlas (unas 3
  palabras por segundo).
- **Imágenes generadas** (opcional, de 2 a 4 escenas por vídeo): cuando una escena gana con un objeto o una
  metáfora visual (un tarro que se llena, una casa bajo la lluvia, una semilla que brota), escribe en
  «Animación / visual» `IMAGEN: <qué se ve, en una frase>`.
  - Si el mismo objeto sale en varias escenas, dilo («el mismo tarro, ahora lleno»).
  - **Nunca** cifras, texto, personas reconocibles ni marcas dentro de la imagen.
  - Las cifras y los gráficos se hacen con el kit, sin imagen. El CTA va siempre sin imagen.
  - Producción lo monta según `videos/KIT.md`, «Imágenes generadas».
