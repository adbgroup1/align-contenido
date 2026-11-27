# TECNICAS.md — biblioteca de técnicas de ALIGN

Estudio de 100 (Modo A). Lo hizo el agente de Investigación el 19 nov 2026, por encargo de Andrés
(`buzon/20261119-120500-andres.md`).

## De dónde sale

- **100 fichas** en `investigacion/fichas/`: **1 de Gemini** (XMhs4waS40g, de antes) y **99 de Claude** (plan B).
  - Las 99 de Claude se hicieron **sin ver el vídeo**: con el título, la descripción, las etiquetas, la duración,
    las vistas, los 20 comentarios más votados y la miniatura (`investigacion/datos/`).
  - Esta noche Gemini dio **503 UNAVAILABLE** al primer intento, y `ver-videos.mjs` salió con el código 3.
- **Candidatos:** 246 en `candidatos.json`, de 12 consultas: kinetic typography, motion graphics explainer,
  data visualization shorts, animated infographic, 3D motion design, explainer animation business, finanzas
  personales animación, compound interest animation, personal finance explained animated, money tips animation,
  what if animation economy y animated story money lesson.
  - **Filtro:** viral (ratio vistas/suscriptores ≥5 o más de 500.000 vistas).
  - **Fuera:** los tutoriales de IA y de apps, las grabaciones de pantalla, los vídeos con cara, las canciones,
    los clips ajenos y los productos.
- **78 de las 100 son `apto_align`:** sin cara, animadas y con un patrón que se puede pasar a finanzas.
  - **50 son de finanzas personales:** 23 en español y 27 en inglés u otros idiomas.
- **Cuidado con qué se puede afirmar:**
  - **Fichas de Claude:** valen para hooks, temas, formato, estructura y lo que pide el público.
  - **Técnicas visuales y de sonido:** con 1 sola ficha de Gemini **no hay base estadística**. Las de abajo salen
    de esa ficha, de las miniaturas y de lo que dicen los comentarios, y van marcadas así.
- **Duración mediana** de los aptos: **51 s**.

---

## Formatos que funcionan

Cada ficha lleva un `formato_align` (el formato que domina). Vistas sobre las 100 fichas:

| Formato | Virales | Aptos ALIGN | Vistas medias | Vistas medianas | Ratio mediano | De finanzas (mediana de vistas) |
|---|---|---|---|---|---|---|
| Lista | 7 | 6 | **11.533.073** | 11.149 | 18 | 4 (3.719) |
| Comparación A/B | 18 | 14 | **685.683** | 8.984 | 76 | 12 (4.166) |
| Historia con personaje | 17 | 16 | **455.919** | 14.533 | 50 | 12 (9.516) |
| Qué pasaría si | 14 | 14 | 366.892 | 2.922 | 66 | 4 (3.159) |
| Contador | 5 | 4 | 65.251 | **42.052** | 12 | 1 (5.296) |
| Fábula con personajes | 10 | 8 | 51.425 | **20.080** | **118** | 8 (**10.524**) |
| Explicación | 16 | 14 | 37.380 | 3.623 | 32 | 8 (2.938) |
| Otro (loops satisfying, clips ajenos, tutoriales) | 13 | 2 | 3.707.237 | 61.738 | 48 | — |

### Cómo leer la tabla

- **Las medias las mueve un solo vídeo:**
  - **Lista:** una lista personificada en 3D de salud, de 80,6 M de vistas.
  - **Comparación A/B:** un tutorial de diseño de 12 M, que no es apto.
  - **Historia con personaje:** una historia 3D de interés compuesto de 7,3 M (uoS1qzRWdbM).
  - **Qué pasaría si:** un mapa geopolítico de 4,5 M.
  - Para decidir, mejor la **mediana**.
- **La mediana y el ratio** dicen esto:
  - **Fábula con personajes** e **Historia con personaje** son los formatos de finanzas más fuertes y constantes
    (mediana en finanzas de unas 10.000 vistas y ratio alto, de 118 y 50).
  - **Comparación A/B** es el más usado en finanzas (12 virales) y tiene el segundo ratio más alto.
  - **Contador** tiene la mediana más alta, pero solo hay 5 virales (gráficos con sonido y bolas que se acumulan).
  - **Explicación pura** es el formato más flojo: mediana de 3.623, y de 2.938 en finanzas.
  - **Qué pasaría si** tiene ratios altos en canales pequeños y un techo enorme (4,5 M) cuando la premisa es
    grande y polémica.
