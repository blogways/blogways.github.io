---
layout: post
category: jQuery
title: jQuery源码解读[12] -- 特性属性操作
tags: ['$', 'jQuery', '源码', 'attr','特性操作','prop','属性操作']
author: 万洲
email: wanzhou@asiainfo.com
description: 属性操作主要包括Attr特性和Prop属性两部分，attr特性就是存在于元素的attributes属性中的节点，对应的nodeType为2；而prop属性，则是对象的一个值，可以通过对象实例.prop属性名来访问和设置
---

## 一、前言 ##

属性操作主要分为attr特性和prop属性操作，而一般使用的方法就三个：`.attr()`、`.prop`和`.val()`。其中`.attr()`用于操作attr特性，而`.prop()`主要用于操作prop属性，最后`.val()`则是用于操作元素的value属性值。

提到attr特性和prop属性，很多人都会很疑惑，它们之间有什么不同呢？

(1)***attr特性***，直接写在标签上的属性，可以通过浏览器原生的API：setAttribute、getAttribute进行设置、读取，如下所示的id，type，checked都是attr特性：

	<input id='incb' type='checkbox' checked='checked'/>
	
attr特性，主要是通过`name＝'value'`的形式，通过NameNodeMap保存在元素节点当中，其自身作为`Node.ATTRIBUTE_NODE(2)`节点，上述的`<input>`元素对应的jQuery对象结构，如下图所示：

![attr 特性值 NameNodeMap](/images/attr.png)

从图中可以看到attr特性在元素节点中是以NameNodeMap类型保持的。

(2)***prop属性***，prop属性和attr特性最明显的差异修饰保持方式和访问设置方式，attr要通过一些元素的API来访问设置，但是prop属性则是直接通过`.`号来进行访问和设置属性；prop属性是作为元素节点的实例对象属性来存储的。

就像上面attr特性值中的图片所示，其中的`checked: true`，`accept:""`，`autofocus: false`等都是prop属性值，因为作为元素节点的属性，可以直接访问：

	var $incb = $('#incb');
	$incb.accept = 'Test prop value!';
	console.log($incb.accept);

结果会显示`Test prop value!`，可见上面通过对`.accept = '...'`直接赋值用于设置了prop属性，而通过`.accept`直接返回了设置的prop属性。

而`.val()`则是操作的是元素的value属性。

## 二、源码分析 ##

首先，看一下通过`jQuery.fn.extend`扩展到jQuery实例对象中的`.attr()`和`.prop()`方法，

	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	}
	
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	}
	
由上面的源码可以看出，jQuery实例对象中的两个方法都是调用了access，在参数传递方面除了在第二个参数不同之外，其余都是一样的，那么让我们来看一下access函数是何方神圣，

	var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;
	
		// 传递的过来的key值是个对象，递归调用处理多值
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}
	
		// 传递的value值有意义，处理单值
		} else if ( value !== undefined ) {
			chainable = true;
	
			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}
	
			if ( bulk ) {
				// Bulk operations run against the entire set
				// key值不为空，即传递过来的key值有意义
				if ( raw ) {
					// 如果传递过来的value不是一个函数，
					// 则直接使用key和value值，调用传递过来的函数fn
					fn.call( elems, value );
					fn = null;
	
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) { 	// 运行fn
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}
		// chainable 为 arguments.length > 1 的结果
		return chainable ? 	 // 返回操作以后的数据
			elems :
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	};

从中可以看出，access方法没有太多代码，仅仅只是讲传递过来的参数做一定的修改，修改完成之后执行指定的函数(第二个参数所指定的函数)，而主要的参数修改，就是将多值参数分解为单值操作，然后分别执行相应的函数。

`.attr()`和`.prop()`方法在为access传递的第二个参数，分别传值为`jQuery.attr`和`jQuery.prop`，由此可见，attr特性与prop属性的get/set方法具体实现应该在这两个传值函数当中。

***attr: function( elem, name, value )***

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// 忽略文本、注释和属性节点的attr特性操作(get/set)
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// 当不支持浏览器原生的getAttribute时，
		// 调用prop属性设置方法来实现
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// 所有的attr特性名都是小写
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();  // 将特性名转换为小写样式
			hooks = jQuery.attrHooks[ name ] || // 如果hook已被定义，则直接抓取
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {  // 特性值已定义

			if ( value === null ) {  // 特性值为空，这删除对应属性
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && 
							(ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}
		// 如果有对应的hooks，且其中包含get方法，则调用hooks的get方法
		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );
			// 不存在对应特性返回undefined
			return ret == null ?
				undefined :
				ret;
		}
	}
	
由源码可知，通过对参数的一些判断和修正，实现来对`.attr()`方法的重载，首先，value值是否定义，来判别是get/set，value的类型(可以是function)，或者传入一个key-value值对象，都能实现类似`C/C++`中的函数重载：

(1)`.attr( key )`，get方法，取得指定key值(特性名)对应的特性值；

(2)`.attr( key, value )`，set方法，设置指定key值所示特性对应的特征值；

(3)`.attr( key, fn )`，set方法，设置对应key特性的特性值，为调用fn之后的返回结果(每个匹配元素单独调用)；

(4)`.attr( obj )`，set方法，根据传入的key-value对象设置特性

(5)`.attr( key, null )`/`.removeAttr(key)`，删除指定key值对应的特性
	
