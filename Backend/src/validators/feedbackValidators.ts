import { body } from 'express-validator';

export const createFeedbackRules = [
  body('moduleId').isUUID().withMessage('moduleId must be a valid UUID'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be 1–5'),
  body('comment')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 500 })
    .withMessage('comment max 500 characters'),
];
