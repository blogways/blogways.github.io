---
layout: post
title: Apache Commons Chain 简单介绍
category: Apache
tags: ['Apache Commons', 'chain']
author: 陈龙
email: chenlong@asiainfo.com
description: 简单介绍 Apache Commons Chain 的用法 
---

## 一、Commons Chain 介绍
`Chain of Responsibility（CoR）`模式也叫职责链模式或者职责连锁模式，是由GoF提出的23种软件设计模式的一种。Chain of Responsibility模式是行为模式之一，该模式构造一系列分别担当不同的职责的类的对象来共同完成一个任务，这些类的对象之间像链条一样紧密相连，所以被称作职责链模式。

`Apache Commons Chain` 提供了对CoR模式的基础支持，简化和促进了实际应用CoR模式。CommonsChain实现了Chain of Responsebility和Command模式，其中的Catalog + 配置文件的方式使得调用方和Command的实现方的耦合度大大的降低，提高了灵活性。

## 二、Apache Commons Chain 核心组件
![apacheCommonsChain1 .jpg](/images/chenlong/apacheCommonsChain1.jpg)

### 1、 Context接口
`Context`表示命令执行的上下文，在命令间实现共享信息的传递。
extends Map,父接口是Map，它只是一个标记接口。ContextBase实现了Context。对于web环境，可以使用WebContext类及其子类（FacesWebContext、PortletWebContext和ServletWebContext）。
### 2、Command接口
Commons Chain中最重要的接口，表示在Chain中的具体某一步要执行的命令。它只有一个方法：boolean execute(Context context)。如果返回true，那么表示Chain的处理结束，Chain中的其他命令不会被调用；返回false，则Chain会继续调用下一个Command，直到：
-  Command返回true；
-  Command抛出异常；
-  Chain的末尾；
### 3、Chain接口
它表示“命令链”，chain of command,要在其中执行的命令，需要先添加到Chain中，父接口是Command , ChainBase实现了它。
### 4、Filter接口
extends Command，它是一种特殊的Command。除了Command的execute方法之外，还包括了一个方法：boolean postProcess(Context context, Exception exception)。Commons Chain会在执行了Filter的execute方法之后，执行postprocess（不论Chain以何种方式结束）。Filter的执行execute的顺序与Filter出现在Chain中出现的位置一致，但是执行postprocess顺序与之相反。如：如果连续定义了filter1和filter2，那么execute的执行顺序是：filter1 -> filter2；而postprocess的执行顺序是：filter2 -> filter1。
### 5、Catalog接口
它是逻辑命名的Chain和Command集合。通过使用它，Command的调用者不需要了解具体实现Command的类名，通过配置文件类加载chain of command 或者command。通过catalog.getCommand(commandName)获取Command。 
## 三、Commons Chain 基本使用
现在，我们模拟一个购车的例子来看一下chain是工作实现。购车分为：`用户信息的获取`、`试车`、`销售讨论`、`付款`以及`结束交易`。
五个工作类如下：

**1. GetUserInfo.class**

  ![getUserInfo.png](/images/chenlong/getUserInfo.png)
  
**2. TestDriver.class**

  ![testDriver.png](/images/chenlong/testDriver.png)
  
**3. NegotiateSale.class**

  ![NegotiateSale.png](/images/chenlong/NegotiateSale.png)

**4. ArrangeFinancing.class**

  ![ArrangeFinancing.png](/images/chenlong/ArrangeFinancing.png)
  
**5. CloseSale.class**

 ![CloseSale.png](/images/chenlong/closeSale.png)
 
另外，我们也顺便在添加两个Filter进去，filter代码如下：

- Filter1.class

 ![filter1.png](/images/chenlong/filter1.png) 

- Filter2.class

 ![filter2.png](/images/chenlong/filter2.png) 

###       要运行上述的流程可以有两种方式，分别是采用配置文件和使用注册命令来运行chain。
首先，我们采用注册命令来运行，代码如下：

 ![commandChain.png](/images/chenlong/commandChain.png)
 
 运行结果为：
 
 ![result1.png](/images/chenlong/result1.png)
 
 通过运行结果可以看出chain链运行的顺序是按照添加command的顺序执行的，而且Filter的执行execute的顺序与Filter出现在Chain中出现的位置一致，但是执行postprocess顺序与之相反。如：如果连续定义了filter1和filter2，那么execute的执行顺序是：filter1 -> filter2；而postprocess的执行顺序是：filter2 -> filter1。
 
 其次，我们再使用配置文件加载Command。
  对于复杂的Chain，可能需要使用内嵌的Chain，内嵌Chain可以类比一个子过程。此时，可以使用LookupCommand。假设其中的testCommand成为一个子过程,其代码为
  
   ![testCommand.png](/images/chenlong/testCommand.png)
   
 扩展后的配置文件为：
 
  ![chaincfg.png](/images/chenlong/chaincfg.png)
  
  装配文件的代码如下：
  
  ![cataLogLoader1.png](/images/chenlong/cataLogLoader1.png)
  
  运行结果为：
  
 ![result2.png](/images/chenlong/result2.png)
 
 配置文件的引入，使得Commons Chain的灵活性大大的提高。在实际的使用过程中，存在着同一个Command被多个Chain使用的情形。如果每次都书写Command的类名，尤其是前面的包名特别长的情况下，是一件比较麻烦而又费时费力的一件事。而`<define>`的使用就解决这样的麻烦。通过定义Command和Chain的别名，来简化书写。上面的配置文件，可以书写成：
  
  ![chain-cfg2.png](/images/chenlong/chain-cfg2.png)
  
## 总结：

Commons Chain实现了Chain of Responsebility和Command模式，其中的Catalog + 配置文件的方式使得调用方和Command的实现方的耦合度大大的降低，提高了灵活性。对于配置文件，通常可以：

  -   作为Command的索引表，需要时按名字索引创建实例。
  -   利用Chain以及内嵌Chain，完成一组连续任务和Command的复用，引入Filter可以获得与Servlet Filter一样的好处。
  -    使用<define>定义别名，简化书写。  