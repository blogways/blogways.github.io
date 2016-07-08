---
layout: post
category: Java
title: Java项目代码编写规范
tags: ['java代码规范', 'checkStyle', 'Eclipse', 'Checkclipse']
author: 汤仕忠
email: tangsz@asiainfo.com
# image:
description: Checkstyle是一款检查java程序代码样式的工具，可以有效的帮助我们检视代码以便更好的遵循代码编写标准，特别适用于小组开发时彼此间的样式规范和统一,通过将CheckStyle的检查引入到项目构建中，可以强制让项目中的所有的开发者遵循制定规范，不是仅仅停留在纸面上。Checkstyle提供了高可配置性，以便适用于各种代码规范，所以除了可以使用它提供的sun的代码标准外，你也可以定制自己的标准。
---

## 一、Checkclipse插件安装

Checkclipse是一个Eclipse插件，它集成了Checkstyle的样式检查器的编码准则到Eclipse中。所有的Java风格的违规行为将被立即报告错误标记。可以为每个项目单独配置编码准则。

1、下载checkclipse jar 包文件[http://sourceforge.jp/projects/sfnet_checkclipse/](http://sourceforge.jp/projects/sfnet_checkclipse/ "checkclipse.jar")

2、安装Checkclipse

这里我通过Help->Software Updates->Find and Insta方式安装了好几次没有成功，最终选择下载插件jar包方式安装，我下载的是上面链接打开后列表中的de.mvmsoft.checkclipse_3.0.0.b201310301757.jar，下载后将jar包放到Eclipse安装目录plugins目录下，重新启动Eclipse在Windows—>preferences下找到checkclipse，如图：


![](/images/checkclipse.jpg)


## 二、 配置eclipse-java-google-style.xml

这里eclipse-java-google-style.xml对Google原始Eclipse Formatter文件进行了部分修改，所以大家不要下载Google原始文件，就用本文提供的eclipse-java-google-style.xml。

1、eclipse-java-google-style.xml内容：[eclipse-java-google-style.xml](/xml/eclipse-java-google-style.xml "eclipse-java-google-style.xml")


2、配置eclipse-java-google-style.xml到Eclipse中


![](/images/eclipse-java-google-style.xml.png)



## 三、 配置Java默认生成模板

1、在Windows->preferences->Java->Code Style->Code Templates下新增文件默认生成模板：

![](/images/JavaFileTemplate.png)


2、新建Java类时选择Generater comments

![](/images/testTemplate.png)



## 四、 checkStyle文件编写及配置

### 1、checkStyle文件编写

这里提供已经编写好的文件，内容[checkstyle.xml](/xml/checkstyle.xml "checkstyle.xml")


### 2、checkStyle文件配置
   
a、Checkclipse配置

![](/images/checkclispeSet.png)

勾选Set Project Dir as Checkjstyle Basedir，CheckStyle Configuration File选择上面编写的checkStyle.xml文件

b、选择你要进行checkstyle的项目文件，选择Project->properties

![](/images/CheckProject.png)

勾选Enable CheckStyle、Set Project ClassLoader。

c、ok，可以进行Java代码编写了，此时如果没有按照checkStyle.xml里配置的规范要求编写代码，Eclipse中将给出错误提示：

![](/images/CheckStyleTest.png)



## 四、 checkStyle Maven 插件使用

checkStyle的maven插件名为maven-checkstyle-plugin，用于执行CheckStyle task，以下列出具体使用方法：



### 1、maven pom 文件配置

	<build>
	  <plugins>
		  <plugin>
		    <groupId>org.apache.maven.plugins</groupId>
		    <artifactId>maven-checkstyle-plugin</artifactId>
		    <version>2.10</version>
		    <configuration>
		        <configLocation>D:\codingStandards\checkstyle.xml</configLocation>
		    </configuration>
		    <executions>
		        <execution>
		            <id>checkstyle</id>
		            <phase>validate</phase>
		            <goals>
		                <goal>check</goal>
		            </goals>
		            <configuration>
		                <failOnViolation>true</failOnViolation>
		            </configuration>
		        </execution>
		    </executions>
		  </plugin>
	   </plugins>
   </build>

其中D:\codingStandards\checkstyle.xml即为上面我们编写的checkstyle规范文件

### 2、运行checkstyle检查

命令行下执行mvn checkstyle:checkstyle 或直接通过Eclipse插件中 Maven test等执行方法，我用的Maven test

### 3、检查checkstyle结果

运行maven命令后可以在console里查看checkstyle运行结果。

	[INFO] BUILD FAILURE
	[INFO] ------------------------------------------------------------------------
	[INFO] Total time: 22.926s
	[INFO] Finished at: Thu Sep 18 09:28:04 CST 2014
	[INFO] Final Memory: 5M/9M
	[INFO] ------------------------------------------------------------------------
	[ERROR] Failed to execute goal org.apache.maven.plugins:maven-checkstyle-plugin:2.10:check 

    (checkstyle) on project maven-script-test: You have 1 Checkstyle violation. -> [Help 1]
	[ERROR] 
	[ERROR] To see the full stack trace of the errors, re-run Maven with the -e switch.
	[ERROR] Re-run Maven using the -X switch to enable full debug logging.
	[ERROR] 
	[ERROR] For more information about the errors and possible solutions, please read the following articles:
	[ERROR] [Help 1] http://cwiki.apache.org/confluence/display/MAVEN/MojoFailureException

checkstye的详细结果信息被存放在target/checkstyle-result.xml中。下面是具体信息：

	<?xml version="1.0" encoding="UTF-8"?>
	<checkstyle version="5.6">
	<file name="D:\workspace\maven-script-test\src\main\java\javassisttest\Test1.java">
	<error line="22" severity="error" message="Line is longer than 120 characters (found 124)."  source="

	com.puppycrawl.tools.checkstyle.checks.sizes.LineLengthCheck"/>
	</file>
	<file name="D:\workspace\maven-script-test\src\main\java\mveltest\GetNameTest.java">
	</file>
	<file name="D:\workspace\maven-script-test\src\main\java\mveltest\MvelTest.java">
	<error line="9" severity="warning" message="Wrong order for &apos;org.mvel2.MVEL&apos; import."  source=

    "com.puppycrawl.tools.checkstyle.checks.imports.ImportOrderCheck"/>
	</file>
	</checkstyle>

从中我们可以看出 Test1.java 22行有一个行字符数超过120的错误，MvelTest.java 9行有个提示。


### 4、对指定文件不检查

对上面例子中行超过了120字符。如果我们不想修复这个错误怎么办那？可以将其suppress掉。
方法是建立一个checkstyle-suppressions.xml文件。其中加入下述内容：
	
	<?xml version="1.0"?>
	
	<!DOCTYPE suppressions PUBLIC
	        "-//Puppy Crawl//DTD Suppressions 1.0//EN"
	        "http://www.puppycrawl.com/dtds/suppressions_1_0.dtd">
	
	<suppressions>
	    <suppress checks="LineLengthCheck"
	              files="Test1.java"
	              />
	</suppressions>

然后在pom文件<configuration>节点内checkstyle.xml配置下面加入checkstyle-suppressions.xml配置，如：

	<configuration>
        <configLocation>D:\codingStandards\checkstyle.xml</configLocation>
        <suppressionsLocation>D:\codingStandards\checkstyle-suppressions.xml</suppressionsLocation>
    </configuration>


现在再运行看看：

	[INFO] --- maven-surefire-plugin:2.10:test (default-test) @ maven-script-test ---
	[INFO] Surefire report directory: D:\workspace\maven-script-test\target\surefire-reports
	
	-------------------------------------------------------
	 T E S T S
	-------------------------------------------------------
	
	Results :
	
	Tests run: 0, Failures: 0, Errors: 0, Skipped: 0
	
	[INFO] ------------------------------------------------------------------------
	[INFO] BUILD SUCCESS
	[INFO] ------------------------------------------------------------------------
	[INFO] Total time: 3.956s
	[INFO] Finished at: Thu Sep 18 10:08:12 CST 2014
	[INFO] Final Memory: 6M/11M
	[INFO] ------------------------------------------------------------------------

OK！运行没有异常了，刚刚的行限制被跳过了。
