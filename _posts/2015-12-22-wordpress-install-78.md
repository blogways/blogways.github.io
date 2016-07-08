---
layout: post
category: WordPress
title: 公司主机装载apache+PHP+phpmyadmin+wordpress
tags: ['WordPress', '安装', '公司主机']
author: 陈凡
email: chenfan@asiainfo.com
description: 公司主机虽然也是基于linux系统，但是没有联网下载功能，只能通过下载好的安装包，公司主机中安装wordpress
---
# wordpress 公司主机安装教程

<div class="code fl">
    <dl>
    <dt>目录</dt>
    <dd>
    <ol>
        <li><a href="#1">介绍</a></li>
        <li><a href="#2">安装前准备</a></li>
        <li><a href="#3">配置变量环境</a></li>
        <li><a href="#4">安装Apache</a></li>
        <li><a href="#5">安装MySql</a></li>
        <li><a href="#6">安装PHP</a></li>
        <li><a href="#7">安装phpMyAdmin</a></li>
        <li><a href="#8">安装WordPress</a></li>
    </ol>
    </dd>
    </dl>
</div>

## 一.<a name="1"></a> 介绍

　　WordPress是一个注重美学、易用性和网络标准的个人信息发布平台。WordPress虽为免费的开源软件，但其价值无法用金钱来衡量。当前WordPress插件数据库中有超过18000个插件，包括SEO、控件等等。个人可以根据它的核心程序提供的规则自己开发模板和插件。这些插件可以快速地把你的博客改变成cms、forums、门户等各种类型的站点。

## 二. <a name="2"></a>安装前准备

Apache版本：

- httpd-2.4.17.tar.gz

Mysql 版本：

- mysql-5.0.41.tar.gz

Php版本：

- php-7.0.0.tar.gz

库文件准备：

- autoconf-2.61.tar.gz
- freetype-2.3.5.tar.gz
- gd-2.1.1.tar.gz<br>
- jpegsrc.v6b.tar.gz
- libmcrypt-2.5.8.tar.gz
- libpng-1.2.31.tar.gz
- libxml2-2.6.30.tar.gz
- zlib-1.2.3.tar.gz
- phpMyAdmin-4.5.2-rc1-all-languages.tar.gz

## 三. <a name="3"></a>配置变量环境

### 1. 安装libxml2

	$cd /usr/local/src/libxml2-2.6.30
	$./configure --prefix=/usr/local/libxml2
	$make && make install

### 2. 安装libmcrypt

	$cd /usr/local/src/libmcrypt-2.5.8
	$./configure --prefix=/usr/local/libmcrypt
	$make && make install

### 3. 安装zlib

	$cd /usr/local/src/zlib-1.2.3
	$./configure
	$make && make install

### 4. 安装libpng

	$cd /usr/local/src/libpng-1.2.31
	$./configure --prefix=/usr/local/libpng
	$make && make install

### 5. 安装jpeg6

	$mkdir /usr/local/jpeg6
	$mkdir /usr/local/jpeg6/bin
	$mkdir /usr/local/jpeg6/lib
	$mkdir /usr/local/jpeg6/include
	$mkdir -p /usr/local/jpeg6/man/ma

>这个软件包安装有些特殊，其它软件包安装时如果目录不存在，会自动创建，但这个软件包安装时需要手动创建。

	$cd /usr/local/src/jpeg-6b
	$./configure --prefix=/usr/local/jpeg6/ --enable-shared --enable-static
	$make && make install

### 6. 安装freetype

	$cd /usr/local/src/freetype-2.3.5
	$./configure --prefix=/usr/local/freetype
	$make
	$make install

### 7. 安装autoconf

	$cd /usr/local/src/autoconf-2.61
	$./configure
	$make && make install

### 8. 安装GD库

	$cd /usr/local/src/gd-2.1.1
	$./configure \
	--prefix=/usr/local/gd2/ \
	--enable-m4_pattern_allow \
	--with-zlib=/usr/local/zlib/ \
	--with-jpeg=/usr/local/jpeg6/ \
	--with-png=/usr/local/libpng/ \
	--with-freetype=/usr/local/freetype/
	$make
    $make install

