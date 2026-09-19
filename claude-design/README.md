# ForgeX Design System

**"La Forja Templada" · Nada desaparece; todo se transforma.**

Sistema de diseño extraído de la web real de ForgeX (React + Tailwind 4, `src/`). Úsalo para cualquier diseño, prototipo, landing, slide o pieza de marca. Lee este archivo completo antes de diseñar. Lo marcado como **Regla** es obligatorio.

## Archivos

| Archivo | Para qué |
|---|---|
| `colors_and_type.css` | Hoja base: tokens `--fx-*`, fuentes y clases (`.fx-display`, `.fx-btn-primary`, `.fx-switch`, `.fx-token`...). Impórtala siempre. |
| `tokens.json` | Los mismos tokens en formato estructurado. |
| `assets/forgex-isotipo.svg` | Isotipo con degradado joyero (fondo transparente). |
| `assets/forgex-isotipo-fondo.svg` | Isotipo sobre obsidiana (avatar, favicon, redes). |
| `preview/*.html` | Tarjetas de referencia de cada fundamento y componente. |
| `ui_kits/landing/index.html` | Recreación estática y fiel de la landing real, sección por sección. |

---

## 1. Marca y producto

- **ForgeX** construye las herramientas digitales de un negocio local y las hace crecer por niveles. No vende publicidad.
- **Tagline:** "Forjamos tu ventaja competitiva." · **Concepto:** "Nada desaparece; todo se transforma."
- **Público:** dueños de negocios locales y PyMEs mexicanas (cafeterías, restaurantes, barberías, tiendas, consultorios).
- **Voz:** tecnológica pero accesible, directa, sin clichés ni promesas de resultados. Español de México, precios en MXN, tuteo.

| Nivel | Verbo | Resumen | Precio | Badge | Rol |
|---|---|---|---|---|---|
| Básico | Conecta | El punto de entrada físico-digital de tu negocio. | $199 | Para empezar | Troncal |
| Plus | Presenta | La web completa y oficial de tu negocio. | $399 | Tu web oficial | Vía alterna |
| Pro | Interactúa | Tu web con más herramientas para que tus clientes vuelvan. | $699 | Recomendado | Troncal |
| Advance | Automatiza | Infraestructura para digitalizar y automatizar operaciones. | $1,099 | Menos trabajo manual | Vía alterna |
| Max | Piensa y atiende | La capa de inteligencia de ForgeX. | $1,999 | (ninguno) | Troncal |

Precios en MXN/mes, siempre con nota: "Precios de lanzamiento en MXN. Pueden ajustarse mientras terminamos de definir cada nivel."

**Seis estados de la materia** (franja de estado y canvas): Disperso, Conecta, Presenta, Interactúa, Automatiza, Piensa.

**Contenido prohibido:** inventar clientes, testimonios o métricas (los ejemplos como "Café Central" van rotulados "Ejemplo ilustrativo"); afirmar que ForgeX guarda automáticamente datos de clientes, incluye un CRM completo o tiene base de datos propia; ofrecer anuncios pagados, add-ons o "Ultra".

---

## 2. Color · paleta OBLIGATORIA

Solo tema oscuro. Ningún color fuera de esta tabla; los intermedios salen de mezclar vino y champagne.

| Token CSS | Hex | Uso real en la web |
|---|---|---|
| `--fx-obsidiana` | `#0b0a0c` | Fondo de página, header, franja, campos, tokens |
| `--fx-obsidiana-card` | `#121015` | Formulario de contacto, modal, panel del recorrido |
| `--fx-obsidiana-light` | `#141217` | Burbuja de chat, skeletons, tarjeta de resultado, hover de controles |
| `--fx-champagne-light` | `#ede4d8` | Texto principal ("ink"), precios, botón primario |
| `--fx-champagne` | `#d6c6b0` | Estado actual, badges, folio, íconos de lista, "templado", foco |
| `--fx-lila-muted` | `#968496` | Párrafos, labels de campo, mono, nav en reposo (5.6:1) |
| `--fx-lila-gris` | `#7a6a7a` | Títulos de etapa inactivos (≥ 18px), ícono + cerrado, segmentos pasados (3.9:1) |
| `--fx-vino` | `#4a2a3a` | Resplandor del canvas y detrás de Max; tinte al 30% en escena/resultado Max |
| `--fx-vino-light` | `#663950` | Reservado para tintes |
| `--fx-vino-glow` | `#78385b` | Halos del canvas, inicio de todo degradado de enfriamiento |
| `--fx-line` | champagne 10% | Divisores, bordes de panel, header, franja |
| `--fx-line-strong` | champagne 20% | Botón ghost, campos, tokens, encabezados de tabla, vidrio |
| `--fx-error` | `#a23a3a` | Solo el ícono de alerta |
| `--fx-success` | `#4a7c59` | Reservado, sin uso actual |

