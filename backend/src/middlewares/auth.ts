import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: string;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未提供访问令牌，请先登录',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded as { id: number; role: string };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: '令牌无效或已过期',
    });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: '权限不足，需要管理员权限',
    });
  }
  next();
};