# Guía de ALIGN — la leen TODOS los agentes antes de trabajar

*v4 · 27 nov 2026 · replanteamiento: comedia de verdad, voz mexicana de verdad y ningún vídeo igual a otro*

## v4 · Lo que cambia el 27 nov (manda sobre todo lo de abajo que lo contradiga)

Andrés revisó los vídeos de W49 y su veredicto fue claro: **«todos iguales», voces que «no suenan nada mexicano, no
usan ni jerga ni acento», solo «pesos y casos en México», «solo vídeos explicativos», humor e índices de viralidad
«lamentables» y «siempre la misma pantalla de CTA»**. «ESTO TIENE QUE FUNCIONAR.» El diagnóstico (en la pantalla se
ve): los 20 últimos vídeos eran el mismo vídeo con otro tema (rótulo blanco arriba, muñeco blob en el centro,
subtítulo en mayúsculas abajo, tarjeta blanca «MÁNDASELO» al final, voz de narrador neutro y música lo-fi).

### 1 · Primero comedia, después finanzas

- **El vídeo es un sketch, una historia o un chiste sobre la vida adulta y el dinero en México.** El dato o la
  lección van de **remate o giro**, nunca de premisa. Prueba: si quitas la lección, ¿el vídeo sigue teniendo gracia?
  Si no, no está listo. (Investigación: `investigacion/MEXICO-VIRAL.md`, A1–A15.)
- **Lo explicativo puro (narrador que cuenta un concepto) es la excepción**, como mucho 1 de cada 7.
- **Personajes de serie con voz propia** (`MEXICO-VIRAL.md`, C): la Mamá, la Tía Chuy, el Primo Charly (el que pide
  prestado), la Abuelita, el Godín y los objetos con cara (la Tarjeta, el Aguinaldo, el Cochinito, la Quincena:
  `videos/src/estilos/objetos.tsx`). Siempre con el mismo diseño, nombre y voz para que la gente los reconozca y siga
  la serie.
- **Dos o tres risas por vídeo, no una.** El guionista escribe 3 remates posibles para el final y el manager elige el
  mejor (ver `align-guion` y `align-manager`).

### 2 · Voz mexicana de verdad

- **Las voces de narrador corporativo se acabaron.** `scripts/casting-voces.mjs` busca voces mexicanas jóvenes y
  coloquiales, diseña voces a medida (chilango, chilanga, mamá, abuelita, compa) y **Gemini escucha cada muestra y
  puntúa el acento**: entran solo las que pasan de 7 en acento. Ranking en `media/pruebas/casting/RANKING.md`.
- **Modelo `eleven_v3`** con etiquetas de actuación (`[laughs]`, `[sarcastic]`, `[sighs]`, `[whispers]`,
  `[excited]`, `[mischievously]`…): una o dos por frase, donde haya actuación. No salen en los subtítulos.
- **Varias voces por vídeo:** cada escena puede llevar `"personaje"` y el guion su `"reparto"` (ver `KIT.md`).
- **El acento lo pone la voz; la gracia, el texto.** Los guiones se escriben como habla un chilango de 25 años:
  «no manches», «neta», «ando bien bruja», «ya cayó la quincena», «nomás tantito», «está cañón», «me late», «qué oso»,
  «un buen de lana», «el viernes sin falta, carnal»… **De 2 a 4 expresiones por vídeo, en boca de los personajes**,
  nunca un diccionario forzado (`MEXICO-VIRAL.md`, D y F).

### 3 · Ningún vídeo igual al anterior (se comprueba con un script, no con buena voluntad)

