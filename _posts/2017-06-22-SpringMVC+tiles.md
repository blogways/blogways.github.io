---
layout: post
title: SpringMVC 整合Tiles框架的简单使用
category: ['Apache', 'tiles']
tags: ['Apache', 'tiles' ,'springMVC']
author: 陈龙
email: chenlong@asiainfo.com
description: SpringMVC 整合Tiles框架 
---

## Tiles简介
`Tiles`是一个JSP布局框架,为创建Web页面提供了一种模板机制，它能将网页的布局和内容分离。它用模板定义网页布局，每个页面模板都是一个简单的 JSP 页，它定义了一些由占位符组成的外形，以放置内容。执行时，Tiles 将会用相应的内容来替换占位符，因此，创建整个页面即形成布局。Tiles框架是建立在JSP的include指令基础上的，但它提供了比JSP的include指令更强大的功能。Tiles框架具有如下特性：  
- 创建可重用的模板
- 动态构建和装载页面
- 定义可重用的Tiles组件
- 支持国际化

Tiles的配置文件中的<tiles-definitions>标签内主要的子节点就是<definition>标签，这个标签属性如下：

名称 | 是否必须 | 值必须 | 值类型 | 说明
---|---|---|---|--
 name | true | true | java.lang.String | 指定将要创建的一个definition bean的访问名称。这个必须有的。
template | false | true  | java.lang.String | 用于指定模板文件
role | false | true | java.lang.String | 如果配置了这个值的话，需要role的值相等，这个definition才被有效访问
extends | false | true  | java.lang.String | 继承哪一个definition，值是你要继承的definition的name的值。高使用率的属性。
preparer | false | true  | java.lang.String | 使用时，要写一个实现他的Prepare接口的类，作用就是在展现你定义的页面前会先执行你的prepare。

## SpringMVC与Tiles的整合
首先，新建一个maven工程demo-tiles,在pom文件中引入该项目所需要的jar（tiles-extras和spring-webmvc），工程的结构如下：

![stru1.png](/images/chenlong/stru1.png)

我们要实现的页面布局如下：

![pic1.gif](/images/chenlong/pic1.gif)

### 1. 配置文件
在resources目录下新建spring和tiles的配置文件，并在web.xml中进行sringmvc的相应配置。

![web1.png](/images/chenlong/web1.png)
![servletcontext.png](/images/chenlong/servletcontext.png)
![tilesdefinitions.png](/images/chenlong/tilesdefinitions.png)

### 2. 页面文件

![header.png](/images/chenlong/header.png)
![menu.png](/images/chenlong/menu.png)
![footer.png](/images/chenlong/footer.png)
![template.png](/images/chenlong/template.png)
![home.png](/images/chenlong/home.png)
![about.png](/images/chenlong/about.png)

### 3. java后台处理

![HomeController.png](/images/chenlong/HomeController.png)
![AboutController.png](/images/chenlong/AboutController.png)

### 4. 页面效果展示

![pic2.png](/images/chenlong/pic2.png)
![pic3.png](/images/chenlong/pic3.png)



