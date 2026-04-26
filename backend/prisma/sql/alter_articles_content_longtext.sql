-- 若 articles.content 仍为 TEXT/MEDIUMTEXT，富文本（含 base64 图片）可能超长。
-- 在 MySQL 中执行一次即可（也可使用 `npx prisma db push` 由 Prisma 同步）：
ALTER TABLE `articles` MODIFY COLUMN `content` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;
