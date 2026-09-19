/taste-skill

# Rediseño ForgeX: "Nada desaparece; todo se transforma"

## Modo
Redesign de una landing existente (React 19 + Vite + Tailwind 4 + Motion, servida por Express en `server.ts`). Sigue tu Redesign Protocol (sección 11): **audita primero, luego transforma**. Lee `PRODUCT.md` antes de tocar nada; es la fuente de verdad de producto, audiencia, precios y restricciones.

Design Read esperado (ajústalo si tu lectura difiere, pero decláralo antes de escribir código):
> Landing de infraestructura digital para dueños de PyMEs mexicanas, con un lenguaje industrial-editorial de "forja y conservación de la materia", apoyado en Tailwind v4 + Motion + canvas propio, sin design system externo.

Dials: `DESIGN_VARIANCE: 8`, `MOTION_INTENSITY: 7`, `VISUAL_DENSITY: 4`. Modo: **overhaul del lenguaje visual, preservación total de la funcionalidad**.

## El concepto (esto es lo que debe sentirse en cada sección)
Ley de Lavoisier aplicada a la operación de una PyME: **nada desaparece; todo se transforma.**

Los chats de WhatsApp, las hojas de Excel y las cotizaciones sueltas del cliente no se tiran ni se reemplazan por "otro SaaS": se conservan y se reorganizan en infraestructura. Esa es también una verdad del producto (migrar, no descartar), así que el concepto no es decoración, es el argumento de venta.

Traduce el concepto a mecánicas concretas, no a un slogan pegado en el hero:

1. **Conservación visible.** Los mismos elementos que aparecen como caos al inicio (nodos del canvas en `ScrollytellingCanvas.tsx`: `WA_CHAT_98`, `XLSX_INVENTARIO`, `COTIZACION_PENDIENTE`...) deben seguir existiendo hasta el final, reordenados. Un contador persistente tipo ledger puede hacerlo explícito: la entropía baja fase a fase, pero el número de elementos se mantiene ("72 elementos · 0 perdidos"). Nada entra ni sale de escena sin transformarse en otra cosa.
2. **Transiciones como metamorfosis, no como fades.** Prohibido el fade-in-up genérico por sección. Cada sección debe heredar algo de la anterior: un elemento que cierra una sección es el que abre la siguiente (shared layout / `layoutId`, morph de SVG, recomposición de caracteres). El scroll es una sola transformación continua, no siete bloques apilados.
3. **Tipografía que se recompone.** El titular del hero puede nacer fragmentado (letras o palabras dispersas, como el caos operativo) y ensamblarse con el scroll o al cargar. Úsalo una vez y con intención, no en todos los títulos.
4. **Materia, no pantallas.** La metáfora es de forja: calor, enfriamiento, metal que cambia de estado. Explora un acento que cambie de temperatura con el progreso (incandescente al inicio, templado al final) en lugar de un color de marca fijo. Mantén la base obsidiana/champagne actual como punto de partida (sección 11: los assets de marca son materia prima).
5. **El diagnóstico como transformación del propio visitante.** En `DiagnosticModal.tsx`, las respuestas del usuario (giro, herramientas, cuello de botella) deben reaparecer transformadas en el resultado, no desaparecer tras un "loading". Lo que el usuario escribió es la materia prima del output.
6. **Precios como estados de la misma materia.** Los tres niveles de `PricingSection.tsx` no son tres cards iguales: son la misma infraestructura en distintos estados de escala. Que se lea como una progresión, no como una grilla de SaaS.

## Auditoría previa: AI tells que ya detecto y que deben morir
Confírmalos en el código, agrega los que encuentres, y reporta la lista antes de editar:

- **Cuatro familias tipográficas** (Orbitron, Space Grotesk, Outfit, IBM Plex Mono) cargadas por `<link>` de Google Fonts. Reduce a 2 (máximo 3 con una mono) con carácter real, auto-hospedadas con `@font-face` + `font-display: swap`. Orbitron en mayúsculas con tracking amplio es el tell "sci-fi de plantilla" número uno de esta página.
- **TODO EN MAYÚSCULAS** con tracking ancho en headings, subtítulos, botones y labels. Deja las mayúsculas para micro-labels puntuales.
- **Hero centrado** con eyebrow pill (`rounded-full` + puntito), H1, H2, párrafo, dos botones y **tres cards** debajo. Es la plantilla exacta. Rómpela.
- **`rounded-full` 34 veces, `backdrop-blur-md` 13 veces**, `rounded-xl/2xl` en todo. Define un sistema de radios y materiales coherente con "metal forjado" (probablemente radios mínimos, bordes duros, superficies con textura, no vidrio).
- **Fake telemetry decorativa**: `animate-ping` "ENLACE VIVO", "LATENCY: 1.2s", "MARGIN: +34%", "ENTROPÍA CONTROLADA", `// ` en cada label. Si un dato no es real o no está marcado como ilustrativo, se va (ver restricciones).
- **Verde esmeralda `#10B981`** como acento de "estado OK": genérico. Sustitúyelo por algo derivado del concepto de temperatura/forja.
- **`animate-bounce`** en la flecha de scroll y el texto "SCROLL // INICIA SECUENCIA DE TRANSFORMACIÓN".
- **Emojis, em-dashes y copy tipo marketing de IA** en todo el sitio (respeta tu em-dash ban, sección 9.G).
- **Scroll en `useState`** en `App.tsx` (`setScrollProgress` en cada evento de scroll re-renderiza todo el árbol). Migra a `useScroll` / `useMotionValue` / `useTransform` de `motion/react` y pasa el progreso al canvas como motion value o ref.

