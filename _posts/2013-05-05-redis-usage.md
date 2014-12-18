---
layout: post
category: Memcache
title: Redis Linux 数据类型
tags: ['Redis', 'Linux', 'Type']
author: Jacky
email: shenyj5@asiainfo-linkage.com
image:
description: Redis 的5种不同的数据类型： 字符串(String), 哈希(Map), 列表(list), 集合(sets) 和 有序集合(sorted sets)。
---

##数据类型
###keys
redis本质上还是一个key-value db，所以我们首先来看看他的key。

相关命令

	exists key 测试指定的 key 是否存在，真1｜假0
	del key1 key2 ... keyn 返回删除的 key 的数目，0表示不存在
	type key 返回 key 的 value 类型
	keys pattern 返回匹配指定模式的所有 key
	randomkey 随机返回一个 key
	rename oldkey newkey 重命名一个 key，如果 newkey 存在会被覆盖
	renamenx oldkey newkey 同上，如果 newkey 存在返回失败
	dbsize 返回当前数据库的 key 数量
	expire key seconds 为 key 指定过期时间，单位是秒
	ttl key 返回设置过期时间的 key 的剩余过期时间
	select db-index 通过索引选择数据库，默认连接的是数据库0，默认数据库数是16个
	move key db-index 将 key 从当前数据库移动到指定数据库
	flushdb 删除当前数据库里面所有的 key
	flushall 删除所有数据库中所有的 key

	
示例

	redis 127.0.0.1:6479> set test 1
	OK
	redis 127.0.0.1:6479> set tast 2
	OK
	redis 127.0.0.1:6479> set tist 3
	OK
	redis 127.0.0.1:6479> exists test
	(integer) 1
	redis 127.0.0.1:6479> del tist
	(integer) 1
	redis 127.0.0.1:6479> type test
	string
	redis 127.0.0.1:6479> keys *
	1) "tast"
	2) "test"
	3) "tist"
	redis 127.0.0.1:6479> keys t*
	1) "tast"
	2) "test"
	3) "tist"
	redis 127.0.0.1:6479> keys t[ia]st
	1) "tast"
	2) "tist"
	redis 127.0.0.1:6479> keys t?st
	1) "tast"
	2) "test"
	3) "tist"
	redis 127.0.0.1:6479> randomkey
	"test"
	redis 127.0.0.1:6479> rename test tt
	OK
	redis 127.0.0.1:6479> dbsize
	(integer) 2
	redis 127.0.0.1:6479> expire tt 30
	(integer) 1
	redis 127.0.0.1:6479> ttl tt
	(integer) 24
	redis 127.0.0.1:6479> select 10
	OK
	redis 127.0.0.1:6479[10]> 

###string
string 是 redis 最基本的类型，而且 string 类型是二进制安全的，可以包含任何数据，包括图片和序列化的对象，最大可存1G字节。

相关命令

	set key value 设置 key 对应的 string 类型的值
	setnx key value 同上，如果 key 已经存在返回 0
	get key 获取 key 对应的 string 值，不存在返回 nil
	getset key 设置 key 的新值，并返回旧值
	mget key1 key2 ... keyn 一次获取多个 key 值
	mset key1 value1 key2 value2 ... keyn valuen 一次设置多个值
	incr key 对 key 做 ++ 操作，如果 value 不是 int 类型会返回错误
	decr kdy 对 key 做 -- 操作，可以为负 
	incrby key integer 对 key 加指定值
	decrby key integer 对 key 减指定值
	append key value 对 key 的值追加字符串
	substr key start end 截取指定 key 的字符串值，下标从0开始

示例

	redis 127.0.0.1:6479> flushdb
	OK
	redis 127.0.0.1:6479> set k1 a k2 b k3 c
	(error) ERR syntax error
	redis 127.0.0.1:6479> mset k1 a k2 b k3 c
	OK
	redis 127.0.0.1:6479> mget k1 k2 k3 k4
	1) "a"
	2) "b"
	3) "c"
	4) (nil)
	redis 127.0.0.1:6479> incr k4
	(integer) 1
	redis 127.0.0.1:6479> decrby k4 5
	(integer) -4
	redis 127.0.0.1:6479> set k1 hello
	OK
	redis 127.0.0.1:6479> append k1 ' world'
	(integer) 11
	redis 127.0.0.1:6479> mget k1 k2 k3 k4
	1) "hello world"
	2) "b"
	3) "c"
	4) "-4"
	redis 127.0.0.1:6479> substr k1 2 8
	"llo wor"

###list
redis的list类型其实就是一个每个子元素都是string类型的双向链表。所以[lr]push和[lr]pop命令的算法时间复杂度都是O(1)
另外list会记录链表的长度。所以llen操作也是O(1).链表的最大长度是(2的32次方-1)。我们可以通过push,pop操作从链表的头部
或者尾部添加删除元素。这使得list既可以用作栈，也可以用作队列。有意思的是list的pop操作还有阻塞版本的。当我们[lr]pop一个
list对象是，如果list是空，或者不存在，会立即返回nil。但是阻塞版本的b[lr]pop可以则可以阻塞，当然可以加超时时间，超时后也会返回nil
。为什么要阻塞版本的pop呢，主要是为了避免轮询。举个简单的例子如果我们用list来实现一个工作队列。执行任务的thread可以调用阻塞版本的pop去
获取任务这样就可以避免轮询去检查是否有任务存在。当任务来时候工作线程可以立即返回，也可以避免轮询带来的延迟。

