# ESTILOS.md — catálogo de estilos visuales de ALIGN

*27 nov 2026 · Lo escribió Claude, como director de arte, a petición de Andrés: «todos los vídeos se ven iguales».*

## Por qué existe este archivo

Hoy todos los reels comparten la misma maqueta:

- fondo oscuro;
- píldora blanca de rótulo arriba;
- un blob con ojos en el centro;
- subtítulo grande en mayúsculas abajo;
- tarjeta final blanca con «MÁNDASELO» y «Síguenos para más».

**Cambiar el tema no basta: el que hace scroll reconoce la maqueta antes que el tema.** Lo que se reconoce en el
primer fotograma es la composición, la paleta y la letra.

Este catálogo da **14 estilos que se distinguen en el fotograma 0**. Cada uno tiene su composición, su paleta, su
tipografía, su forma de poner el texto y su cierre.

`formato` (en `TECNICAS.md`) y `estilo` (aquí) son ejes distintos:

- **El formato es la estructura narrativa:** Lista, A/B, Historia, Fábula, Contador, Construye desde cero…
- **El estilo es la piel.** Una Historia puede ir en `chat`, en `noticiero` o en `pizarra`.

**Cómo se usa (propuesta para `GUIA.md`, no son reglas de oro sino «lo que sabemos hoy»):**

- El guion declara `ESTILO: <id>` en la cabecera.
- No se repite el mismo estilo dos días seguidos.
- En 7 días deben salir al menos 5 estilos distintos.
- Cada estilo nuevo entra en `EXPERIMENTOS.md` como hipótesis («H-estilo-chat: retiene más que la mediana a 3 s»),
  y Resultados decide ESCALAR, REPETIR o MATAR igual que con todo lo demás.
- La maqueta actual pasa a llamarse **`blob`**. Es un estilo más del catálogo, no el de por defecto.

### Lo que dice la investigación (y cuánto fiarse)

Casi todo lo publicado sobre formatos virales sin cara son blogs de herramientas de vídeo. **Sirven para ver
patrones, no como pruebas.** Lo poco sólido es esto:

1. **Los envíos por alcance son una de las 3 señales principales en Instagram.** Las otras dos son el tiempo visto
   y los likes. Pesan más para llegar a quien no te sigue. Lo ha dicho Mosseri varias veces (2024–2025).
   - Consecuencia de diseño: un estilo que «parece algo que se reenvía» (un chat, una nota, un ticket o un pantallazo)
     tiene ventaja de partida.
2. **En YouTube, desde el 31 mar 2025, cada repetición de un Short cuenta como vista.**
   - Consecuencia: los cierres en bucle tienen premio medible.
3. **Mucha gente ve los vídeos sin sonido.** No hay un estudio primario fiable, pero todas las fuentes coinciden.
   - Consecuencia: todo estilo tiene que entenderse en silencio.
   - Los estilos que muestran el texto como parte de la interfaz (chat, notas, ticket o buscador) no necesitan
     subtítulo.
4. **Revelar las cosas poco a poco retiene y se recuerda mejor que enseñarlas terminadas.**
   - Hay un estudio revisado por pares de 2025, con 521 adultos: la pizarra animada superó a las diapositivas, al
     texto y al audio.
   - Otro de 2023: dibujar progresivamente supera a mostrar el dibujo acabado.
   - Consecuencia: en todos los estilos, la información **aparece pieza a pieza** (mensaje a mensaje, línea a
     línea, trazo a trazo o barra a barra).
5. **Pantalla partida:** se defiende como «recuperar la atención» con un segundo estímulo.
   - El único estudio citado no encontró mejora en lo que se recuerda.
   - Avisa de que un fondo frenético con una historia lenta empeora la retención.
   - Úsala con historias rápidas.
6. **Los rankings y las tier lists se comentan porque se discuten.** Una lista con la que todos están de acuerdo no
   genera comentarios: tiene que haber al menos una posición discutible.
7. **El CTA genérico al final no tiene pruebas a favor.** Varias fuentes señalan que mandar al espectador fuera del
   vídeo («mira el vídeo completo») hunde la retención final.
   - Los canales grandes de formato corto casi no usan CTA o los hacen muy sutiles.
   - El propio dato de ALIGN coincide: tres semanas con 0 guardados y 1 compartido pese a la tarjeta de «MÁNDASELO».

---

## Lo común a los 14 estilos

### Lienzo y zona segura (1080×1920)

```
y=0     ┌──────────────────────────────┐
        │  NADA IMPORTANTE (220 px)    │  ← barra de estado, nombre de la cuenta
y=220   ├──────────────────────────────┤
        │                              │
        │  CONTENIDO  x: 90 → 960      │  ← 120 px a la derecha: botones de like/compartir
        │                              │
y=1500  ├──────────────────────────────┤
        │  NADA IMPORTANTE (420 px)    │  ← pie del post, música, barra de progreso
y=1920  └──────────────────────────────┘
```

- **Sí** se puede pintar fondo y decorado en las zonas prohibidas. Usar toda la pantalla vertical hace que el reel
  no parezca un cuadrado con bandas.
- **No** se puede poner texto que haya que leer, caras ni la cifra clave en esas zonas.
- `SAFE` de `brand.ts` sigue mandando: `top 220, bottom 420, left 90, right 120`.

### Lo legal, en cada estilo

Lo único fijo (ver «Workflow v3»):

- sin promesas;
- sin recomendar productos;
- las rentabilidades, marcadas como **hipotéticas**;
- datos reales con fuente;
- no se copia;
- no se vende.

La línea **«Contenido informativo, no es asesoramiento financiero»** va **dentro del lenguaje del estilo**, no como
pegote. En cada ficha pone dónde:

- en `chat`, como mensaje del sistema;
- en `ticket`, como letra pequeña;
- en `noticiero`, en el rótulo inferior.

Lo mismo para la etiqueta «Ejemplo hipotético · X % anual» y la fuente del dato.

### Marcas y parodias

- **Nunca se imita una marca real:**
  - ni el verde de un mensajero concreto;
  - ni el logo de un buscador;
  - ni el de un banco;
  - ni el de un videojuego;
  - ni el de un foro.
- Se diseña una **interfaz genérica reconocible por su estructura** (burbujas, barra de búsqueda, saldo grande). Los
  nombres son inventados: «Banco Quincena», «Buscador», «Foro».
- **Nada de imágenes de memes ni de partidas grabadas de juegos de terceros:** tienen copyright.
  - Las «reacciones» las hacen nuestros personajes.
  - El «gameplay» se genera en código.

### Componentes que se comparten

Cada estilo vive en `videos/src/estilos/<id>/` y exporta un `<Estilo…>` que recibe el `guion.json` ya parseado. Todos
usan estas piezas comunes, que hay que crear en `videos/src/estilos/comun/`:

| Pieza | Props | Para qué |
|---|---|---|
| `Lienzo` | `fondo: string \| ReactNode`, `grano?: number`, `vineta?: number` | Fondo a pantalla completa (1080×1920) con textura opcional |
| `ZonaSegura` | `children`, `debug?: boolean` | Igual que `Zona`; con `debug`, pinta las franjas prohibidas en rojo en Studio |
| `Revelar` | `en: number` (s), `modo: 'pop' \| 'escribir' \| 'trazo' \| 'deslizar' \| 'sello'`, `dur?: number` | La regla «pieza a pieza»: toda aparición pasa por aquí |
| `Maquina` | `texto`, `en`, `cps?: number` (caracteres por segundo), `cursor?: boolean`, `sonido?: 'teclado' \| null` | Texto que se escribe solo (chat, notas, buscador, ticket o RPG) |
| `Aviso` | `variante: 'sistema' \| 'letraPequena' \| 'rotulo' \| 'pie' \| 'nota'`, `texto?` | La línea legal, con la piel de cada estilo |
| `Fuente` | `texto`, `variante` | «Fuente: INEGI, ENIGH 2024» |
| `Hipotetico` | `tasa`, `variante` | La etiqueta de rentabilidad hipotética |
| `Cierre` | `tipo` (ver la sección de cierres), props según el tipo | Sustituye a `CtaCrecer` como pieza obligatoria |
| `Bucle` | `primerFrame: ReactNode`, `dur: number` | Funde los últimos `dur` segundos hacia una copia exacta del fotograma 0 |

El `Montaje` actual se queda y gana la prop `estilo`. Con ella elige:

- el componente de escena;
- las fuentes que carga;
- si hay subtítulos y de qué tipo (`subtitulos: 'karaoke' | 'interfaz' | 'ninguno' | 'rotulo' | 'mano'`);
- la mezcla de sonido (`mezcla: {musica, voz, sfx}`).

Fuentes: todas salen de `@remotion/google-fonts/<Nombre>`. Cada estilo carga **solo** las suyas.

---

## Los 14 estilos

Resumen para elegir rápido:

