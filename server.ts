import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getDiagnosis, buildAuditInquiryResponse } from './src/lib/diagnose';

const app = express();
const PORT = 3000;

app.use(express.json());

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
app.post('/api/diagnose', async (req, res) => {
  const result = await getDiagnosis(req.body, process.env.GEMINI_API_KEY);
  res.json(result);
});

// Contact / Architecture Session Endpoint
app.post('/api/audit-inquiry', (req, res) => {
  res.json(buildAuditInquiryResponse(req.body));
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
