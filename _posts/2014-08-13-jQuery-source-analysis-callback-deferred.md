---
layout: post
category: jQuery
title: jQuery源码解读[4] -- Callbacks和Deferred介绍
tags: ['$', 'jQuery', '源码', 'Callbacks','Deferred', '回调','延迟']
author: 万洲
email: wanzhou@asiainfo.com
#image:
description: jQuery.Callbacks()是在版本1.7中新加入的。它是一个多用途的回调函数列表对象，提供了一种强大的方法来管理回调函数队列。Deferred对象就是jQuery的回调函数解决方案,其含义就是"延迟"到未来某个点再执行。
---

## 一、前言 ##
### 1、jQuery.Callbacks ###

首先，来考虑一个问题，我们想让某些函数按照先后顺序执行，你最先想到的是什么？队列？那让我们来看一下用队列函数来实现，


	function fnLikeQueue( fnList, callback){
        var fnTask;
        while(fnList.length > 0){
            fnTask = fnList.shift();
            fnTask(); 	// 执行函数
        }
        callback();
    };
    fnLikeQueue( [function(){
            alert('one');
        }, function(){
            alert('two');
        }, function(){
            alert('three');
        }], function(){
            alert('I\'m a callback');
    });
 
运行上面代码将会顺序弹出警示框，显示，
 
 	one,two,three,i'm a callback
 
这种方法要判断函数序列的长度，每次运行还要取出一个函数在执行，而且向函数序列中添加新的函数也不是很方便，直观感觉不是很Fashion，现在来试试`jQuery.Callbacks`，
 
	var callbacks = $.Callbacks();
	callbacks.add(function() {
    	alert('one');
    });
    callbacks.add(function() {
    	alert('two');
    });
    callbacks.fire(); 	// 显示 'one', 'two'
    
使用起来要便捷很多，代码又很清晰，所以`jQuery.Callbacks`是一个多用途的回调函数列表对象，提供了一种强大的方法来管理回调函数队列。
 
### 2、Deferred ###
 
实际开发过程中，我们经常遇到某些耗时很长的JavaScript操作，其中既有异步的操作（比如ajax读取服务器数据），也有同步的操作（比如遍历一个大型数组），我们不可能等待这些操作完成，然后再继续后面的操作。

通常的做法是，为它们指定回调函数（Callback），即规定当操作执行完毕后，应该执行的某些动作。

但是，在回调函数方面，jQuery的功能非常弱。为了改变这一点，jQuery开发团队就设计了Deferred对象，简单说，Deferred对象就是jQuery的**回调函数解决方案**，其含义是"延迟"到未来某个点再执行。

通过调用`$.Deferred()`构造函数可以创建一个新的延迟对象，每个延迟对象都会向其它代码**承诺**（promise）提供数据，对于任何延迟对象，调用它的`.promise()`方法可以取得其承诺对象，通过调用其承诺对象的相应方法，可以添加承诺兑现时调用的处理程序：

* 通过`.done()`方法添加的处理程序会在延迟对象被 **成功解决** 之后调用；
* 通过`.fail()`方法添加的处理程序会在延迟对象被 **拒绝** 之后调用；
* 通过`.always()`方法添加的处理程序会在延迟对象完成其任务（**无论解决还是拒绝**）时调用。

首先，看下jQuery中Ajax的传统写法，

	$.ajax({
		url: 'index.html',
		success: function(){
			alert('Done!');
		},
		error:function(){
			alert('Fail!');
		}
	});
其中success为请求成功后调用的操作，而error是请求失败后执行的操作，而在有了Deferred对象之后，就不需要像上面一样，再在ajax的请求选项中编写很多很长的操作，如：

	$.ajax('index.html')
	 .done(function(){  alert('Done!');  })
	 .fail(function(){  alert('Fail!');  });

可以看到，done()相当于success方法，fail()相当于error方法。采用连缀写法以后，大大提高了代码的可读性。

## 二、jQuery.Callbacks源码分析 ##
### 1、函数原型介绍 ###
 
在下面的代码中，可以看懂Callbacks的原型中需要传递一个参数options，一个由空格分开选项的可选项列表，常用的参数：

* **once**:   确保这个回调列表只执行（ .fire() ）一次(像一个递延 Deferred).
* **memory**: 保持以前的值，将添加到这个列表的后面的最新的值立即执行调用任何回调 (像一个递延 Deferred).
* **unique**: 确保一次只能添加一个回调(所以在列表中没有重复的回调).
* **stopOnFalse**: 当一个回调函数返回false 时中断调用

`jQuery.Callbacks`是在jQuery内部使用，如为`.ajax`，`$.Deferred`等组件提供**基础功能**的函数，在jQuery引入了Deferred对象（异步列队）之后，jQuery内部基本所有有异步的代码都被promise所转化成同步代码执行。