| id | Se reconoce por | Mejor para | Subtítulo | Cierre natural |
|---|---|---|---|---|
| `chat` | Burbujas de mensajería | Diálogos de pareja, amigos o familia sobre dinero; humor relatable | No (el texto es el chat) | Último mensaje como remate |
| `notas` | Hoja de notas del móvil | Listas, confesiones o un «presupuesto real» | No | Bucle o nota tachada |
| `banco` | Saldo enorme que baja | El drama de la quincena, fugas o suscripciones | Mínimo | Saldo final y silencio |
| `ticket` | Recibo térmico que se imprime | Lo que cuesta algo de verdad; gastos hormiga | No (el ticket habla) | El TOTAL |
| `noticiero` | Rótulo de ÚLTIMA HORA | Noticias reales (Banxico o INEGI) o noticias absurdas de tu vida | Rótulo inferior | Cambio a «deportes», como remate |
| `rpg` | Barras de vida y stats en pixel | Vida adulta como videojuego; decisiones | Caja de diálogo | Pantalla de GAME OVER o LEVEL UP |
| `split` | Historia arriba y loop hipnótico abajo | Historias largas de 30–45 s | Karaoke en el centro | Bucle |
| `buscador` | Barra que se autocompleta | «Lo que todos buscan a fin de mes» | No | Última búsqueda |
| `pizarra` | Mano que dibuja en blanco | Conceptos (interés compuesto o inflación) | Escrito a mano | Dibujo terminado más una flecha |
| `collage` | Recortes de papel y cinta | Opiniones fuertes o «cosas que nadie te dice» | Tiras de papel recortado | Sello de goma |
| `documental` | Mundo plano de formas geométricas y cámara que viaja | Explicar un sistema: la Afore, el SAT o los bancos | Discreto, minúscula | Plano que se aleja |
| `tipografia` | Solo letras a pantalla completa | Frases que pegan; ironía; 7–12 s | No (el texto es el vídeo) | Bucle con la primera palabra |
| `ranking` | Tabla S/A/B/C/D | Clasificar gastos, hábitos o apps genéricas | Mínimo | Última ficha polémica más una pregunta |
| `grafica` | Datos que se mueven sobre papel milimetrado | Comparar en el tiempo; datos reales | Etiquetas en la gráfica | La línea llega y se queda |

Debajo, cada ficha. Las medidas son en píxeles del lienzo de 1080×1920.

---

### 1. `chat` — conversación de mensajería

**Cuándo:**

- Diálogos donde el humor sale de la relación: la pareja que pregunta «¿cuánto llevas gastado?», el primo que pide
  prestado «hasta el lunes» o la mamá que manda un audio sobre el aguinaldo.
- Encaja con H9, H15 y H18.
- Cada mensaje nuevo abre una pregunta pequeña. Es retención incorporada.
- **El formato más «reenviable»:** parece un pantallazo.

**Composición:**

- **0–220:** barra de estado falsa (hora 13:30, batería al 12 %, que ya es un chiste) y cabecera del chat con avatar
  redondo dibujado y nombre («Primo Toño 🙃»). Va en la zona prohibida a propósito: es decorado.
- **220–1500:** hilo de mensajes. Los propios, a la derecha (x 330–960); los ajenos, a la izquierda (x 90–750).
  Cuando el hilo pasa de y=1400, todo sube con muelle, como en un móvil real.
- **1500–1920:** barra de escribir con el texto apareciendo letra a letra antes de enviar (el «está escribiendo…»).
  Decorado.

**Paleta** (genérica, no imita a ninguna app):

| Elemento | Color |
|---|---|
| Fondo | `#0E1621` con un patrón de doodles al 4 % |
| Burbuja propia | `#2B5278` |
| Burbuja ajena | `#182533` |
| Texto | `#E9EEF3` |
| Hora | `#7F91A4` |
| Resaltado de dinero | `#FBBF24` |

Variante clara para contraste: fondo `#EDE7DF`, burbujas `#FFFFFF` y `#D9F2FF`, texto `#111B21`.

**Tipografía:** Inter 500 (cuerpo de 44 px y hora de 26 px). Cabecera en Inter 700 a 40 px.

**Subtítulos:** ninguno.

- La voz en off, si hay, es de narrador («Mi primo me escribió esto…») o lee los mensajes con dos voces de
  `voces.json`.
- Mejor: **sin voz y con sonidos de mensaje**. El texto ya está en pantalla.

**Transiciones:**

- Sin cortes. El hilo crece.
- Para saltar en el tiempo, un separador de fecha centrado («HOY», «3 DÍAS DESPUÉS») que entra con `pop`.
- Golpe de cámara (zoom al 108 % sobre una burbuja) en el mensaje clave.

**Sonido:**

- `pop` grave para los mensajes recibidos y uno agudo (`bip`) para los enviados.
- Tecleo suave durante el «escribiendo…».
- Música muy baja o ninguna.
- En el remate, `plano` (el silencio incómodo) o `claxon`.

**Legal:** `Aviso variante="sistema"`, una burbuja centrada y gris que dice «Contenido informativo, no es
asesoramiento financiero». Sale al principio, como los avisos de cifrado, y se queda en el hilo.

**Cierre:**

- El último mensaje es el remate. Por ejemplo, el primo contesta «ok» y su estado pasa a «últ. vez hace 4 meses».
- CTA dentro de la historia, opcional: uno de los dos escribe «mándale esto a tu primo Toño».
- **Sin tarjeta final.**

**Componentes:**

```ts
<EstiloChat
  tema: 'oscuro' | 'claro'
  contacto: { nombre: string; avatar: ReactNode; estado?: string }
  bateria?: number              // 12 por defecto
  mensajes: Array<{
    de: 'yo' | 'otro' | 'sistema' | 'fecha'
    texto?: string               // admite **resalta** en dorado
    tipo?: 'texto' | 'audio' | 'imagen' | 'sticker' | 'borrado' | 'escribiendo'
    duracionAudio?: string       // «0:47»
    en: number                   // segundo en que aparece
    reaccion?: string            // emoji pegado a la burbuja
    leido?: boolean              // doble check
  }>
  zoomEn?: number[]              // golpes de cámara
/>
```

Subpiezas:

- `BarraEstado`;
- `CabeceraChat`;
- `Burbuja`, con cola, hora y checks;
- `Escribiendo`, tres puntos que laten;
- `BurbujaAudio`, con onda falsa y avance;
- `SeparadorFecha`;
- `BarraEscribir` (usa `Maquina`).

El desplazamiento del hilo se calcula midiendo la altura acumulada y aplicando un `spring` hacia `-(alto - 1180)`.

---

### 2. `notas` — app de notas del móvil

**Cuándo:**

- Una lista o una confesión en primera persona: «Mi presupuesto real de la quincena», «Cosas que dejé de comprar y no
  extraño», «Por qué no tengo ahorros (honesto)».
- Ideal para Lista y para H10 (ironía relatable).
- Se siente íntimo y crudo: lo contrario de un anuncio.

**Composición:**

- **0–220:** barra superior con «< Notas» y los iconos de compartir y más (decorado).
- **220–1500:** título de la nota en negrita, fecha gris debajo y líneas que se escriben solas.
  - Las cifras se alinean a la derecha (x 960).
  - Cuando una línea se tacha, el trazo cruza con un `rayon`.
  - Hay pequeños garabatos de marcador encima (círculos y flechas) que se dibujan con `trazo`.
- **1500–1920:** teclado del móvil a medio subir, gris (decorado). Da realismo y tapa la zona prohibida.

**Paleta:**

| Elemento | Color |
|---|---|
| Papel | `#FFFDF6` |
| Texto | `#1C1C1E` |
| Fecha | `#8E8E93` |
| Acento de la app y marcador | `#E0A800` |
| Tachado y círculo de alarma | `#FF3B30` |
| Visto bueno | `#34C759` |

Variante oscura: papel `#1C1C1E` y texto `#F2F2F7`.

**Tipografía:**

- Inter 700 para el título (64 px) y 500 para el cuerpo (46 px).
- Los garabatos encima llevan **Caveat** o **Kalam** a 54 px, en el color del marcador.

**Subtítulos:** ninguno.

- La voz lee la nota con tono de confesión. El texto en pantalla es el subtítulo.
- Si la voz dice algo que no está en la nota, sale como garabato a mano.

**Transiciones:**

- Ninguna: es una toma continua.
- Para pasar a otra nota, un deslizamiento lateral, como al cambiar de nota en la app.
- La cámara hace `push` lento continuo del 100 % al 106 %.

**Sonido:** tecleo, `rayon` al tachar y `ding` al llegar al total. Música lo-fi muy baja.

**Legal:** `Aviso variante="nota"`, última línea de la nota en gris y cursiva.

**Cierre:**

- **En bucle:** la nota vuelve a quedar vacía con el cursor parpadeando, como en el fotograma 0.
- O **remate:** la última línea dice «Ahorro: $0» y se tacha a sí misma para escribir «Ahorro: lo intenté».

**Componentes:**

```ts
<EstiloNotas
  tema: 'claro' | 'oscuro'
  titulo: string
  fecha: string                  // «27 de noviembre de 2026, 13:30»
  lineas: Array<{
    texto: string
    cifra?: string               // va alineada a la derecha
    en: number
    tachar?: number              // segundo en que se tacha
    check?: boolean              // casilla ☐ → ☑
    nivel?: 0 | 1                // sangría
  }>
  garabatos?: Array<{ tipo: 'circulo' | 'flecha' | 'subrayado' | 'texto'; objetivo: number /* índice de línea */; texto?: string; en: number }>
  teclado?: boolean
  bucle?: boolean
/>
```

Subpiezas:

- `CabeceraNotas`;
- `LineaNota` (usa `Maquina`);
- `Tachado`, un trazo SVG con `strokeDashoffset`;
- `Garabato`, un path SVG irregular hecho con jitter procedural;
- `TecladoFalso`, un PNG o SVG estático.

---

### 3. `banco` — app de banco con el saldo bajando

**Cuándo:**

- El drama de la quincena: llega el sueldo y en 9 segundos queda en $312.
- También para fugas (suscripciones o comisiones) y gastos hormiga en tiempo real.
- Encaja con H12, porque convierte «pagar el mínimo» en algo visible.
- La cifra grande que baja es tensión pura.

**Composición:**

- **0–220:** saludo «Hola, 👋» y el nombre inventado del banco («Banco Quincena») con un logotipo geométrico propio.
- **220–760:** **saldo gigante**: Inter 900 a 150 px, centrado, con la etiqueta «Saldo disponible». El contador baja
  con cada cargo. Por debajo de un umbral, se pone rojo y tiembla.
- **760–1500:** lista de movimientos que entran desde arriba empujando a los anteriores.
  - Cada movimiento lleva icono, comercio genérico, hora y un importe en rojo o en verde.
  - Los cargos absurdos son el chiste («Suscripción que no recuerdo · $199»).
- **1500–1920:** barra inferior de navegación con 4 iconos (decorado).
- **Notificación push** que baja desde arriba (y 60–260) en los momentos clave: «Se depositó tu quincena 🎉».

