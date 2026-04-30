# dcm-theme Hexo 主题

一个简洁的 Hexo 主题，具有响应式设计和丰富的侧边栏功能。

## 功能特性

- 顶部导航栏：Logo、首页、分类、归档、关于
- 响应式布局：桌面端左右双栏，移动端上下单栏
- 侧边栏组件：
  - 搜索框（本地搜索）
  - 作者信息（头像、名称、联系方式）
  - 文章分类
  - 文章标签云
  - 最近文章
  - 友情链接
- 文章分页列表
- 文章详情页（支持目录、标签、上下篇导航）

## 安装使用

### 1. 启用主题

在 Hexo 主配置文件 `_config.yml` 中设置：

```yaml
theme: dcm-theme
```

### 2. 安装依赖

```bash
cd your-hexo-site
npm install hexo-generator-search --save
```

### 3. 配置主题

编辑 `themes/dcm-theme/_config.yml`：

```yaml
# 菜单配置
menu:
  home:
    title: "首页"
    url: "/"
  categories:
    - { title: "技术", slug: "技术" }
    - { title: "生活", slug: "生活" }
    - { title: "随笔", slug: "随笔" }
  archive:
    title: "归档"
    url: "/archives/"
  about:
    title: "关于"
    url: "/about/"

# 作者信息
author:
  name: "你的名字"
  avatar: "/img/avatar.png"
  description: "个人描述"
  contacts:
    - { icon: "github", url: "https://github.com/yourusername" }
    - { icon: "email", url: "mailto:your@email.com" }

# 友情链接
links:
  - { name: "Hexo", url: "https://hexo.io", avatar: "" }
```

### 4. 添加作者头像

将头像图片放到 `themes/dcm-theme/source/img/avatar.png`

### 5. 生成并预览

```bash
hexo clean
hexo generate
hexo server
```

访问 `http://localhost:4000` 预览效果。

## 文件结构

```
themes/dcm-theme/
├── _config.yml          # 主题配置
├── languages/          # 国际化
├── layout/             # 模板文件
│   ├── base.pug       # 基础布局
│   ├── index.pug      # 首页
│   ├── post.pug       # 文章页
│   ├── archive.pug    # 归档页
│   ├── page.pug       # 独立页面
│   ├── header.pug     # 顶部导航
│   ├── footer.pug     # 页脚
│   ├── sidebar.pug    # 侧边栏
│   ├── paginator.pug  # 分页
│   └── _widget/       # 侧边栏组件
│       ├── search.pug
│       ├── author.pug
│       ├── category.pug
│       ├── tag.pug
│       ├── recent_posts.pug
│       └── links.pug
└── source/            # 静态资源
    ├── css/
    │   ├── style.scss
    │   ├── _variables.scss
    │   └── _layout.scss
    └── js/
        └── search.js
```

## 自定义样式

编辑 `source/css/_variables.scss` 修改主题颜色等变量：

```scss
$primary-color: #4a90d9;  // 主题色
$secondary-color: #666;    // 辅助色
$background-color: #f5f5f5; // 背景色
```
