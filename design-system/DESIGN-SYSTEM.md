# ForgeX — Sistema de Diseño (documento completo)

> Este documento es la versión completa, sin condensar, del sistema de diseño real de ForgeX. Consolida `DESIGN.md` (raíz del repo), `src/index.css` (implementación real) y los componentes React reales (`ForgeXLogo.tsx`, `Header.tsx`, `HeroSection.tsx`, `Footer.tsx`). No es un resumen: cualquier sesión de Claude Code puede trabajar solo con este archivo sin necesitar releer el código fuente para entender el sistema.
>
> Mantenido en paralelo con el sistema de diseño en Claude Design: https://claude.ai/artifact/3uu7Nx5AzuvkkNyuULWXx6
> Última realineación contra el código real: 2026-09-18.

---

## 1. Overview

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

Técnicamente, esta filosofía se expresa en `--heat`, una variable CSS de 1 (arriba) a 0 (abajo) que `App.tsx` actualiza con el scroll, y de la que depende `--accent`.

---

## 2. Paleta de colores

Obsidiana y champagne cargan la lectura; el vino es luz, nunca texto.

### Primary
- **Champagne Metálico** `#d6c6b0` — material terminado. Bloques de la retícula templada, íconos, precios destacados, texto de acento (estado de la franja, "Recomendado", folio).
- **Champagne Claro** `#ede4d8` — tinta principal sobre obsidiana y fondo del botón primario. Es `--color-ink` en el código.

### Secondary
- **Vino Ciruela Glow** `#78385b` — el "calor". Halos de las piezas dispersas, extremo caliente de la curva de método y del acento, señal de la capa de IA. Solo como luz o marca, jamás texto.
- **Vino Ciruela** `#4a2a3a` — resplandor radial ambiental detrás del cúmulo y tinte de superficie de la capa Max (28–30% sobre obsidiana).
- **Vino Ciruela Light** `#663950` — reservado para tintes; no alcanza contraste de texto.

### Neutral
- **Obsidiana** `#0b0a0c` — fondo de página y de campos.
- **Obsidiana Card** `#121015` — superficie de paneles y celdas de plan.
- **Obsidiana Light** `#141217` — superficie elevada (plan recomendado, burbujas de chat, esqueletos de carga).
- **Lila Muted** `#968496` — texto secundario, etiquetas mono pequeñas, placeholders (contraste 5.6:1).
- **Lila Gris** `#7a6a7a` — solo texto de 18 px o más, íconos inactivos y scrollbar (contraste 3.9:1).
- **Línea** (champagne al 10% — `rgb(214 198 176 / 0.1)`) y **Línea Fuerte** (champagne al 20% — `rgb(214 198 176 / 0.2)`) — divisores y bordes, siguiendo la jerarquía de opacidad del sistema.

### Funcionales
- **Success** `#4a7c59`
- **Error** `#a23a3a` — el rojo no alcanza contraste como texto; se combina con texto champagne claro.

### Tabla de referencia rápida (nombres de token → variable CSS real)

| Nombre en el sistema | Hex/valor | Variable CSS (`src/index.css`) | Uso |
|---|---|---|---|
| Obsidiana | `#0b0a0c` | `--color-obsidian` | Fondo primordial de toda la página, campos |
| Obsidiana Card | `#121015` | `--color-surface` | Superficie de paneles, celdas de plan, base de hud-glass |
| Obsidiana Light | `#141217` | `--color-raised` | Superficie elevada puntual |
| Champagne Claro | `#ede4d8` | `--color-ink` | Texto principal |
| Champagne | `#d6c6b0` | `--color-champagne` | Texto secundario, extremo templado de `--accent` |
| Lila Muted | `#968496` | `--color-ink-muted` | Texto secundario/muted |
| Lila Gris | `#7a6a7a` | `--color-ink-faint` | Texto terciario (≥18px), íconos, decoración |
| Vino Ciruela | `#4a2a3a` | `--color-vino` | Resplandores, tintes, base de `--accent` |
| Vino Ciruela Light | `#663950` | `--color-vino-light` | Tintes de hover no textuales |
| Vino Ciruela Glow | `#78385b` | `--color-vino-glow` | Extremo caliente de `--accent` |
| Línea | 10% champagne | `--color-line` | Borde por defecto |
| Línea Fuerte | 20% champagne | `--color-line-strong` | Borde ghost, campos, hud-glass |
| Success | `#4a7c59` | `--color-success` | Estados exitosos |
| Error | `#a23a3a` | `--color-error` | Estados de error |
| Acento dinámico | calculado | `--color-accent` / `--accent` | Ver Regla del Calor abajo |

