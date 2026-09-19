import React from 'react';
import { ForgeXLogo } from './ForgeXLogo';

export const Footer: React.FC = () => {
  return (
    <footer id="main-footer" className="relative z-10 border-t border-line bg-obsidian px-4 sm:px-6 lg:px-10 pt-14 pb-20">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div>
          <ForgeXLogo size="sm" />
          <p className="mt-4 max-w-[22rem] text-[15px] leading-relaxed text-ink-muted">
            Forjamos tu ventaja competitiva. Nada de lo que ya tienes se pierde.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:items-end text-[14px] text-ink-muted">
          <nav aria-label="Legal" className="flex flex-wrap gap-x-6 gap-y-2">
            <a href="#gobernanza" className="hover:text-ink transition-colors">
              Preguntas frecuentes
            </a>
            <span>Privacidad</span>
            <span>Términos</span>
          </nav>
          <p>© 2026 ForgeX Technologies S.A.P.I. de C.V. México.</p>
        </div>
      </div>
    </footer>
  );
};
