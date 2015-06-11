---
layout: post
category: jQuery
title: jQuery源码解读[14] -- AJAX（2）
tags: ['$', 'jQuery', '源码', 'ajax','异步js','xml', '应用']
author: 万洲
email: wanzhou@asiainfo.com
description: 异步JavaScript和XML(Asynchronous JavaScript and XML)，简称为ajax。一个网页最重要的是跟用户的交互，跟服务器的交互，如果每进行一次交互就跳转一次页面(或刷新一下页面)，这是非常不现实的，用户体验也肯定不好，所以ajax就得到了广泛的应用，ajax非常重要的一点特性就是：不需要刷新页面即可从服务器(或客户端)上加载数据
---

## 四、Ajax示例 ##

前面已经对ajax的源码结构和API有了一些介绍，下面就介绍一些ajax方法的应用；

前面已经介绍过了，Ajax中最最核心的方法就是`$.ajax( url, options )`，其它的方法都是在这个方法的基础上修改options参数实现的，下面来看一下ajax支持的options参数：

<table width='100%'>

	<tr><th width='15%'>参数名</th><th width='10%'>类型</th><th>说明</th></tr>
	
	<tr><td>url</td><td>String</td><td>发送请求的地址(默认值: 当前页地址)。</td></tr>

	<tr><td>type</td><td>String</td><td>请求方式 ("POST" 或 "GET")， 默认为 "GET"。注意：其它 HTTP 请求方法，如 PUT 和 DELETE 也可以使用，但仅部分浏览器支持</td></tr>
	
	<tr><td>global</td><td>Boolean</td><td>是否触发全局 AJAX 事件(默认: true)。设置为 false 将不会触发全局 AJAX 事件，如 ajaxStart 或 ajaxStop 。可用于控制不同的Ajax事件</td></tr>
	
	<tr><td>processData</td><td>Boolean</td><td>(默认: true) 默认情况下，发送的数据将被转换为对象(技术上讲并非字符串) 以配合默认内容类型 "application/x-www-form-urlencoded"。如果要发送 DOM 树信息或其它不希望转换的信息，请设置为 false。</td></tr>
	
	<tr><td>async</td><td>Boolean</td><td>默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。</td></tr>
	
	<tr><td>contentType</td><td>String</td><td>发送信息至服务器时内容编码类型(默认值: "application/x-www-form-urlencoded")</td></tr>
	
	<tr><td>timeout</td><td>Number</td><td>设置请求超时时间（毫秒），此设置将覆盖全局设置</td></tr>
	
	<tr><td>data</td><td>Object</br>String</td><td>发送到服务器的数据。将自动转换为请求字符串格式。GET 请求中将附加在 URL 后。查看 processData 选项说明以禁止此自动转换。必须为 Key/Value 格式。如果为数组，jQuery 将自动为不同值对应同一个名称。如 {foo:["bar1", "bar2"]} 转换为 '&foo=bar1&foo=bar2'。</td></tr>
	
	<tr><td>dataType</td><td>String</td><td>预期服务器返回的数据类型。如果不指定，jQuery 将自动根据 HTTP 包 MIME 信息返回 responseXML 或 responseText，并作为回调函数参数传递，可用值:</br>"xml": 返回 XML 文档，可用 jQuery 处理；</br>"html": 返回纯文本 HTML 信息；包含 script 元素；</br>"script": 返回纯文本 JavaScript 代码。不会自动缓存结果。；</br>"json": 返回 JSON 数据 ；</br>"jsonp": JSONP 格式，使用 JSONP 形式调用函数时，如 "myurl?callback=?" jQuery 将自动替换 ? 为正确的函数名，以执行回调函数。</td></tr>
	
	<tr><td>username</td><td>String</td><td>用于响应 HTTP 访问认证请求的用户名</td></tr>
	
	<tr><td>password</td><td>String</td><td>用于响应 HTTP 访问认证请求的密码</td></tr>
	
	<tr><td>cache</td><td>Boolean</td><td>dataType 为 script 和 jsonp 时默认为 false；设置为 false 将不缓存此页面</td></tr>
	
	<tr><td>traditional</td><td>Boolean</td><td>如果你想要用传统的方式来序列化数据，那么就设置为 true</td></tr>
	
	<tr><td>beforeSend</td><td>Function</td><td>发送请求前可修改 XMLHttpRequest 对象的函数，如添加自定义 HTTP 头；</br>beforeSend(XMLHttpRequest) </td></tr>
	
	<tr><td>complete</td><td>Function</td><td>请求完成后回调函数 (请求成功或失败时均调用)。参数： XMLHttpRequest 对象，成功信息字符串；</br>complete(XMLHttpRequest, textStatus)</td></tr>
	
	<tr><td>error</td><td>Function</td><td>请求失败时将调用此方法。这个方法有三个参数：XMLHttpRequest 对象，错误信息，（可能）捕获的错误对象；</br>
