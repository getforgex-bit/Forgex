import { getDiagnosis, buildAuditInquiryResponse } from './src/lib/diagnose';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  GEMINI_API_KEY?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return Response.json({
        status: 'ok',
        service: 'ForgeX Operational Engine',
        timestamp: new Date().toISOString(),
        hasApiKey: Boolean(env.GEMINI_API_KEY),
      });
    }

    if (url.pathname === '/api/diagnose' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      const result = await getDiagnosis(body as any, env.GEMINI_API_KEY);
      return Response.json(result);
    }

    if (url.pathname === '/api/audit-inquiry' && request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      return Response.json(buildAuditInquiryResponse(body as any));
    }

    return env.ASSETS.fetch(request);
  },
};