**Paleta:**

| Elemento | Color |
|---|---|
| Fondo, degradado vertical | `#F4F6FB` → `#FFFFFF` |
| Tarjeta del saldo | `#0F172A`, con texto blanco |
| Cargo | `#E5484D` |
| Abono | `#30A46C` |
| Texto secundario | `#64748B` |
| Alerta de saldo bajo | Fondo de la tarjeta a `#3B0D0D` |

**Tipografía:**

- Inter 900 para el saldo.
- Inter 600 para los movimientos (40 px).
- **JetBrains Mono** 500 para los importes (alinean los dígitos y queda «financiero»).

**Subtítulos:** mínimos.

- Voz de narrador irónico. Pastilla blanca pequeña en y=1380, en minúscula y de 40 px, solo con las frases que no
  están en pantalla.
- Nada de mayúsculas gigantes.

**Transiciones:**

- Ninguna. Todo pasa en la misma pantalla.
- El único corte es al final: la pantalla se bloquea (fundido a negro con la hora grande).

**Sonido:**

- `tick` del contador al bajar.
- Vibración (`bombo` grave y corto) por notificación.
- `ding` cuando entra la quincena y `plano` cuando llega a casi cero.
- Música tensa que se corta en seco al final.

**Legal:** `Aviso variante="pie"`, en el pie de la tarjeta de saldo, en gris («Info, no asesoramiento financiero · Datos
ilustrativos»). La fuente de la cifra, si es real, va como movimiento («Dato: ENIGH 2024, INEGI»).

**Cierre:** remate en silencio.

- El saldo se queda en $0,47.
- Entra una última notificación: «¿Quieres un adelanto de nómina?».
- Corte a negro.
- **Sin CTA.** El remate hace el trabajo de que se comparta.

**Componentes:**

```ts
<EstiloBanco
  banco: { nombre: string; logo?: ReactNode }   // siempre inventado
  moneda: 'MXN' | 'EUR'
  saldoInicial: number
  umbralAlerta?: number
  movimientos: Array<{ en: number; concepto: string; importe: number; icono?: string; hora?: string }>
  notificaciones?: Array<{ en: number; titulo: string; texto: string }>
  bloqueoFinal?: { en: number; hora: string }
/>
```

Subpiezas:

- `SaldoGrande`, un contador que interpola entre saldos con `spring` y tiembla por debajo del umbral;
- `ListaMovimientos`, una pila con `translateY` animado;
- `Push`, una notificación que baja, se queda 1,6 s y sube;
- `NavInferior`.

El formato de moneda: `$1,234.50` para MXN y `1.234,50 €` para EUR. Va en `brand.ts` como `pesos()`, al lado de
`euros()`.

---

### 4. `ticket` — recibo o ticket que se imprime

**Cuándo:**

- «Lo que de verdad cuesta…»: el café diario en un año, una boda, tener perro o el coche a plazos.
- También para desglosar gastos hormiga o un intercambio navideño.
- Cada línea que sale de la impresora es una pequeña sorpresa. **El TOTAL es la revelación.**

**Composición:**

- **Fondo:** mostrador de madera oscura `#3A2A20` con un viñeteado fuerte.
- **0–360:** ranura de la impresora, un rectángulo negro con brillo, de la que sale el papel. Ocupa la zona
  prohibida superior: es decorado.
- **360–1500:** el ticket, de 760 px de ancho, centrado y ligeramente rotado (−1,5°).
  - Borde inferior en zigzag de papel roto.
  - Cabecera con el nombre de la «tienda» («TIENDA DE LA VIDA ADULTA»), fecha, «CAJERO: TÚ», separadores `- - - -`,
    líneas de concepto con importe a la derecha y, al final, el **TOTAL** en doble altura.
- El papel **crece hacia abajo**; la cámara lo sigue haciendo pan vertical.
- **1500–1920:** el ticket sigue hacia abajo y sale de cuadro (decorado), o se ve la mano dibujada que lo sujeta.

**Paleta:**

| Elemento | Color |
|---|---|
| Papel térmico | `#F5F1E6`, con grano y sombra suave |
| Tinta | `#2B2B2B` |
| Sello «PAGADO» o «NO PAGADO» | `#C62828` al 85 % |
| Fondo | `#3A2A20` |

**Tipografía:**

- **Space Mono** o **Courier Prime** a 40 px, con el tracking justo de un ticket.
- El TOTAL en **Space Mono 700** a 80 px.
- El sello en **Archivo Black**.

**Subtítulos:** ninguno. La voz comenta cada línea con sorna; el ticket es el texto.

**Transiciones:**

- Pan continuo mientras se imprime.
- Al final, **la cámara se aleja** y enseña el ticket entero, larguísimo.
- Para pasar a un segundo ticket, se corta el papel con un `rayon` y se vuelve a la ranura.

**Sonido:**

- Zumbido de impresora térmica en bucle mientras sale papel (generar en `sfx/extra/impresora.wav`).
- `tick` por línea y `impacto` en el sello.

**Legal:** `Aviso variante="letraPequena"`, la letra pequeña del pie («ESTE TICKET ES INFORMATIVO · NO ES ASESORAMIENTO
FINANCIERO · FUENTE: …»), como la de un ticket real.

**Cierre:**

- El TOTAL, y un sello que cae: «¿VALIÓ LA PENA? SÍ / NO», con las dos casillas vacías.
- Es un CTA de comentar nativo del estilo, sin tarjeta.

**Componentes:**

```ts
<EstiloTicket
  tienda: string
  fecha: string
  lineas: Array<{ concepto: string; importe?: number; cantidad?: string; en: number; destacar?: boolean }>
  separadores?: number[]         // índices tras los que va «- - - -»
  total: { etiqueta: string; importe: number; en: number }
  sello?: { texto: string; en: number; rotacion?: number }
  letraPequena: string
  moneda: 'MXN' | 'EUR'
/>
```

Subpiezas:

- `Impresora`;
- `PapelTermico`, cuya altura es función del frame y lleva un clip-path zigzag;
- `LineaTicket`;
- `Sello`, con escala de 2,2 a 1, una rotación aleatoria y opacidad irregular con máscara de ruido;
- `CamaraSigue`, que hace `translateY` según la altura del papel.

---

### 5. `noticiero` — noticiero con rótulo de «ÚLTIMA HORA»

**Cuándo:**

- **Noticia real de esta semana** (Banxico, INEGI, salario mínimo, inflación): H17 dice que el tema solo no basta;
  este es el formato.
- **Noticia absurda de tu vida contada con solemnidad**: «ÚLTIMA HORA: joven de 27 años descubre que lleva 3 años
  pagando una app que no usa».
- El contraste entre la solemnidad y la tontería es el humor.

**Composición:**

- **0–220:** franja roja con el logo inventado del canal («ALIGN NOTICIAS», genérico) y un reloj «EN VIVO ●»
  parpadeando.
- **220–1080:** «pantalla» del plató. Un recuadro con borde fino donde va la imagen de la noticia: dibujo en código,
  una gráfica o un mapa de México con un punto que late. Alrededor, el plató es un degradado azul con rejilla.
- **1080–1260:** el **rótulo de cabecera**: bloque rojo «ÚLTIMA HORA» a la izquierda y titular blanco sobre azul
  marino a la derecha, en dos líneas.
- **1260–1420:** cintillo inferior con texto corrido de derecha a izquierda, con noticias secundarias que son chistes
  («DÓLAR HOY: no preguntes · CLIMA: frío en tu cartera»).
- **1500–1920:** prolongación del plató (decorado).

**Paleta:**

| Elemento | Color |
|---|---|
| Rojo de urgencia | `#D7262E` |
| Azul marino | `#0A1F44` |
| Azul del plató | `#12306B` → `#081736` |
| Blanco | `#FFFFFF` |
| Amarillo del cintillo | `#FFD200`, con texto negro |

**Tipografía:**

- **Roboto Condensed** 700 en los rótulos (titular a 58 px).
- **Oswald** 600 para «ÚLTIMA HORA».
- **Barlow Condensed** 500 en el cintillo.

**Subtítulos:**

- El rótulo hace de subtítulo resumido.
- La voz es de **locutor solemne**; hay que probar en `voces.json` la más grave, con tono de noticiero.
- Si hace falta subtítulo literal, va como **subtítulo de televisión**: blanco sobre caja negra semitransparente,
  Roboto Condensed a 40 px, en y=1000. Nunca en mayúsculas gigantes.

**Transiciones:**

- **Cortinilla** de noticiero: barrido diagonal rojo y azul de 12 frames, con `swoosh` y `sirena` cortada.
- Entre noticias, la pantalla interior hace corte seco.

**Sonido:**

- Sintonía de noticiero sintetizada: acorde de metales con `trompetas` y pulsos de reloj, a 120 bpm, con `tick` en
  cada pulso.
- `impacto` en el rótulo.

**Legal:**

- La fuente va en el propio rótulo, como en la tele («FUENTE: BANXICO, 5 NOV 2026»).
- `Aviso variante="rotulo"`: un pase del cintillo dice «CONTENIDO INFORMATIVO · NO ES ASESORAMIENTO FINANCIERO».

**Cierre:**

- **Remate cómico:** «Y ahora, deportes» y corte al plató vacío, con una planta rodando como en el desierto.
- O devolución a plató: «Seguiremos informando… en la próxima quincena». Es un CTA de seguir sin pedirlo.
- Funciona también como serie («Noticiero de tu cartera, n.º 3»), lo que da hábito.

**Componentes:**

```ts
<EstiloNoticiero
  canal: string                  // inventado
  enVivo?: boolean
  bloques: Array<{
    en: number
    titular: [string, string?]   // 1 o 2 líneas
    etiqueta?: 'ÚLTIMA HORA' | 'EN DESARROLLO' | 'EXCLUSIVA' | 'URGENTE'
    pantalla: ReactNode          // dibujo, gráfica o mapa
    fuente?: string
  }>
  cintillo: string[]             // frases del cintillo; el aviso legal se añade solo
  cortinillaEn?: number[]
  remate?: { tipo: 'deportes' | 'seguiremos'; en: number }
/>
```

