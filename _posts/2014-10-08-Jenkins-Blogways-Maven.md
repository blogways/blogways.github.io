---
layout: post
category: 杂记
title: 使用Jenkins搭建博客和Java源码管理的集成环境
tags: ['Jenkins', 'git', 'maven', 'junit', '集成环境']
author: 万洲
email: wanzhou@asiainfo.com
# image:
description: Jenkins能够集成git，在jekyll环境下，实现博客集成系统，完成提交最新代码，自动生成新的博客；同时Jenkins也能够集成git、maven和junit等，实现java源码的编译、测试、发布等功能的集成开发环境。
---

## 一、 概述

在搭建博客系统的集成环境时，需要用到的有Jenkins、git和jekyll运行环境，本博客有相关的安装教程：

1、***Jenkins安装***

	http://www.blogways.net/blog/2013/04/17/jenkins-git-maven-junit.html
	http://www.blogways.net/blog/2013/04/23/jenkins-git-maven-junit-2.html

2、***git服务器部署及使用***

	http://wanzhou.github.io/blog/2013/04/13/git.html

3、***Windows和MAC OS X下安装jekyll***

	http://www.blogways.net/categories/jekyll/
	
上面是关于博客系统的运行环境搭建，由于我是在服务器上搭建集成环境，本身并没有ruby环境，需要自己去安装，因而说一下ruby和gem的安装。

## 二、 ruby、gem安装

因为jekyll是的ruby语言编写的，需要ruby运行环境！

1、***安装ruby***

首先，去ruby官网下载离线安装包，我下载的是`ruby-2.1.3.tar.gz`，然后运行如下命令：

	cd ruby-2.1.3.tar.gz目录 (如：cd /Users/xxx/Downloads)
	tar -xzvf ruby-2.1.3.tar.gz
	cd ruby-2.1.3
	./configure --prefix=安装ruby的目录 (如：/Users/xxx/App/ruby)
	make && make install

安装好以后，修改操作系统的PATH路径，一般是修改`~/.bashrc`或者`~/.bash_profile`文件：

	RUBY_HOME=/Users/xxx/App/ruby  (安装ruby的目录)
	export RUBY_HOME
	PTAH=$RUBY_HOME/bin:$PATH
	export PATH
	
2、***安装ruby***

同样，首先下载rubygem安装文件：

	http://rubygems.org/pages/download/

其中有很多种安装文件，按照自己的需求去下载，我下载的是`rubygems-2.4.1.tgz`，然后运行：

	cd rubygems-2.4.1.tgz目录
	tar -xzvf rubygems-2.4.1.tgz
	cd rubygems-2.4.1
	ruby setup.rb
	
到此，ruby和gem安装完成了，后面需要安装jekyll时，只要运行命令`gem install jekyll`即可。


## 三、 博客集成系统核心实现

1、jenkins任务创建，详情可以参考前面给出的网站。

* 新建一个jenkins任务，按如下设置，并确定！

![](/images/post/blogtest.png)

* 设置源码管理，第一个框中填仓库路径(远程仓库和本地仓库都可以)，如：`/home/git/blogtestgit`；第二个框填构建的分支，一般为`master`，可以直接填master也可以像下图所示填写：

![](/images/post/jkgit.png)

* 填写触发条件，此处为每天的12时和20时触发，

![](/images/post/blog-trigger.png)

* 编写构建步骤，

![](/images/post/blog-build.png)
	

2、最主要的就是通过`Execute shell`来实现博客系统的创建和发布：

	bash /home/spdev/tools/jenkins.shell.scripts/deployjekyll.sh $WORKSPACE
	
![](/images/post/blogtest.png)

在该`.sh`文件中的命令如下所示：

	jekyll_pid=$(ps aux | grep 'jekyll' | grep -v 'grep' | awk '{print $2}')

	[ -z "$jekyll_pid" ] 

	if [ "$(echo $?)" == "1" ] ; then
	    echo "-------------------------------------"
    	kill -9 $jekyll_pid
	    echo "-- Log: -- Kill Previous Jekyll Serve successfully! --"
    	echo "-------------------------------------"
	fi
	
	BUILD_ID=dontKillMe /usr/bin/jekyll serve --detach &

	if [ "$(echo $?)" != "0" ] ; then
    	echo "-------------------------------------"
	    echo "-- Log: -- An Exception Has Happened In The Source ! --"
	    echo "-------------------------------------"
	    exit 1
	else
		echo "-------------------------------------"
		echo "-- Log: -- Update The Blogways ! --"
		echo "-------------------------------------"
		exit 0
	fi
	exit 0

1、首先，判断包含`jekyll`的进程( 即博客的发布经常 )是否存在，若存在则结束此进程；

2、然后，运行`jekyll serve --detach`，生成新的博客文件，并发布到`4000`端口，如果是在服务器上运行，那么就能在相应的端口访问博客，如`http://192.168.11.34:4000/`或`http://localhost:4000/`；

3、最后，监听上条语句，即`jekyll serve --detach`执行成功与否，若执行成功，则说明此处生成并发布新博客成功，以`exit 0`正常退出，告诉jenkins此次构建成功；否则说明生成或发布失败，以`exit 1`异常退出，告诉jenkins此次构建失败。

## 四、 Java源码编译测试集成系统

java源码的编译、测试及发布等，都是通过maven来实现的，因此需要maven环境，关于maven的使用可以参考：

	http://www.blogways.net/blog/2013/04/23/maven.html

jenkins提供了maven插件，一般都是默认安装的，java源码开发的集成系统的核心实现跟博客稍有区别，它及可以通过`Execute shell`来实现，也可以通过jenkins的maven插件来实现。

1、***Execute shell***

如果没有特殊的要求，一条语句就能完成：

	mvn install
	
如下图所示，图示显示的设置等同于`mvn package`：

![](/images/post/maven-package.png)
	
运行该命令后，会自动的完成编译、测试、打包、安装(安装到本地mavne库)等操作，如有任何一个阶段运行失败，就会结束运行，并告诉jenkins运行失败，jenkins会处理信息，按照设置的邮箱发送给最近代码提交者，代码有BUG。


2、***maven插件***

只需要在`配置 -> Build -> Goals and options`项中，添加`install`即可完成跟`Execute shell`相同的功能。

	bash /home/spdev/tools/jenkins.shell.scripts/mavenjava.sh $WORKSPACE
