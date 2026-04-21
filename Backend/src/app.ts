import express from 'express';
import cors from 'cors';
import api from './routes';

const app = express();

const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin: corsOrigin ? corsOrigin.split(',').map(s => s.trim()) : true,
    credentials: true,
  }),
);
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api', api);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

export default app;
