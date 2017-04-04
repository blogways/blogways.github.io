---
layout: post
title: 基于netty的socket.io通信服务
category: ['websocket']
tags: ['websocket', 'web推送']
author: 赵家君
email: zhaojj5@asiainfo.com
description: 主要介绍基于netty socket.io的消息推送
---

## 1.各类web推送技术优缺点 ##

> 不断地轮询（俗称“拉”，polling）是获取实时消息的一个手段

Ajax 隔一段时间（通常使用 JavaScript 的 setTimeout 函数）就去服务器查询是否有改变，从而进行增量式的更新。但是间隔多长时间去查询成了问题，因为性能和即时性造成了严重的反比关系。间隔太短，连续不断的请求会冲垮服务器，间隔太长，服务器上的新数据就需要越多的时间才能到达客户机。

优点：服务端逻辑简单；

缺点：其中大多数请求可能是无效请求，在大量用户轮询很频繁的情况下对服务器的压力很大；

应用：并发用户量少，而且要求消息的实时性不高，一般很少采用；

> 长轮询技术（long-polling）

客户端向服务器发送Ajax请求，服务器接到请求后hold住连接，直到有新消息或超时（设置）才返回响应信息并关闭连接，客户端处理完响应信息后再向服务器发送新的请求。

优点：实时性高，无消息的情况下不会进行频繁的请求；

缺点：服务器维持着连接期间会消耗资源；

> 基于Iframe及htmlfile的流（streaming）方式

iframe流方式是在页面中插入一个隐藏的iframe，利用其src属性在服务器和客户端之间创建一条长链接，服务器向iframe传输数据（通常是HTML，内有负责插入信息的javascript），来实时更新页面。

优点：消息能够实时到达；

缺点：服务器维持着长连接期会消耗资源；

> 插件提供socket方式

比如利用Flash XMLSocket，Java Applet套接口，Activex包装的socket。

优点：原生socket的支持，和PC端和移动端的实现方式相似；

缺点：浏览器端需要装相应的插件；

> WebSocket

是HTML5开始提供的一种浏览器与服务器间进行全双工通讯的网络技术。

优点：更好的节省服务器资源和带宽并达到实时通讯；

缺点：目前还未普及，浏览器支持不好；

**综上，考虑到浏览器兼容性和性能问题，采用长轮询（long-polling）是一种比较好的方式。**

**netty-socketio是一个开源的Socket服务器端的一个java的实现， 它基于Netty框架。**


## 2.使用场景 ##

- web版聊天室应用
- 股票交易走势
- 车辆实时监控

**示例：模拟车联网应用中车辆在地图上动态移动，移动数据从后台获取，然后通过socket通信推送到前端页面，
使用百度地图API实现前端覆盖物的动态移动。**

![20170404img01](/images/zhaojiajun/20170404img01.jpg)

## 3.Server端实现 ##

### 引入jar包 ###

	<!-- netty-socket.io -->
	<dependency>
      <groupId>com.corundumstudio.socketio</groupId>
      <artifactId>netty-socketio</artifactId>
      <version>1.7.7</version>
  	</dependency>

### server服务实现 ###

	Configuration config = new Configuration();
    config.setHostname("localhost");
    config.setPort(9092);

    final SocketIOServer server = new SocketIOServer(config);
    
    //客户端断开连接监听
    server.addDisconnectListener(new DisconnectListener() {
        @Override
        public void onDisconnect(SocketIOClient client) {
            System.out.println("**************onDisconnect****************");
            //监听断开的连接存放在set中，用于后续判断结束对应的后台线程
            disconnectSet.add(client.getSessionId());
        }
    });
    
    //根据不同的命名空间，单个客户端触发
    server.addNamespace("/position").addEventListener("msgevent", MsgObject.class, new DataListener<MsgObject>() {
        @Override
        public void onData(SocketIOClient client, MsgObject data, AckRequest ackRequest) {
        	//每个客户端连接启动一个后台线程
        	MsgThread msgThread = new MsgThread(client, data); 
        	msgThread.start();
        }
    });
    
    //广播式消息
    server.addNamespace("/notice").addEventListener("msgevent", MsgObject.class, new DataListener<MsgObject>() {
        @Override
        public void onData(SocketIOClient client, MsgObject data, AckRequest ackRequest) {
        	server.getRoomOperations("/notice").sendEvent("msgevent", data);
        }
    });

	//启动服务
    server.start();


