import { Router } from 'express';
import * as teacher from '../controllers/teacherController';
import { requireAuth } from '../middleware/auth';
import { requireTeacher } from '../middleware/requireTeacher';
import { handleValidation } from '../middleware/validate';
import { teacherRespondRules } from '../validators/teacherValidators';

const r = Router();

r.use(requireAuth, requireTeacher);

r.get('/feedback', teacher.listAllFeedback);
r.get('/feedback/:id', teacher.getFeedbackDetail);
r.put('/feedback/:id/response', teacherRespondRules, handleValidation, teacher.respondToFeedback);

export default r;
