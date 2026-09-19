import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper to get GoogleGenAI lazily
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ForgeX Operational Engine',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// "Encontrar mi plan": recomienda uno de los cinco niveles de ForgeX (Gemini, con respuesta determinista de respaldo)
const PLAN_NAMES = ['Básico', 'Plus', 'Pro', 'Advance', 'Max'] as const;
type PlanName = (typeof PLAN_NAMES)[number];

const GOAL_TO_PLAN: Record<string, PlanName> = {
  encontrar: 'Básico',
  mostrar: 'Plus',
  fidelizar: 'Pro',
  pedidos: 'Advance',
  responder: 'Max',
};

const FALLBACK_COPY: Record<PlanName, { reason: string; firstStep: string }> = {
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

const normalizePlan = (value: unknown): PlanName | undefined => {
  if (typeof value !== 'string') return undefined;
  const plain = value.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
  return PLAN_NAMES.find((name) => plain.startsWith(name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()));
};

app.post('/api/diagnose', async (req, res) => {
  const { businessType, currentTools, goal, goalId, volume } = req.body ?? {};
  const fallbackPlan: PlanName = GOAL_TO_PLAN[goalId] ?? 'Básico';
  const fallback = { recommendedPlan: fallbackPlan, ...FALLBACK_COPY[fallbackPlan] };

  try {
    const ai = getGenAI();
    if (!ai) return res.json(fallback);

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
    return res.json({
      recommendedPlan: plan,
      reason: typeof parsed.reason === 'string' && parsed.reason.trim() ? parsed.reason.trim() : FALLBACK_COPY[plan].reason,
      firstStep: typeof parsed.firstStep === 'string' && parsed.firstStep.trim() ? parsed.firstStep.trim() : FALLBACK_COPY[plan].firstStep,
    });
  } catch (error: any) {
    console.error('Error in /api/diagnose:', error);
    return res.json(fallback);
  }
});

// Contact / Architecture Session Endpoint
app.post('/api/audit-inquiry', (req, res) => {
  const { email, companyName, notes, tier } = req.body;
  const confirmationId = `FGX-${Date.now().toString(36).toUpperCase()}`;

  console.log(`[ForgeX Inquiry] ${confirmationId} | Email: ${email} | Tier: ${tier || 'Default'}`);

  res.json({
    success: true,
    confirmationId,
    message: 'Solicitud de sesión de arquitectura registrada con éxito.',
    receivedAt: new Date().toISOString(),
  });
});

// Start server with Vite middleware in development or static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ForgeX] Operational Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
