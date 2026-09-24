import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { audioEngine } from './AudioEngine';
import { PLANS, PlanId, tierLabel } from '../plans';
import { breakEvenVisits, computeRevenue, formatMXN } from '../lib/revenue';

interface RevenueSectionProps {
  /** Elige un nivel y deja la cuenta del dueño como nota para la primera conversación */
  onSelectPlan: (tier: string, note: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

// Valores de ejemplo: el dueño los cambia por los suyos. No son datos de clientes reales.
const DEFAULTS = { ticket: '150', weekly: '120', margin: '40' };
const DEFAULT_RETURN = 5;

const toNumber = (value: string) => {
  const n = parseFloat(value.replace(/[^\d.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const NumberField: React.FC<{
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
}> = ({ id, label, value, onChange, prefix, suffix }) => (
  <div className="flex flex-col gap-2">
    <label htmlFor={id} className="text-[14px] text-ink-muted">
      {label}
    </label>
    <div className="relative">
      {prefix && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-[14px] text-ink-muted">{prefix}</span>}
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ''))}
        className={`field tabular-nums ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-10' : ''}`}
      />
      {suffix && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[14px] text-ink-muted">{suffix}</span>}
    </div>
  </div>
);

export const RevenueSection: React.FC<RevenueSectionProps> = ({ onSelectPlan }) => {
  const [ticket, setTicket] = useState(DEFAULTS.ticket);
  const [weekly, setWeekly] = useState(DEFAULTS.weekly);
  const [margin, setMargin] = useState(DEFAULTS.margin);
  const [returnPct, setReturnPct] = useState(DEFAULT_RETURN);
  const [selectedId, setSelectedId] = useState<PlanId>('pro');

  const result = useMemo(
    () =>
      computeRevenue({
        ticket: toNumber(ticket),
        weeklyClients: toNumber(weekly),
        marginPct: toNumber(margin),
        returnPct,
      }),
    [ticket, weekly, margin, returnPct]
  );

  const selected = PLANS.find((p) => p.id === selectedId) ?? PLANS[0];
  const selectedBreakEven = breakEvenVisits(selected.monthly, result.profitPerVisit);
  const covers = selectedBreakEven !== null && result.extraVisits >= selectedBreakEven;

  const handleChoose = () => {
    audioEngine.playTick(1000, 0.05);
    const note =
      `Haz la cuenta: ticket ${formatMXN(toNumber(ticket))}, ${toNumber(weekly)} clientes/semana, ` +
      `margen ${toNumber(margin)}%, escenario ${returnPct}% regresan una vez más al mes ` +
      `(${result.extraVisits} visitas, ${formatMXN(result.extraProfit)} de ganancia). ` +
      `${selected.name} se cubre con ${selectedBreakEven ?? '—'} visitas extra.`;
    onSelectPlan(tierLabel(selected), note);
  };

  return (
    <section id="cuenta" className="relative py-28 md:py-40 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-[50rem]">
          <h2 className="text-[clamp(2.25rem,4.6vw,4rem)] font-semibold leading-[1.02] tracking-[-0.025em] [font-stretch:86%]">
            Haz la cuenta: ¿se paga solo?
          </h2>
          <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-ink-muted">
            Pon los números de tu negocio y mira cuántos clientes tendrían que regresar una vez más al mes para cubrir tu
            plan. Lo que pase de ahí es ganancia para ti.
          </p>
        </div>

        <div className="mt-14 md:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Materia prima: los números del dueño */}
          <div className="lg:col-span-5 bg-surface border border-line p-6 sm:p-8 flex flex-col gap-5 self-start">
            <p className="font-mono text-[12px] text-ink-muted">Tus números</p>
            <NumberField id="rv-ticket" label="¿Cuánto gasta un cliente por visita?" value={ticket} onChange={setTicket} prefix="$" suffix="MXN" />
            <NumberField id="rv-weekly" label="¿Cuántos clientes atiendes por semana?" value={weekly} onChange={setWeekly} />
            <NumberField id="rv-margin" label="De cada venta, ¿cuánto te queda de ganancia?" value={margin} onChange={setMargin} suffix="%" />

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-baseline justify-between gap-4">
                <label htmlFor="rv-return" className="text-[14px] text-ink-muted">
                  Si de tus clientes del mes regresara una vez más…
                </label>
                <output htmlFor="rv-return" className="font-mono text-[15px] text-champagne tabular-nums">
                  {returnPct}%
                </output>
              </div>
              <input
                id="rv-return"
                type="range"
                min={1}
                max={20}
                step={1}
                value={returnPct}
                onChange={(e) => setReturnPct(Number(e.target.value))}
                className="w-full accent-[var(--color-champagne)]"
              />
            </div>

            <p className="text-[13px] leading-relaxed text-ink-muted border-t border-line pt-4">
              Valores de ejemplo: cámbialos por los tuyos. Nada de esto se envía hasta que tú lo decidas.
            </p>
          </div>

          {/* Lo que se forja con esos números */}
          <div className="lg:col-span-7 bg-obsidian/85" aria-live="polite">
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-line border border-line">
              {[
                { label: 'Visitas extra al mes', value: result.extraVisits.toLocaleString('es-MX') },
                { label: 'Ventas extra al mes', value: formatMXN(result.extraSales) },
                { label: 'Ganancia extra al mes', value: formatMXN(result.extraProfit) },
              ].map((item) => (
                <div key={item.label} className="bg-obsidian p-5">
                  <dt className="font-mono text-[12px] text-ink-muted">{item.label}</dt>
                  <dd className="mt-2 text-[1.75rem] font-semibold tabular-nums leading-none [font-stretch:90%]">{item.value}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-10 font-mono text-[12px] text-ink-muted">Visitas extra al mes para cubrir cada nivel</p>
            <ul className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label="Nivel a comparar">
              {PLANS.map((plan) => {
                const needed = breakEvenVisits(plan.monthly, result.profitPerVisit);
                const ok = needed !== null && result.extraVisits >= needed;
                const fill = needed === null ? 0 : Math.min(1, result.extraVisits / needed);
                const isSelected = plan.id === selectedId;
                return (
                  <li key={plan.id}>
                    <button
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => {
                        audioEngine.playTick(700, 0.03);
                        setSelectedId(plan.id);
                      }}
                      className={`w-full text-left grid grid-cols-[5.5rem_1fr_auto] items-center gap-4 px-4 py-3 border transition-colors ${
                        isSelected ? 'border-champagne bg-raised' : 'border-line hover:border-line-strong'
                      }`}
                    >
                      <span className="text-[15px] font-medium">{plan.name}</span>
                      <span className="relative h-[6px] bg-line overflow-hidden" aria-hidden="true">
                        <motion.span
                          className={`absolute inset-y-0 left-0 ${ok ? 'bg-champagne' : 'bg-vino-glow'}`}
                          initial={false}
                          animate={{ width: `${fill * 100}%` }}
                          transition={{ duration: 0.5, ease: EASE }}
                        />
                      </span>
                      <span className="font-mono text-[13px] tabular-nums text-ink-muted whitespace-nowrap">
                        {needed === null ? '—' : `${needed} visitas`} · {plan.price}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className={`mt-8 p-6 border ${covers ? 'border-champagne/60 bg-raised' : 'border-line-strong bg-surface'}`}>
              {selectedBreakEven === null ? (
                <p className="text-[17px] leading-relaxed">Pon cuánto te queda de cada venta para hacer la cuenta.</p>
              ) : (
                <>
                  <p className="text-[clamp(1.25rem,2vw,1.5rem)] font-medium leading-snug [font-stretch:94%]">
                    {selected.name} se cubre con {selectedBreakEven} {selectedBreakEven === 1 ? 'cliente que regrese' : 'clientes que regresen'}{' '}
                    una vez más al mes.
                  </p>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-muted">
                    {covers
                      ? `En tu escenario regresan ${result.extraVisits}: te quedarían ${formatMXN(
                          result.extraProfit - selected.monthly
                        )} de ganancia después de pagar ${selected.name}.`
                      : `En tu escenario regresan ${result.extraVisits}. Prueba otro nivel o ajusta tus números para ver qué te conviene.`}
                  </p>
                </>
              )}
              <button type="button" onClick={handleChoose} className="btn btn-primary group mt-6 w-full sm:w-auto">
                Quiero que mis clientes regresen
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.5} />
              </button>
            </div>

            <p className="mt-4 text-[13px] leading-relaxed text-ink-muted">
              Cálculo orientativo con los números que tú pones. No es una promesa de resultados: cuántos clientes regresan
              depende de tu negocio. Un mes se cuenta como 4.33 semanas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
