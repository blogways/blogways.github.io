---
layout: post
category: jQuery
title: jQuery源码解读[1] -- 总体结构及构造函数
tags: ['$','jQuery','源码','prototype','IIFE','extend']
author: 万洲
email: wanzhou@asiainfo.com
#image:
description: jQuery凭借简洁的语法和跨平台的兼容性，极大地简化了JavaScript开发开发人员遍历HTML文档、操作DOM、处理事件、执行动画和开发Ajax的操作
---

## 一、前言 ##

首先了解一下**块级作用域**与**函数作用域**：

**块级作用域**：任何一对花括号{}中的语句集都属于一个块，在这之中定义的所有变量在代码块外都是不可见的。

**函数作用域**：定义在函数中的参数和变量在函数外部是不可见的。

大家都知道`Javascript`中是没有块级作用域的，那么作为`Javascript`的一个框架，`jQuery`要应用到各种环境中，要怎么解决命名空间冲突的问题是一个关键。

### 1、立即调用函数表达式（IIFE） ###
`jQuery`源码中，你会看到如下的代码结构：
	
	(function( global, factory){
		//code
	}(typeof window !== "undefined" ? window : this, function( window, noGlobal){
		//code
		
		if ( typeof noGlobal === strundefined ) {
			window.jQuery = window.$ = jQuery;
		}
		return jQuery;
	}));
1. 这是一个`立即调用函数表达式(IIFE)`，创建一个匿名函数`function( global, factory){}`，创建完成后立即传递参数并运行。
2. 在函数名后面直接加一对`()`表示调用该函数,

		function fn( a, b ){};
		fn();	//调用函数
	而IIFE只是将分开的两步作为一步来书写，
	
		( function( a, b ){
			//code
		}( x, y ) );
	这就叫做`立即调用函数表达式(IIFE)`。此外，还有另一种书写方式：
	
		(functioin( a, b ){
			//code
		})( x, y );
3. 通过定义一个`IIFE`，相当于创建了一个“私有”的命名空间，该命名空间中的**所有变量和方法**只为自己所有，如不进行特殊处理，函数外无法访问这些变量及方法，不会破坏全局的命名空间，达到了与`块级作用域`一样的效果。
4. 提及`立即调用函数表达式()IIFE)`，你会发现一个非常有趣的事实，测试代码如下：

		$(document).ready(function(){
			(function(){
				undefined = "now it's defined";
				alert(undefined);
				alert(typeof undefined);
			})();
			//会弹出警示框，now it's defined   ;   string
		});
	感兴趣的话可以将代码代码复制到**[JSFiddle.net][]**自己测试一下。结果是只有firefox的测试结果为`undefined`，其他主流浏览器都显示为`now it's defined`。
	
	鉴于上面出现的问题，所以在`jQuery`源码中用了`strundefined = typeof undefined;`在未来得及更改`undefined`之前为其创建一个不可变的常数副本。
	
5. `window.jQuery = window.$ = jQuery;`通过此代码，将`jQuery`和`$`标示符暴露给`window`，最后`return jQuery;`返回jQuery实例供外部使用。
	
[JSFiddle.net]: http://jsfiddle.net

## 二、代码结构 ##
### 1、jQuery源码结构 ###
`jQuery`源码中，从前到后代码实现的功能如下：

	(function( global, factory){
		//code
	}(typeof window !== "undefined" ? window : this, function( window, noGlobal){
		
		jQuery = function( selector, context ) {
			return new jQuery.fn.init( selector, context );
		};
		
		jQuery.fn = jQuery.prototype = {
			// Code
		};
		
		jQuery.extend = jQuery.fn.extend = function() {
			// Code
		};
		
		jQuery.extend({
			//Code
		});
		// jQuery选择器引擎
		var Sizzle = (function( window ){
			// Code
			// 使用立即调用函数表达式(IIFE)，生成Sizzle
		})( window );
		
		init = jQuery.fn.init = function( selector, context ) {
			// Code
		}
		// Give the init function the jQuery prototype for later instantiation
		init.prototype = jQuery.fn;
		
		// DOM遍历方法
		
		// Callback及Deferred，回调函数及延迟方法
		
		// Support 浏览器测试
		
		// Data 数据缓存；
		
		// Queue 队列操作；
		
		// Event 事件处理；浏览器兼容处理
		
		// DOM 操作方法；DOM节点插入方法；
		
		// CSS
		
		// FX 动画
		
		// Attr 特性与属性（attr、prop、class）
		
		// 异步请求 AJAX
		
		// 位置坐标、窗口视口大小
		
		
		return jQuery;
	}));	
以上为`jQuery`源码的大致的代码结构，从中可以看出代码结构非常清晰、条理明确，以上为`jquery-1.11.1.js`版本当中的代码结构。