## Restricciones no negociables
- **Idioma:** todo el copy en español de México. Precios en MXN.
- **Precios reales, sin cambios:** Nivel 01 Essential Automation $2,000 MXN/mes, Nivel 02 Growth Infrastructure $5,000 MXN/mes (destacado), Nivel 03 Custom Enterprise Core $10,000 MXN/mes, micro-automatizaciones desde $599 MXN/mes.
- **Cero cifras inventadas.** No hay clientes, testimonios ni casos reales. Las métricas de las simulaciones (ROI +3.8x, $14,200 MXN/mes, etc.) deben quedar rotuladas como "ejemplo ilustrativo" o eliminarse. No inventes logos, testimonios ni "+500 empresas".
- **Preserva toda la funcionalidad:** modal de diagnóstico con `/api/diagnose` (y su fallback sin API key), `VeoVideoModal` + video scrubbeado por scroll, formulario de `CtaSection` hacia `/api/audit-inquiry` con tier pre-llenado desde precios y diagnóstico, `AudioEngine`, navegación por secciones (`hero, diagnostico, divisiones, ciclo, precios, gobernanza, contacto`) y los `id` de botones existentes. No toques `server.ts` salvo que sea imprescindible, y dilo si lo haces.
- **Iconos:** el proyecto ya usa `lucide-react`. Mantén una sola familia; si migras a Phosphor, hazlo completo, no mezcles.
- **Accesibilidad y rendimiento:** `prefers-reduced-motion` obligatorio (la transformación debe entenderse también en estático), contraste AA sobre el fondo oscuro, foco visible, animaciones solo con `transform`/`opacity`, el canvas pausado fuera de viewport, sin CLS por fuentes.
- **Mobile real:** a 375 px el concepto debe seguir leyéndose, no solo "apilarse". Sin scroll horizontal.
- **Tono:** industrial, preciso, técnico, sin clichés ("revoluciona", "potencia", "lleva al siguiente nivel", "soluciones innovadoras" quedan prohibidos). Frases cortas. Verbos de materia: fundir, templar, conservar, recomponer, migrar.

## Copy
Reescribe el copy bajo el concepto, conservando los hechos de `PRODUCT.md`. Ejemplos de dirección (no los copies tal cual si encuentras algo mejor):
- Hero: la idea de que la operación del cliente ya existe y no se pierde, se reforja. Algo en la línea de "Tu operación ya existe. Solo está en estado disperso."
- Fases del scrollytelling (`PHASES` en `App.tsx`): renómbralas como estados de la materia/proceso de forja, manteniendo el significado operativo de cada una.
- CTA final: cierre del ciclo, el visitante entrega su "materia prima" (el formulario) para ser transformada.

## Entregables y orden de trabajo
1. **Design Read + dials** en una línea.
2. **Auditoría**: lista de tells confirmados, qué se preserva y qué se transforma (sección 11.B).
3. **Sistema**: tokens de color (incluida la escala de temperatura), tipografía, radios, espaciado y motion en `src/index.css` como variables de Tailwind v4 (`@theme`).
4. **Implementación sección por sección**, en este orden: `App.tsx` (scroll a motion values) → `ScrollytellingCanvas` → `HeroSection` → `Header` → `DiagnosticSection` + `DiagnosticModal` → `PlatformDivisionsSection` → `EconomicCycleSection` → `PricingSection` → `GovernanceFaqSection` → `CtaSection` → `Footer`.
5. **Verificación**: `npm run lint` sin errores, levanta el dev server y revisa en navegador a 1440 px y 375 px, con y sin reduced motion. Prueba el flujo completo: diagnóstico → selección de tier → formulario prellenado.
6. **Pre-flight check** de la skill y un resumen final: qué cambió, qué tells se eliminaron, y dónde exactamente se manifiesta "nada desaparece; todo se transforma" en la página.

Si algo del concepto choca con una restricción, gana la restricción y me lo dices.
