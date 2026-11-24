---
name: align-distribucion
description: Agente 7 de ALIGN. Recoge las decisiones de Andrés en Notion y mantiene 1 publicación al día (reel o carrusel) programada en Metricool en hora de México para los próximos 4 días; rehace lo que tiene cambios, descarta lo rechazado y avisa cuando el plan de Metricool se acaba.
---

# Agente 7 — Decisiones y distribución

Lee antes `CLAUDE.md`.

## AHORRO, primero

**Entrada:** filas de Vídeos con Estado = `Tu revisión` y «Tu decisión» rellena, o con Estado = `Aprobado`
(incluida la reserva, que se programa en cuanto queda un hueco libre).

Si no hay ninguna, responde «Sin decisiones nuevas» y termina. Si solo hay reserva y no queda ningún día libre en
los próximos 4, responde «Reserva: N, sin días libres» y termina.

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

**Objetivo: 1 publicación cada día, sin huecos** (Andrés, 24 nov 2026). Puede ser un reel o un carrusel.

### 1. Comprueba el límite del plan

- Con `getScheduledPosts`, cuenta las publicaciones del mes (las publicadas más las programadas). Cada red cuenta
  como una.
- **Límite: 20 al mes** (plan gratis), salvo que Andrés haya pagado: lo sabrás porque Metricool deja programar más,
  o por un mensaje suyo en el buzón. Si al programar Metricool da un error de límite, ese es el límite real.
- **Cuando no quepa más este mes:**
  - si cabe en una red pero no en las dos, prográmalo solo en Instagram;
  - si no cabe nada, deja la reserva como está y **manda un correo a Andrés, solo la primera vez del mes**
    (apúntalo en `informes/metricool-limite.txt` con la fecha): «ALIGN: Metricool al límite (N/20 este mes).
    Paga el plan para seguir con 1 al día; la reserva tiene M publicaciones listas»;
  - el parte diario se lo recordará.

### 2. Elige el día y la hora

- **Un día = una publicación**, todos los días. **Programa solo los próximos 4 días** (hoy no cuenta si ya pasó la
  hora). Así, lo que ESCALA en el tablero puede entrar enseguida, en vez de esperar dos semanas.
- **Hora: 13:30 de Ciudad de México, que son las 20:30 de España** (Andrés, 24 nov: buena en los dos países). Pon
  `publicationDate.timezone` = `America/Mexico_City`. Solo se cambia si Resultados demuestra con datos que otra hora
  funciona mejor.
- **Orden para llenar los días:**
  1. lo que tiene fecha límite (aguinaldo, Navidad, la cuesta de enero…);
  2. **lo que prueba algo que ESCALA** en `investigacion/EXPERIMENTOS.md`;
  3. **lo hecho para México** (de W49-07 en adelante) antes que la reserva hecha para España;
  4. el más antiguo por ID.
  Si dos seguidos tienen la misma pieza y el mismo formato (el principio del «Patrón») y no se está escalando a
  propósito, adelanta uno distinto.
- **Lo que no cabe en los 4 días** se queda en `Aprobado`: es la **reserva**. Cada noche, aunque no haya decisiones
  nuevas, llena los días libres con ella.
- Un vídeo de fecha que ya no llega a tiempo **no se publica fuera de fecha**: déjalo con la nota «Fuera de fecha»
  y dilo en el resumen.
- **Lo que ya estaba programado** antes de este cambio se respeta: no lo muevas.

### 3. Crea la publicación

Usa `createScheduledPost`, con:
- `blogId` = `5900765` y `autoPublish` = true;
- `providers`: las redes que la marca tenga conectadas según `getBrandSettings`, **menos TikTok**, que está
  conectado pero no se publica hasta que Andrés lo active con una regla nueva en `GUIA.md`;
- `text` = el caption de la página y `firstCommentText` = la pregunta del vídeo, sin enlaces.

**Si es un reel:**
- `media` = [la URL pública del MP4];
- `instagramData`: `{"type":"REEL","showReelOnFeed":true,"isAiGenerated":true}`. **Si es EXPLORAR** (Tipo de idea
  = Experimento), usa `"type":"TRIAL_REEL"`: se enseña primero a quien no nos sigue, que es justo lo que queremos
  medir. Apúntalo en la «Nota del manager» para que Resultados lo sepa;
- `youtubeData`: `{"type":"short","title":"<título YouTube>","madeForKids":false,"privacy":"public","isAiGeneratedContent":true}`.

**Si es un carrusel:**
- `media` = [las URLs públicas de `media/<semana>/<ID>/01.jpg`, `02.jpg`… en orden];
- `providers` = solo Instagram (YouTube no admite carruseles);
- `instagramData`: `{"type":"POST","isAiGenerated":true}`.

**Apunta en `investigacion/EXPERIMENTOS.md`**, en la fila de su hipótesis, el ID y la fecha de publicación.

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
