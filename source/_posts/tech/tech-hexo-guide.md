---
title: "Hexo 博客搭建实践：从零到自定义主题与 AI 辅助开发"
date: 2026-05-26 20:00:00
tags: [Hexo, 博客, GitHub Pages, AI辅助]
categories: [技术]
keywords:
  - Hexo
  - 博客搭建
  - GitHub Pages
  - 自定义主题
  - Pug模板
  - AI辅助开发
---

## 前言

作为一个主要以C# 为主的开发者，搭建个人博客这件事以前也试过几次，试过多种方案后，用wordpress最久，后来服务器到期迁移过几次最后丢了，决定使用静态博客系统，最终选择了 Hexo + GitHub Pages 的组合。整个过程从选型、搭建、自定义主题到部署上线，整个过程挺顺利，也踩了一些坑，也借助 AI 工具提升了不少效率。这篇文章记录下完整的实践过程，希望对同样想搭建博客的朋友有所帮助。

## 一、为什么选择 Hexo

在选型阶段，我对比了几种主流方案：

| 方案 | 优点 | 缺点 |
|------|------|------|
| WordPress | 功能强大，插件丰富 | 需要一定的服务器，维护成本不高，但是有一定的迁移成本（wordpress本有完善的迁移方案，基本就是导出数据那些，不如静态方案文档即内容，主要是本省技术博客不需要什么博客功能，主要为了呈现 内容。） |
| Hexo | Node.js 生态，中文社区活跃，主题丰富 ，静态md，文档即内容，这是最主要的特点 |

最终选择 Hexo 的原因：
- **Node.js 生态熟悉**：前端工具链用起来顺手
- **中文文档完善**：遇到问题容易找到解决方案
- **主题可定制性强**：可以基于现有主题魔改，也可以从零开发

## 二、环境搭建

### 2.1 安装前提

```bash
# 确认 Node.js 版本（建议 18+）
node -v

# 确认 npm 可用
npm -v
```

### 2.2 初始化博客

```bash
# 安装 Hexo CLI
npm install -g hexo-cli

# 创建博客项目
hexo init dcm-blog
cd dcm-blog
npm install

# 本地预览
hexo server
```

打开 `http://localhost:4000` 看到默认的 Landscape 主题页面，说明初始化成功。

### 2.3 目录结构说明

```
dcm-blog/
├── _config.yml       # 站点配置（最重要）
├── package.json      # 依赖管理
├── scaffolds/        # 文章模板
├── source/           # 内容源文件
│   ├── _posts/       # 文章
│   └── about/        # 关于页面
├── themes/           # 主题目录
└── public/           # 生成的静态文件（不要手动编辑）
```

> **踩坑提醒**：`public` 目录是 `hexo generate` 自动生成的，不要手动修改里面的文件，下次生成会被覆盖。

## 三、站点配置

`_config.yml` 是 Hexo 的核心配置文件，以下是我在实践中逐步调整的关键配置：

### 3.1 基本信息

```yaml
title: 田工开物
subtitle: '技术、生活'
description: 'dcm;lowcode;C#;.net;ai;'
author: 戴箍的三佬
language: zh-CN
timezone: 'Asia/Shanghai'
```

> **注意**：`language` 设为 `zh-CN` 后，主题中的分页文字、日期格式等会自动中文化。

### 3.2 URL 和部署路径

```yaml
url: https://laosandegudai.github.io/dcm-blog
root: /dcm-blog/
```

> **踩坑记录**：如果你部署在 GitHub Pages 的子目录下（不是 `<username>.github.io` 仓库），`root` 必须设置为 `/仓库名/`，否则所有资源路径都会 404，即githubpages是以你的仓库 名称为根路径的，这个问题困扰了我一会。

### 3.3 永久链接

```yaml
permalink: :year/:month/:day/:slug/
```

