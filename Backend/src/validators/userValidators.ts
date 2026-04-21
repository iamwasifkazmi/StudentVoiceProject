import { body } from 'express-validator';

export const updateProfileRules = [
  body('fullName').optional().trim().notEmpty().withMessage('fullName cannot be empty'),
  body('notificationPrefs').optional().isObject().withMessage('notificationPrefs must be an object'),
];
