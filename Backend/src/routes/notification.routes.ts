import { Router } from 'express';
import * as notifications from '../controllers/notificationController';
import { requireAuth } from '../middleware/auth';

const r = Router();

r.get('/', requireAuth, notifications.listNotifications);
r.put('/:id/read', requireAuth, notifications.markRead);

export default r;