`jQuery.Callbacks`的函数原型，如下所示：
	
	jQuery.Callbacks = function( options ) {
    
    	// 在需要的情况下，将字符串格式选项转换成对象格式，
    	// 在转换时会优先检测缓存
    	options = typeof options === "string" ?
    		( optionsCache[ options ] || createOptions( options ) ) :
    		jQuery.extend( {}, options );
    
    	var 
    		firing, 	// 标记当前Callbacks列表是否正在运行
    		// Last fire value (for non-forgettable lists)
    		// 
    		memory,
    		fired,  // 标记是否Callbacks列表是否已经执行
    		firingLength,  // Callbacks运行时，循环结束位置
    		firingIndex,  // 当前正在运行的Callbacks的索引（下标）
    		
			// Callbacks列表运行时，开始循环的第一个回调函数
    		// 供add和fireWith方法使用
       		firingStart,        		       		
    		list = [],  // 实际的回调函数列表
    		
    		// 只有在选项没有设置为once时，stack才存在 
			// stack用来存储参数信息（此时函数列表已经处于firing状态，
			// 必须将其他地方调用fire时的参数存储，之后再至此执行fire
    		stack = !options.once && [],
    		
    		// 用给定的参数调用所有的回调函数
    		fire = function( data ) {},
    		// 实际的 Callbacks 对象
    		self = {
    			// 回调列表中添加一个回调函数或回调函数的集合
    			add: function() {},

    			// 从回调列表中的删除一个回调函数或回调函数集合
    			remove: function() {},
    			
    			// 返回是否列表中已经拥有一个相同的回调函数
    			has: function( fn ) {},
    			
    			// 从列表中删除所有的回调函数
    			empty: function() {},
    			
    			// 禁用列表中的回调函数
    			disable: function() {},
    			
    			// 确定列表是否已被禁用
    			disabled: function() {},
    			
    			// 锁定当前状态的回调函数列表
    			lock: function() {},
    			
    			// 确定回调函数列表是否已被锁定
    			locked: function() {},
    			
    			// 访问给定的上下文和参数列表中的所有回调函数
    			fireWith: function( context, args ) {},
    			
    			// 用给定的参数调用所有的回调函数
    			fire: function() {},    			
    			// 判断回调函数是否被已经被调用了至少一次
    			fired: function() {}
    		};
    	return self;
    };

### 2、add、fire源码分析 ###

`$.Callbacks().add( callbacks )`的源码如下所示，

	add: function() {
    	if ( list ) {
    		var start = list.length;	// 保存当前list长度
    		(function add( args ) {
    			jQuery.each( args, function( _, arg ) {
    				var type = jQuery.type( arg );
    				// 如果传递过来的参数是函数，
    				// 没有设置‘unique’，则将传递过来的回调函数直接push到列表中
    				// 如果设置了‘unique’，则判断现在列表中是否已存在，
    				// 若不存在，则直接push到Callbacks列表
    				if ( type === "function" ) {
    					if ( !options.unique || !self.has( arg ) ) {
    						list.push( arg );
    					}
    				} else if ( arg && arg.length && type !== "string" ) {
    					// 如果传递过来的时一个数组，则递归调用add实现回调函数的添加
    					add( arg );
    				}
    			});
    		})( arguments );
    		    		
    		// 当回调函数正在执行时，则修改firingLength，确保当前添加的回调函数能够被执行
    		if ( firing ) {
    			firingLength = list.length;

    		// 如果不是firing状态，并且设置了memory
    		//（肯定是在fired状态时才会执行这一步，因为memory是在fire一次后才会被赋值） 
			// 此时memory已经是上次fire是传递的参数，
			// 那么将会直接执行刚添加的函数集，而无需fire 
    		} else if ( memory ) {
    			firingStart = start;
    			fire( memory );
    		}
    	}
    	return this;
    }

当开发人员通过`.add( callbacks )`向回调函数列表添加回调函数时，在函数内直接将参数传递给一个`立即调用函数表达式(IIFE)`，根据传递参数的类型，采取不同的方式将其添加到回调列表中去。

这里需要注意的一处是，

	if ( !options.unique || !self.has( arg ) ) {
		list.push( arg );
    }
它隐含的表达了两个判断，

1. 是否设置了“unique”；
2. 在设置了“unique”的前提下，判断是否在回调列表中存在，

使用一般的函数语句，通常是：

	if( !options.unique ){
		// push
	}else if(!self.has( arg )){
		push
	}

前面也有提到，像源码中的这种书写方式，看起来非常的简洁，唯一的不好就是阅读起来不是很方便。
</br>

===

**`fire`**方法，外部调用此方法是，jQuery内部的调用方向为，

	self.fire --> self.fireWith --> file