error(XMLHttpRequest, textStatus, errorThrown)</td></tr>

	<tr><td>success</td><td>Function</td><td>请求成功后回调函数。这个方法有两个参数：服务器返回数据，返回状态</br>
success(data, textStatus) </td></tr>

	<tr><td>xhr</td><td>Function</td><td>需要返回一个 XMLHttpRequest 对象，默认在 IE 下是 ActiveXObject 而其他情况下是 XMLHttpRequest 。用于重写或者提供一个增强的 XMLHttpRequest 对象</td></tr>

</table>

***.load( url, data, callback )***

html:

	<button>Load HTML one!</button>
	<button>Load HTML two!</button>
	<button>Load HTML three!</button>
	<div id='ajax_content'></div>
	
js:

	$('button').click(function(){
    	var val = $(this).text();
    	$('#ajax_content').load(
    	    '/echo/html/',{
    	        html: "<p>" + val + "</p>"
    	    },function(text){
    	    	console.log(text)
        });
	});

上面的代码功能很简单，向`/echo/html/`发送一个ajax请求；请求数据为`<p>`元素包装的按钮的文本内容；回调函数callback仅仅接收一个参数text(即请求返回的文本内容)，将其显示到控制台console上，该回调函数会在加载完响应之后执行。

当单击某个按钮过后，`<div>`元素里面的内容会是下面的某一个：

	<p>Load HTML one!</p>
	<p>Load HTML two!</p>
	<p>Load HTML three!</p>

前面介绍过，`.load()`方法的功能是，将请求url响应直接插入到匹配元素中。可以直接将上面代码复制到[JSFiddle.net][]上进行测试！

***$.getJSON( url, data, callback )***

在介绍`$.getJSON()`之前，首先说一下JSON(JavaScript Object Notation，JavaScript对象表示法)，

JavaScript对象是由一些“key-value”对组成的，可以使用“{}”来定义，而数组则可以使用“[]”来定义，JSON就是将这两种语法组合起来，通过字面量的方式来表示数据，

	{
		"key1": "value1",
		"key2': [
			"array_elem1",
			"array_elem2",
			"array_elem3"
		]
	}
	
如是的JSON有很强的表达能力，能使用很少的空间大小来表示很多的数据，JSON规定了，所有的对象键及其键值都必须包含在双引号("")中，而且函数不是有效的JSON值。

现在有如下一个a.json文件，其内容如下：

	[
    	{
        	"name"    : "Tom",
        	"birthday": "1991-01-23",
        	"hobbies": ["篮球","羽毛球","看电影"]
    	},
    	{
    	    "name"    : "Jhon",
    	    "birthday": "1987-09-06",
    	    "hobbies": ["网球","看书","听音乐"]
    	},
    	{
    	    "name"    : "James",
    	    "birthday": "1989-10-23",
    	    "hobbies": ["篮球","旅游","看书","玩游戏"]
    	}
	]

在页面加载时，将这些信息显示到页面中：

	$.getJSON('a.json', function(data){
		var html = '';
		$.each(data, function( index, item ){
			html += '<div class="item">';
			html += '<h2>' + item.name + '</h2>';
			html += '<div class="birthday">' + item.birthday + '</div>';
			html += '<ul>';
			for(var i in item.hobbies){
				html += '<li>' + item.hobbies[i] + '</li>';
			}
			html += '</ul>';
			html += '</div>';
		});
		$('#content').html(html);
	});

