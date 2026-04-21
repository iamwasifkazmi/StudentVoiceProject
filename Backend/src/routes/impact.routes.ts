import { Router } from 'express';
import * as impact from '../controllers/impactController';
import { requireAuth } from '../middleware/auth';

const r = Router();

r.get('/', requireAuth, impact.listImpact);

export default r;
