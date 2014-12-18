---
layout: post
category: jQuery
title: jQuery源码解读[5] -- Cache数据缓存
tags: ['$', 'jQuery', '源码', 'Cache','数据缓存']
author: 万洲
email: wanzhou@asiainfo.com
#image:
description: Cache数据缓存系统现在广泛应用于DOM元素、动画、事件等方面，消除了将动画队列都存储到各DOM元素的自定义属性中所带来的隐患，另外如果给DOM元素添加过多的自定义的属性或数据可能会引起内存泄漏
---

## 一、前言 ##

Cache数据缓存系统现在广泛应用于DOM元素、动画、事件等方面，消除了将动画队列都存储到各DOM元素的自定义属性中所带来的隐患，另外如果给DOM元素添加过多的自定义的属性或数据可能会引起内存泄漏，其实质是使用了一种***低耦合的方式***将DOM和缓存数据联系起来。 

说到内存泄漏，相信大家都不会陌生，那么内存泄漏的定义是什么呢？

* 内存泄漏也称作“存储渗漏”，用动态存储分配函数动态开辟的空间，在使用完毕后未释放，结果导致一直占据该内存单元，直到程序结束（其实说白了就是该内存空间使用完毕之后未回收）即所谓内存泄漏；

* 内存泄漏形象的比喻是“操作系统可提供给所有进程的存储空间正在被某个进程榨干”，最终结果是程序运行时间越长，占用存储空间越来越多，最终用尽全部存储空间，整个系统崩溃。

在`C/C++`中，内存的分配和回收都是手动完成的，因而内存泄漏是经常发生的事情，而`JavaScript`使用的是一种称为***垃圾收集***的技术来管理分配给它的内存，当`JavaScript`代码生成一个需要使用新内存的项（如：创建一个对象或一个函数）时，系统就会为这个项留出一块内存空间。因为此对象或函数会被进行各种传递或引用，所以很多代码都会指向这块内存空间，`JavaScript`会跟踪这些对内存空间的引用，当某块内存空间没有再被任何其他代码引用时，这个对象占用的内存就会被释放。

但是由于浏览器的差异，这些`JavaScript`的自动垃圾回收方法的实现并不一样，而且回收方法可能还存在着BUG，因而还是会导致内存泄露，`JavaScript`中会导致内存泄露的情况：

	1. 循环引用
	 2. `JavaScript`闭包
	 3. DOM插入顺序

循环引用，两个或两个以上的对象或方法相互之间引用，形成一个***闭合环状引用***，则会导致内存泄露，如：

	var A = document.getElementById('mImage'),
		 B = new Object();			or			A.relative = A;
	 A.relative = B;
	 B.relative = A;

## 二、源码分析 ##
### 1、函数原型介绍 ###
 
首先，在`jQuery`源码中，一条不变的实现方式就是通过`jQuery.extend`、`jQuery.fn.extend`将Cache功能扩展给`jQuery`。

在扩展Cache功能的时候，其代码量并不多，实际的功能实现都是通过调用内部的私有函数来实现的，下面看下这些私有函数及扩展功能函数的函数原型：

	// 用来判断该元素是否能接受数据，返回true或false
	jQuery.acceptData = function( elem ) {};
	
	// 支持HTML5的data-属性
	// 如果在指定元素elem没有找到key对应的数据data，就尝试读取HTML5的data属性
	function dataAttr( elem, key, data ) {};
	
	// 检测一个Cache对象是否为空
	function isEmptyDataObject( obj ) {};
	
	// jQuery内部实现Cache实际函数，存储缓存数据
	function internalData( elem, name, data, pvt /* Internal Use Only */ ) {};
	function internalRemoveData( elem, name, pvt ) {};   // 移除缓存数据
	
	jQuery.extend({ 	// 扩展jQuery全局对象
		cache: {}, 	// 缓存对象，用于保存缓存数据

		// 如果你试图对下面的元素添加expando属性，
		// 它们会抛出不可捕捉的异常
		// 意思就是，以下元素没有Data：embed和applet，除了Flash之外的object
		noData: {
			"applet ": true,
			"embed ": true,
			"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
		},
		
		// 用来判断HTMLElement或JS对象是否具有数据。返回true或false。
		// 即，如果调用了jQuery.data方法添加了属性，则返回true。
		hasData: function( elem ) {},

		// jQuery对外的缓存数据接口，用于存储数据
		data: function( elem, name, data ) {
			return internalData( elem, name, data );
		},
		// jQuery对外的缓存数据接口，用于删除数据
		removeData: function( elem, name ) {
			return internalRemoveData( elem, name );
		},
	
		// 私有函数，仅在内部使用
		_data: function( elem, name, data ) {
			return internalData( elem, name, data, true );
		},
		// 私有函数
		_removeData: function( elem, name ) {
			return internalRemoveData( elem, name, true );
		}
	});

	jQuery.fn.extend({ 	// 扩展jQuery实例对象
		// 在匹配的元素上存储任意数据，解决了循环引用和内存泄漏
		data: function( key, value ) {},
		
		// 在匹配的元素上移除给定key值的数据
		removeData: function( key ) {}
	});

