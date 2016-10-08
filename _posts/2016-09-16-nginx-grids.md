---
layout: post
title: Nginx+Mongodb 文件存储方案
category: ['web后端']
tags: ['nginx', 'mongodb', 'Web']
author: 赵家君
email: zhaojj5@asiainfo.com
description: 本文主要介绍Nginx-gridfs的配置及对Mongodb的访问
---

|  |  *目 录* |
| --- | --- |
| 1 | [简介](#1st) |
| 2 | [Nginx-gridfs和Nginx配置](#2nd) |
| 3 | [应用示例](#3nd) |
| 4 | [注意事项](#end) |

<a id="1st"></a>

## 一、简介
	
> MongoDB是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的。是一个基于分布式文件存储的数据库，**Gridfs适合存储海量大文件，特别是视频，音频，大型图片超过16MB大小的文件**。
> 
> Nginx-gridfs是一个 Nginx 的扩展模块，用于支持直接访问 MongoDB 的 GridFS 文件系统上的文件并提供 HTTP 访问，可理解为就是MongoDB的客户端。

    GridFS实现原理
    GridFS在数据库中，默认使用fs.chunks和fs.files来存储文件。
    其中fs.files集合存放文件的信息，fs.chunks存放文件数据。

    一个fs.files集合中的一条记录内容如下，即一个file的信息如下：
    {
    	"_id" : ObjectId("4f4608844f9b855c6c35e298"),   //唯一id，可以是用户自定义的类型
    	"filename" : "CPU.txt",  //文件名
    	"length" : 778,  //文件长度
    	"chunkSize" : 262144,//chunk的大小
    	"uploadDate" : ISODate("2012-02-23T09:36:04.593Z"), //上传时间
    	"md5" : "e2c789b036cfb3b848ae39a24e795ca6",  //文件的md5值
    	"contentType" : "text/plain" //文件的MIME类型
    	"meta" : null//文件的其它信息，默认是没有”meta”这个key，用户可以自己定义为任意BSON对象
    }

    对应的fs.chunks中的chunk如下：
    {
    	"_id" : ObjectId("4f4608844f9b855c6c35e299"),//chunk的id
    	"files_id" : ObjectId("4f4608844f9b855c6c35e298"),  //文件的id，对应fs.files中的对象，相当于fs.files集合的外键
    	"n" : 0, //文件的第几个chunk块，如果文件大于chunksize的话，会被分割成多个chunk块
    	"data" : BinData(0,"QGV...") //文件的二进制数据，这里省略了具体内容
    }


<a id="2nd"></a>

## 二、Nginx-gridfs和Nginx配置

    进入目录 /usr/local/server/ 下

#### 安装依赖库、工具 ####

    # yum -y install pcre-devel openssl-devel zlib-devel
    # yum -y install gcc gcc-c++

#### 下载nginx-gridfs源码 ####

    # git clone https://github.com/mdirolf/nginx-gridfs.git
    # cd nginx-gridfs
    # git checkout v0.8
    # git submodule init
    # git submodule update
    
#### 下载nginx源码，编译安装 ####

    # wget http://nginx.org/download/nginx-1.4.7.tar.gz
    # tar zxvf nginx-1.4.7.tar.gz
    # cd nginx-1.4.7
    # ./configure --prefix=/usr/local/server/nginx --with-pcre=/usr/local/server/pcre-8.38 --with-http_ssl_module --with-http_stub_status_module --with-http_flv_module --with-http_gzip_static_module --add-module=/usr/local/server/nginx-gridfs --with-poll_module --without-select_module --with-http_realip_module --with-cc-opt=-Wno-error;
    # make -j8 && make install -j8
    
#### 修改/usr/local/nginx/conf/nginx.conf配置文件 ####

    location /static/ {
	    gridfs GridFS  # GridFS指的是mongodb的数据库名称
	    field=filename  # [field]：查询字段，保证mongdb里有这个字段名，支持_id, filename, 可省略, 默认是_id
	    type=string; # [type]：解释field的数据类型，支持objectid, int, string, 可省略, 默认是int
	    mongo 127.0.0.1:27017;
    }

<a id="3nd"></a>

## 三、应用示例

> 要保证系统启动过程中，MongoDB比nginx先启动，否则nginx-gridfs初始化的时候不能正确链接MongoDB数据库。

#### 启动 mongodb ####

    # /usr/local/server/mongodb/bin/mongod --dbpath=/usr/local/server/mongodb/data/db --logpath=/usr/local/server/mongodb/data/logs/mongodb.log &

#### 启动nginx服务 ####

    # /usr/local/server/nginx/sbin/nginx &

#### Java代码从本地上传一个图片到mongodb服务器 ####

#### （1）引入依赖的jar包 ####

    <dependency>
		<groupId>org.springframework.data</groupId>
		<artifactId>spring-data-mongodb</artifactId>
		<version>1.2.0.RELEASE</version>
	</dependency>

####  （2）java代码实现 ####

     /**  
     * 存储文件  
     */  
     public static void saveFile() throws Exception{  
		  //连接服务器  
		  MongoClient mongoClient = new MongoClient("192.168.137.129", 27017);
		  // 连接到数据库.如果库不存在则创建
		  DB db = mongoClient.getDB("GridFS");
		   
		  //文件操作是在DB的基础上实现的，与表和文档没有关系  
		  GridFS gridFS = new GridFS(db);
		   
		  String fileName="asiainfo.jpg";  
		  File readFile=new File("e:/"+fileName);  
		  GridFSInputFile  mongofile=gridFS.createFile(readFile);  
		  //可以再添加属性  
		  mongofile.put("path","e:/"+fileName);  
		  mongofile.setFilename(fileName);
		  //保存  
		  mongofile.save();           
     }  

#### 使用客户端工具查看一下上传的结果 ####

![20160916img01](/images/zhaojiajun/20160916img01.jpg)

#### 测试图片 ####

![20160916img02](/images/zhaojiajun/20160916img02.jpg)

#### 测试文件 ####

![20160916img03](/images/zhaojiajun/20160916img03.jpg)

![20160916img04](/images/zhaojiajun/20160916img04.jpg)

<a id="end"></a>

## 四、注意事项

> 1）mongodb工作集
> 伴随数据库内容的GridFS文件会显著地搅动MongoDB的内存工作集。如果你不想让GridFS的文件影响到你的内存工作集，那么可以把GridFS的文件存储到不同的MongoDB服务器上。
> 
> 2）nginx-gridfs的不足
> 没有实现http的range support，也就是断点续传，分片下载的功能。