import { body } from 'express-validator';

export const registerRules = [
  body('fullName').trim().notEmpty().withMessage('fullName is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('studentId').trim().notEmpty().withMessage('studentId is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters'),
];

export const loginRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('password is required'),
];

export const refreshRules = [
  body('refreshToken').notEmpty().withMessage('refreshToken is required'),
];

export const forgotRules = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
];