- **Cada vídeo declara su ESTILO** (la piel: `chat`, `notas`, `banco`, `ticket`, `noticiero`, `telenovela`, `meme`,
  `cinetica`, `libreta`, `rpg`, `split`, `buscador`, `documental`, `ranking`, `grafica`, `collage`, `blob`…) y su
  **CIERRE** (`remate`, `bucle`, `personaje`, `pregunta`, `comentario`, `serie`, `silencio`, `guardar` o `tarjeta`).
  Catálogo y diseño de cada uno: `investigacion/ESTILOS.md`. Piezas ya hechas: `videos/src/estilos/` (manual en
  `KIT.md`, «Estilos»). **Si un guion pide un estilo que aún no existe, Producción lo construye** con la ficha de
  `ESTILOS.md` y lo añade a la biblioteca.
- **`node scripts/variedad.mjs <ID> --estilo … --cierre … --pista … --tema …`** (en `videos/`) lo comprueba antes de
  renderizar. Si sale con error, **se cambia el vídeo, no la regla**. Reglas: el estilo no se repite en los 2
  anteriores ni más de 2 veces en 7; el cierre no se repite seguido; la tarjeta de CTA, como mucho 2 de cada 7; la
  pista no se repite en los 2 anteriores; de cada 10, al menos 3 de tema general.
- **El muñeco blob y la tarjeta «MÁNDASELO» pasan a ser un estilo y un cierre más**, no la plantilla.

### 4 · El CTA solo cuando suma

- **Sin tarjeta final por defecto.** Lo normal es cerrar con el remate, un bucle, un personaje que lo pide dentro de la
  historia («mándaselo a tu primo, que ya sé que te debe») o un comentario fijado. **Sin CTA** en: vídeos de menos de
  15 s, finales que son un chiste, estilos que parecen un pantallazo real (chat, notas, banco) y cuando el vídeo
  anterior ya lo pedía.
- **Lo único obligatorio al final** es el aviso legal pequeño: `<Aviso />` de `estilos/cierres.tsx`.

### 5 · Público: México en el centro, pero no solo México

- **Unos 7 de cada 10 vídeos, para México** (todo lo de «Para quién: México»).
- **Unos 3 de cada 10, de tema general** para cualquier hispanohablante: la misma voz mexicana, pero situaciones que
  entiende todo el mundo (la tarjeta, los antojos, el amigo que no paga, las suscripciones) sin referencias que solo
  pillan en México (nada de Afore, Buen Fin ni tandas ahí). Se marca `--tema general` en el control de variedad y en
  el Patrón. Sirve para crecer fuera de México y para comparar (hipótesis H-tema).

### 6 · Investigación de comedia, no solo de finanzas

- La investigación nocturna estudia **también creadores de comedia mexicana sin finanzas** (vida adulta, familia,
  oficina, sketches animados, frutinovelas, doblajes): de ahí salen las estructuras de humor. Al menos 5 de las 15
  fichas de cada noche son de comedia (ver `align-investigacion`).
- Cada ficha apunta **el mecanismo del chiste** (identificación, exageración, personaje tipo, giro, lógica absurda,
  remate visual) además del gancho y el formato.


## La misión (Andrés, 24 nov 2026)

**Ser muy virales lo antes posible.** Trabaja como si te fuera la vida en ello. Se acabaron las reglas de oro:
**pura libertad para probar todos los formatos, todos los tipos de reel y también carruseles**, sacar datos reales
y mejorar de verdad con ellos.

- **Un vídeo (o carrusel) al día.** Cada publicación es un experimento con su hipótesis (ver «El bucle de
  viralidad»).
- **Lo que manda son los datos**, no esta guía. Si los datos dicen que algo de aquí abajo no funciona, se cambia.
- **Lo único fijo son los límites legales** (más abajo). Todo lo demás son pistas y puntos de partida.
- **Decidid vosotros con datos** (Andrés, 24 nov: «en este tipo de decisiones es donde quiero que mejoremos»).
  Voz, formato, hora, duración, música, estilo, CTA: no se le pregunta a Andrés. Se prueban varias opciones como
  experimento y gana la que digan las cifras. A Andrés solo le llega lo que es suyo: aprobar vídeos, pagar,
  claves y cuentas, e imágenes de ChatGPT.

## Para quién: México

