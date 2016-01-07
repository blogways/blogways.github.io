---
layout: post
category: joomla
title: lamp下安装joomla和joomla模板
tags: ['joomla']
author: 王栋
#image: /images/xxx.jpg
email: wangdong3@asiainfo.com
description: lamp环境下安装joomla，又一个内容管理系统
---
	   
## 一、joomla简介
joomla是一个内容管理系统，Joomla是使用PHP语言加上MySQL数据库所开发的软件系统，可以在Linux、 Windows、MacOSX等各种不同的平台上执行。
## 二、joomla安装环境
lamp环境，先前安装wordpress时已经在主机上搭建好。
## 三、安装joomla
### 1.下载安装包
进入官网下载[https://www.joomla.org/download.html](https://www.joomla.org/download.html)

安装包Joomla_3.4.8-Stable-Full_Package.zip
### 2.解压，并上传到指定根目录
`sudo scp -r joomla/ spdev@10.20.16.79:/var/www/html`
### 3.建立数据库
在安装之前最好先建立一个数据库，在安装网站时会用到。
	   
建库地址：[10.20.16.79/phpmyadmin/](10.20.16.79/phpmyadmin/)
### 4.进入安装
安装地址：[10.20.16.79/joomla/](10.20.16.79/joomla/)
	 
进入安装界面开始安装:

**(1) 第一步是基本配置**

选择语言，输入网站的名称，管理员的邮箱，用户名和密码，然后点击下一步。

**(2) 第二步是配置网站的数据库**

数据库类型是默认的MySQLi，数据库的主机名：localhost，数据库的用户名：root，数据库名：joomla（提前用phpmyadmin为Joomla创建一个数据库）。Joomla会随机自动我们添加一个数据表前缀。

**注意：**

旧数据库的处理这里，如果你现在使用的数据库里以前安装过Joomla，并且你正在安装的Joomla与之前的Joomla的数据表前缀是一样的。那么这里的设置可能影响到之前安装的Joomla的数据库。选择备份或者删除以前的数据表。设置好以后点击下一步。

**(3) ftp设置**

可以跳过，点下一步。

**(4) 第四步安装选择**

选择安装示范数据的类型。

**(5) 检查配置**


预览安装之前填入的一些信息，另外还有服务器环境的相关的配置，如果有某些配置不符合Joomla的要求，需要修改服务器的配置。

**(6) 点击安装**
			   
安装成功会提示删除installation目录，需手动删除。
 同时安装成功也会显示警告：在创建配置文件的过程中发生错误，根据警告提示要在网站根目录下创建configuration.php文件，代码在警告下的代码框中可供复制。
			    
测试安装成果：[10.20.16.79/joomla](10.20.16.79/joomla)

后台的地址：[10.20.16.79/joomla/administrator/](10.20.16.79/joomla/administrator/)

## 四、安装joomla模板
### 1.快速安装

从weidea.net网站上下载的joomla模板都会提供快速安装包。只需把安装包解压到`/var/www/html`目录，安装过程和安装joomla是一样的。
	  
**要特别注意的是:**


对于网站的根目录，文件或者是文件夹的拥有者不能是root和用户组不能是root，如果网站的根目录和根目录下面的文件和目录的拥有者是root的话，会导致不能网站正常的运行，出现500服务器错误。

进入网站的根目录，输入`chmod -R 775 html`，网站方可正常运行。
### 2.登录joomla后台安装

(1) 主菜单下点击Extensions，在下拉列表中点击manage，会看到`Upload & Install Joomla Extension`这里提供了一个入口可以上传joomla主题模板包。


(2)如果下载下来的joomla模板文件里有框架包，则必须在上传主题前先上传框架包，框架是主题能得以应用的前提。

(3) 在同样的入口，上传插件包。这些插件使得主题某些特效能显示的关键。

**个人体会：**以上两种安装joomla模板的方法，推荐用第一种方法，比较靠谱。

