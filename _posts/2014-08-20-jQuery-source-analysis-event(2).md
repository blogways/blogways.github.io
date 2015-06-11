---
layout: post
category: jQuery
title: jQuery源码解读[8] -- Event事件处理（2）
tags: ['$', 'jQuery', '源码', 'Event','事件处理']
author: 万洲
email: wanzhou@asiainfo.com
#image:
description: 要在应用程序中实现交互性，必须时刻关注用户的一举一动，并对他们的操作给出响应，jQuery增强并扩展了了JavaScript的基本事件处理机制，很好的实现了开发人员在这方面的需求
---

## 二、源码分析 ##
### 1、源码结构 ###

event的源码实现结构如下所示：

	function returnTrue() {};
	
	function returnFalse() {};
	
	// 返回当前获得焦点的元素
	function safeActiveElement() {};
	
	jQuery.event = {

		global: {},
		
		// 绑定事件处理
		add: function( elem, types, handler, data, selector ) {},
		
		// 移除事件处理
		remove: function( elem, types, handler, selector, mappedTypes ) {},
		
		// 触发事件
		trigger: function( event, data, elem, onlyHandlers ) {},
		
		// 分派（执行）事件处理程序
		dispatch: function( event ) {},
		
		// 组装事件处理队列
		handlers: function( event, handlers ) {},
		
		// 封装jQuery.Event原始对象，修正event事件属性
		fix: function( event ) {},
		
		// 事件属性
		props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey "
							+"relatedTarget shiftKey target timeStamp view which".split(" "),
		
		fixHooks: {},
		
		keyHooks: {},
		
		mouseHooks: {},
		
		// 事件特例，如load、click、focus、blur、beforeunload等
		special: {},
		
		// 模拟事件触发
		simulate: function( type, elem, event, bubble ) {}
		
	};
	
	// jQuery事件对象，模拟实现部分W3C标准的DOM 3级别事件模型，统一了事件的属性
	jQuery.Event = function( src, props ) {};
	
	// jQuery事件对象原型
	jQuery.Event.prototype = {
		// 是否已经阻止元素默认行为
		isDefaultPrevented: returnFalse,
		// 是否已经停止了事件传播
		isPropagationStopped: returnFalse,
		// 是否已经立即停止了事件传播
		isImmediatePropagationStopped: returnFalse,
		
		// 阻止元素的浏览器默认行为
		preventDefault: function() {},
		// 停止事件传播
		stopPropagation: function() {},
		// 立即停止事件传播
		stopImmediatePropagation: function() {}
	};
	
	// 如果不支持submit事件冒泡（IE），则submit事件委托
	if ( !support.submitBubbles ) {};
	// IE change事件委托，及checkbox/radio事件修正
	if ( !support.changeBubbles ) {};
	// 如果不支持focusin事件冒泡，则转为focus实现（focusin -> focus, focusout -> blur）
	if ( !support.focusinBubbles ) {};
	
	jQuery.fn.extend({
		// 完成一些参数调整，调用内部add方法完成事件绑定
		on: function( types, selector, data, fn, /*INTERNAL*/ one ) {},
		// 元素只能运行一次事件处理器函数
		one: function( types, selector, data, fn ) {},
		// 解除绑定：删除一个之前附加的事件句柄
		off: function( types, selector, fn ) {},
		// 执行事件处理函数和默认行为
		trigger: function( type, data ) {},
		
		// 执行事件处理函数，不执行默认行为，只触发匹配的第一个元素，不返回jQuery对象
		triggerHandler: function( type, data ) {}
	});
	
	jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu")
		.split(" "), function( i, name ) {

		// 处理事件绑定
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	});
	
	jQuery.fn.extend({
		// 便捷方法，在匹配的元素上绑定两个事件处理函数，
		// 鼠标移入时执行handlerIn，移出时执行handlerOut
		hover: function( fnOver, fnOut ) {},
		// 绑定
		bind: function( types, data, fn ) {},
		// 解绑定：删除一个之前附加的事件处理程序handler
		unbind: function( types, fn ) {},
		// 事件委托，调用on方法实现
		delegate: function( selector, types, data, fn ) {},
		// 删除事件委托，调用off实现
		undelegate: function( selector, types, fn ) {}
	});
	
jQuery对事件的绑定和委托及接触是通过on和off方法来实现，而on和off方法则是通过调用jQuery.event的内部方法add来remove实现，而add和remove这是调用浏览器的原生事件addEventListener/removeEventListener或attachEvent/detachEvent来实现处理指定和删除事件处理程序，其实现的方向如下：

	bind,delegate/unbind,undelegate -> on/off -> add/remove -> addEventListener,attachEvent/removeEventListener,detachEvent
	
一般情况下，jQuery中实现添加事件处理程序都是通过on或者事件特例（click，load，focus等）来实现的，相应的移除事件处理程序则是通过使用off方法来实现。