**Público: hispanohablantes de México, de 22 a 40 años, sin formación financiera.** Cobran por quincena, el dinero
se les va en la tarjeta y los meses sin intereses, no saben por dónde empezar y desconfían de los «gurús».

Son consideraciones para el embudo, no reglas de oro:

- **Todo localizado a fondo en México:**
  - pesos mexicanos («cinco mil pesos», `$5,000 MXN`);
  - vocabulario de allí: quincena, aguinaldo, Afore, meses sin intereses, tandas, Buen Fin, SAT, lana, chamba;
  - situaciones de allí: el Oxxo, la tanda de la oficina, la tarjeta departamental, el aguinaldo que dura una
    semana, la renta en CDMX, el «ahorita lo hago».
- **Datos mexicanos con fuente:** INEGI (ENIF, ENIGH), Banxico, CONDUSEF, CONSAR y CNBV.
- **Humor mexicano:** el albur suave y la ironía cotidiana, los memes que todos entienden, la familia, la quincena
  que se acaba el día 3. **Nunca** estereotipos ni burlas de regiones, clases o colectivos.
- **Voz con acento mexicano** (ver «Voz, música y sonido»). Los textos y la voz se escriben en español de México,
  no de España: «ustedes» y no «vosotros», «celular» y no «móvil», «carro» y no «coche».
- **Hacia dónde va el embudo:** al curso de finanzas. Los temas y la audiencia que construimos tienen que ser los
  de alguien que mañana querría ese curso: organizar la quincena, salir de deudas, el colchón y empezar a
  invertir. **De momento el curso y la landing no se mencionan en el contenido:** el embudo todavía no está
  completo y Andrés lo lleva por separado. No toques nada de eso.
- **Horario:** **13:30 de Ciudad de México = 20:30 de España** (Andrés, 24 nov: una hora buena en los dos países: la
  comida allí y la tarde-noche aquí). Se programa en `America/Mexico_City`. Si Resultados encuentra una hora mejor
  con datos, se cambia.

## Marca

- **ALIGN by ADB.** Idea de marca: *no necesitas saber de finanzas para empezar, solo el sistema correcto*.
- **Tono de partida:** un amigo que sabe del tema, no un banco ni un vendedor. Se puede probar otro si los datos
  lo piden.
- **Identidad visual de partida:** colores y tipografía de `videos/src/brand.ts`. Se pueden probar otros estilos
  si un experimento lo pide; apúntalo en la hipótesis.
- **Instagram @align_finanzas** y **YouTube @ALIGNbyADB**. TikTok @align_finanzas está conectado, pero **no se
  publica ahí hasta que Andrés lo active**.

## Límites legales (lo único que no se toca)

No son reglas de viralidad: protegen a ALIGN de problemas legales y de perder credibilidad.

1. **Educativo y genérico:** nunca «compra X», «este fondo es el mejor» ni nombres de productos como
   recomendación. Se pueden nombrar instrumentos como concepto (Afore, CETES, un fondo indexado) para explicar qué
   son, nunca para decir que se compren.
2. **Nada de promesas:** ni «hazte rico», ni «rentabilidad garantizada», ni «sin riesgo».
3. **Las rentabilidades, como ejemplo hipotético** y con «Ejemplo hipotético» en pantalla mientras sale la cifra.
   Que sean realistas.
4. **Datos reales con fuente.** Cada cifra lleva la suya entre corchetes al final del guion. Sin fuente, no hay
   dato. Nada inventado ni exagerado.
5. **«Contenido informativo, no es asesoramiento financiero»**, en pantalla al final y en el caption.
6. **Criptomonedas:** solo como concepto o para advertir del riesgo.
7. **No copiar:** de otros creadores se toman estructuras y técnicas, nunca frases, guiones, imágenes ni música.
   Sin música, imágenes ni clips con copyright: solo lo que hay en `videos/public/` o lo generado.
