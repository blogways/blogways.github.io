---
layout: post
category: Express        
title: express 4.x的迁移
tags: ['moving to express4.x']
author: 付奎
email: fukui@asiainfo.com
description: 迁移到 Express 4.x
---
原文：<http://expressjs.com/en/guide/migrating-4.html>

Express 4.x较Express 3.x进行了较大的改动，原来基于Express 3.x的项目无法直接升级到 4.x。本文对Express网站的内容进行了简单的总结，希望能够帮助大家更好的了解Express 4.x，同时方便大家迁移。  
## 一、Express 4.x的主要变化
1、重新撰写Express内核，取消了原来对于Connect的依赖  
2、移除了大部分Build-in的Middleware  
3、Middleware可以仅对特定url前缀的请求执行，并且支持url中的参数  
4、对Routing系统的扩展
### 取消Connect的依赖
Express 3.x是基于Connect构建的。重构后的Express 4.x取消了对Connect的依赖，变成了完全独立的模块。但由于采用一致的Middleware处理方法，新的Express 4.x仍然对Connect的所有Middleware向下兼容，所以在Express中仍然可以使用Connect的Middleware。
### 移除绝大多数Build-in的Middleware
Express 4.x的理念是仅专注于最核心的routing功能，而将其他组建的选择全部交由用户配置，一方面提供更好的灵活和定制性，另一方面可以始终让用户使用最新的Middleware而将其和Express的更新独立开来。其核心中仅保留了express.static，其余Middleware均需要通过npm安装并且require。下表中是主要移除的模块列表：
  
|express 3|express 4|
|---|---|
|express.bodyParser|body-parser+mnlter|
|express.comperss|compression|
|express.cookieSession|cookie-session|
|express.cookieParser|cookie-parser|
|express.logger|morgan|
|express.session|express.session|
|express.favicon|serve-favicon|
|express.responseTime|response-time|
|express.errorHandler|errorhandler|
|express.methodOverride|method-override|
|express.timeout|connect-timeout|
|express.vhost|vhost|
|express.csrf|csurf|
|express.directory|serve-index|
|express.static|serve-static|  

下面是Express 4的中间件的完整列表。
在大多数情况下，你可以简单地用express 4替换旧版本express 3中对应的中间件。有关详细信息，请参阅GitHub的模块文档。  
### app.use accepts parameters
在第4版，你现在可以在具有可变参数的路径上加载中间件，并从路由处理程序中读取参数值。 例如：  

	app.use('/book/:id', function(req, res, next) {
	  console.log('ID:', req.params.id);
	  next();
	});
### The routing system
应用隐式加载路由中间件，所以，现在你不必担心 router 路由中间件加载的次序问题。

定义路由的方式没有发生变化，现在增加了两个新的特性来帮助组织路由系统。  
>* 新的方法 route，针对一个路由路径创建链式的路由处理器。
>* 新的类 express.Router，创建模块化的路由处理器。

### app.route() method
新的 app.route 方法对特定的路由路径创建链式的路由处理器。由于可以在一个地方定义路径，这样有助于创建模块话的路由规则，减少重复。

路由的详细信息，可以参见 Route() 的文档。  
下面的示例演示了路由的链式定义  

	app.route('/book')
	  .get(function(req, res) {
	    res.send('Get a random book');
	  })
	  .post(function(req, res) {
	    res.send('Add a book');
	  })
	  .put(function(req, res) {
	    res.send('Update the book');
	  })
### express.Router class
另外一个帮助组织路由的特性是新的类 express.Router，可以帮助创建模块话的路由处理器。一个 Router 的实例就是一个完整的中间件和路由系统，由于这个原因，它经常被称为 迷你应用。

下面演示了创建一个名为 bird.js 的路由文件，内容如下：  

	var express = require('express');
	var router = express.Router();
	
	// middleware specific to this router
	router.use(function timeLog(req, res, next) {
	  console.log('Time: ', Date.now());
	  next();
	})
	// define the home page route
	router.get('/', function(req, res) {
	  res.send('Birds home page');
	})
	// define the about route
	router.get('/about', function(req, res) {
	  res.send('About birds');
	})
	
	module.exports = router;
