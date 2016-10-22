---
layout: post
title: 使用SourceTree进行gogs的操作
category: ['git']
tags: ['git', 'sourceTree']
author: 陈凡
email: chenfan@asiainfo.com
description: 使用SourceTree进行gogs的操作
---

|  |  *目 录* |
| --- | --- |
| 1 | [什么是sourceTree](#begin) |
| 2 | [如何安装sourceTree](#1st) |
| 3 | [如何在gogs上创建仓库](#2nd) |
| 4 | [如何克隆gogs上的工程](#3rd) |
| 5 | [如何在gogs仓库中添加目录和文件](#4ur) |
| 6 | [如何新增或修改文件，并提交到gogs上去](#end) |

<a id="begin"></a>

## 1.什么sourceTree

SourceTree 是 Windows 和Mac OS X 下免费的 Git 和 Hg 客户端，拥有可视化界面，容易上手操作。同时它也是Mercurial和Subversion版本控制系统工具。支持创建、提交、clone、push、pull 和merge等操作。

<a id="1st"></a>

## 2.如何安装sourceTree

（1） 点击连接[sourceTree](https://www.sourcetreeapp.com/)下载对应版本的sourceTree，官网里有Mac和win版本的，根据自己的电脑下载对应版本，下载之前确认电脑是否已经安装的git工具。

>若没有安装可以点击[git下载](https://git-scm.com/downloads)，进行安装。

（2）双击下载的.exe文件，可以看到下面界面
![sourceTree-install-1.png](/images/chenfan/sourceTree-install-1.png)

点击Next，选择安装的本机路径，最后点击install即可

![sourceTree-install-2.png](/images/chenfan/sourceTree-install-2.png)
 
![sourceTree-install-3.png](/images/chenfan/sourceTree-install-3.png)

（3）安装完成，会弹出如下对话框，你可以选择自动下载。我用的是git 直接选择跳过就可以了

![sourceTree-install-4.png](/images/chenfan/sourceTree-install-4.png)

会显示正在下载文件

（4）若没有在github进行注册，建议注册后使用github进行登陆，安装到此结束。

<a id="2nd"></a>

## 3.如何在gogs上创建仓库

（1）首先在gogs上你的用户，联系gogs管理员为你分配权限

（2）登陆gogs[http://10.20.16.78:3000](http://10.20.16.78:3000),进入你的组织

（3）点击![sourceTree-used-1.png](/images/chenfan/sourceTree-used-1.png)创建你自己的远程仓库

<a id="3rd"></a>

## 4.如何克隆gogs上的工程

点击克隆/新建命令，弹出以下对话框

![sourceTree-used-2.png](/images/chenfan/sourceTree-used-2.png)

源路径为要克隆的gogs工程的url，url地址可以登陆gogs进行查找

目标路径为本机的工程存放路径，点击克隆即可

<a id="4ur"></a>

## 5.如何在gogs仓库中添加目录和文件

（1）点击配置选项，点击添加，添加远程仓库
![sourceTree-used-3.png](/images/chenfan/sourceTree-used-3.png)

远程仓库指的是在gogs上创建的仓库，点击确定

（2）方式1（远程仓库为空的情况）：

1.点击克隆/新建，选择创建新仓库，
![sourceTree-used-4.png](/images/chenfan/sourceTree-used-4.png)

目标路径为你本地存放路径，在这个路径下你可以存放你要上传的文件目录等，点击创建，可以看到左侧出现，![sourceTree-used-6.png](/images/chenfan/sourceTree-used-6.png)，把要上传的工程放在此本机目录下，即为

![sourceTree-used-7.png](/images/chenfan/sourceTree-used-7.png)

点击未暂存文件，可以看到未暂存的文件已经存放到以暂存文件中

2.点击

![sourceTree-used-8.png](/images/chenfan/sourceTree-used-8.png)

提交按钮，即出现

![sourceTree-used-9.png](/images/chenfan/sourceTree-used-9.png)

点击提交即可

3.在最上面工具栏点击推送按钮，即
![sourceTree-used-10.png](/images/chenfan/sourceTree-used-10.png)

点击确定，本地的要上传的东西提交到gogs远程仓库中，可以登陆gogs查看是否提交成功

（3）方式2（克隆）

1.点击克隆，克隆你在gogs创建的远程仓库，在本地该目录中存放你需要上传的东西

2.点击未暂存文件，可以看到未暂存的文件已经存放到以暂存文件中，即重复方式1，点击提交，推送


<a id="end"></a>

## 6.如何新增或修改文件，并提交到gogs上去

（1）克隆工程，在本地仓库中修改，添加文件，打开sourceTree

会出现下图

![sourceTree-used-11.png](/images/chenfan/sourceTree-used-11.png)

![sourceTree-used-12.png](/images/chenfan/sourceTree-used-12.png)

点击未暂存的文件，将其加入已暂存文件，重复5中的方式1，点击提交、推送，即将修改的文件工程添加到远程gogs中