8. **Sin hablar mal de nadie** (ni bancos ni «gurús» con nombre) y nada de personas reconocibles.
9. **No se vende en el contenido:** ni curso, ni llamada, ni enlaces, mientras Andrés no diga otra cosa.

## El bucle de viralidad (lo hacen todos los agentes)

El tablero del bucle es **`investigacion/EXPERIMENTOS.md`**. Lo leen todos y cada agente escribe su parte:

1. **Hipótesis** (Investigación, Ideas y manager): «Si hacemos X, ganamos más Y», con una ficha o un dato detrás.
   Por ejemplo: «Un carrusel "construye desde cero" consigue más guardados que el mismo tema en reel».
2. **Prueba** (Guion, Producción y Decisiones): cada publicación lleva su hipótesis en «Nota del manager» y en el
   tablero.
3. **Medida** (Resultados, cada día): vistas, retención, compartidos, guardados, comentarios y seguidores ganados,
   a las 24 h, a los 3 días y a los 7 días.
4. **Veredicto** (Resultados): **ESCALAR** (se repite con variaciones esa misma semana), **REPETIR** (sin datos
   suficientes, otra prueba) o **MATAR** (se deja de hacer).
5. **Siguiente ronda:** lo que ESCALA se dobla, lo que MUERE se deja y siempre se abren hipótesis nuevas.

**Reparto orientativo de cada semana** (no es una cuota: lo cambia Resultados según los datos):
- **la mitad, explotar:** variaciones de lo que mejor ha ido (en nuestro perfil o en los virales investigados);
- **la mitad, explorar:** formatos, tonos, duraciones, voces, estilos visuales o temas que no hayamos probado.

**Mientras no haya datos propios, cada vídeo prueba algo distinto.** La prioridad es aprender rápido.

## Qué se puede probar (todo vale)

Lista de ideas, no de límites. Si los virales enseñan algo que no está aquí, se prueba.

- **Reels y Shorts de cualquier formato:**
  - construye desde cero;
  - fábula o historia con personajes;
  - qué pasaría si;
  - contador;
  - A/B en pantalla partida;
  - lista o ranking;
  - mito contra realidad;
  - POV;
  - «cosas que nadie te dice»;
  - reacción a un dato;
  - pregunta en la calle animada;
  - tutorial paso a paso;
  - serie con partes;
  - meme animado;
  - sketch con personajes;
  - quiz;
  - ASMR de dinero;
  - el que sea.
- **Carruseles de Instagram** (de 5 a 10 imágenes de 1080×1350): guías que se guardan, «construye desde cero»
  en láminas, listas, mitos y comparativas. Solo van a Instagram (YouTube no los admite).
- **Duración libre.** Lo de partida es 15–30 s, porque lo corto retiene, pero se prueban de 7 s, de 45 s o de 60
  s si hay una hipótesis.
- **Gancho, ritmo, humor, CTA, música, voz y estilo visual:** todo se puede variar y medir.

## Lo que sabemos hoy (punto de partida, no reglas)

Son lecciones de la investigación y de Andrés. Úsalas mientras no haya datos que digan otra cosa.

- **Gancho:** los 3 primeros segundos deciden. Empezar en mitad de la acción, con lo que se ve y lo que se lee
  diciendo lo mismo desde el fotograma 0.
- **Ritmo:** algo cambia en pantalla cada 2–3 s. Un momento «wow». Cierre en bucle si se puede.
- **Andrés, 19 nov:** «nuestros vídeos son muy largos y aburren; necesitamos bromas y mejor storytelling» y «no
  quiero que sea todo igual».
- **«Construye desde cero»** es el favorito de Andrés: un objeto que se monta pieza a pieza en un plano fijo, con
  una frase por pieza. Lo de partida: de 4 a 6 piezas y de 15 a 25 s. Viene de un reel de anatomía muy viral (127.000
  me gusta y 19.600 envíos).
- **Lo que retiene en los virales investigados** está en `investigacion/TECNICAS.md`: Lista, A/B e Historia son
  los que más vistas tienen.
