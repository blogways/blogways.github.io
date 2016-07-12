---
layout: post
category: 杂记
title: 在linux上安装oracle client 
tags: ['oracle client', 'linux']
author: 唐 治
description: 在Linux上安装oracle client

---



## 一、资源

登录Oracle官网 [http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html](http://www.oracle.com/technetwork/topics/linuxx86-64soft-092277.html) 。


## 二、选择

首先，选择你所需要的版本。

我选择的是 Version 11.2.0.4.0.

可以选择zip格式的，也可以选择rpm格式的。

我想自定义安装的路径，所以选择的是zip格式的。

根据说明，我选择了三个：

    #Basic: All files required to run OCI, OCCI, and JDBC-OCI applications 
    instantclient-basic-linux.x64-12.1.0.1.0.zip 
    
    #SDK: Additional header files and an example makefile for developing Oracle applications with Instant Client
    instantclient-sdk-linux.x64-12.1.0.1.0.zip 
    
    #SQL*Plus: Additional libraries and executable for running SQL*Plus with Instant Client
    instantclient-sqlplus-linux.x64-12.1.0.1.0.zip
    

如果仅仅需要运行环境，下载第一个就可以了。如果还需要开发编译环境，还需要下载第二个。想用sqlplus，要下第三个。


## 三、安装

把三个zip包传到要安装的目录下，比如`/home/oracle`。执行下面命令：

    unzip instantclient-basic-linux.x64-12.1.0.1.0.zip
    unzip instantclient-sdk-linux.x64-12.1.0.1.0.zip
    unzip instantclient-sqlplus-linux.x64-12.1.0.1.0.zip
    
解压后的文件都在`/home/oracle/instantclient_11_2`目录下面。
    
如果需要编译环境，还要设置：

    cd /home/oracle/instantclient_11_2
    ln -s libclntsh.so.11.1 libclntsh.so
    
设置环境变量：

    export ORACLE_HOME=/home/oracle/instantclient_11_2
    export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ORACLE_HOME/lib
    export PATH=$PATH:$ORACLE_HOME/bin
    export TNS_ADMIN=$ORACLE_HOME
    export NLS_LANG=american_america.ZHS16GBK

    
在`$ORACLE_HOME`目录下配置你的`tnsnames.ora`文件   
 

在编译oci/occi程序时，编译命令需要添加 `-I$ORACLE_HOME/sdk/include` ,链接命令需要添加 `-L$ORACLE_HOME`


## 四、测试

在命令行输入：

    sqlplus user/passwd@sid
    
可以看到熟悉的提示，就表示大功告成了！

## 五、回顾

我当时按上面步骤安装后，运行`sqlplus`会报一个`ORA-21561`错误。后来在`/etc/hosts`文件中配置上的主机的名字，问题就解决了。


