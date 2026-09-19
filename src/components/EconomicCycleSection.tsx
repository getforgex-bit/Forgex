import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

const STEPS = [
  {
    verb: 'Elegir',
    window: 'Primera conversación',
    body: 'Nos cuentas cómo trabaja tu negocio y eliges el nivel con el que quieres empezar.',
  },
  {
    verb: 'Configurar',
    window: 'Tu identidad',
    body: 'Adaptamos plantillas probadas con tu logo, colores, textos e imágenes. Nada se diseña desde cero.',
  },
  {
    verb: 'Activar',
    window: 'QR y NFC',
    body: 'Recibes tu QR y tu soporte NFC listos para el mostrador, la mesa o tu tarjeta.',
  },
  {
    verb: 'Crecer',
    window: 'Cuando lo decidas',
    body: 'Subes de nivel cuando tu negocio lo pida. Lo que ya funciona se conserva.',
  },
];

// Curva de enfriamiento de Newton: cae rápido y luego se estabiliza. Así se templa el metal.
const K = 2.6;
const cool = (x: number) => (1 - Math.exp(-K * x)) / (1 - Math.exp(-K));
const CURVE_PATH = Array.from({ length: 41 }, (_, i) => {
  const x = i / 40;
  return `${i === 0 ? 'M' : 'L'}${(x * 1000).toFixed(1)} ${(cool(x) * 160 + 20).toFixed(1)}`;
}).join(' ');
const STATION_X = [0, 0.25, 0.5, 0.75];
// Del vino al champagne: la paleta ForgeX hace de termómetro
const MARKER_COLORS = ['#78385b', '#9a6a7a', '#b99a95', '#d6c6b0'];

export const EconomicCycleSection: React.FC = () => {
  const curveRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: curveRef, offset: ['start 85%', 'end 55%'] });
  const pathLength = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="ciclo" className="relative py-28 md:py-40 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-[46rem]">
          <h2 className="text-[clamp(2.25rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.025em] [font-stretch:86%]">
            Se forja por etapas, no de golpe.
          </h2>
          <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-ink-muted">
            Sin proyectos eternos ni inversiones grandes: empiezas con lo esencial y creces cuando lo necesitas.
          </p>
        </div>

        {/* Escritorio: las etapas viven sobre la curva */}
        <div ref={curveRef} className="relative mt-20 hidden lg:block bg-obsidian/70">
          <svg viewBox="0 0 1000 200" preserveAspectRatio="none" className="absolute inset-x-0 top-0 w-full h-[12rem]" aria-hidden="true">
            <defs>
              <linearGradient id="cooling" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#78385b" />
                <stop offset="1" stopColor="#d6c6b0" />
              </linearGradient>
            </defs>
            <path d={CURVE_PATH} fill="none" stroke="rgb(214 198 176 / 0.1)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <motion.path
              d={CURVE_PATH}
              fill="none"
              stroke="url(#cooling)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength }}
            />
          </svg>
          <div className="absolute left-0 top-0 font-mono text-[11px] text-ink-muted -translate-y-6">caliente</div>
          <div className="absolute right-0 top-[11rem] font-mono text-[11px] text-champagne translate-y-4">templado</div>

          <ol className="relative grid grid-cols-4">
            {STEPS.map((step, i) => {
              const y = cool(STATION_X[i]) * 160 + 20; // mismo cálculo que la curva, en unidades de 200
              return (
                <li key={step.verb} className="relative pr-10" style={{ paddingTop: `calc(${(y / 200) * 12}rem - 6px)` }}>
                  <span
                    aria-hidden="true"
                    className="block w-3 h-3 -ml-1.5"
                    style={{ backgroundColor: MARKER_COLORS[i] }}
                  />
                  <div className="mt-8">
                    <span className="font-mono text-[12px] text-ink-muted">{step.window}</span>
                    <h3 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.015em] [font-stretch:88%]">{step.verb}</h3>
                    <p className="mt-3 text-[16px] leading-relaxed text-ink-muted">{step.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Móvil y tableta: la misma curva, vertical */}
        <div className="mt-14 lg:hidden relative pl-8">
          <span aria-hidden="true" className="absolute left-[5px] top-2 bottom-2 w-[2px] bg-linear-to-b from-vino-glow to-champagne" />
          <ol>
          {STEPS.map((step, i) => (
            <li key={step.verb} className="relative pb-12 last:pb-0">
              <span aria-hidden="true" className="absolute -left-8 top-1.5 w-3 h-3" style={{ backgroundColor: MARKER_COLORS[i] }} />
              <span className="font-mono text-[12px] text-ink-muted">{step.window}</span>
              <h3 className="mt-1 text-[1.75rem] font-semibold leading-none [font-stretch:88%]">{step.verb}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-muted max-w-[32rem]">{step.body}</p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
