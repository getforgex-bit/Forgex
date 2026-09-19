# /design-system

Carpeta de referencia **completa** para que Claude Code (u otra sesión trabajando en este repo) diseñe en coherencia con el sistema real de ForgeX.

## Contenido

- **`DESIGN-SYSTEM.md`** — documento completo y sin condensar: overview, paleta completa, tipografía completa (jerarquía, reglas con nombre), logo/isotipo (geometría, degradado, código fuente del componente, tamaños), layout, elevación, formas, todos los componentes (botones, campos, navegación, franja de estado, token de recorrido, escenario de planes), sistema de capas, animación, do's/don'ts y checklist. Léelo de principio a fin al empezar cualquier tarea de UI, o busca la sección que necesites.
- **`tokens.json`** — los mismos tokens en formato estructurado (color, tipografía, espaciado, radios, sombras, opacidad, tracking).
- **`reference/`** — copias literales de los archivos fuente reales, por si necesitas el original exacto en vez del resumen incrustado en `DESIGN-SYSTEM.md`:
  - `DESIGN.md` — documento de diseño original (frontmatter YAML + prosa)
  - `index.css` — implementación real (`@theme`, utilities, `.forge-grain`)
  - `ForgeXLogo.tsx` — componente React real del isotipo

## Cómo usarla con Claude Code

> "Lee /design-system/DESIGN-SYSTEM.md antes de continuar"

o referencia esta carpeta en un `CLAUDE.md` de raíz si quieres que se cargue automáticamente en cada sesión.

## Fuente de verdad

Esta carpeta es completa, pero sigue siendo una **copia de referencia**. Ante cualquier duda o conflicto entre esta carpeta y el código real del repo, gana el código real, en este orden:

1. `src/index.css` (implementación real)
2. `src/components/*.tsx` (componentes reales)
3. `DESIGN.md` (raíz del repo)
4. Esta carpeta

Mantenida en paralelo con el sistema de diseño en Claude Design: https://claude.ai/artifact/3uu7Nx5AzuvkkNyuULWXx6
