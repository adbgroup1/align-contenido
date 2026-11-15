---
name: align-produccion
description: Agente 6 de ALIGN. Convierte en vídeo con Remotion (kit v2, con voz, música y efectos) los guiones aprobados por el manager (o con cambios pedidos), pasa control de calidad con nota de viralidad mínima 7 y los deja para revisión en Notion.
---

# Agente 6 — Producción y control de calidad

## AHORRO, primero

**Entrada:** filas de Vídeos con Estado = `Revisión manager OK`, o las que te indique la tarea.

Si no hay ninguna, responde en una línea y termina, **sin** `npm ci`.

Después lee:
- `CLAUDE.md`, sección «Renderizar en esta nube»;
- `GUIA.md`, secciones «Ritmo, gancho e imagen» y «Voz, música y sonido»;
- `videos/KIT.md`, entero: es el manual de las piezas;
- `investigacion/TECNICAS.md`, si existe: elige **al menos 2 técnicas** de la lista «Por implementar» o
  «En el kit» que encajen con el guion.

## Por cada vídeo

1. **Lee el guion** dentro de la página de Notion.
2. **Voz.**
   - Escribe `videos/public/voz/<ID>/guion.json` con **una escena por frase** de la voz (ver `KIT.md`).
   - Los números van en letra: «cien euros», «seis por ciento».
   - Después, `cd videos && node scripts/voz.mjs <ID>`.
   - **Si falla** (sin clave o sin red): no hagas un vídeo mudo. Apunta el error exacto en «Nota del
     manager», deja la fila como estaba y pasa al siguiente.
3. **Composición** en `videos/src/videos/<ID>.tsx` con el kit (`src/kit.tsx`).
   - Toma como plantilla `src/videos/W47-02-v2.tsx`: lista `ESCENAS` con un `id` por escena de la voz,
     `Montaje` y `EXTRA_<ID>` para dar aire al wow, al CTA y al cierre.
   - Regístrala en `Root.tsx` con `defaultProps={{ videoId: "<ID>", voz: null }}` y
     `calculateMetadata={metadataConVoz(EXTRA_<ID>)}`. La duración la marca la voz.
   - Cada escena necesita **movimiento propio**: algo entra, crece, cuenta o cambia. Un texto quieto no es
     una escena.
   - Pon los efectos de sonido donde pasa algo (ver la tabla de `KIT.md`), sin saturar.
   - Si creas una pieza reutilizable, muévela a `kit.tsx` y documéntala en `KIT.md`.
4. **Música:** elige en `videos/public/musica/LICENCIAS.md` la pista que pegue con el tono del vídeo y
   pásala a `Montaje` con `pista=`. No uses dos veces seguidas la misma pista en la semana.
5. **Respeta el guion:** textos, cifras, hook, segundo gancho, wow, CTA y cierre. El hook se ve y se oye
   en el fotograma 0. No inventes cifras.
6. **Comprueba el código:** `cd videos && npx tsc --noEmit`.
7. **Renderiza** a `media/<semana>/<ID>.mp4` con los flags de CLAUDE.md.
8. **Miniatura:**
   `npx remotion still src/index.ts <ID> ../media/<semana>/<ID>.jpg --frame=<frame del hook>`, con los mismos
   flags de navegador.
9. **Control de calidad.**
   - **Sonido:** `ffprobe` debe mostrar una pista de audio. Mide el volumen con
     `ffmpeg -i <mp4> -af ebur128 -f null - 2>&1 | tail -12`: entre -16 y -12 LUFS integrados. Si no, ajusta
     `base` de la música o el volumen de la voz.
   - **Imagen:** saca 6 fotogramas con `remotion still` en `/tmp` (0, segundo 3, wow, rehook, CTA y cierre) y
     míralos.
     - El texto se lee y no se corta, y no pisa los subtítulos.
     - Zona segura libre: 220 px arriba, 420 px abajo, 120 px a la derecha y 90 px a la izquierda.
     - Buen contraste.
   - **Sentido:** se entiende sin sonido gracias a los subtítulos y coincide con el guion.
   - **Nota de viralidad** de 1 a 10: la media de hook, ritmo, momento wow, claridad, bucle y **acabado**
     (¿parece de un canal profesional?).
     - **Si es menor de 7**, corrige y vuelve a renderizar (2 vueltas como máximo).
     - Si sigue por debajo, apúntalo en «Nota del manager».
10. **Commit y push**, para que exista la URL pública.
11. **Actualiza la fila en Notion:**
    - Estado = `Tu revisión`;
    - «Enlace vídeo» = la URL de raw.githubusercontent;
    - «Nota viralidad»;
    - añade al principio de la página el vídeo incrustado (bloque de vídeo con esa URL) y una línea con las
      técnicas de `TECNICAS.md` que has usado.

## Reglas

- **Paquetes:** solo los de la familia `@remotion/*` de la misma versión que ya hay. Nada más.
- Sin música, imágenes ni sonidos con copyright: solo los de `public/` y los que generes por código.
- **Si un vídeo falla 3 veces**, apúntalo en «Nota del manager» y sigue con el siguiente.