### Reglas con nombre

**The Vino Is Light Rule (La Regla del Vino es Luz).** El vino ciruela es resplandor, tinte o marca, nunca texto: sobre obsidiana no llega a 3:1 de contraste.

**The Heat Rule (La Regla del Calor).**
```css
--heat: 1; /* 1 arriba (vino, "caliente"), 0 abajo (templado) — App.tsx lo actualiza con el scroll */
--accent: color-mix(in oklch, var(--color-vino-glow) calc(var(--heat) * 60%), var(--color-champagne));
```
`--accent` = `color-mix(vino-glow 60% × heat, champagne)`. Solo en marcas no textuales: barra de progreso del header, subrayado activo, curva de método, regla superior de Pro y segmentos de la franja de estado. Arriba de la página está caliente y abajo templado. **Nunca** color de texto.

---

## 3. Tipografía

**Display Font:** Archivo Variable (eje de peso 100–900, eje de ancho `wdth` 62–125%)
**Label/Mono Font:** IBM Plex Mono 400/500
**Plan Mark Font:** Orbitron 700

**Carácter:** una grotesca industrial cuyo ancho cambia con la narrativa. Los titulares comprimidos se leen como metal trabajado; el mono aporta la honestidad técnica en datos y etiquetas.

### Jerarquía completa

| Estilo | Familia | Tamaño | Peso | Line-height | Letter-spacing | Ancho (`wdth`) | Uso |
|---|---|---|---|---|---|---|---|
| **Display** | Archivo Variable | `clamp(2.75rem, 5.7vw, 5.75rem)` | 600 | 0.98 | -0.025em | 86% | H1 del hero y titulares de cierre. Máximo 2 líneas en escritorio. |
| **Headline** | Archivo Variable | `clamp(2.25rem, 4.6vw, 4rem)` | 600 | 1.02 | -0.025em | 86% | H2 de sección, en oración, sin mayúsculas. |
| **Title** | Archivo Variable | `2.125rem` | 600 | 1.1 | -0.015em | 88–94% | Títulos de etapa y de paso. |
| **Body** | Archivo Variable | 17–18px (`1.0625rem`) | 400 | 1.65 | — | 100% | Párrafos a 34–38rem de ancho máximo, en lila muted. |
| **Label** | IBM Plex Mono | 11–12px (`0.75rem`) | 400 | 1.4 | — | — | Metadatos, encabezados de columna, "Ejemplo ilustrativo". |
| **Plan Mark** | Orbitron | 15–24px (`1.125rem` base) | 700 | — | 0.16–0.2em | — | Mayúsculas, degradado metálico. Solo BÁSICO, PLUS, PRO, ADVANCE, MAX. |
| **Logotype** | Orbitron | 14–20px según tamaño (sm/md/lg) | 700 | 1 | 0.2em (sm) / 0.24em (md) / 0.28em (lg) | — | Wordmark FORGEX del header/footer. Champagne sólido, **nunca gradiente**. |

### Reglas con nombre

**The Width Is Meaning Rule (El Ancho es Significado).** El eje de ancho `wdth` comunica estado, no es un ajuste decorativo libre. Titulares al 86% (comprimido = tensión, "forjado"). Precios de plan a 62/78/94/110/125% según el nivel — en el escenario de planes el ancho del precio se estira de forma continua con el scroll: la misma materia cambiando de estado.

