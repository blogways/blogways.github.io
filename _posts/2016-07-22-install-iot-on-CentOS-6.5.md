---
layout: post
category: iot
title: CentOS下安装部署iot
tags: ['iot', '部署', 'CentOS6.5']
author: 徐万年
email: xuwn@asiainfo.com
#image:
description: 学习在CentOS6.5 64位环境自动化境部署：iot-web、iot-server、zookeeper
---

# 一、iot平台部署概述
亚信iot平台由：iot-web、iot-server、zookeeper、kafka、comsumer等模块组成。

|  |  *目 录* |
| --- | --- |
| 1 | IOT-web |
| 2 | IOT-server |
| 3 | zookeeper 	|
| 4 | kafka |
| 5 | consumer |


# 二、iot-web部署

## 2.1、手工编译、部署、配置

2.1.1. git获取源代码：git clone http://10.20.16.78:3000/iot/iot-web.git

2.1.2. 编译源代码：mvn clean install 得到war包：iot-web-1.0-SNAPSHOT.war

2.1.3. 将war包部署到tomcat根【部署方案请参见网络tomcat根部署方法】

2.1.4. 配置$IOT-WEB-SETUP-PATH/WEB-INF/classes/spring/consumer-dubbo.xml，修改zookeeper正确地址即可

```
<dubbo:registry address="zookeeper://192.168.10.149:2181?backup=192.168.10.154:2181"/>
```

2.1.5. 停启tomcat即可

2.1.6. 浏览器打开：http://192.168.10.149:8080/createuser/index.html 看页面是否打开成功


## 2.2、自动化编译、部署、配置

自动化构建只要遵守jenkins相关方法即可，为了使自动化部署相对直观，需要添加构建后的触发器，当构建：成功、失败、不稳定时，发送相应邮件到指定人员（自动化构建平台管理员、开发人员、测试人员）。
	
# 三、iot-server部署

## 3.1、手工编译、部署、配置

3.1.1. git获取源代码：git clonehttp://10.20.16.78:3000/iot/iot-server.git

3.1.2. 编译源代码：mvn clean install 得到war包：iot-server.jar

3.1.3. copy目标文件到运行目录：

3.1.4. iot-server服务的启停：./operateServer.sh start、./operateServer.sh stop

3.1.5. 检测服务是否在zookeeper中注册成功
	
>注：注意在生产环境中调整启动脚本中的java虚拟机的内存分配。

## 3.2、自动化编译、部署、配置

	自动化构建只要遵守jenkins相关方法即可，为了使自动化部署相对直观，需要添加构建后操作的触发器，当构建：成功、失败、不稳定时，发送相应邮件到指定人员（自动化构建平台管理员、开发人员、测试人员）。
	

# 四、zookeeper安装部署

	ZooKeeper是一个分布式的，开放源码的分布式应用程序协调服务，是Google的Chubby一个开源的实现，是Hadoop和Hbase的重要组件。它是一个为分布式应用提供一致性服务的软件，提供的功能包括：配置维护、域名服务、分布式同步、组服务等。
	ZooKeeper的目标就是封装好复杂易出错的关键服务，将简单易用的接口和性能高效、功能稳定的系统提供给用户。【百度百科】


>**建议：目前部署只使用2台zookeeper服务器，部署版本为zookeeper-3.3.6，理论zookeeper的安装部署集群主机数量需要大于等于3台，建议zookeeper集群主机数量为奇数【因为集群涉及选举leader，部署数量为奇数有利于提高整个系统平台的稳定性与健壮性，zookeeper主机的数量越多整个集群的稳定性越强】。**

## 4.1、zookeeper安装步骤

1. 下载zookeeper，版本：zookeeper-3.3.6

2. 解压zookeeper到指定目录，如：/root/iot/zookeeper-3.3.6

3. 配置zookeeper的配置文件，路径及文件名为：$ZOOKEEPER_HOME/conf/zoo.conf，**见：注1**；

