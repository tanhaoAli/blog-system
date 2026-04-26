import { Router } from 'express';
import { getAllCategories, createCategory, deleteCategory } from '../controllers/categoryController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getAllCategories);

// Protect writes
router.use(authenticate, requireAdmin);
router.post('/', createCategory);
router.delete('/:id', deleteCategory);

export default router;