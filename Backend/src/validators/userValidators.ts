import { body } from 'express-validator';

export const updateProfileRules = [
  body('fullName').optional().trim().notEmpty().withMessage('fullName cannot be empty'),
  body('notificationPrefs').optional().isObject().withMessage('notificationPrefs must be an object'),
  body('anonymousMode').optional().isBoolean().withMessage('anonymousMode must be a boolean'),
  body('pushNotificationsEnabled')
    .optional()
    .isBoolean()
    .withMessage('pushNotificationsEnabled must be a boolean'),
];

export const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('currentPassword is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('newPassword must be at least 8 characters'),
];