在前面的Callbacks函数原型中介绍过，self是真正的Callbacks对象，也就是我们使用是调用的Callbacks对象就是self，那么这里的self.fire和self.fireWith只是Callbacks对外提供的方法，而实际上实现fire功能的是Callbacks内部私有的`fire`方法，也就是此处要讲的源码，如：

	// 运行回调函数列表
	fire = function( data ) {
		// 如果参数memory为true，则记录data
		memory = options.memory && data;
		fired = true; 	// 标记运行回调函数
		firingIndex = firingStart || 0;
		firingStart = 0;
		firingLength = list.length;
		firing = true; 	// 标记正在运行回调函数
		
		for ( ; list && firingIndex < firingLength; firingIndex++ ) {
			if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false 
							&& options.stopOnFalse ) {
				memory = false; 	// 阻止未来可能由于add所产生的回调
				break; 	// 由于参数options设置了stopOnFalse，
				// 所有当有回调函数运行结果为false时，退出循环
			}
		}
		// 标记结束运行回调
		firing = false;
		if ( list ) { 	// 如果Callbacks列表存在
			if ( stack ) { 	// stack存在
				
				// stack不为空，即stack中存有参数信息，
				// 当firing在运行时，通过add添加的Callbacks都将保存到stack中
				if ( stack.length ) {
					//从stack中取出，递归fire执行stack中的Callbacks
					fire( stack.shift() );
				}
			} else if ( memory ) {
				list = [];
			} else {
				// 阻止回调列表中的回调
				self.disable();
			}
		}
	}

其中需要注意的是，在未参数memory赋值时，

	memory = options.memory && data;
	
执行此语句后，当`options.memory`的值为`true`时，memory的值是data中的值，这跟`C/C++`、`JAVA
`等语言不同，在`C/C++`、`JAVA`中，执行上面语句过后的值是一个`boolean`类型的值（true 或 false）。

在`JavaScript`中，它能完成非常‘完美’的功能，

1. 当options.memory存在时，该语句就相当于一条赋值语句`memory = data;`；
2. 当options.memory不存在时，memory值为`false`。

像这样写之后，就再也不用为写一些复杂的判断语句了，如：

	if( options.memory ){
		memory = data;
	} else {					或者  memory = options.memory ? data : false;
		memory = false;
	}
	
而且看上去非常的“**优雅**”不是么？ 当然还有`||`操作也一样，以前我们这样：

	if( options.memory ){
		memory = true;
	} else {					或者 memory = options.memory ? true : data;
		memory = data;
	}

现在我们可以这样：
	
	memory = options.memory || data;
	
你可以复制下面代码到[JSFiddle.net][]去测试一下！

	var options = true,
    data = 'I\'m a String',
    ret;
	ret = options && data; //!options && data;  //options || data; //!options || data;
	alert(ret);
	
当然，这都只能在`JavaScript`中这么写，你要是在`C/C++`、`JAVA`中也这么写，**恭喜你，慢慢调BUG吧~~**

在`fire`源码中，真正最终执行回调函数的代码是，

	list[ firingIndex ].apply( data[ 0 ], data[ 1 ] )

关于`apply`的使用，可以参考[JavaScript中，Array和Function的那些事儿][]！

### 3、示例 ###

下面是两个函数fn1和fn2：

	function fn1( value ) {
    	alert( value );
	}
 
	function fn2( value ) {
    	fn1("fn2 says: " + value);
    	return false;
	}
***$.Callbacks( 'once' )***

确保这个回调列表只执行（ .fire() ）一次。

	var callbacks = $.Callbacks('once');
	callbacks.add( fn1 );
	callbacks.fire( 'hello' );
	
	callbacks.add( fn2 );
	callbacks.fire( 'world' );

只会显示“hello”，而不会显示“world”，因为在创建Callbacks实例对象的时候，传递了参数“once”，仅运行一次，因而后面的`callbacks.fire( 'world' );`是不会执行的。

</br>

===

***$.Callbacks( 'memory' )***

保持以前的值，将添加到这个列表的后面的最新的值立即执行调用任何回调函数。

	var callbacks = $.Callbacks('memory');
	callbacks.add(function() {
    	alert('f1');
	});

	callbacks.fire(); //输出 'f1',这时函数列表已经执行完毕!

	callbacks.add(function() {
    	alert('f2');
	}); //memory作用在这里，没有fire，一样有结果: f2
	
</br>

===

***$.Callbacks( 'unique' )***

确保一次只能添加一个回调函数(所以在列表中没有重复的回调函数)

	var callbacks = $.Callbacks('unique');
	callbacks.add( fn1 ); 	// 添加成功
	callbacks.add( fn1 ); 	// 添加失败
	// 显示结果hello world
	callbacks.fire( 'hello world' );

</br>

===

***$.Callbacks( 'stopOnFlase' )***

