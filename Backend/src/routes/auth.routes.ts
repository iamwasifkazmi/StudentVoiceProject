import { Router } from 'express';
import * as auth from '../controllers/authController';
import { handleValidation } from '../middleware/validate';
import {
  registerRules,
  loginRules,
  refreshRules,
  forgotRules,
} from '../validators/authValidators';

const r = Router();

r.post('/register', registerRules, handleValidation, auth.register);
r.post('/login', loginRules, handleValidation, auth.login);
r.post('/refresh', refreshRules, handleValidation, auth.refresh);
r.post('/forgot-password', forgotRules, handleValidation, auth.forgotPassword);

export default r;
