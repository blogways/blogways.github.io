---
layout: post
title: webservice入门(二)
category: ['webservice']
tags: ['webservice']
author: 陈龙
email: chenlong@asiainfo.com
description: Jax-ws第一个例子
---
### 一、服务端开发

1. 编写SEI(Service Endpoint Interface)，SEI在webservice中称为portType，在java中称为接口，代码如下：

![webservice_02.png](/images/chenlong/wb_02.png)

2. 编写SEI实现类，并作为webservice提供服务类，代码如下：

![webservice_03.png](/images/chenlong/wb_03.png)

```
SEI实现类中至少要有一个非静态的公开方法需要作为webservice服务方法。
public class 上边要加上@WebService 
```

3. 查看wsdl

地址栏中输入`http://127.0.0.1:1234/weather?wsdl`查看

### 二、wsimport生产客户端调用类

wsimport具体使用可以使用命令 `wsimport -help`或者自行百度学习。

新建一个名为wsimport的工程，cmd命令进入该工程的src目录，输入如下命令：`wsimport -s . http://127.0.0.1:1234/weather?wsdl`，刷新该工程，将src下生成.java文件代码Copy到webservice客户端工程中。

### 三、客户端编写

代码如下：

![webservice_04.png](/images/chenlong/wb_04.png)

运行结果：

![webservice_06.png](/images/chenlong/wb_06.png)

最后，附上上述三个工程的结构：

![webservice_05.png](/images/chenlong/wb_05.png)


