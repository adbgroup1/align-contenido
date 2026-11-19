---
name: align-distribucion
description: Agente 7 de ALIGN. Recoge las decisiones de Andrés en Notion; programa en Metricool los vídeos aprobados, rehace los que tienen cambios y descarta lo rechazado.
---

# Agente 7 — Decisiones y distribución

Lee antes `CLAUDE.md`.

## AHORRO, primero

**Entrada:** filas de Vídeos con Estado = `Tu revisión` y «Tu decisión» rellena, o con Estado = `Aprobado`
(incluida la reserva, que se programa en cuanto queda un hueco libre).

Si no hay ninguna, responde «Sin decisiones nuevas» y termina. Si solo hay reserva y no queda ningún hueco libre
en los próximos 14 días, responde «Reserva: N vídeos, sin huecos libres» y termina.

### Filas en `Aprobado` sin «Tu decisión» = Aprobar: no programes, avisa

Pasó el 16 y el 17 nov. W47-02, 03 y 04 estaban en `Aprobado` con «Tu decisión» vacía, así que no se
programaron, nadie avisó a Andrés y se perdió la publicación del martes 17.

- **No las programes.** Solo vale «Tu decisión» = `Aprobar`.
- **Esa misma noche**, manda **un** correo a Andrés (regla «Avisar a Andrés» de `CLAUDE.md`) con todas las
  filas afectadas:
  `ALIGN: <IDs> parecen aprobados pero falta «Tu decisión» = Aprobar`
  y, debajo, «Pon "Aprobar" en la columna "Tu decisión" de Notion y los programo esta noche o mañana a las
  21:00», con el enlace a cada fila.
- En la «Nota del manager» de cada fila, escribe: «Sin programar: falta "Tu decisión" = Aprobar (avisado el
  <fecha>)».
- **Si ya lo avisaste un día anterior** (la nota lo dice), no repitas el correo. El parte diario lo recordará.

## Según la decisión

### «Descartar»

Estado = `Descartado`.

### «Cambios»

1. Lee «Tus comentarios».
2. Corrige el guion dentro de la página (skill `align-guion`).
3. Vuelve a renderizar (skill `align-produccion`).
4. Vacía «Tu decisión».
5. Pon Estado = `Tu revisión`.
6. En «Nota del manager», escribe qué has cambiado.

### «Aprobar»

Andrés diseñó el sistema así: **su aprobación en Notion es la orden de publicar.**

1. Pon Estado = `Aprobado`.
2. Programa cada vídeo aprobado como se explica abajo.

## Programar en Metricool

### 1. Comprueba el límite

- Con `getScheduledPosts`, cuenta las publicaciones del mes.
- **Plan gratis: 20 publicaciones al mes.** Cada red cuenta como una publicación.
- Si el vídeo no cabe en todas las redes:
  - prioriza Instagram > YouTube > TikTok;
  - apúntalo en «Nota del manager».

### 2. Elige el hueco

- **Huecos:** martes y viernes (2 vídeos por semana).
- **Hora:** la que dé `getBestTimeToPostByNetwork`, o 19:30 si no hay datos.
- **No pongas dos vídeos el mismo día.**
- **Se producen 5 por semana y se publican 2, así que se acumula una reserva** (`GUIA.md`, «Cadencia»):
  - programa solo en los huecos libres de los **próximos 14 días**;
  - lo que no quepa se queda en `Aprobado`, sin programar: es la **reserva**. En su «Nota del manager» escribe
    «En reserva desde <fecha>» (una vez). No es un error ni hay que avisar;
  - **cada noche, aunque no haya decisiones nuevas, rellena los huecos libres con la reserva**;
  - **orden:** primero los que tienen fecha límite (en el guion o en la nota; por ejemplo Black Friday antes del
    27 nov), después el más antiguo por ID. Si los dos siguientes de la cola tienen el mismo formato (empieza el
    «Patrón»), adelanta uno de otro formato;
  - un vídeo de fecha (Black Friday, Navidad, la renta) que ya no llega a tiempo **no se publica fuera de fecha**:
    déjalo en reserva con la nota «Fuera de fecha» y avísalo en el resumen.

### 3. Crea la publicación

Usa `createScheduledPost`:
- `blogId` = `5900765`;
- `autoPublish` = true;
- `media` = [la URL pública del MP4];
- `providers`: solo las redes **que la marca tenga conectadas** según `getBrandSettings`;
- `text` = el caption de la página;
- `firstCommentText`: la pregunta del vídeo, sin enlaces (ver «Objetivo y CTA» en `GUIA.md`);
- `instagramData`: `{"type":"REEL","showReelOnFeed":true}`.
  - Si la herramienta admite **Reel de prueba** («trial reel»), úsalo mientras Aprendizajes no diga que el
    formato ya funciona.
  - Si admite **etiqueta de contenido hecho con IA**, actívala.
- `youtubeData`: `{"type":"short","title":"<título YouTube>","madeForKids":false,"privacy":"public"}`;
- `tiktokData`: `{"title":"<título>"}`.

### 4. Actualiza Notion

- Estado = `Programado`;
- «Fecha de subida»;
- «Plataformas» = las redes donde se ha programado;
- «Metricool» = el `plannerUrl`.

**Hazlo en síncrono y compruébalo** (fallo del 18 nov: Notion aceptó el cambio en segundo plano y a la mañana
siguiente las filas seguían en `Aprobado`, así que el parte dio una alarma falsa):

- Llama a `notion-update-page` con `"allow_async": false`.
- Al terminar todas las filas, vuelve a consultarlas con **una** consulta SQL (`Estado`, `Metricool`).
- Si alguna no sale en `Programado` con su enlace, repite su actualización una vez y vuelve a consultar.
- Si sigue sin salir, escribe en su «Nota del manager»: «Programado en Metricool el <fecha> <hora>, pero Notion
  no guardó el estado». Dilo también en el resumen final.

## Si una red no está conectada en Metricool

Prográmalo en las que sí lo estén y apúntalo en «Nota del manager». El parte diario del manager se lo dirá a
Andrés.