**The Orbitron Fence Rule (El Cerco de Orbitron).** Orbitron solo aparece en dos lugares de todo el sistema: el logotipo y los nombres de nivel de plan. Nunca en titulares de sección (H1/H2), navegación, cuerpo o botones.

**The Metallic Mark Rule (La Marca Metálica).** El degradado metálico de texto vive **solo** en los nombres de nivel de plan (BÁSICO/PLUS/PRO/ADVANCE/MAX), nunca en el logotype pequeño del header/footer:
```css
@utility text-metallic {
  background-image: linear-gradient(135deg, #fff6eb 0%, #d6c6b0 45%, #9e8972 80%, #d6c6b0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
```

### Imports reales (`src/index.css`)

```css
@import "@fontsource-variable/archivo/wdth.css";
@import "@fontsource/ibm-plex-mono/400.css";
@import "@fontsource/ibm-plex-mono/500.css";
@import "@fontsource/orbitron/700.css";
```

Paquetes npm: `@fontsource-variable/archivo`, `@fontsource/ibm-plex-mono`, `@fontsource/orbitron`.

---

## 4. Logo / Isotipo

### Geometría real

El isotipo (`src/components/ForgeXLogo.tsx`) es una composición de **4 formas de "pétalo"** en las cuatro esquinas de un cuadrado, cada una un cuadrilátero con curva cóncava hacia el centro, más un **rombo curvo central** pequeño que marca el punto de encuentro:

- Path base de cada pétalo: `M0 0H275V121Q275 161 213 181Q109 87.5 0 0Z`, replicado con reflejos horizontal y vertical en las 4 esquinas (transforms `translate/scale`).
- Rombo central: `M290 160Q302 188 330 200Q302 212 290 240Q278 212 250 200Q278 188 290 160Z`.
- `viewBox="225 80 550 550"` — recortado y centrado sobre el arte real (un `viewBox` de `0 0 1000 1000` sin recortar deja el trazo ~14% desplazado hacia arriba del centro; **no usar esa versión**).

### Degradado metálico del isotipo (joyero, 6 paradas, vertical)

```
linearGradient (gradientUnits="userSpaceOnUse", x1=500 y1=205, x2=500 y2=505)
  offset 0     → #F6EFE4
  offset 0.20  → #D6C6B0
  offset 0.46  → #9B8770
  offset 0.56  → #C4B29A
  offset 0.78  → #F1E8DA
  offset 1     → #BFAC93
```

### Código fuente completo del componente

