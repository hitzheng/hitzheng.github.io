[TOC]

# Hexo

hexo是用nodejs静态网站建站工具，使用`mardkown`来书写页面。

文档：https://hexo.io/zh-cn/



## 快速开始

安装`hexo`

```sh
npm install -g hexo-cli
```

创建站点

```sh
hexo init myblog
cd myblog
npm install
```

目录结构

```sh
<myblog>
├── _config.yml      # 站点配置文件
├── package.json     # npm包信息(默认支持ejs/stylus/markdown)
├── scaffolds        # 脚手架(创建markdown时默认填充的内容)
├── source           # 站点源码目录
|   ├── _drafts      # 草稿源码目录
|   └── _posts       # 文章源码目录
└── themes           # 主题目录
```

> source是站点源码和资源目录，除`_posts`外所有以下划线开头的文件和目录会被忽略，markdown和html会被处理后放到`public`目录，其余文件原样复制到`public`目录。

预览内容

```sh
hexo serve # 启动本地预览服务(http://127.0.0.1:4000/)
```

命令说明

| 命令                               | 说明                                                  |
| ---------------------------------- | ----------------------------------------------------- |
| `hexo init [dir]`                  | 新建站点，dir为空表示在当前目录建立                   |
| `hexo new [layout] <title>`        | 新建post，layout为空则使用`default_layout`            |
| `hexo generate`                    | 生成站点，`-w`监视文件变动                            |
| `hexo publish [layout] <filename>` | 将`draft`发布到`post`，layout为空使用`default_layout` |
| `hexo server [-p 4000]`            | 启用本地服务，默认使用4000端口                        |
| `hexo deploy [-g]`                 | 部署站点，`-g`表示部署前先生成站点                    |
| `hexo render <file1> [-o path]`    | 渲染文件，`-o`设置输出路径                            |
| `hexo clean`                       | 清队缓存，更改theme后需要调用                         |
| `hexo list <type>`                 | 列出站点资料，type: page, post, route, tag, category  |



## 基本操作

**新建文章**

```sh
hexo new [layout] title     # 可以指定layout建立文章，不指定使用default_layout
hexo new draft title        # 指定layout为draft时，新建草稿
hexo publish [layout] title # 将draft发布为post
```

**布局**(Layout)

hexo默认有三种布局`post`, `page`, `draft`， 其中`post`布局的文章会存到`source/_posts`目录，`draft`布局的文章 会存到`source/_drafts`目录，其余的文章和页面可按任意目录结构存于`source`下。如果在`front matter`中将layout设为false，hexo不会处理该文章。

**模板**(Scaffold)

新建文章时，hexo会根据`layout`在`scaffolds`目录中查找对应的模板文件，做为该文章默认的内容，模板中可以使用的变量：

| 变量   | 描述 |
| ------ | ---- |
| layout | 布局 |
| title  | 标题 |
| date   | 日期 |

**Front-Matter**

Front-matter 是文件最上方以 `---` 分隔的区域，用于定义变量(预定义或自定义)，例如

```yaml
title: Hello World
date: 2013/7/13 20:46:25
---
```

预定义变量：

| 参数 | 描述 | 默认值 |
| ---- | ---- | ---- |
| layout | 布局 | |
| title |  标题 | |
| date  |  建立日期 | 文件建立日期 |
| updated |更新日期 | 文件更新日期 |
| comments  |  开启文章的评论功能 | true |
| tags | 标签数组(仅支持文章) | |
| categories |分类数组(仅支持文章)| |
| permalink | 覆盖文章网址 | |

> 注意：hexo中分类和标签有区别，分类数组有顺序和层次(不支持同级分类)，如["Foo", "Bar"]，Bar是Foo的子分类，而标签数组没有顺序和层次。

**标签插件**

通常使用`markdown`的格式即可，hexo增加了部分标签插件以增强功能：

引用块

```sh
{% blockquote [author[, source]] [link] [source_link_title] %}
content
{% endblockquote %}
```

代码块

```sh
{% codeblock [title] [lang:language] [url] [link text] %}
code snippet
{% endcodeblock %}
```

IFrame

```sh
{% iframe url [width] [height] %}
```

Image

```sh
{% img [class names] /path/to/image [width] [height] [title text [alt text]] %}
```

Link

```sh
{% link text url [external] [title] %}
```

Include

```sh
{% include_code [title] [lang:language] path/to/file %} # 相对于source
```

引用文章

```sh
{% post_path slug %}
{% post_link slug [title] %}
```

引用资源

```sh
# 主要用于从文章对应的资源文件夹下加载(post_asset_folder: true)
{% asset_path slug %}
{% asset_img slug [title] %}
{% asset_link slug [title] %}
```

Swig标签

```sh
{% raw %}
content
{% endraw %}
```

**资源文件**

`source`目录中除文件外的所有文件都是资源，如image/js/css。使用markdown语法通过绝对路径引用。

**数据文件**

数据文件是位置`source/_data`目录的yaml或json文件，例如`menu.yaml`

```yaml
Home: /
Gallery: /gallery/
Archives: /archives/
```

可以在Swig模板中引用

