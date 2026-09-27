import { useCallback, useState } from 'react';

// The Dark-First Rule: oscuro por defecto. El claro solo existe como elección de la persona
// (razón 5 del sistema) y se recuerda; nunca se sigue prefers-color-scheme.
export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'forgex-theme';
// Color de la barra del navegador; en claro, el hueso de la página ya templada.
const THEME_COLOR: Record<Theme, string> = { dark: '#0b0a0c', light: '#d9cdc2' };

// index.html aplica la elección antes del primer pintado; aquí solo se lee.
const currentTheme = (): Theme =>
  typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === 'light') root.dataset.theme = 'light';
  else delete root.dataset.theme;
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[theme]);
  try {
    if (theme === 'light') localStorage.setItem(STORAGE_KEY, 'light');
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Sin almacenamiento (navegación privada): el modo vale solo para esta visita.
  }
};

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light';
      applyTheme(next);
      return next;
    });
  }, []);
  return { theme, toggleTheme };
};

type RGB = [number, number, number];

export interface CanvasPalette {
  glow: RGB; // resplandor ambiental del horno
  halo: RGB; // halo de las piezas calientes
  warm: RGB; // pieza al rojo
  cool: RGB; // pieza templada, conductos, anillos y escuadras
  strand: RGB; // segunda hebra de seda
  ink: RGB; // pulsos, señal y nombres ya transformados
  muted: RGB; // nombres de antes
  solid: RGB; // relleno de la pieza ya forjada
  labelBg: RGB; // placa detrás de cada nombre
  vignette: (heat: number) => number; // opacidad de la viñeta de obsidiana
}

const VINO: RGB = [74, 42, 58];
const VINO_GLOW: RGB = [120, 56, 91];
const CHAMPAGNE: RGB = [214, 198, 176];
const OBSIDIAN: RGB = [11, 10, 12];
const COPPER: RGB = [167, 127, 134]; // glow-color claro: vino-glow + champagne a partes iguales
const mixRGB = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

export const CANVAS_PALETTES: Record<Theme, CanvasPalette> = {
  dark: {
    glow: VINO,
    halo: VINO_GLOW,
    // Núcleo "al rojo": vino-glow aclarado hacia champagne para que se lea sobre obsidiana
    warm: mixRGB(VINO_GLOW, CHAMPAGNE, 0.4),
    cool: CHAMPAGNE,
    strand: CHAMPAGNE,
    ink: [237, 228, 216],
    muted: [150, 132, 150],
    solid: [20, 18, 23],
    labelBg: OBSIDIAN,
    vignette: () => 0.8,
  },
  light: {
    glow: COPPER,
    halo: COPPER,
    warm: VINO_GLOW,
    cool: [102, 95, 86], // piece-cool: champagne con 55% de obsidiana
    strand: [102, 95, 86],
    ink: OBSIDIAN,
    muted: VINO,
    solid: [203, 187, 170], // surface-raised
    labelBg: [217, 205, 194], // hueso de la página
    // Viñeta al 7% que se apaga a medida que la página se templa, para no chocar con los velos
    vignette: (heat) => 0.07 * heat,
  },
};