默认的 `:title` 链接对于中文标题不友好，使用 插件转换中文为拼音作为url。
`pnpm i  hexo-generator-pinyin-url`

### 3.4 搜索功能

```yaml
search:
  path: search.xml
  field: post
  content: true
```

需要安装 `hexo-generator-search` 插件：

```bash
npm install hexo-generator-search --save
```

## 四、自定义主题开发

Landscape 主题虽然够用，但我想要一个更符合个人风格的界面。找了一圈现有主题，要么太重，要么不够灵活，最终决定自己开发——这时候 AI 的帮助就体现了。

### 4.1 主题的基本结构

```
themes/dcm-theme/
├── _config.yml       # 主题配置
├── layout/           # 模板文件
│   ├── base.pug      # 基础布局
│   ├── index.pug     # 首页
│   ├── post.pug      # 文章详情
│   ├── head.pug      # HTML head
│   ├── header.pug    # 顶部导航
│   ├── footer.pug    # 页脚
│   ├── sidebar.pug   # 侧边栏
│   └── _widget/      # 侧边栏组件
├── source/           # 静态资源
│   ├── css/          # 样式
│   ├── js/           # 脚本
│   └── img/          # 图片
└── languages/        # 国际化
```

### 4.2 模板引擎选择

Hexo 支持多种模板引擎，我选择了 **Pug**（原 Jade）：

```bash
npm install hexo-renderer-pug --save
```

Pug 的缩进式语法简洁明了，写起来效率高。对比一下：

**EJS 写法：**
```html
<h1 class="post-title"><%= page.title || "无标题" %></h1>
```

**Pug 写法：**
```pug
h1.post-title= page.title || "无标题"
```

### 4.3 CSS 方案选择

最初用的 Stylus（Hexo 默认支持），后来切换到了 **SCSS**：

```bash
npm install hexo-renderer-dartsass --save
```

选择 SCSS 的原因：生态更主流，变量、嵌套、混入等特性写起来舒服，网上资料也更多。

### 4.4 实践中的关键问题

#### 问题一：文章关键词（keywords）、description功能

Hexo 的 tags 和 categories 是内置功能，但 SEO 常用的 keywords 需要自己实现。我的做法：

**1. 在文章 front matter 中添加 keywords 字段：**

```yaml
---
title: "文章标题"
keywords:
  - 关键词1
  - 关键词2
---
```

**2. 在 head.pug 中输出 meta 标签：**

```pug
if page && page.keywords
  if Array.isArray(page.keywords)
    meta(name="keywords", content=page.keywords.join(','))
  else
    meta(name="keywords", content=page.keywords)
else
  meta(name="keywords", content=config.keywords)
```

**3. 在文章页面中显示关键词：**

```pug
if page.keywords
  span.post-keywords
    each kw, index in page.keywords
      span.keyword-item= kw
      if index < page.keywords.length - 1
        span.separator ,
```

> **思路**：keywords 优先使用文章自身的，没有则回退到站点全局配置。同时支持数组和字符串两种格式，兼容性更好。

#### 问题二：侧边栏联系方式显示

最初用图标（icon）来显示联系方式，但发现图标在某些环境下不显示，导致整个联系方式区域不可见。

**解决思路**：从纯图标 → 图标+文本 → 纯文本链接，逐步简化确保可用性。

最终方案直接以文本链接展示：

```pug
each contact in theme.author.contacts
  a.contact-link(href=contact.url, target="_blank")= contact.label
```

配置也相应简化：

```yaml
author:
  contacts:
    - { icon: "email", url: "mailto:xxx@example.com", label: "Email：xxx@example.com" }
```

> **经验**：功能优先于美观。如果某个展示方式在部分环境下可能失效，就要确保有兜底方案。

## 五、部署到 GitHub Pages

### 5.1 GitHub Actions 自动部署

创建 `.github/workflows/pages.yml`：