### 定义一个内部类，用于处理消息发送的线程 ###

	class MsgThread extends Thread {
	
		private SocketIOClient client;
		private MsgObject data;
		
		//初始化方法
		public MsgThread(SocketIOClient client, MsgObject data){
			this.client = client;
			this.data = data;
		}
		
		public void run() {
			String temp = data.getMessage();
	    	PositionObject posArray[] = new PositionObject[Integer.parseInt(data.getMessage())];
	    	//此处模拟后端服务不断获取数据向客户端发送消息
	    	while(true){
	    		if(MsgServer.disconnectSet.contains(client.getSessionId())){
	    			MsgServer.disconnectSet.remove(client.getSessionId());
	    			//如果客户端断开则后台停止对应的线程
	    			client.disconnect();
	    			Thread.interrupted();
	    			break;
	    		}
	    		data.setMessage(temp+":"+String.valueOf(Math.random()));
	    		for(int i=0; i<posArray.length; i++){
	    			//模拟多车GPS经纬度变化
	    			PositionObject position = new PositionObject();
	        		position.setX(116.380967+Math.random()*0.01);
	        		position.setY(39.913285+Math.random()*0.01);
	    			posArray[i] = position;
	    		}
	    		data.setPosArray(posArray);
	    		//先客户端发送消息
	    		client.sendEvent("msgevent", data);
	    		try {
					Thread.sleep(3000);
				} catch (InterruptedException e) {
					e.printStackTrace();
				}
	    	}
	    }
	}

## 4.Client端（Web实现） ##

    <!DOCTYPE html>
    <html>
    <head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		<meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
		<style type="text/css">
			body, html,#allmap {width: 100%;height: 80%;overflow: hidden;margin:0;font-family:"微软雅黑";}
		</style>
		<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=百度地图AK"></script>
		<script src="js/socket.io/socket.io.js"></script>
		<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
		<title>模拟车辆根据GPS数据实时移动</title>
	</head>
	<body>
		<div id="allmap"></div>
		<div id="status"></div>
		<div id="console"></div>
		<button type="button" onClick="connect('http://localhost:9092/position','msgevent')" id="send">connect</button>
		<button type="button" onClick="disconnect()">disconnect</button>
		<input id="msg" class="input-xlarge" type="text" placeholder="Type something..." />
		<button type="button" onClick="sendMsg()" id="send">Send</button>
	</body>
	</html>
	<script type="text/javascript">
		// 百度地图API功能
		var map = new BMap.Map("allmap");
		map.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
		var myIcon = new BMap.Icon("http://developer.baidu.com/map/jsdemo/img/Mario.png", new BMap.Size(32, 70), {    //小车图片
			//offset: new BMap.Size(0, -5),    //相当于CSS精灵
			imageOffset: new BMap.Size(0, 0)    //图片的偏移量。为了是图片底部中心对准坐标点。
		});

		var socket;
		var eventN;
		var carMkes=new Array();
		var userName = 'user' + Math.floor((Math.random() * 1000) + 1);
		var message;
		function connect(url, eventName){
			socket = io.connect(url, {
			    'force new connection': true,
			    reconnect: true,
			    'connect timeout': 5000,
			    'reconnection delay': 200
			});
			eventN = eventName;
			socket.on('connect', function() {
				$('#status').html('Client has connected to the server!');
			});
			socket.on(eventName, function(data) {
				$('#console').html(data.userName + '=' + data.message);
				doPosition(data);
			});
			socket.on('disconnect',function() {
				$('#status').html('The client has disconnected!');
				clearMap();
			});
			socket.on('reconnect', function() {
				$('#status').html('Client has reconnected to the server!');
			});
			if(message!=null){
				sendMsg();
			}
		}

		//断开socket连接
		function disconnect() {
			socket.disconnect();
		}

		//向服务端发送数据
		function emitMsg(param) {
			socket.emit(eventN, param);
		}

		function sendMsg(){
			message = $('#msg').val();
			var param = {userName : userName,message : message};
			emitMsg(param);
			//模拟多辆车子
			for(var i=0; i<message; i++){
				var point = new BMap.Point(116.380967,39.913285);
				var carMk = new BMap.Marker(point,{icon:myIcon});
				carMkes[i] = carMk;
				map.addOverlay(carMk);
			}
		}

		//地图覆盖物定位显示，相当于车辆位置移动
		function doPosition(data){
			var posArray = data.posArray;
			for(var j=0; j<posArray.length; j++){
				var point = new BMap.Point(posArray[j].x,posArray[j].y);
				carMkes[j].setPosition(point);
			}
		}

		//清空地图覆盖物
		function clearMap(){
			map.clearOverlays();
			carMkes = [];
		}
	</script>