然后在应用中加载这个路由模块。

	var birds = require('./birds');
	...
	app.use('/birds', birds);
这个应用现在可以处理请求 /birds 和 /birds/about，还可以调用 timeLog 中间件。  
### Other changes
下表列出了其它小的但是重要的修改  
<table class="table-striped table-condensed">
	<tr>
		<td>对象</td>
		<td>说明</td>
	</tr>
	<tr>
		<td>Node</td>
		<td>Express 4 需要 Node 0.10.x 及其以上版本，已经不支持 0.8.x</td>
	</tr>
	<tr>
		<td>http.createServer</td>
		<td>不再需要 http 模块，应用使用 app.listen() 启动</td>
	</tr>
	<tr>
		<td>app.configure()</td>
		<td>app.configure() 已经被移除，使用 process.env.NODE_ENV 或者 app.get(“env”) 来检测环境、配置应用</td>
	</tr>
	<tr>
		<td>json.spaces()</td>
		<td>在 Express 4 中默认禁用了 json spaces</td>
	</tr>
	<tr>
		<td>Req.location()</td>
		<td>不再能获取相对 url</td>
	</tr>
	<tr>
		<td>Req.params</td>
		<td>原来是一个数组，现在是对象</td>
	</tr>
	<tr>
		<td>Res.locals</td>
		<td>原来是函数，现在是对象</td>
	</tr>
	<tr>
		<td>Res.headerSent</td>
		<td>修改为 res.headersSent</td>
	</tr>
	<tr>
		<td>App.route</td>
		<td>现在作为 app.mountpath 存在</td>
	</tr>
	<tr>
		<td>Res.on(“header”)</td>
		<td>删除</td>
	</tr>
	<tr>
		<td>Res.charset</td>
		<td>删除</td>
	</tr>
	<tr>
		<td>Res.setHeader(“Set-Cookie”, val)</td>
		<td>这个功能现在限制为设置基本的 cookie 值，使用 res.cookie() 的添加功能</td>
	</tr>  
</table>

## 二 、示例
这里是一个从 Express 3 升级到 Express 4 的示例。
### Version 3 app
#### app.js
原来的 app.js 如下：  
	var express = require('express');
	var routes = require('./routes');
	var user = require('./routes/user');
	var http = require('http');
	var path = require('path');
	
	var app = express();
	
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.methodOverride());
	app.use(express.session({ secret: 'your secret here' }));
	app.use(express.bodyParser());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
	
	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}
	
	app.get('/', routes.index);
	app.get('/users', user.list);
	
	http.createServer(app).listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
package.json 如下所示  
附带的第3版的package.json文件可能看起来像这样：

	{
	  "name": "application-name",
	  "version": "0.0.1",
	  "private": true,
	  "scripts": {
	    "start": "node app.js"
	  },
	  "dependencies": {
	    "express": "3.12.0",
	    "jade": "*"
	  }
	}

### 迁移过程
在迁移之前，先安装 Express 4 需要的中间件，还要更新 express，Jade 到最新的版本。
>$ npm install serve-favicon morgan method-override express-session body-parser multer errorhandler express@latest jade@latest --save

对 app.js 进行一下的修改。


1.  http 模块已经使用了，所以，删除 var http = require( "http" );

2. 内建的中间件 express.favicon, express.logger, express.methodOverride, express.session, express.bodyParser 和 express.errorHandler 已经不存在了，你必须手动安装，然后在应用中替换它们。

3. 不再需要加载 app.router ，实际上，它也已经不是 Express 4 中的对象，所以，删除 app.use( app.router );

4. 使用 app.listen() 来取代 http.createServer 启动。

