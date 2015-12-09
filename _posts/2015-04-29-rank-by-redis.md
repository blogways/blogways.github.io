---
layout: post
category: Node.js
title: 使用Redis实现TOP500排行功能( 列表和有序集合 )
tags: ['Redis', 'Lists', 'Sorted sets', 'rank', '排行榜', 'TOP500']
author: 万洲
email: wanzhou@asiainfo.com
description: Redis是一个开源的使用ANSI C语言编写、支持网络、可基于内存亦可持久化的日志型、Key-Value数据库，并提供多种语言的API。有非常丰富数据结构，且数据结构的常见操作均为原子性的；高速读写
---


## 一、背景介绍
通过 node.js 将系统产生的日志入库到 mongodb，并统计最大耗时的TOP500，因为 node.js 操作 mongodb 都是通过异步调用的回调函数来完成的，所以在获取表中记录数的时候操作起来特别的烦琐，还有一个原因就是启动多个 node.js 实例来入库数据的时候，并发请求太多，可能多个 node.js 删除的时同一条记录，导致在实际测试过程中，统计表中的记录条数不是 500，而可能时几十、几百万条数据。

## 二、数据结构
通过采集系统的日志文件发送到 node.js，经过分析过后的数据：

	var obj = {
		"MAX" : 123214,
		"MIN" : 234,
		"AVERAGE" : 3245,
		...
	}
根据 MAX 或 MIN 排序；

## 三、实现
TOP500 统计有两个阶段：

1. 表中记录数不满 500 条时，在此阶段任何新插入的数据都是TOP500，直接插入数据即可
2. 表中数据大于 500 条时，在此阶段若插入一条数据，就需要删除一条数据；

上述第二阶段时，一般数据库的操作方式就是找到并删除 `MAX 最小`( **当按MAX排行时，只要比表中最小的大，就是TOP500** )或`MIN 最大`( **当按MIN排行时，只要比表中最大的大，就是TOP500** )的一条记录，然后将新纪录插入数据库即可。

### 有序集合( Sorted sets )
在 node.js 中连接 redis 的所有操作都是异步回调的，而在判断表中记录数的时候需要等待结果，然后才能进行后续的操作，此处需要同步等待，因而使用 async 来实现：

因为有序集合会将插入的数据的值自动排序，所有表中第一条、或最后一条记录即是最小、最大值，操作不复杂，使用起来也很方便；操作有两种实现方式：

1. 手动判断数据个数，在表中记录不满500条时插入数据，超过500条之后根据排行榜功能返回表中第一条或最后一条记录，与当前值比较判断是否插入并删除取出的数据；
2. 不管表中有多少条数据，先讲记录插入到表中，然后删除500条之后的记录、或倒数500条之前的记录；

#### 实现方式一

	var env = process.env.NODE_ENV || 'development',
		config = require('../../config/config')[env];
		logger = require('../../log').logger,
		redis = require('redis'),
		client = redis.createClient(config.redis.port,config.redis.host),
		async = require('async');
	
	...  省略中间代码  ...
	
	var value = obj[field];
	async.auto({
		step1: function (callback) {
			client.zcard(['test'], callback);
		},
		step2: ['step1', function (callback, result) {
			if (result.step1 < 500) {
				client.zadd(['test', value, JSON.stringify(obj)], function (err, rest){
					if (err) {
						logger.error(err);
					} else {
						callback('redis insert successfully!')
					}
				})
			} else {
				if (type == 'max') {
					client.zrange(['test', 0, 0, 'withscores'], callback)
				} else {
					client.zrange(['test', -1, -1, 'withscores'], callback)
				}
			}
		}],
		step3: ['step2', function (callback, result) {
			if ( (type == 'max' && value > result.step2[1]) || 
					(type == 'min' && obj.MIN < result.step2[1]) ) {
				client.rem(['test', result.step2[0]], redis.print);
				client.zadd(['test', value, JSON.stringify(obj)], redis.print);
			}
		}]
	}, function(err, results) {
		client.quit();
	});
这种方法很符合传统的思路，比较容易理解，但是很明显操作比较多，还使用了一些插件、判断等，效率应该不是很高。

#### 实现方式二

	var env = process.env.NODE_ENV || 'development',
		config = require('../../config/config')[env];
		logger = require('../../log').logger,
		redis = require('redis'),
		client = redis.createClient(config.redis.port,config.redis.host);
		
	...  省略中间代码  ...

	var value = obj[field];
	client.zadd(['test', value, JSON.stringify(obj)], redis.print);
	if (type == 'MAX') {
		client.zremrangebyrank(['test', 0, -500], redis.print);
	} else {
		client.zremrangebyrank(['test', 500, -1], redis.print);
	}
第二种实现方式代码量很少，所有的实现都是调用的 redis 提供的接口方法来实现，因而运行效率比方式一要高很多，比较推荐此种方式。

因为按 MAX 字段统计排行榜时，要保留MAX最大的TOP500，而表按照数值升序排序的，所以需要保留表中后500跳记录( 删除表中后500条之前的数据，即第一条记录到倒数第500条之间的数据：`zremrangebyrank(['test', 0, -500], redis.print)` );