- **Recomendación para Semana:** salir del formato único, que es «Explicación».
  - 1 vídeo por semana de **Fábula o Historia con personaje**.
  - El otro, alternando **Comparación A/B** y **Qué pasaría si**.
  - El **Contador** va de capa dentro de cualquiera de ellos.

### Estructuras por formato

Son 2 ejemplos por formato, y solo la estructura: nada del contenido. Salen del título, la descripción y los
comentarios.

**Fábula con personajes** (animales u objetos que encarnan una idea)

1. Tres personajes reciben el mismo recurso → cada uno hace algo distinto con él (consumir, cambiar, invertir) →
   salto temporal → solo uno prospera → pregunta «¿cuál eres?». *(pVB4lprcVkA, HuEftnkRO5c, AE6Tr36XKBE)*
2. Mundo con una regla (cada gasto es una criatura) → las criaturas se comen el saldo poco a poco → un contador
   del saldo que baja → pregunta al espectador. *(BDqg5D2AQa8)*
   - Variante corta (17 s): un objeto personificado le habla al espectador → reproche → causa → «¿cuál te
     representa?». *(SBEXJSKwNB4)*

**Historia con personaje** (una persona dibujada a la que le pasa algo)

1. Meta → esfuerzo → tentación → mal gasto → consecuencia y lección. *(zvhDmYYIWHo, 256.000 vistas)*
2. El personaje defiende una compra → alguien lo pone «a juicio» → cálculo de coste por uso → comparación con otro
   gasto → pregunta que tumba su argumento. *(KStFL2D1eTQ, ratio 388)*
   - Variante: gana más → sube su nivel de vida → los gastos se comen el aumento → acaba igual → lección.
     *(jzsACBj_qf0)*

**Qué pasaría si** (premisa hipotética)

1. Pregunta hipotética de escala enorme → contexto con 2–3 datos → consecuencias en cadena → pregunta SÍ/NO
   fijada en comentarios. *(KNTsRU9VWPs, 4,5 M)*
2. Premisa: todos reciben mucho dinero → un personaje intenta comprar → los precios se disparan día a día →
   giro: nadie es rico → prueba histórica real. *(kUXL_TsRaVw, pnEMijYKQgo, KebHWH9w5GQ)*

**Contador** (una cifra que sube o baja en pantalla es el eje)

1. Título fijo de serie → el gráfico se dibuja año a año, con el año y el valor grandes debajo → un pico o una
   caída que se «oye» (el tono sigue la curva) → siguiente gráfico. *(Eqk234t3TLg, aj7ujHhjfVc, c59xAkJoZaA)*
2. Leyenda: alguien pide algo minúsculo → el poderoso se ríe → se duplica casilla a casilla con la cifra
   disparada → conexión con el interés compuesto. *(t1cYxhQK7VM, ratio 204)*

**Comparación A/B** (dos opciones o personas enfrentadas)

1. Pregunta A o B con cifras → dos personajes empiezan en momentos distintos → contadores en paralelo hasta la
   meta → resultado contraintuitivo → «¿todavía lo crees?». *(Qx5Q3z0jUIU, SjalqUE194M, M9pj4LZoxSw)*
2. Reencuentro tras años → uno aparenta riqueza → revelación de lo que hay detrás → el otro, discreto, tiene
   patrimonio → moraleja. *(GkYMRFY4H6c)*
   - Variante: mismo punto de partida → hábito 1…4 comparado lado a lado → resultado a 10 años → «¿cuál eres?».
     *(1p7jR2PghRw)*

**Lista** (N cosas)

1. Problema dentro de algo (un órgano, una cuenta) → N elementos, cada uno personificado como una cuadrilla en
   miniatura que lo arregla → cierre. *(V0ALvVPHz-8, 80,6 M: la lista funciona cuando cada punto es un personaje)*
2. Dos personas con el mismo ingreso y resultado opuesto → «la diferencia no es el sueldo» → N hábitos, uno a
   uno. *(CxCAWGzh8t0)*
   - Variante: pregunta que identifica al público («¿compartes X?») → conflicto → N normas → CTA de guardar.
     *(1iCxn0a8Iv0)*

**Explicación** (explica un concepto directamente)

