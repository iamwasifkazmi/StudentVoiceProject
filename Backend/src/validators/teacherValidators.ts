import { body } from 'express-validator';

export const teacherRespondRules = [
  body('response').trim().notEmpty().withMessage('response is required'),
];