### 2、internalData、internalRemoveData源码分析 ###

***$internalData( elem, name, data, pvt )***

其源码，如下所示，

	function internalData( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			 // 是否可以附加数据，不可以则直接返回
			return;
		}
	
		var ret, thisCache,
			internalKey = jQuery.expando,
	
		// 必须区分处理DOM元素和JS对象，
		// IE6-7不能垃圾回收对象跨DOM对象和JS对象进行的引用属性
		isNode = elem.nodeType,
	
		// 如果是DOM元素，则使用全局的jQuery.Cache
        // 如果是JS对象，则直接附加到实例对象上
		cache = isNode ? jQuery.cache : elem,
	
		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		// 如果JS对象的cache已经存在，则需要为JS对象定义一个ID
        // 如果是DOM元素，则直接通过elem[ internalKey ]返回id，
        // 如果是JS对象，且JS对象的属性internalKey存在，返回internalKey 
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;
	
		// 尝试在一个没有任何数据的对象上获取数据时，避免做更多的不必要工作
		if ( (!id || !cache[id] || (!pvt && !cache[id].data)) 
					&& data === undefined && typeof name === "string" ) {
			return;
		}
	
		if ( !id ) {
			// 只有DOM节点需要一个唯一的ID，因为DOM元素的数据存储在全局的cache中
			if ( isNode ) {
				id = elem[ internalKey ] = deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}
		
		if ( !cache[ id ] ) {
			// 当对象使用JSON.stringify被序列化时，避免将jQuery元数据暴露在一个纯JS对象上
			cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
		}
	
		// 可以为jQuery.data传递一个对象或函数作为参数，而不必须是key/value的方式
		// 将参数浅拷贝到存在的缓存数据中
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}
	
		thisCache = cache[ id ];
		
		// jQuery内部数据存在一个独立的对象（thisCache[ internalKey ]）上，
		// 是为了避免内部数据和用户定义数据冲突
       	// 如果是私有数据
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {}; 	// 存放私有数据的对象不存在，则创建一个{}
			}
	
			thisCache = thisCache.data; 	// 使用私有数据对象替换thisCache
		}
	
		// 如果data不是undefined，表示传入了data参数，则存储data到name属性上
		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}
	
		// 如果一个数据属性是被限定的，
		// 则检测转换为驼峰表示法和未转换的数据属性的name
		if ( typeof name === "string" ) {

			// 首先尝试找到as-is属性数据
			ret = thisCache[ name ];
	
			// 如果ret为null或者undefined，尝试没有或者违背定义属性数据
			if ( ret == null ) {
	
				// 尝试找到骆驼拼写法属性（因为有可能之前name被驼峰化了）
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}
	
		return ret;
	}

在源码中很多地方都出现了`expando`和`jQuery.expando`，那到底它们是何方神圣？首先看一下`jQuery.expando`的源码：

	jQuery.extend({
		// 为了区别不同的jQuery实例存储的数据，使用前缀“jQuery”+jQuery版本号+随机数作为Key
		expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),
		
		// other code
	});

可以看出`jQuery.expando`实际上是一个字符串，使用`Math.random()`生成，去掉了非数字字符，它作为HTMLElement或JavaScript对象的属性名，用以标识不同的HTML元素和JavaScript对象。

前面提过，`internalData( elem, name, data, pvt )`是`jQuery`中实际实现存储缓存数据的方法，每次调用（插入一个缓存数据）都会调用`jQuery.expando`来生成一个key值，用以给插入的数据做一个标识，以便以后通过key值来访问，而在此方法中使用`internalKey = jQuery.expando;`，将key值保存在internalKey中用以内部使用。

===

***internalRemoveData( elem, name, pvt )***

