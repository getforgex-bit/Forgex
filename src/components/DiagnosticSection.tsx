import React, { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { audioEngine } from './AudioEngine';

interface DiagnosticSectionProps {
  onOpenDiagnostic: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

// Inventario de conservación: cada herramienta que ya tienes, y la forma que toma.
const INVENTORY: Array<{ before: string; after: string }> = [
  { before: 'Tarjetas de presentación que terminan en un cajón', after: 'Tarjeta NFC que abre tu Mini Hub con un toque' },
  { before: 'Un cartel con tu número en el mostrador', after: 'Código QR que lleva directo a tu negocio' },
  { before: 'Menú impreso que hay que volver a imprimir', after: 'Menú o catálogo digital en el teléfono de tu cliente' },
  { before: 'Sellos de cliente frecuente en papel', after: 'Tarjeta de fidelidad digital' },
  { before: '“Déjanos una reseña”, dicho de pasada', after: 'Reseña a un toque de distancia' },
  { before: 'Las mismas preguntas por WhatsApp, todo el día', after: 'Respuestas asistidas con IA, en el nivel Max' },
];

const TransformRow: React.FC<{ before: string; after: string }> = ({ before, after }) => {
  const ref = useRef<HTMLLIElement>(null);
  const forged = useInView(ref, { once: true, amount: 0.8 });
  return (
    <motion.li
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-12 md:items-center gap-3 md:gap-6 py-6 md:py-7"
      initial="raw"
      animate={forged ? 'forged' : 'raw'}
    >
      {/* Material crudo en acento que se enfría al secundario. En CSS para que siga al modo activo al terminar */}
      <span
        className={`md:col-span-5 font-mono text-[14px] md:text-[15px] leading-snug ${forged ? 'text-ink-muted' : 'text-ink-accent'}`}
        style={forged ? { animation: 'fx-from-accent 1.2s ease-out 0.35s backwards' } : undefined}
      >
        {before}
      </span>

      <span aria-hidden="true" className="md:col-span-2 h-px w-12 md:w-full overflow-hidden">
        <motion.span
          className="block h-full w-full origin-left bg-linear-to-r from-vino-glow to-cool"
          variants={{ raw: { scaleX: 0 }, forged: { scaleX: 1 } }}
          transition={{ duration: 0.7, ease: EASE }}
        />
      </span>

      <motion.span
        className="md:col-span-5 text-xl md:text-2xl font-medium leading-snug text-ink [font-stretch:94%]"
        variants={{ raw: { opacity: 0, x: -14 }, forged: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.7, delay: 0.45, ease: EASE }}
      >
        {after}
      </motion.span>
    </motion.li>
  );
};

export const DiagnosticSection: React.FC<DiagnosticSectionProps> = ({ onOpenDiagnostic }) => {
  return (
    <section id="diagnostico" className="relative py-28 md:py-40 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-[54rem]">
          <h2 className="text-[clamp(2.5rem,5.8vw,5.25rem)] font-semibold leading-[1] tracking-[-0.025em] [font-stretch:86%]">
            Nada desaparece.
            <br />
            Todo se transforma.
          </h2>
          <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-ink-muted">
            Es la ley de conservación de la materia, aplicada a tu negocio. No tiramos lo que ya usas: lo convertimos en
            herramientas digitales.
          </p>
        </div>

        <div className="mt-16 md:mt-24 bg-page/85">
          <div className="hidden md:grid grid-cols-12 gap-6 pb-4 border-b border-line-strong font-mono text-[12px] text-ink-muted">
            <span className="col-span-5">Lo que tienes hoy</span>
            <span className="col-span-2" />
            <span className="col-span-5">En lo que se convierte</span>
          </div>
          <ul className="divide-y divide-line">
            {INVENTORY.map((item) => (
              <TransformRow key={item.before} {...item} />
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-col sm:flex-row sm:items-center gap-5">
          <button
            type="button"
            onClick={() => {
              audioEngine.playTick(900, 0.04);
              onOpenDiagnostic();
            }}
            className="btn btn-primary group self-start"
          >
            Encontrar mi plan
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </button>
          <p className="text-ink-muted max-w-[28rem]">Dinos qué usas hoy y te decimos por dónde empezar.</p>
        </div>
      </div>
    </section>
  );
};
