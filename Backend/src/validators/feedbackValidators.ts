import { body } from 'express-validator';

export const createFeedbackRules = [
  body('moduleId').optional().isUUID().withMessage('moduleId must be a valid UUID'),
  body('moduleCode')
    .optional()
    .isString()
    .trim()
    .isLength({ min: 2, max: 32 })
    .withMessage('moduleCode must be 2–32 characters'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('rating must be 1–5'),
  body('comment')
    .optional({ nullable: true })
    .isString()
    .isLength({ max: 500 })
    .withMessage('comment max 500 characters'),
  body().custom((_, { req }) => {
    const b = req.body as { moduleId?: string; moduleCode?: string };
    const hasId = typeof b.moduleId === 'string' && b.moduleId.trim().length > 0;
    const hasCode = typeof b.moduleCode === 'string' && b.moduleCode.trim().length > 0;
    if (!hasId && !hasCode) {
      throw new Error('Provide moduleId or moduleCode');
    }
    return true;
  }),
];
