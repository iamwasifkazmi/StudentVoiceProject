import { Router } from 'express';
import * as feedback from '../controllers/feedbackController';
import { requireAuth } from '../middleware/auth';
import { handleValidation } from '../middleware/validate';
import { createFeedbackRules } from '../validators/feedbackValidators';

const r = Router();

r.get('/', requireAuth, feedback.listFeedback);
r.get('/:id', requireAuth, feedback.getFeedback);
r.post('/', requireAuth, createFeedbackRules, handleValidation, feedback.createFeedback);
r.delete('/:id', requireAuth, feedback.deleteFeedback);

export default r;
