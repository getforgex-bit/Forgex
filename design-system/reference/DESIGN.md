---
name: ForgeX
description: Herramientas digitales para negocios que crecen por niveles. Nada desaparece; todo se transforma.
colors:
  obsidiana: "#0b0a0c"
  obsidiana-card: "#121015"
  obsidiana-light: "#141217"
  champagne: "#d6c6b0"
  champagne-light: "#ede4d8"
  lila-muted: "#968496"
  lila-gris: "#7a6a7a"
  vino-ciruela: "#4a2a3a"
  vino-ciruela-light: "#663950"
  vino-ciruela-glow: "#78385b"
  line: "rgb(214 198 176 / 0.1)"
  line-strong: "rgb(214 198 176 / 0.2)"
  success: "#4a7c59"
  error: "#a23a3a"
typography:
  display:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 5.7vw, 5.75rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 86"
  headline:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.6vw, 4rem)"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 86"
  title:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.125rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 90"
  body:
    fontFamily: "Archivo Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
  plan-mark:
    fontFamily: "Orbitron, Archivo Variable, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    letterSpacing: "0.16em"
rounded:
  none: "0px"
spacing:
  gutter-mobile: "16px"
  gutter-desktop: "40px"
  section: "160px"
components:
  button-primary:
    backgroundColor: "{colors.champagne-light}"
    textColor: "{colors.obsidiana}"
    rounded: "{rounded.none}"
    padding: "14px 22px"
  button-primary-hover:
    backgroundColor: "{colors.champagne}"
    textColor: "{colors.obsidiana}"
  button-ghost:
    backgroundColor: "{colors.obsidiana}"
    textColor: "{colors.champagne-light}"
    rounded: "{rounded.none}"
    padding: "14px 22px"
  field:
    backgroundColor: "{colors.obsidiana}"
    textColor: "{colors.champagne-light}"
    rounded: "{rounded.none}"
    padding: "12px 14px"
  plan-cell:
    backgroundColor: "{colors.obsidiana-card}"
    textColor: "{colors.champagne-light}"
    rounded: "{rounded.none}"
    padding: "32px"
---

# Design System: ForgeX

## Overview

**Creative North Star: "La Forja Templada"**

Una landing que se comporta como metal en proceso de forja. Todo empieza disperso y al rojo vino: las piezas del negocio (tarjetas, menús, chats) flotan sueltas sobre obsidiana. Con el scroll se enfrían y se ordenan hasta volverse una retícula champagne, templada. La transformación nunca borra nada: las mismas 72 piezas, los mismos botones del Mini Hub y las mismas palabras cambian de forma de sección en sección. Esa conservación es la firma visual y el argumento comercial.

La base de color es el sistema ForgeX: obsidiana profunda, vino ciruela como resplandor y champagne metálico como material terminado. La tipografía es una sola familia, Archivo, cuyo eje de ancho hace de metáfora. Los titulares se comprimen (86%) como metal forjado y los precios se estiran a lo largo de la escalera de planes (62% → 125%): la misma materia en cinco estados. Orbitron queda solo para marcas de producto. Densidad media, mucho aire vertical y bordes duros.

La contención viene del sistema original ForgeX (restricción tipo Apple, honestidad técnica tipo Nothing, materialidad de casa de lujo). Se rechazan de forma explícita las pastillas, las tarjetas redondeadas, el vidrio decorativo, los eyebrows sobre cada sección y los números de sección.

**Key Characteristics:**
- Fondo vivo en canvas: 72 piezas que pasan de resplandor vino a bloque champagne según seis estados (Disperso, Conecta, Presenta, Interactúa, Automatiza, Piensa).
- Franja de estado fija abajo con la cuenta "Piezas 72 · Perdidas 0".
- Un solo acento de marca, `--accent`, que va de vino a champagne con el scroll.
- Bordes duros (0 px) en todo.
- Eje de ancho tipográfico como lenguaje: comprimido en titulares, progresivo en precios.

