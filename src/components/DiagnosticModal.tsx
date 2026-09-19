import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PlanRecommendation } from '../types';
import { audioEngine } from './AudioEngine';
import { ModalShell } from './ModalShell';
import { PLANS, Plan, PRICE_NOTE, planByName, tierLabel } from '../plans';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTier: (tier: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const BUSINESS_TYPES = [
  'Cafetería o restaurante',
  'Barbería o estética',
  'Tienda o comercio',
  'Consultorio o salud',
  'Servicios profesionales',
  'Otro giro',
];

// Cada objetivo apunta al nivel más bajo que lo resuelve (el servidor usa el mismo mapa como respaldo)
const GOALS: Array<{ id: string; label: string; plan: Plan['id'] }> = [
  { id: 'encontrar', label: 'Que me encuentren y me contacten fácil', plan: 'basico' },
  { id: 'mostrar', label: 'Mostrar mi menú o catálogo completo', plan: 'plus' },
  { id: 'fidelizar', label: 'Que mis clientes regresen', plan: 'pro' },
  { id: 'pedidos', label: 'Recibir pedidos o citas sin perseguirlos', plan: 'advance' },
  { id: 'responder', label: 'Responder preguntas frecuentes automáticamente', plan: 'max' },
];

const VOLUMES = ['Menos de 50 clientes por semana', '50 a 200 clientes por semana', '200 a 500 clientes por semana', 'Más de 500 clientes por semana'];

const Field: React.FC<{ id: string; label: string; children: React.ReactNode }> = ({ id, label, children }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-[14px] text-ink-muted">
      {label}
    </label>
    {children}
  </div>
);

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({ isOpen, onClose, onSelectTier }) => {
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [currentTools, setCurrentTools] = useState('WhatsApp y tarjetas impresas');
  const [goalId, setGoalId] = useState(GOALS[0].id);
  const [volume, setVolume] = useState(VOLUMES[1]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PlanRecommendation | null>(null);

  const goal = GOALS.find((g) => g.id === goalId) ?? GOALS[0];
  const fallbackPlan = PLANS.find((p) => p.id === goal.plan) ?? PLANS[0];
  const plan = (result && planByName(result.recommendedPlan)) || fallbackPlan;
  const next = PLANS[PLANS.indexOf(plan) + 1];

  const rawMaterial = [
    { label: 'Giro', value: businessType },
    { label: 'Usas hoy', value: currentTools || 'Sin especificar' },
    { label: 'Quieres', value: goal.label },
    { label: 'Clientes', value: volume },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    audioEngine.playTick(900, 0.05);
    try {
      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType, currentTools, goal: goal.label, goalId, volume }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setResult(await res.json());
    } catch {
      setResult({
        recommendedPlan: fallbackPlan.name,
        reason: `Por lo que quieres lograr, ${fallbackPlan.name} es el punto de partida: ${fallbackPlan.summary.toLowerCase()}`,
        firstStep: 'Platicamos sobre tu negocio y definimos qué va primero.',
      });
    } finally {
      setLoading(false);
    }
  };

  const showSummary = loading || result;

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} labelledBy="diagnostic-title">
      <p className="font-mono text-[12px] text-ink-muted pr-12">Encontrar mi plan</p>
      <h2 id="diagnostic-title" className="mt-2 text-[1.875rem] sm:text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.02em] [font-stretch:88%] pr-12">
        {result ? 'Tu punto de partida.' : '¿Cómo trabaja tu negocio hoy?'}
      </h2>
      {!showSummary && (
        <p className="mt-3 text-[15px] leading-relaxed text-ink-muted max-w-[32rem]">
          Cuatro respuestas y te decimos con qué nivel conviene empezar.
        </p>
      )}

      {!showSummary ? (
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <Field id="dx-giro" label="Giro de tu negocio">
            <select id="dx-giro" value={businessType} onChange={(e) => setBusinessType(e.target.value)} className="field">
              {BUSINESS_TYPES.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field id="dx-herramientas" label="¿Qué usas hoy para que te contacten?">
            <input
              id="dx-herramientas"
              type="text"
              value={currentTools}
              onChange={(e) => setCurrentTools(e.target.value)}
              placeholder="WhatsApp, redes sociales, tarjetas, página web"
              className="field"
            />
          </Field>
          <Field id="dx-objetivo" label="¿Qué quieres lograr primero?">
            <select id="dx-objetivo" value={goalId} onChange={(e) => setGoalId(e.target.value)} className="field">
              {GOALS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </Field>
          <Field id="dx-volumen" label="¿Cuántos clientes atiendes?">
            <select id="dx-volumen" value={volume} onChange={(e) => setVolume(e.target.value)} className="field">
              {VOLUMES.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </Field>
          <button type="submit" className="btn btn-primary group w-full mt-3">
            Encontrar mi plan
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.5} />
          </button>
        </form>
      ) : (
        <div className="mt-8">
          {/* Lo que el visitante entregó se conserva a la vista */}
          <div className="border border-line">
            <p className="px-4 pt-3 font-mono text-[12px] text-ink-muted">Tu materia prima</p>
            <dl className="px-4 pb-4 pt-2 grid grid-cols-1 sm:grid-cols-[7rem_1fr] gap-x-4 gap-y-1.5 text-[14px]">
              {rawMaterial.map((item) => (
                <React.Fragment key={item.label}>
                  <dt className="text-ink-muted">{item.label}</dt>
                  <dd className={`transition-colors duration-700 ${result ? 'text-ink-muted' : 'text-ink'}`}>{item.value}</dd>
                </React.Fragment>
              ))}
            </dl>
          </div>

          {loading && (
            <div className="mt-8" role="status" aria-live="polite">
              <p className="text-[15px] text-ink-muted">Buscando tu punto de partida…</p>
              <div className="mt-5 space-y-3 animate-pulse" aria-hidden="true">
                <div className="h-8 w-40 bg-raised" />
                <div className="h-4 w-4/5 bg-raised" />
                <div className="h-4 w-3/5 bg-raised" />
                <div className="h-16 w-full bg-raised mt-6" />
              </div>
            </div>
          )}

          {result && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
              <div className={`mt-8 p-5 border border-line-strong ${plan.id === 'max' ? 'bg-vino/30' : 'bg-raised'}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="font-wordmark text-[1.5rem] font-bold uppercase tracking-[0.16em] text-metallic">{plan.name}</span>
                  <span className="whitespace-nowrap">
                    <span className="text-2xl font-semibold tabular-nums" style={{ fontStretch: plan.stretch }}>
                      {plan.price}
                    </span>
                    <span className="ml-1.5 font-mono text-[12px] text-ink-muted">MXN/mes</span>
                  </span>
                </div>
                <p className="mt-1 font-mono text-[12px] text-ink-muted">{plan.verb}</p>
                <p className="mt-4 text-[16px] leading-relaxed text-ink">{result.reason}</p>
              </div>

              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-[7rem_1fr] gap-x-4 gap-y-4 text-[15px]">
                <dt className="font-mono text-[12px] text-ink-muted pt-1">Primer paso</dt>
                <dd className="text-ink leading-relaxed">{result.firstStep}</dd>
                {next && (
                  <>
                    <dt className="font-mono text-[12px] text-ink-muted pt-1">Después</dt>
                    <dd className="text-ink-muted leading-relaxed">
                      Si un día quieres {next.upgradeNeed}, subes a {next.name} y conservas todo lo de {plan.name}.
                    </dd>
                  </>
                )}
              </dl>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSelectTier(tierLabel(plan));
                    onClose();
                  }}
                  className="btn btn-primary flex-1"
                >
                  Elegir {plan.name}
                </button>
                <button type="button" onClick={() => setResult(null)} className="btn btn-ghost">
                  Ajustar respuestas
                </button>
              </div>
              <p className="mt-3 text-[13px] text-ink-muted">Recomendación orientativa a partir de tus respuestas. {PRICE_NOTE}</p>
            </motion.div>
          )}
        </div>
      )}
    </ModalShell>
  );
};
