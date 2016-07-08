---
layout: post
category: 杂记
title: jBPM5 vs Actitivi
tags: ['BPM', 'jBPM5', 'Actitivi']
author: Jacky
email: shenyj5@asiainfo-linkage.com
image:
description: jBPM是目前市场上主流开源工作引擎之一，在创建者Tom Baeyens离开JBoss后，jBPM的下一个版本jBPM5完全放弃了jBPM4的基础代码，基于Drools Flow重头来过，目前官网已经推出了jBPM6的beta版本；Tom Baeyens加入Alfresco后很快推出了新的基于jBPM4的开源工作流系统Activiti。由此可以推测JBoss内部对jBPM未来版本的架构实现产生了严重的意见分歧。本文试着对二者做一些比较。
---

## jBPM5 vs Actitivi
jBPM是目前市场上主流开源工作引擎之一，在创建者Tom Baeyens离开JBoss后，jBPM的下一个版本jBPM5完全放弃了jBPM4的基础代码，基于Drools Flow重头来过，目前官网已经推出了jBPM6的beta版本；Tom Baeyens加入Alfresco后很快推出了新的基于jBPM4的开源工作流系统Activiti。由此可以推测JBoss内部对jBPM未来版本的架构实现产生了严重的意见分歧。本文试着对二者做一些比较。

在比较之前先看下两者的安装部署过程：

### jBPM5安装及开发环境配置

1、安装JBPM之前，要求本机已安装了`JDk1.5+`版本和`ANT1.7+`版本。

2、JDK和ANT都安装完毕之后，到`http://sourceforge.net/projects/jbpm/files/`下载JBPM-installer,下载完之后，解压到安装目录，jbpm-installer文件夹里有个install.html，里面有英文版的安装教程，可以作为参考。

3、在CMD下进入刚才的\jbpm-installer目录，运行`ant install.demo`，该命令会执行下面一系列的操作： 

	下载JBoss AS
	下载Eclipse
	安装Drools Guvnor 到JBoss AS
	安装Oryx Designer 到JBoss AS
	安装jBPM Console 到JBoss AS
	安装jBPM Eclipse 插件
	安装Drools Eclipse 插件

注意：这边下载的东西比较多，有好几百兆，如果本地网络不怎么好或者有些东西机上已经有了的话就可以单独下载需要的

例：

	ant install.jBPM.runtime
	ant install.guvnor.into.jboss
	ant install.designer.into.jboss
	ant install.jBPM-gwt-console.into.jboss
	ant install.droolsjbpm-eclipse.into.eclipse

4、下面可以准备启动JBPM了。CMD到\jbpm-installer目录下，依次运行以下命令：

	ant start.h2 （启动h2数据库）
	ant start.jboss （启动JBoss AS）
	ant start.human.task （启动 task service）

5、Jboss启动之后，可以在http://localhost:8080/访问，jbpm自带的web控制台 http://localhost:8080/jbpm-console，登录的用户名、密码均为krisv，在web控制台中可启动一个新流程、查看正在执行流程的当前状态、查看当前登录人待办任务以及并可以以报表形式查看、跟踪流程状态。
Drools Guvnor的访问地址为：http://localhost:8080/drools-guvnor。

6、把eclipse目录下的features和plugins中的内容copy到eclipse的相应目录中。启动Eclipse之后，现在可以使用eclipse导入jbpm自带的一个流程。方法为依次点击File -> Import ，在General category下选择“Existing Projects into Workspace”，找到位于jbpm安装根目录/sample/evaluation文件夹，将该项目导入。

### Activiti安装及开发环境配置
1、 到`http://www.activiti.org/download.html`下载activiti-5.13.zip，解压到安装目录，页面上有个`The User Guide`，这个教程比较详细，如需要可深入学习下。

2、 打开解压目录，\wars下面有两个war包，把`activiti-explorer.war`部署到应用服务器中，里面默认的数据源是h2的内存数据库，如需要改成自己的数据库；

3、 安装完成后可以在`http://localhost:8080/activiti-explorer`处访问 Activiti Explorer web 应用程序，id/pwd: kermit/Kermit(这个账号是administrator)，这个程序是流程引擎的用户接口，用户可以使用这个工具来执行启动新流程，分配用户任务，浏览或领取任务等操作。还可以用来执行 Activiti 引擎的管理工作；

