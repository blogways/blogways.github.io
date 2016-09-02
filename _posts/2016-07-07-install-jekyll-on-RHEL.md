---
layout: post
category: Jekyll
title: RHEL5.5下安装jekyll
tags: ['jekyll', '部署', 'RHEL']
author: 徐万年
email: xuwn@asiainfo.com
#image:
description: 在VMware虚拟机RHEL5.5上安装jekyll。
---

### 一、概述
[jekyll] 是一款简单的博客系统，静态网站生成器。她有一个模版目录，存放整个静态网站的模版文件，可以通过[Liquid]处理模版文件，把使用标记语言[Textile]或[Markdown]编写的内容文件，按照模版格式，转换成最终的静态网站页面。大名鼎鼎的GitHub Pages就是通过她实现的。废话少说了，经过好几天的弯路，终于明白之前安装不上是因为公司RHEL系统的问题。感谢公司同事及时的帮助，让我少走很多的弯路。

### 二、安装步骤
注：以上安装请以root用户操作。

1、安装：ruby-2.3.1
	
	1.1、下载ruby-2.3.1源代码
	1.2、./configure --prefix=/usr/local/ruby
	1.3、make
	1.4、make install
	1.5、设置ruby环境变量
	
2、生成key

	2.1、gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3

3、安装稳定版RVM

	3.1、curl -L -k https://raw.githubusercontent.com/wayneeseguin/rvm/master/binscripts/rvm-installer | bash -s stable

4、删除源
	
	4.1、gem sources --remove https://rubygems.org/

5、添加国内镜像源

	5.1、gem sources -a http://ruby.sdutlinux.org/

6、安装nodejs，并设置nodejs的环境变量

	6.1、NODEJS_HOME=安装路径
	6.2、PATH=$PATH:$NODEJS_HOME/bin
	

   
### 三、检查RHEL5.5安装jekyll是否成功
	
	jekyll -v
	如果打印出版本信息，则表示安装成功。

### 四、jekyll操作

	3.1、获取源码，并运行jekyll，命令如下:

		cd ~
		mkdir webroot
		cd webroot
		git clone https://github.com/mojombo/tpw.git
		cd tpw
		jekyll --server

	3.2、在浏览器访问`localhost:4000`，显示博客列表。

### 五、其它

	4.1、安装ruby时无需安装openssl；
	4.2、使用jekyll生成的表态HTML文件，在运行：jekyll --server后只能在本机访问，如果需要通过http://ip:4000来访问，请使用nginx或tomcat。

