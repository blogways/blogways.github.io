---
layout: post
title: Spring Boot 入门（一） -- 5分钟构建Spring Web Rest风格的Hello World
category: ['Spring']
tags: ['Spring', 'Web','Spring Boot']
author: 刘益伟
email: liuyw6@asiainfo.com
description: Spring Boot 入门（一） -- 5分钟构建Spring Web Rest风格的Hello World
---

|  |  *目 录* |
| --- | --- |
| 1 | [什么是Spring Boot](#1st) |
| 2 | [快速搭建Spring Web](#2nd) |
| 3 | [融合Swagger](#3nd) |

<a id="1st"></a>

## 一、什么是Spring Boot
	
#### Spring Boot 的目的在于快速创建可以独立运行的 Spring 应用。通过 Spring Boot 可以根据相应的模板快速创建应用并运行。Spring Boot 可以自动配置 Spring 的各种组件，并不依赖代码生成和 XML 配置文件。Spring Boot 可以大大提升使用 Spring 框架时的开发效率。

### 而Spring Boot 包含的特性如下：

#### 1.创建可以独立运行的 Spring 应用。

#### 2.直接嵌入 Tomcat 或 Jetty 服务器，不需要部署 WAR 文件。

#### 3.提供推荐的基础 POM 文件来简化 Apache Maven 配置。

#### 4.尽可能的根据项目依赖来自动配置 Spring 框架。

#### 5.提供可以直接在生产环境中使用的功能，如性能指标、应用信息和应用健康检查。

#### 6.没有代码生成，也没有 XML 配置文件。


<a id="2nd"></a>

## 二、快速搭建Spring Web

#### 第一节描述了Spring Boot的作用，此节将通过一个实例快速搭建Spring Web

### 首先通过Maven新建一个工程，并在pom.xml中添加如下代码

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.asiainfo.springboot</groupId>
    <artifactId>com.asiainfo.springboot</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>
    <properties>
        <spring.boot.version>1.1.4.RELEASE</spring.boot.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
            <version>${spring.boot.version}</version>
        </dependency>
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger-ui</artifactId>
            <version>2.2.2</version>
        </dependency>
        <dependency>
            <groupId>io.springfox</groupId>
            <artifactId>springfox-swagger2</artifactId>
            <version>2.2.2</version>
        </dependency>
    </dependencies>

    <build>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <executions>
                <execution>
                    <goals>
                        <goal>repackage</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
        <plugin>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <source>1.7</source>
                <target>1.7</target>
            </configuration>
        </plugin>
    </plugins>
    </build>

</project>

``` 

#### 1.其中spring-boot-starter-web为Web应用所需要的依赖，相比与其它的应用简化了太多；并不是声明了spring-boot-starter-web就不需要其它的包，而是Spring boot自动做了关联；打开工程的关联library即可查看到

#### 2.springfox-swagger-ui\springfox-swagger2 为Swagger依赖包，在下面的章节中会具体讲解

### 配置好pom.xml后，开始创建程序主入口，代码如下

``` 
@RestController
@EnableAutoConfiguration
public class Application {
 @RequestMapping("/")
 String home() {
 return "Hello World!";
 }
 public static void main(String[] args) throws Exception {
 SpringApplication.run(Application.class, args);
 }
}
```

#### 通过运行Application，即可运行一个独立的 Web 应用（默认使用的Tomcat服务器），访问“http://localhost:8080”可以看到页面上显示“Hello World!”，也就是说，只需要简单的 2 个文件就可以启动一个独立运行的 Web 应用。并不需要额外安装 Tomcat 这样的应用服务器，也不需要打包成 WAR 文件。

#### “@EnableAutoConfiguration”注解的作用在于让 Spring Boot 根据应用所声明的依赖来对 Spring 框架进行自动配置

#### 注解“@RestController”和”@RequestMapping”由 Spring MVC 提供，用来创建 REST 服务。这两个注解和 Spring Boot 本身并没有关系。

### Spring Boot 除了spring-boot-starter-web标签以外，还有很多标签，详细如下表格

``` 
名称  说明
spring-boot-starter 核心 POM，包含自动配置支持、日志库和对 YAML 配置文件的支持。
spring-boot-starter-amqp    通过 spring-rabbit 支持 AMQP。
spring-boot-starter-aop 包含 spring-aop 和 AspectJ 来支持面向切面编程（AOP）。
spring-boot-starter-batch   支持 Spring Batch，包含 HSQLDB。
spring-boot-starter-data-jpa    包含 spring-data-jpa、spring-orm 和 Hibernate 来支持 JPA。
spring-boot-starter-data-mongodb    包含 spring-data-mongodb 来支持 MongoDB。
spring-boot-starter-data-rest   通过 spring-data-rest-webmvc 支持以 REST 方式暴露 Spring Data 仓库。
spring-boot-starter-jdbc    支持使用 JDBC 访问数据库。
spring-boot-starter-security    包含 spring-security。
spring-boot-starter-test    包含常用的测试所需的依赖，如 JUnit、Hamcrest、Mockito 和 spring-test 等。
spring-boot-starter-velocity    支持使用 Velocity 作为模板引擎。
spring-boot-starter-web 支持 Web 应用开发，包含 Tomcat 和 spring-mvc。
spring-boot-starter-websocket   支持使用 Tomcat 开发 WebSocket 应用。
spring-boot-starter-ws  支持 Spring Web Services。
spring-boot-starter-actuator    添加适用于生产环境的功能，如性能指标和监测等功能。
spring-boot-starter-remote-shell    添加远程 SSH 支持。
spring-boot-starter-jetty   使用 Jetty 而不是默认的 Tomcat 作为应用服务器。
spring-boot-starter-log4j   添加 Log4j 的支持。
spring-boot-starter-logging 使用 Spring Boot 默认的日志框架 Logback。
spring-boot-starter-tomcat  使用 Spring Boot 默认的 Tomcat 作为应用服务器。

``` 

#### 其中每项功能的作用及Demo会在后续的博文中继续完善

<a id="3nd"></a>

## 三、融合Swagger实现API可视化

#### 上一节谈到 pom.xml中引入了springfox-swagger-ui\springfox-swagger2 这两个包，这2个包即为Swagger基础依赖包，引入后即可正常使用Swagger相关的功能，并且可以使用可视化界面

#### 这里将通过一个例子，了解如何添加API至Swagger中，首先先看工程结构图

![20160912img01](/images/liuyw6/20160912img01.png)

### 创建一个User对象，UserVo

``` 
package com.asiainfo.user.domain;

import io.swagger.annotations.ApiModelProperty;

/**
 * Created by liuyw on 16/9/7.
 */
public class UserVo{

    @ApiModelProperty(value="账户",required = true)
    private String account;
    @ApiModelProperty(value="姓名",required = true)
    private String name;
    @ApiModelProperty(value="昵称",required = true)
    private String nickName;

    public UserVo(String account,String name,String nickName){
        this.account = account;
        this.name = name;
        this.nickName = nickName;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNickName() {
        return nickName;
    }

    public void setNickName(String nickName) {
        this.nickName = nickName;
    }
}

``` 

#### @ApiModelProperty(value="昵称",required = true),此语句为Swagger提供给property的解释，在可视化界面中用于属性注视

### 创建一个Controller，暴露API接口，并返回User对象

``` 
package com.asiainfo.user;

import com.asiainfo.user.domain.UserVo;
import io.swagger.annotations.*;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by liuyw on 16/9/7.
 */
@RestController
@RequestMapping("/user")
@Api("userController相关api")
@EnableSwagger2
public class UserController {


    @ApiOperation("获取用户信息")
    @ApiImplicitParams({
            @ApiImplicitParam(paramType = "header", name = "username", dataType = "String", required = true, value = "用户的姓名", defaultValue = "zhaojigang"),
            @ApiImplicitParam(paramType = "query", name = "password", dataType = "String", required = true, value = "用户的密码", defaultValue = "wangna")
    })
    @ApiResponses({
            @ApiResponse(code = 400, message = "请求参数没填好"),
            @ApiResponse(code = 404, message = "请求路径没有或页面跳转路径不对")
    })
    @RequestMapping(value = "/getUser", method = RequestMethod.GET)
    public List<UserVo> getUser(@RequestHeader("username") String username, @RequestParam("password") String password) {
//        return userService.getUser(username,password);
        UserVo user1 = new UserVo("test01", "测试账户一", "真仙");
        UserVo user2 = new UserVo("test02", "测试账户二", "仙王");
        UserVo user3 = new UserVo("test03", "测试账户三", "仙帝");
        List<UserVo> list = new ArrayList<UserVo>();
        list.add(user1);
        list.add(user2);
        list.add(user3);
        return list;
    }

}

``` 

#### UserController提供了getUser方法，并对外暴露使用

#### @Api("userController相关api")、ApiOperation、ApiImplicitParams、ApiResponses均为Swagger语法，用以注视接口的作用，参数的传值说明，以及异常返回的说明等

#### @EnableSwagger2 标记了此Controller可以使用Swagger，若不填写，在可视化视图中将无法正常查询使用

### 创建运行主函数

``` 
package com.asiainfo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;

/**
 * Created by liuyw on 16/9/7.
 */
@EnableAutoConfiguration
@ComponentScan
public class Application {

    public static void main(String[] args) throws Exception {
        SpringApplication.run(Application.class, args);

    }


}
``` 

#### 运行Application,然后访问http://localhost:8080/swagger-ui.html,即可查看到UserController，如下图

![20160912img02](/images/liuyw6/20160912img02.png)


## 结束语

#### 本文主要从最基本的Spring Boot进行了描述，其中涉及到深层次的内容，如服务器部署、集群、数据库连接；spring boot其它的标签介绍等；这些内容会在后续的博文中依次介绍，谢谢