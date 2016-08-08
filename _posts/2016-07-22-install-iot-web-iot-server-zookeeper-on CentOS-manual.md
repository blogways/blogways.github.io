---
layout: post
category: iot-web&iot-server&zookeeper
title: CentOS6.5 64位环境部署物联网框架
tags: ['物联网', '部署', 'CentOS']
author: 徐万年
email: xuwn@asiainfo.com
#image:
description: 学习在CentOS6.5 64位环手工及jenkins自动化境部署：iot-web、iot-server、zookeeper。
---


# 一、iot平台部署概述

## 1.1、手动安装步骤
	1、安装zookeeper，并启动集群；
	2、编译iot-web，并将编译生成的war包解压安装到tomcat根目录；
	3、编译iot-server，并启动iot-server。
	4、其它待补充
	
>**详细编译、安装、启停等步骤详见本章其它章节。**

#### 1.2、自动化部署步骤


#### 1.3、物联网平台模块

	模块名称   		|  			说明			| 部署说明 
--------------- 	| ------------------ 	| -------- 
iot-web		 	| 	web服务					| iot-web需要部署在tomcat的根下，即通过http://ip:8080/ 即可访问
iot-server		| 	服务提供者	   			| iot-server是一个后台进程程序，编译时依赖bpchain
zookeeper			| 	业务能力注册服务地		|
mysql				| 	数据库					|
iot-core			|	iot-server编译依赖	|
iot-bpchain		|	iot-server编译依赖	|
其它				|	待补充					|


	
#### 1.3、主机部署内容
	
主机      			| 部署模块 					| 部署说明 
--------------- 	| -------------------- 	| -------- 
192.168.10.149 	| iot-web、iot-server、zookeeper | 
192.168.10.154	| zookeeper	   			| 


>注：本部署CentOS6.5 64位系统，且是以root用户安装部署。且所有模块全部部署于$IOT-HOME目录下，除web服务，即：iot-web，当然，iot-web也可以存放$IOT-HOME。


# 二、iot-web部署

#### 2.1、iot-web编译
	编译：mvn clean install
	输出：$IOT_WEB_HOME/target/iot-web-1.0-SNAPSHOT.war

#### 2.2、iot-web部署
	主机：192.168.10.149、192.168.10.154
	路径：/root/iot/iot-web

#### 2.3、iot-web配置
	iot-web配置文件：
	1、$IOT_WEB_TOMCAT_HOME/WEB-INF/classes/spring/consumer-dubbo.xml
	2、$IOT_WEB_TOMCAT_HOME/WEB-INF/classes/spring/spring-context.xml
>注：consumer-dubbo.xml配置文件中配置zookeeper相关信息；
```
<dubbo:registry address="zookeeper://192.168.10.149:2181?backup=192.168.10.154:2181"/>
```
#### 2.4、iot-web启停
	iot-web只需启停tomcat即可。
	
#### 2.4、iot-web自动化部署
##### 2.4.1、部署策略
##### 2.4.2、部署配置
##### 2.4.3、部署自动化测试

>注：本部署使用tomcat作为web容器；且需要服务部署于tomcat的根下；

# 三、zookeeper部署

ZooKeeper是一个分布式的，开放源码的分布式应用程序协调服务，是Google的Chubby一个开源的实现，是Hadoop和Hbase的重要组件。它是一个为分布式应用提供一致性服务的软件，提供的功能包括：配置维护、域名服务、分布式同步、组服务等。

ZooKeeper的目标就是封装好复杂易出错的关键服务，将简单易用的接口和性能高效、功能稳定的系统提供给用户。【百度百科】


>**建议：目前部署只使用2台zookeeper服务器，部署版本为zookeeper-3.3.6，理论zookeeper的安装部署集群主机数量需要大于等于3台，建议集群总数量为奇数【因为这其中涉及到集群主机选举leader，部署数量奇数据有利于提高整个系统平台的稳定性与健壮性，zookeeper主机的数量越多整个集群的稳定性越强】。**

