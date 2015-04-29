---
layout: post
category: Apache
title: Apache Flume-NG 介绍[4] 之 Channel
tags: ['Flume-NG', 'Channel']
author: 万洲
#image: /images/post/flume-ng.png
email: wanzhou@asiainfo.com
description: Flume NG是一个分布式、可靠、可用的系统，它能够将不同数据源的海量日志数据进行高效收集、聚合、移动，最后存储到一个中心化数据存储系统中。由原来的Flume OG到现在的Flume NG，进行了架构重构，经过架构重构后，Flume NG更像是一个轻量的小工具，非常简单，容易适应各种方式日志收集，并支持failover和负载均衡。
---


## 一、常用Channel介绍
Channels 是一个 Agent上存储 events 的仓库，Source 向其中添加 events，而 Sink从中取走移除 events。

此处介绍的 Channel 有：Memory Channel、File Channel 和 Spillable Memory Channel。

### Memory Channel
Source 添加的 events 都暂存在内存队列中，它非常适合那些需要更高吞吐量的数据流，但代价是一旦一个 agent 失败后，其中存储的events数据将会丢失。其必须的属性如下：

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>memory</code></td></tr>
<tr><td width="15%">capacity</td><td width="10%">100</td><td>存储在 Channel 当中的最大 events 数</td></tr>
<tr><td width="15%">transactionCapacity</td><td width="10%">100</td><td>同时刻从Source 获取，或发送到 Sink 的最大 events 数</td></tr>
<tr><td width="15%">keep-alive</td><td width="10%">3</td><td>添加或删除一个 event 超时的秒数</td></tr>
<tr><td width="15%">byteCapacityBufferPercentage</td><td width="10%">20</td><td><i><b>详见表后的链接</b></i></td></tr>
<tr><td width="15%">byteCapacity</td><td width="10%">20000</td><td><i><b>详见表后的链接</b></i></td></tr></table>

详情见：[http://flume.apache.org/FlumeUserGuide.html#memory-channel](http://flume.apache.org/FlumeUserGuide.html#memory-channel)

实例 `Agent a1`：

	a1.channels = c1
	a1.channels.c1.type = memory
	a1.channels.c1.capacity = 10000
	a1.channels.c1.transactionCapacity = 10000
	a1.channels.c1.byteCapacityBufferPercentage = 20
	a1.channels.c1.byteCapacity = 800000
	
### File Channel
必须的属性如下：

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>file</code></td></tr>
<tr><td width="15%">hostname</td><td width="10%">-</td><td>绑定的主机名或者 IP 地址</td></tr>
<tr><td width="15%">port</td><td width="10%">-</td><td>绑定的端口号</td></tr>
<tr><td width="15%">batch-size</td><td width="10%">100</td><td>一次同时发送的 event 数</td></tr>
<tr><td width="15%">connect-timeout</td><td width="10%">20000</td><td>第一次握手请求时允许的时长。( ms )</td></tr>
<tr><td width="15%">request-timeout</td><td width="10%">20000</td><td>第一次过后，后续请求允许的时长 ( ms )</td></tr>
<tr><td width="15%">ireset-connection-interval</td><td width="10%">none</td><td></td></tr>
</table>

实例，`Agent a1`：

	a1.channels = c1
	a1.channels.c1.type = file
	a1.channels.c1.checkpointDir = /mnt/flume/checkpoint
	a1.channels.c1.dataDirs = /mnt/flume/data
	
### Spillable Memory Channel
Logs Sink 属于 INFO 级别的，通常用作测试或调试目的，其属性：

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>SPILLABLEMEMORY</code></td></tr>
<tr><td width="15%">memoryCapacity</td><td width="10%">10000</td><td>存储在内存队列中的最大 events 数，设置为 <code>0</code>，则禁用缓存到内存队列</td></tr>
<tr><td width="15%">overflowCapacity</td><td width="10%">100000000</td><td>存储在本地磁盘的最大 events 数，设置为 <code>0</code>，则禁用缓存到本地文件</td></tr>
<tr><td width="15%">overflowTimeout</td><td width="10%">3</td><td>当内存队列溢出后，启用本地磁盘缓存的超时时间</td></tr>
<tr><td width="15%">byteCapacityBufferPercentage</td><td width="10%">见描述</td><td><i><b>详见表后的链接</b></i></td></tr>
<tr><td width="15%">byteCapacity</td><td width="10%">20</td><td><i><b>详见表后的链接</b></i></td></tr>
<tr><td width="15%">avgEventSize</td><td width="10%">500</td><td>估计将要缓存到 Channel 当中的 events 的平均大小 (单位：字节)</td></tr>
<tr><td width="15%">&lt;file channel properties&gt;</td><td width="10%">见描述</td><td><i><b>详见表后的链接</b></i></td></tr>
</table>

详情见：[http://flume.apache.org/FlumeUserGuide.html#spillable-memory-channel](http://flume.apache.org/FlumeUserGuide.html#spillable-memory-channel)

如果 `memoryCapacity`或`byteCapacity`被设置为 0，则 Flume 理解为内存队列已经满了。

实例，`Agnet a1`：

	a1.channels = c1
	a1.channels.c1.type = SPILLABLEMEMORY
	a1.channels.c1.memoryCapacity = 10000
	a1.channels.c1.overflowCapacity = 1000000
	a1.channels.c1.byteCapacity = 800000
	a1.channels.c1.checkpointDir = /mnt/flume/checkpoint
	a1.channels.c1.dataDirs = /mnt/flume/data
	
禁用缓存 events 到内存队列，`memoryCapacity`属性设为 0，则此 Channel 就像一个 File Channel：

	a1.channels = c1
	a1.channels.c1.type = SPILLABLEMEMORY
	a1.channels.c1.memoryCapacity = 0
	a1.channels.c1.overflowCapacity = 1000000
	a1.channels.c1.checkpointDir = /mnt/flume/checkpoint
	a1.channels.c1.dataDirs = /mnt/flume/data
禁用缓存 events 到本地磁盘，`overflowCapacity`属性设为 0，则此 Channel 就像一个纯粹的 Memory Channel：

	a1.channels = c1
	a1.channels.c1.type = SPILLABLEMEMORY
	a1.channels.c1.memoryCapacity = 100000
	a1.channels.c1.overflowCapacity = 0

</br>

===

***未完待续。。。***