Subpiezas:

- `Plato`;
- `Rotulo`, con entrada en dos tiempos: primero el bloque rojo de izquierda a derecha y después el titular desde abajo
  con máscara;
- `Cintillo`, un `translateX` lineal y continuo con el texto duplicado para que no haya hueco;
- `Cortinilla`;
- `RelojEnVivo`.

Para el mapa, ver la skill `remotion-maps` o un SVG simple de México.

---

### 6. `rpg` — interfaz de videojuego o RPG

**Cuándo:**

- La vida adulta como videojuego: «Nivel 27: desbloqueaste la declaración anual».
- Decisiones con consecuencias («elige: A) tanda B) CETES C) guardarlo bajo el colchón»).
- Jefes finales: la tarjeta de crédito, la cuesta de enero.
- Encaja con H16 (azar visible y ganador incierto).
- El lenguaje de stats y barras de vida hace **visible** el dinero.

**Composición:**

- **0–220:** HUD superior en pixel art: barra de vida (♥ = salud), barra de oro (💰 = dinero), barra de energía y el
  nivel. Es decorado, pero se lee de un vistazo.
- **220–1200:** escena en pixel art 16-bit (dibujada en código con `<rect>` en rejilla de 12 px).
  - El protagonista es un sprite simple; el «jefe» es la Tarjeta, un sprite grande con ojos.
  - Las cifras de daño saltan como números flotantes («−$1,200»).
- **1200–1500:** **caja de diálogo** RPG con borde doble blanco, el nombre del que habla en una pestaña y el texto
  escribiéndose. Cuando hay elección, la caja enseña opciones con un cursor ▶ que se mueve.
- **1500–1920:** suelo de la escena y botones de mando falsos A/B (decorado).

**Paleta:** limitada, tipo consola, 8 colores:

| Elemento | Color |
|---|---|
| Fondo de noche | `#1A1C2C` |
| Cielo | `#29366F` |
| Pasto | `#38B764` |
| Oro | `#FFCD75` |
| Vida | `#B13E53` |
| Caja | `#333C57` |
| Texto | `#F4F4F4` |
| Sombra | `#566C86` |

**Tipografía:**

- **Press Start 2P** a 30–36 px para el HUD y los números de daño.
- **VT323** a 54 px para el diálogo (más legible a ese tamaño).

**Subtítulos:** la caja de diálogo **es** el subtítulo, sincronizado con la voz palabra a palabra (usa los tiempos de
`voz.mjs`). No hay otro subtítulo.

**Transiciones:**

- **Transición de combate**: la pantalla se rompe en mosaico de píxeles o hace barrido en espiral, 15 frames.
- Pasar de nivel: fundido a negro y «NIVEL 28» centrado.

**Sonido:** chiptune. Generar 4 o 5 efectos en `sfx/extra/8bit/`:

- moneda;
- golpe;
- subir de nivel;
- menú;
- game over.

Pitidos del texto al escribirse (`bip` a 30 % de volumen y con un tono distinto por personaje). Música en bucle 8-bit
o ninguna.

**Legal:**

- `Aviso variante="sistema"`: un «TIP DEL JUEGO» en la pantalla de carga del principio («TIP: contenido informativo, no
  es asesoramiento financiero»).
- Las rentabilidades, como stats con asterisco («+7 %/año* · *hipotético»).

**Cierre:**

- **GAME OVER** con «¿Continuar? 10… 9…»: la cuenta atrás es tensión y deja un bucle natural.
- O **LEVEL UP** con «Nueva habilidad: fondo de emergencia».
- CTA dentro del estilo: «Pulsa SEGUIR para guardar partida».

**Componentes:**

```ts
<EstiloRPG
  hud: { vida: number; oro: number; energia?: number; nivel: number }   // 0–100; animables por keyframes
  hudCambios?: Array<{ en: number; campo: 'vida' | 'oro' | 'energia' | 'nivel'; valor: number }>
  escena: ReactNode               // sprites pixel
  dialogos: Array<{ en: number; quien: string; texto: string; opciones?: string[]; elegida?: number; eligeEn?: number }>
  danos?: Array<{ en: number; texto: string; x: number; y: number; color?: string }>
  final: { tipo: 'gameover' | 'levelup'; texto?: string; en: number }
/>
```

Subpiezas:

- `HUD`;
- `BarraPixel`;
- `Sprite`, que recibe una matriz de caracteres y una paleta y pinta rects; sirve para dibujar personajes en el propio
  guion;
- `CajaDialogo` (usa `Maquina` con tiempos de palabra);
- `NumeroFlotante`;
- `TransicionMosaico`, hecha con `<canvas>` o una rejilla de divs con retardo por celda.

---

### 7. `split` — pantalla partida: historia arriba, bucle hipnótico abajo

**Cuándo:**

- Historias de 30–45 s que en otro estilo se harían largas: «El día que mi tía invirtió en una pirámide», o una
  historia de foro del tipo «¿soy el malo por no prestar dinero?».
- **Solo con narración rápida**: un fondo frenético con una historia lenta empeora la retención.

**Composición:**

- **0–220:** decorado: la parte de arriba de la tarjeta de la historia.
- **220–940 (mitad de arriba):** la historia.
  - Una **tarjeta de foro genérica** (avatar, «u/anónimo», «hace 4 h», título en negrita) que luego se convierte en
    escenas dibujadas.
  - O ilustraciones fijas (`IMAGEN:` de ChatGPT) con un Ken Burns lento.
- **940–980:** franja divisoria con los **subtítulos karaoke** centrados encima, a caballo entre las dos mitades. Es
  donde el ojo cae.
- **980–1920 (mitad de abajo):** **bucle satisfactorio generado en código, nunca grabado de un juego**. Opciones, cada
  una reutilizable:
  - **Parkour de vóxeles:** un cubo que salta de plataforma en plataforma por un mundo de bloques infinito, en
    perspectiva isométrica y con cámara que avanza;
  - **Canicas:** canicas cayendo por una máquina de Galton o un embudo, con física sencilla precalculada;
  - **Corte de jabón y arena cinética:** capas de color que se cortan en láminas.

  La mitad de abajo puede invadir la zona prohibida: es decorado. Se pinta más apagada (saturación al 70 %) para no
  robar la atención.

**Paleta:**

| Elemento | Color |
|---|---|
| Mitad de arriba (tarjeta) | `#FFFFFF`, con texto `#1A1A1B` y acento `#FF4500` en el «voto» genérico |
| Mitad de abajo (bucle de vóxeles) | Cielo `#87CEEB` → `#B3E5FC`, bloques `#7CB342`, `#8D6E63` y `#9E9E9E` |
| Mitad de abajo (canicas) | Fondo `#101820`, canicas en `#FF6B6B`, `#4ECDC4`, `#FFE66D` y `#C7D7FE` |
| Subtítulo | Blanco con contorno negro de 10 px |

**Tipografía:**

- **Montserrat** 900 para los subtítulos (70 px, 2–3 palabras por golpe, con la palabra actual en `#FFE66D`).
- Inter 600 para la tarjeta.

**Subtítulos:** **karaoke**: el único estilo del catálogo que los lleva grandes. Palabra a palabra, centrados en la
franja divisoria y con un rebote de escala de 0,8 a 1 por palabra.

**Transiciones:** la mitad de abajo **no corta nunca**: es una toma continua. La de arriba corta con cada frase clave
(corte seco y una sacudida de 4 px).

**Sonido:**

- Voz en primer plano, rápida.
- El bucle de abajo tiene su propio sonido suave (canicas: clics aleatorios a volumen 0,08; vóxeles: pasos).
- Música de tensión baja.

**Legal:** `Aviso variante="pie"`, en el pie de la tarjeta de foro («Historia ilustrativa · Info, no asesoramiento
financiero»).

**Cierre:**

- **Bucle narrativo.** La última frase empalma con la primera («…y por eso nunca le presto a mi tía.» → «Mi tía me
  pidió $5,000…»).
- El bucle de abajo termina en el mismo fotograma con el que empezó (con `Bucle`).
- **Sin CTA.**

**Componentes:**

```ts
<EstiloSplit
  arriba: { tipo: 'foro'; tarjeta: { usuario: string; hace: string; titulo: string; votos?: number } } | { tipo: 'escenas'; escenas: ReactNode[] }
  abajo: 'voxeles' | 'canicas' | 'jabon'
  semilla: number                // para que el bucle sea reproducible
  proporcion?: number            // 0.5 por defecto
/>
```

Subpiezas:

- `TarjetaForo`;
- `BucleVoxeles`, con plataformas generadas a partir de la semilla, el salto como parábola y la cámara
  `translateX = frame * v`; el tramo final tiene que coincidir con el inicio;
- `BucleCanicas`, con trayectorias precalculadas en un script Node (`scripts/canicas.mjs`) que guarda las posiciones
  en JSON para no simular en el render;
- `BucleJabon`;
- `SubtitulosKaraoke`, que puede reutilizar `Subtitulos` con otra piel o `remotion-captions`.

---

### 8. `buscador` — búsqueda que se autocompleta

**Cuándo:**

- «Lo que busca México el día 14 a las 23:00»: cómo estirar la quincena, si me pueden embargar por una tarjeta, si
  tengo que declarar las tandas…
- Ironía relatable (H10): las sugerencias del autocompletado son el chiste.
- Pregunta y respuesta rápidas, de 10–15 s.
- Toque de serie: «Lo que se busca a fin de mes, parte 2».

**Composición:**

- **0–220:** barra de estado y pestaña del navegador (decorado).
- **380–520:** **barra de búsqueda** genérica: rectángulo redondeado blanco con lupa y micrófono dibujados. El texto se
  escribe letra a letra con errores y borrados («como ahorar» → «como ahorrar»).
