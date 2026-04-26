import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCommentsByArticle = async (req: Request, res: Response) => {
  const articleId = parseInt(req.params.articleId);
  if (isNaN(articleId)) return res.status(400).json({ success: false, message: '无效ID' });

  const comments = await prisma.comment.findMany({
    where: { article_id: articleId, parent_id: null }, // Top level comments
    include: {
      user: { select: { id: true, username: true, avatar_url: true } },
      replies: {
        include: {
          user: { select: { id: true, username: true, avatar_url: true } }
        },
        orderBy: { created_at: 'asc' }
      }
    },
    orderBy: { created_at: 'desc' }
  });

  res.json({ success: true, data: comments, message: '获取成功' });
};

export const addComment = async (req: Request, res: Response) => {
  const article_id = parseInt(req.params.articleId);
  const user_id = req.user?.id;
  const { content, parent_id } = req.body;

  if (isNaN(article_id)) return res.status(400).json({ success: false, message: '无效的文章ID' });
  if (!user_id) return res.status(401).json({ success: false, message: '请先登录' });
  if (!content) return res.status(400).json({ success: false, message: '评论内容不能为空' });

  const newComment = await prisma.comment.create({
    data: {
      content,
      article_id,
      user_id,
      parent_id: parent_id || null
    },
    include: {
      user: { select: { id: true, username: true, avatar_url: true } }
    }
  });

  res.json({ success: true, data: newComment, message: '评论成功' });
};
