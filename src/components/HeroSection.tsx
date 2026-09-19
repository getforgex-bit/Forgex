import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { audioEngine } from './AudioEngine';

interface HeroSectionProps {
  onOpenDiagnostic: () => void;
  onExplore: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

// Las letras de "disperso." nacen sueltas y en lila; se ensamblan en champagne.
// Posiciones fijas (no aleatorias) para que la composición sea la misma en cada carga.
const SCATTER: Array<[number, number, number]> = [
  [-1.1, -0.7, -28],
  [0.4, 0.9, 22],
  [-0.6, -1.1, 14],
  [0.9, -0.4, -34],
  [-0.3, 1.2, 30],
  [1.2, 0.6, -18],
  [-0.9, 0.3, 26],
  [0.5, -0.9, -12],
  [1.4, 1.0, 40],
];

const ScatteredWord: React.FC<{ word: string }> = ({ word }) => (
  <span className="inline-block whitespace-nowrap" aria-label={word}>
    {word.split('').map((char, i) => {
      const [x, y, r] = SCATTER[i % SCATTER.length];
      return (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          initial={{ x: `${x}em`, y: `${y}em`, rotate: r, color: '#968496', opacity: 0.6 }}
          animate={{ x: 0, y: 0, rotate: 0, color: '#ede4d8', opacity: 1 }}
          transition={{
            delay: 0.55 + i * 0.07,
            type: 'spring',
            stiffness: 70,
            damping: 14,
            color: { delay: 1.1 + i * 0.07, duration: 1.4, ease: 'easeOut' },
            opacity: { delay: 0.55 + i * 0.07, duration: 0.4 },
          }}
        >
          {char}
        </motion.span>
      );
    })}
  </span>
);

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDiagnostic, onExplore }) => {
  return (
    <section id="hero" className="relative min-h-[100dvh] pt-24 pb-16 px-4 sm:px-6 lg:px-10 flex items-center">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(11,10,12,0.92)_0%,rgba(11,10,12,0.7)_38%,rgba(11,10,12,0)_62%)] max-lg:bg-[rgba(11,10,12,0.4)]"
      />
      <div className="w-full max-w-[1400px] mx-auto">
        <div className="max-w-[62rem]">
          <h1 className="text-[clamp(2.75rem,5.7vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.025em] [font-stretch:86%]">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              Tu negocio ya existe.
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.25 }}
            >
              Solo está <ScatteredWord word="disperso." />
            </motion.span>
          </h1>

          <motion.p
            className="mt-7 max-w-[34rem] text-lg sm:text-xl leading-relaxed text-ink-muted"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: EASE }}
          >
            Un QR, una tarjeta NFC y una web propia que crecen con tu negocio. Desde $199 al mes.
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
          >
            <button
              id="btn-hero-diagnostico"
              type="button"
              onClick={() => {
                audioEngine.playTick(1000, 0.05);
                onOpenDiagnostic();
              }}
              className="btn btn-primary group"
            >
              Encontrar mi plan
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.5} />
            </button>
            <button
              id="btn-hero-explorar"
              type="button"
              onClick={() => {
                audioEngine.playTick(600, 0.03);
                onExplore();
              }}
              className="btn btn-ghost"
            >
              Ver cómo crece
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
