import React, { useEffect, useRef, useState } from 'react';
import { MotionConfig, useMotionValue, useMotionValueEvent, useScroll } from 'motion/react';
import { ScrollyPhase } from './types';
import { ScrollytellingCanvas } from './components/ScrollytellingCanvas';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { DiagnosticSection } from './components/DiagnosticSection';
import { PlatformDivisionsSection } from './components/PlatformDivisionsSection';
import { EconomicCycleSection } from './components/EconomicCycleSection';
import { RevenueSection } from './components/RevenueSection';
import { PricingSection } from './components/PricingSection';
import { GovernanceFaqSection } from './components/GovernanceFaqSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { DiagnosticModal } from './components/DiagnosticModal';
import { audioEngine } from './components/AudioEngine';

// Seis estados de la misma materia: de lo disperso a los cinco niveles de ForgeX.
// Las piezas se conservan; cambia su forma.
const PHASES: ScrollyPhase[] = [
  {
    id: 'disperso',
    title: 'Disperso',
    description: 'Tarjetas, menús y chats que no se conectan entre sí.',
    progressStart: 0,
    progressEnd: 0.15,
  },
  {
    id: 'conecta',
    title: 'Conecta',
    description: 'Un toque o un QR abre tu Mini Hub.',
    progressStart: 0.15,
    progressEnd: 0.32,
  },
  {
    id: 'presenta',
    title: 'Presenta',
    description: 'Tu negocio completo en una web propia.',
    progressStart: 0.32,
    progressEnd: 0.5,
  },
  {
    id: 'interactua',
    title: 'Interactúa',
    description: 'Formularios, fidelidad y más herramientas.',
    progressStart: 0.5,
    progressEnd: 0.65,
  },
  {
    id: 'automatiza',
    title: 'Automatiza',
    description: 'Procesos que avanzan y te avisan.',
    progressStart: 0.65,
    progressEnd: 0.82,
  },
  {
    id: 'piensa',
    title: 'Piensa',
    description: 'IA que interpreta y asiste.',
    progressStart: 0.82,
    progressEnd: 1,
  },
];

const SECTION_IDS = ['hero', 'diagnostico', 'divisiones', 'ciclo', 'precios', 'gobernanza', 'contacto'];

const phaseIndexFor = (progress: number) => {
  const idx = PHASES.findIndex((p) => progress >= p.progressStart && progress < p.progressEnd);
  return idx === -1 ? PHASES.length - 1 : idx;
};

// Progreso narrativo: cada sección ocupa el mismo tramo (1/6) sin importar su altura,
// así el estado del canvas coincide con lo que se está leyendo en cualquier ancho de pantalla.
const narrativeProgress = (scrollY: number, anchors: number[]) => {
  if (anchors.length < 2) return 0;
  if (scrollY <= anchors[0]) return 0;
  const last = anchors.length - 1;
  for (let i = 0; i < last; i++) {
    if (scrollY < anchors[i + 1]) {
      const span = anchors[i + 1] - anchors[i];
      return (i + (span > 0 ? (scrollY - anchors[i]) / span : 1)) / last;
    }
  }
  return 1;
};

export default function App() {
  const { scrollY } = useScroll();
  const progress = useMotionValue(0);
  const anchorsRef = useRef<number[]>([]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [prefilledTier, setPrefilledTier] = useState<string | undefined>(undefined);
  const [leadNote, setLeadNote] = useState<string | undefined>(undefined);
  const phaseIndexRef = useRef(0);

  // El scroll vive en motion values: nada de re-render por frame.
  // Solo el calor (CSS) y el cambio de estado tocan algo fuera del canvas.
  useMotionValueEvent(progress, 'change', (p) => {
    const heat = Math.max(0, Math.min(1, 1 - p * 1.1));
    document.documentElement.style.setProperty('--heat', heat.toFixed(3));

    const idx = phaseIndexFor(p);
    if (idx !== phaseIndexRef.current) {
      phaseIndexRef.current = idx;
      setPhaseIndex(idx);
      audioEngine.playSectionTransition(p);
    }
  });

  useMotionValueEvent(scrollY, 'change', (y) => progress.set(narrativeProgress(y, anchorsRef.current)));

  // Anclas: el momento en que cada sección llega a media pantalla. La última termina al final del documento.
  useEffect(() => {
    const measure = () => {
      const half = window.innerHeight * 0.5;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const anchors = SECTION_IDS.slice(0, -1).map((id) => {
        const el = document.getElementById(id);
        return el ? Math.min(maxScroll, Math.max(0, el.getBoundingClientRect().top + window.scrollY - half)) : 0;
      });
      anchors[0] = 0;
      // Preguntas y contacto comparten el último tramo ("piensa"), que termina al final del documento
      anchors.push(Math.max(anchors[anchors.length - 1] + 1, maxScroll));
      anchorsRef.current = anchors;
      progress.set(narrativeProgress(window.scrollY, anchors));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [progress]);

  // Sección activa para la navegación
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToId = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectTier = (tier: string, note?: string) => {
    setPrefilledTier(tier);
    if (note) setLeadNote(note);
    scrollToId('contacto');
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="forge-grain relative min-h-[100dvh] bg-obsidian text-ink">
        <ScrollytellingCanvas
          progress={progress}
          activePhase={PHASES[phaseIndex]}
          phaseIndex={phaseIndex}
          phaseCount={PHASES.length}
        />

        <Header
          progress={progress}
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
          activeSection={activeSection}
        />

        <main className="relative z-10">
          <HeroSection
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            onExplore={() => scrollToId('divisiones')}
            onCalculate={() => scrollToId('cuenta')}
          />
          <DiagnosticSection onOpenDiagnostic={() => setIsDiagnosticOpen(true)} />
          <PlatformDivisionsSection />
          <EconomicCycleSection />
          {/* Fuera de SECTION_IDS: vive dentro del tramo "automatiza" del canvas */}
          <RevenueSection onSelectPlan={handleSelectTier} />
          <PricingSection onSelectPlan={handleSelectTier} />
          <GovernanceFaqSection />
          <CtaSection prefilledTier={prefilledTier} note={leadNote} />
        </main>

        <Footer />

        <DiagnosticModal
          isOpen={isDiagnosticOpen}
          onClose={() => setIsDiagnosticOpen(false)}
          onSelectTier={handleSelectTier}
        />
      </div>
    </MotionConfig>
  );
}