1. Cifra chocante → pregunta («¿a quién?») → mecanismo explicado → reparto revelado → giro. *(wCu-ZiQLYcc)*
2. Situación cotidiana con un problema → por qué falla el sistema viejo → aparece la solución → respuesta a la
   pregunta del título. *(9GINjTHVnAY)*
   - Lo que más sube a una explicación es **meterla dentro de una metáfora o de un personaje**: la de la «bola de
     nieve» (N1El7I2ytOM) o la del diagrama que se monta (Cxo_0G6UDfM, ratio 430).

**Construye desde cero** (añadido el 19 nov por Andrés; ficha de origen: reel Df5b59POgak, vía «Ideas de Andrés»)

1. Hook en imperativo («Pon esto…») con el objeto todavía vacío → entra una pieza en cada frase, con un pop y
   un rebote, en un único plano fijo → subtítulo de una palabra arriba → la última pieza completa el objeto y
   «funciona» → pregunta «¿cuál te falta / te has roto tú?» + «mándaselo a quien…». *(reel de anatomía, 127.000
   me gusta y 19.600 envíos: la cifra de envíos es la señal fuerte)*
   - Por qué funciona: satisfacción de ver algo montarse, curiosidad por la siguiente pieza (nadie se va a
     mitad) y la sensación de «ahora entiendo cómo está hecho».

---

## Patrones de hook (los 10 mejores)

Recuento sobre la `hook.tecnica` de las 100 fichas. Un vídeo puede tener más de una técnica.

| # | Patrón | Fichas | Ejemplo de estructura | Por qué engancha (según los comentarios) |
|---|---|---|---|---|
| 1 | **Contraste A/B** (pobre/rico, ahorrador/gastador, antes/después) | 17 | Pantalla partida legible en un vistazo, en la miniatura y en el primer plano | El espectador se identifica con un lado y lo defiende en comentarios |
| 2 | **Pregunta hipotética «¿Y si…?»** | 12 | Premisa grande + mapa o personaje en el primer plano | Todos quieren dar su versión del final: debate |
| 3 | **Cifra chocante** en el título o en el primer plano | 11 | Salto de cifra enorme o precio cotidiano concreto (de 1 € a 1,20 €) | Los comentarios discuten las cuentas: más comentarios (por eso tienen que ser exactas) |
| 4 | **Pregunta de curiosidad** («¿cómo…?», «¿por qué…?», «¿qué es…?») | 8 | Pregunta directa + promesa de tiempo («en 60 s») | Funciona como base, pero sola rinde poco (la Explicación tiene la mediana más baja) |
| 5 | **Dilema al espectador** («¿un millón hoy o un céntimo que se duplica?») | 5 | Dos opciones en el título y el reto de elegir antes de ver | Obliga a elegir: comentan su respuesta |
| 6 | **Paradoja / contraintuitivo** («lo caro es barato», «ganar más no te saca de pobre») | 4 | Afirmación que choca con lo que cree el público | Desafía una creencia: lo comparten para discutirlo |
| 7 | **Metáfora visual** (gastos como criaturas, cuotas como correas, bola de nieve) | 4 | El concepto convertido en un objeto que se ve | Se entiende sin sonido y se recuerda |
| 8 | **POV** («POV: tus finanzas te gritan») | 3 | Le habla al espectador en segunda persona | Identificación inmediata y humor |
| 9 | **Lista numerada** con personaje | 3 | «N cosas» donde cada una es un personaje | Promesa clara de lo que va a dar el vídeo; es lo que se guarda |
| 10 | **Promesa de secreto / misterio** («¿qué esconde…?») | 2 | Objeto cerrado que se va a revelar | Bucle de curiosidad hasta el final |

- **Patrón de cierre que se repite:** termina con **pregunta binaria o de identificación** («¿cuál eres?», «¿SÍ o
  NO?»), muchas veces **fijada como comentario del canal**.
  - Sale en KNTsRU9VWPs, KStFL2D1eTQ, AE6Tr36XKBE, SBEXJSKwNB4, 1p7jR2PghRw y más.
  - Es la técnica de comentarios más barata y encaja con el CTA de crecimiento de `GUIA.md`.

---

## Ranking de técnicas

Columna «Base»: **G** = la ficha de Gemini (vio el vídeo); **M** = se ve en las miniaturas; **C** = sale de los
comentarios o del título. Estado según `videos/src/kit.tsx`.

