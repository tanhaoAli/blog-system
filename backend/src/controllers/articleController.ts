import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get paginated articles
export const getArticles = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    
    const skip = (page - 1) * limit;

    let whereClause = {};
    if (category) {
      whereClause = {
        category: {
          name: category
        }
      };
    }

    const [total, items] = await Promise.all([
      prisma.article.count({ where: whereClause }),
      prisma.article.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        include: {
          category: true,
          tags: {
            include: {
              tag: true
            }
          }
        }
      })
    ]);

    const formattedItems = items.map(item => ({
      id: item.id,
      title: item.title,
      summary: item.summary,
      content: item.content,
      author_id: item.author_id,
      cover_image: item.cover_image,
      views: item.views,
      category: item.category?.name || '未分类',
      tags: item.tags.map(t => t.tag.name),
      created_at: item.created_at
    }));

    res.json({
      success: true,
      data: {
        items: formattedItems,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      message: '获取成功'
    });
  } catch (error) {
    throw error;
  }
};

// Get single article by ID
export const getArticleById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const articleId = parseInt(id);

  if (isNaN(articleId)) {
    return res.status(400).json({ success: false, message: '无效的文章ID' });
  }

  const article = await prisma.article.update({
    where: { id: articleId },
    data: { views: { increment: 1 } },
    include: {
      category: true,
      tags: { include: { tag: true } }
    }
  });

  if (!article) {
    return res.status(404).json({ success: false, message: '文章未找到' });
  }

  res.json({
    success: true,
    data: {
      id: article.id,
      title: article.title,
      summary: article.summary,
      content: article.content,
      author_id: article.author_id,
      cover_image: article.cover_image,
      views: article.views,
      category: article.category?.name || '未分类',
      tags: article.tags.map(t => t.tag.name),
      created_at: article.created_at
    },
    message: '获取成功'
  });
};

export const createArticle = async (req: Request, res: Response) => {
  const { title, content, summary, cover_image, category_name, tags } = req.body;
  const author_id = req.user?.id;

  if (!author_id) {
    return res.status(401).json({ success: false, message: '未授权' });
  }

  let category_id = null;
  if (category_name) {
    const category = await prisma.category.findUnique({ where: { name: category_name } });
    if (category) {
      category_id = category.id;
    } else {
      const newCat = await prisma.category.create({ data: { name: category_name } });
      category_id = newCat.id;
    }
  }

  const articleData: any = {
    title,
    content,
    summary: summary || title.substring(0, 100),
    cover_image,
    author_id
  };

  if (category_id) {
    articleData.category_id = category_id;
  }

  if (tags && Array.isArray(tags)) {
    const tagConnects = [];
    for (const tagName of tags) {
      let tag = await prisma.tag.findUnique({ where: { name: tagName } });
      if (!tag) {
        tag = await prisma.tag.create({ data: { name: tagName } });
      }
      tagConnects.push({ tag_id: tag.id });
    }
    articleData.tags = { create: tagConnects };
  }

  const newArticle = await prisma.article.create({
    data: articleData
  });

  res.status(201).json({
    success: true,
    data: newArticle,
    message: '发布成功'
  });
};

// Get category counts
export const getCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { articles: true }
      }
    }
  });

  const formattedCats = categories.map(c => ({
    id: c.id,
    name: c.name,
    count: c._count.articles
  }));

  res.json({
    success: true,
    data: formattedCats,
    message: '获取成功'
  });
};

export const updateArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const articleId = parseInt(id);
  const { title, content, summary, cover_image, category_name, tags } = req.body;

  if (isNaN(articleId)) {
    return res.status(400).json({ success: false, message: '无效的文章ID' });
  }

  let category_id = null;
  if (category_name) {
    const category = await prisma.category.findUnique({ where: { name: category_name } });
    if (category) {
      category_id = category.id;
    } else {
      const newCat = await prisma.category.create({ data: { name: category_name } });
      category_id = newCat.id;
    }
  }

  const articleData: any = {};
  if (title) articleData.title = title;
  if (content) articleData.content = content;
  if (cover_image !== undefined) articleData.cover_image = cover_image;

  if (summary !== undefined) {
    articleData.summary = summary || title?.substring(0, 100) || '';
  }

  if (category_id) {
    articleData.category_id = category_id;
  }

  try {
    // Update article base info
    await prisma.article.update({
      where: { id: articleId },
      data: articleData
    });

    // Handle tags
    if (tags && Array.isArray(tags)) {
      // Delete old tags
      await prisma.articleTag.deleteMany({
        where: { article_id: articleId }
      });

      const tagConnects = [];
      for (const tagName of tags) {
        let tag = await prisma.tag.findUnique({ where: { name: tagName } });
        if (!tag) {
          tag = await prisma.tag.create({ data: { name: tagName } });
        }
        tagConnects.push({ tag_id: tag.id });
      }

      if (tagConnects.length > 0) {
        await prisma.article.update({
          where: { id: articleId },
          data: {
            tags: {
              create: tagConnects
            }
          }
        });
      }
    }

    res.json({
      success: true,
      message: '更新成功'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '更新失败' });
  }
};

export const deleteArticle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const articleId = parseInt(id);

  if (isNaN(articleId)) {
    return res.status(400).json({ success: false, message: '无效的文章ID' });
  }

  try {
    await prisma.article.delete({
      where: { id: articleId }
    });

    res.json({
      success: true,
      message: '删除成功'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '删除失败' });
  }
};