4、 Activiti 提供了基于 Eclipse 插件的开发工具和流程设计工具 ( 需要 Eclipse 的版本为 Helios 或 Indigo，如果尚未安装 Eclipse，请从 http://www.eclipse.org/downloads/下载安装最新版本的 Eclipse 集成开发环境。)。这些工具可以使用 Eclipse 的”Install new software”功能在线安装，安装方法如下：

在 Eclipse 的 Help 菜单中选择 Install New Software 选项，在弹出菜单中，点击 Add Repository 按钮添加新的远程 Software Repository，如图 3 所示，在 Location 中添加 http://activiti.org/designer/update/ 作为 Repository 的远程地址。当新的 Repository 添加完成后，Eclipse 会自动获取 Repository 中的软件列表。

5、 现在我们开始创建工作流。右键点击项目根目录，选择new -> others，选择Activiti -> Activiti Diagram。

流程开发跟部署就不在这边说了，都是界面化的开发工具，两个都可以保存成同样的格式，也可以用同一个插件来开发。

### jBPM5与Activiti5比较
#### 主要相似之处：

	都是BPMN2过程建模和执行环境。
	都是BPM系统（符合BPM规范）。
	都是开源项目-遵循ASL协议（ Apache的 软件许可）。
	都源自JBoss（Activiti5是jBPM4的衍生，jBPM5则基于Drools Flow）。
	都很成熟，从无到有，双方开始约始于2年半前。
	都有对人工任务的生命周期管理。 Activiti5和jBPM5唯一的区别是jBPM5基于WebService - HumanTask标准来描述人工任务和管理生命周期。 如有兴趣了解这方面的标准及其优点，可参阅WS - HT规范介绍  。
	都使用了不同风格的 Oryx 流程编辑器对BPMN2建模。 jBPM5采用的是 Intalio 维护的开源项目分支。 Activiti5则使用了Signavio维护的分支。

#### Activiti5与jBPM5技术组成对比
<table>
<tbody>
<tr><td><em>序号</em></td><td><em>技术组成</em></td><td><em>Activiti</em></td><td><em>jBPM5</em></td></tr>
<tr><td>1</td><td>数据库持久层ORM</td><td>MyBatis3</td><td>Hibernate3</td></tr>
<tr><td>2</td><td>持久化标准</td><td>无</td><td>JPA规范</td></tr>
<tr><td>3</td><td>事务管理</td><td>MyBatis机制/Spring事务控制</td><td>Bitronix，基于JTA事务管理</td></tr>
<tr><td>4</td><td>数据库连接方式</td><td>Jdbc/DataSource</td><td>Jdbc/DataSource</td></tr>
<tr><td>5</td><td>支持数据库</td><td>Oracle、SQL Server、MySQL等多数数据库</td><td>Oracle、SQL Server、MySQL等多数数据库</td></tr>
<tr><td>6</td><td>设计模式</td><td>Command模式、观察者模式等</td><td></td></tr>
<tr><td>7</td><td>内部服务通讯</td><td>Service间通过API调用</td><td>基于Apache Mina异步通讯</td></tr>
<tr><td>8</td><td>集成接口</td><td>SOAP、Mule、RESTful</td><td>消息通讯</td></tr>
<tr><td>9</td><td>支持的流程格式</td><td>BPMN2、xPDL、jPDL等</td><td>目前仅只支持BPMN2 xml</td></tr>
<tr><td>10</td><td>引擎核心</td><td>PVM（流程虚拟机）</td><td>Drools</td></tr>
<tr><td>11</td><td>技术前身</td><td>jBPM3、jBPM4</td><td>Drools Flow</td></tr>
<tr><td>12</td><td>所属公司</td><td>Alfresco</td><td>jBoss.org</td></tr>
</tbody>
</table>

Activiti5使用Spring进行引擎配置以及各个Bean的管理，综合使用IoC和AOP技术，使用CXF作为Web Services实现的基础，使用MyBatis进行底层数据库ORM的管理，预先提供Bundle化包能较容易的与OSGi进行集成，通过与Mule ESB的集成和对外部服务（Web Service、RESTful等）的接口可以构建全面的SOA应用；jBPM5使用jBoss.org社区的大多数组件，以Drools Flow为核心组件作为流程引擎的核心构成，以Hibernate作为数据持久化ORM实现，采用基于JPA/JTA的可插拔的持久化和事务控制规范，使用Guvnor作为流程管理仓库，能够与Seam、Spring、OSGi等集成。

需要指出的是Activiti5是在jBPM3、jBPM4的基础上发展而来的，是原jBPM的延续，而jBPM5则与之前的jBPM3、jBPM4没有太大关联，且舍弃了备受推崇的PVM（流程虚拟机）思想，转而选择jBoss自身产品Drools Flow作为流程引擎的核心实现，工作流最为重要的“人机交互”任务（类似于审批活动）则由单独的一块“Human Task Service”附加到Drools Flow上实现，任务的查询、处理等行为通过Apache Mina异步通信机制完成。

#### 优劣对比：

从技术组成来看，Activiti最大的优势是采用了PVM（流程虚拟机），支持除了BPMN2.0规范之外的流程格式，与外部服务有良好的集成能力，延续了jBPM3、jBPM4良好的社区支持，服务接口清晰，链式API更为优雅；劣势是持久化层没有遵循JPA规范。

jBPM最大的优势是采用了Apache Mina异步通信技术，采用JPA/JTA持久化方面的标准，以功能齐全的Guvnor作为流程仓库，有RedHat(jBoss.org被红帽收购)的专业化支持；但其劣势也很明显，对自身技术依赖过紧且目前仅支持BPMN2。

### 总结
虽然是比较，但不一定要有胜负，只有适合自己的才是最好的，要针对具体的项目区别对待。对我们自己的项目，其实我更关注的是流程引擎的执行效率以及性能，每小时几十万甚至上百万的流程需要执行，需要多少个服务，集群、负载的策略是什么，会不会有冲突？目前这方面的资料还是比较少的，很多问题只有实际遇用到的时候才会去想办法解决。不过就我个人的感觉而言，Activiti上手比较快，界面也比较简洁、直观，值得一试，不过jBPM6的beta版也已经出来了，不知道会有什么变化，有兴趣的也可以试下。

参考|推荐文章：

`http://blog.csdn.net/howareyoutodaysoft/article/details/8070068 ` <<BPMN2,activiti,jbpm5学习资料>>

`http://www.infoq.com/cn/articles/rh-jbpm5-activiti5`  <<纵观jBPM：从jBPM3到jBPM5以及Activiti5>>
