---
layout: post
category: 杂记
title: 在Eclipse中创建Maven多模块工程的例子[20150428更新]
tags: ['Maven', '多模块', '聚合']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: 如果，你需要创建多个项目，项目之间即独立又有关系，那么创建一个Maven多模块项目是个非常好的选择，也非常cool！怎么在Eclipse里面创建多模块工程，以及需要注意哪些地方，我在这里做个简单的介绍

---

如果，你需要创建多个项目，项目之间即独立又有关系，那么创建一个Maven多模块项目是个非常好的选择，也非常cool！怎么在Eclipse里面创建多模块工程，以及需要注意哪些地方，我在这里做个简单的介绍。

### 一、准备

若想在Eclipse里面做这些的话，那么在做这一切前，请确认你是否已经在eclipse里面安装了maven插件。如果没有装插件，那只能通过命令行去做了。

好，现在假设已经在Eclipse里面装了maven插件，那么我们一起用Eclipse来创建Maven多模块项目吧！

### 二、先创建父项目

1. 在Eclipse里面New -> `Maven Project`；
2. 在弹出界面中选择“Create a simple project”
3. 设置工程的参数，见下图<br/>![Params Settings](/images/post/maven-modules1.png)
    
    * Group Id: com.example
    * Artifact Id: multi-modules-demo
    * <span style="color:red">Packaging: pom</span>
    * Name: Multi Modules Demo
    
4. 点击完成

这样，我们就按常规模版创建了一个Maven工程。我们还需要对这个工程进行修改。

因为，这是一个父项目，不需要有什么源码，那么，我们在Eclipse中将这个工程下的不用的目录都删除，仅留下`pom.xml`文件就行了。


### 三、创建子项目

1. 选中刚建的父项目，在弹出菜单中点击 New -> `Maven Module`;
2. 如图配置<br/>![child settings](/images/post/maven-modules3.png)
3. 使用默认的Archetype（默认：GroupId:org.apache.maven.archetypes,Artifact Id:maven-archetype-quickstart）
4. 完成工程配置，见下图<br/>![Params Settings](/images/post/maven-modules4.png)
5. 点击完成


这样一个子项目就创建完成了，在文件系统中，子项目会建在父项目的目录中。在父目录中运行`mvn test`等命令，所有的子项目都会按顺序执行。

细心一点的人，可能会发现，通过这个步骤创建子项目的同时，会修改父项目的`pom.xml`，增加了类似下面的信息：

    <modules>
  	    <module>module-children1-demo</module>
    </modules>

这个信息，就是标记有哪些子模块。

重复创建子项目的步骤，可以创建多个子项目。


### 四、优化配置

虽然上面的步骤，可以完成多模块的创建，但是创建出来的多模块，在一个程序员的眼里，还是挺别扭的，怎么回事呢？对，存在重复。那让我们重构吧。

按上面步骤创建的子项目，在`pom.xml`中有个`parent`节点，所以，他可以继承父项目的相关信息。没错，父子项目中存在继承关系。

在子项目的`pom.xml`中，子项目的`groupId`和`version`一般和父项目相同，那么可以把子项目的这两个参数删除，这样会自动继承父项目的取值。

同样，如果其他的一些属性，所有子项目都是一样的，那么可以上移到父项目中设置，子项目中无需重复设置。比如：`<project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>`可以仅在父项目中设置一次。

除了这种情况以外，还有一种情况，就是依赖和插件。依赖和插件的情况是这样，某一个依赖或插件可能会被大部分子项目所使用，但是也可能有些子项目不需要使用，这样使用上述的方式，简简单单地进行继承就不合适了。

Manen提供`dependencyManagement`和`pluginManagement`两个标签。使用这两个标签，可以在父项目中统一管理依赖和插件的配置参数，比如版本号啥的。而在子项目中，仅需列出需要使用的依赖和插件的`groupId`和`artifactId`就可以了，其他信息会自动从父项目管理的信息里面获取。


看例子，父项目中：

	<dependencyManagement>
      <dependencies>
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>${junit.version}</version>
            <scope>test</scope>
        </dependency>
        <dependency>
	        <groupId>org.slf4j</groupId>
	        <artifactId>slf4j-log4j12</artifactId>
	        <version>1.7.5</version>
	        <scope>test</scope>
	    </dependency>
	    <dependency>
	        <groupId>org.slf4j</groupId>
	        <artifactId>slf4j-api</artifactId>
	        <version>1.7.5</version>
	    </dependency>   
      </dependencies>
    </dependencyManagement>
    
  在子项目中：
  
    <dependencies>
      <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
      </dependency>
    </dependencies>
    
### 四、命令行创建

上面就是在Eclipse里面创建多模块的步骤，和一些优化配置。

其中，具体的步骤可以根据实际情况进行适当的修改，比如选择`Archetype`时，可以根据需要，选择适当的`Archetype`。

上述步骤中的一些环节，也可以先通过命令行来生成雏形，然后再修改`pom.xml`来实现。

相关命令为:

	mvn archetype:generate -DarchetypeCatalog=internal -DarchetypeGroupId=org.apache.maven.archetypes -DarchetypeArtifactId=maven-archetype-quickstart
	
工程创建后需要修改`pom.xml`.修改方式，可以参考上面说到的内容。