| # | Técnica | Fichas | Base | Por qué retiene | Receta Remotion | Estado |
|---|---|---|---|---|---|---|
| 1 | **Personaje con emoción clara** (cara exagerada, objeto personificado) | ~35 (Fábula + Historia + Lista personificada) | M, C | La emoción se lee en medio segundo y sin sonido | `<Personaje>` con prop de expresión; `spring()` en escala de ojos y boca | En el kit (`Personaje`) |
| 2 | **Pantalla partida A/B** | 17 | M, G | Contraste inmediato y te eliges un lado | Dos `<Zona>` al 50 % con un divisor que entra con `spring`; mismo personaje con dos finales | En el kit (`Zona`, `Escenario`); falta un preset de split |
| 3 | **Contador / cifra que crece en paralelo** | 5 Contador + 10 A/B y Fábula con contador | M, G | El número que cambia es un «marcador»: quieres ver dónde acaba | `<Cifra>` con `interpolate` + `spring` final; dos contadores sincronizados | En el kit (`Cifra`) |
| 4 | **Salto temporal** («10 años después») | ~12 (A/B, Fábula, Historia) | C | Es el momento de la revelación: el payoff | `<Rotulo>` de fecha + `<Camara>` zoom + cambio de escenario | En el kit (`Rotulo`, `Camara`) |
| 5 | **Metáfora visual del concepto** (barra de ahorro, globo que infla gastos, bola de nieve) | 4 + la de Gemini | G, M | Se entiende sin audio | Barra con `interpolate` ligado a `spring`; globo con squash-and-stretch (`scaleX/scaleY` opuestos) | Barra: en el kit (`Cifra`/`Pildora`). Globo con squash: **Por implementar** |
| 6 | **Mapa con resaltado y marcador pulsante** (Qué pasaría si) | 3 | M | Da escala y «realidad» a la hipótesis | SVG del mapa de España; región con `fill` animado; anillo pulsante con `Math.sin(frame)` | **Por implementar** |
| 7 | **Sonificación del dato** (el tono sigue la curva) | 3 | M, C | Convierte una curva en emoción: «el pico de 2020» | Línea SVG que se dibuja con `strokeDashoffset`; `<Sfx>` de tono, frecuencia según el valor (pre-render) | **Por implementar** |
| 8 | **Palabra clave resaltada en el subtítulo** (amarillo o color de acento) | 1 G + varias miniaturas | G, M | Guía la vista y refuerza la idea al mirarlo en mudo | `<Subtitulos>` con palabra clave en el acento de la marca y pop elástico | En el kit (`Subtitulos`, `Palabras`) |
| 9 | **Lluvia u objetos que caen y se acumulan** (facturas, monedas) | 1 G + 1 (bolas satisfying) | G, M | Es satisfying y da sensación de exceso | `<Lluvia>` con rotación aleatoria y rebote | En el kit (`Lluvia`) |
| 10 | **Bucle perfecto** (el último frame enlaza con el primero) | 3 (loops satisfying, 0,5–46 M) | C | Repetición involuntaria: más tiempo de visionado | Que la escena final repita la composición del hook; que el audio termine en el pie de la frase del inicio | **Por implementar** (regla de guion) |

### Ritmo y sonido

- **Ritmo:** solo hay dato de una ficha de Gemini, con **6 planos en 43 s (≈7 s por plano)** y bloques de 5–8 s.
  Sin más base estadística: sin dato.
- **Sonido** (de esa misma ficha):
  - voz en off coloquial;
  - base lo-fi suave con ducking marcado;
  - SFX en cada aparición (swish, monedas, pop).
  - Coincide con el kit (`Sfx`, `Musica`, `LUFS`).
- **Duración:**
  - aptos: mediana de **51 s**;
  - Fábulas: mediana de **38 s**;
  - el mejor Qué pasaría si de finanzas: entre 17 y 45 s.

### Tipografía y color (por las miniaturas)

- **Tipografía:** sans gruesa y redondeada, en mayúsculas en el titular, con 1 palabra en color de acento.
- **Paleta:** reducida, con **un único acento** (rojo o amarillo) sobre fondos neutros u oscuros. Los de datos van
  en negro con un solo color.
- **3D cálido** (luz dorada, desenfoque de fondo): es lo que tienen las fichas con mejor nota visual (8–9).

---

## Qué hace que parezca premium frente a casero

