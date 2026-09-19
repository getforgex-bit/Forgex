import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { audioEngine } from './AudioEngine';

const FAQS = [
  {
    question: '¿Necesito una página web para empezar?',
    answer:
      'No. Con Básico recibes un código QR, un soporte NFC y un Mini Hub: una página mínima con las acciones que más importan, como ver tu menú, obtener la tarjeta de fidelidad, dejar una reseña o escribirte por WhatsApp. La web completa llega con Plus.',
  },
  {
    question: '¿Qué pasa cuando subo de nivel?',
    answer:
      'Conservas todo lo que ya tenías. Tu QR, tu NFC y tu Mini Hub siguen funcionando, y el nuevo nivel se construye encima. Nada se rehace desde cero.',
  },
  {
    question: '¿Manejan publicidad en Google o redes sociales?',
    answer:
      'No. ForgeX no compra anuncios ni administra campañas pagadas. Construimos las herramientas digitales de tu negocio para que tus clientes te encuentren, te contacten y regresen.',
  },
  {
    question: '¿Cómo participa la IA en Max?',
    answer:
      'Max combina automatización con capacidades de IA para interpretar información y asistir determinados procesos, como responder dudas frecuentes sobre tus productos, horarios o servicios. Tú decides qué información usa.',
  },
  {
    question: '¿Qué recibo físicamente?',
    answer:
      'Tu código QR y un soporte NFC compatible, como tarjeta, sticker o etiqueta. Puede haber una activación inicial para cubrir los materiales y la configuración.',
  },
  {
    question: '¿Los precios son definitivos?',
    answer:
      'Son precios de lanzamiento en MXN y pueden ajustarse mientras terminamos de definir cada nivel. Siempre te confirmamos el precio antes de activar.',
  },
];

export const GovernanceFaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    audioEngine.playTick(750, 0.03);
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="gobernanza" className="relative py-28 md:py-40 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-y-14">
        <div className="lg:col-span-8">
          <div>
            <h2 className="text-[clamp(2.25rem,4.2vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.025em] [font-stretch:86%]">
              Preguntas directas, respuestas claras.
            </h2>
            <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-ink-muted">
              Qué recibes, cómo creces y qué hace (y qué no hace) ForgeX.
            </p>
          </div>
        </div>

        <div className="lg:col-start-5 lg:col-span-8 bg-obsidian/85">
          <ul className="border-t border-line-strong divide-y divide-line">
            {FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <li key={faq.question}>
                  <h3>
                    <button
                      id={`faq-toggle-${idx}`}
                      type="button"
                      onClick={() => toggle(idx)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${idx}`}
                      className="w-full py-6 flex items-start justify-between gap-6 text-left group"
                    >
                      <span className={`text-[1.25rem] sm:text-[1.375rem] font-medium leading-snug transition-colors ${isOpen ? 'text-ink' : 'text-ink-muted group-hover:text-ink'}`}>
                        {faq.question}
                      </span>
                      <Plus
                        className={`w-5 h-5 mt-1 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45 text-accent' : 'text-ink-faint'}`}
                        strokeWidth={1.5}
                      />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-panel-${idx}`}
                        role="region"
                        aria-labelledby={`faq-toggle-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-7 pr-10 max-w-[40rem] text-[16px] leading-relaxed text-ink-muted">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
