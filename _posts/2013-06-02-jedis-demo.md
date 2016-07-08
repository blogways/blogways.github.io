---
layout: post
category: NoSQL
title: Redis的Java客户端Jedis的八种调用方式(事务、管道、分布式…)介绍
tags: ['redis', 'jedis', '事务', '管道', '分布式', '连接池']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: redis是一个著名的key-value存储系统，而作为其官方推荐的java版客户端jedis也非常强大和稳定，支持事务、管道及有jedis自身实现的分布式。本文对jedis关于事务、管道和分布式的调用方式做一个简单的介绍和对比。

---

redis是一个著名的key-value存储系统，而作为其官方推荐的java版客户端jedis也非常强大和稳定，支持事务、管道及有jedis自身实现的分布式。

在这里对jedis关于事务、管道和分布式的调用方式做一个简单的介绍和对比：

### 一、普通同步方式

最简单和基础的调用方式，

	@Test
	public void test1Normal() {
		Jedis jedis = new Jedis("localhost");
		long start = System.currentTimeMillis();
		for (int i = 0; i < 100000; i++) {
		    String result = jedis.set("n" + i, "n" + i);
		}
		long end = System.currentTimeMillis();
		System.out.println("Simple SET: " + ((end - start)/1000.0) + " seconds");
		jedis.disconnect();
	}
	
很简单吧，每次`set`之后都可以返回结果，标记是否成功。
	
### 二、事务方式(Transactions)

redis的事务很简单，他主要目的是保障，一个client发起的事务中的命令可以连续的执行，而中间不会插入其他client的命令。

看下面例子：

	@Test
	public void test2Trans() {
		Jedis jedis = new Jedis("localhost");
		long start = System.currentTimeMillis();
		Transaction tx = jedis.multi();
		for (int i = 0; i < 100000; i++) {
		    tx.set("t" + i, "t" + i);
		}
		List<Object> results = tx.exec();
		long end = System.currentTimeMillis();
		System.out.println("Transaction SET: " + ((end - start)/1000.0) + " seconds");
		jedis.disconnect();
	}
	
我们调用`jedis.watch(…)`方法来监控key，如果调用后key值发生变化，则整个事务会执行失败。另外，事务中某个操作失败，并不会回滚其他操作。这一点需要注意。还有，我们可以使用`discard()`方法来取消事务。

### 三、管道(Pipelining)

有时，我们需要采用异步方式，一次发送多个指令，不同步等待其返回结果。这样可以取得非常好的执行效率。这就是管道，调用方法如下：
		
	@Test
	public void test3Pipelined() {
		Jedis jedis = new Jedis("localhost");
		Pipeline pipeline = jedis.pipelined();
		long start = System.currentTimeMillis();
		for (int i = 0; i < 100000; i++) {
		    pipeline.set("p" + i, "p" + i);
		}
		List<Object> results = pipeline.syncAndReturnAll();
		long end = System.currentTimeMillis();
		System.out.println("Pipelined SET: " + ((end - start)/1000.0) + " seconds");
		jedis.disconnect();
	}
	
### 四、管道中调用事务

就Jedis提供的方法而言，是可以做到在管道中使用事务，其代码如下：

	@Test
	public void test4combPipelineTrans() {
		jedis = new Jedis("localhost"); 
		long start = System.currentTimeMillis();
		Pipeline pipeline = jedis.pipelined();
		pipeline.multi();
		for (int i = 0; i < 100000; i++) {
		    pipeline.set("" + i, "" + i);
		}
		pipeline.exec();
		List<Object> results = pipeline.syncAndReturnAll();
		long end = System.currentTimeMillis();
		System.out.println("Pipelined transaction: " + ((end - start)/1000.0) + " seconds");
		jedis.disconnect();
	}

但是经测试（见本文后续部分），发现其效率和单独使用事务差不多，甚至还略微差点。

### 五、分布式直连同步调用

	@Test
	public void test5shardNormal() {
		List<JedisShardInfo> shards = Arrays.asList(
				new JedisShardInfo("localhost",6379),
				new JedisShardInfo("localhost",6380));
				
		ShardedJedis sharding = new ShardedJedis(shards);
		
		long start = System.currentTimeMillis();
		for (int i = 0; i < 100000; i++) {
		    String result = sharding.set("sn" + i, "n" + i);
		}
		long end = System.currentTimeMillis();
		System.out.println("Simple@Sharing SET: " + ((end - start)/1000.0) + " seconds");
		
		sharding.disconnect();
	}
	
这个是分布式直接连接，并且是同步调用，每步执行都返回执行结果。类似地，还有异步管道调用。

