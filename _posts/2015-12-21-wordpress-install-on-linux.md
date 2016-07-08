---
layout: post
category: WordPress
title: linux下搭建属于自己的博客
tags: ['WordPress', '部署', 'linux']
author: 陈凡
email: chenfan@asiainfo.com

description: WordPress 是一种使用 PHP语言和 MySQL数据库开发的开源、免费的Blog（博客，网志）引擎，用户可以在支持 PHP 和 MySQL 数据库的服务器上建立自己的 Blog。WordPress 是一个功能非常强大的博客系统，插件众多，易于扩充功能。安装和使用都非常方便。目前 WordPress 已经成为主流的 Blog 搭建平台。
---
# linux下安装Wordpress

<div class="code fl">
    <dl>
    <dt>目录</dt>
    <dd>
    <ol>
        <li><a href="#1">安装Apache</a></li>
        <li><a href="#2">安装PHP服务</a></li>
        <li><a href="#3">安装mysql</a></li>
        <li><a href="#4">安装phpMyAdmin</a></li>
        <li><a href="#5">安装Wordpress</a></li>
        <li><a href="#6">常见错误</a></li>
    </ol>
    </dd>
    </dl>
</div>
## 一.<a name="1"></a>安装Apache服务器
在linux终端输入<br>

    sudo apt-get install apache2
**测试**：安装后在浏览器中打开：http://localhost/或者http://127.0.0.1,如果出现It works！则说明安装成功。

## 二.<a name="2"></a>安装PHP服务
在linux终端输入

    sudo apt-get install php5
**测试**：打开sudo gedit /var/www/testphp.php<br>
  然后随意输入字符，这里我输入的是chenfan，在浏览器中输入localhost/testphp.php,如果浏览器出现chenfan则说明安装成功
## 三.<a name="3"></a>安装mysql
在linux终端输入

	sudo apt-get install mysql-server
	sudo apt-get install mysql-admin
	sudo apt-get install mysql-client
安装过程中提示要求输入root密码。  
## 四.<a name="4"></a>安装phpMyAdmin

	sudo apt-get install phpmyadmin
此时的phpmyadmin文件夹被安装在/usr/share/phpmyadmin下，为了能在浏览器中访问到phpmyadmin，需要在/var/www下做一个软连接到该文件夹：  
  进入/var/www文件夹，在该目录下执行如下操作:

	sudo ln -s /usr/share/phpmyadmin
安装完毕后别忘了重启apache 和 mysql:

    sudo /etc/init.d/apache2 restart
    sudo /etc/init.d/mysql restart
**测试**：在浏览器中输入localhost/phpmyadmin,如果出现  
 ![phpmyadmin](\images\post\phpmyadmin.jpg)  
则说明安装成功！
成功后点击新建数据库，建立一个wordpress数据库。
## 五.<a name="5"></a>安装Wordpress
### 1. 下载下载wordpress(WordPress)
下载地址：  
http://wordpress.org/download/
### 2.解压Wordpress
在linux终端输入

	$sudo tar -zxvf wordpress-3.2.1.tar.gz
得到wordpress文件夹，然后按要求编辑wp-config.php文件，主要是提供数据库的名字(如这里的wordpress)，用户名(如root)，密码(如安装mysql时键入的密码)。
### 3.将Wordpress文件夹拷贝到Apache服务器目录/var/www下
	sudo cp -a ./wordpress /var/www
安装完毕后重启apache 和 mysql:

    sudo /etc/init.d/apache2 restart
    sudo /etc/init.d/mysql restart
**测试**：此时在浏览器中访问http://localhost/wordpress/wp-admin/install.php就可以正常安装wordpress
## 六.<a name="6"></a>常见错误
### 1.php装好 输入在浏览器中打开：http://localhost/或者http://127.0.0.1出现：Not FoundThe requested URL /testphp.php was not found on this server.Apache/2.4.7 (Ubuntu) Server at 127.0.0.1 Port 80  
**原因：**apache的根目录里并不包含test.php文件  
**解决办法：**修改Apache配置文件
在/etc/apache2/sites-available中修改000-default.conf  
输入代码:

	sudo vi /etc/apache2/sites-available/000-default.conf
修改 DocumentRoot 修改成你想好存放的目录
