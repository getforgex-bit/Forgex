import React, { useEffect, useRef, useState } from 'react';
import { LayoutGroup, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { BellRing, QrCode, SmartphoneNfc } from 'lucide-react';
import { PLANS, Plan } from '../plans';

const EASE = [0.16, 1, 0.3, 1] as const;

// Un mismo negocio crece nivel por nivel. El copy de Pro y Max se queda en lo conceptual.
const STAGES: Array<{ plan: Plan; title: string; body: string }> = [
  {
    plan: PLANS[0],
    title: 'Un toque abre tu negocio.',
    body: 'Tu cliente acerca el teléfono a la tarjeta NFC o escanea el QR y llega a tu Mini Hub: menú, fidelidad, reseñas y WhatsApp en una sola pantalla.',
  },
  {
    plan: PLANS[1],
    title: 'Esos mismos botones se vuelven tu web.',
    body: 'La página completa de tu negocio: menú o catálogo interactivo, galería, ubicación y promociones propias. Tu QR y tu NFC siguen funcionando.',
  },
  {
    plan: PLANS[2],
    title: 'Más razones para volver.',
    body: 'Formularios más completos, fidelización ampliada, más personalización y mejor analítica sobre la misma web.',
  },
  {
    plan: PLANS[3],
    title: 'Tu sistema empieza a trabajar por ti.',
    body: 'Pedidos, citas y solicitudes que avanzan y te avisan. Advance puede gestionar información, procesos e integraciones de acuerdo con la solución que implementemos.',
  },
  {
    plan: PLANS[4],
    title: 'Y aprende a responder.',
    body: 'La capa de inteligencia de ForgeX: combina automatización con IA para interpretar información y asistir determinados procesos, como resolver las dudas frecuentes de tus clientes.',
  },
];

type TokenId = 'negocio' | 'menu' | 'fidelidad' | 'resenas' | 'whatsapp';

const TOKEN_TEXT: Record<TokenId, string> = {
  negocio: 'Café Central',
  menu: 'Menú',
  fidelidad: 'Fidelidad',
  resenas: 'Reseñas',
  whatsapp: 'WhatsApp',
};

// Cada botón del Mini Hub es el mismo elemento en todas las etapas: viaja, nunca se reescribe.
// Ancho fijo para que el viaje no deforme el texto.
const Token: React.FC<{ id: TokenId; shared: boolean }> = ({ id, shared }) => (
  <motion.span
    layoutId={shared ? `token-${id}` : undefined}
    transition={{ type: 'spring', stiffness: 160, damping: 24 }}
    className={`inline-flex items-center justify-center font-mono text-[14px] leading-none py-2 border border-line-strong bg-obsidian text-ink whitespace-nowrap align-middle ${
      id === 'negocio' ? 'px-2.5' : 'w-[7.25rem]'
    }`}
  >
    {TOKEN_TEXT[id]}
  </motion.span>
);

// Lo que aparece alrededor de los tokens. Nunca envuelve un token: si el padre se desvanece, el token no podría viajar.
const FadeIn: React.FC<{ children?: React.ReactNode; className?: string; delay?: number; as?: 'div' | 'span' }> = ({
  children,
  className,
  delay = 0.15,
  as = 'div',
}) => {
  const Comp = as === 'span' ? motion.span : motion.div;
  return (
    <Comp className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, delay, ease: EASE }}>
      {children}
    </Comp>
  );
};

type ViewProps = { shared: boolean };

// Básico: el Mini Hub, una micro-página de acción
const BasicoView: React.FC<ViewProps> = ({ shared }) => (
  <div className="flex items-center gap-8">
    <FadeIn className="hidden sm:flex flex-col items-center gap-3 text-ink-muted w-28 text-center">
      <div className="flex gap-3">
        <SmartphoneNfc className="w-6 h-6" strokeWidth={1.5} />
        <QrCode className="w-6 h-6" strokeWidth={1.5} />
      </div>
      <span className="text-[13px] leading-snug">Acerca el teléfono o escanea</span>
    </FadeIn>
    <div className="w-[13.5rem] border border-line-strong bg-obsidian px-5 py-6 flex flex-col items-center gap-3">
      <Token id="negocio" shared={shared} />
      <FadeIn className="text-[13px] text-ink-muted">Bienvenido</FadeIn>
      <div className="mt-1 flex flex-col gap-2">
        <Token id="menu" shared={shared} />
        <Token id="fidelidad" shared={shared} />
        <Token id="resenas" shared={shared} />
        <Token id="whatsapp" shared={shared} />
      </div>
    </div>
  </div>
);

