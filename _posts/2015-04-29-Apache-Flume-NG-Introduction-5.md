---
layout: post
category: Apache
title: Apache Flume-NG 介绍[5] 之 自定义组件
tags: ['Flume-NG', 'Channel']
author: 万洲
#image: /images/post/flume-ng.png
email: wanzhou@asiainfo.com
description: Flume NG是一个分布式、可靠、可用的系统，它能够将不同数据源的海量日志数据进行高效收集、聚合、移动，最后存储到一个中心化数据存储系统中。由原来的Flume OG到现在的Flume NG，进行了架构重构，经过架构重构后，Flume NG更像是一个轻量的小工具，非常简单，容易适应各种方式日志收集，并支持failover和负载均衡。
---


## 一、Custom Source
实现 Source 接口即可定义Custom Sources，在启动Flume Agent的时候，用户自定义源的类及其依赖必须包括在agent 的 `classpath`中。Custom Source 的类型是它的全限定性类名。

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>FQCN ( 全限定性类名，如：org.example.MyCustomSource )</code></td></tr>
<tr><td width="15%">selector.type</td><td width="10%"></td><td><code>replicating</code> 或 <code>multiplexing</code></td></tr>
<tr><td width="15%">selector.*</td><td width="10%"></td><td>依赖selector.type的值</td></tr>
<tr><td width="15%">interceptors</td><td width="10%">-</td><td>Space-separated list of interceptors</td></tr>
<tr><td width="15%">interceptors.*</td><td width="10%"></td><td></td></tr>
</table>

实例：`Agent a1`：

	a1.sources = r1
	a1.channels = c1
	a1.sources.r1.type = org.example.MyCustomSource
	a1.sources.r1.channels = c1
	
### 自定义 Source
1. 创建工程：

		mvn archetype:create -DgroupId=org.apache.flume -DartifactId=flume-ng-db-source -DpackageName=com.ai.flume -Dversion=1.0
	
2. 编辑 `pom.xml` 添加依赖：

		</dependencies>
		    <dependency>
		   		<groupId>org.apache.flume</groupId>
	    	    <artifactId>flume-ng-core</artifactId>
       			<version>1.5.2</version>
		    </dependency>
		    <dependency>
			    <groupId>mysql</groupId>
		    	<artifactId>mysql-connector-java</artifactId>
			    <version>5.1.35</version>
		    </dependency>
		    <dependency>
    			<groupId>com.oracle</groupId>
	    		<artifactId>ojdbc14</artifactId>
    			<version>10.2.0.1.0</version>
		    </dependency>
		</dependencies>
		
3. 创建一个类，继承 `AbstractSource`，并实现接口 `Configurable`和`PollableSource`，如：

		package com.ai.flume.source;
		
		public class FlumeNGDBSource extends AbstractSource implements Configurable, PollableSource {
			private static final Logger logger = LoggerFactory.getLogger(FlumeNGDBSource.class);
			
			public void configure(Context context) {
				// 处理配置文件( 如：conf/example.conf )中的属性
			}
			
			@Override
			public synchronized void start() {
				// Source 启动时的初始化、开启进程等
			}
			
			public Status process() throws EventDeliveryException {
				// Source 真正的工作进程
				// 获取data，封装到event中，发送到channel
			}
			
			@Override
		    public synchronized void stop() {
    			// Source 结束时的变量释放、进程结束等
    		}
		}
		
4. 配置文件创建和使用：

		private String sqlType;
		private String sqlHost;
		private int sqlPort;
		private String Db;
		private String sqlUser;
		private String sqlPwd;
		private String sql;

		...  省略中间代码  ...

		public void configure(Context context) {
			// 在此方法中，通过context.getString("property", defaultValue)
			// context.getInteger("property", defaultValue)来读取配置文件
    	    sqlType = context.getString("sql-type", "oracle");
        	sqlHost = context.getString("sql-host", "localhost");
	        sqlPort = context.getInteger("sql-port", 3306);
    	    sqlDb = context.getString("sql-db", "test");
        	sqlUser = context.getString("sql-user", null);
	        sqlPwd = context.getString("sql-pwd", null);
    	    sql = context.getString("sql", "select * from info;");
		}
		
	上述文件的配置文件可以如下设置，`mydb.conf`：
	
		a1.sources = r1
		a1.channels = c1
		a1.sources.r1.type = com.ai.flume.FlumeNGDBSource
		a1.sources.r1.sql-type = mysql
		a1.sources.r1.sql-host = 127.0.0.1
		# 这里的SQL不需要加双引号或单引号
		a1.sources.r1.sql = select * from users;
		# 使用默认端口 3306，默认数据库 test，默认没有用户和密码