```tsx
import React, { useId } from 'react';

interface ForgeXLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
}

export const ForgeXLogo: React.FC<ForgeXLogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
}) => {
  const gradientId = `forgex-isotype-grad-${useId()}`;

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-sm tracking-[0.2em]',
    md: 'text-base tracking-[0.24em]',
    lg: 'text-xl tracking-[0.28em]',
  };

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Jeweler Gradient Isotype. viewBox recortado y centrado sobre el arte real
          (antes 0 0 1000 1000 dejaba el trazo ~14% desplazado hacia arriba del centro). */}
      <svg
        aria-hidden="true"
        className={`${iconSizes[size]} shrink-0`}
        viewBox="225 80 550 550"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="500" y1="205" x2="500" y2="505">
            <stop offset="0" stopColor="#F6EFE4" />
            <stop offset="0.20" stopColor="#D6C6B0" />
            <stop offset="0.46" stopColor="#9B8770" />
            <stop offset="0.56" stopColor="#C4B29A" />
            <stop offset="0.78" stopColor="#F1E8DA" />
            <stop offset="1" stopColor="#BFAC93" />
          </linearGradient>
        </defs>
        <g fill={`url(#${gradientId})`} transform="translate(282.5 205) scale(0.75)">
          <g transform="translate(0 0) scale(1 1)">
            <path d="M0 0H275V121Q275 161 213 181Q109 87.5 0 0Z" />
          </g>
          <g transform="translate(580 0) scale(-1 1)">
            <path d="M0 0H275V121Q275 161 213 181Q109 87.5 0 0Z" />
          </g>
          <g transform="translate(0 400) scale(1 -1)">
            <path d="M0 0H275V121Q275 161 213 181Q109 87.5 0 0Z" />
          </g>
          <g transform="translate(580 400) scale(-1 -1)">
            <path d="M0 0H275V121Q275 161 213 181Q109 87.5 0 0Z" />
          </g>
          <path d="M290 160Q302 188 330 200Q302 212 290 240Q278 212 250 200Q278 188 290 160Z" />
        </g>
      </svg>

      {showWordmark && (
        <div className="flex flex-col">
          <span className={`font-wordmark font-bold text-ink leading-none ${textSizes[size]}`}>
            FORGEX
          </span>
        </div>
      )}
    </div>
  );
};
```

(Copia idéntica disponible en `reference/ForgeXLogo.tsx` dentro de esta carpeta.)

### Tamaños

| Tamaño | Icono | Wordmark | Tracking |
|---|---|---|---|
| `sm` | 24×24px (`w-6 h-6`) | 14px (`text-sm`) | 0.2em |
| `md` | 36×36px (`w-9 h-9`) | 16px (`text-base`) | 0.24em |
| `lg` | 48×48px (`w-12 h-12`) | 20px (`text-xl`) | 0.28em |

### Reglas de uso

- El wordmark FORGEX junto al isotipo va **siempre en Orbitron 700, champagne sólido** (`text-ink`) — nunca con el degradado metálico. El degradado metálico está reservado exclusivamente a los nombres de nivel de plan (ver §3, Metallic Mark Rule).
- El isotipo nunca se recolorea fuera de su degradado joyero de 6 paradas.
- `showWordmark={false}` para usos solo-icono (favicons, marcas de agua pequeñas).

---

## 5. Layout

Contenedor de 1400 px máximo con gutters de 16 / 24 / 40 px (`gutter-mobile: 16px`, `gutter-desktop: 40px`). Secciones con 112–160 px de padding vertical (`spacing.section: 160px`). Ninguna sección repite familia de layout:

- **Hero:** tipografía cinética a la izquierda con canvas a la derecha.
- **Inventario:** filas "antes → después" con línea que se dibuja.
- **Recorrido:** texto que avanza a la izquierda y panel fijo (sticky) a la derecha.
- **Método:** estaciones sobre una curva de enfriamiento.
- **Planes:** escenario fijo a pantalla completa con troncal (Básico, Pro, Max) y vía alterna (Plus, Advance) como panel superpuesto, e índice de doble riel; en móvil, secuencia lineal.
- **Preguntas:** bloque apilado y desplazado a la derecha.
- **Contacto:** titular de 7 columnas con formulario de 5.

Debajo de 1024 px todo colapsa a una columna explícita; el recorrido pasa de panel fijo a paneles estáticos por etapa.

---

## 6. Elevation & Depth

Plano por defecto. La profundidad viene del canvas (perspectiva, resplandores vino, viñeta) y de capas tonales de obsidiana, no de sombras. La única sombra es la táctil del sistema, en hover de celdas de plan, junto con un levantamiento de 4 px.

### Vocabulario de sombra

- **Glass Hover** — única sombra compuesta del sistema, en hover de una celda de plan en el escenario de precios, acompañada de `translateY(-4px)`:
```css
box-shadow: 0 15px 35px -10px rgba(74, 42, 58, 0.4), inset 0 1px 0 rgba(214, 198, 176, 0.2);
```

### Regla con nombre

**The Flat Surface Rule (La Regla de la Superficie Plana).** Las superficies están planas en reposo. La luz pertenece al canvas, no a los contenedores.

---

## 7. Shapes

**Radio 0 en absolutamente todo:** botones, campos, paneles, celdas, tokens y marcadores. Las juntas entre celdas son líneas de 1px de champagne al 10%. La única geometría curva del sistema es la del canvas (halos, anillos del toque, hebras de seda) y la curva de enfriamiento — nunca en componentes de UI.

Únicas dos excepciones, ambas acotadas exclusivamente al panel "vía alterna" del escenario de precios:

```css
/* Vidrio — única excepción de vidrio del sistema */
@utility hud-glass {
  background-color: rgb(18 16 21 / 0.72);
  border: 1px solid var(--color-line-strong);
  -webkit-backdrop-filter: blur(20px) saturate(1.1);
  backdrop-filter: blur(20px) saturate(1.1);

  @media (prefers-reduced-transparency: reduce) {
    background-color: var(--color-surface);
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
}

/* Chaflán — única excepción de forma, en el interruptor de la vía alterna */
@utility chamfer {
  clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
}
```

---

## 8. Componentes

### Buttons

- **Forma:** rectángulo sin radio (0 px).
- **Primary:** champagne claro sobre obsidiana, 14×22px, Archivo 500 a 15px. Hover: champagne y levantamiento de 2px. Active: 1px abajo y escala 0.99.
- **Ghost:** transparente con borde de línea fuerte; en hover, borde champagne claro.
- **Etiquetas:** un verbo por intención en toda la página — "Encontrar mi plan", "Elegir {nivel}", "Quiero empezar".

```css
@utility btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  white-space: nowrap;
  padding: 0.875rem 1.375rem;
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1;
  transition:
    background-color 200ms var(--ease-forge),
    border-color 200ms var(--ease-forge),
    color 200ms var(--ease-forge),
    transform 120ms var(--ease-forge);

  &:active:not(:disabled) {
    transform: translateY(1px) scale(0.99);
  }
}

