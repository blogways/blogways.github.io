---
layout: post
category: Express
title: Express4.x API 翻译[1] -- Application
tags: ['Node', 'Express', 'API']
author: Jacky
email: shenyj5@asiainfo-linkage.com
image:
description: 之前参与过一个node的项目，使用express框架，感觉这种异步IO以及事件驱动的架构设计用在一些高并发的场景还是大有可为的，决定深入学习一下。
---

## Express4.x API 翻译[1] -- Application

之前参与过一个node的项目，使用express框架，感觉这种异步IO以及事件驱动的架构设计用在一些高并发的场景还是大有可为的，决定深入学习一下。刚开始写几个例子就发现问题了，以前用的是3.5的版本，可以很好的集成在webstorm工具里面使用，到4.x版本的时候就一堆问题，工具已经无法创建新的项目，单独用命令生成，发现启动方法也跟以前不一样，4.x是用npm去启动bin下面的www文件，一些以前的写法现在也用不了，本想回到之前的版本，但看4.x的版本更新很快，应该也是以后的趋势，而且专注高性能，有必要直接学习之。从哪下手比较好呢，网上4.x的例子跟文档都很少，索性还是从API看起吧，刚好英文比较差，算是一起学了。

### express()
创建一个 express 应用。

	var express = require('express');
	var app = express();
	
	app.get('/', function(req, res){
	  res.send('hello world');
	});
	
	app.listen(3000);

## Application
### settings

提供以下设置用来改变Express行为：

- `env` 环境模式，默认为process.env.NODE_ENV (NODE_ENV 环境变量) 或者 "development"
- `trust proxy` 启用反向代理，默认disabled
- `jsonp callback name` 通过 ?callback= 更新默认回调函数的名称
- `json replacer` JSON replacer callback，默认为null
- `case sensitive routing` 路由启用区分大小写，默认为disabled，"/Foo"和"/foo"默认是同一个地址
- `strict routing` 启用严谨路由，默认情况下"/foo"和"/foo/"被解析成同一个路由
- `view cache` 启用视图模板编译缓存，产品模式下默认enabled
- `view engine` 缺省状态下默认模板引擎
- `views` 视图目录路径，默认"process.cwd()+'/views'"
- `x-powered-by` 启用X-Powered-By: Express HTTP header，默认enabled

### app.set(name, value)
设置指定name的值

	app.set('title', 'My Site');
	app.get('title');
	// => "My Site"

### app.get(name)
获取对应name的值

	app.get('title');
	// => undefined
	
	app.set('title', 'My Site');
	app.get('title');
	// => "My Site"

### app.enable(name)
设置name值为true

	app.enable('trust proxy');
	app.get('trust proxy');
	// => true
### app.disable(name)
设置name值为false

	app.disable('trust proxy');
	app.get('trust proxy');
	// => false
### app.enabled(name)
检查name对应的值是否为true

	app.enabled('trust proxy');
	// => false
	
	app.enable('trust proxy');
	app.enabled('trust proxy');
	// => true
### app.disabled(name)
检查name对应的值是否为false

	app.disabled('trust proxy');
	// => true
	
	app.enable('trust proxy');
	app.disabled('trust proxy');
	// => false
### app.use([path], function)
使用给定的中间件function，可选择挂载path，默认"/"

	var express = require('express');
	var app = express();
	
	// simple logger
	app.use(function(req, res, next){
	  console.log('%s %s', req.method, req.url);
	  next();
	});
	
	// respond
	app.use(function(req, res, next){
	  res.send('Hello World');
	});
	
	app.listen(3000);

挂载路径被剥离出来，对于中间件函数来说是不可见的。这么设计是为了让中间件在不用修改任何代码的情况下就可以在任意前缀的路径下执行。

这里有一个具体的例子，通过express.static()方法使用./public来管理文件服务用例的中间件：

	// GET /javascripts/jquery.js
	// GET /style.css
	// GET /favicon.ico
	app.use(express.static(__dirname + '/public'));