| Premium | Casero |
|---|---|
| Una sola idea visual por vídeo (una gallina, una correa, un globo) | Muchos iconos de stock sin hilo |
| Personajes con expresión clara y luz cálida | Clip-art plano sin emoción |
| Paleta reducida con un acento | Muchos colores saturados a la vez |
| Pantalla partida limpia, simétrica | Texto encima de todo |
| Cifras exactas y con fuente (en los comentarios se discuten las cuentas) | Cifras redondas inventadas, que el público corrige |
| Pregunta final fijada en comentarios | Cierre con «sígueme» sin motivo |
| Formato de serie reconocible (mismo título fijo, mismo personaje) | Cada vídeo con un estilo distinto |

---

## Las 10 ideas más adaptables a ALIGN

Son ideas propias: de la referencia solo se toma el patrón.

| # | Idea ALIGN | Formato | Patrón de | Vistas de la referencia |
|---|---|---|---|---|
| 1 | Tres amigos cobran su primer sueldo: uno lo gasta, otro lo deja en la cuenta, otro invierte una parte. Salto de 10 años. «¿Cuál de los tres eres?» | Fábula / Historia | AE6Tr36XKBE, pVB4lprcVkA | 28.115 (ratio 150) |
| 2 | Una cuadrilla de obreros diminutos dentro de tu cuenta corriente: cada hábito es un obrero que tapa una fuga. Lista de 4 | Lista personificada | V0ALvVPHz-8 | 80,6 M |
| 3 | «¿Qué pasaría si mañana cerrara tu banco?»: qué cubre el Fondo de Garantía y qué no; pregunta SÍ/NO fijada | Qué pasaría si | KNTsRU9VWPs | 4,5 M |
| 4 | Juicio a un gasto: el gimnasio de 40 € contra la suscripción que no usas, por coste por uso | Historia con personaje | KStFL2D1eTQ | 24.413 (ratio 388) |
| 5 | «¿50 € al mes a los 22 o 200 € a los 40?»: dos contadores hasta los 65, con un giro final (cuentas exactas) | Comparación A/B + Contador | Qx5Q3z0jUIU | 6.549 |
| 6 | «Si tu sueldo tuviera sonido»: el salario joven contra el alquiler dibujados año a año; el alquiler «chilla» | Contador | Eqk234t3TLg | 69.439 |
| 7 | POV: tu hucha te habla y te reprocha cada Bizum de cena (15–20 s) | Fábula (objeto) | SBEXJSKwNB4 | 16.330 (ratio 347) |
| 8 | Dos amigos ahorran para un viaje; uno cae cada viernes en «solo es una caña» y el bote baja | Historia con personaje | zvhDmYYIWHo | 255.871 |
| 9 | «¿Y si España no hubiera entrado en el euro?»: tu nómina y tu hipoteca en dos escenarios; «¿mejor o peor?» | Qué pasaría si | JjTeTTE_udw | 549.254 |
| 10 | «¿Qué es un ETF?» con un único diagrama circular que se monta flecha a flecha | Explicación (diagrama) | Cxo_0G6UDfM | 20.984 (ratio 430) |

- **Cifras:** todas las de estas ideas hay que comprobarlas en el guion (p. ej., el límite del Fondo de Garantía).
  En los virales, el público discute las cuentas.

## Carruseles (ronda de tarde, 24 nov 2026)

*Fuente: WebSearch, solo lo público (blogs de marketing, sin ejemplos concretos de cuentas de finanzas mexicanas; las cifras no traen metodología: tratarlas como pistas, no como datos).*

- **Portada:** es el gancho; si aburre, no se desliza. Titular que genere curiosidad inmediata (promesa o número + pérdida).
- **Láminas:** 7–10 con valor en cada una; la lámina 2 debe pagar la promesa de la portada (dato o primer paso), no repetirla.
- **Formato «MITO → REALIDAD»:** una pareja de láminas por mito; cada revelación es ágil y se guarda.
- **CTA:** cierre claro; diseñar pensando en **guardados** (según Metricool, citado por Marketing Directo, pesan más que los likes en 2026; «9× más guardados que una foto» es cifra sin metodología).
- **Para ALIGN (H3):** probar portada con cifra en pesos («$20,000 → $51,516») + 7–8 láminas + CTA «guárdalo para tu quincena». Pendiente: ver carruseles reales de @ cuentas MX de finanzas (no accesibles desde la nube).

