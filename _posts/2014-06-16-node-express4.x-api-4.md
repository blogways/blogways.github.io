---
layout: post
category: Express
title: Express4.x API 翻译[4] -- Router
tags: ['Node', 'Express', 'API']
author: Jacky
email: shenyj5@asiainfo-linkage.com
image:
description: 总算翻译完了，英文太差，很多借助于工具翻译的，如果有跟原文大相径庭的地方欢迎吐槽。
---

## Express4.x API 翻译[4] -- Router

### Router()

路由器是一个孤立的中间件和路由实例。路由器被看作是唯一能胜任中间件和路由的迷你应用。每个express应用都包含一个内置的路由器。

路由器行为像中间件本身，可以在应用或者其他路由里使用。

使用"express.Router()"创建一个新的路由器。


	var router = express.Router([options]);

改变路由行为的可选项：

- caseSensitive 开启大小写敏感，默认不开启，"/Foo"和"/foo"同样处理。
- Strict 开启严格路由，默认"/foo"和"/foo/"指向同一个路由。

		// invoked for any requests passed to this router
		router.use(function(req, res, next) {
		  // .. some logic here .. like any other middleware
		  next();
		});
		
		// will handle any request that ends in /events
		// depends on where the router is "use()'d"
		router.get('/events', function(req, res, next) {
		  // ..
		});

然后你可以使用一个特定的根url路由器，像这样分离路由到多个文件或者迷你应用。

	// only requests to /calendar/* will be sent to our "router"
	app.use('/calendar', router);
### router.use([path], function)

使用中间件功能，可配置挂载路径，默认挂到"/"根路径。

中间件像一个管道，请求从第一个你定义的中间件开始，然后沿着这个线路一直向下，匹配每一个中间件堆栈中符合的路由。


	var express = require('express');
	var app = express();
	var router = express.Router();
	
	// simple logger for this router's requests
	// all requests to this router will first hit this middleware
	router.use(function(req, res, next) {
	  console.log('%s %s %s', req.method, req.url, req.path);
	  next();
	});
	
	// this will only be invoked if the path ends in /bar
	router.use('/bar', function(req, res, next) {
	  // ... maybe some additional /bar logging ...
	  next();
	});
	
	// always invoked
	router.use(function(req, res, next) {
	  res.send('Hello World');
	});
	
	app.use('/foo', router);
	
	app.listen(3000);

挂载路径被剥离，是不可见的中间件功能。此功能的主要用途是挂载中间件的操作不需要根据它的前缀路径来修改代码。

使用router.user()定义中间件的顺序非常重要，他们依次被调用，因此这个决定中间件的优先级。例如通常logger是第一个需要用到的中间件，用来记录每个请求：


	var logger = require('morgan');
	
	router.use(logger());
	router.use(express.static(__dirname + '/public'));
	router.use(function(req, res){
	  res.send('Hello');
	});

现在假设你想忽略静态文件请求的日志，但在logger()之间继续记录路径跟中间件日志，你只需要将static()移到前面：

	router.use(express.static(__dirname + '/public'));
	router.use(logger());
	router.use(function(req, res){
	  res.send('Hello');
	});

另一个具体的例子是来自多个文件目录的文件服务，优先从"./public"中查找：

	app.use(express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/files'));
	app.use(express.static(__dirname + '/uploads'));
### router.param([name], callback)

路由参数映射逻辑。例如当一个路由中包含:user，加载逻辑会自动提供req.user给路由，或者执行参数输入验证。

下面的代码说明了如果回调，很像中间件，从而支持异步操作，但多了一个id参数。当执行加载用户时，验证req.user，不成功抛出一个错误到next(err)。

要注意，触发一个命名参数函数来运行路由，仅仅在next在没有被参数处理错误调用的情况下执行。


	router.param('user', function(req, res, next, id){
	  User.find(id, function(err, user){
	    if (err) {
	      return next(err);
	    }
	    else if (!user) {
	      return next(new Error('failed to load user'));
	    }
	    
	    req.user = user;
	    next();
	  });
	});
	
	// this route uses the ":user" named parameter
	// which will cause the 'user' param callback to be triggered
	router.get('/users/:user', function(req, res, next) {
	  // req.user WILL be defined here
	  // if there was an error, normal error handling will be triggered
	  // and this function will NOT execute
	});

另外你可能只传递一个回调函数，在这种情况下你有机会修改router.param()API。例如express_params定义的回调函数允许你限制参数为给定的正则表达式。

这个例子有点超前，检查当第二个参数为正则表达式时，返回类似"user"参数示例的回调函数。

	router.param(function(name, fn){
	  if (fn instanceof RegExp) {
	    return function(req, res, next, val){
	      var captures;
	      if (captures = fn.exec(String(val))) {
	        req.params[name] = captures;
	        next();
	      } else {
	        next('route');
	      }
	    }
	  }
	});

该方法现在被用来有效的验证参数，或者解析他们提供分组：

	router.param('id', /^\d+$/);
	
	router.get('/user/:id', function(req, res){
	  res.send('user ' + req.params.id);
	});
	
	router.param('range', /^(\w+)\.\.(\w+)?$/);
	
	router.get('/range/:range', function(req, res){
	  var range = req.params.range;
	  res.send('from ' + range[1] + ' to ' + range[2]);
	});

router.user()方法也支持命名参数，使其他路由提供的挂载点能使用命名参数预加载。

### router.route(path)xl

返回一个可以用来处理HTTP请求带有可选中间件的中间件路由。推荐使用router.route()避免重复路由定义和拼写错误。

根据前面所学建立route.param()示例，我们看到router.route()可以让我们轻松的应对各种HTTP请求处理。


	var router = express.Router();
	
	router.param('user_id', function(req, res, next, id) {
	  // sample user, would actually fetch from DB, etc...
	  req.user = {
	    id: id,
	    name: 'TJ'
	  };
	  next();
	});
	
	router.route('/users/:user_id')
	.all(function(req, res, next) {
	  // runs for all HTTP verbs first
	  // think of it as route specific middleware!
	})
	.get(function(req, res, next) {
	  res.json(req.user);
	})
	.put(function(req, res, next) {
	  // just an example of maybe updating the user
	  req.user.name = req.params.name;
	  // save user ... etc
	  res.json(req.user);
	})
	.post(function(req, res, next) {
	  next(new Error('not implemented'));
	})
	.delete(function(req, res, next) {
	  next(new Error('not implemented'));
	})

这个方法重新使用单'/users/:user_id'路径，添加对各种HTTP请求的处理。

### router.VERB(path, [callback...], callback)

Express中router.VERB()方法提供路由功能，其中WERB属于HTTP请求，例如router.post()。可以有多个回调，所有回调同等对待，行为很像中间件，遇到异常时这些回调会调用next(‘route’)不再执行剩余的回调。这种机制可以用来执行有先决条件的路由，然后将控制权移交到其他没有限制的路由。

下面的代码演示了最简单路由定义。Express将这些路径转换成正则表达式，内部用来匹配即将到来的请求。在执行路由匹配时查询字符串不用考虑，例如"GET /"匹配的路由与"GET /?name=tobi"是一致的。

	router.get('/', function(req, res){
	  res.send('hello world');
	});

正则表达式也可以使用，当你有非常特殊的限制的时候是很有用的，例如"GET /commits/71dbb9c"能很好的匹配路由"GET /commits/71dbb9c..4c084f9"。

	router.get(/^\/commits\/(\w+)(?:\.\.(\w+))?$/, function(req, res){
	  var from = req.params[0];
	  var to = req.params[1] || 'HEAD';
	  res.send('commit range ' + from + '..' + to);
	});