@utility btn-primary {
  background-color: var(--color-ink);
  color: var(--color-obsidian);
  border: 1px solid var(--color-ink);

  &:hover:not(:disabled) {
    background-color: var(--color-champagne);
    border-color: var(--color-champagne);
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
  }
}

@utility btn-ghost {
  background-color: transparent;
  color: var(--color-ink);
  border: 1px solid var(--color-line-strong);

  &:hover:not(:disabled) {
    border-color: var(--color-ink);
  }
}
```

Solo dos variantes en todo el sistema: `btn-primary` y `btn-ghost`. Sin pastillas, sin sombra de elevación.

### Inputs / Fields

- **Estilo:** fondo obsidiana, borde de línea fuerte, sin radio, 12×14px.
- **Focus:** borde champagne; anillo global champagne de 2px con separación de 3px.
- **Error:** ícono en rojo de error y texto en champagne claro (el rojo no alcanza contraste como texto).

```css
@utility field {
  width: 100%;
  background-color: var(--color-obsidian);
  border: 1px solid var(--color-line-strong);
  color: var(--color-ink);
  padding: 0.75rem 0.875rem;
  font-size: 0.9375rem;
  transition: border-color 200ms var(--ease-forge);

  &::placeholder {
    color: var(--color-ink-muted);
  }

  &:hover {
    border-color: var(--color-ink-muted);
  }

  &:focus {
    outline: none;
    border-color: var(--color-champagne);
  }
}
```

### Navigation (Header)

- Header sólido obsidiana de 64px con borde inferior de línea.
- Enlaces Archivo de 15px en lila muted, que pasan a champagne claro con un subrayado de 2px en `--accent` cuando la sección está activa.
- Barra de progreso de 2px en `--accent` en el borde inferior, animada con el scroll de la página (implementada con `motion.div` sobre un `MotionValue` de progreso en `Header.tsx`).
- Incluye `ForgeXLogo` (tamaño md), toggle de audio, botón de diagnóstico.

### Franja de estado (signature)

Barra fija inferior de 40px con el estado actual (champagne, con transición vertical), su descripción, seis segmentos de avance, la cuenta "Piezas 72 · Perdidas 0" y los controles del fondo (vista plana/3D, guardar el fotograma actual como imagen). z-index 20.

### Token de recorrido (signature)

Palabra en IBM Plex Mono de 14px, en caja de borde fuerte sobre obsidiana, con ancho fijo (7.25rem) para que su viaje con `layoutId` (Framer Motion) no deforme el texto. Los mismos cinco tokens (Café Central, Menú, Fidelidad, Reseñas, WhatsApp) existen en todas las etapas — nunca desaparecen, solo cambian de posición.

### Escenario de planes: troncal y vía alterna (signature)

En escritorio (sin movimiento reducido), un escenario `sticky` de 100dvh dura 100dvh + 276vh de scroll y presenta los niveles como títulos de película sobre el canvas vivo, con un velo izquierda→derecha (obsidiana 94% → 10%).

- **Troncal (Básico, Pro, Max):** la toma general. Nombre en Orbitron metálico monumental (`clamp(3.25rem, 6.6vw, 6.5rem)`), precio en Archivo 600 (`clamp(4rem, 8vw, 7.25rem)`) con el ancho que se estira con el scroll y, a la derecha, una frase de valor (21px), una línea de lo que incluye (16px, lila muted) y botón. Una sola etiqueta mono arriba: verbo y, si aplica, distintivo ("Recomendado" en Pro). Pro lleva botón primario; Max, resplandor vino detrás del nombre. Peso 1 en el tiempo de pantalla.
- **Vía alterna (Plus, Advance):** oferta completa para una situación concreta, no un plan de segunda. Entra descendiendo como panel `hud-glass` sobre la troncal anterior, que queda congelada detrás (opacidad 0.2, blur 4px, escala 0.985). Vidrio limpio, sin ornamentos: etiqueta "Vía alterna", nombre metálico (`clamp(2.5rem, 4.4vw, 4rem)`), precio en `ink` y línea de lo que incluye a la izquierda; a la derecha, "Elígelo si" con 2 condiciones a 17px y el botón interruptor achaflanado (`chamfer`). Peso 0.8.
- **Índice de doble riel:** troncal vertical con los 3 nodos cuadrados y un apartadero a 45° por cada vía alterna, que sale, sostiene su estación y regresa a la troncal. Un cabezal de lectura avanza por la troncal y salta con spring al apartadero activo; cada estación (solo el nombre, sin precio) es un botón que lleva a su escena.
- **Transición:** fundido con desenfoque en ventanas fijas; solo la escena activa es enfocable (`inert` en las demás, incluida la troncal congelada).
- **Móvil y movimiento reducido:** la misma red en secuencia lineal; la troncal como escenas altas de 80svh y la vía alterna como el mismo panel de vidrio en línea.
- Debajo del escenario: "Comparar los 5 niveles" (acordeón) y la nota de precios provisionales.

**The One Message Rule (Regla del Mensaje Único).** Cada escena de planes dice una sola cosa: nombre, precio, una frase de valor, una línea de lo que incluye y un botón. Las listas con checks viven solo en "Comparar los 5 niveles". Desde el estado "Automatiza" las etiquetas del canvas se desvanecen para no competir con el texto.

---

## 9. Sistema de capas (z-index)

| Capa | z-index | Contenido |
|---|---|---|
| Canvas | 0 | Lienzo de fondo / scrollytelling (72 piezas) |
| Contenido | 10 | Secciones de la página |
| Ledger | 20 | Franja de estado / ledger persistente |
| Header | 30 | Header fijo con barra de avance `--accent` |
| Grano | 40 | `.forge-grain::after` — retícula de ruido fija, opacidad 0.045, nunca sobre contenedores con scroll |
| Modal | 50 | Diagnóstico, modales |

```css
.forge-grain::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  opacity: 0.045;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