#### 3.1、zookeeper安装步骤
	1、下载zookeeper，版本：zookeeper-3.3.6
	2、解压zookeeper到指定目录，如：/root/iot/zookeeper-3.3.6
	3、配置zookeeper的配置文件，路径及文件名为：$ZOOKEEPER_HOME/conf/zoo.conf，**见：注1**；
	4、配置myid文件，根据zoo.conf文件配置myid文件，myid文件只需要配置一个数字编号；**见：注2；**
	5、zookeeper的启停方法、及状态查询；**见：注3**；


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
	
	zookeeper.log文件刚开始可能不正确认，因为当整个zookeeper集群未完全启动完成时，每个zookeeper节点会去尝试连接配置文件中配置的主机，固会出现连接错误，只有在所有主机节点主机全部启动完成后，如果没有错误信息，则表示整个zookeeper集群成功运行。


#### 3.2、zookeeper启停及进程查看
	启动：$ZOOKEEPER_HOME/bin/zkServer.sh start
	停止：$ZOOKEEPER_HOME/bin/zkServer.sh stop
	状态：$ZOOKEEPER_HOME/bin/zkServer.sh status

#### 3.3、zookeeper运行日志查看
	启动zookeeper后，默认在启动中径下生成zookeeper.log日志文件；可以通过more、vi、tail查看日志。

#### 3.4、zookeeper配置文件说明
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


# 四、iot-server部署

#### 4.1、iot-server编译
	1、cd $IOT_SERVER_HOME 		# $IOT_SERVER_HOME是源代码目录
	2、mvn clean install；		# 如果是第一次编译，将会是一个很长的时间

>注：iot-server有编译依赖：iot-core、 iot/bpchain

#### 4.2、iot-server部署

#### 4.3、iot-server启停
	iot-server启动：operateServer.sh start
	iot-server停止：operateServer.sh stop

#### 4.4、iot-server启停脚本
```
#! /bin/sh
startServer(){
    lib=.;
    for i in /root/iot/iot-server/lib/*.jar;do
        lib=$lib:$i
    done
    for i in /root/iot/iot-server/config/*.xml;do
        lib=$lib:$i
    done
    for i in /root/iot/iot-server/config/*.properties;do
            lib=$lib:$i
    done
    for i in /root/iot/iot-server/config;do
            lib=$lib:$i
    done

    echo $lib
	#nohup java  -Xms1024m -Xmx1024m -XX:MaxPermSize=256M -XX:-UseGCOverheadLimit -cp $lib -Dserver.port=2881 com.asiainfo.service.Main &
    #sleep 1
    #nohup java  -Xms10240m -Xmx10240m -XX:MaxPermSize=25600M -XX:-UseGCOverheadLimit -cp $lib -Dserver.port=2882 com.asiainfo.service.Main &
    #sleep 1
    #nohup java  -Xms10240m -Xmx10240m -XX:MaxPermSize=25600M -XX:-UseGCOverheadLimit -cp $lib -Dserver.port=2883 com.asiainfo.service.Main &
    java  -cp $lib -Dserver.port=2881  com.asiainfo.service.Main
}
stopServer(){
#   kill -9 $(lsof -i:2881 |awk '{print $2}' | tail -n 1)
    kill -9 $(netstat -anp|grep 2881 | awk '{print $7}' | awk -F/ '{print $1}')
    sleep 1
#   kill -9 $(lsof -i:2882 |awk '{print $2}' | tail -n 1)
    kill -9 $(netstat -anp|grep 2882 | awk '{print $7}' | awk -F/ '{print $1}')
    sleep 1
#   kill -9 $(lsof -i:2883 |awk '{print $2}' | tail -n 1)
    kill -9 $(netstat -anp|grep 2883 | awk '{print $7}' | awk -F/ '{print $1}')
}

case "$1" in
  "start" )
	startServer
        ;;
  "stop" )
	stopServer
        ;;
*)
esac
```
>注：注意调整启动脚本中的java虚拟机的内存分配。

# 五、iot-core部署
#### 5.1、iot-core编译
	1、cd $IOT_CORE_HOME			# $IOT_CORE_HOME是源代码下载路径
	2、mvn clean install			# 在源代码路径下执行mvn编译
	
# 六、bpchian
	1、编译：mvn install -Dmaven.test.skip=true
	2、拷贝：将target目录下：bpchain-1.0-SNAPSHOT.jar 拷贝到iot-server目录下；
	


