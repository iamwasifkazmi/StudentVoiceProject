import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import moduleRoutes from './module.routes';
import feedbackRoutes from './feedback.routes';
import impactRoutes from './impact.routes';
import notificationRoutes from './notification.routes';
import statsRoutes from './stats.routes';

const api = Router();

api.use('/auth', authRoutes);
api.use('/user', userRoutes);
api.use('/modules', moduleRoutes);
api.use('/feedback', feedbackRoutes);
api.use('/impact', impactRoutes);
api.use('/notifications', notificationRoutes);
api.use('/stats', statsRoutes);

export default api;
