---
title: "[Docker]安装与使用"
date: 2019-01-14 22:47:20
categories: [dev-ops, docker]
tags: [docker, 学习]
---
# 文档
1. 官方文档: https://docs.docker.com/
2. Docker-从入门到实战: https://yeasy.gitbooks.io/docker_practice/
3. Kubernetes指南: https://kubernetes.feisky.xyz/zh/

# 架构
1. dockerd: 服务端，基于linux容器技术，所以必须运行于linux上
2. docker: 客户端，通过socket与服务端交互
3. image: 镜像，包含容器运行的所有资源
4. container: 容器，镜像的一个运行实例

# 平台
docker-for-mac
- macOS 10.11以后
- 基于HyperKit VM
- 通过docker.vpnkit代理端口

docker-for-windows
- win10
- 基于Hyper-V VM
- 通过docker.vpnkit代理端口

docker-toolbox
- 历史版本，用于旧系统
- 基于Virtual Box VM，Core Linux
- 通过VM的虚拟网卡访问

centos7
- centos7内核版本3.10，生产环境需要升级内核以支持overlay2文件系统
- 导入elrepo的key：rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
- 导入elrepo源：rpm -Uvh http://www.elrepo.org/elrepo-release-7.0-2.el7.elrepo.noarch.rpm
- 升级内核：yum --enablerepo=elrepo-kernel install kernel-ml -y
- 修改内核启动顺序：grub2-set-default 0
- 重启系统：reboot
- 查看内核：uname -a
- 查看docker：docker info | grep storage-driver

目录映射
- windows或macos上的目录通过VM的`共享目录`方式映射到docker的linux主机上
- dockerd通过`-p`卷映射的方式将目录映射到容器里

# 使用
创建容器
```sh
docker run [options] <IMAGE> [COMMAND ARGS]
--name ContainerName #容器名
--hostname newdev #主机名
--add-host a.com:127.0.0.1 #添加host绑定，可多个
-v HostPath:Path #目录映射
-p HostPort:Port #端口映射
-d #后台运行
-t #分配TTY
-i #交互方式
```

进入容器
```sh
# 将本地输入、输出、错误附加到容器上
docker attach <container>

# 在容器中运行命令(本例切换用户并执行完整登陆)
docker exec -ti <container>  su worker -l
```

容器连接
```sh
--link OtherContainerName:Alias 将其它容器连接到当前容器
被连接的容器可以不使用-p暴露端口就可以和当前窗容器交互
当前容器通过环境变量或hosts访问被连接的容器(环境变量有ALIAS开头的变量，/etc/hosts有Alias的指向)
```

数据容器
```sh
通过-v参数创建一个数据卷容器，其它容器通过--volume-from xxx
将数据卷容器挂载到自己的目录下，多个挂载了数据卷的容器就可以共享数据了，
比如单独起一个日志容器用来收集各容器产生的日志

映像Dockerfile可以使用VOLUME xxx创建匿名数据卷，运行容器的时候使用-v参数进行覆盖
```

Docker信息
```sh
# 查看docker的系统信息
docker info

# 查看docker对象信息
docker inspect <container|image|...>
```

创建镜像
```sh
1. 从容器创建镜像`docker commit <container> <tagname>`
  eg. docker commit 1bf50710937a registry:5000/env:php5.6-dev
  
2. 从Dockerfile创建镜像`docker build -t <tagname> <DockerfileDir>`
  eg. docker build -t registry:5000/env:php5.6-dev .
  
3. 推送到远程仓库`docker push <tagname>`
  eg. docker push registry:5000/env:php5.6-dev
```

文件传输
```sh
# 将容器路径下的文件或目录复制到本地路径下
docker cp [option] container:path local_path

# 将本地路径下的文件或目录复制到容器路径下
docker cp [option] local_path container:path

-a 包含uid/gid信息
-L 包含符号连接
```

容器操作
```sh
# 启动容器
docker start <container>

# 停止容器
docker stop <container>

# 重启容器
docker restart <container>

# 删除容器
docker rm <container>

# 删除所有终止的容器
docker container prune

# 查看容器日志(输出)
docker logs [-f] <container>

# 查看容器端口映射
docker port <container>

# 查看容器
docker ps [-a]
-a 所有容器

# 容器统计(cpu,mem,net)
docker stats [-a]

# 容器进程
docker top <container> [ps options]

# 查看容器信息
docker inspect [OPTIONS] <container>
-f '{{.State.Pid}}' 过滤

# 导出容器到一个tar文件
docker export -o path <container>

# 从容器的tar文件导入为新镜像
docker import <path> [image]
```

镜像操作
```sh
# 查看镜像历史
docker history -H <image>

# 拉取镜像
docker pull <image:tag>

# 推送镜像
docker push <image:tag>

# 查看镜像列表
docker images

# 删除镜像
docker rmi <image>

# 删除无用镜像
docker image prune

# 搜索镜像
docker serach <pattern>

# 导出镜像到tar文件
docker save -o path <image>

# 从tar文件中加载镜像
docker load -i path

# 镜像标签
docker tag src_img[:tag] dst_img[:tag]
```

私有仓库
```sh
# 官方提供docker-registry镜像用于搭建私有仓库
# 仓库在容器的/var/lib/registry下
# 可通过-v映射到主机目录下
docker run -d -p 5000:5000 --restart=always --name registry registry

# 默认只能使用https，通过以下两方式修改支持http
# 1.启动命令添加选项
--registry-mirror=https://registry.docker-cn.com --insecure-registries=192.168.199.100:5000

# 2.修改/etc/docker/daemon.json
{
  "registry-mirror": [
    "https://registry.docker-cn.com"
  ],
  "insecure-registries": [
    "192.168.199.100:5000"
  ]
}
```

