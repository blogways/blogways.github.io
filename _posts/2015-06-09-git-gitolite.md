---                   
layout: post
category: 杂记
title:  git权限管理工具gitolite使用教程
tags: ['git', 'gitolite']
author: 汤仕忠
email: tangsz@asiainfo.com
#image:
description: 本章将通过实例方式介绍如何使用gitolite对git仓库进行权限管理.
---

###一、gitolite实现功能

1.通过远程连接能够对服务器上仓库进行读写操作；

2.安全的权限管理，控制特定用户只能访问仓库，并能限制读写权限;

3.权限控制不只作用于仓库，而同样于仓库中的每个branch和tag name。


###二、gitolite安装
Gitolite 是一款 Perl 语言开发的 Git 服务管理工具，通过公钥对用户进行认证，并能够通过配置文件对写操作进行基于分支和路径的的精细授权。Gitolite 采用的是 SSH 协议并且使用 SSH 公钥认证，以下为安装前提条件：
	
		UNIX/LINUX操作系统
		shell环境
		git 1.6.6+
		perl 5.8.8+
		openssh 5.0+（好像低于这个版本也行）
		gitolite使用的账号（本文用的git）

1. 以git账号登入主机；
2. 确保~/.ssh/authorized_keys为空或不存在；
3. 主机上执行git clone  https://github.com/sitaramc/gitolite.git（不能上网可上传实现）；
4. mkdir -p /home/git/bin
5. ./gitolite/install -to /home/git/bin/
6. 选择一台机器作为client机器（我这里就选择本机），并将这台客户端机器的公钥上传并保存在主机的/home/git/YourName.pub（我这里用的我本机的，起名tangsz.pub）位置
7. ~/bin/gitolite setup -pk ~/YourName.pub
8.测试安装是否成功

   本机(windows要到git Bash下执行)执行ssh git@10.20.16.78显示如下：

		 hello git, this is git@slave2 running gitolite3 v3.6.3-10-g4be7ac5-dt on git 1.8.1.6
 
		 R W    gitolite-admin
		 R W    testing

注：安装过程中可能出现的错误：

1. /gitolite/install: /usr/bin/perl^M: bad interpreter: No such file or directory

		解决:install 文件转unix格式
2. git describe failed; cannot deduce version number   
 
		解决：由于主机不能上网，我是把文件copy到主机，然后建立仓库的，这样不行，可以把本地下载的带.git目录的文件直接上传主机。

3. WARNING: Can't exec "/data/git/bin/triggers/post-compile/ssh-authkeys": No such file or directory at /data/git/bin/lib/Gitolite/Common.pm line 146, <DATA> line 1.
		 
		解决：dos2unix /data/git/bin/triggers/post-compile/*
4. ssh git@10.20.16.78 报错：WARNING: Can't exec "/data/git/sbin/commands/info": No such file or directory 

		解决：dos2unix /data/git/sbin/commands/info

	

###三、gitolite添加用户和仓库
1. clone 管理仓库gitolite-admin（我本机操作）：
	
    - git clone git@server-host:gitolite-admin （如：git clone git@10.20.16.78:gitolite-admin.git）
    
	- gitolite-admin有conf和keydir两个子文件夹，keydir文件夹就是管理用户公钥的地方，如果有一位新用户（spdoop）希望申请账户并申请一个新的代码仓库（代码仓库叫做test），那么让他提供他的账号、他用的电脑的公钥给git管理员（可以通过email/qq等方式），然后由git管理员在keydir下创建spdoop.pub文件并将公钥内容复制其中。
   
	 - conf/gitolite.conf设置权限文件：
    
    		repo test
     			RW+ = spdoop

    - 添加完配置后将本地仓库修改push到服务器仓库，服务会自动创建仓库test（当然这里也可以自己先到主机上建仓库，gitolite管理的仓库都在用户目录repositories下，也可修改配置），spdoop具有读写权限。
    

    - 如果想添加spdoop为管理员，需管理员tangsz修改gitolite.conf
    
    		repo gitolite-admin
    			RW+     =   git tangsz 
    
注：push过程中可能出现的错误：

	1. error: cannot run hooks/update: No such file or directory
		 
		解决： 此问题我是在windows机器传gitolite源码到linux机器上安装出现的，linux、mac不知道会不会出现，找了好久才发现要将update、post-update等文件dos2unix。

###四、gitolite配置实例

这里对gitolite详细的权限配置就不做说明，通过一个简单的实例介绍下gitolite的使用：

1. 添加新的仓库pangu-la-web，管理员tangsz具有读写、强制push操作权限：


    - 修改gitolite.conf
     
      		repo pangu-la-web
    			RW+     =   tangsz

    - 提交本地仓库并push到服务器

    - 查看主仓库已经建立空仓库pangu-la-web
   
    - 本机clone下pangu-la-web仓库（git clone git@10.20.16.78:pangu-la-web）
    
    - 添加文件test，push到服务器仓库master分支
    

2. 用户spdoop添加pangu-la-web中dev开头的分支有读/写/强制更新的权限，test分支（严格匹配）具有读/写权限
	
	- 修改gitolite.conf
	
			repo pangu-la-web
			    RW+     =   tangsz
			    RW+     dev       =   spdoop
			    RW      test$     =   spdoop
    
		
	- 提交并push到服务器仓库
	
	- spdoop clone pangu-la-web仓库到本地，修改test，执行git push origin master后错误如下（没有权限提交master）：
	
			remote: FATAL: W refs/heads/master pangu-la-web spdoop DENIED by fallthru

	- spdoop新建分支dev1（git branch dev1） checkout到dev1分支（git checkout dev1），执行git push origin dev1成功
	
	- spdoop新建分支test（git branch test） checkout到test分支（git checkout test），执行git push origin test成功


	
3. 	这里用户spdev试图clone仓库pangu-la-web（git clone git@10.20.16.78:pangu-la-web），出现错误如下：

			fatal: 'pangu-la-web' does not appear to be a git repository
			fatal: Could not read from remote repository.	


###五、外部人员参与现有项目开发条件

	
1. 保证本机电脑安装了git，windows下安装的是msysgit（windows安装后会生成git Bash命令窗口）；

2. 命令窗口下生成用户公钥（windows下安装msysgit后在git Bash下生成），命令为：ssh-keygen，生成后在用户目录.ssh 下，文件名为id_rsa.pub；

3. 向项目仓库管理员申请操作某项目权限，将id_rsa.pub文件发给管理员，如开发员tom需要开发项目pangu-la-web，则需要邮件或qq等方式将id_rsa.pub发给管理员tangsz，并申明需要有pangu-la-web项目开发权限；

4. 管理员会根据tom的权限为其赋予pangu-la-web项目特定权限（如只能新建dev开头的分支进行开发，不允许tom操作master分支），然后通过tom可以进行clone代码开发了；

5. tom接到通知后clone下pangu-la-web代码及可以进行开发了，clone命名为：git clone git@10.20.16.78:pangu-la-web  （windows下在git Bash 窗口执行）；

6. tom clone完代码后可以自己新建个分支如dev-tom（git branch dev-tom）进行开发，然后git checkout dev-tom，待功能开发完后push到dev-tom分支（git push origin dev-tom)

7. tom 在分支dev-tom上开发完后就可以通知管理员tom的功能点已经开发完了，申请合并到master分支；

8. 管理员接到tom通知后做合并处理。