## Colors

Obsidiana y champagne cargan la lectura; el vino es luz, nunca texto.

### Primary
- **Champagne Metálico** (#d6c6b0): material terminado. Bloques de la retícula templada, íconos, precios destacados, texto de acento (estado de la franja, "Recomendado", folio).
- **Champagne Claro** (#ede4d8): tinta principal sobre obsidiana y fondo del botón primario.

### Secondary
- **Vino Ciruela Glow** (#78385b): el "calor". Halos de las piezas dispersas, extremo caliente de la curva de método y del acento, señal de la capa de IA. Solo como luz o marca, jamás texto.
- **Vino Ciruela** (#4a2a3a): resplandor radial ambiental detrás del cúmulo y tinte de superficie de la capa Max (28-30% sobre obsidiana).
- **Vino Ciruela Light** (#663950): reservado para tintes; no alcanza contraste de texto.

### Neutral
- **Obsidiana** (#0b0a0c): fondo de página y de campos.
- **Obsidiana Card** (#121015): superficie de paneles y celdas de plan.
- **Obsidiana Light** (#141217): superficie elevada (plan recomendado, burbujas de chat, esqueletos de carga).
- **Lila Muted** (#968496): texto secundario, etiquetas mono pequeñas, placeholders (5.6:1).
- **Lila Gris** (#7a6a7a): solo texto de 18 px o más, íconos inactivos y scrollbar (3.9:1).
- **Línea** (champagne al 10%) y **Línea Fuerte** (champagne al 20%): divisores y bordes, siguiendo la jerarquía de opacidad del sistema ForgeX.

### Named Rules
**The Vino Is Light Rule.** El vino ciruela es resplandor, tinte o marca, nunca texto: sobre obsidiana no llega a 3:1.

**The Heat Rule.** `--accent` = color-mix(vino-glow 60% × heat, champagne). Solo en marcas no textuales: barra de progreso del header, subrayado activo, curva de método, regla superior de Pro y segmentos de la franja. Arriba de la página está caliente y abajo templado.

## Typography

**Display Font:** Archivo Variable (eje de peso 100-900, eje de ancho 62-125%)
**Label/Mono Font:** IBM Plex Mono 400/500
**Plan Mark Font:** Orbitron 700

**Character:** Una grotesca industrial cuyo ancho cambia con la narrativa. Los titulares comprimidos se leen como metal trabajado; el mono aporta la honestidad técnica en datos y etiquetas.

### Hierarchy
- **Display** (600, clamp(2.75rem, 5.7vw, 5.75rem), 0.98, ancho 86%): H1 del hero y titulares de cierre. Máximo 2 líneas en escritorio.
- **Headline** (600, clamp(2.25rem, 4.6vw, 4rem), 1.02, ancho 86%): H2 de sección, en oración, sin mayúsculas.
- **Title** (600, 2.125rem, 1.1, ancho 88-94%): títulos de etapa y de paso.
- **Body** (400, 17-18px, 1.65): párrafos a 34-38rem de ancho máximo, en lila muted.
- **Label** (IBM Plex Mono 400, 11-12px): metadatos, encabezados de columna, "Ejemplo ilustrativo".
- **Plan Mark** (Orbitron 700, 15-24px, tracking 0.16-0.2em, mayúsculas, degradado metálico): solo BÁSICO, PLUS, PRO, ADVANCE, MAX.

### Named Rules
**The Width Is Meaning Rule.** El eje de ancho comunica estado. Titulares al 86%; precios de plan a 62/78/94/110/125% según el nivel. En el escenario de planes el ancho del precio se estira de forma continua con el scroll: la misma materia cambiando de estado. No se usa como decoración aleatoria.

**The Orbitron Fence Rule.** Orbitron solo aparece en el logotipo y en los nombres de nivel. Nunca en titulares de sección ni en cuerpo.

**The Metallic Mark Rule.** El degradado metálico de texto (135°, #fff6eb → #d6c6b0 → #9e8972 → #d6c6b0) vive solo en los nombres de nivel.

## Layout

Contenedor de 1400 px máximo con gutters de 16 / 24 / 40 px. Secciones con 112-160 px de padding vertical. Ninguna sección repite familia de layout:
- **Hero:** tipografía cinética a la izquierda con canvas a la derecha.
- **Inventario:** filas "antes → después" con línea que se dibuja.
- **Recorrido:** texto que avanza a la izquierda y panel fijo (sticky) a la derecha.
- **Método:** estaciones sobre una curva de enfriamiento.
- **Planes:** escenario fijo a pantalla completa con troncal (Básico, Pro, Max) y vía alterna (Plus, Advance) como panel superpuesto, e índice de doble riel; en móvil, secuencia lineal.
- **Preguntas:** bloque apilado y desplazado a la derecha.
- **Contacto:** titular de 7 columnas con formulario de 5.

Debajo de 1024 px todo colapsa a una columna explícita; el recorrido pasa de panel fijo a paneles estáticos por etapa.

## Elevation & Depth

Plano por defecto. La profundidad viene del canvas (perspectiva, resplandores vino, viñeta) y de capas tonales de obsidiana, no de sombras. La única sombra es la táctil del sistema ForgeX, en hover de celdas de plan, junto con un levantamiento de 4 px.

### Shadow Vocabulary
- **Glass Hover** (`box-shadow: 0 15px 35px -10px rgba(74, 42, 58, 0.4), inset 0 1px 0 rgba(214, 198, 176, 0.2)`): hover de celdas de plan.

### Named Rules
**The Flat Surface Rule.** Las superficies están planas en reposo. La luz pertenece al canvas.

## Shapes

Radio 0 en todo: botones, campos, paneles, celdas, tokens y marcadores. Las juntas entre celdas son líneas de 1 px de champagne al 10%. La única geometría curva es la del canvas (halos, anillos del toque, hebras de seda) y la curva de enfriamiento.

## Components

### Buttons
- **Shape:** rectángulo sin radio (0 px).
- **Primary:** champagne claro sobre obsidiana, 14 × 22 px, Archivo 500 a 15 px. Hover: champagne y levantamiento de 2 px. Active: 1 px abajo y escala 0.99.
- **Ghost:** transparente con borde de línea fuerte; en hover, borde champagne claro.
- **Etiquetas:** un verbo por intención en toda la página: "Encontrar mi plan", "Elegir {nivel}", "Quiero empezar".

### Inputs / Fields
- **Style:** fondo obsidiana, borde de línea fuerte, sin radio, 12 × 14 px.
- **Focus:** borde champagne; anillo global champagne de 2 px con separación de 3 px.
- **Error:** ícono en rojo de error y texto en champagne claro (el rojo no alcanza contraste como texto).

### Navigation
- Header sólido obsidiana de 64 px con borde inferior de línea.
- Enlaces Archivo de 15 px en lila muted, que pasan a champagne claro con un subrayado de 2 px en `--accent` cuando la sección está activa.
- Barra de progreso de 2 px en `--accent` en el borde inferior.

### Franja de estado (signature)
Barra fija inferior de 40 px con el estado actual (champagne, con transición vertical), su descripción, seis segmentos de avance, la cuenta "Piezas 72 · Perdidas 0" y los controles del fondo (vista plana/3D, guardar el fotograma actual como imagen).

### Token de recorrido (signature)
Palabra en IBM Plex Mono de 14 px, en caja de borde fuerte sobre obsidiana, con ancho fijo (7.25rem) para que su viaje con `layoutId` no deforme el texto. Los mismos cinco tokens (Café Central, Menú, Fidelidad, Reseñas, WhatsApp) existen en todas las etapas.

### Escenario de planes: troncal y vía alterna (signature)
En escritorio (sin movimiento reducido), un escenario `sticky` de 100dvh dura 100dvh + 276vh de scroll y presenta los niveles como títulos de película sobre el canvas vivo, con un velo izquierda → derecha (obsidiana 94% → 10%).
- **Troncal (Básico, Pro, Max):** la toma general. Nombre en Orbitron metálico monumental (clamp(3.25rem, 6.6vw, 6.5rem)), precio en Archivo 600 (clamp(4rem, 8vw, 7.25rem)) con el ancho que se estira con el scroll y, a la derecha, una frase de valor (21 px), una línea de lo que incluye (16 px, lila muted) y botón. Una sola etiqueta mono arriba: verbo y, si aplica, distintivo ("Recomendado" en Pro). Pro lleva botón primario; Max, resplandor vino detrás del nombre. Peso 1 en el tiempo de pantalla.
- **Vía alterna (Plus, Advance):** oferta completa para una situación concreta, no un plan de segunda. Entra descendiendo como panel `hud-glass` sobre la troncal anterior, que queda congelada detrás (opacidad 0.2, blur 4 px, escala 0.985). Vidrio limpio, sin ornamentos: etiqueta "Vía alterna", nombre metálico (clamp(2.5rem, 4.4vw, 4rem)), precio en `ink` y línea de lo que incluye a la izquierda; a la derecha, "Elígelo si" con 2 condiciones a 17 px y el botón interruptor achaflanado. Peso 0.8.
- **Índice de doble riel:** troncal vertical con los 3 nodos cuadrados y un apartadero a 45° por cada vía alterna, que sale, sostiene su estación y regresa a la troncal. Un cabezal de lectura avanza por la troncal y salta con spring al apartadero activo; cada estación (solo el nombre, sin precio) es un botón que lleva a su escena.
- **Transición:** fundido con desenfoque en ventanas fijas; solo la escena activa es enfocable (`inert` en las demás, incluida la troncal congelada).
- **Móvil y movimiento reducido:** la misma red en secuencia lineal; la troncal como escenas altas de 80svh y la vía alterna como el mismo panel de vidrio en línea.
- Debajo del escenario: "Comparar los 5 niveles" (acordeón) y la nota de precios provisionales.

### Regla de la escena
**The One Message Rule.** Cada escena de planes dice una sola cosa: nombre, precio, una frase de valor, una línea de lo que incluye y un botón. Las listas con checks viven solo en "Comparar los 5 niveles". Desde el estado "Automatiza" las etiquetas del canvas se desvanecen para no competir con el texto.

### Excepciones acotadas
- **Vidrio:** `hud-glass` (blur 20 px sobre obsidiana-card al 72%) existe solo en el panel de vía alterna y cae a sólido con `prefers-reduced-transparency`.
- **Chaflán:** `chamfer` (esquinas superior izquierda e inferior derecha a 45°, 10 px) existe solo en el botón interruptor de la vía alterna. El resto del sistema mantiene radio 0.

## Do's and Don'ts

### Do:
- **Do** usar la paleta ForgeX exacta; cualquier intermedio sale de mezclar vino y champagne.
- **Do** conservar elementos entre estados (piezas, tokens, respuestas del visitante) en lugar de hacerlos desaparecer.
- **Do** rotular todo ejemplo como "Ejemplo ilustrativo" y los precios como provisionales.
- **Do** respetar `prefers-reduced-motion`: el canvas se redibuja solo al cambiar el scroll y los viajes de tokens son instantáneos.

### Don't:
- **Don't** usar vino ciruela ni lila gris como texto pequeño.
- **Don't** usar radios, botones pill, vidrio decorativo ni retículas de fondo de líneas.
- **Don't** poner eyebrows sobre titulares de sección ni numerar secciones.
- **Don't** usar Orbitron ni degradado metálico fuera del logotipo y los nombres de nivel.
- **Don't** usar em-dashes en ningún texto visible.