// Plus: los botones del Mini Hub se vuelven la navegación de la web completa
const PlusView: React.FC<ViewProps> = ({ shared }) => (
  <div className="w-full border border-line-strong bg-obsidian">
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-line">
      <Token id="negocio" shared={shared} />
      <div className="flex flex-wrap gap-2">
        <Token id="menu" shared={shared} />
        <Token id="fidelidad" shared={shared} />
        <Token id="resenas" shared={shared} />
        <Token id="whatsapp" shared={shared} />
      </div>
    </div>
    <FadeIn className="px-5 py-6" delay={0.25}>
      <p className="text-[1.375rem] font-semibold leading-tight [font-stretch:90%]">Café de especialidad, a dos calles del centro.</p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {['Galería', 'Ubicación', 'Promociones'].map((section) => (
          <div key={section} className="h-16 bg-raised border border-line flex items-end p-2.5 text-[13px] text-ink-muted">
            {section}
          </div>
        ))}
      </div>
    </FadeIn>
  </div>
);

// Pro: más interacción sobre la misma web
const ProView: React.FC<ViewProps> = ({ shared }) => (
  <div>
    <div className="flex flex-wrap gap-2">
      <Token id="menu" shared={shared} />
      <Token id="resenas" shared={shared} />
      <Token id="whatsapp" shared={shared} />
    </div>
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-[1.1fr_1fr] gap-4">
      <div className="border border-line-strong bg-obsidian p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Token id="negocio" shared={shared} />
          <Token id="fidelidad" shared={shared} />
        </div>
        <FadeIn className="mt-4 grid grid-cols-5 gap-1.5" delay={0.3}>
          {Array.from({ length: 10 }, (_, i) => (
            <span key={i} className={`aspect-square border ${i < 7 ? 'bg-champagne border-champagne' : 'border-line-strong'}`} />
          ))}
        </FadeIn>
        <FadeIn className="mt-3 text-[13px] text-ink-muted" delay={0.35}>
          7 de 10 sellos. El siguiente café va por la casa.
        </FadeIn>
      </div>
      <FadeIn className="border border-line p-4 flex flex-col gap-2.5" delay={0.3}>
        <span className="text-[14px] text-ink">Únete y acumula</span>
        <span className="h-8 border border-line-strong px-2.5 flex items-center text-[13px] text-ink-muted">Nombre</span>
        <span className="h-8 border border-line-strong px-2.5 flex items-center text-[13px] text-ink-muted">Teléfono</span>
        <span className="h-8 bg-ink text-obsidian flex items-center justify-center text-[13px] font-medium">Unirme</span>
      </FadeIn>
    </div>
  </div>
);

// Advance: el pedido avanza solo y avisa al negocio. Sin describir la arquitectura detrás.
const AdvanceView: React.FC<ViewProps> = ({ shared }) => (
  <div className="flex flex-col">
    <div className="flex flex-wrap items-center gap-3">
      <Token id="menu" shared={shared} />
      <FadeIn as="span" className="text-[15px] text-ink">
        2 americanos y 1 rebanada de pastel
      </FadeIn>
    </div>
    <FadeIn className="ml-6 h-6 w-px bg-linear-to-b from-vino-glow to-champagne" delay={0.25} />
    <FadeIn className="flex items-center gap-2 text-[15px] text-ink-muted" delay={0.3}>
      <BellRing className="w-4 h-4 text-champagne" strokeWidth={1.5} />
      Pedido recibido. Avisamos al negocio.
    </FadeIn>
    <FadeIn className="ml-6 h-6 w-px bg-linear-to-b from-vino-glow to-champagne" delay={0.35} />
    <div className="flex flex-wrap items-center gap-2">
      <Token id="whatsapp" shared={shared} />
      <FadeIn as="span" className="text-[14px] text-ink-muted" delay={0.35}>
        aviso para
      </FadeIn>
      <Token id="negocio" shared={shared} />
    </div>
    <div className="mt-6 pt-4 border-t border-line flex flex-wrap items-center gap-2 text-[14px] text-ink-muted">
      <FadeIn as="span" delay={0.45}>
        Después:
      </FadeIn>
      <Token id="fidelidad" shared={shared} />
      <FadeIn as="span" delay={0.45}>
        suma un sello y
      </FadeIn>
      <Token id="resenas" shared={shared} />
      <FadeIn as="span" delay={0.45}>
        invita a opinar.
      </FadeIn>
    </div>
  </div>
);

