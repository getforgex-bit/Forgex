import { GoogleGenAI } from '@google/genai';

export const PLAN_NAMES = ['Básico', 'Plus', 'Pro', 'Advance', 'Max'] as const;
export type PlanName = (typeof PLAN_NAMES)[number];

export const GOAL_TO_PLAN: Record<string, PlanName> = {
  encontrar: 'Básico',
  mostrar: 'Plus',
  fidelizar: 'Pro',
  pedidos: 'Advance',
  responder: 'Max',
};

export const FALLBACK_COPY: Record<PlanName, { reason: string; firstStep: string }> = {
  Básico: {
    reason: 'Tu prioridad es que te encuentren y te contacten fácil. Básico pone tu negocio al alcance de un toque con QR, NFC y un Mini Hub.',
    firstStep: 'Definimos las acciones de tu Mini Hub (por ejemplo WhatsApp, menú y reseñas) y preparamos tu QR y tu soporte NFC.',
  },
  Plus: {
    reason: 'Quieres mostrar tu negocio completo. Plus te da una web propia con menú o catálogo interactivo, galería y ubicación, además de todo lo de Básico.',
    firstStep: 'Reunimos tu logo, fotos y menú o catálogo para armar tu web sobre una plantilla probada.',
  },
  Pro: {
    reason: 'Te interesa que tus clientes regresen. Pro suma fidelización ampliada y formularios más completos sobre tu web.',
    firstStep: 'Definimos la mecánica de tu tarjeta de fidelidad (sellos y recompensa) y qué quieres preguntar en tus formularios.',
  },
  Advance: {
    reason: 'Quieres recibir pedidos o citas sin perseguirlos. Advance digitaliza y automatiza esos procesos y te avisa cuando algo llega.',
    firstStep: 'Revisamos cómo recibes hoy pedidos o citas para definir el primer proceso que vamos a automatizar.',
  },
  Max: {
    reason: 'Te interesa que las dudas frecuentes se atiendan sin que tengas que estar pegado al teléfono. Max combina automatización con IA para interpretar preguntas y asistir la atención.',
    firstStep: 'Reunimos la información que la IA debe conocer: productos, horarios, precios y preguntas frecuentes.',
  },
};

export const normalizePlan = (value: unknown): PlanName | undefined => {
  if (typeof value !== 'string') return undefined;
  const plain = value.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
  return PLAN_NAMES.find((name) => plain.startsWith(name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()));
};

export interface DiagnoseRequestBody {
  businessType?: string;
  currentTools?: string;
  goal?: string;
  goalId?: string;
  volume?: string;
}

export interface DiagnoseResponse {
  recommendedPlan: PlanName;
  reason: string;
  firstStep: string;
}

export async function getDiagnosis(body: DiagnoseRequestBody, apiKey: string | undefined): Promise<DiagnoseResponse> {
  const { businessType, currentTools, goal, goalId, volume } = body ?? {};
  const fallbackPlan: PlanName = GOAL_TO_PLAN[goalId ?? ''] ?? 'Básico';
  const fallback: DiagnoseResponse = { recommendedPlan: fallbackPlan, ...FALLBACK_COPY[fallbackPlan] };

  if (!apiKey) return fallback;

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const prompt = `Eres asesor comercial de ForgeX, que construye herramientas digitales para negocios locales en México por niveles:
- Básico ($199 MXN/mes): QR + NFC + Mini Hub, una micro-página con acciones como menú, tarjeta de fidelidad, reseñas y WhatsApp.
- Plus ($399 MXN/mes): la web completa del negocio (menú o catálogo interactivo, galería, ubicación, promociones propias) + todo Básico.
- Pro ($699 MXN/mes): más interacción: formularios ampliados, fidelización ampliada, más personalización y mejor analítica.
- Advance ($1,099 MXN/mes): infraestructura para digitalizar y automatizar operaciones como pedidos, citas y solicitudes.
- Max ($1,999 MXN/mes): capa de inteligencia que combina automatización con IA para interpretar información y asistir determinados procesos.

Negocio:
- Giro: ${businessType || 'No especificado'}
- Lo que usa hoy: ${currentTools || 'No especificado'}
- Lo que quiere lograr primero: ${goal || 'No especificado'}
- Clientes por semana: ${volume || 'No especificado'}

Recomienda el nivel más bajo que resuelva su objetivo principal. Responde SOLO JSON:
{"recommendedPlan": "Básico" | "Plus" | "Pro" | "Advance" | "Max", "reason": "máximo 2 frases", "firstStep": "1 frase"}

Reglas: español de México, tono directo y cercano. No inventes cifras, porcentajes ni plazos. No menciones CRM, bases de datos, almacenamiento de datos, publicidad pagada, add-ons ni plugins. Describe Pro y Max de forma conceptual.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.2 },
    });

    const parsed = JSON.parse(response.text || '{}');
    const plan = normalizePlan(parsed.recommendedPlan) ?? fallbackPlan;
    return {
      recommendedPlan: plan,
      reason: typeof parsed.reason === 'string' && parsed.reason.trim() ? parsed.reason.trim() : FALLBACK_COPY[plan].reason,
      firstStep: typeof parsed.firstStep === 'string' && parsed.firstStep.trim() ? parsed.firstStep.trim() : FALLBACK_COPY[plan].firstStep,
    };
  } catch (error) {
    console.error('Error in getDiagnosis:', error);
    return fallback;
  }
}

export interface AuditInquiryBody {
  email?: string;
  companyName?: string;
  notes?: string;
  tier?: string;
}

export interface AuditInquiryResponse {
  success: true;
  confirmationId: string;
  message: string;
  receivedAt: string;
}

export function buildAuditInquiryResponse(body: AuditInquiryBody): AuditInquiryResponse {
  const { email, tier, notes } = body ?? {};
  const confirmationId = `FGX-${Date.now().toString(36).toUpperCase()}`;

  console.log(`[ForgeX Inquiry] ${confirmationId} | Email: ${email} | Tier: ${tier || 'Default'}${notes ? ` | Notes: ${String(notes).slice(0, 500)}` : ''}`);

  return {
    success: true,
    confirmationId,
    message: 'Solicitud de sesión de arquitectura registrada con éxito.',
    receivedAt: new Date().toISOString(),
  };
}
