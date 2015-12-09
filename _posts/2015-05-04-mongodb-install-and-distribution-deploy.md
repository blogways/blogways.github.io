---
layout: post
category: NoSQL
title: MongoDB 安装与分布式部署
tags: ['MongoDB', 'Sharding', '分片', '分布式部署']
author: 万洲
email: wanzhou@asiainfo.com
description: MongoDB 是目前在IT行业非常流行的一种非关系型数据库(NoSql),其灵活的数据存储方式备受当前IT从业人员的青睐。Mongo DB很好的实现了面向对象的思想,在MongoDB中 每一条记录都是一个Document对象。Mongo DB最大的优势在于所有的数据持久操作都无需开发人员手动编写SQL语句,直接调用方法就可以轻松的实现CRUD操作。

---

## 一、概述
NoSQL数据库与传统的关系型数据库相比，它具有操作简单、完全免费、源码公开、随时下载等特点，并可以用于各种商业目的。这使NoSQL产品广泛应用于各种大型门户网站和专业网站，大大降低了运营成本。

MongoDB的文档模型自由灵活，可以让你在开发过程中畅顺无比。对于大数据量、高并发、弱事务的互联网应用，MongoDB可以应对自如。MongoDB内置的水平扩展机制提供了从百万到十亿级别的数据量处理能力，完全可以满足Web2.0和移动互联网的数据存储需求，其开箱即用的特性也大大降低了中小型网站的运维成本。