---

## 10. Animación

`--ease-forge: cubic-bezier(0.16, 1, 0.3, 1)` — única curva de easing del sistema, usada en transiciones de color/borde (200ms) y transform (120ms). Respeta `prefers-reduced-motion: reduce` (scroll instantáneo, sin animar; `html { scroll-behavior: auto }`).

El hero (`HeroSection.tsx`, componente `ScatteredWord`) anima cada letra de la palabra "disperso." desde una posición dispersa (lila muted, rotada) hacia su posición ensamblada (champagne), coherente con la metáfora de forja — con spring animation vía Framer Motion.

Stack de animación: paquete `motion` (^12.23.24), `lucide-react` (^0.546.0) para iconografía.

---

## 11. Do's and Don'ts

### Do:
- Usar la paleta ForgeX exacta; cualquier intermedio sale de mezclar vino y champagne.
- Conservar elementos entre estados (piezas, tokens, respuestas del visitante) en lugar de hacerlos desaparecer.
- Rotular todo ejemplo como "Ejemplo ilustrativo" y los precios como provisionales.
- Respetar `prefers-reduced-motion`: el canvas se redibuja solo al cambiar el scroll y los viajes de tokens son instantáneos.
- Usar Archivo Variable para todo título, cuerpo y botón.
- Mantener radio 0 en todo — sin excepciones fuera de hud-glass/chamfer.
- Usar `--accent` solo en marcas no textuales.
- Confinar Orbitron al logotype y a los nombres de plan.

