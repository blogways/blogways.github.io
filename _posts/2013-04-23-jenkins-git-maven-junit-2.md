---                   
layout: post
category: JUnit
title: Jenkins+git+maven+junit 二
tags: ['Jenkins', 'git', 'maven', 'tomcat']
author: 汤仕忠
email: tangsz@asiainfo-linkage.com
# image: 
description: Jenkins 能够集成git、maven、tomcat对web项目实现定时更新代码并部署web工程
---

### 一、概述
对于可持续集成描述及Jenkins介绍及安装在前面文档中有所介绍，本文就不做说明，本文只介绍如何实现Jenkins如何自动取git上web工程代码，maven实现编译及打包，最后Jenkins负责将war包发布到tomcat中


### 二、Jenkins配置及使用


tomcat中tomcat-users.xml文件添加如下：

	<role rolename="manager-gui"/>
	<role rolename="manager-script"/>   
	<user username="tomcat" password="tomcat" roles="manager-gui,
     manager-script"/> 
 更改git仓库中pom.xml 文件，添加如下内容：

	<plugin>
         <groupId>org.apache.tomcat.maven</groupId>
         <artifactId>tomcat6-maven-plugin</artifactId>
          <version>2.0</version>
          <configuration>
				<url>http://localhost:8080/manager</url>
				<server>tomcat</server>
				<!--  <uriEncoding>utf-8</uriEncoding> -->
        		<warSourceDirectory>WebContent</warSourceDirectory> 
				
		  </configuration>
    </plugin>
Maven安装目录下settings.xml文件添加如下：

	  <server>
		<id>tomcat</id>
		<username>tomcat</username>
		<password>tomcat</password>
	  </server>
   其中<id>tomcat</id> 与pom.xml 文件中<server>tomcat</server> 要一致

 	
- 进入“系统管理”->“插件管理”
		
	1.选择“可选插件”tab页，找到“Deploy to container Plugin”插件并安装，为
	 Jenkins部署tomcat工程所用
		

- 回到Jenkins首页，点击“新Job”，输入job名称如：MavenWeb，选择“构建一个maven2/3项目”
- 选择任务“MavenWeb”，点击“配置”进入任务配置界面，源代码管理中选择git,并输入仓库路径如：/home/git/MavenWeb/mytest，Branches to build根据自己需要输入，这里我取得主分支代码，输入的为master
- “构建触发器”选择项下我选择的为“Poll SCM”，含义为在指定作业时间内有代码更新的时候去取代码，这里”Build periodically“含义为不管是否有代码更新在指定作业时间内都去取代码，”Build whenever a SNAPSHOT dependency is built“含义为当构建成功后，项目jar包会发到maven二方库上去
-”日程表“我这里配的是*/1 * * * *，代表每隔一分钟取一次，这里五个 * 号从左到右分别
  分 时 日 月 年，相同 * 号段内用”,“号隔开，如：* * 8,20 * * *含义为每天8点、20点取代码
-”构建后操作“Editable Email NOtification” 其中Project Recipient List
 可以配置收件人信箱，点击“高级”，“Add a Trigger”中可以选择对应触发器，我这里用到了构建失败(Failure),和测试报错(系统不稳定Unstable)两项，收件人选择了“Send To Recipient List”和提交者“Send To Committers”

- “Deploy war/ear to a container” 中“WAR/EAR files”输入target/mytest.war，“Context path”输入MyApp（为项目访问contextPath），“Container”我这里用的tomcat6，所以选择tomcat6，“Tomcat URL”中输入tomcat访问地址如：http://192.168.4.19:8001
- git上建立仓库将本地现有Maven+junit web项目push到git仓库，打开Jenkins主页进入MavenPrj任务，几分钟后就能看到构建任务及结果，
- 构建成功后输入http://192.168.4.19:8001/MyApp即可访问项目首页
