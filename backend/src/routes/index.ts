import { Router } from 'express';
import authRoutes from './authRoutes';
import articleRoutes from './articleRoutes';
import adminRoutes from './adminRoutes';
import categoryRoutes from './categoryRoutes';
import tagRoutes from './tagRoutes';
import uploadRoutes from './uploadRoutes';
import commentRoutes from './commentRoutes';
import statsRoutes from './statsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', authRoutes); // Aliased for frontend blogger-info
router.use('/articles', articleRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/tags', tagRoutes);
router.use('/upload', uploadRoutes);
router.use('/comments', commentRoutes);
router.use('/stats', statsRoutes);

export default router;