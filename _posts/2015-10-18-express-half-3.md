---
layout: post
category: express
title: express3.x中文翻译下半部[3]
tags: ['express', '翻译']
author: 张可
email: zhangke@asiainfo.com
description: express3.x中文翻译下半部
---
#在 Express 中使用模板引擎

需要在应用中进行如下设置才能让 Express 渲染模板文件：

views, 放模板文件的目录，比如： app.set('views', './views')
view engine, 模板引擎，比如： app.set('view engine', 'jade')
然后安装相应的模板引擎 npm 软件包。
	
	$ npm install jade --save
	和 Express 兼容的模板引擎，比如 Jade，通过 res.render() 调用其导出方法 __express(filePath, options, callback) 渲染模板。

有一些模板引擎不遵循这种约定，Consolidate.js 能将 Node 中所有流行的模板引擎映射为这种约定，这样就可以和 Express 无缝衔接。
一旦 view engine 设置成功，就不需要显式指定引擎，或者在应用中加载模板引擎模块，Express 已经在内部加载，如下所示。

	app.set('view engine', 'jade');
在 views 目录下生成名为 index.jade 的 Jade 模板文件，内容如下：

	html
	  head
	    title!= title
	  body
	    h1!= message
然后创建一个路由渲染 index.jade 文件。如果没有设置 view engine，您需要指明视图文件的后缀，否则就会遗漏它。

	app.get('/', function (req, res) {
	  res.render('index', { title: 'Hey', message: 'Hello there!'});
	});
此时向主页发送请求，“index.jade” 会被渲染为 HTML。

请阅读 “为 Express 开发模板引擎” 了解模板引擎在 Express 中是如何工作的。

#错误处理

定义错误处理中间件和定义其他中间件一样，除了需要 4 个参数，而不是 3 个，其格式如下 (err, req, res, next)。例如：
	
	app.use(function(err, req, res, next) {
	  console.error(err.stack);
	  res.status(500).send('Something broke!');
	});
在其他 app.use() 和路由调用后，最后定义错误处理中间件，比如：
	
	var bodyParser = require('body-parser');
	var methodOverride = require('method-override');
	
	app.use(bodyParser());
	app.use(methodOverride());
	app.use(function(err, req, res, next) {
	  // 业务逻辑
	});
中间件返回的响应是随意的，可以响应一个 HTML 错误页面、一句简单的话、一个 JSON 字符串，或者其他任何您想要的东西。

为了便于组织（更高级的框架），您可能会像定义常规中间件一样，定义多个错误处理中间件。比如您想为使用 XHR 的请求定义一个，还想为没有使用的定义一个，那么：
	
	var bodyParser = require('body-parser');
	var methodOverride = require('method-override');
	
	app.use(bodyParser());
	app.use(methodOverride());
	app.use(logErrors);
	app.use(clientErrorHandler);
	app.use(errorHandler);
	logErrors 将请求和错误信息写入标准错误输出、日志或类似服务：
	
	function logErrors(err, req, res, next) {
	  console.error(err.stack);
	  next(err);
	}
	clientErrorHandler 的定义如下（注意这里将错误直接传给了 next）：
	
	function clientErrorHandler(err, req, res, next) {
	  if (req.xhr) {
	    res.status(500).send({ error: 'Something blew up!' });
	  } else {
	    next(err);
	  }
	}
	errorHandler 能捕获所有错误，其定义如下：
	
	function errorHandler(err, req, res, next) {
	  res.status(500);
	  res.render('error', { error: err });
	}
如果向 next() 传入参数（除了 ‘route’ 字符串），Express 会认为当前请求有错误的输出，因此跳过后续其他非错误处理和路由/中间件函数。如果需做特殊处理，需要创建新的错误处理路由，如下节所示。

如果路由句柄有多个回调函数，可使用 ‘route’ 参数跳到下一个路由句柄。比如：
	
	app.get('/a_route_behind_paywall', 
	  function checkIfPaidSubscriber(req, res, next) {
	    if(!req.user.hasPaid) { 
	    
	      // 继续处理该请求
	      next('route');
	    }
	  }, function getPaidContent(req, res, next) {
	    PaidContent.find(function(err, doc) {
	      if(err) return next(err);
	      res.json(doc);
	    });
	  });
在这个例子中，句柄 getPaidContent 会被跳过，但 app 中为 /a_route_behind_paywall 定义的其他句柄则会继续执行。
	
	next() 和 next(err) 类似于 Promise.resolve() 和 Promise.reject()。它们让您可以向 Express 发信号，告诉它当前句柄执行结束并且处于什么状态。next(err) 会跳过后续句柄，除了那些用来处理错误的句柄。
#缺省错误处理句柄
Express 内置了一个错误处理句柄，它可以捕获应用中可能出现的任意错误。这个缺省的错误处理中间件将被添加到中间件堆栈的底部。

如果你向 next() 传递了一个 error ，而你并没有在错误处理句柄中处理这个 error，Express 内置的缺省错误处理句柄就是最后兜底的。最后错误将被连同堆栈追踪信息一同反馈到客户端。堆栈追踪信息并不会在生产环境中反馈到客户端。

设置环境变量 NODE_ENV 为 “production” 就可以让应用运行在生产环境模式下。
如果你已经开始向 response 输出数据了，这时才调用 next() 并传递了一个 error，比如你在将向客户端输出数据流时遇到一个错误，Express 内置的缺省错误处理句柄将帮你关闭连接并告知 request 请求失败。

因此，当你添加了一个自定义的错误处理句柄后，如果已经向客户端发送包头信息了，你还可以将错误处理交给 Express 内置的错误处理机制。
	
	function errorHandler(err, req, res, next) {
	  if (res.headersSent) {
	    return next(err);
	  }
	  res.status(500);
	  res.render('error', { error: err });
	}