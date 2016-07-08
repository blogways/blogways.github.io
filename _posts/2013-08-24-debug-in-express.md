---
layout: post
category: 杂记
title: 关于express用到的日志库debug的知识点滴
tags: ['nodejs', 'express', 'debug']
author: 唐 治
email: tangzhi@asiainfo-linkage.com
description: 关于express用到的日志库debug的知识点滴

---

使用过`connect`或者`express`的同学必须要知道`debug`。这三个的主要作者都是同一个人。

`debug`模块使用起来很方便，可以分为下面三步：

1. **在程序中引入`debug`时，需要配置一个日志名字空间。**如下：

        var debug = require('debug')('namespace')
   
1. **代码中使用`debug`打印日志。** 
    debug的内核是使用`console.error`来打印日志的。所以，`console`支持的通配符`debug`都可以使用，比如`'%s'`、`'%j'`等等。打印`json`数据就可以使用通配符`%j`，比如：
    
        debug("obj:%j", {name:'test'})
 
    但是，使用通配符`%j`打印出来的`json`格式不太漂亮，看不出缩进。如果为了方便阅读，也可以使用`nodeJS`的自带模块`util`，举例如下：
    
        util = require('util')
        debug("object:%s", util.inspect(obj))
        
    这种方式打印出来的`json`对象，其格式缩进有度，很容易查看。
    
    
1. **配置环境变量`DEBUG`.**如果仅做了上面两步，运行时默认是没有日志的，必须配置环境变量`DEBUG`.比如：

        export DEBUG=connect*,express*
        export DEBUG=*,-send,-connect:dispatcher
        
    需要简单说明一下，多个日志名字空间可以使用`,`号或空格分隔，也支持使用`*`号来进行通配。日志名字空间前加`-`号，标记不打印该类型日志。
    
    
### 上面内容是不是很简单，那就试试吧！