import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { audioEngine } from './AudioEngine';
import { formatTier } from '../format';

interface CtaSectionProps {
  prefilledTier?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

export const CtaSection: React.FC<CtaSectionProps> = ({ prefilledTier }) => {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setError(null);
    audioEngine.playTick(1000, 0.06);

    try {
      const res = await fetch('/api/audit-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName: companyName || 'Sin especificar',
          tier: prefilledTier || 'Por definir',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data.confirmationId) throw new Error('Sin folio');
      setConfirmationCode(data.confirmationId);
    } catch {
      setError('No pudimos enviar tu solicitud. Revisa tu conexión e intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="relative py-28 md:py-40 px-4 sm:px-6 lg:px-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 lg:items-end">
        <div className="lg:col-span-7">
          <h2 className="text-[clamp(2.5rem,5.8vw,5.25rem)] font-semibold leading-[1] tracking-[-0.025em] [font-stretch:86%]">
            Empieza con un toque.
          </h2>
          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-ink-muted">
            Cuéntanos de tu negocio y te ayudamos a elegir y configurar tu primer nivel. Sin compromiso.
          </p>
        </div>

        <div className="lg:col-span-5 bg-surface border border-line p-6 sm:p-9">
          <AnimatePresence mode="wait" initial={false}>
            {confirmationCode ? (
              // Lo que entregaste se conserva: ahora es un registro con folio.
              <motion.div
                key="receipt"
                role="status"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <span className="font-mono text-[12px] text-ink-muted">Folio</span>
                <p className="mt-1 font-mono text-2xl text-champagne">{confirmationCode}</p>
                <p className="mt-6 text-xl font-medium">Solicitud recibida.</p>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-muted">
                  Te contactaremos pronto para platicar tu primer nivel.
                </p>
                <dl className="mt-7 pt-5 border-t border-line grid grid-cols-[6.5rem_1fr] gap-y-2.5 text-[15px]">
                  <dt className="font-mono text-[12px] text-ink-muted pt-0.5">Correo</dt>
                  <dd className="text-ink break-all">{email}</dd>
                  <dt className="font-mono text-[12px] text-ink-muted pt-0.5">Negocio</dt>
                  <dd className="text-ink">{companyName || 'Sin especificar'}</dd>
                  <dt className="font-mono text-[12px] text-ink-muted pt-0.5">Nivel</dt>
                  <dd className="text-ink">{prefilledTier ? formatTier(prefilledTier) : 'Por definir juntos'}</dd>
                </dl>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex flex-col gap-5"
              >
                {prefilledTier && (
                  <div className="flex items-baseline justify-between gap-4 pb-4 border-b border-line">
                    <span className="font-mono text-[12px] text-ink-muted">Nivel elegido</span>
                    <span className="text-[15px] text-ink text-right">{formatTier(prefilledTier)}</span>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label htmlFor="input-cta-email" className="text-[14px] text-ink-muted">
                    Correo
                  </label>
                  <input
                    id="input-cta-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@tunegocio.mx"
                    className="field"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="input-cta-company" className="text-[14px] text-ink-muted">
                    Nombre del negocio <span className="text-ink-muted">(opcional)</span>
                  </label>
                  <input
                    id="input-cta-company"
                    type="text"
                    name="organization"
                    autoComplete="organization"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="field"
                  />
                </div>

                <button id="btn-cta-submit" type="submit" disabled={isSubmitting} className="btn btn-primary group w-full mt-1">
                  {isSubmitting ? 'Enviando…' : 'Quiero empezar'}
                  {!isSubmitting && (
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.5} />
                  )}
                </button>

                {error && (
                  <p role="alert" className="flex items-start gap-2 text-[14px] text-ink">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-error" strokeWidth={1.5} />
                    {error}
                  </p>
                )}

                <p className="text-[13px] text-ink-muted">Confidencial. Sin compromiso de contratación.</p>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
