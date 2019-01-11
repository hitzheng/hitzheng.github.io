
[TOC]

# Jekyll

官方文档：https://jekyllrb.com/docs/



## 安装

确保已安装xcode命令行工具

```sh
xcode-select --install
```

Jekyll依赖ruby，macOS mojave系统自带的ruby版本不兼容jekyll，需要使用brew安装最新的ruby。

```sh
# 安装最新版的ruby
brew install ruby
```

添加相关路径到~/.bash_profile中

```sh
export PATH=/usr/local/opt/ruby/bin:/usr/local/opt/ruby/libexec/gembin:/usr/local/lib/ruby/gems/2.5.0/bin:$PATH
```

检查安装版本是否正确

```sh
which ruby
which bundle
gem env
```

通过gem安装jekyll

```sh
# 覆盖安装bundler
gem install bundler
gem install jekyll
```

查看jekyll是否正确安装

```sh
jekyll -v
```



## 快速开始

```
# 创建一个新的jekyll项目，会自带minima主题
jekyll new myblog

# 启动服务本地预览http://127.0.0.1:4000/
cd myblog
jekyll serve
```

相关命令

```sh
# 查看jekyll版本
jekylll --version

# 查看本地安装的jekyll
gem list jekyll

# 搜索jekyll
gem search jekyll

# 更新jekyll
gem update jekyll

# 将网站编译到_site中
jekyll build

# 启动本地预览并监听文件变化
jekyll serve

# 本地查看离线jekyll文档
gem install jekyll-docs
jekyll docs
```



## 目录结构

```sh
<project>
├── _config.yml # 网站配置文件
├── Gemfile     # gem依赖配置(用于设置theme,plugin等)
├── Gemfile.lock# gem依赖锁
├── _drafts     # 未发布的草稿
|   ├── begin-with-the-crazy-ideas.textile
|   └── on-simplicity-in-technology.md
├── _includes   # 包含文件目录
|   ├── footer.html
|   └── header.html
├── _layouts    # 布局文件目录
|   ├── default.html
|   └── post.html
├── _posts      # 原始文章目录
|   ├── 2007-10-29-why-every-programmer-should-play-nethack.md
|   └── 2009-04-26-barcamp-boston-4-roundup.md
├── _data       # 网站数据目录
├── _sass       # 样式文件目录
├── _site       # 编译输出目录
├── .jekyll-metadata
└── index.html  # 如果包含yaml头会自动转换
```

说明：

- `_drafts`草稿目录，文件不带日期，通过`jekyll serve --drafts`预览草稿。
- `_includes`包含目录，通过`{% include file.ext %}`引用该目录下的文件。
- `_layouts`布局目录，其中`{{content}}`用于注入页面内容。
- `_posts`文章目录，包含发布的文章，文件名格式`YEAR-MONTH-DAY-title.EXT`。
- `_data`数据目录，支持yaml/json/csv等，通过`site.data.xxx`引用。
- `_sass`样式目录，子样式文件(.scss)最终会编译到main.css中。
- `_site`输出目录，工程编译输出的静态文件目录，作为网站根目录。
- `index.html/index.md`等其它包含yaml头的文件，会被 jekyll处理并放到`_site`相应位置。
- 其它目录和文件会原样复制到`_site`的相应位置中。

> 注意：基于gem-based-theme安装的主题，其`_includes`, `_layouts`, `_sass`目录位于theme的gems目录下，工程根目录下相应目录下的同名文件会覆盖theme目录下文件，通过`bundle show <theme>`查看theme的安装位置，在macOS下通常位于`/usr/local/lib/ruby/gems/x.x.x/gems/`下。



## Liquid模板

文档说明：https://shopify.github.io/liquid/

jekyll使用liquid模板引擎，支持在html/markdown文件中使用，主要包含`objects`、`tags`和`filters`三部分。

### objects

代表要输出的内容，格式`{{ object }}`，下例会在页面中输出`page.title`：

```html
<title>{{ page.title }}</html>
```

### tags

在模板中引入逻辑的控制流程，格式`{% tag %}`，下例根据变量条件输出内容：

```html
{% if page.show_sidebar %}
  <div class="sidebar">
    sidebar content
  </div>
{% endif %}
```

除了标准的liquid tags外，jekyll还定义了几个tag:

| tag                                          | 说明                                 |
| :------------------------------------------- | :----------------------------------- |
| {% include file.ext %}                       | 从`_includes`中包含文件`file.ext`    |
| {% hightlight php %} ... {% endhightlight %} | 代码高亮                             |
| {% link _posts/2016-07-26-name-of-post.md %} | 连接到指定地址(用于编译时的地址修正) |
| {% post_url 2010-07-21-name-of-post %}       | 连接到指定文章                       |

### filters

