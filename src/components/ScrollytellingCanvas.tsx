import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react';
import { Box, Camera } from 'lucide-react';
import { ScrollyPhase } from '../types';

interface ScrollytellingCanvasProps {
  progress: MotionValue<number>;
  activePhase: ScrollyPhase;
  phaseIndex: number;
  phaseCount: number;
}

interface Piece {
  baseX: number;
  baseY: number;
  baseZ: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  size: number;
  pulse: number;
}

const PIECE_COUNT = 72;
const GRID_COLS = 8;

// Cada pieza etiquetada tiene un nombre antes y después. Nunca se pierde; cambia de estado.
const LABELS: Array<[string, string]> = [
  ['tarjeta de presentación', 'toque NFC'],
  ['cartel en el mostrador', 'código QR'],
  ['menú impreso', 'menú digital'],
  ['sellos en papel', 'tarjeta de fidelidad'],
  ['reseña pendiente', 'reseña a un toque'],
  ['número de WhatsApp', 'botón de WhatsApp'],
  ['folleto', 'Mini Hub'],
  ['fotos en el celular', 'galería'],
  ['promo en la pizarra', 'promociones propias'],
  ['pedido por mensaje', 'pedido con aviso'],
  ['pregunta repetida', 'respuesta asistida'],
  ['dirección dictada', 'ubicación en mapa'],
];

// Paleta ForgeX: el calor es vino, el temple es champagne.
const VINO = [74, 42, 58];
const VINO_GLOW = [120, 56, 91];
const CHAMPAGNE = [214, 198, 176];
const INK = [237, 228, 216];
const LILA_MUTED = [150, 132, 150];
const OBSIDIAN = 'rgb(11, 10, 12)';

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rgba = (c: number[], a: number) => `rgba(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0}, ${a})`;
const mixColor = (a: number[], b: number[], t: number) => [mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t)];
// Núcleo "al rojo": vino-glow aclarado hacia champagne para que se lea sobre obsidiana
const HOT = mixColor(VINO_GLOW, CHAMPAGNE, 0.4);
const heatColor = (s: number) => mixColor(HOT, CHAMPAGNE, s);

// Aleatorio con semilla: la misma dispersión en cada visita.
const seeded = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const createPieces = (): Piece[] => {
  const rand = seeded(1789);
  const rows = Math.ceil(PIECE_COUNT / GRID_COLS);
  return Array.from({ length: PIECE_COUNT }, (_, i) => {
    const angle = (i / PIECE_COUNT) * Math.PI * 5 + rand() * 0.8;
    const radius = 90 + (i % 7) * 46 + rand() * 60;
    const col = i % GRID_COLS;
    const row = Math.floor(i / GRID_COLS);
    return {
      baseX: Math.cos(angle) * radius * 1.15 + (rand() - 0.5) * 90,
      baseY: Math.sin(angle) * radius * 0.78 + (rand() - 0.5) * 90,
      baseZ: (rand() - 0.5) * 360,
      targetX: (col - (GRID_COLS - 1) / 2) * 62,
      targetY: (row - (rows - 1) / 2) * 50,
      targetZ: 0,
      size: 2.4 + (i % 3) * 0.9,
      pulse: rand() * Math.PI * 2,
    };
  });
};

// Recorrido de la señal en "Piensa": la retícula leída fila por fila, en zigzag.
const SIGNAL_PATH: number[] = Array.from({ length: PIECE_COUNT }, (_, k) => {
  const row = Math.floor(k / GRID_COLS);
  const col = k % GRID_COLS;
  return row * GRID_COLS + (row % 2 === 0 ? col : GRID_COLS - 1 - col);
});

// Enlaces rotos del estado disperso: pocos, deterministas, sin parpadeo.
const LOOSE_LINKS: Array<[number, number]> = Array.from({ length: PIECE_COUNT }, (_, i) => i)
  .filter((i) => i % 3 === 0)
  .map((i) => [i, (i * 7 + 11) % PIECE_COUNT] as [number, number]);

