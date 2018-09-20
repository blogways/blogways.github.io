---
layout: post
title: Elastic-Job入门(二)
category: ['Elastic-Job']
tags: ['Elastic-Job']
author: 王天文
email: wangtw@asiainfo.com
description: Elastic-Job入门(二)
---

# 1.1通过Spring配置启动

```
<dependency>
	<groupId>com.dangdang</groupId>
	<artifactId>elastic-job-lite-spring</artifactId>
	<version>2.1.5</version>
</dependency>
```

在xml文件中配置作业

```
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
    <!--配置作业注册中心 -->
    <reg:zookeeper id="regCenter" server-lists="yourhost:2181" namespace="dd-job" base-sleep-time-milliseconds="1000" max-sleep-time-milliseconds="3000" max-retries="3" />
    
    <!-- 配置作业-->
    <job:simple id="demoSimpleSpringJob" class="xxx.MyElasticJob" registry-center-ref="regCenter" cron="0/10 * * * * ?" sharding-total-count="3" sharding-item-parameters="0=A,1=B,2=C" />
</beans>
```

将该xml通过Spring启动，作业将自动挂载。

#1.2运维平台

* 解压缩elastic-job-lite-console-${version}.tar.gz并执行bin\start.sh

* 打开浏览器访问`http://localhost:8899/`即可访问控制台

  ![](/images/wangtianwen/Elastic-Job/console.png)

  启动任务后，就可看到下图

  ![](/images/wangtianwen/Elastic-Job/job.png)

  修改页面

  ![](/images/wangtianwen/Elastic-Job/modify.png)

# 2.1简述注册中心

涉及的类：

![](/images/wangtianwen/Elastic-Job/class.png)

ZookeeperRegistryCenter，基于Zookeeper注册中心。实现CoordinatorRegistryCenter接口，CoordinatorRegistryCenter继承RegistryCenter接口。

* CoordinatorRegistryCenter：用于协调分布式服务的注册中心，定义了持久节点、临时节点、持久顺序节点、临时顺序节点等目录服务接口方法，隐性的要求提供事务、分布式锁、数据订阅等特性。
* RegistryCenter：注册中心，定义了简单的增删改查注册数据和查询事件的接口方法。

##2.1.1初始化

```
@Override
public void init() {
   log.debug("Elastic job: zookeeper registry center init, server lists is: {}.", zkConfig.getServerLists());
   CuratorFrameworkFactory.Builder builder = CuratorFrameworkFactory.builder()
           .connectString(zkConfig.getServerLists())
           .retryPolicy(new ExponentialBackoffRetry(zkConfig.getBaseSleepTimeMilliseconds(), zkConfig.getMaxRetries(), zkConfig.getMaxSleepTimeMilliseconds()))
           .namespace(zkConfig.getNamespace()); // 命名空间
   if (0 != zkConfig.getSessionTimeoutMilliseconds()) {
       builder.sessionTimeoutMs(zkConfig.getSessionTimeoutMilliseconds()); // 会话超时时间，默认 60 * 1000 毫秒
   }
   if (0 != zkConfig.getConnectionTimeoutMilliseconds()) {
       builder.connectionTimeoutMs(zkConfig.getConnectionTimeoutMilliseconds()); // 连接超时时间，默认 15 * 1000 毫秒
   }
   // 认证
   if (!Strings.isNullOrEmpty(zkConfig.getDigest())) {
       builder.authorization("digest", zkConfig.getDigest().getBytes(Charsets.UTF_8))
               .aclProvider(new ACLProvider() {
               
                   @Override
                   public List<ACL> getDefaultAcl() {
                       return ZooDefs.Ids.CREATOR_ALL_ACL;
                   }
               
                   @Override
                   public List<ACL> getAclForPath(final String path) {
                       return ZooDefs.Ids.CREATOR_ALL_ACL;
                   }
               });
   }
   client = builder.build();
   client.start();
   // 连接 Zookeeper
   try {
       if (!client.blockUntilConnected(zkConfig.getMaxSleepTimeMilliseconds() * zkConfig.getMaxRetries(), TimeUnit.MILLISECONDS)) {
           client.close();
           throw new KeeperException.OperationTimeoutException();
       }
   } catch (final Exception ex) {
       RegExceptionHandler.handleException(ex);
   }
}
```



