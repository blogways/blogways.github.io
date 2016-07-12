---                   
layout: post
category: JUnit
title: Jenkins+git+maven+junit 一
tags: ['Jenkins', 'git', 'maven', 'junit']
author: 汤仕忠
email: tangsz@asiainfo-linkage.com
# image: 
description: Jenkins 能实施监控集成中存在的错误，提供详细的日志文件和提醒功能，还能用图表的形式
---

### 一、持续集成概述
随着软件开发复杂度的不断提高，团队开发成员间如何更好地协同工作以确保软件开发的质量已经慢慢成为开发过程中不可回避的问题。尤其是近些年来，敏捷（Agile） 在软件工程领域越来越红火，如何能再不断变化的需求中快速适应和保证软件的质量也显得尤其的重要。
持续集成正是针对这一类问题的一种软件开发实践。它倡导团队开发成员必须经常集成他们的工作，甚至每天都可能发生多次集成。而每次的集成都是通过自动化的构建来验证，包括自动编译、发布和测试，从而尽快地发现集成错误，让团队能够更快的开发内聚的软件。
持续集成的核心价值在于：
	
	1.持续集成中的任何一个环节都是自动完成的，无需太多的人工干预，有利于减少重复过程以节省时间、
	  费用和工作量；
	2.持续集成保障了每个时间点上团队成员提交的代码是能成功集成的。换言之，任何时间点都能第一时
	  间发现软件的集成问题，使任意时间发布可部署的软件成为了可能；
	3.持续集成还能利于软件本身的发展趋势，这点在需求不明确或是频繁性变更的情景中尤其重要，持
	  续集成的质量能帮助团队进行有效决策，同时建立团队对开发产品的信心。 

### 二、持续集成的原则

业界普遍认同的持续集成的原则包括：
	
	1.需要版本控制软件保障团队成员提交的代码不会导致集成失败。常用的版本控制软件有 CVS、
      Subversion、git 等，本文中用的是git；
	2.开发人员必须及时向版本控制库中提交代码，也必须经常性地从版本控制库中更新代码到本地；
	3.需要有专门的集成服务器来执行集成构建。根据项目的具体实际，集成构建可以被软件的修改来
	  直接触发，也可以定时启动，如每半个小时构建一次；
	4.必须保证构建的成功。如果构建失败，修复构建过程中的错误是优先级最高的工作。一旦修复，
	  需要手动启动一次构建。

### 三、持续集成系统的组成
	
	1.一个自动构建过程，包括自动编译、分发、部署和测试等，本文中用的是maven+junit。 
	2.一个代码存储库，即需要版本控制软件来保障代码的可维护性，同时作为构建过程的素材库，
	  本文中用的是git。 
	3.一个持续集成服务器。本文中用到的是jenkins。 

### 四、Jenkins简介及安装
git、maven、junit本博客其他篇章中都有所介绍，所以今天我们主要介绍Jenkins的应用：
Jenkins 是一个开源项目，提供了一种易于使用的持续集成系统，使开发者从繁杂的集成中解脱出来，
专注于更为重要的业务逻辑实现上。同时 Jenkins 能实施监控集成中存在的错误，提供详细的日志文
件和提醒功能，还能用图表的形式形象地展示项目构建的趋势和稳定性。


- 下载Jenkins，[http://jenkins-ci.org/ ](http://jenkins-ci.org/ )
- Jenkins 安装：本文介绍安装在linux主机上通过命令行安装
	
	1.将下载的jenkins.war文件上传到linux主机安装目录下
	   如：/home/spdev
	2.执行java -jar jenkins.war
	3.打开ie输入地址 http://hoestname:8080 （hostname为主机  ip）即能访问Jenkins,如自己设定端口可执行：java -jar jenkins.war --httpPort= port


### 五、Jenkins配置及使用
 

	
- 进入“系统管理”->“插件管理”
		
		1.选择“已安装”tab页查看发下maven插件已经安装，git、junit插件没有安装
		2.选择“可选插件”tab页，在Filter输入框输入git，过滤条件后将git相关插件安装，同样
		   操作安装junit插件
		3.选择“可选插件”tab页，找到“Jenkins Email Extension Plugin”插件并安装，此插件
		   是后面发布及测试法邮件使用
		
- 进入“系统管理”->“系统设置”
	
		1.选择“JDK”安装，定义别名，JAVA_HOME输入JDK安装目录
		2.选择“Git”安装，定义别名，安装目录输入Git安装目录
		3.选择“Maven”安装，定义别名，安装目录输入MAVEN_HOME安装目录
		4.“System Admin e-mail address”输入系统管理员邮箱地址
		5.“Extended E-mail Notification”标签为插件“Jenkins Email Extension Plugin“里
		    内容，为邮件通知设置，这里我的配置如下图：
<img src="/images/post/jenkins-setting.jpg" width="400" height="300" alt="image"/>

- 回到Jenkins首页，点击“新Job”，输入job名称如：MavenPrj，选择“构建一个maven2/3项目”
- 选择任务“MavenPrj”，点击“配置”进入任务配置界面，源代码管理中选择git,并输入仓库路径如：/home/git/MavenPrj/mytest，Branches to build根据自己需要输入，这里我取得主分支代码，输入的为master
- “构建触发器”选择项下我选择的为“Poll SCM”，含义为在指定作业时间内有代码更新的时候去取代码，这里”Build periodically“含义为不管是否有代码更新在指定作业时间内都去取代码，”Build whenever a SNAPSHOT dependency is built“含义为当构建成功后，项目jar包会发到maven二方库上去
- ”日程表“我这里配的是*/1 * * * *，代表每隔一分钟取一次，这里五个 * 号从左到右分别
  分 时 日 月 年，相同 * 号段内用”,“号隔开，如：* * 8,20 * * *含义为每天8点、20点取代码
-”构建后操作“Editable Email NOtification” 其中Project Recipient List
 可以配置收件人信箱，点击“高级”，“Add a Trigger”中可以选择对应触发器，我这里用到了构建失败(Failure),和测试报错(系统不稳定Unstable)两项，收件人选择了“Send To Recipient List”和提交者“Send To Committers”

- git上建立仓库将本地现有Maven+junit java项目push到git仓库，打开Jenkins主页进入MavenPrj任务，几分钟后就能看到构建任务及测试结果了，下面是构建完的效果图：


<img src="/images/post/jenkins-setting2.jpg" width="400" height="300" alt="image"/>