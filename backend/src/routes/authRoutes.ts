import { Router } from 'express';
import { register, login, getBloggerInfo, resetPassword } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/blogger-info', getBloggerInfo);
router.post('/reset-password', resetPassword);

export default router;