---              
layout: post
category: Express
title: node Express 框架搭建
tags: ['node', 'Express']
author: 汤仕忠
email: tangsz@asiainfo-linkage.com
#image:
description: Express 是一个简洁而灵活的 node.js Web应用框架, 提供一系列强大特性帮助你创建各种Web应用


---
## 一、Express安装
Express是一个node.js模块，采用npm全局模块。

npm install -g express


### 二、新建项目

创建一个项目express testExpress,会自动生成目录。

	   create : testExpress
	   create : testExpress/package.json
	   create : testExpress/app.js
	   create : testExpress/public
	   create : testExpress/public/images
	   create : testExpress/views
	   create : testExpress/views/layout.jade
	   create : testExpress/views/index.jade
	   create : testExpress/routes
	   create : testExpress/routes/index.js
	   create : testExpress/routes/user.js
	   create : testExpress/public/stylesheets
	   create : testExpress/public/stylesheets/style.css
	   create : testExpress/public/javascripts


运行node app.js （运行程序，默认地址是http://localhost:3000）
如果打开页面出错，可能你没有安装jade模块，那就输入npm install jade进行安装，在我们
日志分析系统中没有用jade模板，用的ejs模板。

### 三、express项目目录文件介绍

Express目录介绍：

	目录/文件	                                  说明

    package.json	 						npm依赖配置文件， java Maven中的pom.xml文件
    app.js                                  项目的入口文件
    routes/                                 用于存放路由文件
	public/                                 静态文件
    javascript/                             js
    stylesheets/                            css
    images/                                 图片
    views/                                  模板文件, express默认采用jade
    node_modules/                           存放npm安装到本地依赖包，依赖包在package.json文件
											中声明，使用npm install指令安装


申明：

	以上目录文件介绍仅对于express框架自动生成目录，框架没有除了package.json文件和 node_modules目录，
	没有限定其他文件名称和目录结构，大家在实际开发中可以根据项目需要重新定义目录结构。




### 四、运行原理

4.1　底层：http模块

Express框架建立在node.js内置的http模块上。http模块生成服务器的原始代码如下：
	
	var http = require("http");

	var app = http.createServer(function(request, response) {
	  response.writeHead(200, {"Content-Type": "text/plain"});
	  response.end("Hello world!\n");
	});
	
	app.listen(3000, "localhost");
	console.log("Server running at http://localhost:3000/");

上面代码的关键是http模块的createServer方法，表示生成一个HTTP服务器实例。该方法接受一个回调函数，该回调函数的参数，分别为代表HTTP请求和HTTP回应的request对象和response对象。

4.2　对http模块的再包装

Express框架的核心是对http模块的再包装。上面的代码用Express改写如下：

	var express = require("express");
	var http = require("http");
	
	var app = express();
	
	app.use(function(request, response) {
	  response.writeHead(200, { "Content-Type": "text/plain" });
	  response.end("Hello world!\n");
	});
	
	http.createServer(app).listen(3000);

比较两段代码，可以看到它们非常接近，唯一的差别是createServer方法的参数，从一个回调函数变成了一个Epress对象的实例。而这个实例使用了use方法，加载了与上一段代码相同的回调函数。

Express框架等于在http模块之上，加了一个中间层，而use方法则相当于调用中间件。

4.3　中间件

简单说，中间件（middleware）就是处理HTTP请求的函数，用来完成各种特定的任务，比如检查用户是否登录、分析数据、以及其他在需要最终将数据发送给用户之前完成的任务。它最大的特点就是，一个中间件处理完，再传递给下一个中间件。

node.js的内置模块http的createServer方法，可以生成一个服务器实例，该实例允许在运行过程中，调用一系列函数（也就是中间件）。当一个HTTP请求进入服务器，服务器实例会调用第一个中间件，完成后根据设置，决定是否再调用下一个中间件。中间件内部可以使用服务器实例的response对象（ServerResponse，即回调函数的第二个参数），以及一个next回调函数（即第三个参数）。每个中间件都可以对HTTP请求（request对象）做出回应，并且决定是否调用next方法，将request对象再传给下一个中间件。