export const ScrollytellingCanvas: React.FC<ScrollytellingCanvasProps> = ({
  progress,
  activePhase,
  phaseIndex,
  phaseCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraMode, setCameraMode] = useState<'perspective' | 'ortho'>('perspective');
  const cameraModeRef = useRef(cameraMode);
  const reduceMotion = useReducedMotion();

  cameraModeRef.current = cameraMode;

  // Guarda el fotograma actual de la forja como imagen: una postal de este estado, generada en el navegador.
  const handleSaveSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `forgex-${activePhase.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const pieces = createPieces();
    const sx = new Float32Array(PIECE_COUNT);
    const sy = new Float32Array(PIECE_COUNT);
    const sc = new Float32Array(PIECE_COUNT);

    let width = 0;
    let height = 0;
    let dirty = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dirty = true;
    };
    resize();
    window.addEventListener('resize', resize);

    let frame = 0;
    let time = 0;
    let last = performance.now();
    let lastP = -1;
    let lastCamera = cameraModeRef.current;

    const draw = (now: number) => {
      frame = requestAnimationFrame(draw);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (document.hidden) return;

      const p = clamp01(progress.get());
      const camera = cameraModeRef.current;
      if (reduceMotion) {
        // Sin movimiento continuo: solo se redibuja cuando el scroll cambia el estado.
        if (!dirty && p === lastP && camera === lastCamera) return;
      } else {
        time += dt;
      }
      lastP = p;
      lastCamera = camera;
      dirty = false;

      const isDesktop = width >= 1024;
      const isTablet = width >= 768;
      const unit = Math.max(0.55, Math.min(1.15, Math.min(width, height * 1.3) / 1000));

      // Estados: disperso → conecta → presenta → interactúa → automatiza → piensa
      const s = smoothstep(0.12, 0.62, p);
      const connecting = smoothstep(0.12, 0.18, p) * (1 - smoothstep(0.3, 0.38, p));
      const cycling = smoothstep(0.62, 0.72, p);
      const thinking = smoothstep(0.84, 0.96, p);
      const heroShift = isDesktop ? 1 - smoothstep(0.02, 0.14, p) : 0;
      const presence = isTablet
        ? mix(1, 0.42, smoothstep(0.04, 0.14, p)) + 0.18 * thinking
        : mix(0.85, 0.3, smoothstep(0.04, 0.14, p)) + 0.12 * thinking;

      const centerX = width * (0.5 + 0.18 * heroShift);
      const centerY = height * 0.52;
      const pitch = camera === 'ortho' ? 0 : mix(0.6, 0.35, s);
      const yaw = camera === 'ortho' ? 0 : Math.sin(time * 0.07) * 0.22 * (1 - s * 0.6) + (p - 0.5) * 0.5;
      const color = heatColor(s);

      ctx.fillStyle = OBSIDIAN;
      ctx.fillRect(0, 0, width, height);

      // Resplandor vino (plum glow del sistema): fuerte mientras todo está disperso, regresa cuando el sistema piensa
      const glow = (0.6 * (1 - s) + 0.4 * thinking) * presence;
      if (glow > 0.01) {
        const r = 460 * unit;
        const g = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r);
        g.addColorStop(0, rgba(VINO, 0.55 * glow));
        g.addColorStop(1, rgba(VINO, 0));
        ctx.fillStyle = g;
        ctx.fillRect(centerX - r, centerY - r, r * 2, r * 2);
      }

      // Proyección de cada pieza
      for (let i = 0; i < PIECE_COUNT; i++) {
        const n = pieces[i];
        const drift = (1 - s) * 18;
        const x = mix(n.baseX, n.targetX, s) + Math.sin(time * 0.9 + n.pulse) * drift;
        const y = mix(n.baseY, n.targetY, s) + Math.cos(time * 0.7 + n.pulse) * drift;
        const z = mix(n.baseZ, n.targetZ, s);
        const rx = x * Math.cos(yaw) - y * Math.sin(yaw);
        const ry = x * Math.sin(yaw) + y * Math.cos(yaw);
        const persp = 520 / (520 + ry * Math.sin(pitch) - z);
        sc[i] = persp;
        sx[i] = centerX + rx * persp * unit;
        sy[i] = centerY + (ry * Math.cos(pitch) + z * 0.25) * persp * unit;
      }

      ctx.save();
      ctx.globalAlpha = presence;
      ctx.lineWidth = 1;

      // Hebras de seda (piensa): dos cintas vino y champagne que atraviesan la retícula
      if (thinking > 0.01) {
        const t = reduceMotion ? 0 : time;
        for (let k = 0; k < 2; k++) {
          const base = centerY + (k === 0 ? -1 : 1) * 90 * unit;
          const y0 = base + Math.sin(t * 0.31 + k * 2.1) * 60 * unit;
          const cy = base + Math.cos(t * 0.23 + k * 1.3) * 190 * unit;
          const y1 = base + Math.sin(t * 0.27 + k * 3.4) * 60 * unit;
          const tone = k === 0 ? VINO_GLOW : CHAMPAGNE;
          for (let strand = 0; strand < 7; strand++) {
            const off = (strand - 3) * 3.2;
            ctx.strokeStyle = rgba(tone, (k === 0 ? 0.5 : 0.28) * thinking * (1 - Math.abs(strand - 3) / 4.2));
            ctx.beginPath();
            ctx.moveTo(-20, y0 + off);
            ctx.quadraticCurveTo(centerX, cy + off * 1.8, width + 20, y1 + off);
            ctx.stroke();
          }
        }
      }

      // Enlaces rotos (disperso)
      if (s < 0.6) {
        ctx.setLineDash([3, 6]);
        ctx.strokeStyle = rgba(color, 0.22 * (1 - s / 0.6));
        ctx.beginPath();
        for (const [a, b] of LOOSE_LINKS) {
          ctx.moveTo(sx[a], sy[a]);
          ctx.lineTo(sx[b], sy[b]);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Conductos de la retícula (presenta en adelante)
      if (s > 0.3) {
        ctx.strokeStyle = rgba(CHAMPAGNE, 0.3 * smoothstep(0.3, 0.9, s));
        ctx.beginPath();
        for (let i = 0; i < PIECE_COUNT; i++) {
          if (i % GRID_COLS < GRID_COLS - 1) {
            ctx.moveTo(sx[i], sy[i]);
            ctx.lineTo(sx[i + 1], sy[i + 1]);
          }
          if (i + GRID_COLS < PIECE_COUNT) {
            ctx.moveTo(sx[i], sy[i]);
            ctx.lineTo(sx[i + GRID_COLS], sy[i + GRID_COLS]);
          }
        }
        ctx.stroke();
      }

      // Pulsos (automatiza): los procesos corren por lo que antes eran piezas sueltas
      if (cycling > 0 && !reduceMotion) {
        ctx.fillStyle = rgba(INK, 0.9 * cycling * (1 - 0.6 * thinking));
        for (let i = 0; i < PIECE_COUNT; i += 3) {
          const j = i % GRID_COLS < GRID_COLS - 1 ? i + 1 : i + GRID_COLS;
          if (j >= PIECE_COUNT) continue;
          const t = (time * 0.32 + i * 0.137) % 1;
          ctx.beginPath();
          ctx.arc(mix(sx[i], sx[j], t), mix(sy[i], sy[j], t), 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // El toque (conecta): anillos que salen del centro, como acercar el teléfono a una tarjeta NFC
      const rings: number[] = [];
      const ringMax = 480 * unit;
      if (connecting > 0.01) {
        const phase = reduceMotion ? 0.4 : (time * 0.42) % 1;
        rings.push(phase * ringMax, ((phase + 0.5) % 1) * ringMax);
        rings.forEach((r) => {
          ctx.strokeStyle = rgba(CHAMPAGNE, 0.5 * connecting * (1 - r / ringMax));
          ctx.beginPath();
          ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
          ctx.stroke();
        });
      }

      // Piezas: resplandor vino que se templa hasta volverse bloque champagne
      for (let i = 0; i < PIECE_COUNT; i++) {
        const n = pieces[i];
        const size = (n.size + (reduceMotion ? 0 : Math.sin(time * 1.6 + n.pulse) * 0.5 * (1 - s))) * sc[i] * unit * 1.25;

        if (s < 0.7) {
          const halo = ctx.createRadialGradient(sx[i], sy[i], 0, sx[i], sy[i], size * 4.2);
          halo.addColorStop(0, rgba(VINO_GLOW, 0.6 * (1 - s / 0.7)));
          halo.addColorStop(1, rgba(VINO_GLOW, 0));
          ctx.fillStyle = halo;
          ctx.fillRect(sx[i] - size * 4.2, sy[i] - size * 4.2, size * 8.4, size * 8.4);
        }

        // Cuando pasa el anillo del toque, la pieza responde
        let touched = 0;
        if (rings.length) {
          const d = Math.hypot(sx[i] - centerX, sy[i] - centerY);
          rings.forEach((r) => {
            touched = Math.max(touched, 1 - Math.min(1, Math.abs(d - r) / 22));
          });
          touched *= connecting;
        }

        const radius = size * (1 - s);
        const tone = touched > 0 ? mixColor(color, INK, touched) : color;
        ctx.fillStyle = s > 0.5 ? 'rgb(20, 18, 23)' : rgba(tone, 0.95);
        ctx.strokeStyle = rgba(tone, 0.95);
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(sx[i] - size, sy[i] - size, size * 2, size * 2, radius);
        } else {
          ctx.rect(sx[i] - size, sy[i] - size, size * 2, size * 2);
        }
        ctx.fill();
        if (s > 0.5) ctx.stroke();
      }

      // La señal (piensa): recorre la retícula e ilumina módulos en secuencia
      if (thinking > 0.01) {
        const head = reduceMotion ? 27 : Math.floor((time * 7) % PIECE_COUNT);
        for (let t = 0; t < 7; t++) {
          const i = SIGNAL_PATH[(head - t + PIECE_COUNT) % PIECE_COUNT];
          const size = pieces[i].size * sc[i] * unit * 1.25;
          const a = thinking * (1 - t / 7);
          if (t === 0) {
            const g = ctx.createRadialGradient(sx[i], sy[i], 0, sx[i], sy[i], size * 7);
            g.addColorStop(0, rgba(VINO_GLOW, 0.7 * a));
            g.addColorStop(1, rgba(VINO_GLOW, 0));
            ctx.fillStyle = g;
            ctx.fillRect(sx[i] - size * 7, sy[i] - size * 7, size * 14, size * 14);
          }
          ctx.fillStyle = rgba(INK, 0.9 * a);
          ctx.fillRect(sx[i] - size, sy[i] - size, size * 2, size * 2);
        }
      }

      // Escuadras de registro: la pieza terminada
      if (thinking > 0.01) {
        const pad = 22;
        const minX = Math.min(sx[0], sx[PIECE_COUNT - GRID_COLS]) - pad;
        const maxX = Math.max(sx[GRID_COLS - 1], sx[PIECE_COUNT - 1]) + pad;
        const minY = Math.min(sy[0], sy[GRID_COLS - 1]) - pad;
        const maxY = Math.max(sy[PIECE_COUNT - GRID_COLS], sy[PIECE_COUNT - 1]) + pad;
        const arm = 16;
        ctx.strokeStyle = rgba(CHAMPAGNE, 0.7 * thinking);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(minX, minY + arm); ctx.lineTo(minX, minY); ctx.lineTo(minX + arm, minY);
        ctx.moveTo(maxX - arm, minY); ctx.lineTo(maxX, minY); ctx.lineTo(maxX, minY + arm);
        ctx.moveTo(minX, maxY - arm); ctx.lineTo(minX, maxY); ctx.lineTo(minX + arm, maxY);
        ctx.moveTo(maxX - arm, maxY); ctx.lineTo(maxX, maxY); ctx.lineTo(maxX, maxY - arm);
        ctx.stroke();
        ctx.lineWidth = 1;
      }

      // Nombres: cada pieza cambia de nombre, no desaparece
      if (isTablet) {
        ctx.font = '500 11px "IBM Plex Mono", monospace';
        ctx.textBaseline = 'middle';
        const before = 1 - smoothstep(0.32, 0.46, s);
        const after = smoothstep(0.5, 0.66, s);
        LABELS.forEach(([from, to], k) => {
          const i = k * 6;
          const label = before > 0 ? from : to;
          // Desde "Automatiza" los nombres ceden el protagonismo: ahí el texto (planes, preguntas, contacto) es lo que importa
          const alpha = (before > 0 ? before : after) * (1 - 0.85 * Math.max(cycling, thinking));
          if (alpha <= 0.01) return;
          const x = sx[i] + 10;
          const y = sy[i];
          const w = ctx.measureText(label).width;
          ctx.fillStyle = `rgba(11, 10, 12, ${0.8 * alpha})`;
          ctx.fillRect(x - 3, y - 8, w + 6, 16);
          ctx.fillStyle = before > 0 ? rgba(LILA_MUTED, alpha) : rgba(INK, 0.85 * alpha);
          ctx.fillText(label, x, y + 0.5);
        });
      }

      ctx.restore();

      // Viñeta
      const grad = ctx.createRadialGradient(centerX, centerY, Math.min(width, height) * 0.25, centerX, centerY, Math.max(width, height) * 0.75);
      grad.addColorStop(0, 'rgba(11, 10, 12, 0)');
      grad.addColorStop(1, 'rgba(11, 10, 12, 0.8)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    };

    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [progress, reduceMotion]);

  return (
    <>
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <canvas ref={canvasRef} className="block w-full h-full" />
      </div>

      {/* Ledger de conservación: la forma cambia, la cuenta no */}
      <aside aria-label="Estado de la transformación" className="fixed bottom-0 inset-x-0 z-20 h-10 bg-obsidian border-t border-line">
        <div className="max-w-[1400px] mx-auto h-full pl-4 sm:pl-6 lg:pl-10 pr-4 sm:pr-6 md:pr-0 lg:pr-4 flex items-center gap-4 lg:gap-6 text-[13px]">
          <span className="hidden sm:inline font-mono text-[11px] text-ink-muted">Estado</span>
          <span className="relative w-[5.5rem] h-5 overflow-hidden shrink-0">
            <AnimatePresence initial={false}>
              <motion.span
                key={activePhase.id}
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '-100%', opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 font-semibold text-champagne leading-5 [font-stretch:92%]"
              >
                {activePhase.title}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="hidden lg:block text-ink-muted truncate min-w-0">{activePhase.description}</span>

          <div className="ml-auto flex items-center gap-4 lg:gap-6 shrink-0">
            <div className="hidden md:grid gap-[3px] w-24" style={{ gridTemplateColumns: `repeat(${phaseCount}, 1fr)` }} aria-hidden="true">
              {Array.from({ length: phaseCount }, (_, i) => (
                <span
                  key={i}
                  className={`h-[3px] transition-colors duration-500 ${
                    i === phaseIndex ? 'bg-accent' : i < phaseIndex ? 'bg-ink-faint' : 'bg-line-strong'
                  }`}
                />
              ))}
            </div>
            <dl className="flex items-center gap-4 font-mono text-[12px]">
              <div className="flex items-baseline gap-1.5">
                <dt className="text-ink-muted">Piezas</dt>
                <dd className="text-ink tabular-nums">72</dd>
              </div>
              <div className="flex items-baseline gap-1.5">
                <dt className="text-ink-muted">Perdidas</dt>
                <dd className="text-ink tabular-nums">0</dd>
              </div>
            </dl>
          </div>

          <div className="hidden md:flex h-full border-l border-line text-[12px] text-ink-muted shrink-0">
            <button
              id="btn-toggle-camera-mode"
              type="button"
              onClick={() => setCameraMode((prev) => (prev === 'perspective' ? 'ortho' : 'perspective'))}
              className="flex items-center gap-1.5 px-3.5 hover:text-ink hover:bg-raised transition-colors"
            >
              <Box className="w-3.5 h-3.5" strokeWidth={1.5} />
              {cameraMode === 'perspective' ? 'Vista plana' : 'Vista 3D'}
            </button>
            <button
              id="btn-save-snapshot"
              type="button"
              onClick={handleSaveSnapshot}
              title="Guardar el estado actual de la forja como imagen"
              className="flex items-center gap-1.5 px-3.5 border-l border-line hover:text-ink hover:bg-raised transition-colors"
            >
              <Camera className="w-3.5 h-3.5" strokeWidth={1.5} />
              Guardar imagen
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