- **520–1200:** **desplegable de sugerencias**. Aparecen de una en una, y la última es el remate («cómo ahorrar si gano
  el mínimo y me gusta comer»).
  - Una sugerencia se «elige» y baja el resultado.
- **1200–1500:** tarjeta de «fragmento destacado» con la respuesta real en 2 líneas y su fuente. **Esto da el valor
  educativo.**
- **1500–1920:** decorado: más resultados borrosos.

**Paleta:**

| Elemento | Color |
|---|---|
| Fondo | `#FFFFFF` |
| Barra | `#F1F3F4`, con borde `#DADCE0` |
| Texto | `#202124` |
| Sugerencias | `#5F6368` |
| Parte en negrita | `#202124` |
| Enlace | `#1A0DAB` |
| Acento propio de ALIGN en el fragmento | `#1D4ED8` |

Variante oscura: fondo `#202124`, barra `#303134` y texto `#E8EAED`.

No se dibuja ningún logo ni los colores de un buscador concreto: la marca es solo la lupa.

**Tipografía:** **Roboto** 400 y 500 (consulta a 50 px y sugerencias a 44 px). El fragmento en Roboto 700.

**Subtítulos:** ninguno. Si hay voz, lee el remate y la respuesta; el resto se lee en pantalla.

**Transiciones:**

- Ninguna. Para una segunda búsqueda, la barra se vacía con un «borrar todo» rápido.
- Zoom hacia la sugerencia ganadora.

**Sonido:** tecleo, `click` al elegir y `pop` por sugerencia. **Sin música**: el silencio hace más gracioso el remate.

**Legal:**

- La fuente va en el fragmento («Según CONDUSEF…»).
- `Aviso variante="pie"`, la línea gris de «Información» bajo el fragmento.

**Cierre:**

- La última búsqueda: el cursor vuelve a la barra vacía y se escribe «cómo dejar de…», con el corte a mitad de
  palabra, en bucle.
- O una pregunta en la barra: «¿qué buscaste tú anoche?», que es un CTA de comentar dentro del estilo.

**Componentes:**

```ts
<EstiloBuscador
  tema: 'claro' | 'oscuro'
  busquedas: Array<{
    teclear: Array<{ texto: string; en: number } | { borrar: number; en: number }>   // permite errores
    sugerencias: Array<{ texto: string; negrita?: [number, number]; en: number }>
    elegir?: { indice: number; en: number }
    respuesta?: { titulo: string; texto: string; fuente: string; en: number }
  }>
  final?: { tipo: 'bucle' | 'pregunta'; texto?: string }
/>
```

Subpiezas:

- `BarraBusqueda` (con `Maquina` y errores);
- `Sugerencia`, con la parte tecleada en gris y el resto en negrita;
- `FragmentoDestacado`;
- `ResultadosBorrosos`, con `filter: blur(8px)`.

---

### 9. `pizarra` — dibujado a mano (pizarra blanca o libreta)

**Cuándo:**

- Explicar **un concepto** que se entiende dibujándolo: interés compuesto, cómo funciona una tanda, por qué la
  inflación «come», o qué es la Afore en 4 trazos.
- Encaja con «Construye desde cero» (H2): cada pieza se dibuja.
- Es el estilo con más respaldo de investigación sobre lo que se recuerda.

**Composición:**

- **Fondo a pantalla completa:**
  - **Pizarra blanca:** `#FAFAF7`, con reflejo diagonal suave y restos de borrado.
  - **Libreta:** cuadrícula `#DCE6F2` cada 54 px, margen rojo vertical en x=150 y agujeros de espiral a la izquierda
    (decorado en la zona izquierda).
- **0–220:** el título del vídeo escrito a mano, pequeño, como «tema de la clase» (decorado, aunque legible).
- **220–1500:** el dibujo, que se va construyendo. Una **mano con rotulador** (SVG dibujado, nunca foto) sigue la
  punta del trazo.
  - Los números importantes van en un rotulador de otro color y rodeados.
- **1500–1920:** bandeja de rotuladores y borrador (decorado).

**Paleta:**

| Elemento | Color |
|---|---|
| Rotulador negro | `#1B1B1B` |
| Azul | `#1D4ED8` (el de la marca) |
| Rojo | `#D32F2F` |
| Verde | `#2E7D32` |
| Resaltador | `#FFF176` al 60 %, con `mix-blend-mode: multiply` |
| Fondo | `#FAFAF7` |

**Tipografía:**

- **Patrick Hand** o **Kalam** 700 para el texto escrito (60–80 px).
- **Permanent Marker** para los títulos y los números rodeados.

**Subtítulos:** **escritos a mano**.

- Solo las 2–4 palabras clave de cada frase, escritas en la pizarra al ritmo de la voz, como haría un profe.
- No hay subtítulo literal: la voz cuenta y la pizarra resume. Es la regla del kit, «el texto resume».

**Transiciones:**

- **Borrado**: el borrador pasa en diagonal y deja la pizarra limpia en 10 frames (`swoosh` con ruido de goma).
- En la libreta, **pasar página** (curl en 3D con `rotateY` sobre el borde izquierdo).

**Sonido:**

- Rotulador sobre pizarra, en bucle mientras se dibuja (generar `sfx/extra/rotulador.wav`).
- `pop` al rodear un número y `ding` en la conclusión.
- Música acústica muy baja.

**Legal:**

- `Hipotetico variante="nota"` escrito a mano junto a la gráfica («*7 % anual, hipotético»).
- El aviso, en la esquina inferior del dibujo, en rotulador gris pequeño.

**Cierre:**

- El dibujo terminado. La cámara se aleja y lo enseña entero (es el pantallazo que la gente guarda).
- Una flecha dibujada señala la conclusión.
- CTA de guardar **nativo**: un post-it amarillo pegado en la esquina, «guárdalo para el examen de la vida».

**Componentes:**

```ts
<EstiloPizarra
  soporte: 'pizarra' | 'libreta'
  trazos: Array<{
    d: string                     // path SVG
    color?: string; grosor?: number
    en: number; dur: number       // segundos para dibujarlo
    tipo?: 'linea' | 'texto' | 'circulo' | 'flecha' | 'resaltar'
    texto?: string                // si tipo=texto, se convierte a path o se revela con máscara
  }>
  borrados?: number[]
  mano?: boolean
  zoom?: Array<{ en: number; x: number; y: number; escala: number }>
/>
```

Subpiezas:

- `Trazo`, que usa `getPointAtLength` para que la mano siga la punta y anima `strokeDashoffset`;
- `TextoMano`, con máscara de revelado de izquierda a derecha por línea (más fácil que convertir la fuente a paths) y
  jitter de ±1° por palabra;
- `Borrador`;
- `PasarPagina`;
- `Mano`, un SVG con rotación ligada a la dirección del trazo.

Para el aire de «hecho a mano», filtro SVG `feTurbulence` y `feDisplacementMap` a escala 2.

---

### 10. `collage` — recortes de revista y papel

**Cuándo:**

- Opiniones con carácter y «cosas que nadie te dice» (H8): «5 gastos que tus papás no te contaron de independizarte».
- Contrastes de estilo de vida.
- Tono de fanzine y de mixtape: rompe por completo con la estética «app».

**Composición:**

- **Fondo:** papel kraft o cartón (`#C8A97E`, con fibras), o papel de periódico con columnas de texto ilegible al 15 %.
- **Toda la pantalla es un tablero.** Los elementos entran como recortes:
  - objetos con borde blanco de «recortado con tijera» de 8 px y sombra dura;
  - letras de recortes de distinto tamaño y fuente para el titular, tipo nota de secuestro;
  - tiras de cinta adhesiva semitransparente en las esquinas.
- **0–220:** cinta y recortes decorativos.
- **220–700:** titular en letras recortadas, cada una con una rotación aleatoria entre −8° y 8°.
- **700–1400:** el objeto o la escena central, hecho de recortes. Se puede mezclar con `IMAGEN:` de ChatGPT recortadas
  con `background-matte` o con el contorno blanco.
- **1400–1500:** subtítulo en tira de papel.
- **1500–1920:** recortes decorativos (garabatos, flechas o estrellas).

**Paleta:**

| Elemento | Color |
|---|---|
| Kraft | `#C8A97E` |
| Papel blanco | `#F7F3EA` |
| Negro tinta | `#111111` |
| Rojo | `#E63946` |
| Azul Klein | `#1D3FBB` |
| Amarillo | `#FFD60A` |
| Cinta | `#F1E9C9` al 70 % |

Para cohesión, como mucho 3 colores fuertes por vídeo.

**Tipografía:** mezcla deliberada para las letras recortadas:

- **Anton**;
- **DM Serif Display**;
- **Bebas Neue**;
- **Archivo Black**;
- **Playfair Display Italic**.

Cada letra lleva una fuente, un fondo y una rotación al azar, con semilla fija. El cuerpo, en **Space Grotesk** 600.

**Subtítulos:** **tiras de papel**.

- Cada frase sale en una tira blanca recortada (Space Grotesk 600, 48 px, negro) que entra deslizándose y se pega con
  cinta.
- Como mucho, una tira en pantalla.

**Transiciones:**

- **Stop-motion**: el collage anima a **12 fps** (`Math.floor(frame/2.5)`), con un temblor de 1–2 px por fotograma en
  cada recorte. Es lo que da el aire «hecho a mano».
- Para pasar de escena, una mano de papel arrastra todo fuera de cuadro, o una hoja nueva cae encima.

**Sonido:** papel arrugándose, tijera, cinta despegándose y `impacto` seco en el sello. Música con bajo y batería
sencilla.

**Legal:** `Aviso variante="letraPequena"`, un recorte pequeño de papel de periódico pegado abajo («Info, no
asesoramiento financiero»).

**Cierre:**

