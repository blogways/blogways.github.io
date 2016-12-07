---
layout: post
title: nodejs的异步流程控制
category: ['nodejs']
tags: ['nodejs', 'async']
author: 陈凡
email: chenfan@asiainfo.com
description: nodejs的异步流程控制
---

|  |  *目 录* |
| --- | --- |
| 1 | [为什么使用异步流程控制](#begin) |
| 2 | [Async的介绍和安装](#1st) |
| 3 | [Async的函数介绍](#2nd) |
| 4 | [使用案例](#3rd) |
| 5 | [总结与心得](#end) |

<a id="begin"></a>

## 1.为什么使用异步流程控制

“流程控制”本来是件比较简单的事，但是由于Nodejs的异步架构的实现方法，对于需要同步的业务逻辑，实现起来就比较麻烦。嵌套3-4层，代码就会变得的支离破碎了！
如何让代码看起来简介，而且过程可控，这里我们就需要引入异步流程控制。

<a id="1st"></a>

## 2.Async的介绍和安装

Async是一个流程控制工具包，提供了直接而强大的异步功能。基于Javascript为Node.js设计，同时也可以直接在浏览器中使用。

Async提供了大约20个函数，包括常用的 map, reduce, filter, forEach 等，异步流程控制模式包括，串行(series)，并行(parallel)，瀑布(waterfall)等。

(1). 安装环境

Npm:1.2.19<br>

nodejs

(2) 安装方式

npm install async

<a id="2nd"></a>

## 3.Async的函数介绍

**async主要实现了三个部分的流程控制功能：**

<ul>
<li>集合: Collections</li>
<li>流程控制: Control Flow</li>
<li>工具类: Utils</li>
</ul>

1). 集合: Collections

each: 如果想对同一个集合中的所有元素都执行同一个异步操作。

**map**: 对集合中的每一个元素，执行某个异步操作，得到结果。所有的结果将汇总到最终的callback里。与each的区别是，each只关心操作不管最后的值，而map关心的最后产生的值。

**filter**: 使用异步操作对集合中的元素进行筛选, 需要注意的是，iterator的callback只有一个参数，只能接收true或false。

**reject**: reject跟filter正好相反，当测试为true时则抛弃

**reduce**: 可以让我们给定一个初始值，用它与集合中的每一个元素做运算，最后得到一个值。reduce从左向右来遍历元素，如果想从右向左，可使用reduceRight。

**detect**: 用于取得集合中满足条件的第一个元素。

**sortBy**: 对集合内的元素进行排序，依据每个元素进行某异步操作后产生的值，从小到大排序。

**some**: 当集合中是否有至少一个元素满足条件时，最终callback得到的值为true，否则为false。

**every**: 如果集合里每一个元素都满足条件，则传给最终回调的result为true，否则为false。

**concat**: 将多个异步操作的结果合并为一个数组。

2). 流程控制: Control Flow

**series**: 串行执行，一个函数数组中的每个函数，每一个函数执行完成之后才能执行下一个函数。

**parallel**: 并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。

**whilst**: 相当于while，但其中的异步调用将在完成后才会进行下一次循环。

**doWhilst**: 相当于do…while, doWhilst交换了fn,test的参数位置，先执行一次循环，再做test判断。

**until**: until与whilst正好相反，当test为false时循环，与true时跳出。其它特性一致。

**doUntil**: doUntil与doWhilst正好相反，当test为false时循环，与true时跳出。其它特性一致。

**forever**: 无论条件循环执行，如果不出错，callback永远不被执行。

**waterfall**: 按顺序依次执行一组函数。每个函数产生的值，都将传给下一个。

**compose**: 创建一个包括一组异步函数的函数集合，每个函数会消费上一次函数的返回值。把f(),g(),h()异步函数，组合成f(g(h()))的形式，通过callback得到返回值。

**applyEach**: 实现给一数组中每个函数传相同参数，通过callback返回。如果只传第一个参数，将返回一个函数对象，我可以传参调用。

**queue**: 是一个串行的消息队列，通过限制了worker数量，不再一次性全部执行。当worker数量不够用时，新加入的任务将会排队等候，直到有新的worker可用。

**cargo**: 一个串行的消息队列，类似于queue，通过限制了worker数量，不再一次性全部执行。不同之处在于，cargo每次会加载满额的任务做为任务单元，只有任务单元中全部执行完成后，才会加载新的任务单元。

**auto**: 用来处理有依赖关系的多个任务的执行。

**iterator**: 将一组函数包装成为一个iterator，初次调用此iterator时，会执行定义中的第一个函数并返回第二个函数以供调用。

**apply**: 可以让我们给一个函数预绑定多个参数并生成一个可直接调用的新函数，简化代码。

**nextTick**: 与nodejs的nextTick一样，再最后调用函数。

**times**: 异步运行,times可以指定调用几次，并把结果合并到数组中返回。

**timesSeries**: 与time类似，唯一不同的是同步执行

3). 工具类: Utils

**memoize**: 让某一个函数在内存中缓存它的计算结果。对于相同的参数，只计算一次，下次就直接拿到之前算好的结果。

**unmemoize**: 让已经被缓存的函数，返回不缓存的函数引用。

**log**: 执行某异步函数，并记录它的返回值，日志输出。

**dir**: 与log类似，不同之处在于，会调用浏览器的console.dir()函数，显示为DOM视图。

**noConflict**: 如果之前已经在全局域中定义了async变量，当导入本async.js时，会先把之前的async变量保存起来，然后覆盖它。仅仅用于浏览器端，在nodejs中没用，这里无法演示。


<a id="3rd"></a>

## 3.Async的使用案例

### 1. series(tasks, [callback]) （多个函数依次执行，之间没有数据交换）

        var async = require('async')
        async.series([
           step1, step2, step3
        ], function(err, values) {
           // do somethig with the err or values v1/v2/v3
        });

（1）依次执行一个函数数组中的每个函数，每一个函数执行完成之后才能执行下一个函数。

（2）如果任何一个函数向它的回调函数中传了一个error，则后面的函数都不会被执行，并且将会立刻会将该error以及已经执行了的函数的结果，传给series中最后那个callback。

（3）当所有的函数执行完后（没有出错），则会把每个函数传给其回调函数的结果合并为一个数组，传给series最后的那个callback。

（4）还可以json的形式来提供tasks。每一个属性都会被当作函数来执行，并且结果也会以json形式传给series最后的那个callback。这种方式可读性更高一些。

### 2. parallel(tasks, [callback]) （多个函数并行执行）

    async.parallel([
        function(cb) { t.fire('a400', cb, 400) },
        function(cb) { t.fire('a200', cb, 200) },
        function(cb) { t.fire('a300', cb, 300) }
    ], function (err, results) {
        log('1.1 err: ', err); // -> undefined
        log('1.1 results: ', results); // ->[ 'a400', 'a200', 'a300' ]
    });
    
（1）并行执行多个函数，每个函数都是立即执行，不需要等待其它函数先执行。传给最终callback的数组中的数据按照tasks中声明的顺序，而不是执行完成的顺序。

（2）如果某个函数出错，则立刻将err和已经执行完的函数的结果值传给parallel最终的callback。其它未执行完的函数的值不会传到最终数据，但要占个位置。

（3）同时支持json形式的tasks，其最终callback的结果也为json形式

### 3. waterfall(tasks, [callback]) （多个函数依次执行，且前一个的输出为后一个的输入）

    async.waterfall([
        function(cb) { log('1.1.1: ', 'start'); cb(null, 3); },
        function(n, cb) { log('1.1.2: ',n); t.inc(n, cb); },
        function(n, cb) { log('1.1.3: ',n); t.fire(n*n, cb); }
    ], function (err, result) {
        log('1.1 err: ', err); // -> null
        log('1.1 result: ', result); // -> 16
    });
    
（1）与seires相似，按顺序依次执行多个函数。不同之处，每一个函数产生的值，都将传给下一个函数。如果中途出错，后面的函数将不会被执行。错误信息以及之前产生的结果，将传给waterfall最终的callback。

（2）这个函数名为waterfall(瀑布)，可以想像瀑布从上到下，中途冲过一层层突起的石头。注意，该函数不支持json格式的tasks。

### 4.auto(tasks, [callback]) （多个函数有依赖关系，有的并行执行，有的依次执行）

这里假设我要写一个程序，它要完成以下几件事：
从某处取得数据
<ol>
<li>在硬盘上建立一个新的目录</li>

<li>将数据写入到目录下某文件</li>

<li>发送邮件，将文件以附件形式发送给其它人</li>
</ol>
分析该任务，可以知道1与2可以并行执行，3需要等1和2完成，4要等3完成。

    async.auto({
        getData: function (callback) {
            setTimeout(function(){
                console.log('1.1: got data');
                callback();
            }, 300);
        },
        makeFolder: function (callback) {
            setTimeout(function(){
                console.log('1.1: made folder');
                callback();
            }, 200);
        },
        writeFile: ['getData', 'makeFolder', function(callback) {
            setTimeout(function(){
                console.log('1.1: wrote file');
                callback(null, 'myfile');
            }, 300);
        }],
        emailFiles: ['writeFile', function(callback, results) {
            log('1.1: emailed file: ', results.writeFile); // -> myfile
            callback(null, results.writeFile);
        }]
    }, function(err, results) {
        log('1.1: err: ', err); // -> null
        log('1.1: results: ', results); // -> { makeFolder: undefined,
                                        //      getData: undefined,
                                        //      writeFile: 'myfile',
                                        //      emailFiles: 'myfile' }
    });
    
（1）用来处理有依赖关系的多个任务的执行。比如某些任务之间彼此独立，可以并行执行；但某些任务依赖于其它某些任务，只能等那些任务完成后才能执行。

（2）虽然我们可以使用async.parallel和async.series结合起来实现该功能，但如果任务之间关系复杂，则代码会相当复杂，以后如果想添加一个新任务，也会很麻烦。这时使用async.auto，则会事半功倍。

（3）如果有任务中途出错，则会把该错误传给最终callback，所有任务（包括已经执行完的）产生的数据将被忽略。

<a id="end"></a>

## 5.总结与心得

在凤来平台开发过程，对于数据库连续操作，由于nodejs异步的原因，我们不好对结果出现的顺序进行控制，或者回调函数使用过多，维护起来十分麻烦，使用异步操作可以很方便的解决开发过程中出现的一系列问题。
