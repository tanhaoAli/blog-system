import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllCategories = async (req: Request, res: Response) => {
  const categories = await prisma.category.findMany({
    orderBy: { created_at: 'desc' }
  });
  
  res.json({ success: true, data: categories, message: '获取成功' });
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: '分类名不能为空' });

  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) return res.status(400).json({ success: false, message: '分类已存在' });

  const newCat = await prisma.category.create({ data: { name } });
  
  res.json({ success: true, data: newCat, message: '创建成功' });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, message: '无效ID' });

  await prisma.category.delete({ where: { id } });
  
  res.json({ success: true, data: null, message: '删除成功' });
};