容器DNS
```sh
# 容器默认通过文件映射的方式与主机共享resolv.conf
# 说明：search为本地搜索域，当查询host失败时，还会查询host.local.com
# 可以通过以下方式进行指定
# 1.修改/etc/docker/daemon.json
{
  "dns" : [
    "114.114.114.114",
    "8.8.8.8"
  ],
  "dnsSearch": [
    ".local.com"
  ]
}

# 2.通过启动命令指定
--dns=8.8.8.8 --dns-search=.local.com
```

网络模型
> 主机上创建一个名为docker0的虚拟网桥，自动分配一个类似172.17.0.1/16的私有地址，容器中的eth0通过`veth pair`与docker0相连，自动分配ip地址与docker0在同一网段，这样主机与容器，容器之前就可以相互通信，形成一个虚拟网络。

![docker网络模型](http://p8urb2iim.bkt.clouddn.com/docer-network.png)

# Dockerfile
官方手册：https://docs.docker.com/engine/reference/builder/

Dockerfile包含构建指令，每一条指令都将构建映像的一层。

FROM 指定基础镜像
```sh
# 格式 FROM [registry[:port]/]<image>[:tag]
# 如果不包含registry，默认为docker hub
# 指定基础镜像为centos7
FROM centos:7

# 特殊格式，scratch表示空白基础镜像
# 常用于制作第一层镜像
FROM scratch
```

RUN 执行命令
```sh
# 格式1：RUN <命令>
RUN echo '<h1>Hello, Docker!</h1>' > /var/html/index.html

# 格式2：RUN ["命令", "参数1", "参数2"]
RUN ['echo', '<h1>Hello, Docker!</h1>', '>', '/var/html/index.html']

# 由于每个命令都会创建一层，为了减少层次，
# 通常在一个RUN命令中合并执行多个相关操作，
# 通过&&合并，通过\换行
RUN buildDeps='gcc libc6-dev make' \
    && apt-get update \
    && apt-get install -y $buildDeps
    
# 构造镜像时，无用的中间缓存应该删除，否则会一直跟随镜像，造成臃肿
```

COPY 复制文件
```sh
# 格式：COPY src_path dst_path
# 将构建目录下的文件或目录复制到容器的dst_path
# src_path可以包含通配符，复制内容包含权限等元数据
# dst_path可以是容器的绝对路径，也可以是工作目录(WORKDIR)的相对路径
# dst_path不需要预先创建
COPY package.json /usr/src/app/
```

ADD 添加文件
```sh
# 基本同COPY命令
# src_path可以是URL，可直接下载文件
# src_path可以是gzip、bzip2、xz压缩包，该命令会自动解压
# ADD命令会让构建缓存失效，让构建变慢
# 通常文件复制使用COPY，仅在需要解压时才使用ADD
```

CMD 启动命令
```sh
# 格式1：CMD <命令>
# 格式2：CMD ["命令", "参数1", "参数2"]
# 格式3：CMD ["参数1", "参数2"] 用于ENTRYPOINT的参数
# 做为容器启动时的默认命令，可被容器启动时指定的命令覆盖掉
# 容器命令只能前台执行，主进程退出时容器就退出了
CMD ["nginx", "-g", "daemon off;"]
```

ENTRYPOINT 容器入口
```sh
# 基本同CMD，指定容器的入口命令
# 不能通过运行时的命令覆盖，运行时可通过--entrypoint来覆盖
# 同时存在CMD时，CMD的内容变成其参数，ENTRYPOINT "<CMD>"
ENTRYPOINT ["/usr/sbin/sshd", "-D"]
```

ENV 环境变量
```sh
# 格式：ENV k1=v1 [k2=v2 ...]
# 设置的环境变量可用于其后面的Dockerfile命令，
# 也可用于容器运行时执行的程序
# 通过${k1}引用
ENV PHP_DIR=/usr/local/php
```

ARG 构建参数
```sh
# 格式：ARG k1=v1 [k2=v2 ...]
# 同ENV，但只能在构建过程中使用，容器运行时不存在
# 构建镜像时可通过--build-arg <k1=v1>来覆盖
```

VOLUME 数据卷
```sh
# 格式1：VOLUME ["路径1", "路径2"]
# 格式2：VOLUME <path>
# 将匿名卷挂载到容器的<path>目录下，用于数据库等储存数据
# 该命令防止用户忘记指定目录映射时将数据写到容器里
# 运行容器时通过-v mydata:/data进行覆盖
VOLUME /data
```

EXPOSE 暴露端口
```sh
# 格式：EXPOSE <port1> [<port2> ...]
# 仅仅是声明容器暴露的端口，容器运行时会映射随机端口到打开的端口上
# 运行时通过-p hostport:port覆盖
EXPOSE 80 443
```

WORKDIR 工作目录
```sh
# 格式：WORKDIR <path>
# 指定容器的工作目录，不存在时会自动创建
# 构建时指定容器的相对路径都是相对于WORKDIR
```

USER 当前用户
```sh
# 格式：USER <user>
# 指定容器的用户，必须为已经存在的用户
# 其后的RUN, CMD, ENTRYPOINT以该身份运行
```

HEALTHCHECK 健康检查
```sh
# 格式：HEALTHCHECK [选项] CMD <命令>
# 格式：HEALTHCHECK NONE 屏蔽上层设置
# 若指定则使用该命令检查容器状态，而不是用容器主进程的退出状态
# --interval=<间隔> 默认30秒
# --timeout=<超时> 默认30秒
# --retries=<重试> 默认3次
# 初始状态: starting, 成功状态: healthy, 失败状态: unhealthy
# 命令返回值，成功: 0 失败: 1
HEALTHCHECK --interval=5s --timeout=3s \
  CMD curl -fs http://localhost/ || exit 1
```

