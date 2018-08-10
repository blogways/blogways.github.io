---
layout: post
title: 使用libreOffice将office文件转为pdf
category: ['Java']
tags: ['Java']
author: 陈鑫
email: chenxin6@asiainfo.com
description: 使用libreOffice将office文件转为pdf
---

#使用libreOffice将office文件转为pdf
##一、前言
功能需求：上传office文档，并提供文件在线预览。

之前提到了使用poi将文档转换html去预览。这篇文章讲下方案二中使用libreOffice将office文件转为pdf。

使用libreOffice,需要安装使用libreOffice，linux还需要装unoconv，需要使用commons-io的pom依赖，之前maven官方库查询不到这个pom依赖所以放弃了这个方案，刚才准备查询资料时发现这个依赖已经可以使用，估计是前段时间maven官方库出现问题。


## 二、安装libreOffice

    yum install libreoffice
    yum install libreoffice-headless
    
    tar -zxvf LibreOffice_5.4.0_Linux_x86-64_rpm.tar.gz
    cd LibreOffice_5.4.0.3_Linux_x86-64_rpm/RPMS
    yum install *.rpm
    
## 三、安装中文字体库
转换过程中可能会出现中文乱码问题。拷贝window的文字库拷贝到服务器下

1、进入c:\windows\Fonts ，复制所需要的字体；

2、将复制的文件放入服务器 /usr/share/font/ 目录下；

3、刷新系统即刻生效，输入命令：sudo fc-cache -fv。

## 四、转换成pdf


    /usr/bin/libreoffice  --invisible --convert-to pdf --outdir /root/out/ zzz.docx
    
--outdir后面的参数是转换后的pdf文件保存的目录,最后的文件绝对路径也可以放在--outdir前面。

    /usr/bin/libreoffice  --invisible --convert-to pdf /root/out/ --outdir zzz.docx

如果是自行编译需要带版本号:
    
    /usr/bin/libreoffice5.4  --invisible --convert-to pdf --outdir /root/out/ zzz.docx
    

    

   