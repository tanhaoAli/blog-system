import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { username, password, email, avatar_url } = req.body;
  // TODO: validation

  // Check existing
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] }
  });

  if (existingUser) {
    return res.status(400).json({ success: false, message: '用户名或邮箱已存在' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      avatar_url: avatar_url || null,
    }
  });

  res.status(201).json({
    success: true,
    data: { id: newUser.id, username: newUser.username },
    message: '注册成功'
  });
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return res.status(401).json({ success: false, message: '用户名或密码错误' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ success: false, message: '用户名或密码错误' });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role }, 
    process.env.JWT_SECRET || 'secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({
    success: true,
    data: { 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        role: user.role, 
        avatar_url: user.avatar_url 
      }
    },
    message: '登录成功'
  });
};

// 获取博主信息 (首页展示)
export const getBloggerInfo = async (req: Request, res: Response) => {
  const adminUser = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: {
      username: true,
      avatar_url: true,
      bio: true,
      github_url: true
    }
  });

  if (!adminUser) {
    return res.status(404).json({
      success: false,
      message: '尚未设置博主信息'
    });
  }

  res.json({
    success: true,
    data: adminUser,
    message: '获取成功'
  });
};

export const resetPassword = async (req: Request, res: Response) => {
  const { username, email, newPassword } = req.body;

  if (!username || !email || !newPassword) {
    return res.status(400).json({ success: false, message: '请填写完整信息' });
  }

  const user = await prisma.user.findFirst({
    where: { username, email }
  });

  if (!user) {
    return res.status(404).json({ success: false, message: '用户名或邮箱不匹配' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword }
  });

  res.json({
    success: true,
    message: '密码重置成功，请重新登录'
  });
};