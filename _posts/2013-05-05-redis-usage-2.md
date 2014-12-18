---
layout: post
category: Memcache
title: Redis Linux Pipeline && 分布式
tags: ['Redis', 'Linux', 'Pipeline']
author: Jacky
email: shenyj5@asiainfo-linkage.com
image:
description: Redis 事务、Pipeline，持久化以及分布式应用。
---

##事务
redis对事务的支持目前还比较简单。redis只能保证一个client发起的事务中的命令可以连续的执行，而中间不会插入其他client的命令。 由于redis是单线程来处理所有client的请求的所以做到这点是很容易的。一般情况下redis在接受到一个client发来的命令后会立即处理并 返回处理结果，但是当一个client在一个连接中发出multi命令有，这个连接会进入一个事务上下文，该连接后续的命令并不是立即执行，而是先放到一 个队列中。当从此连接受到exec命令后，redis会顺序的执行队列中的所有命令。并将所有命令的运行结果打包到一起返回给client.然后此连接就 结束事务上下文。

	redis 127.0.0.1:6479> multi
	OK
	redis 127.0.0.1:6479> incr a
	QUEUED
	redis 127.0.0.1:6479> incr b
	QUEUED
	redis 127.0.0.1:6479> get a
	QUEUED
	redis 127.0.0.1:6479> get b
	QUEUED
	redis 127.0.0.1:6479> exec
	1) (integer) 1
	2) (integer) 1
	3) "1"
	4) "1"
	redis 127.0.0.1:6479> get a
	"1"
	redis 127.0.0.1:6479> get b
	"1"

批量操作效率的确的很大的提高，但同时也会带来其他的问题，因为 redis 本身并不提供同步锁机制，如果在批量执行的过程中另一个客户端对批量里面的元素进行操作，当调用 exec 执行的时候发现结果已经不是我们想要的结果了，还好 redis2.1 后添加了 watch 命令，可以用来实现乐观锁，通过对元素的监控来判断在等待的过程中元素的值有没有发生变化，如果有则执行失败。

	redis 127.0.0.1:6479> watch a
	OK
	redis 127.0.0.1:6479> get a
	"5"
	redis 127.0.0.1:6479> multi
	OK
	redis 127.0.0.1:6479> set a 2
	QUEUED
	redis 127.0.0.1:6479> exec
	(nil)

redis 的事务是如此简单，当然也会存在一些问题，首先 redis 只能保证每个命令连续执行，如果事务中一个命令失败了，并不回滚其他的命令，这样就会导致的事务的完整性无法得到保证。

	redis 127.0.0.1:6479> set a 5
	OK
	redis 127.0.0.1:6479> lpush b 5
	(integer) 1
	redis 127.0.0.1:6479> multi
	OK
	redis 127.0.0.1:6479> incr a
	QUEUED
	redis 127.0.0.1:6479> incr b
	QUEUED
	redis 127.0.0.1:6479> exec
	1) (integer) 6
	2) (error) ERR Operation against a key holding the wrong kind of value

还有一个十分罕见的问题是 当事务的执行过程中，如果redis意外的挂了。很遗憾只有部分命令执行了，后面的也就被丢弃了。当然如果我们使用的append-only file方式持久化，redis会用单个write操作写入整个事务内容。即是是这种方式还是有可能只部分写入了事务到磁盘。发生部分写入事务的情况 下，redis重启时会检测到这种情况，然后失败退出。可以使用redis-check-aof工具进行修复，修复会删除部分写入的事务内容。修复完后就 能够重新启动了。

##pipeline
redis是一个cs模式的tcp server，使用和http类似的请求响应协议。一个client可以通过一个socket连接发起多个请求命令。每个请求命令发出后client通常 会阻塞并等待redis服务处理，redis处理完后请求命令后会将结果通过响应报文返回给client。我们还可以利用pipeline的方式从client打包多条命令一起发出，不需要等待单条命令的响应返回，而redis服务端会处理完多条命令后会将多条命令的处理结果打包到一起返回给客户端。

	String host = "127.0.0.1";
	int port = 6479, timeout = 30000;
	Jedis jedis = new Jedis(host, port, timeout);
	Pipeline p = jedis.pipelined();
	for (int i = 1; i <= 500000; i++) {
		String key = "comppara_" + i;
		String value = "{param1: " + i + ", param2: " + i + ", param3: " + i + "}";
		p.set(key, value);
	}
	p.sync();

通过 pipeline 模式，set 跟 get 效率有了明显的提交，前面测试的50W数据导入只需要不到3秒种，读2秒左右。

##redis持久化
redis是一个支持持久化的内存数据库，也就是说redis需要经常将内存中的数据同步到磁盘来保证持久化。redis支持两种持久化方式，一种是 Snapshotting（快照）也是默认方式，另一种是Append-only file（缩写aof）的方式。下面分别介绍

Snapshotting
快照是默认的持久化方式。这种方式是就是将内存中数据以快照的方式写入到二进制文件中,默认的文件名为dump.rdb。可以通过配置设置自动做快照持久 化的方式。我们可以配置redis在n秒内如果超过m个key被修改就自动做快照，下面是默认的快照保存配置

	save 900 1  #900秒内如果超过1个key被修改，则发起快照保存
	save 300 10 #300秒内容如超过10个key被修改，则发起快照保存
	save 60 10000

##分布式
在jedis的源码里发现了两种hash算法（MD5，MURMUR Hash(默认）），也可以自己实现redis.clients.util.Hashing接口扩展。

	List<JedisShardInfo> hosts = new ArrayList<JedisShardInfo>();
	
	JedisShardInfo host1 = new JedisShardInfo("127.0.0.1", 6479, 3000);
	JedisShardInfo host2 = new JedisShardInfo("192.168.4.17", 6479, 3000);
	
	hosts.add(host1);
	hosts.add(host2);
	
	ShardedJedis jedis = new ShardedJedis(hosts);
	ShardedJedisPipeline p = jedis.pipelined();
	
	for (int i = 1; i <= 10000; i++) {
		String key = "shard_" + i;
		String value = "value_" + i;
		p.set(key, value);
	}
	
	p.sync();