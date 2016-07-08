---
layout: post
category: Express
title: Express4.x API 翻译[3] -- Response
tags: ['Node', 'Express', 'API']
author: Jacky
email: shenyj5@asiainfo-linkage.com
image:
description: 之前参与过一个node的项目，使用express框架，感觉这种异步IO以及事件驱动的架构设计用在一些高并发的场景还是大有可为的，决定深入学习一下。
---

## Express4.x API 翻译[3] -- Response

### res.status(code)
node `res.statusCode=`可链接的别名

	res.status(404).sendfile('path/to/404.png');
### res.set(field, [value])
设置响应头内字段值，或者通过一个对象一次设置多个字段。

	res.set('Content-Type', 'text/plain');
	
	res.set({
	  'Content-Type': 'text/plain',
	  'Content-Length': '123',
	  'ETag': '12345'
	})

res.header(field, [value])别名。

### res.get(field)
获取响应头内字段值，不区分大小写。

	res.get('Content-Type');
	// => "text/plain"
### res.cookie(name, value, [options])
设置cookie名称和值，可以是字符串或者对象转换成的JSON。路径选项默认为"/"。

	res.cookie('name', 'tobi', { domain: '.example.com', path: '/admin', secure: true });
	res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });

maxAge选项可以很方便的设置从当前时间开始以毫秒为单位的过期时间。下面的写法等同于上一个例子。

	res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })

一个对象可以通过序列化成JSON传递，它由bodyParser()中间件自动解析。

	res.cookie('cart', { items: [1,2,3] });
	res.cookie('cart', { items: [1,2,3] }, { maxAge: 900000 });

这种方法也支持签名cookie。添加一个简单的signed选项。res.cookie()将隐藏传递给cookieParser(secret)对值签名。

	res.cookie('name', 'tobi', { signed: true });

然后你可以使用req.signedCookie来访问这个值。

### res.clearCookie(name, [options])
删除cookie里面值。默认路径为"/"。

	res.cookie('name', 'tobi', { path: '/admin' });
	res.clearCookie('name', { path: '/admin' });
### res.redirect([status], url)

重定向到给定的url，可选状态编码默认为302"Found"。

	res.redirect('/foo/bar');
	res.redirect('http://example.com');
	res.redirect(301, 'http://example.com');
	res.redirect('../login');

Express支持几种形式的重定向，首先一个完整合格的URI重定向到不同的域名：

	res.redirect('http://google.com');

第二种形式是相对路径的重定向，例如你正在http://example.com/admin/post/new，接着重定向到/admin，你将会登录http://example.com/admin：

	res.redirect('/admin');

其次相对于应用程序挂载点的相对重定向。例如你有一个博客应用程序挂载在/blog下，理论上来说并不知道它挂载在哪边，因此重定向到/admin/post/new将会跳转到http://example.com/admin/post/new，相对挂载点的重定向将会跳转到http://example.com/blog/admin/post/new：

	res.redirect('admin/post/new');

当然相对路径的重定向也是支持的。如果你在http://example.com/admin/post/new，下面的重定向转跳转到http://example.com/admin/post：

	res.redirect('..');

最后一个特殊情况是back重定向，重定向到Referer(或Refererer)，找不到默认为/。

	res.redirect('back');

### res.location
设置location头。

	res.location('/foo/bar');
	res.location('foo/bar');
	res.location('http://example.com');
	res.location('../login');
	res.location('back');

你可以使用res.redirect()相同的urls。

例如你的应用挂载在/blog下，使用下面的代码设置location头为/blog/admin：

	res.location('admin')