### 六、分布式直连异步调用

	@Test
	public void test6shardpipelined() {
		List<JedisShardInfo> shards = Arrays.asList(
				new JedisShardInfo("localhost",6379),
				new JedisShardInfo("localhost",6380));
				
		ShardedJedis sharding = new ShardedJedis(shards);
		
		ShardedJedisPipeline pipeline = sharding.pipelined();
		long start = System.currentTimeMillis();
		for (int i = 0; i < 100000; i++) {
		    pipeline.set("sp" + i, "p" + i);
		}
		List<Object> results = pipeline.syncAndReturnAll();
		long end = System.currentTimeMillis();
		System.out.println("Pipelined@Sharing SET: " + ((end - start)/1000.0) + " seconds");
		
		sharding.disconnect();
	}
	
### 七、分布式连接池同步调用

如果，你的分布式调用代码是运行在线程中，那么上面两个直连调用方式就不合适了，因为直连方式是非线程安全的，这个时候，你就必须选择连接池调用。

	@Test
	public void test7shardSimplePool() {
		List<JedisShardInfo> shards = Arrays.asList(
				new JedisShardInfo("localhost",6379),
				new JedisShardInfo("localhost",6380));

		ShardedJedisPool pool = new ShardedJedisPool(new JedisPoolConfig(), shards);
	
		ShardedJedis one = pool.getResource();
		
		long start = System.currentTimeMillis();
		for (int i = 0; i < 100000; i++) {
		    String result = one.set("spn" + i, "n" + i);
		}
		long end = System.currentTimeMillis();
		pool.returnResource(one);
		System.out.println("Simple@Pool SET: " + ((end - start)/1000.0) + " seconds");
		
		pool.destroy();
	}

上面是同步方式，当然还有异步方式。

### 八、分布式连接池异步调用

	@Test
	public void test8shardPipelinedPool() {
		List<JedisShardInfo> shards = Arrays.asList(
				new JedisShardInfo("localhost",6379),
				new JedisShardInfo("localhost",6380));

		ShardedJedisPool pool = new ShardedJedisPool(new JedisPoolConfig(), shards);

		ShardedJedis one = pool.getResource();
		
		ShardedJedisPipeline pipeline = one.pipelined();
		
		long start = System.currentTimeMillis();
		for (int i = 0; i < 100000; i++) {
		    pipeline.set("sppn" + i, "n" + i);
		}
		List<Object> results = pipeline.syncAndReturnAll();
		long end = System.currentTimeMillis();
		pool.returnResource(one);
		System.out.println("Pipelined@Pool SET: " + ((end - start)/1000.0) + " seconds");
		pool.destroy();
	}
	
### 九、需要注意的地方

1. 事务和管道都是异步模式。在事务和管道中不能同步查询结果。比如下面两个调用，都是不允许的：

		Transaction tx = jedis.multi();
		for (int i = 0; i < 100000; i++) {
		    tx.set("t" + i, "t" + i);
		}
		System.out.println(tx.get("t1000").get());  //不允许
		
		List<Object> results = tx.exec();
		
		…
		…
		
		Pipeline pipeline = jedis.pipelined();
		long start = System.currentTimeMillis();
		for (int i = 0; i < 100000; i++) {
		    pipeline.set("p" + i, "p" + i);
		}
		System.out.println(pipeline.get("p1000").get()); //不允许
		
		List<Object> results = pipeline.syncAndReturnAll();
		
1. 事务和管道都是异步的，个人感觉，在管道中再进行事务调用，没有必要，不如直接进行事务模式。
1. 分布式中，连接池的性能比直连的性能略好(见后续测试部分)。

1. 分布式调用中不支持事务。
	
	因为事务是在服务器端实现，而在分布式中，每批次的调用对象都可能访问不同的机器，所以，没法进行事务。
	


### 十、测试

运行上面的代码，进行测试，其结果如下：

	Simple SET: 5.227 seconds
	
	Transaction SET: 0.5 seconds
	Pipelined SET: 0.353 seconds
	Pipelined transaction: 0.509 seconds
	
	Simple@Sharing SET: 5.289 seconds
	Pipelined@Sharing SET: 0.348 seconds
	
	Simple@Pool SET: 5.039 seconds
	Pipelined@Pool SET: 0.401 seconds
	
另外，经测试分布式中用到的机器越多，调用会越慢。上面是2片，下面是5片：

	Simple@Sharing SET: 5.494 seconds
	Pipelined@Sharing SET: 0.51 seconds
	Simple@Pool SET: 5.223 seconds
	Pipelined@Pool SET: 0.518 seconds
	
下面是10片：

	Simple@Sharing SET: 5.9 seconds
	Pipelined@Sharing SET: 0.794 seconds
	Simple@Pool SET: 5.624 seconds
	Pipelined@Pool SET: 0.762 seconds
	
下面是100片：

	Simple@Sharing SET: 14.055 seconds
	Pipelined@Sharing SET: 8.185 seconds
	Simple@Pool SET: 13.29 seconds
	Pipelined@Pool SET: 7.767 seconds

分布式中，连接池方式调用不但线程安全外，根据上面的测试数据，也可以看出连接池比直连的效率更好。

