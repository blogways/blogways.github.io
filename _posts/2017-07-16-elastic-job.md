---              
layout: post
category: ['Java']
title: 当当 Elastic-job定时调度
tags: ['java', 'spring', 'elastic-job']
author: 陈凡
email: chenfan@asiainfo.com
description: Elastic-job原本是当当Java应用框架ddframe的一部分，本名dd-job。ddframe包括编码规范，开发框架，技术规范，监控以及分布式组件。ddframe规划分为4个演进阶段，目前处于第2阶段。3、4阶段涉及的技术组件不代表当当没有使用，只是ddframe还未统一规划。
---

## 为什么需要作业调度

作业即定时任务。一般来说，系统可使用消息传递代替部分使用作业的场景。两者确有相似之处。可互相替换的场景，如队列表。将待处理的数据放入队列表，然后使用频率极短的定时任务拉取队列表的数据并处理。这种情况使用消息中间件的推送模式可更好的处理实时性数据。而且基于数据库的消息存储吞吐量远远小于基于文件的顺序追加消息存储。


![elastic1](/images/chenfan/elastic.jpg)

## elastic-job与其他定时框架比较

当当之前使用的作业系统比较散乱，各自为战，大致分为以下4种：


- Quartz：Java事实上的定时任务标准。但Quartz关注点在于定时任务而非数据，并无一套根据数据处理而定制化的流程。虽然Quartz可以基于数据库实现作业的高可用，但缺少分布式并行执行作业的功能。


- TBSchedule：阿里早期开源的分布式任务调度系统。代码略陈旧，使用timer而非线程池执行任务调度。众所周知，timer在处理异常状况时是有缺陷的。而且TBSchedule作业类型较为单一，只能是获取/处理数据一种模式。还有就是文档缺失比较严重。


- Crontab：Linux系统级的定时任务执行器。缺乏分布式和集中管理功能。


- Perl：遗留系统使用，目前已不符合公司的Java化战略。

## elastic-job的特点



- 定时任务： 基于成熟的定时任务作业框架Quartz cron表达式执行定时任务。



- 作业注册中心： 基于Zookeeper和其客户端Curator实现的全局作业注册控制中心。用于注册，控制和协调分布式作业执行。



- 作业分片： 将一个任务分片成为多个小任务项在多服务器上同时执行。



- 弹性扩容缩容： 运行中的作业服务器崩溃，或新增加n台作业服务器，作业框架将在下次作业执行前重新分片，不影响当前作业执行。



- 支持多种作业执行模式： 支持OneOff，Perpetual和SequencePerpetual三种作业模式。



- 失效转移： 运行中的作业服务器崩溃不会导致重新分片，只会在下次作业启动时分片。启用失效转移功能可以在本次作业执行过程中，监测其他作业服务器空闲，抓取未完成的孤儿分片项执行。



- 运行时状态收集： 监控作业运行时状态，统计最近一段时间处理的数据成功和失败数量，记录作业上次运行开始时间，结束时间和下次运行时间。



- 作业停止，恢复和禁用：用于操作作业启停，并可以禁止某作业运行（上线时常用）。



- 被错过执行的作业重触发：自动记录错过执行的作业，并在上次作业完成后自动触发。可参考Quartz的misfire。



- 多线程快速处理数据：使用多线程处理抓取到的数据，提升吞吐量。



- 幂等性：重复作业任务项判定，不重复执行已运行的作业任务项。由于开启幂等性需要监听作业运行状态，对瞬时反复运行的作业对性能有较大影响。



- 容错处理：作业服务器与Zookeeper服务器通信失败则立即停止作业运行，防止作业注册中心将失效的分片分项配给其他作业服务器，而当前作业服务器仍在执行任务，导致重复执行。



- Spring支持：支持spring容器，自定义命名空间，支持占位符。



- 运维平台：提供运维界面，可以管理作业和注册中心。


## elastic-job简单定时任务

1. 引入maven

		<!-- 引入elastic-job核心模块 -->
		<dependency>
		    <groupId>com.dangdang</groupId>
		    <artifactId>elastic-job-core</artifactId>
		    <version>1.0.1</version>
		</dependency>
		<!-- 使用springframework自定义命名空间时引入 -->
		<dependency>
		    <groupId>com.dangdang</groupId>
		    <artifactId>elastic-job-spring</artifactId>
		    <version>1.0.1</version>
		</dependency>