例如你想为自有的静态文件增加前缀'/static'，你可以使用'mounting'功能。挂载的中间件函数不会被调用，除非req.url包含这个前缀，当函数被调用时，前缀是被剥离出去的。当然这只会影响到这个函数，挂载好后随后的中间件还是会通过包含`/static`的`req.url`查看到。

	// GET /static/javascripts/jquery.js
	// GET /static/style.css
	// GET /static/favicon.ico
	app.use('/static', express.static(__dirname + '/public'));

中间件使用app.use()定义的顺序是非常重要的，它们依次被调用，因此这个决定了中间件的优先级。例如，一般来说日志中间件是你要用到的第一个中间件：

	var logger = require('morgan');
	
	app.use(logger());
	app.use(express.static(__dirname + '/public'));
	app.use(function(req, res){
	  res.send('Hello');
	});

现在假设你想忽略静态文件的请求日志，但又想在logger()定义之后继续使用日志路由，你只需要将static()移动前面就可以了：

	app.use(express.static(__dirname + '/public'));
	app.use(logger());
	app.use(function(req, res){
	  res.send('Hello');
	});

另一个具体的例子是从众多的目录文件服务中，给予"./public"最高的优先级：

	app.use(express.static(__dirname + '/public'));
	app.use(express.static(__dirname + '/files'));
	app.use(express.static(__dirname + '/uploads'));
### app.engine(ext, callback)

注册给定的模板引擎的callback默认用来处理扩展名为ext的文件。例如，如果你试图渲染一个"foo.jade"文件，Express将在内部调用以下代码，并缓存require()给后续调用以提高性能。

	app.engine('jade', require('jade').__express);

引擎没有提供._express渲染方法，或者你想映射一个不一样的扩展名在模板引擎上，你可以用这个方法。例如映射EJS模板引擎来渲染".html"文件。

	app.engine('html', require('ejs').renderFile);

在这种情况下，EJS提供.renderFile()方法使用Express定义的参数：(path, options, callback)，但要注意这个方法是在内部给ejs._express取一个别名，如果你使用".ejs"可以什么都不要做。

有些模板引擎并不遵循这一规则，consolidate.js库的建立是为了映射所有的node流行模板引擎遵循这一规则，从而使得他们在Express内无缝工作。

	var engines = require('consolidate');
	app.engine('haml', engines.haml);
	app.engine('html', engines.hogan);
### app.param([name], callback)

映射路由参数规则。例如当:user存在于一个路由路径中，你需要自动提供req.user给路由映射启动逻辑，或者执行输入参数验证。

下面的代码说明了如果callback很像中间件，从而支持异常操作，但却增加了一个参数，这里命名为id。然后尝试执行加载用户信息，赋值给req.user，否则传递一个错误到next(err)。

	app.param('user', function(req, res, next, id){
	  User.find(id, function(err, user){
	    if (err) {
	      next(err);
	    } else if (user) {
	      req.user = user;
	      next();
	    } else {
	      next(new Error('failed to load user'));
	    }
	  });
	});

另外，你可能只传递一个回调函数，在这种情况下你有机会改变app.param()API。例如express-params定义了下面的回调函数，它允许你使用给定的正则表达式限制参数。