用于修改`objects`的内容，格式`{{ object | filter }}`，下例将title变成大写：

```html
<title>{{ page.title | capitalize }}</title>
```

### front matter

liquid模板文件需要指定yaml front matter，用于设定一系列变量，这些变量通过`page.xxx`引用。

```html
---
title: Home
my_number: 5
---
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ page.title }}</title>
  </head>
  <body>
    <h1>{{ "Hello World!" | downcase }}</h1>
    <h2>my_number: {{ page.my_number }}</h2>
  </body>
</html>
```

## Layouts

layout用于设置页面布局，通常布局文件包含`default`、`home`、`post`等，布局文件可以是树状结构，子layout引用父layout，子layout的整个输出做了父layout的`content`，layout文件位于`_layouts`目录下。

定义`default.html`布局文件：

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ page.title }}</title>
  </head>
  <body>
    {{ content }}
  </body>
</html>
```

定义`home.html`布局文件引用`default`布局：

```html
---
layout: default
---
<h1>welcome to my web site!</h1>
<div>
    {{content}}
</div>
```

编写`index.html`页面使用`home`布局:

```html
---
layout: home
title: Home Page
---
<h1>{{ "Hello World!" | downcase }}</h1>
```



## Includes

引入`_includes`目录下的文件，通过用于包含`navigation`、`header`、`footer`等，使用`{% include file.ext %}`包含文件。

定义`_includes/navigation.html`文件：

```html
<nav>
  <a href="/">Home</a>
  <a href="/about.html">About</a>
</nav>
```

修改`_layouts/default.html`布局：

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ page.title }}</title>
  </head>
  <body>
    {% include navigation.html %}
    {{ content }}
  </body>
</html>
```

通过`page.url`高亮当前页面(通常使用`site.posts`等循环实现)：

```html
<nav>
  <a href="/" {% if page.url == "/" %}style="color: red;"{% endif %}>Home</a>
  <a href="/about.html" {% if page.url == "/about.html" %}style="color: red;"{% endif %}>About</a>
</nav>
```



## Pages

pages主要用于独立的内容(不是按日期组织的posts等)，如`index.html`/`about.html`/`contact.html`，page可以使用markdown或html添加，如果独立的页面较多，可以将页面分类放到`子目录`下，当工程编译时，页面会输出到`_site`的相同路径下(可以使用permalinks修改输出路径)。

常用页面：

```sh
<project>
|-- about.md      # => http://example.com/about.html
|-- index.html    # => http://example.com/index.html
└── contact.html  # => http://example.com/contact.html
```



## Posts

post就是博客文章，位于`_posts`目录下，文件名格式`YEAR-MONTH-DAY-title.md`，通常使用markdown或html书写，

例如：`_posts/2012-09-12-how-to-write-a-blog.md`

```markdown
---
layout: post
title:  "Welcome to Jekyll!"
---

# Welcome

**Hello world**, this is my first Jekyll blog post.
I hope you like it!

you can [get the PDF](/assets/mydoc.pdf) directly.

![My helpful screenshot](/assets/screenshot.jpg)
```

### posts list

一般在网站首页会增加文章列表入口，可以使用`site.posts`变量：

```html
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
```

### categories and tags

指定post的categories和tags

```yaml
---
layout: post
title: A Trip
categories: [blog, travel]
tags: [hot, summer]
---
```

编译后`site.categories`包含分类下的post：

```html
{% for category in site.categories %}
  <h3>{{ category[0] }}</h3>
  <ul>
    {% for post in category[1] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}
```

文章摘要，默认是第一段内容，可以通过`excerpt_separator`指定：

```html
---
excerpt_separator: <!--more-->
---

Excerpt with multiple paragraphs

Here's another paragraph in the excerpt.
<!--more-->
Out-of-excerpt
```

在文章列表中显示摘要：

```html
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>
```

草稿`draft`，位于`_drafts`目录，通过`jekyll serve --drafts`预览草稿：

```sh
|-- _drafts/
|   |-- a-draft-post.md  # 草稿文件不带日期信息
```



## Theme

主题定义网站的外观样式，通过`jekyll new`创建的网站默认样式为`minima`，新版本的jekyll使用`gem-based-theme`，主题文件安装在gem目录下。

相关命令：

- `bundle install <theme>`安装主题
- `bundle update <theme>`更新主题
- `bundle show <theme>`显示主题目录

### 修改主题

如果想更改主题的部分内容，可以在工程目录下的相应目录创建主题中的同名文件，jekyll搜索文件时先查的工程目录，再查看主题目录。

例如，修改主题的page布局:

```sh
# 1. 查找主题目录
bundle show minima

# 2. 将主题目录下`_layouts/page.html`复制到工程目录中
cp <theme>/_layouts/page.html <project>/_layouts/page.html

# 3. 修改工程目录下对应的主题文件
```