***.bind( types,data, fn )***

`.bind()`方法用于直接附加一个事件处理程序到元素上。

处理程序附加到jQuery对象中当前选中的元素，所以，在`.bind()`绑定事件的时候，这些元素必须已经存在，很明显就是直接调用的,没利用委托机制。

***.delegate( selector, types, data, fn )***

delegate事件委托其实质就是调用了on方法，将此方法的参数传递给on方法，让其代调用更具体的内部函数来实现事件委托，其源码如下所示：

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	}

由此可见，delegate就是调用了on方法，并将参数传递过去，自己本身并没有做任何的处理，因而可以变相的将dalegate视为on方法的别名。例如，将一个`<a>`元素的事件处理程序委托到祖先元素`<div>`元素上，html请参考上一篇开头的html文档[Event事件处理（1）][]，

	$('.div').on('click', '.a', function(){
		alert('delegate by on()');
	});
	
	$('.div').delegate('.a', 'click', function(){
		alert('delegate by delegate()');
	});
	
上面两种方法实现的功能都是一样的，将`<a>`元素的click事件委托给`<div>`元素。

任何时候只要有事件冒泡到`$('.div')`上，它就查看该事件是否是click事件，以及该事件的目标元素是否与CCS选择器相匹配。如果两种检查的结果都为真的话，它就执行函数。

### 2、源码分析 ###

***add( elem, types, handler, data, selector )***

elem：事件绑定的元素名称

types：事件处理名称，如：click、bulr、mouseout等

selector： 一个选择器字符串，用于过滤出被选中的元素中能触发事件的后代元素

data：当一个事件被触发时，要传递给事件处理函数的

handler：事件被触发时，执行的函数

其部分源码如下所示：

	add: function( elem, types, handler, data, selector ) {
		// ...
		
		// 尝试取出事件的namespace，如click.bbb.ccc中的bbb.ccc
        tmp = rtypenamespace.exec( types[t] ) || [];
        // 取出事件处理类型，如click
        type = origType = tmp[1];
        // 取出事件命名空间，如bbb.ccc，并根据"."分隔成数组
        namespaces = ( tmp[2] || "" ).split( "." ).sort();

        // 事件是否会改变当前状态，如果会则使用特殊事件
        special = jQuery.event.special[ type ] || {};

        // 根据是否已定义selector，决定使用哪个特殊事件api，如果没有非特殊事件，则用type
        type = ( selector ? special.delegateType : special.bindType ) || type;

        // 更具状态改变后的特殊事件
        special = jQuery.event.special[ type ] || {};

        // 组装用于特殊事件处理的对象
		handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );
		
		// 第一次添加事件处理时，初始化事件处理函数队列
		if ( !(handlers = events[ type ]) ) {
			handlers = events[ type ] = [];
			handlers.delegateCount = 0;
			
			// 如果特殊事件处理程序函数返回false，使用addEventListener/attachEvent添加事件
			if ( !special.setup || special.setup.call( elem, data, namespaces, 
				eventHandle ) === false ) {
				// 为元素绑定全局事件处理函数
				if ( elem.addEventListener ) {
					elem.addEventListener( type, eventHandle, false );
				} else if ( elem.attachEvent ) {
					elem.attachEvent( "on" + type, eventHandle );
				}
			}
		}
		
		// 通过特殊事件add处理事件
        if ( special.add ) {
            // 添加事件
            special.add.call( elem, handleObj );
            // 设置处理函数的ID
            if ( !handleObj.handler.guid ) {
                handleObj.handler.guid = handler.guid;
            }
        }

        // 将事件处理函数推入处理列表
        if ( selector ) {
            handlers.splice( handlers.delegateCount++, 0, handleObj );
        } else {
            handlers.push( handleObj );
        }
			
		// ...
	}
	
从这里的源代码看，对于没有特殊事件特有监听方法和普通事件都用addEventListener来添加事件。而有特有监听方法的特殊事件，则调用相应的`special.add.call`来添加事件。总之而言，此方法是jQuery中为元素添加事件监听器的。

***on( types, selector, data, fn, one )***

types：事件处理程序名称

selector：一个选择器字符串，用于过滤出被选中的元素中能触发事件的后代元素

data：当一个事件被触发时，要传递给事件处理函数的

fn：事件触发时执行的程序

one：近在内部使用，用于标识是否该事件只能被触发一次