### Ronda de tarde 25 nov 2026 (WebSearch, solo lo público)
*Fuentes: Arsys, Tiendanube, Adaptlypost, Skedsocial, SocialKit (blogs de marketing; sin ejemplos reales de cuentas MX de finanzas; sin cifras fiables).*
- **Portada que detiene el scroll + cada lámina empuja a la siguiente** (Adaptlypost). Una lámina sin gancho propio es donde se cae la gente.
- **Segunda oportunidad:** Instagram puede reenseñar el carrusel a quien lo ignoró usando otra lámina como portada → la lámina 2 debe poder valer como portada alternativa.
- **MITO → REALIDAD** repetido lámina a lámina (Skedsocial), trasladable a «mito del ahorro / de la tarjeta».
- **Métrica:** tasa de guardados = guardados / alcance (SocialKit). CTA único de guardar, p. ej. «guárdalo para tu quincena».
- Sin dato de carruseles MX virales concretos (IG no se abre desde la nube) → sigue pendiente verlos en el Mac.

### Ronda nocturna 26 nov 2026 (fichas de Claude por datos; Gemini 503; sin dato visual)
- **Reto con azar visible y ganador incierto («Unboxing Challenge», dados, canicas)** — Por implementar. Aparece en 5 fichas (QQnblvnZAuc 18,8 M, RRsVqn5IXTM 12 M, k505yJ7aCCg 7,9 M, RVOi1zgJ38g 4,2 M, zYVJytpV2aU 5,2 M, de 4–5 canales distintos, algunos de 48–89 k subs). Retiene por el suspense de «quién gana». Receta: cajas/torres en cuadrícula, resultado por dados o caída de canica, contador. Apunta a H16 (y H12).
- **Sonido como contenido («cómo suena X en cada país/día»)** — 2 fichas (psQzp5qSKqc 4,6 M; zYVJytpV2aU 5,2 M). Refuerza H11. No vale como técnica visual hasta verlas con Gemini.
- **Historia con enigma de objeto cotidiano + «se rieron de él… hasta que»** — 1 ficha de ratio extremo (cmis4CPFHx0, 2.489). Todavía menos de 3 fichas: seguir mirando.

### Ronda de tarde 26 nov 2026 (WebSearch, solo lo público; Gemini 503 → plan B)
*Fuentes: Adaptlypost, SocialKit, Marketing Directo/Metricool, Skillshare (blogs y cursos de marketing). Sin carruseles MX de finanzas concretos ni cifras fiables: repite lo ya anotado.*
- **Límite técnico:** 1080×1350 y hasta 20 láminas, pero el máximo no es objetivo: 7–10 siguen siendo lo razonable.
- **Medir con tasa de guardados (guardados/alcance)**, no con likes (SocialKit). Confirma H3/H14.
- **Sin ejemplos nuevos accesibles:** los carruseles virales MX de finanzas siguen sin verse desde la nube → «mira las ideas» en el Mac.
- **Creadores MX (plan B, sin ver):** el formato «dato INEGI como edificio/escala visual» (V8b-IgbJGXk) y la noticia con fecha de servicio (Lnmg2LaqlgI) son los dos patrones útiles; las vistas altas con 0 likes (2A7Hlgd8wz8, anuncio de Credy: 45 k vistas, 9 subs, 0 likes) son tráfico pagado: **ignorar ratios extremos con 0 likes**.

### Ronda de tarde 27 nov 2026 (WebSearch, solo lo público; Gemini 503 → plan B)
*Fuentes: Canva MX (plantillas), Nu México (blog), Minuto60, Estrategias de Inversión. Sin carruseles MX de finanzas concretos ni cifras de guardados: la búsqueda no devolvió ejemplos virales.*
- **Nada nuevo en estructura de carruseles:** se repiten portada-promesa, lámina 2 que paga, CTA de guardar. Nu México propone el formato «avance de ahorro» (mostrar progreso) como inspiración: posible idea de serie para carrusel, sin datos.
- **Sigue pendiente:** ver carruseles reales de cuentas MX en el Mac («mira las ideas»).
- **Creadores MX (plan B, sin ver):** «regla con número + momento de pago» (72 horas tras cobrar, YacKygrTn5M) y «quincena 1 = fijo / quincena 2 = vida» (mEzIgazUY3w): ambos de un canal de 1.110 subs con 5–8× ratio y casi sin comentarios (señal débil). Dos personajes con el mismo sueldo (edw21vIKj4U) refuerza H18.
