---
layout: post
title: apache tiles布局框架的简单使用
category: [布局框架]
tags: ['aappach', 'tiles']
author: 张少勇
email: zhangsy10@asiainfo.com
description: appache tiles布局框架的简单使用
---

|  |  *目 录* |
| --- | --- |
| 1 | [appache tiles简介](#1st) |
| 2 | [appache tiles的优势](#2st) |
| 3 | [appache tiles的简单使用](#3st) |

<a id="1st"></a>

## 一、appache tiles的简介

####Apache Tiles是一个JavaEE应用的页面布局框架。Tiles框架提供了一种模板机制，可以为某一类页面定义一个通用的模板，该模板定义了页面的整体布局。布局由可以复用的多个块组成，每个页面可以有选择性的重新定义块而达到组件的复用。

####appache tiles一开始是appache Struts框架的组件之一，后来才被appache独立为一个独立项目。

#### tiles主要有以下几个特点：
* 1.模板机制的页面布局功能。
* 2.页面布局的重构机制，使用模板的页面，可以直接在JSP里使用Tiles提供的标签重新定义块元素，也可以使用类似tiles.xml等配置文件定义。
* 3.易于与Struts，Spring，SpringMVC，Shale，JSF等框架集成 。



## 二、appache tiles的优势
####大家都知道，在web开发中、我们可以通过include标签来动态的插入其它的jsp页面，这样能够让多个jsp页面共用一个jsp界面的内容，这个功能能够让我们在开发中节省很多时间，并且实用。

####如果有一天、我们需要把这个界面删除掉的话（或者说添加/修改一个界面），需要在每个jsp的引入位置把引入删除掉（添加/修改一个jsp界面），当然、这个处理听起来比较方便，但是如果有几百，几千个界面，估计人就想吐了，当然时间久了还是可以把他实现，

####而tiles则很方便的就可以让我们去实现这个操作，下面就一起来去看看这个tiles怎么去简单的实现，


## 二、appache tiles的简单使用

####在这里我使用的是SpringMVC+Tiles+Eclipse+Maven;
####非maven环境需要手动导入tiles和springmvc的互相依赖的包

####首先新建一个maven工程并且使用pom.xml导入包

  	tiles

	'<dependency>
 	 <groupId>org.apache.tiles</groupId>
 	 <artifactId>tiles-extras</artifactId>
 	 <version>3.0.5</version>
	</dependency>'

	SpringMVC

	<dependency>
 	 <groupId>org.springframework</groupId>
  	 <artifactId>spring-webmvc</artifactId>
 	 <version>4.3.3.RELEASE</version>
	</dependency>

####web.xml配置文件

	`<?xml version="1.0" encoding="UTF-8"?>
	<web-app xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://java.sun.com/xml/ns/javaee" xsi:schemaLocation="http://java.sun.com/xml/ns/javaee http://java.sun.com/xml/ns/javaee/web-app_2_5.xsd" version="2.5">
  	<servlet>
  		<servlet-name>tile</servlet-name>
  		<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
  	<init-param>
  		<param-name>contextConfigLocation</param-name>
  		<param-value>classpath:main.xml</param-value>
  	</init-param>
  	<load-on-startup>1</load-on-startup>
 	 </servlet>
  	<servlet-mapping>
	  	<servlet-name>tile</servlet-name>
	  	<url-pattern>*.do</url-pattern>
 	 </servlet-mapping>
	</web-app>`

####Spring配置文件

    `<!-- 配置组件扫描 -->
		<context:component-scan base-package="main"/>
		<!-- 配置mvc扫描 -->
		<mvc:annotation-driven/>
		<!-- 配置视图解析器 --> 
		<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
			<property name="prefix" value="/WEB-INF/"/>
			<property name="suffix" value=".jsp"/>
		</bean>
		<bean id="tilesViewResolver" class="org.springframework.web.servlet.view.tiles3.TilesViewResolver">
		<!--视图解析器的优先级--> 		
	 <property name="order" value="1" />
 		 </bean>
    	<!--加载tiles配置文件-->
		<bean id="tilesConfigurer" class="org.springframework.web.servlet.view.tiles3.TilesConfigurer">
        <property name="definitions">
            <list>
                <value>classpath:layout.xml</value>
            </list>
        </property>
	</bean>
	</beans>`

####tiles配置文件layout.xml

	`<?xml version="1.0" encoding="UTF-8" ?>
	<!DOCTYPE tiles-definitions PUBLIC
	   "-//Apache Software Foundation//DTD Tiles Configuration 3.0//EN"
	   "http://tiles.apache.org/dtds/tiles-config_3_0.dtd">
	<tiles-definitions>
	<!-- 主布局 -->
	<definition name="layout" template="mainLayout.jsp">
	</definition>
	<!-- 主布局 -->
	<!-- 项目 -->
	  <definition name="myView" extends="layout">
	 	<put-attribute name="a" value="/a.jsp" />
		<put-attribute name="b" value="/b.jsp" />
	</definition>
	<!--项目-->
	</tiles-definitions>`

####配置文件做完之后java代码处理

	`@RequestMapping("/test.do")
		protected String method(){
		return "myView";
		}`
	
####在webapp写上jsp页面（当然也可以在其他文件下面写上jsp界面，相应的配置文件的路径需要处理）
	mainLayout.jsp
	
	   <%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
	<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
	<%@ taglib uri="http://tiles.apache.org/tags-tiles-extras" prefix="tilesx" %>
	<div>
	  <tiles:insertAttribute name="a" />
	  <tiles:insertAttribute name="b" />
	</div>

####另外写上a.jsp  b.jsp文件，这是我们需要引入的两个jsp文件，其中内容可以随便写
	
#####最后部署到tomcat服务器之上，访问相应的路径（这里我的路径是http://localhost:8080/tiles/test.do），就可以看到组合的成的网页了！这是我自己组成的简单的界面

![111](/images/zhshyong/111.png)


####当然、这是死的界面、如果要灵活应用、则需要修改下配置文件
	
    `<!-- 主布局 -->
	<!-- 项目 -->
	  <definition name="myView" extends="layout">
	 	<put-attribute name="a" value="/a.jsp" />
	<!--${item}.jsp  item为传递过来的参数--!>
		<put-attribute name="item" expression="/${item}.jsp" />
	</definition>
	<!--项目-->
	</tiles-definitions>`
####组合界面mainLayout.jsp文件也需要修改一下
	<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
	<%@ taglib uri="http://tiles.apache.org/tags-tiles" prefix="tiles" %>
	<%@ taglib uri="http://tiles.apache.org/tags-tiles-extras" prefix="tilesx" %>
	<div>
	  <tiles:insertAttribute name="a" />
	  <tiles:insertAttribute name="item" />
	</div>

####请求也需要修改一下
	
	@RequestMapping("/test1.do")
	protected String ee(Model model){
		//传递的参数tigger则是对应的jsp文件的名称
		//也只需要修改这个位置就可以达到组合成其他的页面
		//不需要修改其它位置以及文件
		model.addAttribute("item", "tigger");
		return "myView";
	}

####这样再访问一次路径（http://localhost:8080/tiles/test1.do）


![222](/images/zhshyong/222.png)

####当修改参数
	@RequestMapping("/test1.do")
	protected String ee(Model model){
		//传递的参数tigger则是对应的jsp文件的名称
		//也只需要修改这个位置就可以达到组合成其他的页面
		//不需要修改其它位置以及文件
		model.addAttribute("item", "rabbit");
		return "myView";
	}

####再次访问http://localhost:8080/tiles/test1.do时候就有下图

![333](/images/zhshyong/333.png)


####这样拼成的界面会比较方便，而且修改起来也特别方便！以前干很久的事，现在几分钟就可以做完了。