运行结果如下：

	<div id="content">
		<div class="item">
		<h2>Tom</h2>
		<div class="birthday">1991-01-23</div>
		<ul>
			<li>篮球</li>
			<li>羽毛球</li>
			<li>看电影</li>
		</ul>
	</div>
	<div class="item">
		<h2>Jhon</h2>
		<div class="birthday">1987-09-06</div>
		<ul>
			<li>网球</li>
			<li>看书</li>
			<li>听音乐</li>
		</ul>
	</div>
	<div class="item">
		<h2>James</h2>
		<div class="birthday">1989-10-23</div>
		<ul>
			<li>篮球</li>
			<li>旅游</li>
			<li>看书</li>
			<li>玩游戏</li>
		</ul>
		</div>
	</div>
	
***$.getScript( url, callback )***

a.js文件，其内容如下所示：

	var data = [
    	{
        	"name"    : "Tom",
        	"birthday": "1991-01-23",
        	"hobbies": ["篮球","羽毛球","看电影"]
    	},
    	{
    	    "name"    : "Jhon",
    	    "birthday": "1987-09-06",
    	    "hobbies": ["网球","看书","听音乐"]
    	},
    	{
    	    "name"    : "James",
    	    "birthday": "1989-10-23",
    	    "hobbies": ["篮球","旅游","看书","玩游戏"]
    	}
	];
	var html = '';
	$.each(data, function( index, item ){
		html += '<div class="item">';
		html += '<h2>' + item.name + '</h2>';
		html += '<div class="birthday">' + item.birthday + '</div>';
		html += '<ul>';
		for(var i in item.hobbies){
			html += '<li>' + item.hobbies[i] + '</li>';
		}
		html += '</ul>';
		html += '</div>';
	});
	$('#content').html(html);
	
页面的script代码：

	$.getScript('/a.js',function(){
		console.log('ajax get script done!');
	});

在上面上面的ajax请求script成功之后，会直接执行响应的a.js文件，结果跟`$.getJSON`的结果显示一样。

前面也介绍过`$.getJSON`，`$.geScript`两个方法，调用最底层的ajax方法，然后为其指定了optioins，就成了这两个方法。
	
上面两个方法使用`$.get`和`$.ajax`来实现的话，其请求操作如下：

	// $.get
	$.get( 'a.json', function(data){...}, 'json' );
	$.get( 'b.js', underfined, function(){
		console.log('ajax get script done!');
	}, 'script' );
	
	// $.ajax
	$.ajax({
		url: 'a.json',
		type: 'get',
		dataType: 'json',
		data: null,
		success: function(data){...}
	});
	
	$.ajax({
		url: 'b.js',
		type: 'get',
		dataType: 'script',
		data: null,
		success: function(){
			console.log('ajax get script done!');
		}
	});
	
***$.get()、$.post()***

前面介绍`$.get()`和`$.post()`的源码中，可以看出它们都是通过`$.ajax()`方法来实现的，唯一不同的是type(请求方式)不同，其它的都是一样的。

实际上get和post请求最大的区别是get请求把查询字符串放到url中，作为url的一部分；而post请求则不是，但是在jQuery的实现中，这种方式是没有体现出来的，都是直接通过传递一个data参数，在jQuery的底层实现中会将其转换成各自不同的实现，而我们是不需要去管它是怎么实现的。

jQuery中get和post的原型前面也介绍过，

	$.get( url, data, callback )
	
	$.post( url, data, callback )

可以看出其调用方式是一样的，只不过具体使用哪一种请求方式：(1)遵照服务器端代码的约定；(2)传输数据量--get方法对传输的数据量有更严格的限制。

***序列化表单***

向服务器发送数据常常会涉及到用户填写的表单，查询量较小的时候，可以手动的设置查询字符串，如：

	$.get( 'c.html', {'name': $('input[name='name']').val()}, function(data){
		console.log(data);
	});

但是当涉及到的表单数量较多的时候，手动的去序列化就不现实了，在这种情况下就可以使用jQuery提供的辅助方法`.serialize()`，该方法作用于一个jQuery对象，将匹配的DOM元素转换层能够随Ajax请求传递的查询字符串，例如前面的可以一般化为：

	$('form').submit(function(event){
		event.preventDefault();
		var formValues = $(this).serialize();
		$.get( 'c.html', formValues, function(){
			$('#content').html(data);
		});
	});

