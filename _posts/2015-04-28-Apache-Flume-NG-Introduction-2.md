---
layout: post
category: Apache
title: Apache Flume-NG 介绍[2] 之 Source
tags: ['Flume-NG', 'source', 'Deserializers']
author: 万洲
#image: /images/post/flume-ng.png
email: wanzhou@asiainfo.com
description: Flume NG是一个分布式、可靠、可用的系统，它能够将不同数据源的海量日志数据进行高效收集、聚合、移动，最后存储到一个中心化数据存储系统中。由原来的Flume OG到现在的Flume NG，进行了架构重构，经过架构重构后，Flume NG更像是一个轻量的小工具，非常简单，容易适应各种方式日志收集，并支持failover和负载均衡。
---


## 一、常用Sources介绍

此处介绍的 Sources 有：Avro Source、Thrift Source、Exec Source、Spooling Directory Source。

### Avro Source

监听 Avro 端口，接收外部 Avro 客户端发来的 Event 是流，当和另一个Agent (Event流上，前面一个) 的 Avro Sink 连接配对时，能够将两个 Agent 连接形成一个Event 链。其必须的属性如下：

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>avro</code></td></tr>
<tr><td width="15%">bind</td><td width="10%">-</td><td>监听的主机名或者 IP 地址</td></tr>
<tr><td width="15%">port</td><td width="10%">-</td><td>监听的端口号</td></tr>
<tr><td width="15%">threads</td><td width="10%">-</td><td>能生成的工作线程的最大数</td></tr>
<tr><td width="15%">selector.type</td><td width="10%"></td><td></td></tr>
<tr><td width="15%">selector.*</td><td width="10%"></td><td></td></tr>
<tr><td width="15%">interceptors</td><td width="10%">-</td><td>Space-separated list of interceptors</td></tr>
<tr><td width="15%">interceptors.*</td><td width="10%"></td><td></td></tr>
<tr><td width="15%">compression-type</td><td width="10%">none</td><td>可选项为“none”或“deflate”，compression-type必须符合匹配AvroSource的compression-type</td></tr>
<tr><td width="15%">ssl</td><td width="10%">false</td><td>设置为<code>true</code>启用SSL加密，同时必须制定一个“keystore”和一个“keystore-password”</td></tr>
<tr><td width="15%">keystore</td><td width="10%">-</td><td>Java keystore文件的路径，需要启用SSL加密</td></tr>
<tr><td width="15%">keystore-password</td><td width="10%">-</td><td>Java keystore的密码，需要启用SSl加密</td></tr>
<tr><td width="15%">keystore-type</td><td width="10%">JKS</td><td>Java keystore的类型，可选项为：“JSK” 和 “PKCS12”</td></tr>
<tr><td width="15%">exclude-protocols</td><td width="10%">SSLv3</td><td>Space-separated list of SSL/TLS protocols to exclude. SSLv3 will always be excluded in addition to the protocols specified.</td></tr>
<tr><td width="15%">ipFilter</td><td width="10%">false</td><td>设置为<code>true</code>启用ip过滤</td></tr>
<tr><td width="15%">ipFilter.rules</td><td width="10%">-</td><td>通过此配置，定义ip过滤的表达式规则</td></tr>
</table>

实例 `Agent a1`：

	a1.sources = r1
	a1.channels = c1
	a1.sources.r1.type = avro
	a1.sources.r1.bind = localhost
	a1.sources.r1.port = 4141
	a1.sources.r1.ipFilter = true
	a1.sources.r1.ipFilter.rules = allow:ip:127.*,allow:name:localhost,deny:ip:*
	
	a1.sources.r1.channels = c1
	
`ipFilter.rules`定义格式如下 ：

	<allow or deny>:<ip or name for computer name>:<pattern>
或

	allow/deny:ip/name:pattern
	