## 三、源码分析 ###
### 1、构造jQuery对象
在我们使用`jQuery`的时候，并没有像`javascript`一样，

	// js									// jquery
	var jq = function(){					$(document).ready(...);
		// constructor 构造器				$.getJSON(...);
	};										$.ajax(...);
	
	jq.prototype = {
		// prototype 原型
		find: function(){},
		show: function(){}
	};
	
	var jq1 = new jq();
	jq1.find();
`jQuery`没有通过`new`来创建实例，按照我们的书写方式，那么`$()`应该返回的是一个`jQuery`的实例对象，源码中的实现方式如下：

	jQuery = function( selector, context ) {
		return new jQuery.fn.init( selector, context );
	};
		（）
	jQuery.fn = jQuery.prototype = {
		// Code
	};
通过将`jQuery`类当作一个工厂方法来创建实例，将该创建方法放到`prototype`原型当中，那么在我们调用的时候就不必通过`new`关键字来创建了，直接调用`jQuery( selector, context )`。

如果直接将创建方法`init`放到`prototype`当中:

	jQuery = function( selector, context ) {
		return new jQuery.prototype.init( selector, context );
	};
		
	jQuery.fn = jQuery.prototype = {
		init: function(){
			this.age = 23;
			return this;	// 返回jQuery实例对象
		},
		age: 18
		// code
	};
	jQuery().age	// 23
如上所示，因为使用的时工厂模式来创建并返回一个`jQuery`的实例，那么`init`中`return this;`的`this`就表示当前实例（`jQuery`对象的实例），这久导致了一个严重的问题，`init`方法当中指像直接的`this`没有了。

实际的情况是，内部的`this`会覆盖上传的，因此返回的对象不是一个代表`jQuery`的实例，而是一个`init`的实例，所以`jQuery.age`的值不是18，而是23.

因为`init`和`jQuery`的**作用域相同**（都为`jQuery.prototype.init`）才会导致上面情况的发生，在源码中的解决方式是将`jQuery`的作用域挂载到`jQuery.fn.init`当中，

	jQuery.fn = jQuery.prototype = {
		// code
	};
	init = jQuery.fn.init = function( selector, context ) {
		// Code
	}
	init.prototype = jQuery.fn;
首先执行`jQuery.fn = jQuery.prototype`，再执行`(jQuery.fn.)init.prototype = jQuery.fn;`，在执行那个这些语句后，挂载到`jQuery.fn.init`上就相当于挂载到了`jQuery.prototype.init`，即挂载到了`jQuery`函数上。

最后的结果是挂载到了我们最终使用的`jQuery`对象实例上，`jQuery.fn.init`是实际上创建`jQuery`实例对象的地方。

### 2、jQuery.extend和jQuery.fn.extend ###
合并两个或更多对象的属性到第一个对象中，`jQuery`中后续的**大部分功能**都时通过该函数进行扩展，通过`jQuery.fn.extend`扩展的函数，大部分都会调用通过`jQuery.extend`扩展的同名函数。函数原型如下：

	.extend( target, object1, object2, ... )
	.fn.extend( target, object1, object2, ... )
 
1. 如果传入两个或多个对象，所有对象的属性会被添加到第一个对象`target`中，
2. 如果只传入一个对象，则将对象的属性添加到`jQuery`对象中。

用这种方式，我们可以为`jQuery`命名空间增加新的方法。可以用于编写`jQuery`插件，如果不想改变传入的对象，可以传入一个空对象：`$.extend({}, object1, object2, ... );`.

* 默认合并操作是不迭代的，即便`target`的某个属性是对象或属性，也会被完全覆盖而不是合并
* 第一个参数是`true`，则会迭代合并
* 从`object`原型继承的属性会被拷贝
* `undefined`值不会被拷贝
* 因为性能原因，`JavaScript`自带类型的属性不会合并

更详细讲解请参考[jQuery.extend 函数详解][] ！
[jQuery.extend 函数详解]: http://www.cnblogs.com/RascallySnake/archive/2010/05/07/1729563.html

### 3、jQuery.extend 示例 ####
#### 1）$.extend(object) / $.extend( target, obj1, obj2, ... )####
`$.extend( object )`方法就是将`object`合并到`jQuery`的**全局对象**中去，如：

	$.extend({
  		sum: function( a, b ){ 
  			return a + b;
  		}
  	});
将`sum`方法扩展到`jQuery`的全局方法中去，类似于`C/C++`、`JAVA`当中的静态方法。

`$.extend( target, obj1, obj2, ... )`方法将`obj1, obj2, ...`合并到`target`当中，如：

	var result = $.extend( {}, { name: 'A', age: 20}, {name: 'B', gender: 'female'} );
	// result = { name: 'B', age: 20, gender: 'female'};
	// 此处target为 {} ,将obj1，obj2合并到一个新的对象中
	// 在不希望改变target的情况下使用
	
#### 2) $.fn.extend(obj) ####
`$.fn.extend( object )`方法是讲`object`合并到`jQuery`的**实例对象**中去。

类似`C/C++`、`JAVA`中**类的方法**，只有`jQuery`的实例可以调用！

===

**未完待续。。。**