2.设置job.properties
用于设置定时任务的属性

    # 加载数据库
	event.rdb.driver=org.h2.Driver
	event.rdb.url=jdbc:h2:mem:job_event_storage
	event.rdb.username=chenfan
	event.rdb.password=123456
	
	listener.simple=com.dangdang.ddframe.job.example.listener.SpringSimpleListener
	listener.distributed=com.dangdang.ddframe.job.example.listener.SpringSimpleDistributeListener
	listener.distributed.startedTimeoutMilliseconds=1000
	listener.distributed.completedTimeoutMilliseconds=3000
	
	# 简单定时任务设置
	simple.id=springSimpleJob
	simple.class=com.dangdang.ddframe.job.example.job.simple.SpringSimpleJob
	simple.cron=0/5 * * * * ?
	simple.shardingTotalCount=3
	simple.shardingItemParameters=0=Beijing,1=Shanghai,2=Guangzhou
	simple.monitorExecution=false
	simple.failover=true
	simple.description=\u53EA\u8FD0\u884C\u4E00\u6B21\u7684\u4F5C\u4E1A\u793A\u4F8B
	simple.disabled=false
	simple.overwrite=true
	simple.monitorPort=9888

3. reg.properties

设置命名空间，定义zookeeper的端口等

	serverLists=localhost:2181
	namespace=elastic-job-example-lite-spring
	baseSleepTimeMilliseconds=1000
	maxSleepTimeMilliseconds=3000
	maxRetries=3

4. 配置spring

   		<?xml version="1.0" encoding="UTF-8"?>
		<beans xmlns="http://www.springframework.org/schema/beans"
		    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		    xmlns:reg="http://www.dangdang.com/schema/ddframe/reg"
		    xmlns:job="http://www.dangdang.com/schema/ddframe/job"
		    xsi:schemaLocation="http://www.springframework.org/schema/beans
		                        http://www.springframework.org/schema/beans/spring-beans.xsd
		                        http://www.dangdang.com/schema/ddframe/reg
		                        http://www.dangdang.com/schema/ddframe/reg/reg.xsd
		                        http://www.dangdang.com/schema/ddframe/job
		                        http://www.dangdang.com/schema/ddframe/job/job.xsd
		                        ">
	
	    <context:component-scan base-package="com.dangdang.ddframe.job.example" />
	    <context:property-placeholder location="classpath:conf/*.properties" />
	    
	    <bean id="elasticJobLog" class="org.apache.commons.dbcp.BasicDataSource" destroy-method="close">
	        <property name="driverClassName" value="${event.rdb.driver}"/>
	        <property name="url" value="${event.rdb.url}"/>
	        <property name="username" value="${event.rdb.username}"/>
	        <property name="password" value="${event.rdb.password}"/>
	    </bean>
	     <!--配置作业注册中心 -->
	    <reg:zookeeper id="regCenter" server-lists="${serverLists}" namespace="${namespace}" base-sleep-time-milliseconds="${baseSleepTimeMilliseconds}" max-sleep-time-milliseconds="${maxSleepTimeMilliseconds}" max-retries="${maxRetries}" />
	    
		<!-- 配置作业-->
	    <job:simple id="${simple.id}" class="${simple.class}" registry-center-ref="regCenter" sharding-total-count="${simple.shardingTotalCount}" cron="${simple.cron}" sharding-item-parameters="${simple.shardingItemParameters}" monitor-execution="${simple.monitorExecution}" monitor-port="${simple.monitorPort}" failover="${simple.failover}" description="${simple.description}" disabled="${simple.disabled}" overwrite="${simple.overwrite}" event-trace-rdb-data-source="elasticJobLog" />
	    <!-- use absolute path to run script job -->
	    <!--
	    <job:script id="${script.id}" registry-center-ref="regCenter" script-command-line="${script.scriptCommandLine}" sharding-total-count="${script.shardingTotalCount}" cron="${script.cron}" sharding-item-parameters="${script.shardingItemParameters}" description="${script.description}" overwrite="${script.overwrite}" />
	    -->
	</beans>

5. 加载spring的xml
		
		package com.dangdang.ddframe.job.example;
		
		import org.springframework.context.support.ClassPathXmlApplicationContext;
		
		public final class SpringMain {
		    
		    private static final int EMBED_ZOOKEEPER_PORT = 5181;
		    
		    // CHECKSTYLE:OFF
		    public static void main(final String[] args) {
		    // CHECKSTYLE:ON
		        new ClassPathXmlApplicationContext("classpath:META-INF/applicationContext.xml");
		    }
		}

6. 结果


![elastic1](/images/chenfan/elastic1.png)