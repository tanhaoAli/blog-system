/*
 Navicat Premium Data Transfer

 Source Server         : 124.221.47.173
 Source Server Type    : MySQL
 Source Server Version : 50742 (5.7.42)
 Source Host           : 124.221.47.173:3306
 Source Schema         : blog_db

 Target Server Type    : MySQL
 Target Server Version : 50742 (5.7.42)
 File Encoding         : 65001

 Date: 26/04/2026 15:51:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for article_tags
-- ----------------------------
DROP TABLE IF EXISTS `article_tags`;
CREATE TABLE `article_tags` (
  `article_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`article_id`,`tag_id`),
  KEY `article_tags_tag_id_fkey` (`tag_id`),
  CONSTRAINT `article_tags_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `article_tags_tag_id_fkey` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of article_tags
-- ----------------------------
BEGIN;
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (1, 2);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (5, 2);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (10, 2);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (5, 4);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (5, 5);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (6, 6);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (6, 7);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (6, 8);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (8, 12);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (8, 13);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (8, 14);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (9, 15);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (9, 16);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (9, 17);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (10, 18);
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (10, 19);
COMMIT;

-- ----------------------------
-- Table structure for articles
-- ----------------------------
DROP TABLE IF EXISTS `articles`;
CREATE TABLE `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `views` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  `author_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `articles_author_id_fkey` (`author_id`),
  KEY `articles_category_id_fkey` (`category_id`),
  CONSTRAINT `articles_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `articles_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of articles
-- ----------------------------
BEGIN;
INSERT INTO `articles` (`id`, `title`, `content`, `summary`, `cover_image`, `views`, `created_at`, `updated_at`, `author_id`, `category_id`) VALUES (1, '解构 AI 大爆发：2026年我们需要具备哪些新技能？', '## 引言\n\n随着大模型技术的不断演进，软件开发的范式正在经历一场前所未有的变革...', '随着 GPT-5 和新一代开源模型的发布，传统的编程范式正在被重塑...', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=600&q=80', 5449, '2026-04-24 07:30:29.551', '2026-04-26 07:38:19.041', 1, 4);
INSERT INTO `articles` (`id`, `title`, `content`, `summary`, `cover_image`, `views`, `created_at`, `updated_at`, `author_id`, `category_id`) VALUES (5, '算力即正义？与新一代 AI 基础设施的冷静对话', '<p><strong>前言</strong>：这不是一篇贩卖焦虑的推文，而是一份写给架构师、技术负责人与创业者的「边界清单」。</p>\n<img src=\"https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80\" alt=\"AI\" width=\"100%\" />\n<h2>一、算力叙事背后的三个盲区</h2>\n<p>我们习惯把「更大模型」等同于「更强智能」，却常常忽略：<strong>推理成本曲线</strong>、<strong>数据主权</strong>与<strong>可验证性</strong>才是企业落地的硬约束。</p>\n<ul>\n<li><strong>成本盲区</strong>：Token 计价只是表象，真正的账单藏在冷启动、长上下文与多轮重试里。</li>\n<li><strong>合规盲区</strong>：跨境推理与日志留存，可能在一夜之间改写你的部署拓扑。</li>\n<li><strong>价值盲区</strong>：没有评测闭环的「炫技 Demo」，无法通过 CFO 的第二个问题。</li>\n</ul>\n<h2>二、从「堆卡」到「堆系统」</h2>\n<p>下一代竞争力，属于能把 <em>训练、推理、观测、回滚</em> 做成一条链路的团队。算力是燃料，而<strong>工程化与治理</strong>才是引擎。</p>\n<blockquote><p>「正义」不属于显卡，而属于那些把复杂留给自己、把确定交给用户的人。</p></blockquote>\n<h2>三、结语</h2>\n<p>如果你正在评估自建还是托管，记住一句话：<strong>先画清楚数据流与责任边界，再谈模型选型。</strong>顺序错了，再强的算力也只是昂贵的噪音。</p>', '当模型参数与上下文窗口指数级膨胀，真正的瓶颈早已不在「会不会写 Prompt」，而在能源、互联与工程化交付的交汇处。', 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1600&q=80', 12840, '2026-04-26 07:44:29.706', '2026-04-26 07:44:29.706', 1, 6);
INSERT INTO `articles` (`id`, `title`, `content`, `summary`, `cover_image`, `views`, `created_at`, `updated_at`, `author_id`, `category_id`) VALUES (6, '从单体到智能体编排：一位架构师的十年破局手记', '<p>十年里我经历过三次「范式迁移」：移动化、云原生、以及今天的 <strong>Agentic Workflow</strong>。每一次喧嚣过后，沉淀下来的永远是同一套问题：<strong>状态在哪里？失败如何被看见？人类何时介入？</strong></p>\n<h2>一、编排的本质是「有向无环的责任图」</h2>\n<p>别把 Agent 当成黑盒魔法。把它看作一组<strong>可组合、可超时、可补偿</strong>的步骤——你的系统会立刻变得诚实。</p>\n<img src=\"https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80\" alt=\"network\" width=\"100%\" />\n<h2>二、三条铁律（至今未过时）</h2>\n<ol>\n<li><strong>幂等与重试</strong>：任何可能重复触发的副作用，都必须有幂等键。</li>\n<li><strong>可观测优先</strong>：没有 trace 的链路，不配谈 SLA。</li>\n<li><strong>人机共驾</strong>：高风险决策必须落在「显式确认」的 UI 与审计日志里。</li>\n</ol>\n<h2>三、写给正在拆单体的你</h2>\n<p>智能体不是拆服务的理由，<strong>清晰的业务边界</strong>才是。先让团队用同一套语言描述「成功与失败」，再让机器替你加速迭代。</p>', '系统从未因「技术不够新」而崩溃，却常因「边界不清、观测不足、回滚不可信」而失控。智能体时代，旧课依然成立。', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80', 9621, '2026-04-26 07:44:30.949', '2026-04-26 07:44:30.949', 1, 7);
INSERT INTO `articles` (`id`, `title`, `content`, `summary`, `cover_image`, `views`, `created_at`, `updated_at`, `author_id`, `category_id`) VALUES (8, '代码可以替换，品味无法自动化', '<p>工具能替你补全语法，却不能替你承担<strong>命名背后的责任</strong>。品味不是审美偏好，而是<strong>对复杂度的道德判断</strong>。</p>\n<h2>一、好品味的三个信号</h2>\n<ol>\n<li><strong>删除的勇气</strong>：能合并的模块绝不复制粘贴。</li>\n<li><strong>命名的诚实</strong>：<code>getUserById</code> 比 <code>handleData</code> 更接近真相。</li>\n<li><strong>抽象的克制</strong>：只为真实出现的重复抽象，不为「未来可能」预支复杂度。</li>\n</ol>\n<img src=\"https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80\" alt=\"code\" width=\"100%\" />\n<h2>二、与 AI 结对编程的边界</h2>\n<p>把 AI 当作实习生：它擅长草稿与检索，你负责<strong>评审、取舍与背锅</strong>。当你不再阅读它生成的每一行，你就从作者退化成观众。</p>\n<h2>三、结语</h2>\n<p>十年后，人们会忘记你用过什么框架，但会记得你留下的系统是否<strong>可被信任、可被交接、可被演进</strong>。</p>', '在生成式工具普及的今天，「写得多快」正在贬值；「删得多准」「命名多诚实」「抽象多克制」正在升值。', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80', 8873, '2026-04-26 07:44:33.041', '2026-04-26 07:44:33.041', 1, 9);
INSERT INTO `articles` (`id`, `title`, `content`, `summary`, `cover_image`, `views`, `created_at`, `updated_at`, `author_id`, `category_id`) VALUES (9, '当延迟逼近毫秒：实时系统设计的五条铁律', '<p>延迟是用户体验的「硬通货」。当 P99 从百毫秒压到个位数，你面对的不是调参技巧，而是<strong>数据局部性、排队论与失败语义</strong>的总账。</p>\n<h2>铁律 1：先量再砍</h2>\n<p>没有火焰图与 trace 的优化，都是玄学。把瓶颈画在白板上，再谈缓存与异步。</p>\n<h2>铁律 2：热路径拒绝「顺便」</h2>\n<p>热路径上的 JSON 反射、动态分配与跨 AZ 调用，都是账。该内联的内联，该就近的就近。</p>\n<img src=\"https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=80\" alt=\"server\" width=\"100%\" />\n<h2>铁律 3～5（浓缩版）</h2>\n<ul>\n<li><strong>背压优于丢弃</strong>：告诉上游「我满了」，比默默丢包更专业。</li>\n<li><strong>超时是契约</strong>：默认值等于没有值。</li>\n<li><strong>降级要可演练</strong>：没跑过故障演练的降级开关，等于不存在。</li>\n</ul>\n<blockquote><p>毫秒级不是炫技，是对用户注意力的尊重。</p></blockquote>', '从金融风控到协同编辑，「快」不是优化出来的，而是架构阶段就写进约束里的。这里有五条反复验证过的工程铁律。', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80', 7230, '2026-04-26 07:44:34.125', '2026-04-26 07:44:34.125', 1, 10);
INSERT INTO `articles` (`id`, `title`, `content`, `summary`, `cover_image`, `views`, `created_at`, `updated_at`, `author_id`, `category_id`) VALUES (10, '2026 开发者生存图鉴：从写代码到设计「认知接口」', '<p>如果用一个词概括未来五年的核心能力，我会选：<strong>认知接口设计</strong>——把模糊意图翻译成可执行、可验证、可回滚的结构化任务。</p>\n<h2>一、三种「接口」正在合并</h2>\n<ul>\n<li><strong>人机接口</strong>：提示词、工作流与可视化编排。</li>\n<li><strong>机机接口</strong>：MCP、工具协议与策略沙箱。</li>\n<li><strong>组织接口</strong>：评审门禁、合规审计与知识沉淀。</li>\n</ul>\n<img src=\"https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80\" alt=\"team\" width=\"100%\" />\n<h2>二、从「我会用」到「我敢负责」</h2>\n<p>工具链会指数级翻新，但<strong>责任模型</strong>不会。能定义成功标准、能复盘失败样本、能把经验写成可复用规则的人，会获得超额回报。</p>\n<h2>三、给你的行动清单</h2>\n<p>本周只做一件事：挑一个真实业务场景，写出它的 <strong>输入 / 输出 / 约束 / 失败模式</strong> 四象限。你会发现，所谓「AGI 焦虑」里，有一半只是文档没写清。</p>', 'IDE 里的光标不会消失，但它的含义正在改写：你输出的不仅是语法树，而是人与机器、机器与机器之间可协作的语义层。', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80', 20157, '2026-04-26 07:44:35.148', '2026-04-26 07:47:23.457', 1, 11);
COMMIT;

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of categories
-- ----------------------------
BEGIN;
INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES (1, '实战教程', '2026-04-24 07:30:28.169');
INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES (2, '前端工程化', '2026-04-24 07:30:28.169');
INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES (3, '聊聊科技', '2026-04-24 07:30:28.170');
INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES (4, '科技洞察', '2026-04-24 07:30:28.169');
INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES (5, 'aaa', '2026-04-24 08:06:45.602');
INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES (6, '深度观点', '2026-04-26 07:44:28.624');
INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES (7, '架构与未来', '2026-04-26 07:44:30.062');
INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES (8, '产品思维', '2026-04-26 07:44:31.198');
INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES (9, '技术人文', '2026-04-26 07:44:32.224');
INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES (10, '工程实践', '2026-04-26 07:44:33.237');
INSERT INTO `categories` (`id`, `name`, `created_at`) VALUES (11, '趋势研判', '2026-04-26 07:44:34.343');
COMMIT;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `content` varchar(1000) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `article_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `comments_article_id_fkey` (`article_id`),
  KEY `comments_user_id_fkey` (`user_id`),
  KEY `comments_parent_id_fkey` (`parent_id`),
  CONSTRAINT `comments_article_id_fkey` FOREIGN KEY (`article_id`) REFERENCES `articles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comments_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comments_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of comments
-- ----------------------------
BEGIN;
COMMIT;

-- ----------------------------
-- Table structure for site_stats
-- ----------------------------
DROP TABLE IF EXISTS `site_stats`;
CREATE TABLE `site_stats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `visits` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `site_stats_date_key` (`date`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of site_stats
-- ----------------------------
BEGIN;
INSERT INTO `site_stats` (`id`, `date`, `visits`, `created_at`) VALUES (1, '2026-04-24', 18, '2026-04-24 07:57:36.409');
INSERT INTO `site_stats` (`id`, `date`, `visits`, `created_at`) VALUES (2, '2026-04-26', 17, '2026-04-26 07:06:28.380');
COMMIT;

-- ----------------------------
-- Table structure for tags
-- ----------------------------
DROP TABLE IF EXISTS `tags`;
CREATE TABLE `tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `tags_name_key` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of tags
-- ----------------------------
BEGIN;
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (1, 'React', '2026-04-24 07:30:28.867');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (2, 'AI', '2026-04-24 07:30:28.866');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (3, 'Node.js', '2026-04-24 07:30:28.866');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (4, '基础设施', '2026-04-26 07:44:29.247');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (5, '思辨', '2026-04-26 07:44:29.506');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (6, '架构', '2026-04-26 07:44:30.284');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (7, '工程实践', '2026-04-26 07:44:30.519');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (8, 'Agent', '2026-04-26 07:44:30.747');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (9, '产品', '2026-04-26 07:44:31.415');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (10, '体验设计', '2026-04-26 07:44:31.608');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (11, '增长', '2026-04-26 07:44:31.817');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (12, '工程文化', '2026-04-26 07:44:32.424');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (13, '品味', '2026-04-26 07:44:32.623');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (14, 'AI 辅助编程', '2026-04-26 07:44:32.844');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (15, '性能', '2026-04-26 07:44:33.445');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (16, '实时系统', '2026-04-26 07:44:33.662');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (17, '后端', '2026-04-26 07:44:33.869');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (18, '职业成长', '2026-04-26 07:44:34.566');
INSERT INTO `tags` (`id`, `name`, `created_at`) VALUES (19, '未来工作', '2026-04-26 07:44:34.946');
COMMIT;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `avatar_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('USER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USER',
  `bio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `github_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_username_key` (`username`),
  UNIQUE KEY `users_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
BEGIN;
INSERT INTO `users` (`id`, `username`, `password`, `email`, `avatar_url`, `role`, `bio`, `github_url`, `created_at`, `updated_at`) VALUES (1, 'tanhao', '$2b$10$kSb8hzDHbZ5Fc2dGUhj6helgyzsvKhDEjj6pgfD5iOdnxGf63mY4S', 'tan340961@gmail.com', 'https://avatars.githubusercontent.com/u/1613045?v=4', 'ADMIN', '18年一线程序员，专注研究AI领域。一人公司，超级个体和面对技术的商业模式。', NULL, '2026-04-24 07:30:29.254', '2026-04-24 07:30:29.254');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
