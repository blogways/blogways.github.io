---
layout: post
title: kafka-manager安装与使用
category: ['kafka']
tags: ['kafka']
author: 钱文旭
email:
description: kafka-manager安装与使用
---

|  |  *目 录* |
| --- | --- |
| 1 | [kafka manager简介](#kafka-manager-desc) |
| 2 | [kafka manager安装](#kafka-manager-install) |
| 3 | [kafka manager使用](#kafka-manager-use) |

## 一、kafka manager简介<a href="kafka-manager-desc"></a>
为了简化开发者和服务工程师维护Kafka集群的工作，yahoo构建了一个叫做Kafka管理器的基于Web工具，叫做 Kafka Manager。
它有如下功能：
* 管理多个kafka集群
* 便捷的检查kafka集群状态(topics,brokers,备份分布情况,分区分布情况)
* 删除topic（只支持0.8.2+ 且须设置delete.topic.enable=true）
* 为已存在的topic增加分区
* 为已存在的topic更新配置

等等，具体可见kafka-manager项目地址[https://github.com/yahoo/kafka-manager](https://github.com/yahoo/kafka-manager)
 
## 二、kafka manager安装<a href="kafka-manager-install"></a>
### 2.1 下载kafka-manager 
```git clone https://github.com/yahoo/kafka-managercd kafka-manager```
### 2.2 构建kafka-manager
```
    cd kafka-manager
    ./sbt clean dist
```
由于一些众所周知的原因，编译的操作比较耗时，如果有国外的服务器，最好在国外的服务器上完成。
### 2.3 配置kafka-manager
构建成功后，在目录target/universal下可以看到```kafka-manager-1.3.3.13.zip```
1. 解压文件<br/>
```unzip kafka-manager-1.3.3.13.zip```
2. 修改配置
```
    cd kafka-manager-1.3.3.13
    vi conf/application.conf
```
将```kafka-manager.zkhosts```属性修改为您的zk集群地址
将```akka```的loglevel设置为```error```，否则日志文件较多。
3. 启动
```
    nohup bin/kafka-manager -Dconfig.file=conf/application.conf -Dhttp.port=9000 &
```
这样就启动成功了。

## 三、kafka manager使用<a href="kafka-manager-use"></a>
* 点击[http://localhost:9000](http://localhost:9000)导航栏上的"Add Cluster"
* 配置kafka集群名称、kafka集群的zk等：<br/>
![kafka-manager-add-cluster.png](/images/qianwx/kafka-manager/kafka-manager-add-cluster.png)
* 点击保存后，可以进入到集群列表页面：<br/>
![kafka-manager-clusters.png](/images/qianwx/kafka-manager/kafka-manager-clusters.png)
* topics列表页和详情页:<br/>
![kafka-manager-topics.png](/images/qianwx/kafka-manager/kafka-manager-topics.png)
![kafka-manager-topic-detail.png](/images/qianwx/kafka-manager/kafka-manager-topic-detail.png)
* consumers信息:<br/>
![kafka-manager-consumer.png](/images/qianwx/kafka-manager/kafka-manager-consumer.png)



