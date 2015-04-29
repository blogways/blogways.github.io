---
layout: post
category: Apache
title: Apache Flume-NG 介绍[3] 之 Sink
tags: ['Flume-NG', 'sink']
author: 万洲
#image: /images/post/flume-ng.png
email: wanzhou@asiainfo.com
description: Flume NG是一个分布式、可靠、可用的系统，它能够将不同数据源的海量日志数据进行高效收集、聚合、移动，最后存储到一个中心化数据存储系统中。由原来的Flume OG到现在的Flume NG，进行了架构重构，经过架构重构后，Flume NG更像是一个轻量的小工具，非常简单，容易适应各种方式日志收集，并支持failover和负载均衡。
---


## 一、常用Sink介绍

此处介绍的 Sinks 有：HDFS Sink、Logger Sink、Avro/Thrift Sink、HBase Sink。

### Avro Sink

Avro Sink 为 Flume 的层次连接提供了一半的支持( 另一半为 Avro Source )，发送到此 Sink 的 Flume 被转换为 Avro 事件，然后被发送到对应的主机：端口上。其必须的属性如下：

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>avro</code></td></tr>
<tr><td width="15%">hostname</td><td width="10%">-</td><td>绑定的主机名或者 IP 地址</td></tr>
<tr><td width="15%">port</td><td width="10%">-</td><td>绑定的端口号</td></tr>
<tr><td width="15%">batch-size</td><td width="10%">100</td><td>一次同时发送的 event 数</td></tr>
<tr><td width="15%">connect-timeout</td><td width="10%">20000</td><td>第一次握手请求时允许的时长。( ms )</td></tr>
<tr><td width="15%">request-timeout</td><td width="10%">20000</td><td>第一次过后，后续请求允许的时长 ( ms )</td></tr>
<tr><td width="15%">ireset-connection-interval</td><td width="10%">none</td><td></td></tr>
<tr><td width="15%">compression-type</td><td width="10%">none</td><td>可选项为“none”或“deflate”，compression-type必须符合匹配AvroSource的compression-type</td></tr>
<tr><td width="15%">compression-level</td><td width="10%">6</td><td>压缩 event 的压缩级别，0 为不压缩，1 - 9 为压缩，数字越大则压缩率越大。</td></tr>
<tr><td width="15%">ssl</td><td width="10%">false</td><td>设置为<code>true</code>启用SSL加密，同时可以选择性设置“truststore”，“truststore-password”，“truststore-type”，并且指定是否打开“trust-all-certs”</td></tr>
<tr><td width="15%">trust-all-certs</td><td width="10%">false</td><td>如果设置为 <code>true</code>，则远程服务( Avro Source )的 SSL 服务证书将不会进行校验，因而生产环境不能设置为 <code>true</code></td></tr>
<tr><td width="15%">truststore</td><td width="10%">-</td><td>Java truststore文件的路径，需要启用SSL加密</td></tr>
<tr><td width="15%">truststore-password</td><td width="10%">-</td><td>Java truststore的密码，需要启用SSl加密</td></tr>
<tr><td width="15%">truststore-type</td><td width="10%">JKS</td><td>Java truststore的类型，可选项为：“JSK” 或其它支持的Java truststore 类型</td></tr>
<tr><td width="15%">exclude-protocols</td><td width="10%">SSLv2Hello SSLv3</td><td>Space-separated list of SSL/TLS protocols to exclude</td></tr>
<tr><td width="15%">maxIoWorkers</td><td width="10%">2 * 当前机器上可用的处理器数</td><td>I/O 处理线程的最大数，在 <code>NettyAvroRpcClient</code> 和 <code>NioClientSocketChannelFactory</code> 上被加载。</td></tr>
</table>

实例 `Agent a1`：

	a1.channels = c1
	a1.sinks = k1
	a1.sinks.k1.type = avro
	a1.sinks.k1.channel = c1
	a1.sinks.k1.hostname = 10.10.10.10
	a1.sinks.k1.port = 4545
	
