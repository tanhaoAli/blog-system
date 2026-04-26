import { Router } from 'express';
import { getCommentsByArticle, addComment } from '../controllers/commentController';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Route format is /api/v1/comments/:articleId
router.get('/:articleId', getCommentsByArticle);

router.use(authenticate);
router.post('/:articleId', addComment);

export default router;