同理，按照 MIN 字段统计排行榜时，只需要删除500条之后的数据( 升序排序，则第一条到第500条即为TOP500，`zremrangebyrank(['test', 500, -1], redis.print)` )。

### 使用到的方法介绍
redis 对 node.js 的所有接口方法都有两个参数，第一个为一个数组( `[]` )，数组中的参数即为在`redis-cli`客户端执行命令时的参数，第二个参数为一个回调函数，通常为 `function (err, result){ ... }`，方法执行的结果保存在 result 中。

* `client.zcard([ tabname ], callback)`：同客户端命令 `ZCARD`，得到的有序集合成员的数量；
* `client.zadd([ tabname, value, key ], callback)`：同客户端命令 `ZADD`，添加一个或多个成员到有序集合，或者如果它已经存在更新其数据值；添加多个记录：`client.zadd(['test', 1, 'a1', 2, 'a2'.....], callback)`；
* `client.zrange([ tabname, start stop, 'withscores' ], callback)`：同客户端命令 `ZRANGE`，由索引返回一个成员范围的有序集合，如果有`withscores`参数，则对于 key 的值也会返回，如：`[ 'a1', '1' ]`；
* `client.rem([ tabname, key], callback)`：同客户端命令`ZREM`，从有序集合中删除一个或多个成员；
* `client.zremrangebyrank([ tabname, start, stop ], callback)`，同客户端命令 `ZREMRANGEBYRANK`，在给定的索引之内删除所有成员的有序集合，下标从 0 开始，-1 表示最后一条记录，-500 表示倒数第500条记录。
	
	
### 列表
因为列表只有一个key，不存在 value的说法，因而通过 Lists 来实现的时候，需要将比较字段通过一些处理，并放到转换为字符串的前面，如在按照如下对象的 MAX 字段统计时：

	var obj = {
		"MAX" : 123214,
		"MIN" : 234,
		"AVERAGE" : 3245,
		...
	}
转化成的字符串需为：`"{\"KEY\":\"00000000002.342424\",\"MAX\":2.342424,\"MIN\":0.023212,\"AVERAGE\":0.065464, ....}"`，因为没有 value的说法，所以只能按照字符串的ASCII的方式来比较，所以比较字段需要将位数统一。

redis 的 `sort`命令能按照指定的顺序排序( desc，降序；asc，升序 )，同时可以截取排序结果并保存为一个单独的表( 或覆盖原来的表 )，如此则可以使用有序集合实现方式二的思想来实现：

* 按 MAX 统计排行榜时，按降序排序，则前500条记录即为TOP500；
* 按 MIN 统计排行榜时，按升序排序，则钱500条记录即为TOP500；

代码实现：

	var env = process.env.NODE_ENV || 'development',
		config = require('../../config/config')[env];
		logger = require('../../log').logger,
		redis = require('redis'),
		client = redis.createClient(config.redis.port,config.redis.host);
		
	...  省略中间代码  ...

	var value = obj[field],
		adesc = type == "max" ? "desc" : "asc",
		tmpstr = JSON.stringify(obj),
		tmpval = Array((11-(''+Math.floor(value)).length+1)).join(0)+value, //整数部分统一到 11 位
		multi = client.multi();
		
	var str = tmpstr.replace('{','{"KEY":"'+tmpval+'",'); // 将 KEY 部分添加到 字符串中
	multi.rpush([tabname, str], redis.print);
	multi.sort([tabname, 'limit', 0, count, adesc, 'alpha', 'store', tabname], redis.print);
	multi.exec(function(err,rest){
		if(err){
			logger.error(err);
		}else{
			logger.debug(rest);
		}
	});
代码也很简洁，不过实际效率情况的高低就不得而知了，其中需要注意的就是要将统计字段取出做等长处理( `MAX: 1.23` 和 `MAX: 11.3`，前者比后者小，但是转换为字符串之后，前者比后者大，将它们的整数位等长到11位或更多后，可以解决这个问题)；

这种实现方式的思路：将新的记录插入到表中，然后通过`sort`命令排序，并截取前500条记录覆盖原来的表，虽然每次都有排序，但是实际情况没有想象中那么糟糕，因为每次插入数据钱的数据都是排序好了的，插入一条数据的排序花销可能不是很大( 具体要看redis的排序实现方式：如果是通过快速排序来实现的话，效率会很低；如果是通过冒泡方式来实现的话效率会高不少 )。

这种方法只是一种探究，基本不会使用到生产环境中，推荐使用有序集合的实现方式二。

使用的方法说明：

* `multi = client.multi();`，顾名思义，相当于一个client的命令序列，先将要执行的命令放入其中，带启动时顺序执行； 
* `rpush([tabname, key], callback);`，同客户端命令 `RPUSH`，添加一个或多个值到列表右端( 尾部 )；
* `sort([tabname, 'limit', start, stop, 'asc'/'desc', 'alpha', 'store', tabname1], callback)`：同客户端命令 `sort`，将表 `tabname`的key 按字母( 默认会将key 转换为 double类型再做排序 )的升序或降序排列，并截取下标`start` 到 `stop`之间的元素，保存到 `tabname1`表中；
* `multi.exec(callback)`，按先后顺序运行`multi`中的命令；

大概的通过 Redis 实现排行榜的就是这样，如果有什么好的想法也可以跟我联系，一起交流进步！
