/**
 * Vercel serverless entry: all HTTP traffic is rewritten here (see vercel.json).
 * Local dev continues to use `src/index.ts` with `app.listen`.
 */
import 'dotenv/config';
import app from '../src/app';

export default app;
