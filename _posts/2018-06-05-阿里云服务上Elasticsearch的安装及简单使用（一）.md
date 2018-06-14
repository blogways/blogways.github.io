---
layout: post
title: 阿里云服务上Elasticsearch的安装及简单使用（一）
category: ['Elasticsearch']
tags: ['Elasticsearch']
author: 陈龙
email: chenlong@asiainfo.com
description: Elasticsearch一个例子
---
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Elasticsearch是一个高度可伸缩的开源全文搜索和分析引擎。它允许你以近实时的方式快速存储、搜索和分析大量的数据。它通常被用作基础的技术来赋予应用程序复杂的搜索特性和需求。  
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;关于Elasticsearch的一些几本概念，在此不做过多的描述，感兴趣的小伙伴可以自行问度娘。  
### 安装
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Elasticsearch需要至少Java 8。本文写的时候安装的1.8.0_161。Java的安装在不同的平台下是不一样，所以在这里就不再详细介绍。你可以在Oracle官网找到官方推荐的装文档。所以说，当你在安装Elasticsearch之前，请先通过以下命令检查你的Java版本(java -version，然后根据需要安装或升级)。  
#### Linux zip包安装示例  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了简便，我们使用wget获取zip安装包，命令如下：

`wget https://artifacts.elastic.co/downloads/elasticsearch/elasticsearch-6.2.4.zip` 

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;使用如下命令进行解压：

`unzip elasticsearch-6.2.4.zip `  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;解压之后可以看到很多文件夹，其中bin目录中有启动命令，config文件夹中有配置文件，本文主要讲述单节点的安装，对于集群模式的安装主要是通过配置文件的配置等相关操作进行安装，在此不做过多等描述。

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;然后我们通过如下命令进入bin目录：
```
cd elasticsearch-6.2.4/bin/
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;接下来我们就可以启动我们的单节点集群：` ./elasticsearch`  
```
注意：elasticsearch不支持root用户进行启动，所以我们需要在重新添加一个普通用户并赋予相应等权限，命令如下：
useradd elasticUser
chown -R elasticUser:elasticUser /data/elasticsearch-6.2.4
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;成功运行之后的信息现实如下：  
![e1.png](/images/chenlong/e1.png)  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到此我们可以进行本机测试了，查看es的信息。

` curl -XGET 'localhost:9200/_cat/health?v&pretty'`   

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;显示信息如下：  

![e2.png](/images/chenlong/e2.png)  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我们可以看到我们的名称为“elasticsearch”的集群正在运行，状态标识为`yellow`。  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
无论何时查看集群健康状态，我们会得到中`green`、`yellow`、`red`的任何一个。

  - **Green** - 一切运行正常(集群功能齐全)  
  - **Yellow** - 所有数据是可以获取的，但是一些复制品还没有被分配(集群功能齐全)
  - **Red** - 一些数据因为一些原因获取不到(集群部分功能不可用) 
 

注意：当一个集群处于red状态时，它会通过可用的分片继续提供搜索服务，但是当有未分配的分片时，你需要尽快的修复它。  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了能够使用外网进行访问我们es服务，我们还需要进行如下的配置：  
`vim config/elasticsearch.yml`  

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;修改项为：  
```
network.host: 0.0.0.0
http.port: 9200
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;同时我们可以修改它的发布地址：`network.publish_host: 要发布的IP地址`  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;修改完成之后重启es发现我们使用浏览器仍然不能访问我们的es服务，通过查看，原来是阿里云默认没有对外开放端口，在阿里云控制台的安全组配置中添加新的配置。  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;重启之后发现还是放不了，这个时候忍不住说一声万恶的服务为什么还访问不了！！！  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;再次检查发现防火墙的原因。打开防火墙端口!打开防火墙端口!打开防火墙端口!重要的事情说三遍!  
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;添加的命令如下:
`firewall-cmd --zone=public --add-port=9200/tcp`
```
防火墙的几个简单命令：
启动： systemctl start firewalld  查看状态： systemctl status firewalld   
停止： systemctl disable firewalld 禁用： systemctl stop firewalld）
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;到目前为止才算是真正到完成了。  
![e3.png](/images/chenlong/e3.png)   
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;或者使用postman查看也可以。  
![e4.png](/images/chenlong/e4.png)  
![e5.png](/images/chenlong/e5.png) 








