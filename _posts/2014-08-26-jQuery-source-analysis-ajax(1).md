---
layout: post
category: jQuery
title: jQuery源码解读[13] -- AJAX（1）
tags: ['$', 'jQuery', '源码', 'ajax','异步js','xml']
author: 万洲
email: wanzhou@asiainfo.com
description: 异步JavaScript和XML(Asynchronous JavaScript and XML)，简称为ajax。一个网页最重要的是跟用户的交互，跟服务器的交互，如果每进行一次交互就跳转一次页面(或刷新一下页面)，这是非常不现实的，用户体验也肯定不好，所以ajax就得到了广泛的应用，ajax非常重要的一点特性就是：不需要刷新页面即可从服务器(或客户端)上加载数据
---

## 一、前言 ##

AJAX，异步JavaScript和XML，涉及到如下技术：

(1)异步JavaScript，由于JavaScript中引入的回调函数的概念，所有后台的JavaScript代码中，后面的任务**不需要**在等待前面的任务执行完，每个任务执行完毕后不是去执行另一个任务，而是执行其绑定的一个或多个回调函数，因而程序的执行顺序与任务的排列顺序是不一致的、异步的。

一般耗时较长的任务都是使用异步操作，以避免浏览器长时间执行某一无意义的任务(如死循环等)失去响应。

(2)XMLHTTPRequest，在不中断浏览器其他任务的情况下，向服务器发送请求

(3)向服务器请求的数据类型，及预期服务器返回的数据类型。

## 二、源码结构 ##

首先，看一下jQuery源码中，Ajax这块的方法及函数的扩展实现，总体结构如下所示：

	jQuery.parseJSON = function( data ) {};
	jQuery.parseXML = function( data ) {};
	jQuery.parseHTML = function( data, context, keepScripts ) {};
	
	function addToPrefiltersOrTransports( structure ) {};
	function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {};
	function ajaxHandleResponses( s, jqXHR, responses ) {};
	function ajaxConvert( s, response, jqXHR, isSuccess ) {};
	
	jQuery.extend({
		ajaxSettings: {...},
		ajaxSetup: function( target, settings ) {},
		ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
		ajaxTransport: addToPrefiltersOrTransports( transports ),
		// 主要的方法
		ajax: function( url, options ) {},
		
		getJSON: function( url, data, callback ) {
			return jQuery.get( url, data, callback, "json" );
		},

		getScript: function( url, callback ) {
			return jQuery.get( url, undefined, callback, "script" );
		}
	});

在上面的这些源码中，首先直接通过`jQuery.funcName`扩展jQuery全局函数，将jQuery提供的3个字符串转换为相应JSON、XML或HTML的API；

接着定义了一些ajax内部使用的函数，用于后面实现功能时调用；然后通过`jQuery.extend`将一些功能函数扩展到jQuery全局对象中去，这些函数的功能后面会有介绍，此处不详细说明。其中最主要的一个方法就是`ajax( url, options )`，ajax模块中的所有其他的ajax功能函数都是在此函数的基础上来实现的，就拿getJSON和getScript来说，它们的源代码很简单，就一行代码：
	
	// getJSON
	return jQuery.get( url, data, callback, "json" );
	// getScript
	return jQuery.get( url, undefined, callback, "script" );
	
可以看出，它们都是调用了`jQuery.get()`方法，它们本质上就是一个get请求，只不过认为的为其指定了***预期回的数据类型***( "json"和"script" )，那么这个get方法又是怎么实现的呢，下面请看get/post方法的实现源码：

	jQuery.each( [ "get", "post" ], function( i, method ) {
		jQuery[ method ] = function( url, data, callback, type ) {
			// shift arguments if data argument was omitted
			if ( jQuery.isFunction( data ) ) {
				type = type || callback;
				callback = data;
				data = undefined;
			}
			return jQuery.ajax({
				url: url,
				type: method,
				dataType: type,
				data: data,
				success: callback
			});
		};
	});

这里使用`jQuery.each()`遍历一个数组`[ "get", "post"]`，通过`jQuery[ method ] = function...`，将get/post方法扩展到了jQuery的全局对象中，然后来看一这两个方法的原型：

	jQuery[ method ] = function( url, data, callback, type ) {}
	
然后是其实现的代码，从中可以看出这两个方法实现的实质也是调用了`ajax( url, options )`方法，只不过是将其中的一些事先确定的参数传递给ajax方法而已。

