---
layout: post
category: drupal
title: 在Drupal上部署主题
tags: ['drupal', '部署', '主题']
author: 陈凡
email: chenfan@asiainfo.com
description: 该篇日志介绍了三种在drupal部署主题的方式
---

# 在Drupal上部署主题

## 一.简单粗暴法（profile文件）

以Avira主题为例

#### 1.系统需求

* Drupal 7

* 主题文件：avira_install_profile.zip	

* Web server：Apache，Nginx

* PHP 5.2.5 or higher

* MySQL 5.0.15 or higher

#### 2.主题安装

将主题文件解压到服务器目录下，用浏览器打开该目录，接下来的步骤和安装drupal的步骤类似，可根据视频所示安装即可。

<iframe width="560" height="315" src="https://www.youtube.com/embed/I9sScpIcO7E" frameborder="0" allowfullscreen></iframe>

>该视屏在youtobe上，可能需要翻墙观看

## 二.修改数据库法

1. 进入phpmyadmin，新建数据库，当然也可以使用命令新建数据库。

		mysql -u root -p
		create database Ariva;

2. 进入该数据库，将主题的数据库文件导入数据库。

		use Ariva;
		source /data/spdev/chenfan/Ariva/Ariva.sql;

3. 然后把主题包解压放到服务器目录下，修改主题配置文件。主题配置文件在主题目录/sites/default/setting.php,并且修改该文件。然后用浏览器打开该主题目录即可


		sudo vi /data/spdev/chenfan/Ariva/sites/default/settings.php

　　修改下图部分:

![database](\images\post\database.jpg)

## 三.在已有drupal中安装主题

1. 下载主题文件

2. 使用FTP工具将其放在drupal的`sites/all/themes/`目录下

3. 打开drupal admin toolbar，点击 Appearance，找到导入的主题

4. 然后点击主题下的Enable and set default，设置成默认主题

5. 点击Theme settings，可以设置一些主题的基本操作

## 四.在已有的drupal中部署主题

在三中安装后的主题，是没有任何内容，这时我们需要加载一些模块来充实内容，使用这种方式也可以比较自由的设计自己心目当中想要的模块

因为这里的内容较多，我只对常用的几大模块做些介绍

#### 1.slider（幻灯片模块）

在[drupal官网](http://your-site.com/admin/modules)下载 jquery_update、imce、Layer slider，并将其解压放到`sites/all/modules/`中

打开 drupal admin toolbar ，点击Modules，使下载的模块enable

然后在drupal admin toolbar 中会显示layer slider，点击设计幻灯片

在Home » Administration » Structure 中将该幻灯片放在你想放的位置，一般我们作为首页展示，会放在主页位置

如下图所示

![slider](\images\post\slider.jpg)

便可以在主页前端看到出现该幻灯片

#### 2.菜单栏

在[drupal官网](http://your-site.com/admin/modules)下载 Superfish 模块在设计菜单栏，并将其解压放到`sites/all/modules/`中

打开 drupal admin toolbar ，点击Modules，使下载的模块enable

在Home » Administration » Structure 中，有 "Superfish 1 (Superfish)"  点击"Configure"

* 在模块 title field 输入 : <none>

* 在模块 description 输入: Main menu

* 在 Region settings -> Nevia 选择 "Main menu"

* 拉到底部点击"save block"

#### 3.主页模块

打开 drupal admin toolbar ，点击Content，然后add content，选择Basic page在这里你可以添加自己的页面，然后在settings里连接到想到链接的页面

#### 4.blog

在[drupal官网](http://your-site.com/admin/modules)下载 blog page 模块在设计菜单栏，并将其解压放到`sites/all/modules/`中

打开 drupal admin toolbar ，点击Modules，使下载的模块enable

然后点击Content ，add content选择blog，该模块可以添加标签等功能

