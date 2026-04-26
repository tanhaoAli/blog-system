import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getTodayDateString = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const recordVisitAndGetStats = async (req: Request, res: Response) => {
  try {
    const todayStr = getTodayDateString();

    // Increment today's visits
    await prisma.siteStat.upsert({
      where: { date: todayStr },
      update: { visits: { increment: 1 } },
      create: { date: todayStr, visits: 1 }
    });

    // Calculate total stats
    const [totalArticles, todayStat, totalVisitsAggr] = await Promise.all([
      prisma.article.count(),
      prisma.siteStat.findUnique({ where: { date: todayStr } }),
      prisma.siteStat.aggregate({ _sum: { visits: true } })
    ]);

    const todayVisits = todayStat?.visits || 0;
    const totalVisits = totalVisitsAggr._sum.visits || 0;

    res.json({
      success: true,
      data: {
        todayVisits,
        totalVisits,
        totalArticles
      },
      message: '记录并获取统计数据成功'
    });
  } catch (error) {
    throw error;
  }
};
