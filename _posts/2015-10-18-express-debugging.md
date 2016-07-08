---
layout: post
category: Express
title: express3.x-调试
tags: ['express', '翻译']
author: 张可
email: zhangke@asiainfo.com
description: express3.x中文翻译
---
原文：<http://expressjs.com/guide/debugging.html>

# 调试 Express
	
Express 内部使用 debug 模块记录路由匹配、使用到的中间件、应用模式以及请求-响应循环。
	
>debug 有点像改装过的 console.log，不同的是，您不需要在生产代码中注释掉 debug。它会默认关闭，而且使用一个名为 DEBUG 的环境变量还可以打开。

在启动应用时，设置 DEBUG 环境变量为 express:*，可以查看 Express 中用到的所有内部日志。
	
	$ DEBUG=express:* node index.js
在 Windows 系统里，使用如下的命令。

	> set DEBUG=express:* & node index.js
在由 express 应用生成器 生成的默认应用中执行，会打印出如下信息：
	
	$ DEBUG=express:* node ./bin/www
	  express:router:route new / +0ms
	  express:router:layer new / +1ms
	  express:router:route get / +1ms
	  express:router:layer new / +0ms
	  express:router:route new / +1ms
	  express:router:layer new / +0ms
	  express:router:route get / +0ms
	  express:router:layer new / +0ms
	  express:application compile etag weak +1ms
	  express:application compile query parser extended +0ms
	  express:application compile trust proxy false +0ms
	  express:application booting in development mode +1ms
	  express:router use / query +0ms
	  express:router:layer new / +0ms
	  express:router use / expressInit +0ms
	  express:router:layer new / +0ms
	  express:router use / favicon +1ms
	  express:router:layer new / +0ms
	  express:router use / logger +0ms
	  express:router:layer new / +0ms
	  express:router use / jsonParser +0ms
	  express:router:layer new / +1ms
	  express:router use / urlencodedParser +0ms
	  express:router:layer new / +0ms
	  express:router use / cookieParser +0ms
	  express:router:layer new / +0ms
	  express:router use / stylus +90ms
	  express:router:layer new / +0ms
	  express:router use / serveStatic +0ms
	  express:router:layer new / +0ms
	  express:router use / router +0ms
	  express:router:layer new / +1ms
	  express:router use /users router +0ms
	  express:router:layer new /users +0ms
	  express:router use / <anonymous> +0ms
	  express:router:layer new / +0ms
	  express:router use / <anonymous> +0ms
	  express:router:layer new / +0ms
	  express:router use / <anonymous> +0ms
	  express:router:layer new / +0ms
当应用收到请求时，能看到 Express 代码中打印出的日志。
	
	  express:router dispatching GET / +4h
	  express:router query  : / +2ms
	  express:router expressInit  : / +0ms
	  express:router favicon  : / +0ms
	  express:router logger  : / +1ms
	  express:router jsonParser  : / +0ms
	  express:router urlencodedParser  : / +1ms
	  express:router cookieParser  : / +0ms
	  express:router stylus  : / +0ms
	  express:router serveStatic  : / +2ms
	  express:router router  : / +2ms
	  express:router dispatching GET / +1ms
	  express:view lookup "index.jade" +338ms
	  express:view stat "/projects/example/views/index.jade" +0ms
	  express:view render "/projects/example/views/index.jade" +1ms
设置 DEBUG 的值为 express:router，只查看路由部分的日志；设置 DEBUG 的值为 express:application，只查看应用部分的日志，依此类推。

# 通过 express 生成应用
通过 express 命令行生成的应用也使用了 debug 模块，它的命名空间限制在应用中。

如果您通过下述命令生成应用：

	$ express sample-app
则可通过下述命令打开调试信息：

	$ DEBUG=sample-app node ./bin/www
可通过逗号隔开的名字列表来指定多个调试命名空间，如下所示：

	$ DEBUG=http,mail,express:* node index.js
请查阅 调试指南 获取更多有关 debug 的文档。