**1)**　执行 make 报错：

	make[2]: *** [gd_png.lo] Error 1  
	make[2]: Leaving directory /usr/local/src/gd-2.1.1  
	make[1]: *** [all-recursive] Error 1  
	make[1]: Leaving directory /usr/local/src/gd-2.1.1'  
	make: *** [all] Error 2  

**分析**：这个问题是由于 gd 库中的 gd_png.c 源文件包含 png.h 时，png.h 没有找到导致的。

**解决**：在编译文件里 `vi gd_png.c` 将 `include "png.h"` 改成 `include "/usr/local/libpng/include/png.h"`

**2)**　出现

	X--tag=CC: command not found

**解决**：修改 aclocal.m4 文件，将上面的 `LIBTOOL＝'$(SHELL) $(top _builddir)/libtool'` 改成 `LIBTOOL='$(SHELL)  /usr/bin/libtool' `后重新执行 `./configure`

**3)**　Invalid libtool wrapper script when make installing Apache

**解决**：

	make clean
	--with-pcre=/usr/local/pcre

## <a name="4"></a>四. 安装Apache

	$cd /usr/local/src/httpd-2.2.9
	$./configure \
	--prefix=/usr/local/apache2 \
	--sysconfdir=/etc/httpd \
	--with-z=/usr/local/zlib \
	--with-included-apr \
	--with-apr=/usr/local/apr \
	--with-apr-util=/usr/local/apr-util /
	--with-pcre=/usr/local/pcre \
	--enable-so \
	--enable-deflate=shared \
	--enable-expires=shared \
	--enable-rewrite=shared \
	$make && make install

**1)**　执行 configure 出错：

	configure: error: Bundled APR requested but not found at ./srclib/.
	Download and unpack the corresponding apr and apr-util packages to ./srclib/.

**解决**： 下载 api 和 api-util 安装到 apache 的 ./srclib/ 目录.