下面我们举例说明这个序列化的结果：

	// html
	<form action='#'>
    	姓名：<input type='text' name='name'></br>
    	年龄：<input type='text' name='age'></br>
    	密码：<input type='password' name='password'></br>
    	<input type='submit'/>
	</form>
	
	// js
	$('form').submit(function(evnet){
    	event.preventDefault();
    	var va = $(this).serialize();
    	$('#content').html(data);
	});

当用户填写`tom，20，tom123456`，然后单击提交，就会看到控制台输出了：

	name=tom&age=20&password=tom123456

***.ajaxStart / .ajaxStop***

前面我么说的一直都是在处理事件的响应，其实很多的时候，在调用ajax之前或调用过程中也需要处理一些事件，比如说：为了增强用户体验，在发送请求之间在页面显示一个`Loading`，在请求成功之后再将`Loading`去掉，再显示请求结果。

jQuery为我们提供了实现这样功能的函数，其中`.ajaxStart()`是在ajax尚未进行其它ajax时调用该函数，而`.ajaxStop()`是在最后一次请求结束之后再调用。jQuery提供的这些功能函数是全局性的，无论代码注册的位置在哪，只要满足了执行的条件，它都会运行。

例如实现上面说的`Loading`，先在html需要的位置插入一个显示加载中的显示元素，如`<div id='loading'>Loading</div>`，并将其设置为默认不显示，即添加一个样式style，`display: none;`，则html如下：

	<div id='loading' style='display: none;'>
		Loading!
	</div>
	
然后在js代码中需要的地方添加`.ajaxStart`即可，如：

	$(document).ajaxStart(function(){
		$('#loading').show();
	}).ajaxStop(function(){
		$('#loading').hide();
	});
	
前面一篇介绍列出了所有jQuery提供的监听这些事件的方法，可以用来完成各种需要的操作，感兴趣的可以去尝试一下。

***ajax中的Deferred对象***

对于`$.get/post`，`.load`等快捷的Ajax方法来说，并没有提供错误回调函数，只是提供了一个请求成功的回调函数，因此在错误发生的时候的处理函数需要通过其它方式来完成，比如说前面介绍过的Deferred延迟对象，它可以通过`.done()`，`.fail()`或`.always()`来为ajax请求添加相应的事件回调函数即可。

	$.get( 'c.html', formValues, function(){
		$('#content').html(data);
	}).fail(function(jqXHR){
		$('#content')
			.html('An error occurred:' + jqXHR.status)
			.append(jqXHR.responseText);
	}).always(function(){
		console.log('ajax stop!');
	});

更多的相关内容可以参考前面关于Deferred对象的讲解。

***修改默认选项***

使用`$.ajaxSetup()`方法可以修改调用Ajax方法是，每个选项的默认值，接受与`$.ajax()`相同的对象参数选项，如本文开头的表格所示，之后的所有Ajax请求都将使用传递给该函数的选项，除非用户显示的指定同名参数(将会覆盖默认设置)
	
	// 修改默认选项
	$.ajaxSetup({
		url: 'd.html',
		type: 'post',
		dataType: 'html'
	});
	
	// 再次调用ajax
	$.ajax({
		type: 'get',
		success: function(data){
			$('#content').html(data);
		}
	});
	
前面修改默认选项时，为ajax方法指定了默认的url(`d.html`)和dataType，后面调用时不需要在明确指定，如果再设置了与前面同名的选项，会覆盖前面的，就像这里的type，默认是post方式，而此处显示的指定了get方式，那么在本次的ajax请求会使用get方式去请求，如果下次没有显示指定请求方式，仍然会使用post方式去请求。

***部分加载页面***

前面介绍过的`.load()`方法，会将指定的文档**全部**添加到匹配元素中，而实际上可能只需要添加一部分。比如在加载一个html文档时，需要的只是这个html文档当中的`class＝'part'`的元素，不需要去遍历查找，直接传递url时附带一个jQuery选择符表达式即可，jQuery会帮我们完成必要的操作：

	$('#content').load('c.html .part');
	
实际的操作语句就只有一句，非常的简洁，感兴趣的可以去试试看，你会发现与jQuery选择符表达式无关的信息都被剔除掉了，只将需要的信息加载到了匹配元素中。

[JSFiddle.net]: http://jsfiddle.net "JSFiddle.net"

</br>

===

**未完待续。。。**