### Thrift Sink
Thrift Sink 为 Flume 的层次连接提供了一半的支持( 另一半为 Thrift Source )，发送到此 Sink 的 Flume 被转换为 Thrift 事件，然后被发送到对应的主机：端口上。其必须的属性如下：

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>thrift</code></td></tr>
<tr><td width="15%">hostname</td><td width="10%">-</td><td>绑定的主机名或者 IP 地址</td></tr>
<tr><td width="15%">port</td><td width="10%">-</td><td>绑定的端口号</td></tr>
<tr><td width="15%">batch-size</td><td width="10%">100</td><td>一次同时发送的 event 数</td></tr>
<tr><td width="15%">connect-timeout</td><td width="10%">20000</td><td>第一次握手请求时允许的时长。( ms )</td></tr>
<tr><td width="15%">request-timeout</td><td width="10%">20000</td><td>第一次过后，后续请求允许的时长 ( ms )</td></tr>
<tr><td width="15%">ireset-connection-interval</td><td width="10%">none</td><td></td></tr>
</table>

实例，`Agent a1`：

	a1.channels = c1
	a1.sinks = k1
	a1.sinks.k1.type = thrift
	a1.sinks.k1.channel = c1
	a1.sinks.k1.hostname = 10.10.10.10
	a1.sinks.k1.port = 4545
	
### HDFS Sink
HDFS Sink 将 events 写入到 Hadoop 分布式文件系统( HDFS )当中，目前它支持创建文本文件和二进制序列化文件( SequenceFile )，这两种文件类型都支持压缩文件。数据库文件能够周期性地，在运行时间、数据大小或event数量的基础上轮转( 关闭当前文件，并创建一个新文件 )。It also buckets/partitions data by attributes like timestamp or machine where the event originated. The HDFS directory path may contain formatting escape sequences that will replaced by the HDFS sink to generate a directory/file name to store the events. 使用 HDFS Sink 需要安装 hadoop，如此 Flume 便能够通过 hadoop jars 连接 HDFS 集群，注意，Hadoop 的版本必须支持`sync()`调用。

下面是支持的转义序列：
<table width="100%">
<tr><th width="20%">别名</th><th>描述</th></tr>
<tr><td width="20%">%{host}</td><td></td></tr>
<tr><td width="20%">%t</td><td>Unix 时间的秒数</td></tr>
<tr><td width="20%">%a</td><td>本地的星期缩写名称 (Mon, Tue, ...)</td></tr>
<tr><td width="20%">%A</td><td>本地的星期完整名称 (Monday, Tuesday, ...)</td></tr>
<tr><td width="20%">%b</td><td>本地的月份缩写名称 (Jan, Feb, ...)</td></tr>
<tr><td width="20%">%B</td><td>本地的月份完整名称 (January, February, ...)</td></tr>
<tr><td width="20%">%c</td><td>本地的日期和时间 (Thu Mar 3 23:05:25 2005)</td></tr>
<tr><td width="20%">%d</td><td>某月中的某天 (01)</td></tr>
<tr><td width="20%">%D</td><td>日期，与 <code>%m/%d/%y</code> 一样</td></tr>
<tr><td width="20%">%H</td><td>24 小时制的小时，<b><i>补齐两位</i></b> (00..23)</td></tr>
<tr><td width="20%">%I</td><td>12 小时制的小时，<b><i>补齐两位</i></b> (01..12)</td></tr>
<tr><td width="20%">%j</td><td>某年中的某天 (001..366)</td></tr>
<tr><td width="20%">%k</td><td>24 小时制的小时，<b><i>不补齐两位</i></b> ( 0..23)</td></tr>
<tr><td width="20%">%m</td><td>月份 (01..12)</td></tr>
<tr><td width="20%">%M</td><td>分钟数 (00..59)</td></tr>
<tr><td width="20%">%p</td><td>本地上午或下午 (am, pm)</td></tr>
<tr><td width="20%">%s</td><td>从 <code>1970-01-01 00:00:00 UTC</code> 到现在的秒数</td></tr>
<tr><td width="20%">%S</td><td>秒数 (00..59)</td></tr>
<tr><td width="20%">%y</td><td>年份的后两位数字 (00..99)</td></tr>
<tr><td width="20%">%Y</td><td>年份 (2015)</td></tr>
<tr><td width="20%">%z</td><td>+hhmm numeric timezone (for example, -0400)</td></tr>
</table>

正在读取的文件的文件名会以 `.tmp` 结尾，一旦文件被关闭，则扩展部分会被移除，这使排除目录中部分完成的文件称为可能。其config属性如下：

