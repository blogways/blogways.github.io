---              
layout: post
category: Node.js
title: EventProxy在node的应用
tags: ['node', 'EventProxy']
author: 汤仕忠
email: tangsz@asiainfo-linkage.com
#image:
description: EventProxy是一个简单的事件侦听者模式的实现，由于底层实现跟Node.js的EventEmitter不同，无法合并进Node.js中。但是却提供了比EventEmitter更强大的功能，且API保持与EventEmitter一致，与Node.js的思路保持契合，并可以适用在前端中。


---
## 一、EventProxy简介
EventProxy作者 田永强，新浪微博@朴灵，前端工程师，曾就职于SAP，现就职于淘宝，花名朴灵，致力于NodeJS和Mobile Web App方面的研发工作。EventProxy 仅仅是一个很轻量的工具，但是能够带来一种事件式编程的思维变化。有以下几个特点：

1.利用事件机制解耦复杂业务逻辑；

2.移除被广为诟病的深度callback嵌套问题；

3.将串行等待变成并行等待，提升多异步协作场景下的执行效率；

4.友好的Error handling；

5.无平台依赖，适合前后端，能用于浏览器和Node.js；

6.兼容CMD，AMD以及CommonJS模块环境。


### 二、安装

通过NPM安装即可使用：$ npm install eventproxy

调用:var EventProxy = require('eventproxy');


### 三、使用

这里只简单介绍EventProxy在node环境中的应用，至于前端及其他环境使用见：https://github.com/JacksonTian/eventproxy。


1.过去异步的I/O操作时，很容易会写成回调函数深度嵌套，如下：

    var add= function (v1, v2, v3){
       console.log(v1+v2+v3+'');
    };

    var value1,value2,value3

    clinet.get("key1", function (err, data) {
        // do something
         value1 = data

        clinet.get("key2", function (err, data) {
            // do something
            value2=data
            clinet.get("key3", function (err, data) {
                //do something
                 value3 = data
                add(value1, value2, value3);
            });

        });

    });


2.使用EventProxy后可以更多关心业务，去掉深度嵌套，并且在一些情况下显著提高效率


     var EventProxy = require('./eventproxy');
 	 var proxy = new EventProxy();
     var add= function (v1, v2, v3){
       console.log(v1+v2+v3+'');
     };

     proxy.assign("v1", "v2", "v3", add);
     clinet1.get("key1", function (err, data) {
        //do something
        proxy.trigger("v1", data);

     });

     clinet2.get("data", function (err, data) {
        //do something
        proxy.trigger("v2", data);

     });

     clinet3.get("l10n", function (err, data) {
        //do something
        proxy.trigger("v3", data);

     });


3.EventProxy在日志分析系统中的应用

  以下为日志系统中服务启动加载菜单的程序：

	var fs = require('fs')，
    EventProxy = require('eventproxy').EventProxy;


    exports.loadMenu = function(dir,cb){
       	
    var proxy = new EventProxy();
	  proxy.assign('menus', cb);
    fs.readdir(dir, function(err, files) {

        var menusTemp = [];
        if(err) {
            throw new Error(err);
        }

        files.forEach(function(filename) {
            if(filename.substring(filename.length-3) == '.js'){
                var filepath = [ dir, filename ].join('/');
                var tmp = require(filepath);
                for (m in tmp){
                    menusTemp.push(tmp[m]);
                }
            }
        });  
             
        proxy.trigger('menus', menusTemp);
     }); 
    }

其中loadMenu是在服务启动是被调用，传入的参数为菜单文件路径、回调函数，程序首先通过
proxy.assign('menus', cb);监听menus，在程序读取完菜单文件后调用 proxy.trigger('menus', menusTemp);触发cb回调函数，参数为menusTemp。