其源码如下所示：

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// types可以是一个由types/handlers组成的map对象
		if ( typeof types === "object" ) {
			// 如果selector不是字符串
	        // 则将传参由( types-Object, selector, data )变成( types-Object, data )
			if ( typeof selector !== "string" ) {
				data = data || selector;
				selector = undefined;
			}
			
			// 遍历所有types，递归调用将事件绑定到当前元素上
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}
		// 如果data为空，且fn为空
		if ( data == null && fn == null ) {
			// 则传参由( types, selector )变成( types, fn )
			fn = selector;
			data = selector = undefined;

		// 否则如果只是fn为空
		} else if ( fn == null ) {
			// 且selector为字符串
			if ( typeof selector === "string" ) {
	
				// 则传参从( types, selector, data )变成( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// 否则传参从( type, selector, data )变成( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		//如果fn为false则变成一个return false的函数
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			//如果fn现在还不存在，则直接return this
			return this;
		}

		if ( one === 1 ) {  // 如果one为1
			origFn = fn;  // 保存，并重定义fn
			fn = function( event ) {
				// 这个事件只触发一次，触发完成就用off取消掉
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// 使用相同的ID，为了未来好删除事件
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		// 对所有用jQuery.event.add来添加事件
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	}
	
从上面的代码可以看出，其实on()方法大部分的代码都是在模拟重载on()方法的重载，还有一小段代码提供了one()方法的实现，若为某个事件标识了one（即只会触发一次），那么在on()方法中就会备份别改写一个回调函数（事件触发时执行的函数），

	origFn = fn;  // 保存，并重定义fn
	fn = function( event ) {
		// 这个事件只触发一次，触发完成就用off取消掉
		jQuery().off( event );
		return origFn.apply( this, arguments );
	};
	// 使用相同的guid，为了未来好删除事件
	fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
			
通过回调函数传递的事件对象参数，	使用off()方法将该触发事件取消绑定，达到不会在触发下一次，即仅触发了本次一次的目的，在改写的回调函数中，通过

	origFn.apply( this, arguments );
	
调用未改写前的回调函数来实现触发后的事件处理，最后还讲副本及改写函数都设置一个统一的guid，以便未来好删除事件。

而实际上on()方法最核心的代码其实就只有两行，就是最后两行代码：

	return this.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	});

首先此处的this是一个jQuery对象，引用的是希望被绑定事件的元素，就像

	$('.div').on('click mouseleave', '.p', function(){....});
	
所示，当上面的代码运行到on()方法最后两行时，this指的就是`$('.div')`所表示的jQuery对象。

on()方法源码中，对当前jQuery对象调用each方法，调用`jQuery.event`的内部函数add()方法，为当前jQuery对象所包含的所有DOM元素添加事件。由此可以看出，这些源码中最最核心的还是add/remove方法，其它的各种样式的方法都在在这两个基础的方法上扩展实现的。

相应的事件的触发，最核心的也是`jQuery.event`中的trigger()方法。

从源码中可以看出，通过`jQuery.fn.extend`扩展到jQuery实例对象中的所有事件方法，都是通过直接调用on，off，trigger方法，间接调用add，remove，trigger，fix等一系列`jQuery.event`中的方法来实现实现的绑定、移除和触发的，当然前面也说过，最终将其添加到浏览器DOM上还是通过浏览器原生的addEventListener/attachEvent，removeEventListener/detachEvent来实现的。

而jQuery中所做的就是在这些浏览器元素的添加事件监听方法的基础上，通过`jQuery.event`对象，将原生的事件对象进行扩展与增强，然后实现功能更加强大的事件处理，最后将这些增强过后的事件处理接口（如：on, delegate, bind, off 等）扩展到jQuery实例对象中，暴露给用户使用。

***简写绑定***

前面说的都是一些标准的，通用的事件处理，下面我们来看一下一些简写的事件处理，就像如下所示，

	$('.div').click(function(){....});      or    $('.div').change(function(){....});
	
这些方法不用通过on()方法，并为其传递事件处理类型名称，而是直接通过类型名称来创建事件处理，不需要在像下面这样创建事件处理，

	$('.div').on('change', function(){....});
	
相比之下，简写事件处理显得更加语意明确，书写简单，一看就能知道需要触发的条件是什么。其实现源代码如下所示，

	jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
		"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
		"change select submit keydown keypress keyup error contextmenu")
		.split(" "), function( i, name ) {

		// 处理事件绑定
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	});
	
首先通过`.split`将所有的简写事件处理分为一个数组，然后使用`jQuery.each`遍历这些简写事件处理，通过

	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

将其扩展到jQuery的实例对象当中去，万变不离其宗，虽然在创建事件处理的时候是通过这些简写事件名称来创建的，实际上这些事件的添加到元素、触发，还是通过`jQuery.event`中基础的on()和trigger()方法来实现的。

## 三、示例 ##

由于在前面一篇博文，介绍事件处理的一些概念的时候，已经应用了很多的示例，此处不在给出，如果需要查看，可以跳转！[Event事件处理（1）][]

[Event事件处理（1）]: /blog/2014/08/19/jQuery-source-analysis-event(1).html "jQuery源码解读[7] -- Event事件处理（1）"

</br>

===

**未完待续。。。**

