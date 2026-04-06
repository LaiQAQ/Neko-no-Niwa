# ねこの庭 (Neko no Niwa)

一个简洁优雅的个人主页网站，使用 Express.js + Vue 3 + Tailwind CSS + SQLite 构建。

## 预览
![neko-niwa.png](https://img14.360buyimg.com/ddimg/jfs/t1/415221/15/4196/15156/69d3747bF6713eb9f/00155a03570d8c27.jpg)

## 功能特性

- **首页展示** - 展示个人资料、社交链接和友情链接
- **友链系统** - 支持访客申请友链链接
- **管理后台** - 后台管理功能，支持增删改查操作
- **响应式设计** - 适配各种屏幕尺寸

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Vue 3 (Composition API) |
| 构建工具 | Vite |
| CSS 框架 | Tailwind CSS |
| 后端框架 | Express.js |
| 数据库 | SQLite (sql.js) |
| 会话管理 | express-session |

## 项目结构

```
neko-site/
├── server/                      # 后端代码
│   ├── index.js                 # Express 服务器入口
│   ├── database.js              # SQLite 数据库初始化与操作
│   └── routes/
│       ├── api.js               # 数据 API 路由
│       └── auth.js              # 认证 API 路由
├── src/                         # 前端源代码
│   ├── main.js                  # Vue 应用入口
│   ├── App.vue                  # 根组件
│   ├── router/
│   │   └── index.js             # Vue Router 配置
│   ├── views/
│   │   ├── Home.vue             # 首页
│   │   ├── Login.vue            # 登录页
│   │   ├── Admin.vue            # 管理后台
│   │   └── FriendApply.vue       # 友链申请页
│   └── assets/
│       └── styles/
│           └── main.css         # 全局样式
├── index.html                   # HTML 入口
├── package.json                 # 项目配置
├── vite.config.js               # Vite 配置
├── tailwind.config.js           # Tailwind CSS 配置
└── postcss.config.js            # PostCSS 配置
```

## 快速开始

### 环境要求

- Node.js >= 16.x
- npm

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

这将同时启动前端开发服务器 (端口 5173) 和后端 API 服务器 (端口 3000)。

### 构建生产版本

```bash
npm run build
```

前端静态文件将输出到 `dist` 目录。

### 启动生产服务器

```bash
npm run server:start
```

## API 接口

### 认证接口

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/api/auth/login` | 用户登录 |
| POST | `/api/auth/logout` | 用户登出 |
| GET | `/api/auth/status` | 获取登录状态 |

### 数据接口

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/api/data` | 获取网站数据 |
| GET | `/api/links` | 获取链接列表 |
| POST | `/api/links` | 添加链接 (需登录) |
| PUT | `/api/links/:id` | 更新链接 (需登录) |
| DELETE | `/api/links/:id` | 删除链接 (需登录) |

## 默认账号

- **用户名**: `admin`
- **密码**: `admin123`

> ⚠️ 请在部署后及时修改默认密码！

## 路由说明

| 路径 | 页面 |
|------|------|
| `/` | 首页 |
| `/admin` | 管理后台 (需登录) |
| `/friend-apply` | 友链申请 |
| `/login` | 登录页 |

## 数据库

使用 `sql.js` 在浏览器端运行 SQLite，数据存储在 `localStorage` 中。

### 数据库表结构

```sql
-- 管理员表
CREATE TABLE admin (
  id INTEGER PRIMARY KEY,
  username TEXT,
  password TEXT
);

-- 网站数据表
CREATE TABLE website_data (
  id INTEGER PRIMARY KEY,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  avatar TEXT,
  email TEXT,
  github TEXT,
  twitter TEXT,
  bilibili TEXT
);

-- 链接表
CREATE TABLE links (
  id INTEGER PRIMARY KEY,
  name TEXT,
  url TEXT,
  avatar TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending'
);
```

## 部署

### 开发环境

```bash
npm run dev
```

### 生产环境

1. 构建前端：
```bash
npm run build
```

2. 启动服务器：
```bash
npm run server:start
```

3. 访问 `http://localhost:3000`

## License

MIT
