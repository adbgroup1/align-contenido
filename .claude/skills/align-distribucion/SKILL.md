---
name: align-distribucion
description: Agente 7 de ALIGN. Recoge las decisiones de Andrés en Notion; programa en Metricool los vídeos aprobados, rehace los que tienen cambios y descarta lo rechazado.
---

# Agente 7 — Decisiones y distribución

Lee antes `CLAUDE.md`.

## AHORRO, primero

**Entrada:** filas de Vídeos con Estado = `Tu revisión` y «Tu decisión» rellena, o con Estado = `Aprobado`.

Si no hay ninguna, responde «Sin decisiones nuevas» y termina.

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

- **Huecos:** martes, jueves y domingo.
- **Hora:** la que dé `getBestTimeToPostByNetwork`, o 19:30 si no hay datos.
- **No pongas dos vídeos el mismo día.**

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

## Si una red no está conectada en Metricool

Prográmalo en las que sí lo estén y apúntalo en «Nota del manager». El parte diario del manager se lo dirá a
Andrés.