```
<% for (var link in site.data.menu) { %>
  <a href="<%= site.data.menu[link] %>"> <%= link %> </a>
<% } %>
```

**部署站点**

通过`hexo generate`生成站点的静态文件，默认这些文件会放到`public`目录，将public目录拷贝到服务器根目录即可完成部署。

通常站点可以是托管的nginx或github pages，hexo提供一健部署的功能，将站点部署到远程服务器或github pages上。

常用的部署方式有`git`, `rsync`, `ftysync`, `sftp`.

以`git`部署为例:

```
npm install hexo-deployer-git --save # 安装git部署插件
```

修改配置：

```yaml
deploy:
  type: git
  repo: <repos>      # https://github.com/user/repos.git
  branch: [branch]   # 发布分支, 默认master
  message: [message] # 提交消息, 默认site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}
```



## 自定义

**主题(theme)**

创建主题很简单，只要在`themes`目录下创建对应的文件夹即可，目录结构：

```sh
themes/
├── _config.yml    # 主题配置文件
├── languages/     # 国际化目录
├── layout/        # 布局目录
├── scripts/       # hexo脚本
└── source/        # 资源目录
```

> 注意：source资源目录下以"_"开头的文件或目录会被忽略，其余文件如果可以被渲染则经处理后放到public目录，否则直接复制到public目录。
>
> 另外布局文件会根据后缀选择引擎，内置`swig`引擎，通过`hex init`创建的站点会默认加上`ejs`/`stylus`/`markd`引擎。

**变量**

全局变量：

| 变量 | 描述 |
| --- | --- |
| `site` | [网站变量](https://hexo.io/zh-cn/docs/variables#%E7%BD%91%E7%AB%99%E5%8F%98%E9%87%8F) |
| `page` | 针对该页面的内容以及 front-matter 所设定的变量 |
| `config` | 网站配置 |
| `theme` | 主题配置。继承自网站配置 |
| `_` (单下划线) | [Lodash](http://lodash.com/) 函数库 |
| `path` | 当前页面的路径（不含根路径）|
| `url` | 当前页面的完整网址 |
| `env` | 环境变量 |

站点变量

| 变量 | 描述 |
| --- | --- |
| `site.posts` | 所有文章 |
| `site.pages`  | 所有分页 |
| `site.categories` | 所有分类 |
| `site.tags` | 所有标签 |

页面变量

| 变量 | 描述 |
| --- | --- |
| `page.title` | 页面标题 |
| `page.date`| 页面建立日期（[Moment.js](http://momentjs.com/) 对象）|
| `page.updated` | 页面更新日期（[Moment.js](http://momentjs.com/) 对象） |
| `page.comments` | 留言是否开启 |
| `page.layout` | 布局名称 |
| `page.content` | 页面的完整内容 |
| `page.excerpt` | 页面摘要 |
| `page.more` | 除了页面摘要的其余内容 |
| `page.source` | 页面原始路径 |
| `page.full_source` | 页面的完整原始路径 |
| `page.path` | 页面网址（不含根路径）。我们通常在主题中使用 `url_for(page.path)` |
| `page.permalink` | 页面的完整网址 |
| `page.prev` | 上一个页面。如果此为第一个页面则为 `null`|
| `page.next` | 下一个页面。如果此为最后一个页面则为 `null`|
| `page.raw` | 文章的原始内容 |
| `page.photos` | 文章的照片（用于相簿）|
| `page.link` | 文章的外部链接（用于链接文章）|

文章变量

| 变量 | 描述 |
| --- | --- |
| `page.published` | 如果该文章已发布则为True |
| `page.categories` | 该文章的所有分类 |
| `page.tags` | 该文章的所有标签 |

首页变量

| 变量 | 描述 |
| --- | --- |
| `page.per_page` | 每页显示的文章数量 |
| `page.total` | 总文章数 |
| `page.current` | 目前页数 |
| `page.current_url` | 目前分页的网址 |
| `page.posts` | 本页文章 |
| `page.prev` | 上一页的页数。如果此页是第一页的话则为 `0` |
| `page.prev_link` | 上一页的网址。如果此页是第一页的话则为 `''` |
| `page.next` | 下一页的页数。如果此页是最后一页的话则为 `0` |
| `page.next_link` | 下一页的网址。如果此页是最后一页的话则为 `''` |
| `page.path` | 当前页面的路径（不含根目录）。我们通常在主题中使用 `url_for(page.path)`。 |

其它变量

| 变量 | 描述 |
| --- | --- |
| `page.archive`  | 等于 `true` |
| `page.year`     | 年份归档 (4位) |
| `page.month`    | 月份归档 (没有前导零的2位数) |
| `page.category` | 分类名称 |
| `page.tag`      | 标签名称 |



## Swig

前端模板引擎，简单易用，目前已停维。

教程：https://www.jianshu.com/p/f0bffc42c1ce

文档：http://node-swig.github.io/swig-templates/docs/



## Stylus

css预处理框架

教程：https://www.jianshu.com/p/5fb15984f22d

中文：https://www.zhangxinxu.com/jq/stylus/

文档：https://github.com/stylus/stylus