### Don't:
- No usar vino ciruela ni lila gris como texto pequeño.
- No usar radios, botones pill, vidrio decorativo ni retículas de fondo de líneas.
- No poner eyebrows sobre titulares de sección ni numerar secciones.
- No usar Orbitron ni degradado metálico fuera del logotipo y los nombres de nivel.
- No usar em-dashes en ningún texto visible.
- No usar Orbitron en títulos de sección, H1 ni navegación.
- No añadir pastillas ni esquinas redondeadas a botones o tarjetas nuevas.
- No extender `hud-glass` a componentes fuera del panel de vía alterna.

---

## 12. Componentes con firma propia aún sin preview estático

Estos requieren lógica de scroll/estado que un preview estático no puede demostrar fielmente sin aproximar de más — implementados en el producto real, documentados arriba (§8), pero sin una réplica visual aislada en el sistema de Claude Design:

- Franja de estado / ledger
- Token de recorrido
- Escenario de planes (troncal y vía alterna)
- Lienzo de scrollytelling (72 piezas)

---

## 13. Checklist antes de añadir algo nuevo

- ¿Tiene `border-radius > 0`? → No, salvo que sea literalmente el panel de vía alterna de precios.
- ¿Usa Orbitron? → No, salvo que sea el logotype o un nombre de plan.
- ¿Usa vino ciruela como color de texto? → No, nunca.
- ¿Necesita un tercer color de acento nuevo? → Probablemente no — `--accent` ya cubre las marcas dinámicas; si hace falta algo estático, usar champagne o ink.
- ¿Usa sombra de elevación en una tarjeta o botón estándar? → No — el sistema es plano por diseño; la única sombra es `shadow-glass-hover`, exclusiva de la vía alterna.
- ¿El eje `wdth` tiene un valor distinto a 100% sin justificación semántica? → Revisar contra la Regla del Ancho es Significado.

---

## 14. Referencias y fuente de verdad

Esta carpeta consolida el sistema para consumo rápido, pero ante cualquier duda o conflicto, gana siempre, en este orden:

1. `src/index.css` (implementación real — raíz del repo)
2. `src/components/ForgeXLogo.tsx`, `Header.tsx`, `HeroSection.tsx`, `Footer.tsx` (componentes reales)
3. `DESIGN.md` (raíz del repo)
4. Este documento

Ver también en esta carpeta: `tokens.json` (tokens estructurados) y `reference/` (copias de los archivos fuente reales: `ForgeXLogo.tsx`, `index.css`, `DESIGN.md`).
