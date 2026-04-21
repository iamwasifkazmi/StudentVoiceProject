import { Router } from 'express';
import * as modules from '../controllers/moduleController';
import { requireAuth } from '../middleware/auth';

const r = Router();

r.get('/', requireAuth, modules.listModules);
r.get('/:id', requireAuth, modules.getModule);

export default r;