### Version 4 app
#### package.json  
执行上面的命令，会如下更新 package.json 文件。

	{
	  "name": "application-name",
	  "version": "0.0.1",
	  "private": true,
	  "scripts": {
	    "start": "node app.js"
	  },
	  "dependencies": {
	    "body-parser": "^1.5.2",
	    "errorhandler": "^1.1.1",
	    "express": "^4.8.0",
	    "express-session": "^1.7.2",
	    "jade": "^1.5.0",
	    "method-override": "^2.1.2",
	    "morgan": "^1.2.2",
	    "multer": "^0.1.3",
	    "serve-favicon": "^2.0.1"
	  }
	}
#### app.js
然后，删除无效的代码，加载需要的中间件，完成其它必须的修改，最终的 app.js 看起来如下所示：

	var express = require('express');
	var routes = require('./routes');
	var user = require('./routes/user');
	var path = require('path');
	
	var favicon = require('serve-favicon');
	var logger = require('morgan');
	var methodOverride = require('method-override');
	var session = require('express-session');
	var bodyParser = require('body-parser');
	var multer = require('multer');
	var errorHandler = require('errorhandler');
	
	var app = express();
	
	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.use(favicon(__dirname + '/public/favicon.ico'));
	app.use(logger('dev'));
	app.use(methodOverride());
	app.use(session({ resave: true,
	                  saveUninitialized: true,
	                  secret: 'uwotm8' }));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(multer());
	app.use(express.static(path.join(__dirname, 'public')));
	
	// development only
	if ('development' == app.get('env')) {
	  app.use(errorHandler());
	}
	
	app.get('/', routes.index);
	app.get('/users', user.list);
	
	app.listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
除非你需要直接与HTTP模块（socket.io/SPDY/HTTPS）工作，加载它不是必需的，并且app可以使用这种方式简单的启动：

	app.listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
### 运行app
现在，迁移已经完成了，使用如下命令启动。

	$ node app

使用浏览器访问 http://localhost:3000，查看使用 Express 4 生成的页面。
## 升级到 Express 4 的应用生成器
生成一个 Express 4 的命令行工具还是 express，但是，升级到新版本的话，需要先卸载 Express 3 的生成器，然后安装新的生成器。
### 安装
如果你已经安装过 Express 3 的生成器，必须先卸载

	npm uninstall –g express 

依赖与你的目录权限和配置，可能需要先执行 sudo 提升权限。
现在，安装新的生成器

	Npm install –g express-generator

现在，你系统中的 express 命令已经升级为 Express 4 的生成器了. 
### 生成器的变化 
 除了下面的变化，基本上与以前相同。

--sessions 选项被删除了  
--jshtml 选项被删除了  
--hogan 被添加，以便支持 Hogan.js  
### 示例
执行下面的命令，创建 app4 应用

	express app4

如果你查看 app4 文件夹中的 app.js 文件，你会发现所有的中间件被替换为独立的中间件加载，router 中间件不再显式加载。你还会注意到 app.js 现在是一个 Node 模块。  
安装依赖的文件之后，使用下面的命令启动应用。

	$ npm start

如果你查看 package.json 中的启动脚本，你会注意到实际的启动脚本是 node ./bin/www，在 Express 3 中是 node app.js.由于 Express 4 新生成的 app.js 已经是一个 Node 模块，它可以不再需要通过一个独立的应用来启动，它可以在 Node 文件中加载，通过 Node 文件启动，这里就是 ./bin/www.不管是 bin 文件夹，还是 www 文件，他们都是手工由 Express 生成器生成的，所以，需要的话，都可以进行修改。为了与 Express 3 保持一致，删除 module.experts = app；在 app.js 的最后，添加下面的代码。

	app.set('port', process.env.PORT || 3000);
	
	var server = app.listen(app.get('port'), function() {
	  debug('Express server listening on port ' + server.address().port);
	});
 确认加载 debug 模块。

	var debug = require('debug')('app4');
然后将 package.json 文件中的 start: "node ./bin/www" 修改为 "start": "node app.js"。现在，已经从 ./bin/www 回到了 app.js。