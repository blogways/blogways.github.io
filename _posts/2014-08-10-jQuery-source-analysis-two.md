---
layout: post
category: jQuery
title: jQuery源码解读[2] -- 基础工具函数
tags: ['$', 'jQuery', '源码', 'prototype','extend', '工具函数']
author: 万洲
email: wanzhou@asiainfo.com
#image:
description: jQuery通过.extend和.fn.extend像jQuery的全局对象和实例对象中添工具函数，全局对象函数就像C/C++、JAVA中的静态函数，可以通过$.fnName()或者jQuery.fnName()来调用，而实例对象函数则似类中的方法，可为类的实例化对象调用，如：$(selector).fnName()或者jQuery(selector).fnName()等,本文主要叙述jQuery中扩展的工具类函数的函数原型及一些例子
---

## 一、前言 ##
前面一次讲了在`jQuery`源码中，是通过`jQuery.extend`和`jQuery.fn.extend`将后续的大部分功能进行扩展的。`jQuery.extend`扩展`jQuery`的**全局对象**，`jQuery.fn.extend`扩展`jQuery`的**实例对象**。

要了解`jQuery`工具函数的扩展，首先要了解`jQuery.extend`和`jQuery.fn.extend`的实现，便于了解其工作原理，这样在后面的学习中才不会有疑惑的地方。

### 1、jQuery.extend和jQuery.fn.extend的实现 ###
在`jquery-1.11.1.js`中，其源码如下所示：

	// .extend( [ boolean, ] target, src1, src2, ... )
	// .fn.extend( target)
	// 上面为两个函数的原型，其中extend包含一个可选的boolean型参数，其含义为是否进行深度扩展
	// 此处的target为 接受扩展 的对象
	jQuery.extend = jQuery.fn.extend = function() {
		var src, copyIsArray, copy, name, options, clone,
		
		// 若无特殊情况，参数中的第一个为target，若没有传递参数，默认为{}
		target = arguments[0] || {}, 			i = 1,
		length = arguments.length,

		// 是否进行深度复制的flag，即为参数中[ boolean ]所传递过来的值，默认为false
		deep = false; 	

		// 处理深度复制的情况，若设置了[ boolean ]，则其位置必为arguments中第一个(arguments[0])
		if ( typeof target === "boolean" ) {
			deep = target;

			// 跳过 [ boolean ] 参数，取得target扩展对象
			target = arguments[ i ] || {};
			i++;
		}

		// 处理target是一个string或其他什么（可能发生在深度复制中）
		if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
			target = {};
		}

		// 如果只有一个参数被传递过来，则扩展jQuery自己，即将target值设为this
		if ( i === length ) {
			target = this;
			i--;
		}

		for ( ; i < length; i++ ) {
			// 只处理不为空或undefined值
			if ( (options = arguments[ i ]) != null ) {
				// 扩展基础对象
				for ( name in options ) {
					src = target[ name ];
					copy = options[ name ];
	
					// 防止死循环
					if ( target === copy ) {
						continue;	// 当传递过来的参数中的所有属性及方法，
					}

					// 如果进行深度扩展，且我们正在合并的是一个纯对象或者数组，就递归调用
					if ( deep && copy && ( jQuery.isPlainObject(copy) 
							|| (copyIsArray = jQuery.isArray(copy)) ) ) {
						if ( copyIsArray ) {
							copyIsArray = false;
							clone = src && jQuery.isArray(src) ? src : [];
						} else {
							clone = src && jQuery.isPlainObject(src) ? src : {};
						}
						// 别直接修改原始对象，而是使用他们的一个副本
						target[ name ] = jQuery.extend( deep, clone, copy );
					// 排除参数中的undefined值
					} else if ( copy !== undefined ) {
						target[ name ] = copy;
					}
				}
			}
		}
		// 返回修改过后的对象
		return target;
	};
源码中通过`target[ name ] = jQuery.extend( deep, clone, copy );`和`target[ name ] = copy;`来具体实现目标对象的扩展，前者在选择了深度扩展且扩展对象为数组或纯对象时，通过递归调用`jQuery.extend`实现，后者是直接赋值。

两者相同一点就是同名属性或方法的直接赋值，这就使得后面的属性或方法会**覆盖**前面或者`target`中的同名属性或方法。而当`jQuery.extend`只有一个参数的时候，会将其扩展到`jQuery`的**全局对象**或**实例对象**当中去，我们可以利用这一特性，扩展`jQuery`的功能，而实际上我们也是这么做的，这个会在后面谈到，此处不再详细说明。