- **Storytelling:** el conflicto, en la primera frase. Encadenar con «pero» y «así que», preferir el detalle
  concreto y quitar lo que sobre.
- **Humor:** que la broma se vea en la animación. Exageración, objetos con actitud, «lo que todos hemos hecho» y
  lo literal visual. Nunca reírse de quien tiene poco dinero.
- **Subtítulos grandes**, porque la mayoría lo ve sin sonido.
- **CTA de crecimiento (v4: solo cuando suma, ver «v4 · 4»):** compartir («mándaselo a…»), guardar, comentar (una
  pregunta) o seguir. Que sea concreto: nada de «dale like». Mejor dicho por un personaje que en una tarjeta.
- **Zona segura (1080×1920):** que no quede nada importante en los 220 px de arriba, los 420 px de abajo ni los
  120 px de la derecha.
- **Imagen o dibujo:** `IMAGEN:` es una foto fija de ChatGPT (la hace Andrés en el Mac) y `DIBUJO:` es una
  ilustración en código. Lo que se mueve, mejor dibujado. Cómo se hace: `videos/KIT.md`.

## Voz, música y sonido

- **Voz (v4, 27 nov):** ElevenLabs, modelo `eleven_v3`, voces elegidas por `scripts/casting-voces.mjs` (Gemini
  puntúa el acento) y **personajes con voz propia** (`voces.json`, «personajes»). Lo de abajo sigue valiendo para la
  rotación del narrador. La voz principal está en `videos/voces.json` (`principal`).
  - **La voz la deciden los datos, no Andrés (24 nov: «decide tú»).** Mientras no haya ganadora, `voz.mjs`
    reparte los vídeos entre las 4 voces de `rotacion` (Regina, Alejandro, Marlene y Enrique; muestras en
    `media/pruebas/voces-mx/LISTA.md`) y apunta cada una en `asignadas`. Es la hipótesis H6.
  - **Resultados elige la ganadora** cuando cada voz tenga al menos 3 vídeos medidos: la que más % pasa de 3 s y
    más tiempo visto, con 15 % de ventaja o más, pasa a `principal` con `"ganadora": true`. Si ninguna gana, quita
    la peor de `rotacion` y prueba otra (las descartadas o nuevas con `scripts/probar-voces.mjs`).
  - Un guion puede forzar otra voz con `"voz": "<voice_id>"` en su `guion.json`, si la hipótesis lo pide.
- **Música:** pistas con licencia de `videos/public/musica/LICENCIAS.md`. Se pueden probar otros tonos.
- **Efectos:** `videos/public/sfx/`. La voz se entiende siempre. La mezcla, entre -16 y -12 LUFS.

## Cadencia y Metricool

- **1 publicación al día, todos los días** (decidido por Andrés el 24 nov 2026). Puede ser un reel o un carrusel.
- **Se produce más de lo que se publica:** unos 10 por semana (2 tandas de 5), para tener reserva y poder elegir. Lo aprobado que no
  cabe queda en `Aprobado` (reserva).
- **Plan gratis de Metricool: 20 publicaciones al mes** (cada red cuenta una). Con publicación diaria en 2 redes se
  acaba en unos 10 días. **Andrés: «cuando se nos acaben, lo pagaremos».**
  - Decisiones publica hasta el límite.
  - Cuando lo alcance, manda **un** correo a Andrés («Metricool al límite: hay que pagar el plan para seguir con
    1 al día») y deja lo que falte en reserva.
  - Cuando Andrés pague, el límite lo dice Metricool (si `getBrandSettings` o la herramienta lo dan) o un mensaje
    suyo en el buzón.
- **Si hay que elegir red con el plan al límite:** Instagram, después YouTube.

## Qué no hacer

- No hablar de Skool ni de comunidades de pago.
- No nombrar a Atlas.
- No tocar la landing ni el embudo del curso: los lleva Andrés.
