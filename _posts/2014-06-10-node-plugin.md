---              
layout: post
category: Node.js
title: node 插件化开发
tags: ['node','express', 'plugin']
author: 汤仕忠
email: tangsz@asiainfo-linkage.com
#image:
description: 插件化模块开发，降低代码耦合性，无需改动基础核心文件，多人协作降低了风险，无需改动代码支持多模块的安装卸载。

--- 
## 一、非插件化开发在node-express下的实现
以下为我们日志分析系统中添加一个查询明细页面要添加的代码：

1、建立明细页面调转逻辑控制文件detail.js，添加代码：
	
	exports.qrydetail = function(req, res) {
		res.render('query/detail',{
		    layout: false,
			errors: req.flash('error') 
		})
	}
2、建立登录页面detail.html；

3、在路由控制文件routes.js引入detail.js：

	var detailModule = require('../app/controllers/detail')

4、在路由控制文件routes.js中添加路由：app.get('/detail.html',       detailModule.qrydetail)；

访问：http://localhost:3000/detail.html

缺点：

1) 每次添加链接都需要修改routes.js，时间久了文件很大不便于维护；

2) 多人协作routes.js会同时被多人修改；

3) 无法支持不改动代码多模块的安装卸载

## 二、插件化模块添加

1、plugin安装

	$ npm install plugin

2、与express集成

	var plugin = require('plugin')；
	//Plug-in technology    
    plugin(app).require(config.root+'/app/controllers/plugin').load();

以上代码含义为：node服务启动时会加载'/app/controllers/plugin'目录下所有js文件作为项目插件（当然文件内容有一定格式）

3、添加一个查询明细页面

1) 建立明细查询模块页面detail.js，代码：
	
	exports.plugin = function(server) {

	   server.get('/detail.html', function(req, res) { 
	        res.render('query/detail',{
			    layout: false,
				errors: req.flash('error') 
			})   	              
	   });
	}
	  

2) 建立登录页面detail.html；


访问：http://localhost:3000/detail.html

优点：

a) 无需修改routes.js；

b) 支持不改动代码多模块的安装卸载(卸载将'/app/controllers/plugin'目录下detail.js文件删除即可)