## 二、安装MongoDB
到官网下载对应的版本[http://www.mongodb.org/downloads](http://www.mongodb.org/downloads)，下载完成后解压即可使用。也可以下载源码自己编译[https://github.com/mongodb/mongo](https://github.com/mongodb/mongo)。

下载编译好的文件：

	cd ~/tools
	wget -c https://fastdl.mongodb.org/osx/mongodb-osx-x86_64-3.0.2.tgz
	# 等待下载完成
	tar zxf mongodb-osx-x86_64-3.0.2
	ln -s mongodb-osx-x86_64-3.0.2 mongodb
	echo "export MONGODB_HOME=~/tools/mongodb" >> ~/.bash_profile && source ~/.bash_profile
命令行启动 MongoDB 后台驻留程序：

	mongod --dbpath /data/mongodb/db --logpath /data/mongodb/logs/mongod.log --nojournal --fork --port 27037
后台mongodb 主流程序，监听本机 27037 号端口，数据库文件保存在`/data/mongodb/db`目录下，日志文件输出到`/data/mongodb/logs/mongod.log`文件下，并禁用`journaling`( 启用 journaling 后，会将数据库相关操作等以日志的形式保存下来，会占用较大的硬盘空间和虚拟内存，64位mongodb，默认开启；32位版本默认关闭 )。

通过 `mongo` 连接 MongoDB 服务：

	#mongo --help 可以查看mongo命令介绍
	mongo test # 连接本地，27017端口的test数据库
	mongo 192.168.20.1/test # 连接192.168.20.1主机，27017端口的数据库test
	mongo 192.168.20.1:66666/test #连接192.168.20.1主角，66666端口的数据库test
	
### 三、常用命令
一般数据操作都有一些常用的客户端命令( 此处为：mongo shell )，MongoDB 的基本存储单元是集合 (collection)，想到于关系数据库mysql、oracle或sql server的表；
#### 查询数据库
	> show dbs    # or show databases
	admin   (empty)
	local   0.078GB
	test    0.078GB
#### 切换数据库
	> use test
	switched to db test
#### 查看数据集合
	> show collections
	system.indexes
	users
#### 集合操作
集合的基本操作命令如下所示：

	db.<collectionName>.<operate>(<argument>)
	
常用的集合操作有：

	查找记录 ( find )
	查询记录数 ( count )
	插入记录 ( insert )
	删除记录 ( remove )
	更新尽量 ( update )
这所有的集合操作接受的参数都是通过 JSON 	的形式传递的：

	#查询所有记录
	db.users.find()
	# 查找 users 集合中，姓名为 小王的记录
	db.users.find({name: '小王'})
因为MongoDB是 NoSQL 数据库，因此不需要预定义表结构，直接通过 insert 插入数据即可。

### 四、分布式部署
本机部署3个shard、1个mongos和3个 configsvr；

* Shard1：27037
* Shard2：27038
* Shard3：27039
* Mongos：27017
* Config1：27027
* Config2：27028
* COnfig3：27029

在`/data/mongodb`目录下创建文件夹`shard0001`，`shard0002`，`shard0003`，`config0001`，`config0002``config0003`和`logs`，分别用以保持分片数据、配置服务器数据和日志文件
#### 启动配置服务器
首先启动3个配置服务器，测试环境使用一个配置服务器也可以，但是生产环境必须是3个，MongoDB最多支持3个配置服务器；

	mongod --configsvr --port 27027 --dbpath /data/mongodb/config0001 --logpath /data/mongodb/logs/config0001.log --fork
	mongod --configsvr --port 27028 --dbpath /data/mongodb/config0001 --logpath /data/mongodb/logs/config0001.log --fork
	mongod --configsvr --port 27029 --dbpath /data/mongodb/config0001 --logpath /data/mongodb/logs/config0001.log --fork
运行上诉命令将启动3个配置服务器，其中的参数介绍：

* `--configsvr`，指定启动的是分配操作的配置服务器，该参数仅仅指定了默认的端口号( 27019 )和默认数据存放位置( /data/configdb )，并没有其它的任何用途，可以显示指定以覆盖默认设置
* `--port [端口号]`，指定该配置服务器监听的端口号，如果设置了`--configsvr`参数则默认为`27019`；
* `--dbpath [数据存放路径]`，指定配置服务器存放文件目录，如果设置了`--configsvr`参数则默认为`/data/configdb`；
* `--logpath [日志存放路径]`，指定配置服务器的日志存放地；
* `--fork`，指定该配置服务器位后台驻留程序；

#### 启动路由服务器
路由服务器可以根据需求启动一个或多个，启动个数没有限制，作为MongoDB集群的访问点，提供与未分配中`mongod`类似的功能，是MongoDB集群对外的“接口”；

	mongos --port 27017 --configdb localhost:27027,localhost:27028,localhost:27029 logpath /data/mongodb/logs/mongos.log --fork
命令、参数介绍：

* `mongos`，此处启动的命令是***mongos***；
* `--configdb`，指定配置服务器的主机/IP地址 + 端口号，只能是3个或1个，多个之间通过 ***`,`***分割；

#### 启动分片
分片实例其实就是通过命令`mongod`启动的 MongoDB 实例；

	mongod --port 27037 --dbpath /data/mongodb/shard0001 --logpath /data/mongodb/logs/shard0001.log --fork
	mongod --port 27038 --dbpath /data/mongodb/shard0002 --logpath /data/mongodb/logs/shard0002.log --fork
	mongod --port 27039 --dbpath /data/mongodb/shard0003 --logpath /data/mongodb/logs/shard0003.log --fork
至此所有分布式启动的后台程序都已启动完毕，后面就是分片操作了。

#### Mongo Shell 分片
在按照上诉顺序启动完所有MongoDB 实例后，打开一个命令行参数，想前面说的那样，通过`mongo`命令连接路由服务器；

	mongo localhost:27017/admin
	# or
	$ mongo admin
	MongoDB shell version: 2.6.7
	connecting to: admin
	mongos>
添加分片，MongoDB 会将启动的分片的信息保持到配置服务器上；

	mongos> sh.addShard('localhost:27037')
	{ "shardAdded" : "shard0000", "ok" : 1 }
	mongos> sh.addShard('localhost:27038')
	{ "shardAdded" : "shard0001", "ok" : 1 }
	mongos> sh.addShard('localhost:27039')
	{ "shardAdded" : "shard0002", "ok" : 1 }
通过`sh.status()` 查看分片结果：
	
	mongos> sh.status()
	--- Sharding Status --- 
	  sharding version: {
		"_id" : 1,
		"version" : 4,
		"minCompatibleVersion" : 4,
		"currentVersion" : 5,
		"clusterId" : ObjectId("55471025f722cd42a930ecee")
	}
	  shards:
		{  "_id" : "shard0000",  "host" : "localhost:27037" }
		{  "_id" : "shard0001",  "host" : "localhost:27038" }
		{  "_id" : "shard0002",  "host" : "localhost:27039" }
	  databases:
		{  "_id" : "admin",  "partitioned" : false,  "primary" : "config" }
		{  "_id" : "test",  "partitioned" : true,  "primary" : "shard0000" }
启动数据库分片；

	# 格式 : sh.enableSharding(<databaseName>)
	mongos> sh.enableSharding('test')
	{ "ok" : 1 }
当启动数据库*** test ***的分片过后，再通过`sh.status()`命令查看，可发现相应的改变：

	# ... 前面相同
	  databases:
		{  "_id" : "admin",  "partitioned" : false,  "primary" : "config" }
		{  "_id" : "test",  "partitioned" : true,  "primary" : "shard0000" }
发现在***databases***一项中，对应的多了一向分片的*** test ***数据库，其中：

* `_id`，表示分片的数据库名，此处为*** test ***；
* `partitioned`，表示是否启动分片，为 *** true ***表示启用分片；
* `primary`，表示数据库存放的“主片”，一旦主片存放满了，或达到了分片设置的阈值，才会将数据存放到其它片，否则将一直存放于该主片上。

至此 MongoDB 的分布式部署完成。

### 五、集合分片
在集合分片之前，说明单片( 不分片 )的局限性：

1. 单台主机的硬盘资源限制，一台主机的硬盘空间是一定的，当存放数据量达到硬盘的容量极限后，就只能为主机增加硬盘空间；
2. 入库速度的限制，如果某个功能实现每分每秒有大量的数据插入 (如：日志收集、网页抓取等)，单台主机入库的速度存在则极限( 后面会介绍 )，一旦入库请求操作此极限，入库速度会急剧下降；

由此，分片的好处就不言而喻了，它可以进行水平扩展，一旦现行的设备无法满足需求之后，只需要添加分片即可，添加之后 MongoDB 会根据设置***自动平衡***数据( 将数据移动到新插入的分片中 )；

还有就是如果集合分片之后，入库将会是分布式方式入库，***mongos ***会将所有的入库请求，根据设置分配到各个分片上，降低耽搁分片入库的极限，使得一些对入库要求很高的的程序能稳定运行；

有得必有失，分片增加的入库速度，相应的查询更新速度就有所降低，如果不合理的查询( 没有提供分配字段 )，将导致遍历整个数据集合，这里的不合理查询一般都是查询条件中不包含分片的字段，MongoDB 则无法定位查询在哪个分配上进行，进而导致遍历整个集合。

#### Range 分片
根据给定的列( 如：age )，按分片数的范围分片，如此处分为三片，则分配范围：

	minKey ~ 30			30 ~ 60			60 ~ maxKey 
	shard0001         shard0002        shard0003
年龄在`minKey ~ 30`之间的信息，将会保存在分片***shard0001***上，`30 ~ 60`的则会保持在***shard0002***上，依次类推。

分片方式：
	
	# sh.shardCollection('<database>.<collection>', {'colName' : 1/-1})
	sh.shardCollection('test.users', {'age': 1})
	{ "collectionsharded" : "test.users", "ok" : 1 }
可以通过`db.users.stats()`来查看分片过后集合的状态信息，因为是按范围分布的，相同范围之内的存放于同一个分片中，要提升入库速度的话，必须选择合适的分片依据，防止同一时间段内入口同一范围的数据；

可以通过设置多个分片健来解决，

	sh.shardCollections('test.users', {'age': 1, 'name': 1})
所以合理选择分片Key很重要

#### Hash 分片
顾名思义，Hash 分片就是将数据根据分配字段 Hash 分布到各个片中，好处是即使同一时刻分配字段连续递增，入库结果基本也是均衡分配的；

		             Hash Function
		 _________________|_____________________
	    |                 |                     |
	shard0001         shard0002             shard0003
入库记录会经过***mongos***的Hash 函数的处理，将不同的记录分发到各个分片中入库。

分片方式：

	# sh.shardCollection('<database>.<collection>', {'age': 'hashed'})
	mongos> sh.shardCollection('test.info', {'phone': 'hashed'})
	{ "collectionsharded" : "test.info", "ok" : 1 }
分片信息`db.info.stats()`：
	
	mongos> db.info.stats()
	{
		"sharded" : true,
		"systemFlags" : 1,
		"userFlags" : 1,
		"ns" : "test.info",
		"count" : 0,
		"numExtents" : 3,
		"size" : 0,
		"storageSize" : 24576,
		"totalIndexSize" : 49056,
		"indexSizes" : {
			"_id_" : 24528,
			"phone_hashed" : 24528
		},
		"avgObjSize" : 0,
		"nindexes" : 2,
		"nchunks" : 6,
		"shards" : {
			"shard0000" : {
				"ns" : "test.info",
				"count" : 0,
				"size" : 0,
				"storageSize" : 8192,
				"numExtents" : 1,
				"nindexes" : 2,
				"lastExtentSize" : 8192,
				"paddingFactor" : 1,
				"systemFlags" : 1,
				"userFlags" : 1,
				"totalIndexSize" : 16352,
				"indexSizes" : {
					"_id_" : 8176,
					"phone_hashed" : 8176
				},
				"ok" : 1
			},
			"shard0001" : {
				...
			},
			"shard0002" : {
				...
			}
		},
		"ok" : 1
	}
现在再去插入一些记录看下，所有的记录分别被插入到了不同的分当中去了。

</br>

===

</br>

***分片部分完成，后续还有 MongoDB 分片等的，根据官方文档的详细介绍。***