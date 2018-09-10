---
layout: post
title: Elastic-Job入门(一)
category: ['Elastic-Job']
tags: ['Elastic-Job']
author: 王天文
email: wangtw@asiainfo.com
description: Elastic-Job入门(一)
---

# Elastic-Job

## 1.1简介

**Elastic-Job**:Elastic-Job([项目开源地址](https://github.com/elasticjob))是ddframe中dd-job的作业模块中分离出来的分布式弹性作业框架，去掉了dd-job中的监控和ddframe接入规范部分。该项目基于成熟的开源产品Quartz和Zookeeper及其客户端Curator进行二次开发。由两个相互独立的子项目Elastic-Job-Lite和Elastic-Job-Cloud组成。Elastic-Job-lite定位为轻量级无中心化解决方案，使用jar包的形式提供分布式任务的协调服务。Elastic-Job-Cloud基于mesos运行，是mesos的Framework。这里介绍的是Elastic-Job-Lite。

## 1.2基本概念

* 分片概念
  任务的分布式执行，需要将一个任务拆分为多个独立的任务项，然后由分布式的服务器分别执行某一个或几个分片项。例如：有一个遍历数据库某张表的作业，现有2台服务器。为了快速的执行作业，那么每台服务器应执行作业的50%。 为满足此需求，可将作业分成2片，每台服务器执行1片。作业遍历数据的逻辑应为：服务器A遍历ID以奇数结尾的数据；服务器B遍历ID以偶数结尾的数据。 如果分成10片，则作业遍历数据的逻辑应为：每片分到的分片项应为ID%10，而服务器A被分配到分片项0,1,2,3,4；服务器B被分配到分片项5,6,7,8,9，直接的结果就是服务器A遍历ID以0-4结尾的数据；服务器B遍历ID以5-9结尾的数据。
* 分片项与业务处理解耦
  Elastic-Job并不直接提供数据处理的功能，框架只会将分片项分配至各个运行中的作业服务器，开发者需要自行处理分片项与真实数据的对应关系。
* 个性化参数的使用场景
  个性化参数即shardingItemParameter，可以和分片项匹配对应关系，用于将分片项的数字转换为更加可读的业务代码。例如：按照地区水平拆分数据库，数据库A是北京的数据；数据库B是上海的数据；数据库C是广州的数据。 如果仅按照分片项配置，开发者需要了解0表示北京；1表示上海；2表示广州。 合理使用个性化参数可以让代码更可读，如果配置为0=北京,1=上海,2=广州，那么代码中直接使用北京，上海，广州的枚举值即可完成分片项和业务逻辑的对应关系。

## 1.3快速入门

引入maven依赖

```
        <dependency>
            <groupId>com.dangdang</groupId>
            <artifactId>elastic-job-lite-core</artifactId>
            <version>2.1.5</version>
        </dependency>
```

#### 1.3.1作业开发

作业开发：Elastic-Job提供Simple、Dataflow和Script（文中没介绍）3种作业类型。

##### a.Simple类型作业

```
public class MySimpleJob implements SimpleJob{
    /**
     * 执行作业.
     * @param shardingContext 分片上下文
     */
    @Override
    public void execute(ShardingContext context) {
        System.out.println(new SimpleDateFormat("HH:mm:ss").format(new Date())
                + " 分片项 : "+context.getShardingItem()
                + " 总片数 : " + context.getShardingTotalCount());

    }
}
```

##### b.Dataflow类型作业

```
public class MyDataflowJob implements DataflowJob{
    /**
     * 获取待处理数据.
     * @param shardingContext 分片上下文
     * @return 待处理的数据集合
     */
    @Override
    public List fetchData(ShardingContext shardingContext) {
        return Arrays.asList("1","2","3");
    }
    /**
     * 处理数据.
     * @param shardingContext 分片上下文
     * @param data 待处理数据集合
     */
    @Override
    public void processData(ShardingContext shardingContext, List data) {
        System.out.println("处理数据:" + data.toString());
    }
}
```

流式处理，可通过DataflowJobConfiguration配置是否为流式处理。流式处理数据只有fetchData方法的返回值为null或集合长度为空时，作业才停止抓取，否则作业将一直运行下去； 非流式处理数据则只会在每次作业执行过程中执行一次fetchData方法和processData方法，随即完成本次作业。

##### c.启动作业

```
public class JobDemo {
    public static void main(String[] args) {
    	//作业调度器初始化作业
        new JobScheduler(createRegistryCenter(),createJobConfiguration()).init();
        //启动DataflowJob
        setUpDataflowJob(createRegistryCenter());
    }
    //注册中心
    private static CoordinatorRegistryCenter createRegistryCenter(){
    	//ZookeeperConfiguration构造方法两个参数，serverLists(连接Zookeeper服务器的列表，包括IP地址和端口号，，多个地址用逗号分隔)和namespace(命名空间)
        CoordinatorRegistryCenter registryCenter = new ZookeeperRegistryCenter(new ZookeeperConfiguration("0.0.0.0:2181","elastic-job-demo"));
        registryCenter.init();
        return registryCenter;
    }
    //配置SimpleJob
    private static LiteJobConfiguration createJobConfiguration(){
    	//创建简单作业配置构建器，三个参数为：jobName(作业名称)，cron（作业启动时间的cron表达式），shardingTotalCount(作业分片总数)
        JobCoreConfiguration simpleCoreConfig = JobCoreConfiguration.newBuilder("mySimpleJob","0/10 * * * * ?",12).build();
        //简单作业配置，第二个参数为jobClass
        SimpleJobConfiguration simpleJobConfig = new SimpleJobConfiguration(simpleCoreConfig, MySimpleJob.class.getCanonicalName());
   		//创建Lite作业配置构建器，参数jobConfig（作业配置）
        LiteJobConfiguration simpleJobRootConfig = LiteJobConfiguration.newBuilder(simpleJobConfig).build();
        return simpleJobRootConfig;
    }
    //配置DataflowJob
    private static void setUpDataflowJob(final CoordinatorRegistryCenter registryCenter){
        JobCoreConfiguration coreConfiguration = JobCoreConfiguration.newBuilder("myDataflowJob","0/10 * * * * ?",2).build();
        //数据流作业配置，第三个参数为streamingProcess（是否为流式处理）
        DataflowJobConfiguration dataflowJobConfiguration = new DataflowJobConfiguration(coreConfiguration,MyDataflowJob.class.getCanonicalName(),true);
        new JobScheduler(registryCenter,LiteJobConfiguration.newBuilder(dataflowJobConfiguration).build()).init();

    }
}
```

#### 1.3.2作业配置

从JobDemo类中可以看出配置分为3个层级，分别是Core，Type和Root，每个层级使用相似于装饰者模式的方式装配。

Core对应JobCoreConfiguration，用于提供作业核心配置信息。

Type对应JobTypeConfiguration，有3个子类分别对应SIMPLE，DATAFLOW，SCRIPT类型作业，提供3种作业需要的不同配置。

Root对应JobRootConfiguration，有2个子类分别对应Lite和Cloud部署类型，提供不同部署类型所需的配置。