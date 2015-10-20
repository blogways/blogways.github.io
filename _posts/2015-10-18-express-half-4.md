---
layout: post
category: express
title: express3.x-调试和数据库
tags: ['express', '翻译']
author: 张可
email: zhangke@asiainfo.com
description: express3.x中文翻译
---
#调试 Express
	
	Express 内部使用 debug 模块记录路由匹配、使用到的中间件、应用模式以及请求-响应循环。

debug 有点像改装过的 console.log，不同的是，您不需要在生产代码中注释掉 debug。它会默认关闭，而且使用一个名为 DEBUG 的环境变量还可以打开。
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

#通过 express 生成应用
通过 express 命令行生成的应用也使用了 debug 模块，它的命名空间限制在应用中。

如果您通过下述命令生成应用：

	$ express sample-app
则可通过下述命令打开调试信息：

	$ DEBUG=sample-app node ./bin/www
可通过逗号隔开的名字列表来指定多个调试命名空间，如下所示：

	$ DEBUG=http,mail,express:* node index.js
请查阅 调试指南 获取更多有关 debug 的文档。

#集成数据库

为 Express 应用添加连接数据库的能力，只需要加载相应数据库的 Node.js 驱动即可。这里将会简要介绍如何为 Express 应用添加和使用一些常用的数据库 Node 模块。
	
	Cassandra
	CouchDB
	LevelDB
	MySQL
	MongoDB
	Neo4j
	PostgreSQL
	Redis
	SQLite
	ElasticSearch
这些数据库驱动只是其中一部分，可在 npm 官网 查找更多驱动。

Cassandra
模块: cassandra-driver
安装

	$ npm install cassandra-driver
	示例
	
	var cassandra = require('cassandra-driver');
	var client = new cassandra.Client({ contactPoints: ['localhost']});
	
	client.execute('select key from system.local', function(err, result) {
	  if (err) throw err;
	  console.log(result.rows[0]);
	});

###CouchDB
模块: nano
安装
	
	$ npm install nano
示例

	var nano = require('nano')('http://localhost:5984');
	nano.db.create('books');
	var books = nano.db.use('books');
	
	//Insert a book document in the books database
	books.insert({name: 'The Art of war'}, null, function(err, body) {
	  if (!err){
	    console.log(body);
	  }
	});
	
	//Get a list of all books
	books.list(function(err, body){
	  console.log(body.rows);
	}

###LevelDB
模块: levelup
安装
	
	$ npm install level levelup leveldown
	示例
	
	var levelup = require('levelup');
	var db = levelup('./mydb');
	
	db.put('name', 'LevelUP', function (err) {
	
	  if (err) return console.log('Ooops!', err);
	  db.get('name', function (err, value) {
	    if (err) return console.log('Ooops!', err);
	    console.log('name=' + value)
	  });
	
	});

###MySQL
模块: mysql
安装

	$ npm install mysql
	示例
	
	var mysql      = require('mysql');
	var connection = mysql.createConnection({
	  host     : 'localhost',
	  user     : 'dbuser',
	  password : 's3kreee7'
	});
	
	connection.connect();
	
	connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
	  if (err) throw err;
	  console.log('The solution is: ', rows[0].solution);
	});
	
	connection.end();

###MongoDB
模块: mongoskin
安装
	
	$ npm install mongoskin
	示例
	
	var db = require('mongoskin').db('localhost:27017/animals');
	
	db.collection('mamals').find().toArray(function(err, result) {
	  if (err) throw err;
	  console.log(result);
	});
	If you want a object model driver for MongoDB, checkout Mongoose.
	

###Neo4j
模块: apoc
安装
	
	$ npm install apoc
	示例
	
	var apoc = require('apoc');
	
	apoc.query('match (n) return n').exec().then(
	  function (response) {
	    console.log(response);
	  },
	  function (fail) {
	    console.log(fail);
	  }
	);

###PostgreSQL
模块: pg
安装
	
	$ npm install pg
	示例
	
	var pg = require('pg');
	var conString = "postgres://username:password@localhost/database";
	
	pg.connect(conString, function(err, client, done) {
	
	  if (err) {
	    return console.error('error fetching client from pool', err);
	  }
	  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
	    done();
	    if (err) {
	      return console.error('error running query', err);
	    }
	    console.log(result.rows[0].number);
	  });
	
	});

###Redis
模块: redis
安装
	
	$ npm install redis
	示例
	
	var client = require('redis').createClient();
	
	client.on('error', function (err) {
	  console.log('Error ' + err);
	});
	
	client.set('string key', 'string val', redis.print);
	client.hset('hash key', 'hashtest 1', 'some value', redis.print);
	client.hset(['hash key', 'hashtest 2', 'some other value'], redis.print);
	
	client.hkeys('hash key', function (err, replies) {
	
	  console.log(replies.length + ' replies:');
	  replies.forEach(function (reply, i) {
	    console.log('    ' + i + ': ' + reply);
	  });
	
	  client.quit();
	
	});

###SQLite
模块: sqlite3
安装
	
	$ npm install sqlite3
	示例
	
	var sqlite3 = require('sqlite3').verbose();
	var db = new sqlite3.Database(':memory:');
	
	db.serialize(function() {
	
	  db.run('CREATE TABLE lorem (info TEXT)');
	  var stmt = db.prepare('INSERT INTO lorem VALUES (?)');
	
	  for (var i = 0; i < 10; i++) {
	    stmt.run('Ipsum ' + i);
	  }
	
	  stmt.finalize();
	
	  db.each('SELECT rowid AS id, info FROM lorem', function(err, row) {
	    console.log(row.id + ': ' + row.info);
	  });
	});

	db.close();

###ElasticSearch
模块: elasticsearch
安装
	
	$ npm install elasticsearch
	示例
	
	var elasticsearch = require('elasticsearch');
	var client = elasticsearch.Client({
	  host: 'localhost:9200'  
	});
	
	client.search({
	  index: 'books',
	  type: 'book',
	  body: {
	    query: {
	      multi_match: {
	        query: 'express js',
	        fields: ['title', 'description']
	      }
	    }
	  }
	}).then(function(response) {
	  var hits = response.hits.hits;
	}, function(error) {
	  console.trace(error.message);
	});