***注意：对于所有与时间相关的转义系列，一个包含 “timestamp” 的header必须在 event 的所有headers中存在( 除非 `hdfs.useLocalTimeStamp` 被设置为 `true` )。设置自动添加的一种方式是使用 `TimestampInterceptor`。***

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>hdfs</code></td></tr>
<tr><td width="15%">hdfs.path</td><td width="10%">-</td><td>HDFS 目录路径 (如 <code>hdfs://namenode/flume/webdata/</code>)</td></tr>
<tr><td width="15%">hdfs.filePrefix</td><td width="10%">FlumeData</td><td>在 HDFS 目录中，Flume 创建的文件的前缀</td></tr>
<tr><td width="15%">hdfs.fileSuffix</td><td width="10%">-</td><td>文件的后缀 (如 <code>.avro</code> - 注意：时间不是自动添加的)</td></tr>
<tr><td width="15%">hdfs.inUsePrefix</td><td width="10%">-</td><td>Flume 正在写入的临时文件的的前缀</td></tr>
<tr><td width="15%">hdfs.inUseSuffix</td><td width="10%"><code>.tmp</code></td><td>Flume 正在写入的临时文件的后缀</td></tr>
</table>

更多属性配置详见：[http://flume.apache.org/FlumeUserGuide.html#hdfs-sink](http://flume.apache.org/FlumeUserGuide.html#hdfs-sink)

实例，`Agent a1`：

	a1.channels = c1
	a1.sinks = k1
	a1.sinks.k1.type = hdfs
	a1.sinks.k1.channel = c1
	a1.sinks.k1.hdfs.path = /flume/events/%y-%m-%d/%H%M/%S
	a1.sinks.k1.hdfs.filePrefix = events-
	a1.sinks.k1.hdfs.round = true
	a1.sinks.k1.hdfs.roundValue = 10
	a1.sinks.k1.hdfs.roundUnit = minute
	
上面的配置将时间戳四舍五入到最近的10分钟，如：一个 event 的时间戳是 `11:54:34 AM, June 12, 2012`，那么映射到 hdfs 路径则为 `/flume/events/2012-06-12/1150/00`

	
### HBase Sink
具体介绍等，详见：[http://flume.apache.org/FlumeUserGuide.html#hbasesink](http://flume.apache.org/FlumeUserGuide.html#hbasesink)

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>hbase</code></td></tr>
<tr><td width="15%">table</td><td width="10%">-</td><td>HBase 中写入数据的表</td></tr>
<tr><td width="15%">columnFamily</td><td width="10%">-</td><td>HBase 中写入数据列簇</td></tr>
<tr><td width="15%">zookeeperQuorum</td><td width="10%">-</td><td>The quorum spec. This is the value for the property hbase.zookeeper.quorum in hbase-site.xml</td></tr>
<tr><td width="15%">znodeParent</td><td width="10%">/hbase</td><td>The base path for the znode for the -ROOT- region. Value of zookeeper.znode.parent in hbase-site.xml</td></tr>
<tr><td width="15%">batchSize</td><td width="10%">100</td><td>每次事务处理写入的 event数</td></tr>
<tr><td width="15%">coalesceIncrements</td><td width="10%">false</td><td>是否添加一个保存文件 <code>basename</code> 的Header</td></tr>
<tr><td width="15%">serializer</td><td width="10%">org.apache.flume.sink.hbase.SimpleHbaseEventSerializer</td><td>Default increment column = “iCol”, payload column = “pCol”</td></tr>
<tr><td width="15%">serializer.*</td><td width="10%">-</td><td>Properties to be passed to the serializer.</td></tr>
<tr><td width="15%">kerberosPrincipal</td><td width="10%">-</td><td>Kerberos user principal for accessing secure HBase</td></tr>
<tr><td width="15%">kerberosKeytab</td><td width="10%">-</td><td>Kerberos keytab for accessing secure HBase</td></tr>
</table>

实例，`Agent agent-1`：

	a1.channels = c1
	a1.sinks = k1
	a1.sinks.k1.type = hbase
	a1.sinks.k1.table = foo_table
	a1.sinks.k1.columnFamily = bar_cf
	a1.sinks.k1.serializer = org.apache.flume.sink.hbase.RegexHbaseEventSerializer
	a1.sinks.k1.channel = c1
	
### Logger Sink
Logs Sink 属于 INFO 级别的，通常用作测试或调试目的，其属性：

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>logger</code></td></tr>
</table>

实例，`Agnet a1`：

	a1.channels = c1
	a1.sinks = k1
	a1.sinks.k1.type = logger
	a1.sinks.k1.channel = c1
	

</br>

===

***未完待续。。。***