- Un **sello de goma** que golpea en diagonal («VERDAD INCÓMODA» o «NADIE TE LO DIJO»).
- La cámara se aleja y enseña el collage completo, que es el pantallazo que se comparte.
- CTA opcional como recorte: «mándaselo a quien se independiza este año».

**Componentes:**

```ts
<EstiloCollage
  fondo: 'kraft' | 'periodico' | 'carton'
  titular: { texto: string; en: number; semilla: number }
  recortes: Array<{
    contenido: ReactNode | { imagen: string }   // dibujo o imagen
    x: number; y: number; ancho: number; rotacion?: number
    en: number; entrada?: 'caer' | 'deslizar' | 'pegar'
    cinta?: Array<'tl' | 'tr' | 'bl' | 'br'>
  }>
  tiras: Array<{ texto: string; en: number }>
  sello?: { texto: string; en: number }
  fps?: 12 | 8                   // stop-motion
/>
```

Subpiezas:

- `LetrasRecortadas`;
- `Recorte`, con un contorno blanco de `drop-shadow` múltiple o un trazo SVG del contorno, más una sombra dura;
- `Cinta`;
- `TiraPapel`;
- `Sello`, el mismo de `ticket`;
- `StopMotion`, un wrapper que cuantiza el frame y aplica jitter con `random(semilla+frameCuantizado)`.

---

### 11. `documental` — mundo plano de formas geométricas con cámara que viaja

**Cuándo:**

- Explicar **un sistema con partes que se relacionan**: cómo viaja tu dinero desde la quincena hasta el banco y la
  Afore, qué hace Banxico cuando sube la tasa, adónde va el IVA de un café…
- Tono de documental de divulgación: serio, bonito, con asombro.
- Contrapeso a los estilos de humor. Da autoridad a la cuenta.

**Composición:**

- **Un mundo continuo y más grande que la pantalla** (p. ej., 1080×6000) por el que **viaja la cámara** hacia abajo o
  en diagonal. La escena «baja» del cielo (economía del país) a la calle (tu bolsillo).
- Formas planas con degradado suave, sin contorno, con luz rim de 2 px en un borde.
- Personajes de cuerpo simple: cápsula y círculo, sin cara o con dos puntos por ojos.
- Partículas (las monedas son puntos dorados que fluyen) siguiendo paths.
- **220–1500:** la acción. Siempre **un único elemento en foco**; el resto, desenfocado al 30 % (profundidad de campo
  falsa con `blur`).
- **Zonas prohibidas:** el mundo sigue: cielo, suelo y estrellas.

**Paleta:**

| Elemento | Color |
|---|---|
| Noche profunda | `#0B1026` |
| Índigo | `#1E2A78` |
| Turquesa | `#2EC4B6` |
| Coral | `#FF6B6B` |
| Ámbar | `#FFB703` |
| Crema | `#FFF3E0` |
| Luz rim | `#FFFFFF` al 40 % |

Degradados siempre entre dos tonos vecinos, nunca a gris.

**Tipografía:**

- **Fraunces** 600 para los rótulos de capítulo («I. La quincena»).
- **Nunito** 600 para las etiquetas pequeñas.

**Subtítulos:** **discretos**.

- Minúscula, **Nunito** 600 a 44 px, blancos al 90 % y sin caja, en y=1380, con 2 líneas como mucho.
- Entran con fundido, sin rebote.
- El protagonista es el mundo.

**Transiciones:**

- **No hay cortes.** La cámara viaja: `translateY` con easing `inOutCubic` entre «estaciones» del mundo.
- Zoom dentro de un objeto (una moneda) que se convierte en el escenario siguiente: es un match cut.

**Sonido:**

- Música orquestal o ambiental (de las 8 pistas de Pixabay, la más tranquila).
- Sonidos suaves: `pop` muy bajo y un `whoosh` largo y grave en los viajes.
- La voz pausada.

**Legal:**

- La fuente como nota a pie, en Nunito a 26 px, al lado de cada cifra.
- `Aviso variante="pie"` en el último plano.

**Cierre:**

- **Plano que se aleja**: la cámara sube hasta ver el mundo entero, como un diorama, y se queda quieta 1,5 s.
- Una frase final en Fraunces: «Ahora ya sabes adónde va».
- **Sin CTA.** Si acaso, el siguiente capítulo como teaser («Próximo: adónde va tu Afore») = seguir.

**Componentes:**

```ts
<EstiloDocumental
  mundo: { alto: number; capas: Array<{ profundidad: number; contenido: ReactNode }> }   // parallax
  estaciones: Array<{ en: number; y: number; zoom?: number; foco?: string /* id de elemento */ }>
  flujos?: Array<{ path: string; color: string; particulas: number; desde: number; hasta: number }>
  capitulos?: Array<{ en: number; texto: string }>
/>
```

Subpiezas:

- `Mundo`, con capas de parallax a distinta velocidad;
- `CamaraViaje`, que interpola la estación actual;
- `Flujo`, partículas a lo largo de un path con `getPointAtLength` y desfase;
- `Foco`, que aplica blur y opacidad a todo menos al id en foco;
- `RotuloCapitulo`;
- `FormaPlana`, un `<path>` con degradado lineal y trazo rim.

---

### 12. `tipografia` — tipografía cinética a pantalla completa

**Cuándo:**

- Una **sola frase que pega**, o una ironía.
- Reels de 7–12 s (H4: los cortos retienen más).
- Ejemplos: «Para ahorrar hay que tener dinero.», «No es que gastes mucho. Es que ganas poco. Y gastas mucho.»
- Ideal con un tema de audio en tendencia (si es libre de derechos) o con un golpe de batería por palabra.

**Composición:**

- **Toda la pantalla es letra.** Una palabra o un grupo corto por golpe, de 200–320 px de alto, que llena la anchura
  útil (x 90–960). Se justifica a lo ancho cambiando el tamaño de cada palabra para que todas ocupen la misma anchura.
- Las palabras **se apilan** en vertical hasta llenar 220–1500 y la última **rompe la rejilla**: más grande, en color,
  girada 90° o saliéndose.
- Fondo: un plano de color que **cambia de color en cada golpe** (es el «corte»).

**Paleta:** pares de alto contraste que se alternan en cada golpe:

| Fondo | Texto |
|---|---|
| `#111111` | `#F5F5F0` |
| `#F5F5F0` | `#111111` |
| `#1D4ED8` | `#FFFFFF` |
| `#FFE600` | `#111111` |
| `#FF3B30` | `#FFFFFF` |

Como mucho 3 pares por vídeo.

**Tipografía:**

- **Anton** o **Bebas Neue** (condensada, alta) para apilar.
- **Archivo Black** para los golpes.
- **Instrument Serif Italic** para la palabra de contraste («y gastas *mucho*»). El cambio de familia es el chiste
  visual.

**Subtítulos:** **ninguno**. El texto es el vídeo. Si hay voz, dice exactamente lo que se ve.

**Transiciones:**

- **Corte en cada palabra**, sincronizado al beat o a los tiempos de palabra de `voz.mjs`.
- Entradas variadas, nunca la misma dos veces seguidas: escala de 3 a 1 con motion blur, máscara desde abajo,
  letra a letra con desfase de 1 frame, o «golpe» que sacude la pantalla.
- Una palabra puede **convertirse** en un objeto: la «O» de «AHORRO» se vuelve moneda y rueda.

**Sonido:** el ritmo es el contenido. Un golpe (`bombo` o `impacto`) por palabra, a 100–130 bpm. Silencio de 6 frames
antes de la palabra final y `ding` o `plano` en ella.

**Legal:** `Aviso variante="pie"`, Inter 500 a 24 px al 60 %, fijo en y=1480 todo el vídeo. Es el único estilo donde va
fijo, porque no hay interfaz en la que integrarlo.

**Cierre:**

- **Bucle perfecto:** la última palabra se encoge y se convierte en la primera palabra del fotograma 0, con el mismo
  color de fondo.
- Como dura 7–12 s, la gente lo ve 2 o 3 veces, y cada repetición es una vista en YouTube.
- **Sin CTA.**

**Componentes:**

```ts
<EstiloTipografia
  golpes: Array<{
    texto: string
    en: number
    familia?: 'condensada' | 'negra' | 'serif'
    entrada?: 'escala' | 'mascara' | 'letras' | 'golpe' | 'girar'
    par?: number                  // índice de la paleta de pares
    acumular?: boolean            // se apila en vez de sustituir
    romper?: boolean              // la última que rompe la rejilla
    morph?: 'moneda' | 'flecha' | null
  }>
  pares: Array<{ fondo: string; texto: string }>
  bpm?: number                    // si no hay voz, los golpes se cuantizan al beat
  bucle?: boolean
/>
```

Subpiezas:

- `Golpe`;
- `PilaJustificada`, que mide cada palabra con `measureText` de `@remotion/layout-utils` y escala a la anchura fija;
- `MotionBlur`, la propia de Remotion (`@remotion/motion-blur`), con 4 muestras;
- `Morph`.

---

### 13. `ranking` — tier list y clasificación

**Cuándo:**

- Clasificar hábitos o gastos de la vida real para que la gente **discuta en comentarios**: «Gastos de la quincena del
  S al D», «Formas de ahorrar según cuánto duelen», «Excusas para no ahorrar».
- **Una posición tiene que ser discutible a propósito**: es lo que dispara los comentarios.
- **Nunca se clasifican productos financieros ni marcas reales:** eso sería recomendar.

**Composición:**

- **0–220:** título de la tabla (decorado, también se puede leer en el pie del post).
- **260–1260:** la **tabla**, con 5 filas de 200 px.
  - Etiqueta de color a la izquierda (S, A, B, C, D; 160 px de ancho y letra a 110 px).
  - A la derecha, la fila donde caen las fichas.
- **1260–1500:** **zona de «la ficha actual»**: la ficha que se va a clasificar aparece aquí, grande (300×300), con su
  nombre. Duda un instante (oscila entre dos filas, que es la tensión) y vuela a su sitio con un arco y un rebote.
