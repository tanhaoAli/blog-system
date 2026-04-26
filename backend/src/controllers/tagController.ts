import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTags = async (req: Request, res: Response) => {
  const tags = await prisma.tag.findMany({
    orderBy: { created_at: 'desc' }
  });
  
  res.json({ success: true, data: tags, message: '获取成功' });
};

export const createTag = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: '标签名不能为空' });

  const existing = await prisma.tag.findUnique({ where: { name } });
  if (existing) return res.status(400).json({ success: false, message: '标签已存在' });

  const newTag = await prisma.tag.create({ data: { name } });
  
  res.json({ success: true, data: newTag, message: '创建成功' });
};

export const deleteTag = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ success: false, message: '无效ID' });

  await prisma.tag.delete({ where: { id } });
  
  res.json({ success: true, data: null, message: '删除成功' });
};
