---
layout: post
title: Docker 入门简介
category: ['杂记']
tags: ['docker', 'container']
author: 万洲
email: wanzhou@asiainfo.com
description: Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 Linux 机器上，也可以实现虚拟化。
---

|  |  *目 录* |
| --- | --- |
| 1 | [Docker简介](#link1) |
| 2 | [Docker安装](#link2) |
| 3 | [端口映射、网络](#link3) |
| 4 | [自定义容器](#link4) |
| 5 | [容器数据卷管理](#link5) |
| 6 | [其它](#link6) |

<a id="link1"></a>
<style>
.red { color: red; }
.blue { color: blue; }
</style>

## 一、Docker简介

Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中，然后发布到任何流行的 `Linux`、`Windows`机器上，也可以实现虚拟化。

### 1.1 什么是 Docker
`Docker`使用**客户端-服务器** (C/S) 架构模式。`Docker客户端`会与`Docker守护进程`进行通信。`Docker` 守护进程会处理复杂繁重的任务，例如建立、运行、发布你的`Docker`容器。`Docker`客户端和守护进程可以运行在同一个系统上，当然你也可以使用`Docker`客户端去连接一个远程的`Docker`守护进程。`Docker`客户端和守护进程之间通过 `socket` 或者 `RESTful API` 进行通信。

首先，`Docker` 容器的启动可以在 <span class="red">***秒级***</span> 实现，这相比传统的虚拟机方式要快得多。 其次，`Docker` 对系统资源的<span class="red">***利用率很高***</span>，一台主机上可以同时运行数千个 `Docker` 容器。
容器除了运行其中应用外，基本不消耗额外的系统资源，使得应用的性能很高，同时系统的开销尽量小。传统虚拟机方式运行 10 个不同的应用就要起 10 个虚拟机，而`Docker` 只需要启动 10 个隔离的应用即可。

### 1.2 与传统虚拟化的差异
容器是在 ***操作系统层面*** 上实现虚拟化，直接<span class="red">***复用***</span>本地主机的操作系统，而传统方式则是在<span class="red">***硬件层面***</span>实现。

![](/images/docker/vm-arch.png)

对于传统的虚拟机来说，每个虚拟的应用包括不仅仅一个应用程序（可能只有数十`MB`），还需要`bins`和`libs`，但是一个完整的操作系统可能有数十`GB`。

![](/images/docker/docker-arch.png)

而`Docker Engine`仅包括应用程序和它的依赖。在宿主机操作系统上，用户空间，独立的运行，和其它容器分享内核。但是有更高的可移植性和高效性。

### 1.3 为什么使用Docker
前面简单介绍了下`Docker`，说了很多`Docker`的相关概念，可是为什么我们要使用它呢？它给我们带来了什么具体的好处呢？

* 首先，前面也说了`Docker` 容器的启动可以在***秒级***实现，这相比传统的虚拟机方式要快得多。 

* 其次，Docker 对系统资源的利用率很高，一台主机上可以同时运行 <strong class="red">数千个</strong>`Docker` 容器。

	容器除了运行其中应用外，<strong class="red">基本不消耗</strong> 额外的系统资源，使得应用的性能很高，同时系统的开销尽量小。传统虚拟机方式运行 10 个不同的应用就要起 10 个虚拟机，而`Docker` 只需要启动 10 个隔离的应用即可。

*  快速交付和部署

	对开发和运维人员来说，最希望的就是一次创建或配置，可以在任意地方正常运行。

	开发者可以使用一个标准镜像来构建一套开发容器，开发完成之后，运维人员可以直接使用这个容器来部署代码。

	`Docker` 可以快速创建容器，***快速迭代***应用程序，并让整个过程全程可见，使团队中的其他成员更容易理解应用程序是如何创建和工作的。 

	`Docker` 容器很轻很快！容器的启动时间是秒级的，***大量*** 地节约开发、测试、部署的时间。

* 高效虚拟化、迁移、扩展

	`Docker` 容器的运行不需要额外的 `hypervisor` 支持，它是内核级的虚拟化，因此可以实现更高的性能和效率。

	`Docker` 容器几乎可以在任意的平台上运行，包括物理机、虚拟机、公有云、私有云、个人电脑、服务器等。 这种兼容性可以让用户把一个应用程序从一个平台直接迁移到另外一个。

	使用 `Docker`，只需要小小的修改，就可以替代以往大量的更新工作。所有的修改都以增量的方式被分发和更新，从而实现自动化并且高效的管理。


* 对比传统虚拟机

	![](/images/docker/compare.png)
	
### 1.4 Docker 镜像
`Docker` 容器运行时的<i class="red">**只读模板**</i>，每一个镜像由一系列的层 (layers) 组成，最底层是`bootfs`，接着是`rootfs`。`Docker` 使用 `UnionFS` 来将这些层联合到单独的镜像中。

`UnionFS` 允许独立文件系统中的文件和文件夹(称之为分支)被***透明覆盖***，形成一个单独连贯的文件系统。

![](/images/docker/docker-images-fs.png)

`bootfs`是`Docker`镜像最底层的 ***引导文件***　系统，包括`bootloader`和`操作系统的内核`。在容器启动完毕之后，为了节省内存空间，`bootfs`会被卸载。

`rootfs`位于`bootfs`之上，是`Docker`容器启动时内部进程课件的文件系统，即`Docker`容器的根目录。通常包含一个操作系统运行所需的文件系统。如`/dev` `/proc` `/bin` `/etc` `/lib` `/usr` `/tmp` 等。

将`rootfs`设为只读模式，在挂载完成之后，利用`UnionFS`，在`rootfs`上方创建一个<i class='red'>**读写层**</i>，只有在`Docke`容器运行过程中文件系统发生改变，才会把变化的文件内容写到可读可写层，并隐藏只读成的老版本文件（写时复制）。

当修改镜像内的某个文件时，只对处于最上方的 ***读写层*** 进行了变动，不覆盖下层已有的文件系统的内容，已有文件在只读层的原始版本仍然存在，但会被读写层的新版本文件隐藏，当`docker commit`这个修改过的容器文件系统为一个新的镜像时，保存的内容仅为上层读写文件系统中被更新过的文件。

### 1.5 Docker 仓库、容器
`Docker` 仓库用来保存镜像，可以理解为代码控制中的代码仓库。

`Docker` 仓库有公有和私有的概念。公有的 `Docker` 仓库名字是 `Docker Hub`。

容器是从镜像创建的运行实例。它可以被启动、开始、停止、删除。每个容器都是相互隔离的、保证安全的平台。

可以把容器看做是一个 <i class="red">**简易版**</i> 的 `Linux` 环境（包括`root`用户权限、进程空间、用户空间和网络空间等）和运行在其中的应用程序。

### 1.6 命名空间
`Docker`通过以下 ***6*** 种 `namespace` 从进程、网络、IPC、文件系统、UTS 和用户角度的隔离，一个 container 就可以对外展现出一个独立计算机的能力，并且不同 container 从 OS 层面实现了隔离。 然而不同 namespace 之间资源还是相互竞争的，仍然需要类似 ulimit 来管理每个 container 所能使用的资源 - `cgroup`。

#### 1.6.1 pid namespace
不同用户的进程就是通过 `pid namespace` 隔离开的，且不同 `namespace` 中可以有相同 PID。具有以下特征:

* 每个 `namespace` 中的 pid 是有各自的 pid=1 的进程(类似 `/sbin/init` 进程)
* 每个 `namespace` 中的进程只能影响自己的同一个 `namespace` 或子 `namespace` 中的进程
* 因为 `/proc` 包含正在运行的进程，因此在 `container` 中的 `pseudo-filesystem` 的 `/proc` 目录只能看到自己 `namespace` 中的进程
* 因为 `namespace` 允许嵌套，父 `namespace` 可以影响子 `namespace` 的进程，所以子 `namespace` 的进程可以在父 `namespace` 中看到，但是具有不同的 pid

#### 1.6.2 mnt namespace
类似`chroot`，将一个进程放到一个特定的目录执行。

`mnt namespace` 允许不同 `namespace`的进程看到的文件结构不同，这样每个 `namespace`中的进程说看到的文件目录就被隔离开了。

同`chroot`不同，每个 `namespace` 中的容器在`/proc/mounts` 的信息只包含所在 `namespace` 的 `mount point`。

#### 1.6.3 net namespace
网络隔离是通过`net namespace` 实现的，内有`net namespace` 有独立的network devices，IP addresses，IP routeing tables， `/proc/net` 目录，这样每个容器的网络就能隔离开来。

`Docker` 默认采用`veth` 的方式将容器中的虚拟网卡同 宿主机host 上的一个`docker bridge` 连接在一起。

#### 1.6.4 uts/ipc namespace
`UTS("Unix Time-sharding System") namespace` 允许每个 container 拥有独立的 `hostname` 和 `domain name`，使其在网络上可以被视作一个独立的节点，而非宿主机上的一个进程。

container 中进程交互采用 `Linux` 常见的进程间交互方法 (interprocess communication - IPC), 包括常见的信号量、消息队列和共享内存。然而同 VM 不同，container 的进程间交互实际上还是宿主机上具有相同 pid namespace 中的进程间交互，因此需要在IPC资源申请时加入 namespace 信息 - 每个 IPC 资源有一个唯一的 32bit ID。


#### 1.6.5 user namespace
每个 container 可以有不同的 user 和 group id, 也就是说可以以 container 内部的用户在 container 内部执行程序而非 Host 上的用户。


<a id="link2"></a>

## 二、Docker 安装
### 2.1 CentOS / Red Hat Enterprice Linux
要求是`64`位操作系统，内核版本`>=3.0`。

* 添加`Docker`的`yum`源：

		sudo tee /etc/yum.repos.d/docker.repo <<-'EOF'
		[dockerrepo]
		name=Docker Repository
		baseurl=https://yum.dockerproject.org/repo/main/centos/$releasever/
		enabled=1
		gpgcheck=1
		gpgkey=https://yum.dockerproject.org/gpg
		EOF
具体可以参考：

		https://docs.docker.com/engine/installation/linux/centos/

* 安装命令：

		yum install docker-engine -y
		
* 设置开机启动：

		systemctl enable docker
* 启动配置文件路径

		/usr/lib/systemd/system/docker.service
		
		[Unit]
		Description=Docker Application Container Engine
		Documentation=https://docs.docker.com
		After=network.target docker.socket
		Requires=docker.socket

		[Service]
		Type=notify
		ExecStart=/usr/bin/docker daemon -H 0.0.0.0:2375 -H unix:///var/run/docker.sock
		MountFlags=slave
		LimitNOFILE=1048576
		LimitNPROC=1048576
		LimitCORE=infinity
		TimeoutStartSec=0

		[Install]
		WantedBy=multi-user.target
* 加载

		systemctl daemon-reload
* 重启`docker`

		systemctl restart docker
		
* 免 `sudo` 使用`docker`(没权限访问 `/var/run/docker.sock`)

		sudo groupadd docker
		sudo gpasswd -a ${USER} docker
		sudo service docker restart
		


<i class='red'>**注意：**</i>

* 在安装的过程中，可能会提示有一个已安装的包冲突，先把冲突的卸载，
		
		yum remove lvm-2.02
		yum install docker-engine –y
		yum install lvm-2.02 -y


### 2.2 Mac OSX / Windows
下载安装即可，或者通过`docker-machine`安装，后续会有介绍，下载链接：

	https://www.docker.com/products/docker-toolbox 
	
### 2.3 CentOS / Red Hat Enterprice Linux 测试
* 运行`hello-world`

		docker run hello-world
		
* 搜索镜像

		docker search centos
* `pull`镜像

		# [:tag]指定pull的版本，不指定默认为latest
		docker pull centos[:7]
		# 查看当前本地镜像列表
		docker images
* 交互式运行容器

		docker run --name test -i -t -d centos /bin/bash
* 查看当前运行的程序

		docker ps
		# 查看所有容器
		docker ps -a
* 连接到运行的容器

		docker exec -it test /bin/bash
		# or
		docker attach test
		# 或容器的container id，退出 Ctrl +P,Ctrl +Q（exit或Ctrl+D退出容器）
### 2.4 常用命令介绍
* 查看所有`docker`命令

		docker help
* 查看启动`docker server`的参数

		docker daemon --help
* 查看某个具体命令的介绍

		docker <command> --help
		如： docker search --help
* pull 拉取镜像

		docker pull --help
* push 推送指定镜像
		
		docker push --help
* 查看所有镜像列表

		docker images --help
* 移除一个或多个镜像

		docker rmi --help
* 启动容器

		docker run --help
* 创建容器

		docker create --help
* 启动容器

		docker start --help
* 停止容器

		docker stop --help
* kill 容器

		docker kill --help
* 删除容器

		docker rm --help
		
<a id="link3"></a>
## 三、端口映射、网络
顾名思义，就是将容器内部服务的端口，映射到宿主机上，以便在宿主机、外部网络能访问容器内部发布的服务。映射的方式有两种：自动映射和绑定映射端口。

自动映射：在容器启动的时候，通过指定 `-P` 参数( `docker run -P` )，自动绑定所有对外提供服务的容器端口，映射的端口会在没有使用的端口池中（`49000-49900`）自动选择。

绑定映射：跟自动映射的区别在于，可以指定映射到宿主主机上的端口号，其基本语法如下所示，

	docker run -p [([<host_interface>:[host_port]])|(<host_port>):]<container_port>[/udp] <image> <cmd>

<i class="red">**注意：**</i>

* 默认不指定绑定ip，则监听所有网络端口。
* `-P` 使用时需要指定`--expose` 选项，用于指定需要对外监听的端口。
* 可以通过`docker ps`、`docker inspect <contain id>` 或`docker port <contain id> <port>`等确定绑定信息。

### 3.1 四种网络模式
在通过 `docker run` 命令创建并启动一个容器的时候，可以通过 `--net` 选项指定容器的网络模式，可选网络模式：

* `host`模式，使用 `--net=host` 指定。
* `container`模式，使用 `--net=container:name or id`指定。
* `none`模式，使用 `--net=none` 指定。
* `bridge`模式，使用 `--net=bridge` 指定。

不指定，默认使用的是`bridge`模式（桥接）。

#### 3.1.1 host 模式
如果容器启动的时候指定了 `host` 模式，那么容器不会获取一个独立的 `network namespace`，而是和宿主机 <i class='red'>**共用**</i> 一个 `network namespace`。且不会虚拟自己的网卡、ip等，而是使用宿主机的 ip 和端口。

形象一点描述，在 `10.211.55.2/24` 主机上用 host 模式启动了一个容器，对外监听 `27017` 端口。此时若在容器中用 `ifconfig`、`ip addr` 等查看网络信息的命令查看，看到的是宿主机的网络信息。而外界可以直接通过 `10.211.55.2:27017`访问即可，不用进行任何 `NAT` 转换，对于其他应用或人而言，就像一个 ***直接运行在宿主机上的进程***。

相对的，容器的文件系统，进程等还是跟宿主机 ***隔离*** 的。

#### 3.1.2 container 模式
指定此模式创建启动容器，则新创建的容器会和指定的容器共享同一个 `network namespace`，新创建的容器不会配置自己的网络环境、ip端口等，而是和指定的容器共享同一套ip、端口池等。

跟host模式一样，两个容器的文件系统、进程列表等还是相互 ***隔离*** 的，两个进程和通过 `lo` 网卡进行通信，`127.0.0.1`、`0.0.0.0`。

#### 3.1.3 none 模式
此种模式下，容器拥有自己独立的 `network namespace`，但是并不会创建任何网络配置，也就是说该容器并没有网卡、ip、路由等。

也就是说，如果有网络配置要求，需要 <i class='red'>**人为**</i> 去进行配置。

#### 3.1.4 bridge 模式
`docker` 默认的网络模式，此模式为每个容器分配`network namespace`、设置ip等，并将所有的容器通过 `veth` 连接到宿主机的虚拟网桥上 `docker0`（`docker daemon` 启动时，会自动创建该网桥）。

虚拟网桥的工作方式跟物理交换机类似，这样所有宿主机上的容器都通过交换机连接在一个二层网络中。

在创建 `docker0` 网桥时，会自动为其分配一个和宿主机不同的ip地址和子网，连接到 `docker0` 的容器就从其子网内选择一个未被使用的ip分配给容器。

`docker` 一般会使用`172.17.0.0/16`这个网段，并将`172.17.42.1/16`分配给`docker0`网桥。也可以自己创建一个网桥，为其分配指定的网段，然后通过 `docker daemon` 的 `-b` 参数指定为`docker`默认的网桥。

![](/images/docker/bridge.png)

### 3.2 跨主机容器互联
可行的方式：

* `kubernetes` 集群

* `swarm` 集群 + `overlay`

* 直接路由 -- 要求所有主机

## 四、自定义容器
`Docker` 可以通过 `Dockerfile` 的内容来自动构建镜像，`Dockerfile`是一个包含创建镜像所有命令的 ***文本文件***，通过 `docker build` 可以根据编写的 `Dockerfile` 来构建镜像。

`Dockerfile` 的指令选项：

* FROM
* MAINTAINER
* RUN
* CMD
* EXPOSE
* ENV
* ADD
* COPY
* ENTRYPOINT
* VOLUME
* USER
* WORKDIR
* ONBUILD

### 4.1 FROM
用法：

	FROM <image>[:tag]
<i class='blue'>说明：</i>

指定构建镜像的基础镜像，一般来说就是提供运行环境的基础镜像（`Linux`环境、`python`运行环境等），若本地不存在，这自动去共有仓库`pull`。

<i class='red'>注意：</i>

* `FROM` 必须是 `Dockerfile` 中非注释的第一个命令，即 `Dockerfile` 中`FROM` 开始。
* `FROM` 可以出现多次，比如说需要构建多个镜像。
* 如果没有指定 `[tag]`，则默认使用 `latest`作为`tag`。

### 4.2 MAINTAINER
用法：

	MAINTAINER <name>
<i class='blue'>说明：</i>

指定创建镜像的用户。

### 4.3 RUN
用法：
	
	RUN <cmd>     命令会在一个shell中运行 /bin/sh -c
	RUN ["cmd", "param1", "param2"]

<i class='blue'>说明：</i>

每条命令会在当前镜像上执行，并提交为新的镜像，后续的RUN 会在前面 RUN 提交的镜像为基础，镜像是分层的（UnionFS）。

<i class='red'>注意：</i>

* 第二种方式会被解析为一个 `JSON` 数组，必须使用双引号，且不会调用一个命令 `shell`，所以也就不会继承相应的变量，

		RUN ["echo", "$HOME"]
上述命令不会输出 `HOME` 变量，正确的应该，

		RUN ["sh", "-c", "echo", "$HOME"]

* `RUN` 命令产生的缓存在下一次构建时并不会失效，会被重用，可以使用 `--no-cache` 禁用。

### 4.4 CMD
用法：
	
	CMD ["executable", "param1", "param2"]  优先选择
	CMD ["param1", "param2"]  作为 ENTRYPOINT 的参数
	CMD command param1 param2

<i class='blue'>说明：</i>

为在容器启动的时候，提供一个默认的命令执行选项。如果用户启动容器的时候指定了运行的命令，这会覆盖 `CMD` 指定的命令。

<i class='red'>注意：</i>

* `CMD` 在 `Dockerfile` 中能使用一次，如果使用多个，只有最后一个生效。

与`RUN`的差异：

`CMD`会在容器启动的时候执行，在容器构建的时候不执行，而RUN在容器构建时运行，待容器构建完成之后，后续的所有操作均与`RUN`无关。

### 4.5 EXPOSE
用法：

	EXPOSE <port> [<port> …]
<i class='blue'>说明：</i>

告诉 `Docker` 服务端容器对外映射的端口号，需要在容器运行的时候，通过 `docker run -p` 或 `-P` 对外映射生效。

### 4.6 ENV
用法：

	ENV <key> <value>   # 只能设置一个变量
	ENV <key>=<value> …   # 可以设置多个变量
<i class='blue'>说明：</i>

指定一个或多个环境变量，会被后续的 `RUN` 命令所使用，并在容器运行时保留。

例如：

	ENV env1=test1 env2=test2
	等同于
	ENV env1 test1
	ENV env2 test2

### 4.7 ADD
用法：

	ADD <src> … <dest>
<i class='blue'>说明：</i>

复制本地主机文件、目录或者远程文件 `URLS` 从 `<src>` 并且添加到容器指定路径中 `<dest>`。`<src>` 支持通过 `GO` 的正则模糊匹配，

	ADD hom* /mydir/
	ADD hom?.txt /mydir/
<i class='red'>注意：</i>

* `<dest>` 路径必须是绝对路径，如果 `<dest>` 不存在，会自动创建对应目录
* `<src>` 路径必须是 `Dockerfile` 所在路径的相对路径
* `<src>` 如果是一个目录，只会复制目录下的内容，而目录本身则不会被复制

### 4.8 COPY
用法：

	COPY <src> … <dest>

<i class='blue'>说明：</i>

`COPY` 复制新文件或者目录从 <src> 添加到容器指定路径中 <dest>。

<i class='red'>注意：</i>

用法同 `ADD`，与 `ADD` 的区别是，`COPY` 不能指定远程文件。

### 4.9 ENTRYPOINT
用法：

	ENTRYPOINT ["executable", "param1", "param2"]
	ENTRYPOINT command param1 param2

<i class='blue'>说明：</i>

创建容器启动后执行的命令，并且不可以被 `docker run`提供的参数覆盖，如需替换，可以使用 `docker run --entrypoint`选项。

<i class='red'>注意：</i>

* 每个`Dockerfile` 只能有一个`ENTRYPOINT`，如指定多个，只有最后一个生效。

例如：

	FROM centos:7
	ENTRYPOINT [“top”, “-b”]
	CMD [“-c”]
使用 `exec form`来指定默认启动命令，通过`CMD`添加默认启动命令之外，经常被更改的参数项。

	FROM centos:7
	ENTRYPOINT exec top -b

这种方式会在 `/bin/sh -c` 中执行，会忽略任何 `CMD` 或者 `docker run` 命令行选项，为了确保 `docker stop` 能够停止长时间运行 `ENTRYPOINT` 的容器，确保执行的时候使用 `exec` 选项.

### 4.10 VOLUME
用法：
	
	VOLUME [“/data”]
	VOLUME /data/db /data/logs
<i class='blue'>说明：</i>

创建一个可以从本地主机或其他容器挂载的挂载点

### 4.11 USER
用法：

	USER daemon

<i class='blue'>说明：</i>

指定运行容器时的用户名或 UID，后续的 `RUN`、`CMD`、`ENTRYPOINT` 也会使用指定用户。

### 4.12 WORKDIR
用法：

	WORKDIR /path/to/your/dir

<i class='blue'>说明：</i>

为后续的 `RUN`、`CMD`、`ENTRYPOINT` 指令配置工作目录。可以使用多个 `WORKDIR` 指令，后续命令如果参数是相对路径，则会基于之前命令指定的路径。

例如：

	WORKDIR /a
	WORKDIR b
	WORKDIR c

	最后的路径为 /a/b/c
### 4.13 ONBUILD
用法：
	
	ONBUILD [INSTRUCTION]

<i class='blue'>说明：</i>

配置当所创建的镜像作为其它新创建镜像的基础镜像时，所执行的操作指令。

### 4.14 mongodb实例

	FROM centos:7

	RUN mkdir -p /data/db /data/logs /keys /config

	ADD source/mongodb-bin.tar.gz /usr/local/bin
	COPY source/mongod.conf /config/
	COPY source/mongodb-keyfile /keys/
	COPY source/authAdmin.ms /config/

	RUN chmod 600 /keys/mongodb-keyfile \
		&& ls -l /keys \
		&& mongo --version
	COPY docker-entrypoint.sh /entrypoint.sh
	ENTRYPOINT ["/entrypoint.sh"]

	EXPOSE 27017

	WORKDIR /config
	CMD ["mongod", "-f", "mongod.conf"]

<a id="link5"></a>

## 五、容器数据卷管理
`Docker` 镜像 <==> 只读层，虽然提高了镜像构建、存储和分发效率，但是也有如下的缺点：

* 容器文件在宿主机上保存形式复杂，不易在宿主机上进行访问。
* 多个容器间数据无法共享。
* 删除容器时，容器产生的数据会丢失。

因而，`Docker` 引入了数据卷（`volume`）机制，存在于一个或多个容器中的特定文件或文件夹，能独立于联合文件系统的形式存在于宿主机中，并能为多个容器所共享。

* 在容器创建时初始化，容器运行时就可以使用其中的文件。
* 能在不同容器之间共享和重用。
* 对`volume`中数据的操作会马上生效。
* 对`volume`的操作不会影响到镜像本身。
* `volume`的生命周期独立于容器的生存周期。（即使删除容器，`volume`仍然存在，没有任何容器使用的`volume`也不会被`Docker`删除）

### 5.1 添加数据卷
使用 `-v` 选项添加一个数据卷，或者可以使用多次 `-v` 选项为一个 `docker` 容器运行挂载多个数据卷。

	docker run --name test -v /data -i -t -d centos /bin/bash

创建的数据卷可以通过 `docker inspect` 获取宿主机对应路径。

	docker inspect test

或者直接通过 `--format` 只显示需要的结果：

	docker inspect --format=“{{.Volumes}}” data

<i class='red'>注意：</i>

* 此种方式添加的数据卷，数据默认保存在 `/var/lib/docker/volumes`。

### 5.2 挂载宿主机目录
除了直接挂载一个数据卷到容器之外，还可以将宿主机中的一个文件或目录挂载到容器当中。格式：

	docker run --name mongod -itd -p 27017:27017 -v /data/db:/data phoenix-mongo

默认挂载是读写的，可以在挂载的时候指定只读。

	docker run --name mongod -itd -p 27017:27017 -v /data/db:/data:ro phoenix-mongo

但是实际在运用过程中，会遇到一些问题，即挂载之后在容器中没有权限读取挂载的目录，只要将上述的 `ro` 指定为 `Z` 或 `z` 即可，

	docker run -name mongod -itd -p 27017:27017 -v /data/db:/data:Z phoenix-mongo

`stackoverflow`上关于 `Z`、`z` 的说明:

	http://stackoverflow.com/questions/24288616/permission-denied-on-accessing-host-directory-in-docker

### 5.3 数据卷容器
如果需要在容器（或非持久性容器）间共享一些持久性数据，最好的办法是创建一个数据卷容器，然后从此容器上挂载数据。

创建数据卷容器：
	
	docker run -itd -v /data/test:/test:Z --name data centos echo hello

使用 `--volume-from` 选项在另一个容器上挂载 `/test` 卷，不管 `data` 容器是否运行，其它容器都可以挂载该容器数据卷，若只是一个单独的数据卷（容器中没有任何服务逻辑）是不需要创建容器的，直接通过 `docker volume create` 创建即可。

使用容器数据卷：
	
	docker run --name test1 -itd --volume-form data centos /bin/bash
	docker run --name test2 -itd --volume-form data centos /bin/bash
也可以继承其它挂载 `/test` 卷的容器，

	docker run --name test3 -itd --volume-form test2 centos /bin/bash

创建为按成之后的结构如下图所示：

![](/images/docker/container-volume.png)

删除数据卷`volume`：

	docker rm -v，删除容器时指定 -v 参数。
	docker run --rm ，启动容器的时候指定 --rm 参数。

若不像上述方式，在删除容器的时候删除其数据卷的话，会在 `/var/lib/docker/volumes` 目录下遗留很多文件及目录。

<a id="link6"></a>

## 六、其它
很多部署`Docker` 服务的时候，会遇到容器间需要交互的情况，如展示WEB服务、数据库容器之间。

容器见的交互，是在`docker daemon` 启动参数 `--icc` 控制，特殊情况为了保证容器及宿主机的安全，`--icc` 通常设置为`false`，即容器间不能进行交互。如果直接向外映射端口，虽然可以达到交互的条件，但是也可能不能满足安全性的要求。

链接就是为了解决这一问题的，`Docker` 的连接系统可以在两个容器间建立一个安全的通道，斯特接收容器可以通过此通道访问源容器指定的相关服务信息（数据库访问等）。

用法：

	--link <name or id>:alias
	
### 6.1 示例
现有两个容器 `web` 和 `db`，分别提供展示和数据库服务。

	docker run --name db -itd phoenix-mongo
	docker run --name web --link db:webdb phoenix-web

如此一个`link`就创建完成了，`web`容器可以从`db`容器中获取数据，`web`容器叫作接收容器或父容器，`db`容器叫作源容器或子容器。链接的具体实现：

* 设置接收容器的环境变量。
* 更新接收容器的 `/etc/hosts` 文件。
* 添加`iptables`规则，使容器链接的两个容器可以通讯。

<i class='red'>注意：</i>

* 一个接收容器可以设置多个源容器，一个源容器也可以有多个接收容器。

### 6.2 swarm 集群介绍
将一系列 `Docker` 宿主机变为一个集群，对外而言就像一个单一的宿主机一样。

`swarm`由一个`swarm manager`和若干个`swarm node` 组成，`swarm manager`上运行`swarm daemon`，用户跟`manager`通信，`manager`将操作转发到对应的`node`上。

`swarm daemon`只是一个调度器（`scheduler`）和路由器（`router`）的组合，其本身并不会运行任何 `Docker` 容器，它只是接受 `Docker` 客户端发来的请求，调度合适的 `swarm node` 来运行`container`。

若`swarm daemon`意外挂掉了，已经运行的容器不会受到任何影响。其架构如下所示：

![](/images/docker/swarm-arch.png)

三个独立的主机，分别装了`docker daemon`：

![](/images/docker/single-docker.png)

通过`swarm`创建集群：

![](/images/docker/swarm-cluster.png)

### 6.3 docker-compose 简介
`Dockerfile` 重现一个容器，`Compose`重现容器的配置和集群。

编排`Orchestration`，定义被部署对象的各个组成部分之间的耦合关系，部署流程中各个动作的执行顺序，部署过程说需要的依赖文件，被部署文件的存储位置和获取方式，以及如何验证部署成功。

部署`Deployment`，安装编排指定的内容和流程，在目标主机上执行编排指定的环境初始化，存放指定的依赖和文件，运行指定的部署动作，最终安装编排的规则确认部署成功与否。

说的简单点，就是安装一个特定的顺序，完成其指定的容器启动顺序，并校验部署的成功与否。

#### 6.3.1 示例
	-- docker-compose.yml
	web:
	images: phoenix-web
	ports:
	- “3000:3000”
	links:
	- db
	db:
	images: phoenix-mongo
	volumes:
	- /data/db:/data:Z

运行：

	docker-compose up

### 6.4 docker-machine 简介
对于 `Docker` 集群而言，需要每台宿主机有安装并启动 `docker daemon` 进程，而安装启动`docker`进程的过程是重复，`Docker Machine`把用户搭建`Docker` 环境的各种方案汇集在一起，简化了 `Docker` 环境搭建过程，让用户和把时间花在开发上。

`Machine` 主要帮助用户在不同的云主机等上，创建并管理虚拟机，并在虚拟机中安装Docker，而 Docker本身就是客户端程序与守护进程之间的交互，启动了`docker daemon`即搭建了 `Docker` 运行环境。

目前已经支持十余种运品台和虚拟机软件，包括`Amazon Web Services`、`Google Compute Engine`、`OpenStack`等。

`Machine` 支持多种虚拟机软件和众多主流的`IaaS`平台，支持的虚拟机软件有`VirtualBox`、`Vmware Fusion`和`Hyper-V`，涵盖了`Linux`、`Mac`和`Windows`三大平台。