5. 数据封装为 Event，并发送到 Channel：

		private ChannelProcessor channelProcessor = null;
		// 用于存放需要发送的队列
		// 从数据库中取出，然后放到队列中
		private LinkedBlockingQueue<String> queue = null;

		...  省略中间代码  ...
		
		public Status process() throws EventDeliveryException {
        	Status status = Status.READY;
        	// 获取连接Channel的对象
    	    channelProcessor = getChannelProcessor();
        
	        try {
	        	// 取出一条要发送的数据
        	    String line = queue.take();
        	    // 通过logger以INFO的级别输出到Source的日志文件中
    	        logger.info(line);
    	        // 调用EventBuilder.withBody(String body, Charset set)，
    	        // 将要发送的数据封装为一个 event
	            Event e = EventBuilder.withBody(line, Charset.forName("UTF8"));
            	// 将封装后的 event发送到连接的 Channel
            	channelProcessor.processEvent(e);
        	} catch (Exception e) {
        		// 出现错误，返回Status.BACKOFF，告诉Source 发送失败
        		// 当自定义 Sink 的时候，这里需要注意，详见后面
    	        status = Status.BACKOFF;
            
	            logger.error("flume-ng mysql source error!", e);
            	throw new EventDeliveryException(e);
        	}
        
    	    return status;
	    }	    
	到这基本自定义 Source已经完成了，其它要做的就是通过代码实现数据的生成或抓取，然后放到上述的`queue`当中。
	
6. 通过`Timer`定时从数据库中取数据放到`queue`中：

		private Timer scannerTimer;
		
		...  省略中间代码  ...

		@Override
	    public synchronized void start() {
	    	super.start();
        	queue = new LinkedBlockingQueue<String>();
        
    	    scannerTimer = new Timer("FlumeNG_Scanner_Timer_Thread", true);
	        scannerTimer.scheduleAtFixedRate(new TimerTask() {
            
				@Override
            	public void run() {
					// 调用操作数据库方法，执行sql，返回数据
	                list = ibd.selectAll(sql);
                
	                if (list.size() <= 0) {
    	                try {
        	                Thread.sleep(10);
            	        } catch (InterruptedException e) {
                	        logger.error("[ Error ]:", e);
						}
                	}
                	String res = "";
					for (int i = 0; i < list.size(); i++) {
						if ("" == res) {
							res += list.get(i);
						} else {
							res += "&data=" + list.get(i);						}
					}
					// 将结果缓存到queue当中
					queue.offer(res);
				}
			}, 0, runSpeed); // runSpeed为配置文件当中的查询间隔
		}

7. `stop`方法：

		@Override
    	public synchronized void stop() {
	        super.stop();
	        // 关闭与Channel的连接
    	    channelProcessor.close();
			// 结束数据获取线程
	        if (scannerTimer != null) {
            	try {
        	        scannerTimer.cancel();
    	        } catch (Exception e) {
	
	            } finally {
            	    scannerTimer = null;
        	    }
    	    }
        	queue = null;
	    }
	至此，自定义Source已经完成。
	
8. 生成`jar`包：

		mvn clean package
	在上面命令运行成功后，复制 `target/flume-ng-db-source-1.0.jar`到`$FLUME_HOME/lib`目录即可。
	
		cp target/flume-ng-db-source-1.0.jar $FLUME_HOME/lib


## 二、Custom Sink
实现 Sink 接口即可定义Custom Sink，在启动Flume Agent的时候，用户自定义Sink的类及其依赖必须包括在agent 的 `classpath`中。Custom Sink 的类型是它的全限定性类名。

<table width="100%">
<tr><th width="15%">属性名</th><th width="10%">默认值</th><th>描述</th></tr>
<tr><td width="15%">channels</td><td width="10%">-</td><td></td></tr>
<tr><td width="15%">type</td><td width="10%">-</td><td>组件类型名称必须是<code>FQCN ( 全限定性类名，如：org.example.MyCustomSink )</code></td></tr>
<tr><td width="15%">selector.type</td><td width="10%"></td><td><code>replicating</code> 或 <code>multiplexing</code></td></tr>
<tr><td width="15%">selector.*</td><td width="10%"></td><td>依赖selector.type的值</td></tr>
<tr><td width="15%">interceptors</td><td width="10%">-</td><td>Space-separated list of interceptors</td></tr>
<tr><td width="15%">interceptors.*</td><td width="10%"></td><td></td></tr>
</table>