## 二、工具函数 ##
### 1、工具函数的函数原型 ###
`jQuery.extend`中扩展的**全局对象**工具函数，其函数原型如下所示：

	jQuery.extend({
		// 在页面中生成一个唯一标识每一个副本jQuery
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

		// 在没有ready模块时，假定jQuery准备完成
		isReady: true,
		// 抛出指定的错误信息
		error: function( msg ) {	throw new Error( msg );    },
		// 空操作
		noop: function() {},
		isFunction: function( obj ) {}, 	// 判断参数是否为一个函数
		
		// 当Array存在判断函数时，只做一个简单的赋值引用，若无则手动创建一个
		isArray: Array.isArray || function( obj ) {},   
		
		isWindow: function( obj ) {}, 	// 判断参数是否为浏览器窗口对象window
	
		isNumeric: function( obj ) {}, 	// 判断参数是不是数值

		isEmptyObject: function( obj ) {},  // 判断参数是否是一个空对象

		// 判断参数obj是不是通过对象字面量或new Object创建的
		isPlainObject: function( obj ) {},  
	
		type: function( obj ) {},  // 返回obj类型
	
		globalEval: function( data ) {},   // 在全局上下文中，求给定的JavaScript字符串数据的值

		// 将参数字符串转换为骆驼表示法，如camelCase,nodeName等，
		// 基本上jQuery中所有的方法都是用的骆驼表示法
		camelCase: function( string ) {},	
	
		nodeName: function( elem, name ) {},	// 返回指定元素的节点名称与给定的名字是否一样

		// args 仅在each内部使用，对obj执行规定运行的函数callback
		each: function( obj, callback, args ) {},
	
		trim: function( text ) {},  // 去除参数text末尾中的空白符，包括回车、空格、制表符、换行符
	
		// results 仅在内部使用，转换一个类似数组的对象成为真正的JavaScript数组
		makeArray: function( arr, results ) {	}, 

		// 确定第一个参数在数组中的位置(如果没有找到则返回 -1 )
		inArray: function( elem, arr, i ) {},  

		merge: function( first, second ) {},  // 将两个参数合并，并返回合并后的值

		grep: function( elems, callback, invert ) {},  // 数组元素过滤筛选

		// arg 仅在内部使用，对当前集合elems中的每个元素调用callback，
		// 将返回结果作为一个新的jQuery对象
		map: function( elems, callback, arg ) {},

		// 一个对象的全局的GUID计数器
		guid: 1,

		// optionally partially applying any arguments
		// 创建一个新的，在指定上下文中执行的函数
		proxy: function( fn, context ) {},

		now: function() { return +( new Date() ); },  // 返回当前时间

		// jQuery.support is not used in Core but other projects attach their
		// properties to it so it needs to exist.
		support: support
	});
	
`jQuery.fn.extend`中扩展的**实例对象**工具函数，其函数原型如下代码所示：

	jQuery.fn.extend({
		// 返回与给定selector选择符匹配的后代元素
		find: function( selector ) {},
		// 与给定的选择符selector匹配的选中元素
		filter: function( selector ) {},
		
		not: function( selector ) {}, 	// 选中给定元素集中与给定选择符不匹配的元素

		// 根据选择符来检测匹配元素集合，如果这些元素中至少有一个元素匹配给定的参数，则返回 true
		is: function( selector ) {} 	
	});
## 三、源码分析 ##
### 1、each（ obj, callback ）遍历 ###
`jQuery`中，`each`的源码中关键代码如下所示：

	var value,
		i = 0,
		length = obj.length,
		isArray = isArraylike( obj );

		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback.call( obj[ i ], i, obj[ i ] );
				if ( value === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				value = callback.call( obj[ i ], i, obj[ i ] );

				if ( value === false ) {
					break;
				}
			}
		}
	return obj;
首先通过**数组**和**对象**两种方式来遍历参数`obj`，对`obj`中的每个元素调用`callback.call`将每个元素绑定到回调函数上执行，并返回执行结果。

当回调函数返回`false`，则停止循环。在其源码中还涉及到`callback.apply`的方式来调用回调函数，其作用于`call`一样，都是将函数绑定到另外一个对象上去运行。关于`call`与`apply`的详细说明，可以跳转到[JavaScript中，Array和Function的那些事儿][]查看详细信息！
[JavaScript中，Array和Function的那些事儿]: http://www.blogways.net/blog/2014/07/22/somethings-of-array-and-function.html "JavaScript中，Array和Function的那些事儿"

### 示例：###
测试代码如下所示：

	<html>
		<head>
			<script type="text/javascript" src="/jquery/jquery.js"></script>
			<script type="text/javascript">
				$(document).ready(function(){
					$("button").click(function(){
	    				$("li").each(function(){
	    	  				alert($(this).text())
	    				});
	  				});
				});
		</script>
		</head>
		<body>
			<button>输出每个列表项的值</button>
			<ul>
				<li>Coffee</li>
				<li>Milk</li>
				<li>Soda</li>
			</ul>
		</body>
	</html>
运行上面代码，会依次弹出三个警示框，分别显示`<li></li>`中的值。你可以到[$.each()遍历][]运行测试样例！

其中`function(){}`就是`each( obj, callback )`中的回调函数`callback`，此处只是显示列表项的值，不需要指定特定的`index`和`element`，在某些情况下需要用之来辨别当前所遍历的元素，如：

	var info = [ 
			{ "name":"aaa", "age":22, "hobby":["a","b","c"] },
			{ "name":"bbb", "age":23, "hobby":["a","b","d"] },
			{ "name":"ccc", "age":22, "hobby":["a","c","d"] } 
		];
	$.each( info, function( index, item ){
		var name = item.name,
			age = item.age,
			hobby = item.hobby;
		alert("My name is " + name + ",I am " + age + 
						" years old,my hobbies are " + hobby);
	});
上面的代码会逐条输出`info`中的信息，你可以将上面代码复制到[JSFiddle][]运行测试！

其中`index`为当前元素在`info`中的索引，`item`是对当前遍历元素的引用，因此在函数体内使用`item.name/age/hobby`即可得到当前遍历元素的值，然后通过`alert()`显示到界面。

[$.each()遍历]: http://www.w3school.com.cn/tiy/t.asp?f=jquery_traversing_each
[JSFiddle]: http://jsfiddle.net

===

**未完待续。。。**