```yaml
name: Pages

on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js v22.12.0
        uses: actions/setup-node@v4
        with:
          node-version: "v22.12.0"
      - name: Cache NPM dependencies
        uses: actions/cache@v4
        with:
          path: node_modules
          key: ${{ runner.OS }}-npm-cache
      - name: Install Dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public
  deploy:
    needs: build
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to GitHub Pages
        uses: actions/deploy-pages@v4
```

### 5.2 部署注意事项

- **仓库设置**：在 GitHub 仓库的 Settings → Pages 中，Source 选择 GitHub Actions
- **权限配置**：确保 Actions 有 `pages: write` 和 `id-token: write` 权限
- **缓存优化**：缓存 `node_modules` 可以显著加快构建速度

### 5.3 Caddy 反向代理（可选）

如果你的博客部署在自己的服务器上，推荐使用 Caddy 作为 Web 服务器，自动 HTTPS 省心省力。具体配置可以参考我的另一篇文章《Caddy Web服务器入门与实践笔记》。

## 六、AI 辅助开发的经验

在整个博客搭建过程中，AI 工具（我使用 JoyCode）给了我很大帮助，但也有些经验值得分享。

### 6.1 AI 擅长的部分

**1. 生成模板代码**

告诉 AI 你想要什么布局，它可以直接生成 Pug 模板和对应的 SCSS 样式。比如我说"在文章底部添加关键词展示区域"，它生成了完整的 Pug 结构和配套样式。

**2. 问题排查**

遇到问题时，把报错信息和相关配置贴给 AI，它能快速定位原因。比如我遇到的 `root` 路径问题，AI 一下子就指出了配置错误。

**3. 批量修改**

给所有文章添加 keywords 字段这种重复性工作，AI 可以一次性完成，节省大量时间。

### 6.2 需要注意的地方

**1. AI 生成的代码需要验证**

AI 生成的代码不一定完全正确，一定要本地构建验证。比如这次实践中，AI 生成的联系方式图标样式在浏览器中不显示，最终简化为纯文本方案才解决。

**2. 逐步迭代比一步到位更可靠**

不要期望 AI 一次生成完美的代码。更好的方式是：先生成基础版本 → 构建验证 → 发现问题 → 让 AI 修复 → 再次验证。这个循环比一次生成长段代码更可控。

**3. 清晰描述需求**

"添加关键词功能"太笼统，"在文章 front matter 中支持 keywords 数组，在 head 中输出 meta 标签，在文章页显示关键词列表"就清晰得多。需求越具体，AI 输出的代码越接近预期。

**4. 理解生成的代码**

AI 帮你写代码，但你需要理解每一行在做什么。否则出问题时无法排查，也无法根据自己的需求调整。

### 6.3 AI 辅助的正确姿势

```
提出需求 → AI 生成代码 → 本地验证 → 发现问题 → 反馈给 AI → 修复 → 再次验证
     ↑                                                        |
     └──────────────────── 持续迭代 ────────────────────────────┘
```

## 七、常用命令速查

```bash
# 新建文章
hexo new "文章标题"

# 新建页面
hexo new page about

# 本地预览（支持热重载）
hexo server

# 生成静态文件
hexo generate

# 清除缓存和生成的文件
hexo clean

# 部署
hexo deploy

# 清除后重新生成（推荐）
hexo clean && hexo generate
```

## 八、总结

搭建 Hexo 博客本身不难，难的是把它改造成自己想要的样子。自定义主题开发是最耗时的部分，但也是最有成就感的。AI 工具在这个过程中确实提升了效率，但前提是你对自己的需求有清晰认知，对生成的代码有验证习惯。

如果让我给新手一个建议：**先用现成主题跑起来，再逐步自定义**。不要一上来就开发主题，先理解 Hexo 的运作机制，再动手改造。

---

> 本文基于 Hexo 8.1.1 版本，相关配置可能随版本更新有所变化，请以官方文档为准。