4. 配置myid文件，根据zoo.conf文件配置myid文件，myid文件只需要配置一个数字编号；**见：注2；**

5. zookeeper的启停方法、及状态查询；**见：注3**；


>注1：zoo.cfg内容如下：

	# The number of milliseconds of each tick
	tickTime=2000
	# The number of ticks that the initial
	# synchronization phase can take
	initLimit=5
	# The number of ticks that can pass between
	# sending a request and getting an acknowledgement
	syncLimit=2
	# the directory where the snapshot is stored.
	# the port at which the clients will connect

	dataDir=/root/iot/data
	dataLogDir=/root/iot/dataLog
	clientPort=2181
	server.1=192.168.10.149:2888:3888
	server.2=192.168.10.154:2889:3889
	
>注2：

您看到配置文件中有如下内容：server.1=192.168.10.149:2888:3888，说明如下：192.168.10.149主机需要根据server后的编号配置：/root/iot/data/myid文件；文件中写入：server.x中的x编号；例如本配置，只需在myid文件写入1，即可；同理：192.168.10.154的相应的myid文件写入2；如果配置不正确，则整个zookeeper集群可能无法正常运行。

>注3：	

启动：$ZOOKEEPER_HOME/bin/zkServer.sh start

停止：$ZOOKEEPER_HOME/bin/zkServer.sh stop

状态：$ZOOKEEPER_HOME/bin/zkServer.sh status

日志：tail -f zookeeper.log
	
**zookeeper.log文件刚开始可能不正确认，因为当整个zookeeper集群未完全启动完成时，每个zookeeper节点会去尝试连接配置文件中配置的主机，固会出现连接错误，只有在所有主机节点主机全部启动完成后，如果没有错误信息，则表示整个zookeeper集群成功运行。**


## 4.2、zookeeper启停及进程查看

启动：$ZOOKEEPER_HOME/bin/zkServer.sh start

停止：$ZOOKEEPER_HOME/bin/zkServer.sh stop

状态：$ZOOKEEPER_HOME/bin/zkServer.sh status

## 4.3、zookeeper运行日志查看

启动zookeeper后，默认在启动中径下生成zookeeper.log日志文件；可以通过more、vi、tail查看日志。

## 4.4、zookeeper配置文件说明

zookeeper配置文件路径：$ZOOKEEPER_HOME/conf/zoo.cfg

配置文件zoo.cfg内容如下：

	# The number of milliseconds of each tick
	tickTime=2000
	# The number of ticks that the initial
	
	# synchronization phase can take
	initLimit=5
	# The number of ticks that can pass between
	
	# sending a request and getting an acknowledgement
	syncLimit=2
	# the directory where the snapshot is stored.
	# the port at which the clients will connect

	dataDir=/root/iot/data
	dataLogDir=/root/iot/dataLog
	clientPort=2181
	
	# zookeeper集群主机信息
	server.1=192.168.10.149:2888:3888
	server.2=192.168.10.154:2889:3889

>zookeeper提供log4j的日志方式，请参见zookeeper的说明文档。

# 五、kafka
	
	待补充

# 六、consumer

	待补充
	
# 七、整体iot部署说明
	由于整个iot系统由多个子模块组成，这其中涉及软件模块的编译、主机的启停、单元测试、系统检验（启停是否成功），故使用jenkins插件：pipeline可以串联整个模块。通过jenkins插件创建pipeline项目之后，设定一个开始项目后，再设定该项目的：构建后操作指定执行的下一步骤即可。
	
	pipeline例程如下：
	 
![pipeline](/images/pipeline-flow.jpg)

	触发其它构建后动作如下：
	
![triger-other-project](/images/triger-other-project.jpg)

>注：pipeline插件并不创建真正的一个jenkins项目，它只是把之前创建的jenkins项目作一个串联并可视化，通过可视化的流程可以看到一个workflow工程经历哪些步骤。

# 八、其它

暂无