### Thrift Source
监听 Thrift 端口，接收外部 Thrift 客户端发来的 Event 是流，当和另一个Agent (Event流上，前面一个) 的 Thrift Sink 连接配对时，能够将两个 Agent 连接形成一个Event 链。其必须的属性如下：

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>thrift</code></td></tr>
<tr><td width="15%">bind</td><td width="10%">-</td><td>监听的主机名或者 IP 地址</td></tr>
<tr><td width="15%">port</td><td width="10%">-</td><td>监听的端口号</td></tr>
<tr><td width="15%">threads</td><td width="10%">-</td><td>能生成的工作线程的最大数</td></tr>
<tr><td width="15%">selector.type</td><td width="10%"></td><td></td></tr>
<tr><td width="15%">selector.*</td><td width="10%"></td><td></td></tr>
<tr><td width="15%">interceptors</td><td width="10%">-</td><td>Space-separated list of interceptors</td></tr>
<tr><td width="15%">interceptors.*</td><td width="10%"></td><td></td></tr>
</table>

实例，`Agent a1`：

	a1.sources = r1
	a1.channels = c1
	a1.sources.r1.type = thrift
	a1.sources.r1.channels = c1
	a1.sources.r1.bind = 0.0.0.0
	a1.sources.r1.port = 4141
	
### Exec Source
Exec Source 运行一个给定的 Unix 命令，此命令需要在启动后，进程能不断的产生数据到标准输出( 除非将 `logStdErr` 设置为 `true`，否则标准错误输出stderr将会被抛弃 )。如果 Unix 命令进程意外退出了，Exec Source 也会退出，不会再产生数据。这意味着配置如 `cat [named pipe]` 或 `tail -F [file]` 命令的时候将会产生期望的结果，而使用 `date` 命令的时候不会，前面两个命令会产生数据流，但是后面一个任务只会产生一个单一的 Event，然后马上退出。其config属性如下：

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>exec</code></td></tr>
<tr><td width="15%">command</td><td width="10%">-</td><td>需要执行的命令</td></tr>
<tr><td width="15%">shell</td><td width="10%">-</td><td>调用来运行命令的shell，如：<code>/bin/sh -c</code>，Required only for commands relying on shell features like wildcards, back ticks, pipes etc.</td></tr>
<tr><td width="15%">restartThrottle</td><td width="10%">10000</td><td>重启之前的等待时间(ms
)</td></tr>
<tr><td width="15%">resstart</td><td width="10%">false</td><td>设置是否重启命令，如果命令进程死了</td></tr>
<tr><td width="15%">logStdErr</td><td width="10%">false</td><td>设置是否命令的标准错误输出会被发送</td></tr>
<tr><td width="15%">batchSize</td><td width="10%">20</td><td>同时读取和发送的最大行数</td></tr>
<tr><td width="15%">selector.type</td><td width="10%">replicating</td><td>replicating 或 multiplexing</td></tr>
<tr><td width="15%">selector.*</td><td width="10%"></td><td>依赖selector.type的值</td></tr>
<tr><td width="15%">interceptors</td><td width="10%">-</td><td>Space-separated list of interceptors</td></tr>
<tr><td width="15%">interceptors.*</td><td width="10%"></td><td></td></tr>
</table>

***注意：可以使用Exec Source 模仿Flume 0.9x ( flume-og )中的 Tail Source，只要使用 Unix 命令`tail -F /full/path/to/your/file`，在此情况下，参数 `-F`比 `-f`要更好，因为它会根据文件轮询。***

实例，`Agent a1`：

	a1.sources = r1
	a1.channels = c1
	a1.sources.r1.type = exec
	a1.sources.r1.command = tail -F /var/log/secure
	a1.sources.r1.channels = c1

