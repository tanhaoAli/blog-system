import app from './app';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const PORT = process.env.PORT || 3000;
export const prisma = new PrismaClient();

const startServer = async () => {
  try {
    // Check DB connection
    await prisma.$connect();
    console.log('📦 Connected to MySQL Database via Prisma');

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

startServer();