接下来我们来看一下jQuery提供的一些默认的ajax设置，都保存在`jQuery.ajaxSettings`对象中，其对象结构如下：

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},
		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},
		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},
		// 数据转换
		converters: {
			"* text": String,
			"text html": true,
			"text json": jQuery.parseJSON,
			"text xml": jQuery.parseXML
		},
		flatOptions: {
			url: true,
			context: true
		}
	},
	
列出了ajax默认的一些设置，如果用户使用的ajax请求参数，都基本确定无需要很大的更改，则可以根据自己的需求更改这些默认的ajax设置，就不需要每次在使用ajax请求时都要指定这些参数，而用于修改ajax默认请求参数的方法源码如下，

	ajaxSetup: function( target, settings ) {
		return settings ?
			// 根据默认设置，构建一个行的settings对象，
			// 然后将修改的参数扩展到默认设置里面
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :
			// 扩展ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	}
	
其中的`ajaxExtend()`是一个ajax请求参数options的特殊扩展方法，只是将用户自定义的设置扩展到了jQuery的默认设置中去，当然同名的会发生覆盖，其基本功能跟`jQuery.extend`方法类似，感兴趣的可以到前面的讲解中去看一下相关介绍，可以看一个解析YAML的例子：
	
	$.ajaxSetup({
		accepts: {
			yaml: 'application/x-yaml, text/yaml'
		},
		contents: {
			yaml: /yaml/
		},
		converters: {
			'text yaml': function(text){
				alert(text);
				return '';
			}
		}
	});

这样就完成了一个ajax参数默认值的修改，一旦修改之后，后面的所有ajax都将会受到该次修改的影响：后面只要请求的数据类型是一个yaml文件，那么就会按照上面定义的这些参数来运行及转换，调用方式如下：

	$.ajax({
		url: 'helloworld.yaml'
		dataType: 'yaml'
	});
	
其中的converters的`'text yaml'`是告诉jQuery，这个转换函数以text格式接受数据，然后以yaml格式重新解析，后面指定的就是起解析函数，此处的转换只是将内容通过警示框输出。

然后来看一下jQuery中ajax提供的一些监听方法，

	// 通过jQuery.each方法遍历数组中需要添加监听的名称，
	// 使用jQuery.fn[ type ]将这些监听方法扩展到jQuery的实例对象中去，
	// 在其具体实现中，通过调用当前匹配元素(jQuery实例对象)的on方法，
	// 将指定的事件处理程序绑定到特定的ajax事件上
	jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", 
								"ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
		jQuery.fn[ type ] = function( fn ) {
			return this.on( type, fn );
		};
	});

从中可以看出，ajax一共提供了6个ajax事件监听，分别为：ajaxStart、ajaxStop、ajaxComplete、ajaxError、ajaxSuccess和ajaxSend，这些监听方法的功能介绍后面再做说明。

后面通过`jQuery.fn.extend`将`.seriallize()`和`.seriallizeArray()`方法扩展到jQuery的实例对象中去，其代码实现不在做讲解，感兴趣的可以自己看看。

前面讲解到了ajaxSetup方法扩展一个yaml文件的ajax请求，下面来看一下jQuery源码中关于script的ajax请求的扩展，如：

	// 增加script数据类型
	jQuery.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, 
							application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /(?:java|ecma)script/
		},
		converters: {
			"text script": function( text ) {
				jQuery.globalEval( text );
				return text;
			}
		}
	});
	
是不是跟我们举得例子基本是一样的吧，这里accepts中的属性会添加发送到服务器的头部信息，声明我们的脚本可以理解的特定的MIME类型，此处为

	"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"

当请求的为这些MIME类型时，将其理解为script；

而contents属性处理数据交换的另一方，它提供一个与响应的MIME类型进行匹配的正则表达式，以尝试自动检测这个元数据当中的数据类型，此处表示会匹配script、javascript或ecmascript；

最后的converters中包含解析返回数据的函数，此处是调用`jQuery.globalEval()`方法在全局上下文中执行给定的JavaScript字符串，并返回此JavaScript字符串。

接下来的源码结构，如下所示：

	// 定义script的预过滤器
	jQuery.ajaxPrefilter( "script", function( s ) {...});
	
	// 扩展script的传输机制
	jQuery.ajaxTransport( "script", function(s) {...});
	// 默认的json设置
	jQuery.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function() {
			var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
			this[ callback ] = true;
			return callback;
		}
	});
	
	jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {...});
	
	// 通过ajax请求，将指定url响应的元素加入到匹配元素中
	jQuery.fn.load = function( url, params, callback ) {};
	
