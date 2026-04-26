import { Router } from 'express';
import { getArticles, getArticleById, getCategories, createArticle, updateArticle, deleteArticle } from '../controllers/articleController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();

router.get('/', getArticles);
router.get('/categories', getCategories);
router.get('/:id', getArticleById);

router.use(authenticate, requireAdmin);
router.post('/', createArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);

export default router;