**Termómetro derivado** (mezclas vino-glow → champagne, para marcadores): índice de planes `#78385b #8f506b #aa6a78 #c09d94 #d6c6b0`; estaciones del método `#78385b #9a6a7a #b99a95 #d6c6b0`. Degradado de enfriamiento: `linear-gradient(90deg, #78385b, #d6c6b0)` en conectores, curva y troncal.

- **Regla del Vino es Luz.** El vino (las tres variantes) es resplandor, tinte o marca. Nunca texto.
- **Regla del Calor.** `--fx-accent = color-mix(in oklch, vino-glow calc(heat × 60%), champagne)`; en la web `heat = 1 − progreso × 1.1`. Arriba es rosa vino y al llegar a "Piensa" ya es champagne. Solo en marcas no textuales: barra de avance del header, subrayado de nav, subrayado de pestaña del recorrido, segmento activo de la franja e ícono de pregunta abierta.
- **Error legible.** Texto del error en champagne light; el rojo solo en el ícono `AlertCircle`.

---

## 3. Tipografía

Archivo variable (`wght` 100 a 900, `wdth` 62 a 125), IBM Plex Mono 400/500, Orbitron 700. Todo con `font-weight` 600 en titulares, 500 en UI y resultados, 400 en texto.

| Clase | Uso | Especificación |
|---|---|---|
| `.fx-display` | H1 del hero | `clamp(2.75rem, 5.7vw, 5.75rem)` · lh 0.98 · -0.025em · wdth 86% |
| `.fx-statement` | H2 de declaración (Inventario, Contacto) | `clamp(2.5rem, 5.8vw, 5.25rem)` · lh 1 · -0.025em · wdth 86% |
| `.fx-headline` | H2 de sección (Recorrido, Método, Planes) | `clamp(2.25rem, 4.6vw, 4rem)` · lh 1.02 · -0.025em · wdth 86% |
| `.fx-headline-sm` | H2 de Preguntas | `clamp(2.25rem, 4.2vw, 3.5rem)` · lh 1.04 · wdth 86% |
| `.fx-title` | H3 de etapa | 1.75rem → 2.125rem (≥768) · lh 1.1 · -0.015em · wdth 90% |
| `.fx-title-modal` | Título de modal | 1.875rem → 2.25rem · lh 1.05 · -0.02em · wdth 88% |
| `.fx-verb` | Verbo de estación del método | 2rem · lh 1 · -0.015em · wdth 88% |
| `.fx-after` | Resultado de transformación | 500 · 20px → 24px · lh 1.375 · wdth 94% · ink |
| `.fx-value` | Frase de valor de un plan | 21px · lh 1.375 · wdth 94% · ink |
| `.fx-lede` / `.fx-lede-hero` | Intro de sección / hero | 18px (hero 20px en ≥640) · lh 1.625 · lila muted · 34 a 38rem |
| `.fx-text` | Texto de etapa, "Elígelo si" | 17px · lh 1.625 |
| `.fx-small` | Respuestas, pasos, detalle | 16px · lh 1.625 · lila muted |
| `.fx-caption` / `.fx-fine` | Labels de campo, notas, footer | 14px / 13px · lila muted |
| `.fx-label-lg` / `.fx-label` / `.fx-label-sm` | Mono: etiqueta de escena / metadatos / pie de panel | 13 / 12 / 11px · lila muted |
| `.fx-logotype` | Wordmark FORGEX | Orbitron 700 · 14/16/20px · 0.2/0.24/0.28em · champagne light sólido |
| `.fx-plan-mark--*` | Nombre de nivel | Orbitron 700 · mayúsculas · lh 0.95 · degradado metálico (ver tamaños abajo) |