这个例子有点更先进，检查当第二个参数是正则表达式，返回回调函数很像"user"参数例子。

	app.param(function(name, fn){
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

该方法可以被用来有效的验证参数，或者解析提供匹配分组：

	app.param('id', /^\d+$/);
	
	app.get('/user/:id', function(req, res){
	  res.send('user ' + req.params.id);
	});
	
	app.param('range', /^(\w+)\.\.(\w+)?$/);
	
	app.get('/range/:range', function(req, res){
	  var range = req.params.range;
	  res.send('from ' + range[1] + ' to ' + range[2]);
	});
### app.VERB(path, [callback...], callback)

Express中App.WEB()方法提供了路由功能，其中VERB是一个HTTP动作，跟app.post()类似。可提供多个回调函数，都是一视同仁，表现跟中间件一样，唯一不一样的是通过调用next(‘route’)来继续其余的路由回调。这个机制可以用来执行路由的前提条件，然后将控制权传递给随后的路由，没有理由进行路由的匹配。

下面的代码说明了多个简单路由定义的可行性。Express将路径字符串转换成正由表达式，用来在内部匹配到来的请求。在执行这些匹配时查询字符串不考虑，例如"GET /"将匹配以下的路由，如"GET /?name=tobi"。

	app.get('/', function(req, res){
	  res.send('hello world');
	});

正由表达式也可以使用，如果你有非常特殊的限制可能是有用的，例如下面的"GET /commits/71dbb9c"表达式将很好的匹配"GET /commits/71dbb9c..4c084f9"。

	app.get(/^\/commits\/(\w+)(?:\.\.(\w+))?$/, function(req, res){
	  var from = req.params[0];
	  var to = req.params[1] || 'HEAD';
	  res.send('commit range ' + from + '..' + to);
	});

可以传递一些回调函数，对于利用中间件加载资源、执行验证等很有用。

	app.get('/user/:id', user.load, function(){
	  // ... 
	})

如果你有多个共同的中间件路由，可以使用路由api的all。

	var middleware = [loadForum, loadThread];
	
	app.route('/forum/:fid/thread/:tid')
	.all(loadForum)
	.all(loadThread)
	.get(function() { //... });
	.post(function() { //... });

两个中间件将用来处理GET和POST请求。

### app.all(path, [callback...], callback)

此方法功能就像app.VERB()方法，但它匹配所有HTTP的动作。
该方法用于映射具体的路径前缀的"global"逻辑或者任意匹配非常有用。例如如果你将下面的路由放在其他路由前面定义，这将导致从这个规则起所有的请求都需要身份验证，并自动加载一个用户。请记住这些回调函数不应该被当作终点，loadUser可以当作一个任务，然后调用next()继续匹配随后的路由。

	app.all('*', requireAuthentication, loadUser);
等价于：

	app.all('*', requireAuthentication)
	app.all('*', loadUser);

另一个很好的例子是白名单"global"功能。下面的例子跟之前很像，但只限制"/api"为前缀的路径：

	app.all('/api/*', requireAuthentication);
### app.route(path)

返回一个路由的实例用来处理可选的中间件HTTP动作。推荐使用app.route()方法用来避免路由重复命名以及由此导致的错误。

	var app = express();
	
	app.route('/events')
	.all(function(req, res, next) {
	  // runs for all HTTP verbs first
	  // think of it as route specific middleware!
	})
	.get(function(req, res, next) {
	  res.json(...);
	})
	.post(function(req, res, next) {
	  // maybe add a new event...
	})
### app.locals

应用本地变量提供给所有在这个应用程序内渲染的模板。这是一个非常有用的模板函数，就像应用程序级别数据一样。


	app.locals.title = 'My App';
	app.locals.strftime = require('strftime');
	app.locals.email = 'me@myapp.com';

该app.locals对象是JavaScript对象。添加在它上面的属性被当成应用程序内部的本地变量。

	app.locals.title
	// => 'My App'
	
	app.locals.email
	// => 'me@myapp.com'

默认情况下Express只有一个应用程序级别的局部变量，那就是settings。

	app.set('title', 'My App');
	// use settings.title in a view
### app.render(view, [options], callback)

使用回调函数返回的渲染字符串渲染视图。这是res.render()的应用程序级别的版本，它们的行为是一样的。

	app.render('email', function(err, html){
	  // ...
	});
	
	app.render('email', { name: 'Tobi' }, function(err, html){
	  // ...
	});
### app.listen()

绑定并监听给定主机和端口的连接，该方法和node的http.Server#listener()方法是一致的。

	var express = require('express');
	var app = express();
	app.listen(3000);

express()返回的app实际上是一个JavaScript函数，目的是传递给node的http服务器作为回调处理请求。这使得你可以轻松的为你的应用程序提供HTTP和HTTPS版本相同的代码库，app并不从HTTP或者HTTPS继承，就是一个简单的回调函数：

	var express = require('express');
	var https = require('https');
	var http = require('http');
	var app = express();
	
	http.createServer(app).listen(80);
	https.createServer(options, app).listen(443);

该app.listen()方法定义成一个简单方便的方法，如果你想使用HTTPS或者同时使用，使用上面的方法。

	app.listen = function(){
	  var server = http.createServer(this);
	  return server.listen.apply(server, arguments);
	};