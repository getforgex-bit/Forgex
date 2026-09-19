import React, { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import { audioEngine } from './AudioEngine';
import { PLANS, Plan, PRICE_NOTE, tierLabel } from '../plans';

interface PricingSectionProps {
  onSelectPlan: (tier: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

// Troncal (Básico, Pro, Max) y vía alterna (Plus, Advance). La troncal pesa 1; la vía alterna 0.8.
const WEIGHTS = PLANS.map((p) => (p.featured ? 1 : 0.8));
const TOTAL = WEIGHTS.reduce((a, b) => a + b, 0);
const BOUNDS = WEIGHTS.reduce<number[]>((acc, w) => [...acc, acc[acc.length - 1] + w / TOTAL], [0]);
const CENTERS = PLANS.map((_, i) => (BOUNDS[i] + BOUNDS[i + 1]) / 2);
const STRETCHES = PLANS.map((p) => parseFloat(p.stretch));
// Scroll que dura el escenario fijo: 60vh por unidad de peso
const SCROLL_VH = Math.round(TOTAL * 60);
// El fundido dura lo mismo en todas las escenas para que las vecinas no se encimen
const FADE = (Math.min(...WEIGHTS) / TOTAL) * 0.22;

// Del vino al champagne: la paleta ForgeX como termómetro del índice
const NODE_COLORS = ['#78385b', '#8f506b', '#aa6a78', '#c09d94', '#d6c6b0'];

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

type Keyframes = { input: number[]; opacity: number[]; y: number[]; blur: number[]; scale: number[] };

// Ventana de cada escena en el progreso del escenario.
// La troncal no desaparece cuando entra una vía alterna: queda congelada detrás, velada y desenfocada.
const sceneWindow = (i: number): Keyframes => {
  const f = FADE;
  const s = BOUNDS[i];
  const e = BOUNDS[i + 1];
  if (!PLANS[i].featured) {
    return { input: [s - f, s + f, e - f, e + f], opacity: [0, 1, 1, 0], y: [-40, 0, 0, -24], blur: [8, 0, 0, 8], scale: [1, 1, 1, 1] };
  }
  const k: Keyframes = { input: [], opacity: [], y: [], blur: [], scale: [] };
  const push = (t: number, o: number, y: number, b: number, sc: number) => {
    k.input.push(t);
    k.opacity.push(o);
    k.y.push(y);
    k.blur.push(b);
    k.scale.push(sc);
  };
  if (i === 0) push(0, 1, 0, 0, 1);
  else {
    push(s - f, 0, 48, 10, 1);
    push(s + f, 1, 0, 0, 1);
  }
  const next = PLANS[i + 1];
  if (!next) push(1, 1, 0, 0, 1);
  else if (next.featured) {
    push(e - f, 1, 0, 0, 1);
    push(e + f, 0, -48, 10, 1);
  } else {
    const e2 = BOUNDS[i + 2];
    push(e - f, 1, 0, 0, 1);
    push(e + f, 0.2, 0, 4, 0.985);
    push(e2 - f, 0.2, 0, 4, 0.985);
    push(e2 + f, 0, -48, 10, 0.985);
  }
  return k;
};

// El precio es la misma materia en cinco estados: su ancho se estira con el scroll.
const Price: React.FC<{ plan: Plan; stretch?: MotionValue<string>; className: string; unitClassName: string }> = ({
  plan,
  stretch,
  className,
  unitClassName,
}) => (
  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 whitespace-nowrap">
    <motion.span className={`font-semibold leading-[0.9] tracking-[-0.03em] tabular-nums ${className}`} style={{ fontStretch: stretch ?? plan.stretch }}>
      {plan.price}
    </motion.span>
    <span className={`font-mono ${unitClassName}`}>MXN/mes</span>
  </div>
);

// Una sola línea de etiqueta por escena: el verbo del nivel y, si lo tiene, su distintivo
const SceneLabel: React.FC<{ plan: Plan; prefix?: string }> = ({ plan, prefix }) => (
  <p className="font-mono text-[13px] text-ink-muted">
    {prefix ?? plan.verb}
    {!prefix && plan.badge && <span className="text-champagne"> · {plan.badge}</span>}
  </p>
);

const MaxGlow = () => (
  <span
    aria-hidden="true"
    className="pointer-events-none absolute -left-[10%] top-1/2 -translate-y-1/2 w-[80%] h-[120%] bg-[radial-gradient(closest-side,rgb(74_42_58/0.6),transparent)]"
  />
);

// Interruptor de la vía alterna: esquinas achaflanadas y escuadras que se cierran al pasar el cursor
const SwitchButton: React.FC<{ plan: Plan; onSelect: (plan: Plan) => void; className?: string }> = ({ plan, onSelect, className = '' }) => (
  <button
    id={`btn-plan-${plan.id}`}
    type="button"
    onClick={() => onSelect(plan)}
    className={`group relative inline-flex items-center justify-center gap-2.5 px-6 py-4 text-[16px] font-medium text-ink transition-[color,transform] duration-300 hover:text-obsidian active:translate-y-px ${className}`}
  >
    <span aria-hidden="true" className="chamfer absolute inset-0 bg-ink/40 transition-colors duration-300 group-hover:bg-ink" />
    <span aria-hidden="true" className="chamfer absolute inset-px bg-obsidian/85 transition-colors duration-300 group-hover:bg-ink" />
    <span
      aria-hidden="true"
      className="absolute -top-2 -right-2 w-3 h-3 border-t border-r border-champagne opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:-top-1 group-hover:-right-1"
    />
    <span
      aria-hidden="true"
      className="absolute -bottom-2 -left-2 w-3 h-3 border-b border-l border-champagne opacity-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:-bottom-1 group-hover:-left-1"
    />
    <span className="relative">Elegir {plan.name}</span>
    <ArrowRight className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.5} />
  </button>
);

const FitsIf: React.FC<{ plan: Plan }> = ({ plan }) => (
  <div>
    <p className="font-mono text-[13px] text-ink-muted">Elígelo si</p>
    <ul className="mt-4 space-y-3">
      {plan.fitsIf?.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[17px] leading-snug text-ink">
          <ArrowRight className="w-3.5 h-3.5 mt-[0.2em] shrink-0 text-champagne" strokeWidth={1.5} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

/* ------------------------------------------------------------------ */
/* Escritorio: escenario fijo                                          */
/* ------------------------------------------------------------------ */

type SceneProps = {
  plan: Plan;
  index: number;
  progress: MotionValue<number>;
  stretch: MotionValue<string>;
  active: boolean;
  onSelect: (plan: Plan) => void;
};

const useSceneStyle = (index: number, progress: MotionValue<number>) => {
  const w = sceneWindow(index);
  const opacity = useTransform(progress, w.input, w.opacity);
  const y = useTransform(progress, w.input, w.y);
  const scale = useTransform(progress, w.input, w.scale);
  const blur = useTransform(progress, w.input, w.blur);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);
  return { opacity, y, scale, filter };
};

// Troncal: Básico, Pro, Max a lente completa
const TrunkScene: React.FC<SceneProps> = ({ plan, index, progress, stretch, active, onSelect }) => {
  const style = useSceneStyle(index, progress);
  const isPro = plan.id === 'pro';
  const isMax = plan.id === 'max';

  return (
    <motion.div className="absolute inset-0 grid grid-cols-10 gap-8 xl:gap-12 items-center" style={style} inert={!active} aria-hidden={!active}>
      <div className="relative col-span-6">
        {isMax && <MaxGlow />}
        <div className="relative">
          <SceneLabel plan={plan} />
          <h3 className="mt-6 font-wordmark font-bold uppercase leading-[0.95] tracking-[0.06em] text-metallic text-[clamp(3.25rem,6.6vw,6.5rem)]">
            {plan.name}
          </h3>
          <div className="mt-8">
            <Price plan={plan} stretch={stretch} className="text-[clamp(4rem,8vw,7.25rem)] text-ink" unitClassName="text-[14px] text-ink-muted" />
          </div>
        </div>
      </div>

      <div className="col-span-4">
        <p className="text-[21px] leading-snug text-ink [font-stretch:94%]">{plan.summary}</p>
        <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">{plan.bridge}</p>
        <button
          id={`btn-plan-${plan.id}`}
          type="button"
          onClick={() => onSelect(plan)}
          className={`btn mt-10 w-full !py-4 text-[16px] ${isPro ? 'btn-primary' : 'btn-ghost bg-obsidian/60'}`}
        >
          Elegir {plan.name}
        </button>
      </div>
    </motion.div>
  );
};

// Vía alterna: Plus y Advance entran como panel técnico sobre la troncal congelada
const BranchScene: React.FC<SceneProps> = ({ plan, index, progress, stretch, active, onSelect }) => {
  const style = useSceneStyle(index, progress);
  return (
    <motion.div className="absolute inset-0 z-10 grid grid-cols-10 items-center" style={style} inert={!active} aria-hidden={!active}>
      <div className="hud-glass relative col-start-2 col-span-9 p-9 xl:p-12">
        <div className="grid grid-cols-[1.1fr_1fr] gap-10 xl:gap-16 items-center">
          <div>
            <SceneLabel plan={plan} prefix="Vía alterna" />
            <h3 className="mt-5 font-wordmark font-bold uppercase leading-[0.95] tracking-[0.08em] text-metallic text-[clamp(2.5rem,4.4vw,4rem)]">
              {plan.name}
            </h3>
            <div className="mt-6">
              <Price plan={plan} stretch={stretch} className="text-[clamp(3rem,5.2vw,4.75rem)] text-ink" unitClassName="text-[13px] text-ink-muted" />
            </div>
            <p className="mt-5 max-w-[26rem] text-[16px] leading-relaxed text-ink-muted">{plan.bridge}</p>
          </div>
          <div>
            <FitsIf plan={plan} />
            <SwitchButton plan={plan} onSelect={onSelect} className="mt-10 w-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Índice de doble riel: la troncal recta y un apartadero por cada vía alterna
const ROW = 60;
const INDEX_H = ROW * (PLANS.length - 1) + 24;
const rowY = (i: number) => 12 + i * ROW;
const railX = (plan: Plan) => (plan.featured ? 6 : 34);

const TrackIndex: React.FC<{ active: number; rail: MotionValue<number>; onJump: (i: number) => void }> = ({ active, rail, onJump }) => {
  const activePlan = PLANS[active];
  return (
    <nav aria-label="Niveles" className="relative" style={{ height: INDEX_H }}>
      <svg aria-hidden="true" width="44" height={INDEX_H} className="absolute left-0 top-0 overflow-visible">
        <defs>
          <linearGradient id="troncal" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#78385b" />
            <stop offset="1" stopColor="#d6c6b0" />
          </linearGradient>
        </defs>
        <line x1="6" x2="6" y1={rowY(0)} y2={rowY(PLANS.length - 1)} stroke="rgb(214 198 176 / 0.2)" strokeWidth="1" />
        <motion.line
          x1="6"
          x2="6"
          y1={rowY(0)}
          y2={rowY(PLANS.length - 1)}
          stroke="url(#troncal)"
          strokeWidth="2"
          style={{ pathLength: rail }}
        />
        {PLANS.map((plan, i) => {
          if (plan.featured) return null;
          const y = rowY(i);
          const isActive = i === active;
          return (
            <g key={plan.id}>
              <path
                d={`M6 ${y - 34} L34 ${y - 6} L34 ${y + 6} L6 ${y + 34}`}
                fill="none"
                stroke={isActive ? '#ede4d8' : 'rgb(214 198 176 / 0.28)'}
                strokeWidth={isActive ? 1.5 : 1}
                style={{ transition: 'stroke 400ms cubic-bezier(0.16,1,0.3,1)' }}
              />
              <rect x="30" y={y - 7} width="8" height="14" fill={isActive ? '#ede4d8' : NODE_COLORS[i]} style={{ transition: 'fill 400ms' }} />
            </g>
          );
        })}
        {PLANS.map((plan, i) =>
          plan.featured ? <rect key={plan.id} x="0" y={rowY(i) - 6} width="12" height="12" fill={NODE_COLORS[i]} /> : null
        )}
      </svg>

      {/* Cabezal de lectura: avanza por la troncal y salta al apartadero */}
      <motion.span
        aria-hidden="true"
        className="absolute left-0 top-0 w-5 h-5 border border-ink"
        initial={false}
        animate={{ x: railX(activePlan) - 10, y: rowY(active) - 10 }}
        transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      />

      <ol className="absolute left-0 top-0 w-full h-full">
        {PLANS.map((plan, i) => {
          const isActive = i === active;
          return (
            <li key={plan.id} className="absolute left-0 right-0" style={{ top: rowY(i) - 20 }}>
              <button
                type="button"
                onClick={() => onJump(i)}
                aria-current={isActive ? 'step' : undefined}
                className={`group flex items-center h-10 text-left w-full ${plan.featured ? 'pl-14' : 'pl-16'}`}
              >
                <span
                  className={`font-wordmark text-[12px] font-bold uppercase tracking-[0.16em] transition-colors duration-500 ${
                    isActive ? 'text-ink' : 'text-ink-muted group-hover:text-ink'
                  }`}
                >
                  {plan.name}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

const Stage: React.FC<{ onSelect: (plan: Plan) => void }> = ({ onSelect }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });
  // Un resorte suave para que el cambio de escena se sienta como un corte de cine, no como un salto
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.6 });
  const stretchValue = useTransform(progress, CENTERS, STRETCHES);
  const stretch = useTransform(stretchValue, (v) => `${v.toFixed(1)}%`);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const i = Math.max(0, BOUNDS.findIndex((b, k) => k < PLANS.length && v >= b && v < BOUNDS[k + 1]));
    const next = v >= 1 ? PLANS.length - 1 : i;
    setActive((prev) => {
      if (prev !== next) audioEngine.playTick(PLANS[next].featured ? 520 + next * 110 : 1200, 0.04);
      return next;
    });
  });

  const jumpTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const top = track.getBoundingClientRect().top + window.scrollY;
    const distance = track.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + CENTERS[i] * distance, behavior: 'smooth' });
  };

  return (
    <div ref={trackRef} className="relative" style={{ height: `calc(100dvh + ${SCROLL_VH}vh)` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {/* Velo: el texto se lee a la izquierda, la forja respira a la derecha */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(90deg,rgb(11_10_12/0.94)_0%,rgb(11_10_12/0.86)_38%,rgb(11_10_12/0.5)_64%,rgb(11_10_12/0.1)_100%)]"
        />
        <div className="relative h-full max-w-[1400px] mx-auto px-10 pt-24 pb-16 grid grid-cols-12 gap-8">
          <div className="col-span-2 self-center">
            <TrackIndex active={active} rail={progress} onJump={jumpTo} />
          </div>
          <div className="col-span-10 relative">
            {PLANS.map((plan, i) =>
              plan.featured ? (
                <TrunkScene key={plan.id} plan={plan} index={i} progress={progress} stretch={stretch} active={i === active} onSelect={onSelect} />
              ) : (
                <BranchScene key={plan.id} plan={plan} index={i} progress={progress} stretch={stretch} active={i === active} onSelect={onSelect} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Móvil, tableta y movimiento reducido: la misma red, lineal          */
/* ------------------------------------------------------------------ */

const LinearPlans: React.FC<{ onSelect: (plan: Plan) => void }> = ({ onSelect }) => (
  <div className="mt-10 flex flex-col">
    {PLANS.map((plan) =>
      plan.featured ? (
        <motion.article
          key={plan.id}
          className="relative py-16 sm:py-20 min-h-[80svh] flex flex-col justify-center"
          initial={{ opacity: 0.4, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -mx-4 sm:-mx-6 bg-[linear-gradient(180deg,transparent,rgb(11_10_12/0.82)_18%,rgb(11_10_12/0.82)_82%,transparent)]"
          />
          {plan.id === 'max' && <MaxGlow />}
          <div className="relative">
            <SceneLabel plan={plan} />
            <h3 className="mt-5 font-wordmark font-bold uppercase leading-[0.95] tracking-[0.06em] text-metallic text-[clamp(3rem,13vw,5.5rem)]">
              {plan.name}
            </h3>
            <div className="mt-6">
              <Price plan={plan} className="text-[clamp(3.5rem,15vw,6.5rem)] text-ink" unitClassName="text-[13px] text-ink-muted" />
            </div>
            <p className="mt-6 max-w-[32rem] text-[19px] leading-snug text-ink [font-stretch:94%]">{plan.summary}</p>
            <p className="mt-3 max-w-[32rem] text-[16px] leading-relaxed text-ink-muted">{plan.bridge}</p>
            <button
              id={`btn-plan-${plan.id}`}
              type="button"
              onClick={() => onSelect(plan)}
              className={`btn mt-9 w-full sm:w-auto sm:min-w-[16rem] !py-4 text-[16px] ${plan.id === 'pro' ? 'btn-primary' : 'btn-ghost bg-obsidian/60'}`}
            >
              Elegir {plan.name}
            </button>
          </div>
        </motion.article>
      ) : (
        <motion.article
          key={plan.id}
          className="hud-glass relative my-4 p-6 sm:p-9"
          initial={{ opacity: 0.4, y: -12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <SceneLabel plan={plan} prefix="Vía alterna" />
          <h3 className="mt-4 font-wordmark font-bold uppercase leading-[0.95] tracking-[0.08em] text-metallic text-[clamp(2.25rem,10vw,3.5rem)]">
            {plan.name}
          </h3>
          <div className="mt-5">
            <Price plan={plan} className="text-[clamp(2.75rem,12vw,4rem)] text-ink" unitClassName="text-[12px] text-ink-muted" />
          </div>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-muted">{plan.bridge}</p>
          <div className="mt-7">
            <FitsIf plan={plan} />
          </div>
          <SwitchButton plan={plan} onSelect={onSelect} className="mt-9 w-full sm:w-auto sm:min-w-[16rem]" />
        </motion.article>
      )
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/* Detalle completo, a demanda                                         */
/* ------------------------------------------------------------------ */

const Comparison: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-start">
      <button
        id="btn-toggle-compare"
        type="button"
        onClick={() => {
          audioEngine.playTick(750, 0.03);
          setOpen((prev) => !prev);
        }}
        aria-expanded={open}
        aria-controls="plans-comparison-panel"
        className="group inline-flex items-center gap-2.5 py-3 px-4 text-[15px] font-medium text-ink border border-line-strong bg-obsidian/70 hover:border-champagne transition-colors"
      >
        <Plus className={`w-4 h-4 transition-transform duration-300 ${open ? 'rotate-45 text-champagne' : 'text-ink-muted group-hover:text-ink'}`} strokeWidth={1.5} />
        {open ? 'Ocultar la comparación' : 'Comparar los 5 niveles'}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="plans-comparison-panel"
            role="region"
            aria-labelledby="btn-toggle-compare"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden w-full"
          >
            <div className="mt-6 p-6 sm:p-8 bg-obsidian/90 border border-line grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-8">
              {PLANS.map((plan) => (
                <div key={plan.id}>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-wordmark text-[14px] font-bold uppercase tracking-[0.14em] text-metallic">{plan.name}</span>
                    <span className="font-mono text-[12px] text-ink-muted">{plan.price}</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-[14px] leading-snug text-ink-muted">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 mt-0.5 shrink-0 text-champagne" strokeWidth={1.5} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  const isDesktop = useIsDesktop();
  const reduceMotion = useReducedMotion();
  const cinematic = isDesktop && !reduceMotion;

  const handleSelect = (plan: Plan) => {
    audioEngine.playTick(1000, 0.05);
    onSelectPlan(tierLabel(plan));
  };

  return (
    <section id="precios" className="relative pt-28 md:pt-36 pb-24 md:pb-32">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-[46rem]">
          <h2 className="text-[clamp(2.25rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.025em] [font-stretch:86%]">
            Un mismo negocio, cinco estados.
          </h2>
          <p className="mt-6 max-w-[36rem] text-lg leading-relaxed text-ink-muted">
            Básico, Pro y Max marcan el camino. Plus y Advance son vías alternas para un paso concreto.
          </p>
        </div>
      </div>

      {cinematic ? (
        <Stage onSelect={handleSelect} />
      ) : (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
          <LinearPlans onSelect={handleSelect} />
        </div>
      )}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 mt-12 flex flex-col gap-6">
        <Comparison />
        <p className="text-[14px] text-ink-muted max-w-[52rem]">
          {PRICE_NOTE} Básico puede incluir una activación inicial por la tarjeta NFC y los materiales.
        </p>
      </div>
    </section>
  );
};