***prop: function( elem, name, value )***

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// 忽略文本、注释和属性节点的attr特性操作(get/set)
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// 修正属性名和的绑定的hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}
		// 与attr一样，通过判断是否传递value，来鉴别get/set，
		// 属性的设置与获取都是通过hooks来实现
		if ( value !== undefined ) { 	// value值已定义，相当于set
			return hooks && "set" in hooks 
						&& (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {	// value未定义，相当于get
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	}
	
从源代码可以看出，`.attr()`和`.prop()`中并没有给出最底层调用原生API的实现，多数都是通过调用对应的hooks来实现对特性与属性的设置，由于笔者对于这个hooks也有些迷惑，还在学习中，此处不在说明。

虽然具体底层实现没有给出，但是源码中可以看出，通过判断value参数值是否定义，用于判断实现get/set方法。

(1)`.prop( key )`，get方法，取得指定key值(属性名名)对应的属性值；

(2)`.prop( key, value )`，set方法，设置指定key值所示属性对应的属性值；

(3)`.prop( key, fn )`，set方法，设置对应key属性的属性值，为调用fn之后的返回结果(每个匹配元素单独调用)；

(4)`.prop( obj )`，set方法，根据传入的key-value对象设置属性

(5)`.removeProp(key)`，删除指定key值对应的属性

### 附加 ###

要说attr特性和prop属性的实际应用，其中attr特性中使用的最多的要算class特性来，而在一些表单元素中使用最多的属性则是value属性来，面对这些常用的特性与属性，jQuery专门为之提供来操作的API，方便开发。

#### addClass、removeClass、toggleClass、hasClass ####

其中的元素的class特性无意是使用率最高的，因为在CSS层叠样式表中，用匹配符来设计样式时，基本都是使用的class，因而class成为来最常要使用的特性。

由于class包含很多通过空白分隔的若干个特性值，对于某些class特性值的修改非常的不容易，以前需要去编写循环操作，jQuery考虑到这些，专门提供来这几个方法来加快开发。

***addClass( class )***

为每个匹配的元素添加传入的类class

***removeClass( class )***

从每个匹配的元素中，删除传入的类class

***toggleClass( class )***

为每个匹配的元素执行后面的操作：如果传入的类class在匹配元素中已经存在，则删除此class；如果匹配的元素中不存在传入的类class，则在匹配的元素中添加类class

***hasClass( class )***

如果所有的匹配元素中，至少有一个元素包含类class则返回true，否则返回false

#### val()、val( value ) ####

***.val()***

返回所有匹配元素中，第一个匹配元素的value属性值

***.val( val )***

设置所有匹配元素的value属性值为传入的val值


## 三、示例 ##

***attr特性操作***

html:

	<input id ='ic' class='hover highlight other' type='button' value='提交' />
	<input id ='ic1' class='myclass' type='button' value='重置' />
	
测试：

	var $inbtn = $('#ic');
	
	$inbtn.attr('class'); 	// 去的'class'特性值，'hover highlight other'
	
	$inbtn.attr('type', 'input');  	// 将'type'设置为'input'，即按钮变成来输入框
	
	$inbtn.attr('class', null); 	// 删除'class'属性，及所有'class'特性值
	
	// 将上面两部操作合并到一个对象，一次性实现
	$inbtn.attr({'type': 'input','class': null});
	
	$inbtn.removeAttr('class');  // 完成与$inbtn.attr('class', null)一样的操作
	
***prop属性操作***

首先看一下一些prop属性，如下图所示：

![部分prop 属性](/images/prop.png)

首先要说一下的是，很多特性都有一个与之想对应的属性，就拿上面`<input>`元素的value特性来说，像html中那样编写，它明明是一个特性，但是在图中可以看出，在元素的属性中，也有一个与之对应的属性value。

它们之间的修改是关联的，修改来属性，特性值也会跟着改变，同样修改来特性值，属性值也会跟着改变。

测试：

	$inbtn.prop('value');  // 返回属性value的值，此处为'提交'
	
	$inbtn.prop('value', '修改');  // 将'value'属性修改为'修改'
	
	$inbtn.prop('value', null );  // 删除'value'属性及其属性值
	
	// 将上面两步操作合并到了一个对象中，一次性实现，结果是删除来'value'属性，
	// 因为最后一个操作是删除'value'属性及其属性值，所以前面对'value'值的修改不会体现出来
	$inbtn.prop({'value': '修改', 'value': null });
	
	$inbtn.removeProp('value');  	// 实现与$inbtn.prop('value', null )一样的操作
	
***jQuery操作class***

	$inbtn.addClass('hello world other');  // 为<input>元素添加三个类hello, world, other
	// 如果添加来已存在的类，会默认忽略，
	// 修改后的类为hover, highlight, other, hello, world
	
	$inbtn.removeClass('hover other');   // 删除<input>元素的两个类hover, other
	// 修改后的类为highlight
	
	$inbtn.toggleClass('hightlight bold'); 
	// 修改后的类hover, other, bold
	
	$inbtn.hasClass('myclass'); 	// 返回false，$inbtn只包含第一个<input>元素，没有myclass类
	
	$('input').hasClass('myclass'); 	// 返回true，$('input')包含两个<input>元素，
	// 第二个包含myclass类

***.val()、.val( val )***

	$inbtn.val(); 	// 返回属性value的值，此处为'提交'
	
	$inbtn.val('修改');  // 实现跟$inbtn.prop('value', '修改')一样的操作


</br>

===

**未完待续。。。**

