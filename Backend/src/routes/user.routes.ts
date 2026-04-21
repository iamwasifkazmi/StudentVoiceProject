import { Router } from 'express';
import * as user from '../controllers/userController';
import { requireAuth } from '../middleware/auth';
import { handleValidation } from '../middleware/validate';
import { updateProfileRules } from '../validators/userValidators';

const r = Router();

r.get('/profile', requireAuth, user.getProfile);
r.put('/profile', requireAuth, updateProfileRules, handleValidation, user.updateProfile);

export default r;
