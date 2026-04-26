import { Router } from 'express';
import { getTags, createTag, deleteTag } from '../controllers/tagController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

// Tags can be retrieved by anyone or admin? Admin needs it for management, but maybe frontend needs it too. 
router.get('/', getTags);

// Protect writes
router.use(authenticate, requireAdmin);
router.post('/', createTag);
router.delete('/:id', deleteTag);

export default router;