实例：`Agent a1`：

	a1.sources = r1
	a1.channels = c1
	a1.sources.r1.type = org.example.MyCustomSink
	a1.sources.r1.channels = c1
	
### 自定义 Sink
此 Sink从 Channel 获取 events，然后通过HTTP POST发送到远程的主机端口上。

1. 同样的，通过maven创建工程：

		mvn archetype:create -DgroupId=org.apache.flume -DartifactId=flume-ng-http-source -DpackageName=com.ai.flume -Dversion=1.0
	
2. 编辑 `pom.xml` 添加依赖：

		</dependencies>
		    <dependency>
		   		<groupId>org.apache.flume</groupId>
	    	    <artifactId>flume-ng-core</artifactId>
	    	    <version>1.5.2</version>
		    </dependency>
		</dependencies>
	
3. 创建一个类，继承 `AbstractSource`，并实现接口 `Configurable`和`PollableSource`，如：

		package com.ai.flume.source;
		
		public class FlumeNGHttpSink extends AbstractSink implements Configurable {
			private static final Logger logger = LoggerFactory.getLogger(FlumeNGHttpSink.class);
			
			public void configure(Context context) {
				// 处理配置文件( 如：conf/example.conf )中的属性
			}
			
			public Status process() throws EventDeliveryException {
				// Source 真正的工作进程
				// 获取data，封装到event中，发送到channel
			}
			
			public String post(String url, String param) {
				// http发送post请求
			}
		}
		
4. 配置文件创建和使用：

		private String url;
		private String host;
		private String type;

		...  省略中间代码  ...

		public void configure(Context context) {
			// 在此方法中，通过context.getString("property", defaultValue)
			// context.getInteger("property", defaultValue)来读取配置文件
    	    url = context.getString("node-url", "http://127.0.0.1:5000/receive");
    	    host = context.getString("node-host", "127.0.0.1");
	        type = context.getString("node-type", "TuxState");
		}
		
	上述文件的配置文件可以如下设置，`mydb.conf`：
	
		a1.sources = r1
		a1.channels = c1
		a1.sources.r1.type = com.ai.flume.FlumeNGHttpSink
		a1.sources.r1.node-url = http://localhost:3000/receive
		a1.sources.r1.node-host = 127.0.0.1
		a1.sources.r1.node-type = TuxState

5. 从 Channel 获取 Event，并取出其中包含的数据：

    	public Status process() throws EventDeliveryException {
        	// TODO(ai) Auto-generated method stub
        	Status status = Status.READY;
        	
			Channel channel = getChannel();
	        Transaction txn = null;   

	        try {
    	        txn = channel.getTransaction();
        	    txn.begin(); 	// 开始从Channel获取Event的事务处理
            	
            	Event e = channel.take();	// 从Channel取一个Event
            	if (null != e) {
					String line = EventHelper.dumpEvent(e);
					logger.info(line);
                	// 取出 Event 中包含的内容，然后转换为需要的类型，此处为String
					byte[] body = e.getBody(); 
					String data = new String(body);
            	    //logger.info(data);
        	        String str = "localhost=" + host + "&type=" + type + "&data=" + data;
					//将配置文件的信息和数据组合成post方法的param，调用编写的post方法发送到目的地
    	            logger.info(post(url, str));
	            } else {
            	    status = Status.BACKOFF;
        	    }
            
    	        txn.commit();
	        } catch (Exception e) {
	        	// 前面提及过，在处理这的时候需要注意
	        	// 若发送错误的原因是数据处理的问题，则可能会出现死循环
	        	// 出错，而不执行txn.commit()，则出错的Event并不会从 Channel中删除
	        	// 下一次获取的仍然是出错的 Event
    	        logger.error("can't process events, drop it!", e);
	            if (txn != null) {
                	txn.commit();   //出现BUG，丢弃当前Event，防止出现死循环
            	}
        	    throw new EventDeliveryException(e);
    	    } finally {
	            if (null != txn) {
                	txn.close();
            	}
        	}
        
    	    return status;
	    }	    
	HTTP的post方法此处不再给出，到这基本自定义 Sink已经完成了。
	
6. 生成`jar`包：

		mvn clean package
	在上面命令运行成功后，复制 `target/flume-ng-http-sink-1.0.jar`到`$FLUME_HOME/lib`目录即可。
	
		cp target/flume-ng-http-sink-1.0.jar $FLUME_HOME/lib

## 三、Custom Channel

...


</br>

===

***未完待续。。。***