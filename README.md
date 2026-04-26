<div align="center">

# Aurora Blog · 极光博客

**一套面向创作者与团队的全栈内容平台 —— 从灵感到发布，从阅读到运营，一条链路贯通。**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2d3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

</div>

---

## 项目愿景

在信息过载的时代，**内容需要被优雅地创作、结构化地组织、安全地交付**。本项目是一套可部署、可扩展的博客与轻 CMS 解决方案：访客端专注阅读与发现，管理端覆盖文章、分类、标签、用户与数据洞察，适合作为个人站点、技术博客或教学演示仓库。

---

## 核心亮点

| 维度 | 说明 |
|------|------|
| **体验** | React 18 + Vite 驱动的前端，Tailwind 体系下的现代 UI；富文本编辑、图表看板与骨架屏等细节打磨阅读与运营体验。 |
| **安全与工程** | JWT 鉴权、角色区分（用户 / 管理员）、Helmet、速率限制、请求体验证（Zod）；前后端分离，接口版本化（`/api/v1`）。 |
| **数据模型** | Prisma + MySQL：用户、文章、分类、标签多对多、嵌套评论、站点访问统计等，满足常见内容场景。 |
| **可观测与运维** | Morgan 日志、统一错误处理；支持静态资源上传（封面、头像等），便于对接对象存储或 CDN。 |

---

## 技术栈

**前端** · React 18 · TypeScript · Vite · React Router · TanStack Query · Zustand · Tailwind CSS · Axios · React Quill · ECharts · Sonner  

**后端** · Node.js · Express · TypeScript · Prisma · MySQL · JWT · bcrypt · Multer · express-rate-limit  

---

## 功能概览

- **访客端**：首页内容流、文章详情（浏览量、富文本安全渲染）、分类聚合、全局搜索入口  
- **互动**：登录注册、评论与回复链路  
- **管理后台**：仪表盘与数据可视化、文章发布与编辑、文章 / 标签 / 用户管理  
- **基础设施**：文件上传、站点访问统计、CORS 与开发环境代理配置  

---

## 界面预览

> 以下截图来自 `img/` 目录，按页面类型编排展示（实际文件名：`1.png` … `7.png`）。

<p align="center">
  <img src="img/1.png" alt="首页与内容发现" width="88%" />
  <br /><sub><b>首页与内容发现</b> — 品牌导航、精选文章与信息流</sub>
</p>

<p align="center">
  <img src="img/2.png" alt="文章阅读" width="44%" />
  &nbsp;
  <img src="img/3.png" alt="分类或列表" width="44%" />
  <br /><sub><b>文章精读</b> · <b>分类与聚合</b></sub>
</p>

<p align="center">
  <img src="img/4.png" alt="管理后台仪表盘" width="88%" />
  <br /><sub><b>运营控制台</b> — 数据看板与关键指标</sub>
</p>

<p align="center">
  <img src="img/5.png" alt="富文本发布" width="44%" />
  &nbsp;
  <img src="img/6.png" alt="标签或内容管理" width="44%" />
  <br /><sub><b>富文本创作</b> · <b>标签与内容治理</b></sub>
</p>

<p align="center">
  <img src="img/7.png" alt="用户或更多管理界面" width="88%" />
  <br /><sub><b>用户与权限</b> — 后台管理能力延伸</sub>
</p>

---

## 仓库结构

```
blog-system/
├── frontend/          # React + Vite 前端应用
├── backend/           # Express + Prisma API 服务
├── img/               # README 与文档用界面截图
├── blog_db.sql        # 可选：MySQL 初始化 SQL（若你使用导出文件）
└── LICENSE            # MIT
```

---

## 快速开始

### 环境要求

- Node.js 18+（推荐 LTS）  
- MySQL 8.x（或兼容的 5.7+）  
- npm 或 pnpm / yarn  

### 1. 数据库

创建数据库后，在 `backend/.env` 中配置连接串，例如：

```env
DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"
PORT=3000
JWT_SECRET="your-strong-secret"
```

使用 Prisma 同步 schema（无迁移目录时可用）：

```bash
cd backend
npx prisma generate
npx prisma db push
```

若你更倾向使用项目根目录的 `blog_db.sql`，可在 MySQL 中导入后再调整 `DATABASE_URL` 与 Prisma schema 一致性。

### 2. 初始化数据（可选）

```bash
cd backend
npm run seed              # 基础种子数据
npm run seed:showcase     # 展示用文章等（若需）
```

### 3. 启动后端

```bash
cd backend
npm install
npm run dev
```

默认监听 `http://localhost:3000`，API 前缀为 `/api/v1`。

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev
```

开发环境下，Vite 已将 `/api` 与 `/uploads` 代理到 `http://localhost:3000`。生产构建可设置 `VITE_API_URL` 指向你的 API 根路径。

### 5. 生产构建

```bash
cd frontend && npm run build
cd backend && npm run build && node dist/server.js   # 以实际编译输出为准
```

---

## 配置说明摘要

| 变量 / 项 | 说明 |
|-----------|------|
| `DATABASE_URL` | Prisma MySQL 连接串 |
| `PORT` | API 服务端口，默认 `3000` |
| `JWT_SECRET` | 签发与校验 JWT 的密钥 |
| `VITE_API_URL` | 前端生产环境 API 基地址（可选） |

上传文件默认由后端 `public/uploads` 目录提供静态访问；生产环境建议配置独立存储与 CDN。

---

## 开源协议

本项目基于 [MIT License](LICENSE) 开源 —— 可自由使用、修改与分发，保留版权声明即可。

---

## 致谢

感谢 React、Vite、Express、Prisma 及开源社区提供的优秀工具链。若本项目对你有帮助，欢迎 Star 与 Fork；也欢迎通过 Issue / PR 共建。

<div align="center">

**以代码记录思考，以产品连接读者。**

</div>
