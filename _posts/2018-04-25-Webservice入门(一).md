---
layout: post
title: webservice入门(一)
category: ['webservice']
tags: ['webservice']
author: 陈龙
email: chenlong@asiainfo.com
description: webservice基础知识介绍
---
### 一、webservice基本概念
Web Service，即web服务，也叫XML Web Service WebService，它是一种跨编程语言和跨操作系统平台的远程调用技术即跨平台远程调用技术。是一种可以接收从Internet或者Intranet上的其它系统中传递过来的请求，轻量级的独立的通讯技术。是通过SOAP在Web上提供的软件服务，使用WSDL文件进行说明，并通过UDDI进行注册。

- **XML**：(Extensible Markup Language)扩展型可标记语言。面向短期的临时数据处理、面向万维网络，是Soap的基础。 

- **Soap**：(Simple Object Access Protocol)简单对象存取协议。是XML Web Service 的通信协议。当用户通过UDDI找到你的WSDL描述文档后，他通过可以SOAP调用你建立的Web服务中的一个或多个操作。SOAP是XML文档形式的调用方法的规范，它可以支持不同的底层接口，像HTTP(S)或者SMTP。 

- **WSDL**：(Web Services Description Language) WSDL 文件是一个 XML 文档，用于说明一组 SOAP 消息以及如何交换这些消息。大多数情况下由软件自动生成和使用。

- **UDDI** (Universal Description, Discovery, and Integration) 是一个主要针对Web服务供应商和使用者的新项目。在用户能够调用Web服务之前，必须确定这个服务内包含哪些商务方法，找到被调用的接口定义，还要在服务端来编制软件，UDDI是一种根据描述文档来引导系统查找相应服务的机制。UDDI利用SOAP消息机制（标准的XML/HTTP）来发布，编辑，浏览以及查找注册信息。它采用XML格式来封装各种不同类型的数据，并且发送到注册中心或者由注册中心来返回需要的数据。

### 二、调用原理

![webservice_01.png](/images/chenlong/wb_01.png)

完整webservices的实现步骤如下：  

- Web服务提供者设计实现Web服务，并将调试正确后的Web服务通过Web服务中介者发布，并在UDDI注册中心注册； （发布）

- Web服务请求者向Web服务中介者请求特定的服务，中介者根据请求查询UDDI注册中心，为请求者寻找满足请求的服务； （发现）

- Web服务中介者向Web服务请求者返回满足条件的Web服务描述信息，该描述信息用WSDL写成，各种支持Web服务的机器都能阅读；（发现）

- 利用从Web服务中介者返回的描述信息生成相应的SOAP消息，发送给Web服务提供者，以实现Web服务的调用；（绑定）

- Web服务提供者按SOAP消息执行相应的Web服务，并将服务结果返回给Web服务请求者。（绑定）

### 三、webservice开发规范

JAVA 中共有三种WebService 规范，分别是JAX-WS（JAX-RPC）、JAXM&SAAJ、JAX-RS。

下面来分别简要的介绍一下这三个规范。

##### 1、JAX-WS

`JAX-WS` 的全称为 Java API for XML-Based Webservices ，早期的基于SOAP 的JAVA 的Web 服务规范JAX-RPC（Java API For XML-Remote Procedure Call）目前已经被JAX-WS 规范取代。从java5开始支持JAX-WS2.0版本，Jdk1.6.0_13以后的版本支持2.1版本，jdk1.7支持2.2版本。

##### 2、1.1.1.1  JAXM&SAAJ

`JAXM（JAVA API For XML Message）`主要定义了包含了发送和接收消息所需的API，SAAJ（SOAP With Attachment API For Java，JSR 67）是与JAXM 搭配使用的API，为构建SOAP 包和解析SOAP 包提供了重要的支持，支持附件传输等，JAXM&SAAJ 与JAX-WS 都是基于SOAP 的Web 服务，相比之下JAXM&SAAJ 暴漏了SOAP更多的底层细节，编码比较麻烦，而JAX-WS 更加抽象，隐藏了更多的细节，更加面向对象，实现起来你基本上不需要关心SOAP 的任何细节。

##### 3、1.1.1.1 JAX-RS

`JAX-RS `是JAVA 针对REST(Representation State Transfer)风格制定的一套Web 服务规范，由于推出的较晚，该规范（JSR 311，目前JAX-RS 的版本为1.0）并未随JDK1.6 一起发行。

### 三、webservice的优缺点及应用场景

##### 优点 ：
- 采用xml支持跨平台远程调用。
- 基于http的soap协议，可跨越防火墙。
- 支持面向对象开发。
- 有利于软件和数据重用，实现松耦合。

##### 缺点 ：

由于soap是基于xml传输，本身使用xml传输会传输一些无关的东西从而效率不高，随着soap协议的完善，soap协议增加了许多内容，这样就导致了使用soap协议进行数据传输的效率不高。

##### 应用场景 ：

1. 宏观
>用于软件集成和复用
2. 微观
>用于公开接口服务，如：便民网站的天气查询接口、火车时刻查询接口等。
>用于内部接口服务，一个大的系统平台是由若干个系统组成，系统与系统之间存在数据访问需求，为了减少系统与系统之间的耦合性可以将接口抽取出来提供单独的接口服务供它系统调用。
>服务端已经确定使用webservice，客户端无法选择，只能使用webservice。