一个不进行任何操作、只传递request对象的中间件，大概是下面这样：

	function uselessMiddleware(req, res, next) { 
    	next();
	}
	
上面代码的next为中间件的回调函数。如果它带有参数，则代表抛出一个错误，参数为错误文本。

	function uselessMiddleware(req, res, next) { 
    	next('出错了！');
	}
抛出错误以后，后面的中间件将不再执行，直到发现一个错误处理函数为止。

4.4　use方法

use是express调用中间件的方法，它返回一个函数。下面是一个连续调用两个中间件的例子：

	var express = require("express");
	var http = require("http");
	
	var app = express();
	
	app.use(function(request, response, next) {
	  console.log("In comes a " + request.method + " to " + request.url);
	  next();
	});
	
	app.use(function(request, response) {
	  response.writeHead(200, { "Content-Type": "text/plain" });
	  response.end("Hello world!\n");
	});
	
	http.createServer(app).listen(3000);

上面代码先调用第一个中间件，在控制台输出一行信息，然后通过next方法，调用第二个中间件，输出HTTP回应。由于第二个中间件没有调用next方法，所以不再request对象就不再向后传递了。

使用use方法，可以根据请求的网址，返回不同的网页内容。

	var express = require("express");
	var http = require("http");
	
	var app = express();
	
	app.use(function(request, response, next) {
	  if (request.url == "/") {
	    response.writeHead(200, { "Content-Type": "text/plain" });
	    response.end("Welcome to the homepage!\n");
	  } else {
	    next();
	  }
	});
	
	app.use(function(request, response, next) {
	  if (request.url == "/about") {
	    response.writeHead(200, { "Content-Type": "text/plain" });
	  } else {
	    next();
	  }
	});
	
	app.use(function(request, response) {
	  response.writeHead(404, { "Content-Type": "text/plain" });
	  response.end("404 error!\n");
	});
	
	http.createServer(app).listen(3000);


上面代码通过request.url属性，判断请求的网址，从而返回不同的内容。

除了在回调函数内部，判断请求的网址，Express也允许将请求的网址写在use方法的第一个参数。

	app.use('/', someMiddleware);

上面代码表示，只对根目录的请求，调用某个中间件。



### 五、Express的方法

5.1　all方法和HTTP动词方法

针对不同的请求，Express提供了use方法的一些别名。比如，上面代码也可以用别名的形式来写。

	var express = require("express");
	var http = require("http");
	var app = express();
	
	app.all("*", function(request, response, next) {
	  response.writeHead(200, { "Content-Type": "text/plain" });
	  next();
	});
	
	app.get("/", function(request, response) {
	  response.end("Welcome to the homepage!");
	});
	
	app.get("/about", function(request, response) {
	  response.end("Welcome to the about page!");
	});
	
	app.get("*", function(request, response) {
	  response.end("404!");
	});
	
	http.createServer(app).listen(3000);

上面代码的all方法表示，所有请求都必须通过该中间件，参数中的“*”表示对所有路径有效。get方法则是只有GET动词的HTTP请求通过该中间件，它的第一个参数是请求的路径。由于get方法的回调函数没有调用next方法，所以只要有一个中间件被调用了，后面的中间件就不会再被调用了。

除了get方法以外，Express还提供post、put、delete方法，即HTTP动词都是Express的方法。

这些方法的第一个参数，都是请求的路径。除了绝对匹配以外，Express允许模式匹配：

	app.get("/hello/:who", function(req, res) {
	  res.end("Hello, " + req.params.who + ".");
	});


上面代码将匹配“/hello/alice”网址，网址中的alice将被捕获，作为req.params.who属性的值。需要注意的是，捕获后需要对网址进行检查，过滤不安全字符，上面的写法只是为了演示，生产中不应这样直接使用用户提供的值。

