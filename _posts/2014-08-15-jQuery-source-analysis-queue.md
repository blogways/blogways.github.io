---
layout: post
category: jQuery
title: jQuery源码解读[6] -- Queue队列
tags: ['$', 'jQuery', '源码', 'Queue','dequeue','队列']
author: 万洲
email: wanzhou@asiainfo.com
#image:
description: jQuery提供了jQuery.queue/dequeue和jQuery.fn.queue/dequeue，实现对队列的入队、出队操作。不同于队列定义的是，jQuery.queue和jQuery.fn.queue不仅执行出队操作，返回队头元素，还会自动执行返回的队头元素
---

## 一、前言 ##

队列是一种特殊的线性表，它只允许在表的前端（front）进行删除操作，而在表的后端（rear）进行插入操作。进行插入操作的端称为队尾，进行删除操作的端称为队头.最先插入在元素将是最先被删除；反之最后插入的元素将最后被删除，因此队列又称为“***先进先出FIFO***”（First In First Out）的线性表。

jQuery提供了`jQuery.queue/dequeue`和`jQuery.fn.queue/dequeue`，实现对队列的入队、出队操作,不同于队列定义的是，`jQuery.queue`和`jQuery.fn.queue`不仅执行出队操作，返回队头元素，还会自动执行返回的队头元素。

***有一点要注意的是，在jQuery中，队列Queue只应用于动画模块！***


## 二、源码分析 ##
### 1、函数原型介绍 ###

jQuery中，队列的实际实现方式很简单，代码量也不是很大，总共就70~80行代码左右，直接通过`jQuery.extend`和`jQuery.fn.extend`分别将其实现扩展到jQuery的全局对象和实例对象中去，其函数原型，如下所示：

***jQuery.extend扩展全局对象：***

	jQuery.extend({
		
		queue: function( elem, type, data ) {},
		
		dequeue: function( elem, type ) {},
		
		_queueHooks: function( elem, type ) {}
	});

***jQuery.fn.extend扩展实例对象：***
	
	jQuery.fn.extend({
	
		queue: function( type, data ) {},
		
		dequeue: function( type ) {},
		
		clearQueue: function( type ) {},
		
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		// 当队列中指定类型的函数执行完毕后，（fx是默认的类型）
		// 返回一个解决延迟对象并完成回调函数后的promise对象，
		promise: function( type, obj ) {}
	});

从上面的代码原型可以看出，全局对象对外提供了两个API：`queue/dequeue`，这两个方法有两个作用，它们既是setter，又是getter，实例对象提供了四个API:`queue、dequeue、clearQueue、promise`。

其中实例对象的方法都是在调用全局对象的queue/dequeue方法的基础上实现的。而`jQuery.fn.extend`中扩展了promise方法，实现了对延迟对象的支持，通过在promise中创建一个Deferred实例，修改相应的方法并返回承诺（promise）。

### 2、jQuery.queue、jQuery.dequeue 源码分析 ###

***queue( elem, type, data )***

其源码，如下所示，

	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) { 	// elem必须存在，不然将没有含义
			// 改名，每个都要加上queue，用以标识不同的队列
			type = ( type || "fx" ) + "queue";
			// 取出缓存数据，即缓存队列
			queue = jQuery._data( elem, type );

			// 如果data存在，才会进行后边转换数组、入队等操作，可以加速取出整个队列
			// 如果data不存在，直接跳到执行return queue || []，
			// 就相当于一个getter方法
			if ( data ) {
				// 如果队列不存在，或者队列存在且data是一个数组
				if ( !queue || jQuery.isArray(data) ) {
					// 通过创建新的数组来实现队列
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					// 如果队列存在，这直接将传递的数据加入队列
					// queue实际是一个数组
					queue.push( data );
				}
			}
			
			// 返回队列（即入队的同时，返回整个队列）
           	// 简洁实用的避免空引用的技巧
           	// 当queue存在时，直接返回queue，否则返回[]
			return queue || [];
		}
	}

第一个参数elem是DOM元素，第二个参数type是字符串，第三个参数data可以是function或数组。前提提过它既是setter，有事getter，

* 当传递三个参数的时候（ elem，type，data ），它就是一个setter，将传递过来的数据加到队列；
* 当传递两个参数的时候（ elem，type ），他就是一个getter，将type所指定的队列数据返回。