Nombres de nivel por tamaño: escena troncal `clamp(3.25rem, 6.6vw, 6.5rem)` a 0.06em; vía alterna `clamp(2.5rem, 4.4vw, 4rem)` a 0.08em; resultado 24px a 0.16em; etapa 15px a 0.2em; comparación 14px a 0.14em; índice 12px a 0.16em **sin degradado** (lila muted, ink si está activo).

**Precio:** Archivo 600, lh 0.9, -0.03em, cifras tabulares, en champagne light; unidad "MXN/mes" en mono lila muted. Escena troncal `clamp(4rem, 8vw, 7.25rem)`, vía alterna `clamp(3rem, 5.2vw, 4.75rem)`.

- **Regla del Ancho es Significado.** Titulares al 86%. Precio con el ancho de su nivel: Básico 62%, Plus 78%, Pro 94%, Advance 110%, Max 125% (en el escenario se estira con el scroll). Cuerpo al 100%.
- **Regla del Cerco de Orbitron.** Orbitron solo en el logotipo y los nombres de nivel.
- **Regla de la Marca Metálica.** `linear-gradient(135deg, #fff6eb 0%, #d6c6b0 45%, #9e8972 80%, #d6c6b0 100%)` solo en nombres de nivel. El logotipo es sólido.

---

## 4. Logotipo

Isotipo de cuatro pétalos con rombo central, degradado joyero vertical (`#F6EFE4`, `#D6C6B0` 20%, `#9B8770` 46%, `#C4B29A` 56%, `#F1E8DA` 78%, `#BFAC93`). Usa los SVG de `assets/`. Tamaños: sm 24px + 14px (footer) · md 36px + 16px (header) · lg 48px + 20px. 12px entre isotipo y wordmark. Nunca recolorear, sombrear ni poner sobre fondo claro.

---

## 5. Layout, forma y profundidad

- Contenedor 1400px · gutters 16 / 24 / 40px · secciones con 112px de padding vertical (160px desde 768px).
- Titular → párrafo: 24px. Encabezado de sección → contenido: 64 a 96px. Párrafo → botones del hero: 40px. Botones en pareja: 12px.
- Bloques de titular de 46 a 62rem; párrafos de 34 a 38rem.
- Cada sección tiene su propia familia de layout: hero a la izquierda con canvas a la derecha; inventario en retícula de 12 (5 · 2 · 5); recorrido con texto a la izquierda (5 col.) y panel sticky (7 col.); método con estaciones sobre una curva; planes en escenario fijo de 100dvh con índice de doble riel; preguntas desplazadas a la derecha (col. 5 a 12); contacto con titular de 7 columnas y formulario de 5.
- Bajo 1024px todo pasa a una columna; el recorrido se vuelve paneles por etapa, el método una barra vertical y los planes una secuencia lineal.
- **Regla de Radio Cero.** `border-radius: 0` en todo.
- **Regla de Cero Sombras.** La web no usa `box-shadow`. La profundidad es tonal (obsidiana → card → light), con bordes de 1px, y la luz viene del canvas.
- **Legibilidad sobre el canvas.** El hero y el escenario de planes usan velos izquierda → derecha (`--fx-veil-hero`, `--fx-veil-stage`); tablas y listas llevan obsidiana al 70 a 85% (`.fx-scrim`).
- **Excepciones acotadas** a la vía alterna: `.fx-hud-glass` (vidrio con blur de 20px) y `.fx-switch` (interruptor achaflanado).
- Grano de metal fijo al 4.5% (`.fx-grain`). Capas: canvas 0 · contenido 10 · franja 20 · header 30 · grano 40 · modal 50.

---

## 6. Componentes

