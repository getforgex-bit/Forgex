import React, { useState } from 'react';
import { motion, MotionValue } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import { ForgeXLogo } from './ForgeXLogo';
import { audioEngine } from './AudioEngine';

interface HeaderProps {
  progress: MotionValue<number>;
  onOpenDiagnostic: () => void;
  activeSection: string;
}

const NAV = [
  { id: 'nav-link-modulos', target: 'divisiones', label: 'Cómo crece' },
  { id: 'nav-link-metodo', target: 'ciclo', label: 'Cómo empiezas' },
  { id: 'nav-link-precios', target: 'precios', label: 'Planes' },
  { id: 'nav-link-arquitectura', target: 'gobernanza', label: 'Preguntas' },
];

export const Header: React.FC<HeaderProps> = ({ progress, onOpenDiagnostic, activeSection }) => {
  const [isAudioActive, setIsAudioActive] = useState(false);

  const scrollToSection = (id: string) => {
    audioEngine.playTick(750, 0.04);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header id="main-architectural-header" className="fixed top-0 inset-x-0 z-30 h-16 bg-obsidian border-b border-line">
      <div className="max-w-[1400px] mx-auto h-full px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-6">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="ForgeX, volver al inicio"
          className="shrink-0"
        >
          <ForgeXLogo size="md" />
        </button>

        <nav aria-label="Principal" className="hidden md:flex items-center gap-6 lg:gap-8 h-full">
          {NAV.map((item) => {
            const isActive = activeSection === item.target;
            return (
              <button
                key={item.id}
                id={item.id}
                type="button"
                onClick={() => scrollToSection(item.target)}
                aria-current={isActive ? 'true' : undefined}
                className={`relative h-full text-[15px] transition-colors ${isActive ? 'text-ink' : 'text-ink-muted hover:text-ink'}`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 bottom-0 h-[2px] bg-accent origin-left transition-transform duration-300 ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-sound-toggle"
            type="button"
            onClick={() => setIsAudioActive(audioEngine.toggleSound())}
            aria-pressed={isAudioActive}
            aria-label={isAudioActive ? 'Desactivar sonido ambiental' : 'Activar sonido ambiental'}
            className={`w-10 h-10 flex items-center justify-center border transition-colors ${
              isAudioActive ? 'border-champagne text-champagne' : 'border-line text-ink-muted hover:text-ink hover:border-line-strong'
            }`}
          >
            {isAudioActive ? <Volume2 className="w-4 h-4" strokeWidth={1.5} /> : <VolumeX className="w-4 h-4" strokeWidth={1.5} />}
          </button>

          <button
            id="btn-nav-diagnostico"
            type="button"
            onClick={() => {
              audioEngine.playTick(1000, 0.05);
              onOpenDiagnostic();
            }}
            className="btn btn-primary !py-3 !px-4 text-[14px]"
          >
            <span>
              <span className="lg:hidden">Mi plan</span>
              <span className="hidden lg:inline">Encontrar mi plan</span>
            </span>
          </button>
        </div>
      </div>

      {/* Avance de la transformación, con el color del calor actual */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute left-0 right-0 -bottom-px h-[2px] bg-accent origin-left"
      />
    </header>
  );
};