`shell`配置来执行`command`，通过一个命令行脚本( 如 Bash 或 PowerShell )，

	agent_foo.sources.tailsource-1.type = exec
	agent_foo.sources.tailsource-1.shell = /bin/bash -c
	agent_foo.sources.tailsource-1.command = for i in /path/*.txt; do cat $i; done
	
### Spooling Directory Source
SpoolDir Source 支持从磁盘“spooling”文件夹读取数据文件，此源会监控指定的文件夹的新增文件，一旦有新文件出现，SpoolDir Source 会将其解析为 Event发送，这个 Event 解析逻辑时插件化的。在一个文件被全部读入到 Channel 之后， 该文件会被重命名标记完成( 或选择性的删除 )。

不同于 Exec Source，这个源是可靠的，即使 Flume 进程重启或是被杀掉都不会丢失数据。作为可靠性的交换，只有不变的且命名唯一的文件才能被放入源监控的目录，Flume 会检测这些问题条件，如果违反了，Flume 会报错：

1. 如果一个文件在移动到 SpoolDir Source 监控目录下之后被更改过，Flume 会在日志文件中输出错误信息，并停止 Flume 进程；
2. 如果一个文件名在一段时间后被重复使用，Flume 会在日志文件中输出错误信息，并停止 Flume 进程。

为了避免上述问题，比较好的方法是：在日志文件被移动到监控目录时，给日志文件用唯一标示符来命名( 例如：时间戳，timestamp )；

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>spooldir</code></td></tr>
<tr><td width="15%">spoolDir</td><td width="10%">-</td><td>源监控的目录路径</td></tr>
<tr><td width="15%">fileSuffix</td><td width="10%">.COMPLETED</td><td>文件被读入完成后添加的标示符后缀</td></tr>
<tr><td width="15%">deletePolicy</td><td width="10%">never</td><td>是否删除完成读入的文件，可选项：<code>never</code> 或 <code>immediate</code></td></tr>
<tr><td width="15%">fileHeader</td><td width="10%">false</td><td>是否添加一个保存文件绝对路径的 Header</td></tr>
<tr><td width="15%">fileHeaderKey</td><td width="10%">file</td><td>当给 event header 添加绝对路径名的时候使用</td></tr>
<tr><td width="15%">basenameHeader</td><td width="10%">false</td><td>是否添加一个保存文件 <code>basename</code> 的Header</td></tr>
<tr><td width="15%">basenameHeaderKey</td><td width="10%">basename</td><td>当给 event header 添加 <code>basename</code> 的时候使用</td></tr>
<tr><td width="15%">ignorePattern</td><td width="10%">^$</td><td>忽略正则表达式指定的文件</td></tr>
<tr><td width="15%">trackerDir</td><td width="10%">.flumespool</td><td>保存跟进程文件相关元数据的目录，如果此路径不是一个绝对路径，就会解释为一个相对于 <code>spoolDir</code> 的路径。</td></tr>
<tr><td width="15%">consumeOrder</td><td width="10%">oldest</td><td>监控目录下的文件被读取的顺序，可选项为：<code>oldest</code>、<code>youngest</code>、<code>random</code></td></tr>
<tr><td width="15%">maxBackoff</td><td width="10%">4000 ( ms )</td><td>当 Channel 满了之后，连续尝试往 Channel 传送数据的最大时间间隔。SpoolDir Source 开始会启动一个很低的 <code>maxBackoff</code>，一旦 Channel 抛出一个 <code>ChannelException</code> 的时候，就会增加此 <code>maxBackoff</code> 值，直到达到指定的最大值。</td></tr>
<tr><td width="15%">batchSize</td><td width="10%">100</td><td>数据被传送到 Channel 的粒度。</td></tr>
<tr><td width="15%">inputCharset</td><td width="10%">UTF-8</td><td>将输入当做文本文档解析时候使用的字符集，即监控文件的字符集</td></tr>
<tr><td width="15%">decodeErrorPolicy</td><td width="10%"><code>FAIL</code></td><td>当发现一个无法解析字符集的输入文件时，需要做的处理：<code>FAIL</code>，抛出一个异常并标记解析失败；<code>REPLACE</code>，使用 “replacement character” 字符重复解析错误解析字符，例如 Unicode U+FFFD；<code>IGNORE</code>，删除无法解析的字符串序列。</td></tr>
<tr><td width="15%">deserializer</td><td width="10%"><code>LINE</code></td><td>指定将文件解析为 Event 的解析器，默认解析每行为一个 Event，指定的限定性类名必须实现接口 <code>EventDeserializer.Builder</code></td></tr>
<tr><td width="15%">deserializer.*</td><td width="10%"></td><td>Varies per event deserializer.</td></tr>
<tr><td width="15%">bufferMaxLines</td><td width="10%">-</td><td>该选项已经被忽略</td></tr>
<tr><td width="15%">bufferMaxLineLength</td><td width="10%">5000</td><td>(Deprecated) 提交缓存中一行的最大长度，使用 <code>deserializer.maxLineLength</code> 代替。</td></tr>
<tr><td width="15%">selector.type</td><td width="10%">replicating</td><td>replicating 或 multiplexing</td></tr>
<tr><td width="15%">selector.*</td><td width="10%"></td><td>依赖selector.type的值</td></tr>
<tr><td width="15%">interceptors</td><td width="10%">-</td><td>Space-separated list of interceptors</td></tr>
<tr><td width="15%">interceptors.*</td><td width="10%"></td><td></td></tr>
</table>

实例，`Agent agent-1`：

	agent-1.channels = ch-1
	agent-1.sources = src-1

	agent-1.sources.src-1.type = spooldir
	agent-1.sources.src-1.channels = ch-1
	agent-1.sources.src-1.spoolDir = /var/log/apache/flumeSpool
	agent-1.sources.src-1.fileHeader = true
	
### NetCat Source
<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>netcat</code></td></tr>
<tr><td width="15%">bind</td><td width="10%">-</td><td>监听主机名或ip地址</td></tr>
<tr><td width="15%">port</td><td width="10%">-</td><td>监听端口号</td></tr>
<tr><td width="15%">max-line-length</td><td width="10%">512</td><td>每个 event 内容的最大行数 ( 单位：字节 )</code></td></tr>
<tr><td width="15%">ack-every-event</td><td width="10%">true</td><td>每接收到一个 event 则回发一个 OK</td></tr>
<tr><td width="15%">selector.type</td><td width="10%">replicating</td><td>replicating 或 multiplexing</td></tr>
<tr><td width="15%">selector.*</td><td width="10%"></td><td>依赖selector.type的值</td></tr>
<tr><td width="15%">interceptors</td><td width="10%">-</td><td>Space-separated list of interceptors</td></tr>
<tr><td width="15%">interceptors.*</td><td width="10%"></td><td></td></tr>
</table>

实例，`Agnet a1`：

	a1.sources = r1
	a1.channels = c1
	a1.sources.r1.type = netcat
	a1.sources.r1.bind = 0.0.0.0
	a1.sources.r1.bind = 6666
	a1.sources.r1.channels = c1
		
## 二、Event Deserializers
以下是 Flume 附带的 Event 解析器：Line、Avro、BlobDeserializer。

### Line
此 deserializer 对应文本输入的每一行生成一个 event。

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">deserializer.maxLineLength</td><td width="10%">2048</td><td>单个 event 能包含字符的最大数，如果一行超过了这个长度，将会被截断，该行中截断后剩余的字符会出现在后续的 event 中</td></tr>
<tr><td width="15%">deserializer.outputCharset</td><td width="10%">UTF-8</td><td>发送到 Channel 的每个 event 的编码字符集</td></tr>
</table>

### AVRO
详情见***[AVRO Deserializer][AVRO Deserializer]***
<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">deserializer.schemaType</td><td width="10%">HASH</td><td>How the schema is represented. By default, or when the value HASH is specified, the Avro schema is hashed and the hash is stored in every event in the event header “flume.avro.schema.hash”. If LITERAL is specified, the JSON-encoded schema itself is stored in every event in the event header “flume.avro.schema.literal”. Using LITERAL mode is relatively inefficient compared to HASH mode.</td></tr>
</table>

[AVRO Deserializer]: http://flume.apache.org/FlumeUserGuide.html#avro "http://flume.apache.org/FlumeUserGuide.html#avro"

### BlobDeserializer
详情见***[Blob Deserializer][Blob Deserializer]***

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">deserializer</td><td width="10%">-</td><td>这个类的全限定性类名： <code>org.apache.flume.sink.solr.morphline.BlobDeserializer$Builder</code></td></tr>
<tr><td width="15%">deserializer.maxBlobLength</td><td width="10%">100000000</td><td>一个给定请求读取和缓存的最大字节数</td></tr>
</table>
[Blob Deserializer]: http://flume.apache.org/FlumeUserGuide.html#blobdeserializer "http://flume.apache.org/FlumeUserGuide.html#blobdeserializer"

</br>

===

***未完待续。。。***
