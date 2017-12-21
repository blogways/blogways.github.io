---
layout: post
title: spring-cloud1:服务注册与发现
category: ['spring-cloud']
tags: ['spring-cloud', '微服务']
author: 钱文旭
email:
description: spring-cloud1:服务注册与发现
---

|  |  *目 录* |
| --- | --- |
| 1 | [spring cloud简介](#spring-cloud) |
| 2 | [微服务架构](#mircro-service) |
| 3 | [服务注册与发现](#service-register) |

## 一、spring cloud简介<a href="spring-cloud"></a>
Spring Cloud是一个基于Spring Boot实现的云应用开发工具，它为基于JVM的云应用开发中涉及的配置管理、服务发现、断路器、智能路由、微代理、
控制总线、全局锁、决策竞选、分布式会话和集群状态管理等操作提供了一种简单的开发方式。

Spring Cloud包含了多个子项目（针对分布式系统中涉及的多个不同开源产品），比如：Spring Cloud Config、Spring Cloud Netflix、Spring
 Cloud0 CloudFoundry、Spring Cloud AWS、Spring Cloud Security、Spring Cloud Commons、Spring Cloud Zookeeper、Spring 
 Cloud CLI等项目。
 
## 二、微服务架构<a href="mircro-service"></a>
“微服务架构”在这几年非常的火热，以至于关于微服务架构相关的开源产品被反复的提及（比如：netflix、dubbo），Spring Cloud也因Spring社区
的强大知名度和影响力也被广大架构师与开发者备受关注。

那么什么是“微服务架构”呢？简单的说，微服务架构就是将一个完整的应用从数据存储开始垂直拆分成多个不同的服务，每个服务都能独立部署、独立
维护、独立扩展，服务与服务间通过诸如RESTful API的方式互相调用。

对于“微服务架构”，大家在互联网可以搜索到很多相关的介绍和研究文章来进行学习和了解。也可以阅读始祖Martin Fowler的[《Microservices》](https://martinfowler.com/articles/microservices.html)
（中文版翻译[点击查看](https://www.cnblogs.com/zgynhqf/p/5323056.html)），本文不做更多的介绍和描述。

## 三、服务注册与发现<a href="service-register"></a>

Spring Cloud为服务治理做了一层抽象接口，所以在Spring Cloud应用中可以支持多种不同的服务治理框架，比如：Netflix Eureka、Consul、
Zookeeper。在Spring Cloud服务治理抽象层的作用下，我们可以无缝地切换服务治理实现，并且不影响任何其他的服务注册、服务发现、
服务调用等逻辑。
下面我们介绍用eureka和consul来实现服务治理。
### 3.1 Spring Cloud Eureka
Spring Cloud Eureka是Spring Cloud Netflix项目下的服务治理模块。而Spring Cloud Netflix项目是Spring Cloud的子项目之一，主要内容
是对Netflix公司一系列开源产品的包装，它为Spring Boot应用提供了自配置的Netflix OSS整合。通过一些简单的注解，开发者就可以快速的在应用
中配置一下常用模块并构建庞大的分布式系统。它主要提供的模块包括：服务发现（Eureka），断路器（Hystrix），智能路由（Zuul），客户端
负载均衡（Ribbon）等。

下面，就来具体看看如何使用Spring Cloud Eureka实现服务治理。

1. 创建服务中心
创建一个maven工程，pom文件里写入
```
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.6.RELEASE</version>
    </parent>

    <groupId>sc.learn.dalston</groupId>
    <artifactId>micro-service01</artifactId>
    <version>1.0-SNAPSHOT</version>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>Dalston.RELEASE</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```
在此工程下新建module，eureka-server
```
        <parent>
            <artifactId>micro-service01</artifactId>
            <groupId>sc.learn.dalston</groupId>
            <version>1.0-SNAPSHOT</version>
        </parent>
        <modelVersion>4.0.0</modelVersion>
    
        <artifactId>eureka-server</artifactId>
    
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-starter-eureka-server</artifactId>
            </dependency>
        </dependencies>
```
通过`@EnableEurekaServer`注解启动一个服务注册中心提供给其他应用进行对话。
```
@SpringBootApplication
@EnableEurekaServer
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```
在`application.properties`配置文件中增加如下信息：
```
server.port=1111

eureka.instance.hostname=localhost
eureka.client.register-with-eureka=false
eureka.client.fetch-registr=false
eureka.client.serviceUrl.defaultZone=http://${eureka.instance.hostname}:${server.port}/eureka/
```
在默认设置下，该服务注册中心也会将自己作为客户端来尝试注册它自己，我们通过
`eureka.client.register-with-eureka=false`配置禁止客户端注册自己。

启动程序后访问：[http://localhost:1111/](http://localhost:1111/),可以看到下面的页面。此时还没有发现任何服务注册。
![1](/images/qianwx/sc-learn/sc-learn-eureka-no-ins.png)
2. 创建provider
下面我们创建提供服务的客户端，并向服务注册中心注册自己。
创建新module：provider-eureka
```
    <parent>
        <artifactId>micro-service01</artifactId>
        <groupId>sc.learn.dalston</groupId>
        <version>1.0-SNAPSHOT</version>
    </parent>
    <modelVersion>4.0.0</modelVersion>

    <artifactId>provider-eureka</artifactId>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-eureka</artifactId>
        </dependency>
    </dependencies>
```
创建controller：
```
@RestController
public class HelloController {

    private final Logger logger = Logger.getLogger(getClass().getName());

    @Autowired
    DiscoveryClient discoveryClient;

    @RequestMapping(value = "/hello", method = RequestMethod.GET)
    public String index() {
        logger.info("/hello service_id:" + discoveryClient.getServices());
        return "Hello world!";
    }
}
```
在应用主类中通过加上`@EnableDiscoveryClient`注解，该注解能激活Eureka中的DiscoveryClient实现。
```
@SpringBootApplication
@EnableDiscoveryClient
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class,args);
    }
}
```
在`application.properties`中增加配置
```
server.port=2222
spring.application.name=hello-service
eureka.client.serviceUrl.defaultZone=http://localhost:1111/eureka/
```
启动应用，并刷新[http://localhost:1111](http://localhost:1111),可以看到新增了HELLO-SERVICE实例。
![2](/images/qianwx/sc-learn/sc-learn-eureka-ins.png)

### 3.2 Spring Cloud Consul
Spring Cloud Consul项目是针对Consul的服务治理实现。Consul是一个分布式高可用的系统，它包含多个组件，但是作为一个整体，
在微服务架构中为我们的基础设施提供服务发现和服务配置的工具。它包含了下面几个特性：
    * 服务发现
    * 健康检查
    * Key/Value存储
    * 多数据中心

1. 服务中心
consul自身提供了服务端，我们不需要创建类似于eureka-server的module。通过命令启动consul服务端：
```consul agent -dev```
访问[http://localhost:8500](http://localhost:8500)
![3](/images/qianwx/sc-learn/sc-learn-consul-no-ins.png)
2. provider
同上面的`provider-eureka`一样，我们只需更改pom文件里的依赖和application.properties的一些配置即可。
```
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-consul-discovery</artifactId>
    </dependency>
```
pom里将eureka的依赖改为consul的依赖。
```
server.port=3333
spring.application.name=hello-service
spring.cloud.consul.host=127.0.0.1
spring.cloud.consul.port=8500
```
application。properties修改端口为3333，同时将注册中心改为consul的服务。
启动应用，刷新[http://localhost:8500](http://localhost:8500)，结果如图：
![4](/images/qianwx/sc-learn/sc-learn-consul-ins.png)
可以看到hello-service注册成功。
