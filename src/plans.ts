// Escalera comercial de ForgeX. Precios de lanzamiento: pueden ajustarse.
// Advance y Max se describen como capas conceptuales (información, procesos, automatización, IA),
// sin especificar arquitectura de datos ni sistemas concretos.

export type PlanId = 'basico' | 'plus' | 'pro' | 'advance' | 'max';

export interface Plan {
  id: PlanId;
  name: string;
  verb: string;
  price: string;
  /** Precio mensual en MXN como número, para cálculos (calculadora "Haz la cuenta") */
  monthly: number;
  summary: string;
  /** Detalle completo, visible en "Comparar los 5 niveles" */
  features: string[];
  /** Protagonista (Básico, Pro, Max) o escalón intermedio (Plus, Advance) */
  featured: boolean;
  /** Tres puntos de cada nivel (protagonistas e intermedios) */
  highlights: string[];
  /** Una línea de lo que incluye: qué suma sobre el nivel anterior */
  bridge: string;
  /** Ancho de la tipografía del precio: la misma materia en otro estado */
  stretch: string;
  /** Lo que alguien quiere cuando sube a este nivel: "Si un día quieres ..." */
  upgradeNeed: string;
  badge?: string;
  /** Vía alterna: en qué situación conviene este nivel ("Elígelo si") */
  fitsIf?: string[];
}

export const PLANS: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    verb: 'Conecta',
    price: '$199',
    monthly: 199,
    summary: 'El punto de entrada físico-digital de tu negocio.',
    features: [
      'Código QR y soporte NFC',
      'Mini Hub con las acciones que más importan',
      'Tarjeta de fidelidad y reseñas a un toque',
      'Analítica básica de visitas y clics',
    ],
    featured: true,
    highlights: ['Código QR y soporte NFC', 'Mini Hub con tus acciones clave', 'Fidelidad y reseñas a un toque'],
    bridge: 'Código QR, soporte NFC y tu Mini Hub con menú, fidelidad, reseñas y WhatsApp.',
    stretch: '62%',
    upgradeNeed: 'un punto de contacto a un toque',
    badge: 'Para empezar',
  },
  {
    id: 'plus',
    name: 'Plus',
    verb: 'Presenta',
    price: '$399',
    monthly: 399,
    summary: 'La web completa y oficial de tu negocio.',
    features: [
      'Todo lo de Básico',
      'Web responsiva con menú o catálogo interactivo',
      'Galería, video y ubicación',
      'Promociones propias y formularios de contacto',
    ],
    featured: false,
    highlights: ['Todo lo de Básico', 'Web completa con menú o catálogo interactivo', 'Galería, ubicación y promociones propias'],
    bridge: 'Todo lo de Básico, más tu web completa.',
    stretch: '78%',
    upgradeNeed: 'tu web completa',
    badge: 'Tu web oficial',
    fitsIf: ['Ya necesitas tu web completa con menú o catálogo', 'Todavía no necesitas formularios ni fidelización ampliados'],
  },
  {
    id: 'pro',
    name: 'Pro',
    verb: 'Interactúa',
    price: '$699',
    monthly: 699,
    summary: 'Tu web con más herramientas para que tus clientes vuelvan.',
    features: [
      'Todo lo de Plus',
      'Formularios ampliados',
      'Fidelización ampliada',
      'Más personalización y mejor analítica',
    ],
    featured: true,
    highlights: ['Todo lo de Plus, incluida tu web', 'Formularios y fidelización ampliados', 'Más personalización y mejor analítica'],
    bridge: 'Todo lo de Plus, con formularios y fidelización ampliados, más personalización y mejor analítica.',
    stretch: '94%',
    upgradeNeed: 'más herramientas para que tus clientes interactúen',
    badge: 'Recomendado',
  },
  {
    id: 'advance',
    name: 'Advance',
    verb: 'Automatiza',
    price: '$1,099',
    monthly: 1099,
    summary: 'Infraestructura para digitalizar y automatizar operaciones.',
    features: [
      'Todo lo de Pro',
      'Pedidos, citas y solicitudes',
      'Automatizaciones y avisos para tu negocio',
      'Integraciones según la solución que implementemos',
    ],
    featured: false,
    highlights: ['Todo lo de Pro', 'Pedidos, citas y solicitudes', 'Automatizaciones y avisos para tu negocio'],
    bridge: 'Todo lo de Pro, más pedidos, citas y avisos automáticos.',
    stretch: '110%',
    upgradeNeed: 'automatizar pedidos, citas o solicitudes',
    badge: 'Menos trabajo manual',
    fitsIf: ['Recibes pedidos, citas o solicitudes que hoy persigues a mano', 'Todavía no necesitas un asistente con IA'],
  },
  {
    id: 'max',
    name: 'Max',
    verb: 'Piensa y atiende',
    price: '$1,999',
    monthly: 1999,
    summary: 'La capa de inteligencia de ForgeX.',
    features: [
      'Todo lo de Advance',
      'Asistente con IA para dudas frecuentes',
      'IA que interpreta información y asiste procesos',
      'Automatización más avanzada',
    ],
    featured: true,
    highlights: ['Todo lo de Advance', 'Asistente con IA para dudas frecuentes', 'IA que interpreta información y asiste procesos'],
    bridge: 'Todo lo de Advance, más un asistente con IA que interpreta información y atiende dudas frecuentes.',
    stretch: '125%',
    upgradeNeed: 'que la IA te ayude a atender dudas frecuentes',
  },
];

export const PRICE_NOTE = 'Precios de lanzamiento en MXN. Pueden ajustarse mientras terminamos de definir cada nivel.';

/** Etiqueta que viaja al formulario de contacto y al API: "Pro · $699 MXN/mes" */
export const tierLabel = (plan: Plan) => `${plan.name} · ${plan.price} MXN/mes`;

export const planByName = (name: string | undefined): Plan | undefined => {
  if (!name) return undefined;
  const normalized = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLowerCase();
  return PLANS.find((p) => normalized.startsWith(p.id));
};
