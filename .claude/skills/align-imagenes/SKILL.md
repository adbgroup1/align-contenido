---
name: align-imagenes
description: Imágenes de escena de ALIGN en modo semiautomático. Claude, en local y con Andrés delante, genera en ChatGPT web (en su Chrome) las imágenes que piden los guiones de la semana y las deja en public/img/<ID>/ para que la producción de la nube las use. Úsala cuando Andrés diga «haz las imágenes de la semana» o similar.
---

# Imágenes de la semana (semiautomático, en el Mac)

**Por qué así (16 nov 2026):** la API de Gemini gratis no da cuota de imágenes y no hay saldo de OpenAI.
Las imágenes se hacen con el ChatGPT Plus de Andrés, en su Chrome, **solo en una sesión con él delante**.
Nunca en una tarea programada ni sin supervisión: las condiciones de ChatGPT no permiten automatizarlo.

**Cuándo:** entre la rutina Semana (miércoles 09:00) y Producción (sábado 13:00). El parte diario del manager avisa de lo que falta.

## Pasos

1. `git pull --ff-only` en `repo-nube/`.
2. **Qué vídeos llevan imagen:** en Notion (Vídeos), las filas de la semana con Estado `Revisión manager OK`
   y alguna fila `IMAGEN:` en la columna «Animación / visual» del guion. Si no hay ninguna, dilo y termina.
   **Si Andrés dice «rehaz las imágenes»:** solo las marcadas `rehacer` en `public/img/<ID>/revision.json`.
   Su `prompt` en `imagenes.json` ya viene corregido por el agente de Investigación; enséñale a Andrés el
   motivo antes de generar. Usa el mismo chat de ChatGPT del vídeo si sigue abierto (para la continuidad).
3. **Encargos:** por cada vídeo, escribe `videos/public/img/<ID>/imagenes.json` según `videos/KIT.md`
   («Imágenes generadas»): el bloque `estilo` de ALIGN y un `prompt` en inglés por cada `IMAGEN:`.
   Comprueba con `cd videos && node scripts/imagenes.mjs <ID> --plan`.
4. **Generar en ChatGPT web (Chrome de Andrés):**
   - **Un chat nuevo por vídeo**: así el objeto sale igual en todas sus imágenes.
   - En el primer mensaje pega el `estilo`, la regla de composición que enseña `--plan` (vertical 9:16,
     objeto en la franja central, arriba y abajo libres, sin texto) y el primer `prompt`. Después, un `prompt`
     por mensaje.
   - **Pide permiso a Andrés antes de descargar** (nombre y número de imágenes).
5. **Guardar:** como `videos/public/img/<ID>/<id>.png` y después
   `sips -s format jpeg <id>.png --out <id>.jpg` (que quede en ~200–400 KB; si pesa más, añade
   `-s formatOptions 70`).
6. **Revisar cada `.jpg`** con las reglas de `KIT.md`: nada de texto ni de logos, el mismo objeto en todas
   las escenas, el objeto centrado y sin caras raras. Se rehace como mucho 2 veces.
   Esta es una primera criba; la revisión que manda la hace el agente de Investigación esa noche (03:00),
   que aprueba, corrige o pide rehacer cada imagen en `revision.json`. Producción solo usa las aprobadas.
7. **Subir a GitHub:** commit con los `.jpg` y los `imagenes.json` (los `.png` no se suben) y push, solo si
   Andrés lo pide. Sin push, la nube no ve las imágenes y Producción monta esas escenas sin imagen.

`scripts/imagenes.mjs` no rehace las imágenes que ya existen, así que en la nube Producción las aprovecha
tal cual.
