import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get Admin Stats
export const getStats = async (req: Request, res: Response) => {
  const [totalArticles, totalViews, totalCategories, siteStats] = await Promise.all([
    prisma.article.count(),
    prisma.article.aggregate({
      _sum: { views: true }
    }),
    prisma.category.count(),
    prisma.siteStat.aggregate({
      _sum: { visits: true }
    })
  ]);

  res.json({
    success: true,
    data: {
      totalArticles,
      totalViews: totalViews._sum.views || 0,
      totalCategories,
      totalSiteVisits: siteStats._sum.visits || 0
    },
    message: '获取成功'
  });
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [total, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          username: true,
          email: true,
          avatar_url: true,
          role: true,
          created_at: true,
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        items: users,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      },
      message: '获取成功'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '获取失败' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id);
  const { role } = req.body;

  if (isNaN(userId) || !['USER', 'ADMIN'].includes(role)) {
    return res.status(400).json({ success: false, message: '无效的参数' });
  }

  // Prevent admin from removing their own admin role easily, but optional
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role }
    });
    res.json({ success: true, message: '更新角色成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '更新角色失败' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.status(400).json({ success: false, message: '无效的用户ID' });
  }

  try {
    await prisma.user.delete({
      where: { id: userId }
    });
    res.json({ success: true, message: '删除用户成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: '删除用户失败' });
  }
};

