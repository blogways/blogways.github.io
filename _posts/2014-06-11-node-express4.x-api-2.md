---
layout: post
category: Express
title: Express4.x API 翻译[2] -- Request
tags: ['Node', 'Express', 'API']
author: Jacky
email: shenyj5@asiainfo-linkage.com
image:
description: 之前参与过一个node的项目，使用express框架，感觉这种异步IO以及事件驱动的架构设计用在一些高并发的场景还是大有可为的，决定深入学习一下。
---

## Express4.x API 翻译[2] -- Request

### req.params

此属性是一个包含映射路由"parameters"的对象。例如你使用/user/:name路由，那么"name"属性对你来说就是一个req.params.name变量。该对象默认为{}。

	// GET /user/tj
	req.params.name
	// => "tj"

当在定义路由规则时使用了正则表达式，使用req.params[N]获取所有参数匹配数组，其中N表示数组的第几个。此规则适用于包含未定义的通配符的路由字符串，例如`/file/*`：

	// GET /file/javascripts/jquery.js
	req.params[0]
	// => "javascripts/jquery.js"
### req.query

此属性是一个包含解析查询字符串的对象，默认为{}。

	// GET /search?q=tobi+ferret
	req.query.q
	// => "tobi ferret"
	
	// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
	req.query.order
	// => "desc"
	
	req.query.shoe.color
	// => "blue"
	
	req.query.shoe.type
	// => "converse"
### req.param(name)

返回当前name参数的值。
	
	// ?name=tobi
	req.param('name')
	// => "tobi"
	
	// POST name=tobi
	req.param('name')
	// => "tobi"
	
	// /user/tobi for /user/:name 
	req.param('name')
	// => "tobi"

查找优先级如下：

- req.params
- req.body
- req.query

直接使用req.body，req.params，和req.query应该更新清晰，除非你确实需要接收每个对象的输入。


### req.route

当前匹配的路由包含多个属性，如路由的原始路径字符串以及转换后的正则表达式等。

	app.get('/user/:id?', function(req, res){
	  console.log(req.route);
	});

上面的代码输出结果：

	{ path: '/user/:id?',
	  keys: [ { name: 'id', optional: true } ],
	  regexp: /^\/user(?:\/([^\/]+?))?\/?$/i,
	  params: [ id: '12' ] }
### req.cookies

当cookieParser()中间件使用时该对象默认为{}，除此之外还包含由用户代理发送的cookies。

	// Cookie: name=tj
	req.cookies.name
	// => "tj"

如有任何问题或者疑问请参阅cookie-parser附加文档。

### req.signedCookies

当cookieParser(secret)中间件使用该对象默认为{}，还包括用户代理发送的签名cookies，未签名以及准备使用的。签名cookies存放于一个单独的对象，以显示开发者的意图，否则可以通过在req.cookie设置值发起恶意攻击，从而很轻易的欺骗。需要注意的是签名的cookie并不意味着它是隐藏的或者是加密的，这个防止篡改的秘密只是简单的将签名私有化。

	// Cookie: user=tobi.CP7AWaXDfAKIRfH49dQzKJx7sKzzSoPq7/AcBBRVwlI3
	req.signedCookies.user
	// => "tobi"
如有任何问题或者疑问请参阅cookie-parser附加文档。

### req.get(field)

获取请求头内的field字段，不区分大小写。Referrer和Referer字段可以互换。

	req.get('Content-Type');
	// => "text/plain"
	
	req.get('content-type');
	// => "text/plain"
	
	req.get('Something');
	// => undefined
别名为req.header(field)。

### req.accepts(types)

检查给定的types是不是可以接受的，当结果为true时返回最佳匹配，否则返回undefined，在这种情况下你应该返回406"Not Acceptable"。

type可以是单一的mine类型的字符串，比如"application/json"，扩展名如"json"，也可以是以逗号分隔的列表或者数组。当为列表或数组时将返回最佳匹配。

	// Accept: text/html
	req.accepts('html');
	// => "html"
	
	// Accept: text/*, application/json
	req.accepts('html');
	// => "html"
	req.accepts('text/html');
	// => "text/html"
	req.accepts('json, text');
	// => "json"
	req.accepts('application/json');
	// => "application/json"
	
	// Accept: text/*, application/json
	req.accepts('image/png');
	req.accepts('png');
	// => undefined
	
	// Accept: text/*;q=.5, application/json
	req.accepts(['html', 'json']);
	req.accepts('html, json');
	// => "json"

如有任何问题或者疑问，请参阅accepts附加文档。

### req.acceptsCharset(charset)
检查给定的字符集是否可以支持。

如有任何问题或者疑问，请参阅accepts附加文档。

### req.acceptsLanguage(lang)
检查给定的lang是否支持。

如有任何问题或者疑问，请参阅accepts附加文档。

### req.is(type)

检查传入请求字符串是否包含了"Content-Type"头字段，并且给出匹配的mine类型。

	// With Content-Type: text/html; charset=utf-8
	req.is('html');
	req.is('text/html');
	req.is('text/*');
	// => true
	
	// When Content-Type is application/json
	req.is('json');
	req.is('application/json');
	req.is('application/*');
	// => true
	
	req.is('html');
	// => false

如有任何问题或者疑问，请参阅type-is附加文档。

### req.ip

返回远程地址，或者当信任代理已启用时返回代理地址。

	req.ip
	// => "127.0.0.1"
### req.ips

当信任代理为true时，解析"X-Forwarded-For"ip地址列表返回一个数组，否则返回一个空数组。例如当值为"client, proxy1, proxy2"时你会获得["client", "proxy1", "proxy2"]数组，其中"proxy2"是最远的下游地址。

### req.path
返回请求的URL路径名。

	// example.com/users?sort=desc
	req.path
	// => "/users"
### req.host
Returns the hostname from the "Host" header field (void of portno).

返回从"Host"头字段内取出的主机名(不包含端口)。

	// Host: "example.com:3000"
	req.host
	// => "example.com"
### req.fresh

检查请求是否刷新，通过对Last-Modified和/或ETag进行匹配，表明资源是不是最新的。

	req.fresh
	// => true
如有任何问题或者疑问，请参阅fresh附加文档。

### req.stale

检查请求是否过期，如果Last-Modified和/或ETag不匹配，表有资源是过期的。

	req.stale
	// => true
### req.xhr

检查请求头里是否包含"X-Requested-With"字段并且值为"XMLHttpRequest"(jQuery等)。

	req.xhr
	// => true
### req.protocol
当使用TLS请求时返回"http"或"https"协议字符串。当信任路由设置为开启时"X-Forwarded-Proto"头字段将被信任。如果你正在运行一个支持https协议的反向代理，那么这个是支持的。


	req.protocol
	// => "http"
### req.secure

检查TLS连接是否建立。这是一个简写：

	'https' == req.protocol;
### req.subdomains
Return subdomains as an array.
返回子域数组。

	// Host: "tobi.ferrets.example.com"
	req.subdomains
	// => ["ferrets", "tobi"]
### req.originalUrl

此属性很像req.url，但它保留了原始请求的url，允许你在做内部路由时自由重写req.url。例如app.use()中间件将重写req.url重新定义挂载点。

	// GET /search?q=something
	req.originalUrl
	// => "/search?q=something"