// Max: la capa de inteligencia atiende una duda y ofrece los mismos botones de siempre
const MaxView: React.FC<ViewProps> = ({ shared }) => (
  <div className="flex flex-col gap-3 max-w-[31rem]">
    <div className="flex flex-wrap items-center gap-2 text-[13px] text-ink-muted">
      <FadeIn as="span">Asistente de</FadeIn>
      <Token id="negocio" shared={shared} />
    </div>
    <FadeIn className="self-end bg-raised border border-line px-4 py-2.5 text-[15px] text-ink" delay={0.2}>
      ¿Tienen café sin azúcar?
    </FadeIn>
    <div className="self-start border border-line-strong bg-obsidian/80 px-4 py-3 text-[15px] leading-[2.1] text-ink-muted">
      <FadeIn as="span" delay={0.35}>
        Sí: el americano, el espresso y el cold brew se sirven sin azúcar. ¿Te muestro el{' '}
      </FadeIn>
      <Token id="menu" shared={shared} />
      <FadeIn as="span" delay={0.35}>
        {' '}o prefieres pedir por{' '}
      </FadeIn>
      <Token id="whatsapp" shared={shared} />
      <FadeIn as="span" delay={0.35}>
        ?
      </FadeIn>
    </div>
    <div className="flex flex-wrap gap-2">
      <Token id="fidelidad" shared={shared} />
      <Token id="resenas" shared={shared} />
    </div>
  </div>
);

const VIEWS = [BasicoView, PlusView, ProView, AdvanceView, MaxView];

const Panel: React.FC<{ stage: number; shared: boolean }> = ({ stage, shared }) => {
  const View = VIEWS[stage];
  const isMax = stage === STAGES.length - 1;
  return (
    <div className="h-full flex flex-col bg-surface border border-line">
      <div className="flex items-center px-5 sm:px-6 h-12 border-b border-line">
        <div className="flex gap-3.5 sm:gap-5 h-full" aria-hidden={!shared}>
          {STAGES.map((s, i) => (
            <span
              key={s.plan.id}
              className={`relative flex items-center text-[13px] transition-colors duration-300 ${i === stage ? 'text-ink' : 'text-ink-muted'}`}
            >
              {s.plan.name}
              {i === stage && shared && (
                <motion.span layoutId="stage-underline" className="absolute left-0 right-0 -bottom-px h-[2px] bg-accent" />
              )}
            </span>
          ))}
        </div>
      </div>
      <div
        className={`relative flex-1 flex flex-col justify-center px-5 sm:px-8 py-8 transition-colors duration-700 ${
          isMax ? 'bg-vino/30' : 'bg-transparent'
        }`}
      >
        <View shared={shared} />
      </div>
      <div className="px-5 sm:px-6 h-11 flex items-center justify-between gap-4 border-t border-line font-mono text-[11px] text-ink-muted">
        <span>{STAGES[stage].plan.verb}</span>
        <span>Ejemplo ilustrativo</span>
      </div>
    </div>
  );
};

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
};

const StageText: React.FC<{ index: number; active: boolean }> = ({ index, active }) => {
  const { plan, title, body } = STAGES[index];
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-5">
        <span className="font-wordmark text-[15px] font-bold uppercase tracking-[0.2em] text-metallic">{plan.name}</span>
        <span className="font-mono text-[12px] text-ink-muted">{plan.verb}</span>
      </div>
      <h3
        className={`text-[1.75rem] md:text-[2.125rem] font-semibold leading-[1.1] tracking-[-0.015em] [font-stretch:90%] transition-colors duration-500 ${
          active ? 'text-ink' : 'text-ink-faint'
        }`}
      >
        {title}
      </h3>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-muted max-w-[30rem]">{body}</p>
    </div>
  );
};

export const PlatformDivisionsSection: React.FC = () => {
  const isDesktop = useIsDesktop();
  const trackRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start 55%', 'end 55%'] });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setStage(Math.min(STAGES.length - 1, Math.max(0, Math.floor(p * STAGES.length))));
  });

  return (
    <section id="divisiones" className="relative py-28 md:py-40 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-[48rem]">
          <h2 className="text-[clamp(2.25rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.025em] [font-stretch:86%]">
            Del primer toque a la inteligencia.
          </h2>
          <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-ink-muted">
            Así crece un mismo negocio dentro de ForgeX. Cada nivel toma lo que ya tenías y lo lleva más lejos, sin empezar de
            cero.
          </p>
        </div>

        {isDesktop ? (
          <div ref={trackRef} className="relative mt-20 grid grid-cols-12 gap-16">
            <div className="col-span-5">
              {STAGES.map((s, i) => (
                <div key={s.plan.id} className="min-h-[64vh] flex flex-col justify-center">
                  <StageText index={i} active={i === stage} />
                </div>
              ))}
            </div>
            <div className="col-span-7">
              <div className="sticky top-[16vh] h-[min(56vh,32rem)]">
                <LayoutGroup id="recorrido">
                  <Panel stage={stage} shared />
                </LayoutGroup>
              </div>
            </div>
          </div>
        ) : (
          <div ref={trackRef} className="mt-16 flex flex-col gap-16">
            {STAGES.map((s, i) => (
              <motion.div
                key={s.plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <StageText index={i} active />
                <div className="mt-8 min-h-[22rem]">
                  <Panel stage={i} shared={false} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
