import { Router } from 'express';
import { getStats, getUsers, updateUserRole, deleteUser } from '../controllers/adminController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

// Require admin for all admin routes
router.use(authenticate, requireAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;