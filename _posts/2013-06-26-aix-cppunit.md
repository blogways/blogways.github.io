---
layout: post
category: 杂记
title: AIX下安装cppunit记
tags: ['aix', 'cppunit']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: 在ibm aix上编译安装cppunit全过程

---

### 一、下载

从官网下载cppunit，笔者当前使用版本为1.12.1。

下载地址为：[http://downloads.sourceforge.net/project/cppunit/cppunit/1.12.1/cppunit-1.12.1.tar.gz](http://downloads.sourceforge.net/project/cppunit/cppunit/1.12.1/cppunit-1.12.1.tar.gz)


### 二、解压

    gzip -d cppunit-1.12.1.tar.gz
    tar -xvf cppunit-1.12.1.tar
    
### 三、编译


    #进入解压后的源码目录
    cd cppunit-1.12.1
    
    #在aix下面编译，目前不支持生成动态库，仅生成的是静态库。
    ./configure --disable-shared
    
    #也可以添加prefix参数，指定编译后需要安装的目录
    ./configure --disable-shared  --prefix=……
    
    #编译
    make
    
    #安装
    make install
    
在执行`configure`时，如果出现了`configure: error: C compiler cannot create executables`这种错误，需要检查一下`config.log`文件，看看是不是参数啥的配置错误了。


**总的来说，`cppunit`在`aix`下面安装还是相当顺利的。**

如果想在`aix`上编译生成64位的目标，配置命令如下

    ./configure --disable-shared "LDFLAGS=-q64" "CFLAGS=-q64" "CXXFLAGS=-q64" "AR_FLAGS=-X64 cru" 

如果是在hp下安装,相关命令如下：

    ./configure --enable-hpuxshl CC=cc CXX=aCC CXXFLAGS="-AA"
    
    