### res.send([body|status], [body])
发送一个响应。

	res.send(new Buffer('whoop'));
	res.send({ some: 'json' });
	res.send('
	some html
	
	');
	res.send(404, 'Sorry, we cannot find that!');
	res.send(500, { error: 'something blew up' });
	res.send(200);

此方法适用于执行大量的简单非流式的响应任务，例如在未提前定义和提供自动HEAD和HTTP缓存刷新支持的情况下自动设定Content-Length。
当传入的内容为Buffer，那么Content-Type会被设置为"application/octet-stream"，除非预先定义如下：

	res.set('Content-Type', 'text/html');
	res.send(new Buffer('
	some html
	
	'));

当发送字符串时Content-Type设置默认为"text/html"：

	res.send('
	some html
	
	');

当发送数组或者对象时Express将会转换成JSON格式：

	res.send({ user: 'tobi' })
	res.send([1,2,3])

最后如果返回的是一个数字，没有前面提到的任何一个响应体，Express会为你设置一个响应字符串。例如200将会响应文本"OK"，400响应"Not Found"等等。

	res.send(200)
	res.send(404)
	res.send(500)
### res.json([status|body], [body])

发送一个JSON返回。当返回对象或者数组时该方法与res.send()相同，然而它可以用来将非对象(null, undefined, 等等)转换成精准的JSON，尽管严格来说这些并不是有效的JSON。

	res.json(null)
	res.json({ user: 'tobi' })
	res.json(500, { error: 'message' })
### res.jsonp([status|body], [body])

使用JSONP发送JSON响应。该方法与res.json()相同，但多了对JSONP回调的支持。

	res.jsonp(null)
	// => null
	
	res.jsonp({ user: 'tobi' })
	// => { "user": "tobi" }
	
	res.jsonp(500, { error: 'message' })
	// => { "error": "message" }

默认JSONP回调函数名是callback，但你可以通过修改jsonp callback name参数重新定义。以下是JSONP响应的一些例子：

	// ?callback=foo
	res.jsonp({ user: 'tobi' })
	// => foo({ "user": "tobi" })
	
	app.set('jsonp callback name', 'cb');
	
	// ?cb=foo
	res.jsonp(500, { error: 'message' })
	// => foo({ "error": "message" })
### res.type(type)

设置Content-Type类型为mime的类型，或者当"/"存在时Content-Type被简单的设置成该类型。

	res.type('.html');
	res.type('html');
	res.type('json');
	res.type('application/json');
	res.type('png');
### res.format(object)

执行请求时存在请求Accept头上下文转换。该方法使用req.accepted，这是一个按可接受类型重要性排序的数组，否则第一个回调函数被调用。当没有匹配的回调函数执行时服务器返回406 "Not Acceptable"，或者调用默认的回调函数。

设置Content-Type为你选择一个回调函数，但你可以在回调函数中使用res.set()或者res.type()等修改。

下例当Accept头字段设置成"application/json"或"*/json"时响应{ "message": "hey" }，但如果设置成"*/*"时将会响应"hey"。


	res.format({
	  'text/plain': function(){
	    res.send('hey');
	  },
	  
	  'text/html': function(){
	    res.send('
	hey
	
	');
	  },
	  
	  'application/json': function(){
	    res.send({ message: 'hey' });
	  }
	});

除了规范化的MIME类型你还可以使用扩展名映射这些类型，提供一个稍微不那么详细的实现：

	res.format({
	  text: function(){
	    res.send('hey');
	  },
	  
	  html: function(){
	    res.send('
	hey
	
	');
	  },
	  
	  json: function(){
	    res.send({ message: 'hey' });
	  }
	});
### res.attachment([filename])

设置Content-Disposition头字段为"attachment"。如果给定一个文件名，那么Content-Type将会通过res.type()自动设置成基于扩展名的类型，Content-Disposition的"filename="参数同时也被设置。

	res.attachment();
	// Content-Disposition: attachment

	res.attachment('path/to/logo.png');
	// Content-Disposition: attachment; filename="logo.png"
	// Content-Type: image/png
### res.sendfile(path, [options], [fn]])

传输文件到给定的路径。

自动设置默认基于文件扩展名的Content-Type响应头。当传输发生错误时fn(err)回调函数被调用。

选项：

- maxAge 以毫秒为单位默认为0
- root 相对文件名根目录

在下例中该方法为文件服务提供细粒度支持：

	app.get('/user/:uid/photos/:file', function(req, res){
	  var uid = req.params.uid
	    , file = req.params.file;
	    
	  req.user.mayViewFilesFrom(uid, function(yes){
	    if (yes) {
	      res.sendfile('/uploads/' + uid + '/' + file);
	    } else {
	      res.send(403, 'Sorry! you cant see that.');
	    }
	  });
	});

如有任何问题或者疑问请参阅send附加文档。

### res.download(path, [filename], [fn])

传输路径中的文件作为附件，通常浏览器会提醒用户下载。Content-Disposition "filename="参数，也就是显示在浏览器对话框的默认文件名，你也可以提供一个自定义文件名。

当传输完成或者中途发生错误时将会调用fn回调函数，该方法使用res.sendfile()来传输文件。

	res.download('/report-12345.pdf');
	
	res.download('/report-12345.pdf', 'report.pdf');
	
	res.download('/report-12345.pdf', 'report.pdf', function(err){
	  if (err) {
	    // handle error, keep in mind the response may be partially-sent
	    // so check res.headersSent
	  } else {
	    // decrement a download credit etc
	  }
	});
### res.links(links)
加入给定的链接来填充"Link"响应头字段。

	res.links({
	  next: 'http://api.example.com/users?page=2',
	  last: 'http://api.example.com/users?page=5'
	});
处理后：

	Link: <http://api.example.com/users?page=2>; rel="next", 
	      <http://api.example.com/users?page=5>; rel="last"
### res.locals

响应本地化变量作用域为request，因此只适用于在该request/response周期内呈现的视图，如果有的话。其实该API跟app.locals是等同的。

这个对象适用于的request级别的信息，例如request路径，用户认证，用户设置等。

	app.use(function(req, res, next){
	  res.locals.user = req.user;
	  res.locals.authenticated = ! req.user.anonymous;
	  next();
	});
### res.render(view, [locals], callback)

渲染一个视图，同时向回调函数传递渲染后的字符串。发生错误时内部调用next(err)。回调函数传入可能发生的错误以及渲染后的页面，这样就不会自动执行响应了。

	res.render('index', function(err, html){
	  // ...
	});
	
	res.render('user', { name: 'Tobi' }, function(err, html){
	  // ...
	});