这里的`jQuery.ajaxPrefilter()`函数可以添加**预过滤器**(即一些回调函数)，在发送ajax请求之前对请求进行过滤。预过滤器会在`$.ajax()`修改或者使用它的任何选项之前调用，因此通过预过滤器可以修改这些选项或者基于新的、自定义的选项发送ajax请求。

在定义了特定功能的预过滤器之后，就不需要我们在ajax请求中，明确的去定义数据类型。


## 三、Ajax方法 ##

在看完ajax模块的源码结构之后，下面是对ajax中提供的一些方法做了一下总结：

***发送请求***

<table width='100%'>
<tr><th width='40%'>Ajax方法</th><th>说   明</th></tr>

<tr><td>$.ajax( url, options )</td><td>使用传入的options生成一次ajax请求</td></tr>

<tr><td>.load( url, params, callback )</td><td>根据url生成一次ajax请求，将响应放到匹配的元素中</td></tr>

<tr><td>$.get( url, data, callback, type )</td><td>使用get方法向指定url发送一次ajax请求</td></tr>

<tr><td>$.post( url, data, callback, type )</td><td>使用post方法向指定url发送一次ajax请求</td></tr>

<tr><td>$.getJSON( url, data, callback )</td><td>向url发送一次ajax请求，<b>解析</b>预期返回的JSON数据</td></tr>

<tr><td>$.getScript( url, callback )</td><td>向url发送一次ajax请求，<b>执行</b>预期返回的JavaScript代码</td></tr>
</table>

***监听请求***
<table width='100%'>
<tr><th width='40%'>Ajax方法</th><th>说   明</th></tr>

<tr><td>.ajaxStart( fn )</td><td>绑定当任意Ajax事务开始，但没有其它Ajax事务活动时执行的处理程序</td></tr>

<tr><td>.ajaxStop( fn )</td><td>绑定当任意Ajax事务结束，但没有其它Ajax事务仍然在活动时执行的处理程序</td></tr>

<tr><td>.ajaxComplete( fn )</td><td>绑定当任意Ajax事务执行过程中，完成时执行的处理程序(无论执行失败还是成功都执行)</td></tr>

<tr><td>.ajaxError( fn )</td><td>绑定当任意Ajax事务执行过程中，发生错误时执行的处理程序</td></tr>

<tr><td>.ajaxSuccess( fn )</td><td>绑定当任意Ajax事务执行过程中，成功完成时执行的处理程序</td></tr>

<tr><td>.ajaxSend( fn )</td><td>绑定当任意Ajax事务执行过程中，开始执行时执行的处理程序</td></tr>
</table>

***配置信息***

<table width='100%'>
<tr><th width='40%'>Ajax方法</th><th>说   明</th></tr>

<tr><td>$.ajaxSettings</td><td>jQuery提供的ajax默认设置选项</td></tr>

<tr><td>$.ajaxSetup</td><td>为后续的ajax事务设置默认选项</td></tr>

<tr><td>$.ajaxPrefilter( prefilters )</td><td>在$.ajax()处理每个请求之前，会对每个Ajax请求选项做预过滤</td></tr>

<tr><td>$.ajaxTransport( transports )</td><td>为Ajax定义一个新的传输机制</td></tr>
</table>

***辅助方法***

<table width='100%'>
<tr><th width='40%'>Ajax方法</th><th>说   明</th></tr>

<tr><td>.seriallize()</td><td>将表单控件的值序列化为一个查询字符串</td></tr>

<tr><td>.seriallizeArray()</td><td>将表单空间的值序列化为一个JSON字符串</td></tr>

<tr><td>$.param( obj )</td><td>将obj对象转换为一个查询字符串</td></tr>

<tr><td>$.globalEval( code )</td><td>在全部上下文中执行给定是JavaScript字符串</td></tr>

<tr><td>$.parseJSON( json )</td><td>将给定的json字符串转换为JavaScript对象</td></tr>

<tr><td>$.parseXML( xml )</td><td>将给定的xml字符串转换为XML文档</td></tr>

<tr><td>$.parseHTML( html )</td><td>将给定的html字符串转换为DOM元素</td></tr>
</table>

</br>

===

**未完待续。。。**