**2)**　`./configure` 命令后在执行 make 命令的时候报如下错误：

	/usr/bin/ld: /usr/local/lib/libz.a(crc32.o): relocation RX86\_64\_32 against `.rodata' can not be used when making a shared object; recompile with -fPIC  
**解决**：下载 zlib-1.2.3.tar.gz 放在 /usr/local 目录执行以下命令：

	tar -zxvf zlib-1.2.3.tar.gz
	cd zlib-1.2.3
	./configure
	vi Makefile

找到 `CFLAGS=-O3 -DUSE\_MMAP`
在后面加入-fPIC，即变成 `CFLAGS=-O3 -DUSE\_MAP -fPIC`   

---
**启动Apache**

/usr/local/apache2/bin/apachectl start  

**关闭Apache**  

/usr/local/apache2/bin/apachectl stop

**查看80端口是否开启**  

netstat -tnl|grep 80  

---
**配置Apache**  

>标红部分为需要需改的地方

<font color=#DC143C>ServerRoot "/usr/local/apache2"</font>  
>你的apache软件安装的位置。其它指定的目录如果没有指定绝对路径，则目录是相对于该目录。

PidFile logs/httpd.pid
>第一个httpd进程(所有其他进程的父进程)的进程号文件位置。

Listen 80
>服务器监听的端口号。

<font color=#DC143C>ServerName 10.20.16.78:80</font><br>
>主站点名称（网站的主机名）。

ServerAdmin admin@clusting.com
>管理员的邮件地址。

DocumentRoot "/data/spdev/chenfan"
>主站点的网页存储位置。

	# 变更路径
	<Directory "/data/spdev/chenfan ">
		Options FollowSymLinks
		AllowOverride None
		Order allow,deny
		#修改权限
		Allow from all
	</Directory>


## <a name="5"></a>五. 安装Mysql

### 1. 添加一个mysql标准组
	$groupadd mysql

### 2. 添加mysql用户并加到mysql组中
	&useradd -g mysql mysql
	&cd /usr/local/src/mysql-5.0.41
	&./configure \
	--prefix=/usr/local/mysql/ \
	--with-extra-charsets=all

## <a name="6"></a>六. 安装PHP
	$./configure \
	--prefix=/usr/local/php \
	--with-config-file-path=/usr/local/php/etc \
	--with-apxs2=/usr/local/apache2/bin/apxs \
	--with-mysql=/usr/local/mysql/mysql-cluster-gpl-7.2.8-linux2.6-x86_64/ \
	--with-libxml-dir=/usr/local/libxml2/ \
	--with-png-dir=/usr/local/libpng/ \
	--with-jpeg-dir=/usr/local/jpeg6/ \
	--with-freetype-dir=/usr/local/freetype/ \
	-with-gd=/usr/local/gd2/ \
	--with-zlib-dir=/usr/local/zlib/ \
	--with-mcrypt=/usr/local/libmcrypt/ \
	--with-mysqli=/usr/local/mysql/mysql-cluster-gpl-7.2.8-linux2.6-x86_64/bin/mysql_config \
	--enable-soap \
	--enable-mbstring=all \
	--enable-sockets

**配置PHP**

	cp /usr/local/src/php-5.3.16/php.ini-development  /usr/local/php/lib/php.ini

编辑 apache 配置文件  

	$vi /etc/httpd/httpd.conf

添加这一条代码

	Addtype application/x-httpd-php .php .phtml

**测试**

在 apache 的 htdocs 下建立一个 php 文件 test.php，里面的内容如下：

	<?php  
		phpinfo();  
	?>

然后在浏览器里输入 [http://10.20.16.78/test.php](http://10.20.16.78/test.php)，出现 php 信息则为安装正确。

## <a name="7"></a>七. 装载phpmyadmin

	$tar -zxvf phpMyAdmin-7.0.0-all-languages.tar.gz
>此时路径 /data/spdev/chenfan/phpMyAdmin-7.0.0-all-languages.tar.gz

**配置phpmyadmin**

1. 重启apache 找到 /libraries/config.default.php文件(config.default.php复制到phpmyadmin目录下，然后更名为config.inc.php)，在linux下直接用vi编辑.
2. 查找 `$cfg['PmaAbsoluteUri']` 修改为你将上传到空间的phpMyAdmin的网址
如：`$cfg['PmaAbsoluteUri'] = 'http://10.20.16.78/admin/';`
3. 查找 `$cfg['Servers'][$i]['host'] = '10.20.16.78';`（通常用默认，也有例外，可以不用修改）
4. 查找 ` $cfg['Servers'][$i]['auth_type'] = 'config';`
在自己的机子里调试用config；如果在网络上的空间用cookie，这里我们既然在前面已经添加了网址，就修改成cookie ，这里建议使用cookie.\
5. 查找 `$cfg['Servers'][$i]['user'] = 'root';` // MySQL user（mysql用户名，自己机里用root；）
6. 查找 `$cfg['Servers'][$i]['password'] = '123456'; `// MySQL password (mysql用户的密码,自己的服务器一般都是mysql用户root的密码)
7. 查找 ` $cfg['Servers'][$i]['only_db'] = '';` // If set to a db-name, only（你只有一个数据就设置一下；如果你在本机或想架设服务器，那么建议留空）
8. 查找 ` $cfg['DefaultLang'] = 'zh'; `（这里是选择语言，zh代表简体中文的意思,这里不知道填gbk对否）
9. 设置完毕后保存

---  
**出现错误**：数据库连接错误

**原因**：绝对路径没有配置对

**解决**：修改 `$cfg['PmaAbsoluteUri'] = 'http://10.20.16.78/phpmyadmin/';`

## <a name="8"></a>八.装载wordpress

解压 wordpress

	$tar -zxvf wordpress-4.3.1-zh_CN.tar.gz

修改配置文件

	$cp wp-config-sample.php wp-config.php
	$vi wp-config.php

define('DB_NAME', 'wordpress');
>数据库

define('DB_USER', 'root');
>数据库名称

define('DB_PASSWORD', '****');
>数据库密码

---
**出现错误**：装载 php 时错误找不到 mysql\_config

**原因**：指定的路径出错

**解决办法**：找到 `mysql\_config` 改成 `with-mysqli=/usr/local/mysql/mysql-cluster-gpl-7.2.8-linux2.6-x86\_64/bin/mysql_config \`