- **1500–1920:** banco de fichas pendientes en gris (decorado). Enseña cuántas quedan: es un contador de progreso.

**Paleta** (las filas clásicas, desaturadas para que sean de ALIGN):

| Fila | Color |
|---|---|
| S | `#FF7F7F` |
| A | `#FFBF7F` |
| B | `#FFDF7F` |
| C | `#BFFF7F` |
| D | `#7FBFFF` |

Fondo `#1A1A1A`, fila `#2A2A2A`, texto `#FFFFFF`. Las fichas son dibujos o emojis en caja blanca `#FFFFFF` redondeada.

**Tipografía:** **Lilita One** o **Rubik** 800 para las letras de fila y los nombres de ficha (44 px).

**Subtítulos:** mínimos.

- La voz da la razón en una frase por ficha («Gimnasio que no pisas: D, y lo sabes»).
- La razón sale como bocadillo corto junto a la ficha actual, en Rubik 600 a 42 px, 1 línea.

**Transiciones:** no hay. Es una sola pantalla que se va llenando y ese llenado es el progreso. Zoom breve a la fila
cuando cae una ficha polémica.

**Sonido:**

- `swoosh` al volar.
- `pop` al caer.
- `claxon` o `rebobina` cuando una ficha «se arrepiente» y cambia de fila.
- Música de concurso baja.

**Legal:** `Aviso variante="pie"`, en el pie de la tabla. Si una ficha lleva cifra («Tanda: +0 %»), lleva su fuente o la
etiqueta «ilustrativo».

**Cierre:**

- **La última ficha se queda sin clasificar** en la zona actual, con un «¿?» encima y la pregunta: «¿Dónde la pones
  tú?».
- Es el CTA de comentar más natural que existe (H7, con un número o una letra: «¿S o D?»). **Sin tarjeta.**

**Componentes:**

```ts
<EstiloRanking
  titulo: string
  filas?: Array<{ etiqueta: string; color: string }>   // S–D por defecto
  fichas: Array<{
    nombre: string; dibujo: ReactNode
    aparece: number; duda?: [number, number]           // filas entre las que oscila
    fila: number | null                                // null = se queda sin clasificar
    cae: number
    razon?: string
    cambia?: { aFila: number; en: number }
  }>
  preguntaFinal?: string
/>
```

Subpiezas:

- `TablaTier`;
- `Ficha`;
- `VueloFicha`, que interpola en arco (Bézier cuadrática) entre la zona actual y el hueco calculado de la fila;
- `BancoPendientes`;
- `Bocadillo`.

---

### 14. `grafica` — datos que se mueven

**Cuándo:**

- Comparar en el tiempo con **datos reales con fuente**: el precio de la tortilla desde 2000 (INEGI), el salario
  mínimo frente a la inflación, cuánto tarda cada país en duplicar precios…
- Proyecciones hipotéticas marcadas (100 pesos al mes durante 30 años).
- Encaja con H11 («si tu dinero tuviera sonido»): **la gráfica sonorizada**, donde cada valor es un tono
  (`sfx/tono/t00–t16` ya existen).
- Es el estilo de «el dato es el vídeo».

**Composición:**

- **Fondo:** papel milimetrado oscuro (`#0D1117`, con rejilla `#1F2937` cada 60 px y gruesa cada 300). La rejilla se
  extiende por toda la pantalla: es decorado y escala.
- **0–220:** título de la serie y del capítulo pequeño («Si tu dinero tuviera sonido · Cap. 2»).
- **240–420:** **la cifra viva**: el valor actual de la serie en JetBrains Mono 800 a 120 px, y la fecha o el año que
  avanza al lado (Inter 700 a 60 px).
- **420–1400:** **la gráfica**. Puede ser:
  - una línea que se dibuja, con punta brillante y estela;
  - barras que crecen y se reordenan (*bar chart race*);
  - puntos que caen.

  El eje Y **se reescala en vivo** cuando la línea se sale: es el momento wow, porque «no cabe».
- **1400–1500:** fuente fija en pequeño («Fuente: INEGI, INPC»).
- **1500–1920:** prolongación de la rejilla.

**Paleta:**

| Elemento | Color |
|---|---|
| Fondo | `#0D1117` |
| Rejilla | `#1F2937` |
| Línea principal | `#22C55E`, o `#F87171` si es mala noticia |
| Segunda serie | `#7C9BFF` |
| Punta | `#FFFFFF` con glow del color de la serie |
| Etiquetas | `#9CA3AF` |
| Hipotético | Línea discontinua `#FBBF24` |

**Tipografía:**

- **JetBrains Mono** 500 y 800 para las cifras y los ejes.
- **Inter** 700 para el título.
- Las anotaciones sobre la gráfica, en **Caveat** a 50 px, como si alguien las escribiera encima («aquí llegó la
  pandemia»).

**Subtítulos:** **las anotaciones son los subtítulos**. Flechas y notas a mano que señalan el punto de la gráfica del
que habla la voz. No hay subtítulo abajo.

**Transiciones:** no hay cortes. La línea avanza de forma continua. Si hay una segunda serie, entra con fundido
cruzado de la leyenda.

**Sonido:**

- **Sonificación**: cada punto de la serie dispara un `tono/tNN` según su valor (mapeado a 17 tonos).
- Si no es serie sonorizada, un `riser` hacia el wow y un `ding` al llegar.
- Música mínima.

**Legal:**

- La fuente, fija y visible todo el vídeo.
- Las proyecciones van en línea discontinua con la etiqueta «hipotético · 7 % anual» pegada a la propia línea.
- `Aviso variante="pie"` junto a la fuente.

**Cierre:**

- La línea llega al final y **se queda** 1,5 s con la cifra final latiendo.
- O se rebobina a toda velocidad hasta el inicio, con `rebobina`: es un bucle.
- CTA de guardar opcional como anotación a mano: «guarda esto para cuando te digan que "antes era igual"».

**Componentes:**

```ts
<EstiloGrafica
  tipo: 'linea' | 'barras-carrera' | 'puntos'
  series: Array<{
    nombre: string; color: string
    datos: Array<{ x: number | string; y: number }>
    hipotetica?: boolean
  }>
  fuente: string
  eje: { yFormato: 'pesos' | 'euros' | 'porcentaje' | 'numero'; reescalar?: boolean }
  ritmo: { inicio: number; fin: number }   // segundos en que se recorre la serie
  anotaciones?: Array<{ x: number | string; texto: string; en: number; lado?: 'arriba' | 'abajo' }>
  sonificar?: boolean
  cifraViva?: boolean
  final?: 'quieto' | 'rebobinar'
/>
```

Subpiezas:

- `RejillaMilimetrada`;
- `LineaViva`, un path SVG recortado según el progreso con `evolvePath` de `@remotion/paths`;
- `PuntaBrillante`;
- `EjeReescalable`, que interpola el dominio con `spring` cuando el máximo visible cambia;
- `CarreraBarras`, que ordena por valor en cada frame e interpola la posición Y por rango;
- `Anotacion`, una flecha y texto a mano (comparte `Trazo` con `pizarra`);
- `Sonificador`, que coloca `<Audio>` con el tono por punto (como mucho 8 por segundo, para respetar la regla de un
  efecto por segundo con margen; aquí el sonido **es** el contenido).

---

## Estilos de segunda fila (variantes que se pueden mezclar)

No llegan a estilo propio, pero sirven como **piel** sobre uno de los 14 o como experimento suelto:

| Variante | Qué es | Sobre qué estilo encaja |
|---|---|---|
| `vhs` | Líneas de barrido, aberración cromática, fecha «REC ● 27 NOV 1996» y temblor de pista | `noticiero` (archivo de «hace 30 años»), `grafica` (precios del pasado) |
| `comic` | Viñetas de 2 o 3 en vertical, bocadillos, onomatopeyas («¡CRASH!»), trama de puntos | `chat` (como alternativa), historias de fábula |
| `temporizador` | Cuenta atrás grande y fija (p. ej., «tienes 15 s para adivinar») | `ranking`, `buscador` (adivina la sugerencia) |
| `mapa` | México o España con puntos que laten y cifras por estado | `documental`, `noticiero` |
| `papercraft` | Capas de papel recortado con sombras profundas (parallax de 4–6 capas) | `documental` con textura de `collage` |
| `emoji3d` | Emojis grandes con volumen falso (degradado radial y sombra) como personajes | `tipografia`, `ranking` |
| `reaccion` | Plano fijo del personaje de ALIGN reaccionando (ojos y boca) bajo un texto «cuando…» | Formato meme sin usar memes ajenos |
| `blob` | La maqueta actual | Se queda como estilo más, con cupo bajo |

---

## Cierres y CTA: alternativas a la tarjeta final

### Por qué quitar la tarjeta fija

- Es **el mismo final en todos los vídeos**, así que el espectador aprende a irse cuando aparece. Es la peor señal
  posible justo al final.
- Rompe el bucle: en YouTube, cada repetición cuenta como vista desde mar 2025.
- No hay ninguna prueba de que un «Síguenos» genérico funcione. Las fuentes apuntan a lo contrario: los canales grandes
  de formato corto casi no usan CTA.
- **Dato propio:** tres semanas con «MÁNDASELO» y 0 guardados y 1 compartido.

Propuesta: **la pieza `Cierre` sustituye a `CtaCrecer` como obligatoria**, y `CtaCrecer` pasa a ser una opción más
(`tipo: 'tarjeta'`).

### Los 9 tipos de cierre