### 十一、完整的测试代码

	package com.example.nosqlclient;

	import java.util.Arrays;
	import java.util.List;

	import org.junit.AfterClass;
	import org.junit.BeforeClass;
	import org.junit.Test;

	import redis.clients.jedis.Jedis;
	import redis.clients.jedis.JedisPoolConfig;
	import redis.clients.jedis.JedisShardInfo;
	import redis.clients.jedis.Pipeline;
	import redis.clients.jedis.ShardedJedis;
	import redis.clients.jedis.ShardedJedisPipeline;
	import redis.clients.jedis.ShardedJedisPool;
	import redis.clients.jedis.Transaction;

	import org.junit.FixMethodOrder;
	import org.junit.runners.MethodSorters;

	@FixMethodOrder(MethodSorters.NAME_ASCENDING)
	public class TestJedis {

		private static Jedis jedis;
		private static ShardedJedis sharding;
		private static ShardedJedisPool pool;
		
		@BeforeClass
		public static void setUpBeforeClass() throws Exception {
			List<JedisShardInfo> shards = Arrays.asList(
					new JedisShardInfo("localhost",6379),
					new JedisShardInfo("localhost",6379)); //使用相同的ip:port,仅作测试
			
			
			jedis = new Jedis("localhost"); 
			sharding = new ShardedJedis(shards);
			
			pool = new ShardedJedisPool(new JedisPoolConfig(), shards);
		}

		@AfterClass
		public static void tearDownAfterClass() throws Exception {
			jedis.disconnect();
			sharding.disconnect();
			pool.destroy();
		}

		@Test
		public void test1Normal() {
			long start = System.currentTimeMillis();
			for (int i = 0; i < 100000; i++) {
				String result = jedis.set("n" + i, "n" + i);
			}
			long end = System.currentTimeMillis();
			System.out.println("Simple SET: " + ((end - start)/1000.0) + " seconds");
		}
		
		@Test
		public void test2Trans() {
			long start = System.currentTimeMillis();
			Transaction tx = jedis.multi();
			for (int i = 0; i < 100000; i++) {
				tx.set("t" + i, "t" + i);
			}
			//System.out.println(tx.get("t1000").get());
			
			List<Object> results = tx.exec();
			long end = System.currentTimeMillis();
			System.out.println("Transaction SET: " + ((end - start)/1000.0) + " seconds");
		}
		
		@Test
		public void test3Pipelined() {
			Pipeline pipeline = jedis.pipelined();
			long start = System.currentTimeMillis();
			for (int i = 0; i < 100000; i++) {
				pipeline.set("p" + i, "p" + i);
			}
			//System.out.println(pipeline.get("p1000").get());
			List<Object> results = pipeline.syncAndReturnAll();
			long end = System.currentTimeMillis();
			System.out.println("Pipelined SET: " + ((end - start)/1000.0) + " seconds");
		}
		
		@Test
		public void test4combPipelineTrans() {
			long start = System.currentTimeMillis();
			Pipeline pipeline = jedis.pipelined();
			pipeline.multi();
			for (int i = 0; i < 100000; i++) {
				pipeline.set("" + i, "" + i);
			}
			pipeline.exec();
			List<Object> results = pipeline.syncAndReturnAll();
			long end = System.currentTimeMillis();
			System.out.println("Pipelined transaction: " + ((end - start)/1000.0) + " seconds");
		}

		@Test
		public void test5shardNormal() {
			long start = System.currentTimeMillis();
			for (int i = 0; i < 100000; i++) {
				String result = sharding.set("sn" + i, "n" + i);
			}
			long end = System.currentTimeMillis();
			System.out.println("Simple@Sharing SET: " + ((end - start)/1000.0) + " seconds");
		}
		
		@Test
		public void test6shardpipelined() {
			ShardedJedisPipeline pipeline = sharding.pipelined();
			long start = System.currentTimeMillis();
			for (int i = 0; i < 100000; i++) {
				pipeline.set("sp" + i, "p" + i);
			}
			List<Object> results = pipeline.syncAndReturnAll();
			long end = System.currentTimeMillis();
			System.out.println("Pipelined@Sharing SET: " + ((end - start)/1000.0) + " seconds");
		}
		
		@Test
		public void test7shardSimplePool() {
			ShardedJedis one = pool.getResource();
			
			long start = System.currentTimeMillis();
			for (int i = 0; i < 100000; i++) {
				String result = one.set("spn" + i, "n" + i);
			}
			long end = System.currentTimeMillis();
			pool.returnResource(one);
			System.out.println("Simple@Pool SET: " + ((end - start)/1000.0) + " seconds");
		}
		
		@Test
		public void test8shardPipelinedPool() {
			ShardedJedis one = pool.getResource();
			
			ShardedJedisPipeline pipeline = one.pipelined();
			
			long start = System.currentTimeMillis();
			for (int i = 0; i < 100000; i++) {
				pipeline.set("sppn" + i, "n" + i);
			}
			List<Object> results = pipeline.syncAndReturnAll();
			long end = System.currentTimeMillis();
			pool.returnResource(one);
			System.out.println("Pipelined@Pool SET: " + ((end - start)/1000.0) + " seconds");
		}
	}