相关命令

	lpush key string 在 key 对应的 list 头部添加字符串元素，如果 key 不是 list 类型返回错误
	rpush key string 同上，在尾部添加
	llen key 返回 key 对应的 list 的长度，key 不存在返回0，key 不是 list 类型返回错误
	lrange key start end 返回指定区间内的元素，下标从0开始，负数表示从后面开始
	ltrim key start end 截取 list，保留指定区间内的元素
	lset key index value 设置 list 指定下标的元素值
	lrem key count value 从 key 对应的 list 中删除 count 个 和 value 元素相同的元素，count 为0时删除全部
	lpop key 从 list 头部删除元素，并返回删除元素
	rpop key 同上，从 list 尾部删除
	blpop key1 key2 ... keyn timeout 从左到右返回一个非空 list 进行 lpop 操作并返回，如果所有的 list 都为空或者不存在，则会等待 timeout 秒，等待期间有 list 的 push 操作则立即返回，超时则返回 nil
	brpop key1 key2 ... keyn timeout 同上，从尾部删除
	rpoplpush srckey destkey 从 srckey 对应的 list 的尾部移动元素添加到 destkey 对应的 list 头部，最后返回被移除的元素，srckey 为空或者不存在返回 nil

示例

	redis 127.0.0.1:6479> lpush list1 aaa
	(integer) 1
	redis 127.0.0.1:6479> rpush list1 bbb
	(integer) 2
	redis 127.0.0.1:6479> lpush list1 ccc
	(integer) 3
	redis 127.0.0.1:6479> lpush list1 ddd
	(integer) 4
	redis 127.0.0.1:6479> llen list1
	(integer) 4
	redis 127.0.0.1:6479> lrange list1 0 2
	1) "ddd"
	2) "ccc"
	3) "aaa"
	redis 127.0.0.1:6479> ltrim list1 0 2
	OK
	redis 127.0.0.1:6479> lrange list1 0 3
	1) "ddd"
	2) "ccc"
	3) "aaa"
	redis 127.0.0.1:6479> lset list1 1 eeee
	OK
	redis 127.0.0.1:6479> lpop list1
	"ddd"
	redis 127.0.0.1:6479> rpop list1
	"aaa"

###set
redis的set是string类型的无序集合。set元素最大可以包含(2的32次方-1)个元素。set的是通过hash table实现的，所以添加，删除，查找的复杂度都是O(1)。hash table会随着添加或者删除自动的调整大小。需要注意的是调整hash table大小时候需要同步（获取写锁）会阻塞其他读写操作。可能不久后就会改用跳表（skip list）来实现
跳表已经在sorted set中使用了。关于set集合类型除了基本的添加删除操作，其他有用的操作还包含集合的取并集(union)，交集(intersection)，
差集(difference)。通过这些操作可以很容易的实现sns中的好友推荐和blog的tag功能。

相关命令

	sadd key member 添加一个 string 元素到 key 对应的 set 集合中
	srem key member 从 key 对应的 set 中移除给定元素
	spop key 删除并返回 key 对应的 set 随机的一个元素
	srandmember key 随机获取 set 中的一个元素，不删除
	smove srckey destkey member 从 srckey 对应的 set 中移除 member 并添加到 destkey 对应的 set 中
	scard key 返回 set 的元素个数
	sismember key member 判断 member 是否在 set 中
	sinter key1 key2 ... keyn 返回所有 set 的交集
	sinterstore destkey key1 key2 ... keyn 同上，并保存交集到 destkey 对应的 set 下
	sunion key1 key2 ... keyn 返回所有给定 set 的并集
	sunion destkey key1 key2 ... keyn 同上，并同时保存并集到 destkey 对应的 set 下
	sdiff key1 key2 ... keyn 返回所有 set 的差集
	sdiffstore destkey key1 key2 ... keyn 同上，并保存差集到 destkey 对应的 set 下
	smembers key 返回 key 对应的所有元素，结果是无序的

示例

	redis 127.0.0.1:6479> sadd set1 aaa
	(integer) 1
	redis 127.0.0.1:6479> sadd set1 bbb
	(integer) 1
	redis 127.0.0.1:6479> sadd set1 ccc
	(integer) 1
	redis 127.0.0.1:6479> srem set1 bbb
	(integer) 1
	redis 127.0.0.1:6479> spop set1
	"aaa"
	redis 127.0.0.1:6479> scard set1
	(integer) 1
	redis 127.0.0.1:6479> smembers set1
	1) "ccc"
	redis 127.0.0.1:6479> sadd set2 aaa
	(integer) 1
	redis 127.0.0.1:6479> sadd set2 bbb
	(integer) 1
	redis 127.0.0.1:6479> sadd set2 ccc
	(integer) 1
	redis 127.0.0.1:6479> sinterstore set3 set1 set2
	(integer) 1
	redis 127.0.0.1:6479> smembers set3
	1) "ccc"