| `Cierre tipo=` | Qué es | Mejor en | Mide |
|---|---|---|---|
| `bucle` | El último fotograma empalma con el primero, con la imagen y la frase (que la última frase dé sentido a la primera). `Bucle` funde los 6–10 últimos frames. El audio tiene que cerrar también: la música se corta en un compás que empalme o no hay música | `tipografia`, `split`, `notas`, `buscador`, `grafica` | Repeticiones, % visto > 100 % |
| `remate` | El último plano es un chiste visual o un giro que se entiende solo, sin voz (la planta rodando, el «ok» del primo, el saldo a $0,47). Corte en seco justo después: **no se deja respirar** | `chat`, `banco`, `noticiero`, `rpg` | Compartidos (el remate es lo que se reenvía) |
| `personaje` | El CTA lo dice alguien **dentro** de la historia: el primo escribe «mándale esto al Toño», el locutor dice «seguiremos informando», el RPG pide «pulsa SEGUIR para guardar partida» | `chat`, `noticiero`, `rpg` | Compartidos y seguidores frente a la mediana |
| `pregunta` | Una pregunta corta encima del último plano, sin tarjeta y en el lenguaje del estilo (la casilla SÍ/NO del ticket, la ficha sin clasificar, la barra de búsqueda). Mejor **con respuesta cerrada**: «¿S o D?», «¿12 o 14?» (H7) | `ranking`, `ticket`, `buscador` | Comentarios por 1.000 vistas |
| `comentarioFijado` | Se simula en el último plano **un comentario de la propia cuenta ALIGN** (nunca de un usuario inventado) que lanza la pregunta o el dato extra: «Parte 2 si llega a 100 comentarios». Debe coincidir con el comentario **fijado de verdad** que se publica con el post (que lo ponga Decisiones). **No se inventan comentarios de usuarios ni cifras de likes falsas** | Cualquiera, sobre todo `split` y `chat` | Comentarios |
| `serie` | «Capítulo 3 de…» y un teaser del siguiente en 1 s («Próximo: la Afore»). Es seguir sin pedirlo: crea la expectativa | `documental`, `noticiero`, `grafica` (series H11) | Seguidores por 1.000 vistas |
| `guardar` | El último plano es **el resumen que vale la pena guardar** (la pizarra terminada, el collage entero, la tabla llena) y se queda quieto 1,5 s. Como mucho, un post-it «guárdalo» integrado | `pizarra`, `collage`, `ranking`, carruseles | Guardados |
| `silencio` | Sin CTA. El vídeo termina en el remate o en el dato y **ya**. Es lo normal en los estilos rápidos | `tipografia`, `banco`, `documental` | Control para comparar con los demás |
| `tarjeta` | La tarjeta blanca actual (`CtaCrecer`). Se queda para comparar | `blob` | Lo mismo que hoy |

### Cuándo NO poner CTA

- **En vídeos de menos de 15 s.** El CTA ocuparía el 20 % del vídeo y rompe el bucle, que es lo que hace rendir a los
  cortos (H4).
- **Cuando el final es un remate.** Cualquier cosa después del chiste lo mata. El remate ya es el motivo para
  compartir.
- **Cuando el estilo es de «pantallazo»** (chat, notas, ticket o buscador) y un CTA externo delataría que es contenido
  hecho: rompe la ilusión que hace que se reenvíe.
- **En noticias serias** (Banxico, inflación), donde un «¡síguenos!» resta credibilidad. Usar `serie`.
- **Cuando el anterior vídeo ya lo pedía.** Alternar: como mucho, la mitad de los vídeos de una semana con CTA
  explícito (`personaje`, `pregunta` o `comentarioFijado`).

**Regla de medición:** el tipo de cierre se guarda en Notion, en la propiedad «Palabra clave» o mejor en una nueva,
«Cierre». Resultados lo cruza con los guardados, compartidos, comentarios y repeticiones. Es una hipótesis nueva para
`EXPERIMENTOS.md`: *«H-cierre: los vídeos sin tarjeta final retienen más en el último 20 % que los que la llevan, sin
perder compartidos»*.

---

## Cómo cambia el trabajo de los agentes

Propuesta para que la valide quien mantenga las skills; **no se ha tocado ninguna skill**:

1. **Ideas y guion** (`align-ideas` y `align-guion`):
   - Cada idea propone `ESTILO:` y `CIERRE:` además de `FORMATO:`.
   - El guion se escribe **para el estilo**: en `chat`, como una lista de mensajes con tiempos; en `ranking`, como
     fichas; en `grafica`, como series de datos con fuente.
2. **Manager** (`align-manager`):
   - Comprueba que no se repite el estilo de ayer y que en 7 días hay al menos 5 estilos.
   - Aplica «cuándo NO poner CTA».
3. **Producción** (`align-produccion`):
   - Monta con `<Estilo…>`.
   - Si el estilo aún no está implementado, usa el más cercano ya hecho y lo anota.
   - Orden de implementación recomendado, de más impacto y menos coste a menos:
     1. `chat`;
     2. `tipografia`;
     3. `ticket`;
     4. `banco`;
     5. `ranking`;
     6. `notas`;
     7. `buscador`;
     8. `noticiero`;
     9. `grafica`;
     10. `pizarra`;
     11. `split`;
     12. `rpg`;
     13. `collage`;
     14. `documental`.

     Los cuatro primeros son casi todo maqueta estática con `Revelar` y `Maquina`, y salen en un día de trabajo.
4. **Resultados:** crea una columna «estilo» en el tablero y da el veredicto por estilo cuando cada uno tenga 3
   publicaciones.

---

## Fuentes

Casi todas son blogs de herramientas o de marketing. Se usan para ver patrones, no como pruebas, y las cifras que dan
sin estudio detrás no se han usado. Las más sólidas son las de Instagram (Mosseri), el cambio de recuento de YouTube y
los estudios de pizarra.

**Algoritmo y señales:**

- Envíos por alcance como señal (Mosseri, 2024–2025):
  https://www.searchenginejournal.com/instagram-algorithm-shift-why-sends-matter-more-than-ever/521389/
- Social Media Today: el ritmo de compartidos mueve el alcance:
  https://www.socialmediatoday.com/news/instagram-chief-post-share-rates-key-driver-reach/716540/
- Social Media Today: el algoritmo de Instagram en 2025:
  https://www.socialmediatoday.com/news/instagram-shares-algorithm-2025/738034/
- Lindsey Gamble, cronología de «sends per reach»:
  https://www.lindseygamble.com/blog/unpacking-instagrams-focus-on-sends-per-reach-a-timeline-why-it-matters-and-tips-for-creators-brands
- Buffer, guía del algoritmo de Instagram 2026: https://buffer.com/resources/instagram-algorithms/
- vidIQ, bucles en Shorts y el recuento de repeticiones desde mar 2025:
  https://vidiq.com/blog/post/double-youtube-watch-time-looping-shorts
- Hootsuite, algoritmo de YouTube Shorts: https://blog.hootsuite.com/youtube-shorts-algorithm/
- CapCut, número de repeticiones: https://www.capcut.com/create/short-form-video-loop-count
- Virvid, estructura en bucle: https://virvid.ai/blog/looping-structure-shorts-retention-2026

**Formatos sin cara:**

- Korpi, vídeos de chat de mensajes: https://korpi.ai/blog/how-to-make-text-message-story-videos
- Clippie, historias en chat falso 2026: https://clippie.ai/blog/make-fake-text-story-videos-ai-2026
- Korpi, guía de reels sin cara 2026: https://korpi.ai/blog/faceless-instagram-reels-guide
- Virvid, estructuras de Shorts sin cara: https://virvid.ai/blog/viral-shorts-structures-faceless-2026
- Revid, anatomía de un short viral 2026: https://www.revid.ai/blog/the-anatomy-of-a-viral-short-2026
- ReelForge, caída de alcance de los reels en el primer trimestre de 2026:
  https://reelforgeai.io/blog/instagram-reels-reach-collapse-q1-2026
- Fluxnote, estilos de subtítulo: https://fluxnote.io/guides/faceless-video-subtitle-styles-guide
- Fluxnote, ideas de Shorts de finanzas 2026: https://fluxnote.io/guides/finance-youtube-shorts-ideas-2026
- GhostShorts, Shorts de finanzas sin cara: https://ghostshorts.com/blog/how-to-make-faceless-finance-youtube-shorts-2026

**Pantalla partida:**

- Cognition Today, por qué enganchan los reels en pantalla partida: https://cognitiontoday.com/?p=114653
- GhostShorts, vídeos en pantalla partida: https://ghostshorts.com/blog/how-to-make-split-screen-videos-for-tiktok-2026

**Pizarra y revelado progresivo:**

- VideoScribe, estudio de 2025 (521 adultos): https://blog.videoscribe.co/whiteboard-animation-beats-slides-for-retention-new-research
- VideoScribe, la ciencia de la pizarra: https://blog.videoscribe.co/the-science-behind-why-whiteboard-animations-supercharge-learning-and-memory
- Estudio de dibujo progresivo (Springer, 2023): https://link.springer.com/10.1186/s40561-023-00258-6

**Tipografía cinética:**

- DesignRush: https://www.designrush.com/best-designs/video/trends/8-25-seconds-to-impress-typography-animation-examples-that-maximize-viewer-retention
- Digital Silk: https://www.digitalsilk.com/web-design/web-trends/kinetic-typography/

**Tier lists:**

- YouTube Culture & Trends: https://blog.youtube/culture-and-trends/tier-list/
- TierVersus, tier lists que se debaten: https://tierversus.com/blog/how-to-build-tier-lists-people-actually-want-to-debate

**Ganchos y CTA:**

- Journalism.co.uk, ¿valen la pena los CTA en vídeo social?: https://www.journalism.co.uk/are-call-to-actions-on-social-videos-worth-it/
- Social Media Examiner, ganchos y bucles de curiosidad en Shorts:
  https://www.socialmediaexaminer.com/youtube-shorts-hooks-and-curiosity-loops-that-explode-your-views/
- Opus, la ciencia de los ganchos: https://www.opus.pro/blog/the-science-of-hooks
- Dev.to, ingeniería del gancho: https://dev.to/bulkdl/hook-engineering-the-science-of-the-first-3-seconds-in-short-form-video-2026-2jp9

**Datos propios de ALIGN:** `investigacion/EXPERIMENTOS.md` (H4, H5, H7, H9–H18) y `investigacion/TECNICAS.md`.