当一个回调函数返回false 时，中断调用

	var callbacks = $.Callbacks('stopOnFalse');
	callbacks.add(f1);
	callbacks.add(function(){
		return false;
	});
	callbacks.add(f2);
	// 只显示 hello world!
	callbacks.fire( 'hello world!' );
	
</br>

## 三、Deferred源码分析 ##
### 1、函数原型介绍 ###

`通过jQuery.extend`将Deferred扩展到jQuery**全局对象**中去，扩展原理前面已经讲过，

	jQuery.extend({
		Deferred: function( fnc ){},
		// Deferred 帮助
		when: function( subordinate /* , ..., subordinateN */ ) {}
	});

首先来看下Deferred的代码结构：

	Deferred: function( func ) {
		var tuples = [
			// 动作，添加监听器，处理程序列表（回调函数列表），最终状态
			// 创建了三个$.Callbacks对象，分别表示成功、失败、处理中三种状态
			[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
			[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
			[ "notify", "progress", jQuery.Callbacks("memory") ]
		],
		state = "pending",
		promise = {
			state: function() {},
			always: function() {},
			then: function( /* fnDone, fnFail, fnProgress */ ) {},
			
			// 为当前deferred，返回一个promise对象
			// 如果传递参数obj对象给此方法，则promise将被扩展到此obj对象
			promise: function( obj ) {}
		},
		deferred = {};
		
		// 增加一组特定的方法
		jQuery.each( tuples, function( i, tuple ) {
			deferred[ tuple[0] + "With" ] = list.fireWith;
		}

		return deferred;
	}

Deferred实例的创建，跟Callbacks的雷士，调用一个函数，然后返回的是内部构建的Deferred对象，创建了一个promise对象，具有state、always、then、primise方法，扩展primise对象生成最终的Deferred对象，返回该对象。

### 2、源码分析 ###

Deferred部分源码，如下所示：

	jQuery.each( tuples, function( i, tuple ) {
		var list = tuple[ 2 ],
			stateString = tuple[ 3 ];

		// 通过下面的语句，实现对应的将$.Callbacks实例对象，
		// 绑定到promise对象上
		promise[ tuple[1] ] = list.add;

		// 处理状态
		if ( stateString ) {
			list.add(function() {
				// state = [ resolved | rejected ]
				state = stateString;

			// 默认会预先向doneList,failList中的list添加三个回调函数
			}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
		}

		// deferred[ resolve | reject | notify ]
		deferred[ tuple[0] ] = function() {
			deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
			return this;
		};
		deferred[ tuple[0] + "With" ] = list.fireWith;
	});
	
	// 将promise对象合并到deferred对象中
	// 使用的是promise.promise( obj )，通过调用jQuery.extend扩展
	// promise( obj ){
	//     return obj != null ? jQuery.extend( obj, promise ) : promise;
	// }
	promise.promise( deferred );
	
	return deferred;
	
源码中通过`promise[ tuple[1] ] = list.add;`将回调函数绑定到相应的promise对象上，

	promise.done = $.Callbacks("once memory").add
	promise.fail = $.Callbacks("once memory").add
	promise.progress = $.Callbacks("memory").add
	
`i ^ 1`按位异或运算，实际上第二个传参数是1、0索引对调了，所以取值是`failList.disable`与`doneList.disable`。

### 3、示例 ###

	var d = $.Deferred();
	
	setTimeout(function(){
    	    d.resolve( 'hello world' );
    },0);

	d.then( function( value ){
      console.log( value );
	});
	
当延迟对象被 resolved 时，任何通过`deferred.then`或`deferred.done`添加的处理函数，都会被调用。回调函数的执行顺序和它们被添加的顺序是一样的。传递给`deferred.resolve()`的args参数，会传给每个回调函数。当延迟对象进入`resolved`状态后，再添加的任何处理函数，当它们被添加时，就会被立刻执行，并带上传入给`.resolve()`的参数。

调用d.resolve(22) 就等于是调用，匿名函数并传入参数值"hello world"：

	function(val){
    	console.log(val); 	// 显示hello world
	}
更多关于Deferred对象的例子及讲解，请参考[jQuery的deferred对象详解][]!

</br>

[JSFiddle.net]: "http://jsfiddle.net/" "http://jsfiddle.net/"
[JavaScript中，Array和Function的那些事儿]: "/blog/2014/07/22/somethings-of-array-and-function.html" "http://www.blogways.net/blog/2014/07/22/somethings-of-array-and-function.html"
[jQuery的deferred对象详解]: "http://www.ruanyifeng.com/blog/2011/08/a_detailed_explanation_of_jquery_deferred_object.html" "http://www.ruanyifeng.com/blog/2011/08/a_detailed_explanation_of_jquery_deferred_object.html"
===

**未完待续。。。**