- **Botones** (`.fx-btn` + `-primary` o `-ghost`): 14×22px, 15px, 500. Primary: champagne light; hover champagne y sube 2px. Ghost: borde línea fuerte; hover borde champagne light. Active: baja 1px, escala 0.99. Tamaños: `--sm` (header, 12×16px, 14px) y `--lg` (escenas, 16px de alto de padding, 16px). Flecha `ArrowRight` de 16px que se desplaza 2px al hover. En escenas oscuras el ghost lleva fondo obsidiana al 60%.
- **Etiquetas de botón:** "Encontrar mi plan" (bajo 1024px, "Mi plan"), "Ver cómo crece", "Elegir {nivel}", "Quiero empezar", "Ajustar respuestas", "Comparar los 5 niveles".
- **Botón de ícono** (`.fx-icon-btn`): 40×40px, borde línea, ícono 16px lila muted; activo en champagne.
- **Header:** 64px, obsidiana sólido, borde inferior línea. Logo md · nav "Cómo crece", "Cómo empiezas", "Planes", "Preguntas" (15px lila muted, activa en ink con subrayado de 2px en acento que crece desde la izquierda) · sonido · botón primario sm. Barra de avance de 2px en acento pegada al borde.
- **Footer:** borde superior línea, logo sm, frase de 15px, links de 14px, "© 2026 ForgeX Technologies S.A.P.I. de C.V. México.", 80px abajo para librar la franja.
- **Inventario (antes → después):** encabezados mono 12px sobre borde línea fuerte; filas divididas por línea. "Antes" en mono 14 a 15px (champagne que se apaga a lila muted); conector de 1px con degradado de enfriamiento que se dibuja; "después" en `.fx-after`.
- **Recorrido:** panel card con borde línea; pestañas de 48px con los cinco niveles (13px) y subrayado de acento; cuerpo con la vista del nivel; pie de 44px con el verbo y "Ejemplo ilustrativo" en mono 11px. Max tiñe el cuerpo de vino al 30%.
- **Token de recorrido** (`.fx-token`): IBM Plex Mono 14px, borde línea fuerte, fondo obsidiana, 7.25rem de ancho fijo ("Café Central" con ancho automático). Los cinco tokens viajan entre etapas y nunca desaparecen.
- **Método:** curva de enfriamiento de Newton que se dibuja con el scroll (trazo de 2px en degradado sobre guía de línea), marcadores cuadrados de 12px con el termómetro, "caliente" / "templado" en mono 11px, ventana en mono 12px y verbo en `.fx-verb`.
- **Escena de plan (troncal):** sin tarjeta. Etiqueta mono 13px con el verbo y el badge en champagne (" · Recomendado"), nombre metálico, precio, frase de valor, línea de lo que incluye y botón (primario solo en Pro). Max lleva un resplandor vino detrás del nombre.
- **Vía alterna:** panel `hud-glass` sobre la troncal congelada (opacidad 0.2, blur 4px, escala 0.985). Etiqueta "Vía alterna", nombre, precio, línea; a la derecha "Elígelo si" con dos condiciones (flecha champagne de 14px, 17px ink) y el interruptor `.fx-switch`: chaflán de 10px, borde ink al 40% y relleno obsidiana; al hover se rellena de champagne light, el texto pasa a obsidiana y dos escuadras champagne se cierran en esquinas opuestas.
- **Índice de doble riel:** troncal vertical (guía de línea fuerte y trazo en degradado de 2px), nodos cuadrados de 12px, apartaderos a 45° para Plus y Advance, cabezal de lectura de 20px con borde ink y nombres Orbitron de 12px sin degradado.
- **Comparar los 5 niveles:** botón con borde línea fuerte y un `+` que gira 45° y pasa a champagne; panel de 5 columnas con nombre metálico de 14px, precio mono y lista con `Check` champagne. Es el único lugar con listas de checks.
- **Preguntas:** lista con borde superior línea fuerte y divisores de línea; pregunta de 20 a 22px en 500 (lila muted cerrada, ink abierta); ícono `Plus` de 20px, lila gris cerrado, girado 45° y en acento abierto; respuesta 16px hasta 40rem.
- **Formulario de contacto:** panel card con borde línea, padding de 24 a 36px; labels 14px lila muted; `.fx-field` (hover borde lila muted, foco champagne); botón primario a todo el ancho; nota de 13px. Confirmación: "Folio" en mono y código en mono 24px champagne, luego un `dl` con términos en mono 12px.
- **Modal:** velo obsidiana al 88%; panel card con borde línea fuerte, máx. 42rem, padding de 24 a 40px; botón cerrar `.fx-icon-btn` arriba a la derecha; label mono 12px sobre el título. Las respuestas del visitante se conservan en "Tu materia prima"; resultado en obsidiana light con borde fuerte (Max en vino 30%); skeletons en obsidiana light pulsando.
- **Franja de estado:** fija abajo, 40px, obsidiana con borde superior línea. "Estado" en mono 11px, nombre del estado en Archivo 600 champagne wdth 92% (entra deslizándose), descripción 13px, 6 segmentos de 3px (pasado lila gris, actual acento, futuro línea fuerte), "Piezas 72 · Perdidas 0" en mono 12px, controles "Vista plana / Vista 3D" y "Guardar imagen" separados por bordes de línea con hover en obsidiana light.
- **Íconos:** Lucide, trazo **1.5**, 14 a 20px. Champagne para viñetas y confirmaciones, lila muted en reposo, acento en la pregunta abierta, rojo error solo en alertas.

