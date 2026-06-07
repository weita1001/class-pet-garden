# 班级宠物园 🐾

教师专属课堂宠物养成游戏 — 投影到教室大屏，全班一起养宠物！

## 快速开始

### 1. 创建 Supabase 项目

1. 去 [supabase.com](https://supabase.com) 注册免费账号
2. 创建新项目，记住数据库密码
3. 进入 Settings → API，复制 **URL** 和 **anon public key**
4. 进入 SQL Editor，粘贴执行 `supabase/migrations/001_schema.sql` 全部内容

### 2. 配置环境变量

把 `.env.example` 改名为 `.env`，填入你的 Supabase 信息：

```
VITE_SUPABASE_URL=https://你的项目ID.supabase.co
VITE_SUPABASE_ANON_KEY=你的anon key
```

### 3. 创建教师账号

在 Supabase Dashboard → Authentication → Users → Add User，创建你的登录邮箱和密码。

### 4. 启动

```bash
npm install
npm run dev
```

浏览器打开 http://127.0.0.1:5173，用刚才创建的账号登录。

### 5. 部署到公网（可选）

```bash
npm install -g vercel
vercel --prod
```

部署后获得永久 URL（如 `class-pet-garden.vercel.app`），任何教室电脑打开浏览器就能用。

## 功能

- 🏫 多班级管理，每班约20人
- 🥚 盲盒领养宠物（3种稀有度蛋）
- 🐾 5阶段进化（蛋→幼崽→少年→成年→炫酷）
- 😺 4种性格 + 动态情绪
- 💰 课堂积分系统（快捷加分+自定义）
- 🎰 三档积分抽奖（3分/10分/30分）
- 🎒 道具背包（食物/装饰/特殊）
- 🏃 宠物赛跑小游戏
- 🎲 幸运时刻随机事件
- 📱 PWA 可离线使用
