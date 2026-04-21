import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { fail } from '../utils/response';

export function handleValidation(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const msg = errors.array().map(e => e.msg).join('; ');
    return fail(res, msg, 400);
  }
  next();
}