如果在模式参数后面加上问号，表示该参数可选：
	
	app.get('/hello/:who?',function(req,res) {
    if(req.params.id) {
        res.end("Hello, " + req.params.who + ".");
    }
    else {
        res.send("Hello, Guest.");
    }
	});


5.2　set方法

set方法用于指定变量的值。

	app.set("views", __dirname + "/views");
	app.set("view engine", "jade");

上面代码使用set方法，为系统变量“views”和“view engine”指定值。

5.3　response对象

（1）response.redirect方法

response.redirect方法允许网址的重定向。

	response.redirect("/hello/anime");
	response.redirect("http://www.example.com");
	response.redirect(301, "http://www.example.com"); 

（2）response.sendFile方法

response.sendFile方法用于发送文件。

	response.sendFile("/path/to/anime.mp4");


（3）response.render方法

response.render方法用于渲染网页模板。

	app.get("/", function(request, response) {
	  response.render("index", { message: "Hello World" });
	});

上面代码使用render方法，将message变量传入index模板，渲染成HTML网页。

5.4　requst对象

（1）request.ip

request.ip属性用于获得HTTP请求的IP地址。

（2）request.files

request.files用于获取上传的文件。



### 六、日志系统部分配置

	// should be placed before express.static
    app.use(express.compress({
      filter: function (req, res) {
        return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
      },
      level: 9
    }))

    app.use(express.favicon('public/favicon.ico'))
    app.use(express.static(config.root + '/public'))

    // don't use logger for test env
    if (process.env.NODE_ENV !== 'test') {
      app.use(express.logger('dev'))
    }

    // set views path, template engine and default layout
	  app.engine('html', require('ejs').__express)
    app.set('views', config.root + '/app/views')
    app.set('view engine', 'html')
    
    app.use(partials());
    app.use(pjax());


    // cookieParser should be above session
    app.use(express.cookieParser())


    // bodyParser should be above methodOverride
    app.use(express.bodyParser())
    app.use(express.methodOverride())
    
    //log4js
    log.use(app);

	 app.use(function(req, res, next){
		res.on('header', function() {
			if (!req.session) return;
			if (req.session.cookie.expires==null) return;
			req.session.cookie.expires = new Date(Date.now() + 1000*60*60*24*14)
		})
		next()
	});

    // express/mongo session storage
    app.use(express.session({
      secret: 'logAnalyse-pangu',
	  cookie: { maxAge: 900000 },  //15 minute
      store: new mongoStore({
        url: config.db,
        collection : 'sessions'
      })
    }))
    
    
    
	// connect flash for flash messages - should be declared after sessions
    app.use(flash())

    // adds CSRF support
    if (process.env.NODE_ENV !== 'test') {
        app.use(express.csrf())
    }

    app.use(function(req, res, next){
      //if(req.url != "/faye")
          res.locals.csrf_token = req.csrfToken();
      next()
    })
    
    
    //menu Plug-in technology    
    var menus = [];
    require('../app/controllers/menu').loadMenu(config.root+'/app/controllers/menu',
    function(m){menus = m;});
    
      
    //Public Response Information 
    app.use(function(req, res, next){         
        if (req.session.user){ 
            res.locals.menus = menus;
            res.locals.current_user = req.session.user;
        }else{ 
                     
           if(req.url != "/login.html" && req.url != "/auth.html" && req.url != "/logout" 
           && req.url != "/register" && req.url != "/registerAction"){
                if (req.url == "/getInbox.html"){
                   ContentType = "text/plain";
                   res.StatusCode =500;
                   res.write("会话超时，请重新登录！");
                   res.end();
                   return;
                }
                return res.redirect('/login.html')
           }
        }
        return next();   
    });

                
    //Plug-in technology    
    plugin(app).require(config.root+'/app/controllers/plugin').load();

    // routes should be at the last
    app.use(app.router)
    