###sorted set
和set一样sorted set也是string类型元素的集合，不同的是每个元素都会关联一个double类型的score。sorted set的实现是skip list和hash table的混合体
当元素被添加到集合中时，一个元素到score的映射被添加到hash table中，所以给定一个元素获取score的开销是O(1),另一个score到元素的映射被添加到skip list
并按照score排序，所以就可以有序的获取集合中的元素。添加，删除操作开销都是O(log(N))和skip list的开销一致,redis的skip list实现用的是双向链表,这样就
可以逆序从尾部取元素。sorted set最经常的使用方式应该是作为索引来使用.我们可以把要排序的字段作为score存储，对象的id当元素存储。

相关命令

	zadd key score member 添加元素互集合，元素存在只更新对应的 scroe
	zrem key member 删除指定元素
	zincrby key incr member 增加对应 member 的 scroe 值
	zrank key member 返回指定元素在集合中的下标，默认按 score 从小到大排序
	zrevrank key member 同上，按 scroe 从大到小排序
	zrange key start end 返回指定区间的元素
	zrevrange key start end 同上，返回结果按 score 逆序
	zrangebystore key min max 返回集合中 score 在给定区间的元素
	zcount key min max 返回集合中 score 在给定区间的数量
	zcard key 返回集合中元素个数
	zscore key element 返回给定元素对应的 score
	zremrangebyrank key min max 删除集合中排名在给定区间的元素
	zremrangebyscore key min max 删除集合中 score 在给定区间的元素

示例

	redis 127.0.0.1:6479> zadd ss1 10000 abc
	(integer) 1
	redis 127.0.0.1:6479> zadd ss1 20000 bbb
	(integer) 1
	redis 127.0.0.1:6479> zadd ss1 30000 ccc
	(integer) 1
	redis 127.0.0.1:6479> zadd ss1 44000 ddd
	(integer) 1
	redis 127.0.0.1:6479> zrank ss1 bbb
	(integer) 1
	redis 127.0.0.1:6479> zrevrank ss1 bbb
	(integer) 2
	redis 127.0.0.1:6479> zcard ss1
	(integer) 4
	redis 127.0.0.1:6479> zrangebyscore ss1 20000 40000
	1) "bbb"
	2) "ccc"


###hash
redis hash是一个string类型的field和value的映射表.它的添加，删除操作都是O(1)（平均）.hash特别适合用于存储对象。相较于将对象的每个字段存成
单个string类型。将一个对象存储在hash类型中会占用更少的内存，并且可以更方便的存取整个对象。省内存的原因是新建一个hash对象时开始是用zipmap（又称为small hash）来存储的。这个zipmap其实并不是hash table，但是zipmap相比正常的hash实现可以节省不少hash本身需要的一些元数据存储开销。尽管zipmap的添加，删除，查找都是O(n)，但是由于一般对象的field数量都不太多。所以使用zipmap也是很快的,也就是说添加删除平均还是O(1)。如果field或者value的大小超出一定限制后，redis会在内部自动将zipmap替换成正常的hash实现. 这个限制可以在配置文件中指定
hash-max-zipmap-entries 64 #配置字段最多64个
hash-max-zipmap-value 512 #配置value最大为512字节

相关命令

	hset key field value 设置 hash field 指定值
	hget key field 获取指定的 hash field 值
	hmget key field1 field2 ... fieldn 获取全部指定的值
	hmset key field1 value1 field2 value2 ... fieldn valuen 同时设定多个 field 值
	hincrby key field integer 将指定的 field 加上给定的值
	hexists key field 判断指定的 field 是否存在
	hdel key field 删除指定的 field
	hlen key 返回指定的 field 数量
	hkeys key 返回所有的 field
	hvals key 返回所有的 value
	hgetall 返回所有的 field 和 value

示例

	redis 127.0.0.1:6479> hmset hash1 field1 aaa field2 bbb field3 ccc
	OK
	redis 127.0.0.1:6479> hmget hash1 field1 field2 field3
	1) "aaa"
	2) "bbb"
	3) "ccc"
	redis 127.0.0.1:6479> hexists hash1 field2
	(integer) 1
	redis 127.0.0.1:6479> hlen hash1
	(integer) 3
	redis 127.0.0.1:6479> hkeys hash1
	1) "field1"
	2) "field2"
	3) "field3"
	redis 127.0.0.1:6479> hvals hash1
	1) "aaa"
	2) "bbb"
	3) "ccc"
	redis 127.0.0.1:6479> hgetall hash1
	1) "field1"
	2) "aaa"
	3) "field2"
	4) "bbb"
	5) "field3"
	6) "ccc"



