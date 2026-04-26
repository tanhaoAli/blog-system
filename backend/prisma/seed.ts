import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. 创建分类
  const categories = await Promise.all([
    prisma.category.upsert({ where: { name: '科技洞察' }, update: {}, create: { name: '科技洞察' } }),
    prisma.category.upsert({ where: { name: '实战教程' }, update: {}, create: { name: '实战教程' } }),
    prisma.category.upsert({ where: { name: '前端工程化' }, update: {}, create: { name: '前端工程化' } }),
    prisma.category.upsert({ where: { name: '聊聊科技' }, update: {}, create: { name: '聊聊科技' } })
  ]);

  // 2. 创建标签
  const tags = await Promise.all([
    prisma.tag.upsert({ where: { name: 'AI' }, update: {}, create: { name: 'AI' } }),
    prisma.tag.upsert({ where: { name: 'Node.js' }, update: {}, create: { name: 'Node.js' } }),
    prisma.tag.upsert({ where: { name: 'React' }, update: {}, create: { name: 'React' } })
  ]);

  // 3. 创建管理员用户(博主)
  const hashedPassword = await bcrypt.hash('123456', 10);
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@jspang.com',
      password: hashedPassword,
      role: 'ADMIN',
      avatar_url: 'https://avatars.githubusercontent.com/u/1613045?v=4',
      bio: '18年一线程序员，专注研究AI领域。一人公司，超级个体和面对技术的商业模式。'
    }
  });

  // 4. 创建模拟文章
  const article1 = await prisma.article.create({
    data: {
      title: '解构 AI 大爆发：2026年我们需要具备哪些新技能？',
      summary: '随着 GPT-5 和新一代开源模型的发布，传统的编程范式正在被重塑...',
      content: '## 引言\n\n随着大模型技术的不断演进，软件开发的范式正在经历一场前所未有的变革...',
      cover_image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80',
      views: 5432,
      author_id: admin.id,
      category_id: categories[0].id,
      tags: {
        create: [
          { tag_id: tags[0].id }
        ]
      }
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
