---
layout: post
category: drupal
title: Drupal安装教程
tags: ['drupal']
author: 陈凡
email: chenfan@asiainfo.com
description: Drupal是全球著名的网站程序之一，也是非常受欢迎的网站程序之一，但国内使用的人数不多。在此介绍安装Drupal程序，用图文记录下了Drupal的详细安装过程步骤，希望对网站新手或Drupal新手有帮助。
---

# Drupal安装教程

## 一.下载drupal

访问Drupal官方网站下载Drupal程序（http://drupal.org/download），同时把下载到的压缩包进行解压并上传到空间根目录，在浏览器中输入网站域名，将会自动进入Drupal的安装界面。

## 二.新建数据库

打开phpmyadmin，点击新建数据库，名字为drupal

 ![shujuku](\images\post\shujuku.jpg)

## 三.选择安装类型

如图，标准Standard和迷你Minimal，区别是安装系统模块的多少，如果只是普通文章应用选择Minimal即可，此处选择标准型，然后点击Save and continue进入下一步。

 ![shujuku](\images\post\profile.jpg)

## 四.选择程序的语言，

默认即提供英文版，如需其它语言，点击“Learn how to install Drupal in other languages”进入新界面

 ![shujuku](\images\post\yuyan.jpg)

>如需要安装中文可以下载根据说明下载，并将下载的文件放到/profiles/standard/translations/中即可

 ![shujuku](\images\post\zhongwen.jpg)

## 五.安装需求

选择语言后，点击确定，会出现下图需求问题

![xuqiu](\images\post\requirement.jpg)

首先目录sites/default/files 不存在，则需要在该目录下建立该文件夹。

进入sites/default，输入：

	$mkdir files

并将该文件权限设置为可写

	$sudo chmod -R 777 files

然后复制 ./sites/default/default.settings.php 文件到./sites/default/settings.php

	$cp default.settings.php settings.php

并将其设置成可写

	$sudo chmod 777 settings.php

## 六.设置数据库

设置数据库信息，根据提示设置MYSQL或sqlite数据库的用户名、数据库名和密码。Localhost一般保持默认即可，数据库端口和表前缀没有强制要求，如果同一数据库下安装多个Drupal，要设置表前缀。

![mysql1](\images\post\mysql1.jpg)

![mysql2](\images\post\mysql2.jpg)

进入下一步，系统会自动安装Drupal相关模块，等待安装完成

## 七.设置站点信息

根据自己的需要自主设置

![site](\images\post\site.jpg)

## 八.安装完成

drupal安装完成后会出现如下界面

![Drupal_Complete](\images\post\site.jpg)

## 九.常见问题

1.在安装数据库时，没有mysql选项

原因：在没有php没有打开mysql扩展

解决办法：进入php的安装目录

	cd /usr/local/bin/phpize
	./configure --with-php-config=/usr/local/bin/php-config --with-mysql=/usr/local/mysql/
	make
	make install

>在`mysql/modules`下会看到mysql.so

修改php.ini

将`extensions = "mysql.so"`前的分号去掉，打开mysql扩展

将mysql.so拷贝到extension_dir目录下，extension_dir在php.ini中设置

重启apache即可

	apacheclt restart