---

## 7. Canvas y movimiento

- **Canvas vivo:** 72 piezas que pasan de halos vino dispersos (con enlaces punteados) a una retícula champagne de 8 columnas: anillos de "toque" en Conecta, conductos en Presenta, pulsos en Automatiza, hebras vino y champagne con escuadras de registro en Piensa. Etiquetas mono 500 de 11px sobre obsidiana al 80% que cambian de nombre ("menú impreso" → "menú digital") y se desvanecen desde Automatiza. Viñeta obsidiana en los bordes. Es el único lugar con geometría curva.
- **Easing único:** `cubic-bezier(0.16, 1, 0.3, 1)`. Pulsación 120ms, color 200ms, subrayados, íconos y acordeones 300ms, cambios de etapa 500 a 700ms. Entradas: opacidad + 12 a 20px de desplazamiento en 0.6 a 0.8s.
- **Hero:** las letras de "disperso." empiezan sueltas, rotadas y en lila muted, y se ensamblan en champagne light con un resorte.
- Siempre respetar `prefers-reduced-motion`: sin animación continua, cambios instantáneos y planes en secuencia lineal.

---

## 8. Redacción

- Titulares en oración, cortos, con punto final ("Empieza con un toque.").
- **Sin em-dashes (—) en texto visible.** Usa punto, coma, dos puntos o " · ".
- **Sin eyebrows sobre los H2 de sección ni números de sección.** Las etiquetas mono sí se usan dentro de componentes (escena de plan, modal, pie de panel, encabezados de tabla).
- Ejemplos rotulados "Ejemplo ilustrativo"; precios con su nota de provisionales.

---

## 9. Checklist antes de entregar

- [ ] ¿Solo colores de la paleta y del termómetro derivado, sobre obsidiana?
- [ ] ¿Algún `border-radius` o `box-shadow`? → quitarlo.
- [ ] ¿Vino o lila gris pequeño como texto? → champagne o lila muted.
- [ ] ¿Orbitron o degradado metálico fuera del logotipo o de un nombre de nivel?
- [ ] ¿`--fx-accent` en texto? → solo marcas e íconos.
- [ ] ¿Vidrio o chaflán fuera de la vía alterna? ¿Tarjetas de plan con listas de checks fuera de "Comparar"?
- [ ] ¿Íconos Lucide con trazo 1.5?
- [ ] ¿Em-dashes, eyebrows de sección, cifras inventadas o testimonios?
- [ ] ¿Funciona a 375px y con movimiento reducido?

## Fuente de verdad

Si algo aquí contradice el producto, gana el código: `src/index.css`, luego `src/components/*.tsx` y `src/plans.ts`.