其源代码，如下所示：

	function internalRemoveData( elem, name, pvt ) {
		var thisCache, i,
			isNode = elem.nodeType,
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;
	
		// 缓存数据中没有指定要删除的数据，直接return
		if ( !cache[ id ] ) {	return;	  }
			
		if ( name ) {
			// 取得实际要操作的缓存数据
			thisCache = pvt ? cache[ id ] : cache[ id ].data;
			if ( thisCache ) {
	
				// Support array or space separated string names for data keys
				// 支持数组或空格分割的字符串name作为数据的键值
				if ( !jQuery.isArray( name ) ) {
					// 在进行任何操作之前，尝试将整个字符串作为一个键值
					if ( name in thisCache ) {
						name = [ name ];
					} else {
	
						// split the camel cased version by spaces 
						// unless a key with the spaces exists
						// 将name转换为骆驼表示法
						name = jQuery.camelCase( name );
						// 判断尝试转换后的name是否在缓存数据中
						if ( name in thisCache ) {
							name = [ name ]; 	// 在，
						} else {
							name = name.split(" ");  // 不在，则将其用空格符分割
						}
					}
				} else {
					
					// 如果“name”是一个key值的数组，
					// 当数据最初被创建时，通过 ("key", "val") 签名，
					// key值将会通过jQuery.map()被转换为骆驼表示法。
					// 由于没办法 告知 key是如何被添加，原始的和骆驼表示法的key值将会被移除
					// Since there is no way to tell _how_ a key was added, remove
					// both plain key and camelCase key. #12786
					// This will only penalize the array argument path. 
					name = name.concat( jQuery.map( name, jQuery.camelCase ) );
				}
	
				i = name.length;
				while ( i-- ) {
					delete thisCache[ name[i] ];
				}
	
				// 如果当前缓存中的数据被全部删除，				直接返回return
				if ( pvt ? !isEmptyDataObject(thisCache) 
									: !jQuery.isEmptyObject(thisCache) ) {
					return;
				}
			}
		}
	
		if ( !pvt ) {
			delete cache[ id ].data;
	
			// 不销毁父缓存，除非在缓存中之剩下内部数据对象
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}
	
		// 销毁缓存
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );
	
		// Use delete when supported for expandos or `cache` is not a window per isWindow
		// 当支持suport.deleteExpando或cache不是。。。时，(反正就是支持用delete来删除缓存)
		// 使用delete销毁缓存
		} else if ( support.deleteExpando || cache != cache.window ) {
			delete cache[ id ];
		// 当所有条件都不满足时，直接置null
		} else {
			cache[ id ] = null;
		}
	}
	
`internalRemoveData`方法中，大部分源码就是在通过判断，分析和处理找到需要删除数据的name，并没有太难理解的地方那个，此处不再详细讲解。

## 三、示例 ##

***jQuery.data( elem, name, data )***

jQuery.data 这是提供给客户端程序员使用的方法，它同时是setter/getter。

* 传一个参数，返回附加在指定元素的所有数据，即

		thisCachejQuery.data(elem); // thisCache
		
* 传二个参数，返回指定的属性值

		jQuery.data(elem, 'name');  或  $.data(elem, 'name');
		
* 传三个参数，设置属性及属性值

		jQuery.data(elem, 'name', 'Jack');		或    $.data(elem, 'name', 'Jack');
		jQuery.data(elem, 'oName', {});			或    $.data(elem, 'oName', {});
		
* 传四个参数，第四个参数pvt仅提供给jQuery库自身使用，即`jQuery._data`方法中传`true`，因为jQuery的事件模块严重依赖于jQuery.data，为避免人为的不小心重写，所以在这个版本中加入的。

为JavaScript对象提供缓存，如：

	var oMyJs = {};
	$.data(oMyJs, 'info', 'Hello World');
	$.data(oMyJs, 'info'); // Hello World
	
为HTMLElement提供缓存，如：

	// html
	<div id="mdiv"></div>

	// js
    var elem = $('mdiv');
    $.data(elem, 'info', 'Hello World');
    $.data(elem, 'info');     // Hello World

如果你使用的时Chrome，你可以打开JavaScript控制台，并添上`console.log(oMyJs/elem);`，运行你就能看到元素上附加的数据了，如下图所示：

![$.data( oMyJs )](/images/oMyJs.png)
![$.data( elem )](/images/elem.png)
	
</br>

===

**未完待续。。。**

