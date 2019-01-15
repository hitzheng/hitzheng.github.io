[TOC]

# GithubPages

Github Pages是github推出的免费静态网站托管服务，支持`用户`和`项目`两种站点，访问域名为`<user>.github.io`。



## 用户站点

用户站点需要创建一个单独的仓库，仓库名必须为`<user>.github.io`，eg. hitzheng.github.io。站点静态源文件必须放到`master`分支的根目录。

通常用于构建站点的源码单独放到`source`分支下，源码编译的静态文件目录映射到master的根目录。

`master`分支(只包含静态文件)：

```sh
<project>
├── 404.html
├── about
│   └── index.html
├── assets
│   ├── main.css
│   └── minima-social-icons.svg
├── feed.xml
├── index.html
└── welcome.html
```

`source`分支(包含项目源码及静态文件)：

```sh
<project>
├── README.md
├── deploy.sh           # 发布脚本(将public目录内容同步到master根目录)
├── package-lock.json   # npm依赖锁
├── package.json        # npm依赖文件
├── webpack.config.js   # 打包配置文件
├── public/             # 编译输出目录(映射到master分支根目录)
└── src/                # 前端源文件目录
```

由于`master`和`source`分支的目录结构不一样(master只有source分支的public内容)，需要使用`git subtree push`功能将`source`分支的public目录同步到master分支，为方便起见使用`deploy.sh`脚本。

`deploy.sh`部署脚本：

```sh
#!/bin/sh
git subtree push --prefix public origin master
```

站点静态文件发布到master分支后，等一小会即可通过<user>.github.io访问到了。



## 项目站点

项目站点用于添加项目文档说明等，站点静态文件位于项目同一个仓库，项目站点通过`<user>.github.io/<project>`访问。



有三种发布位置：

- `master`分支(适用于文档型项目，没有业务代码)
- `master`分支的`docs`目录(适用于业务项目的文档说明)
- `gh-pages`分支(站点静态文件单独一个分支)



`最佳实践`

为了避免站点代码、站点文件、业务代码揉到一块，实践中将三者各放一个分支：

- `master` 业务主分支
- `gh-pages` 站点发布分支，包含站点静态文件
- `doc-source` 站点源码分支，包含站点项目源码，编译输出目录可为`public`

在`doc-source`分支下编辑完站点后，将编译输出的静态文件发布到`gh-pages`分支，可以使用脚本完成。

`deploy.sh`部署脚本：

```sh
#!/bin/sh
git subtree push --prefix public origin gh-pages
```



## Git Subtree

由于github pages站点源码和站点文件位于不同分支，而且目录结构完全不同，为了代码同步方便，使用`git subtree`功能。

`git subtree`用于在一个仓库中将子目录映射到另一个仓库，而且当前仓库的使用与之前完全一致，只是在需要同步另一个仓库代码的时候调用相应的`add`、`pull`、`push`操作。



常用命令如下：

1. `git subtree add --prefix=<dir> <repos> <branch>`
   将`repos`仓库的`branch`分支克隆到当前仓库的`dir`目录下

2. `git subtree pull  --prefix=<dir> <repos> <branch>`
   拉取`repos`仓库的`branch`分支到当前仓库的`dir`目录下

3. `git subtree push  --prefix=<dir> <repos> <branch>`
   将当前仓库的`dir`目录推送到`repos`仓库的`branch`分支下


