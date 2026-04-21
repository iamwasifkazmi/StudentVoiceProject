import { Router } from 'express';
import * as stats from '../controllers/statsController';
import { requireAuth } from '../middleware/auth';

const r = Router();

r.get('/dashboard', requireAuth, stats.dashboard);

export default r;