从中可以看出，队列Queue中的数据是通过缓存数据Cache来实现的，而在实现时，调用的是`jQuery._data( elem, type, data )`来创建缓存数据Cache，通过`jQuery._data( elem, type )`来返回/读取缓存的数据，当queue存在，直接调用`queue.push( data )`将数据data加入队列。

由`type ＝ ( type || "fx" ) + "queue";`可见，队列Queue在jQuery中是专职处理fx动画的。
	
===

***dequeue( elem, type )***

匹配的元素上执行队列中的下一个函数，其源码，如下所示，

	// 出队并执行
    // 调用jQuery.queue取得整个队列，在调用shift取出第一个元素
	dequeue: function( elem, type ) {
		type = type || "fx";
		
		var queue = jQuery.queue( elem, type ), // 取得队列
			startLength = queue.length,
			fn = queue.shift(), 	// 取出队列中的第一个元素
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// 如果取出的fn是一个正在执行中标准动画fx，抛弃执行哨兵（inprogress），再取一个
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {
			// 如果是标准动画，则在队列头部增加处理中标记属性，阻止fx自动处理
			if ( type === "fx" ) {
				// 在队列头部增加inprogress标记
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			// 执行取出的fn，并传入回调函数jQuery.dequeue
           	// 可以看到fn必须是函数，否则会出错
			fn.call( elem, next, hooks );
		}
		
		// 此时的队列成为空队列，实质是一个空数组，
		if ( !startLength && hooks ) {
			// 调用队列里面的hooks（通过jQuery._removeData）
			// 删除type对应的空数组，完成队列数据的清理工作
			hooks.empty.fire();
		}
	}
	
源码中先从缓存Cache中取出队列数据，再判断队列的长度，然后通过`queue.shift();`从队列中取出队头元素，然后做好一个预处理生成下一个的next，经判断修改最后调用相应的`.call()`方法执行对头函数，在队列中所有Callbacks都执行完毕后，即`!startLength`为真时，调用hooks完成清理工作中。


## 三、示例 ##

	function fn1(){
		alert('test 1');
	};
	function fn2(){
		alert('test 2');
	};

***queue( elem, type, data )***

	// set
	var vbody = $('body');
	
	$.queue( vbody, 'test', fn1 );
	$.queue( vbody, 'test', fn2 );
	
	// get
	var q = $.queue( vbody, 'test' );
	console.log( q );  // 输出[function, function]
在Chrome的JavaScript控制台中显示，如下图所示：

![Queue get](/images/queue_get.png)

上面是将elem当作一个参数传递给queue，其实还可以不用这样写，如：

	$('body').queue( 'test', fn1 );
	$('body').queue( 'test', fn2 );
	
	$('body').queue( 'test' );
	
这种写法跟是那个面显示设置elem，所实现的功能是完全一样的!

</br>

===

***dequeue( elem, type)***

	$.dequeue( vbody, 'test' ); 	// test 1
	$.dequeue( vbody, 'test' ); 	// test 2
	
而在实际的应用当中，我们不可能为队列中每个元素进行手动的通过dequeue来调用，前面介绍dequeue的时候说过，**做好一个预处理生成下一个的next**，next方法可以让队列中中断的地方连续起来执行，不需要在手动的去允许，如：

	function fn3( next ){
		alert('test 3');
		next();
	};
	
	$.queue( vbody, 'test', fn3 );
	$.queue( vbody, 'test', fn2 );
	
	$.dequeue( vbody, 'test' ); 	// test 3  , test 2

像上面这样，只要在传入的函数的参数当中，增加一个next方法变量，然后在当前函数功能执行完成后，调用next方法，队列动画就会继续向后面进行，例如：

	var $div = $('div.testqueue');
	
	$div.css({postition: 'relative'})
		.fadeTo('fast', 0.5)
		.fadeTo('slow', 1.0)
		.slideUp('slow')
		.queue(function(next){
			$div.css({background: '#f00'});
			next();
		})
		.slideDown('slow');

像上面这样传递一个回调函数，`.queue()`方法会把该函数添加到相应元素的效果队列当中，在这个回调函数当中，改变了相应元素的背景颜色，然后调用next继续执行下面的动画，将在队列中中断的地方连接起来，如果此处不调用next方法，这动画会在此处中断，有兴趣的话可以自己去尝试一下。
	
</br>

===

**未完待续。。。**

