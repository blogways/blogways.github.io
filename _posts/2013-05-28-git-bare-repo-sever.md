---
layout: post
category: 杂记
title: 在服务器上创建 git 裸仓库
tags: ['git', '裸仓库']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: 介绍如何在服务器上创建 git 裸仓库

---

git裸仓库，就是指没有工作目录的仓库。简单点说，裸仓库就是你工作目录下面的 `.git` 子目录里面的内容。

远程仓库，一般不需要工作目录，所以通常都是裸仓库。

如何在服务器上创建裸仓库？很简单，跟我来！

如果你还没有代码，直接在服务器上创建裸仓库很简单，一个命令就够了：

	$ git init --bare
	
	
但是如果在本机，你已经有了一些代码，如何把这些代码部署到服务器上，并且仅仅部署成一个裸仓库呢？其实，也很简单，因为我们了解了 git 裸仓库实际上就是你工作目录下的 `.git` 子目录的内容，拷过去就行了。

所以，下面有两个思路，都可以实现：

###思路一：在本机生成裸仓库，把裸仓库部署到服务器上

具体步骤：

1. 本机生成裸仓库

	    $ git clone --bare my_project my_project.git

	    $ cp -Rf my_project/.git my_project.git
	
	上面两个命令结果一样，都可以根据现有的仓库生成一个裸仓库。按喜欢选择一个即可。
	
2. 部署到服务器上

	可以用工具部署到远程服务器上，也可以用命令，命令如下：
	
		$ scp -r my_project.git user@git.example.com:/opt/git

3. 大功告成了
	
	可以测试一下，获取远程服务器上的版本

		$ git clone user@git.example.com:/opt/git/my_project.git



###思路二：把本机的`.git`目录部署到服务器上，然后改成裸仓库

1. 将`.git`目录部署到服务器上

	可以用工具部署到远程服务器上，也可以用命令，命令如下：
	
		$ scp -r my_project/.git user@git.example.com:/opt/git

2. 将服务器`.git`目录改成裸仓库

	在服务器上执行命令：
	
		cd /opt/git
		mv .git my_project.git
	
3. 大功告成了
	
	可以测试一下，获取远程服务器上的版本

		$ git clone user@git.example.com:/opt/git/my_project.git

###注意：

裸仓库创建后，如果需要支持其他人`push`数据，需要修改裸仓库下配置文件`config`,添加如下内容：

	[receive]
        denyCurrentBranch = ignore


否则，可能会遇到在客户端不被允许向裸仓库`push`数据。