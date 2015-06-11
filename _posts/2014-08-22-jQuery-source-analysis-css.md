---
layout: post
category: jQuery
title: jQuery源码解读[10] -- CSS样式应用
tags: ['$', 'jQuery', '源码', 'CSS','样式']
author: 万洲
email: wanzhou@asiainfo.com
description: 在JavaScript的世界里，效果会令操作体验及交互体验更胜一筹，通过jQuery，能够更加轻松的为页面操作添加“酷炫”的视觉效果，甚至创建精致的动画
---

## 一、CSS样式 ##

首先，看一下jQuery中提供的修改CSS样式的方法：(1)`.css( key )`；(2)`.css( key, value )`；(3)`.css( obj )`，都是用来修改html的样式的。

***css( key )***

取得css属性key的值，

	.css('background-color');
	
取得匹配元素的`background-color`元素的值。

	.css(['background-color', 'font-size']);
	
取得匹配元素的`background-color`和`font-size`属性的值。

***css( key, value )***

设置css属性key的只为传入的value，

	.css( 'background-color', '#0000ff' );
	
将匹配元素的`background-color`背景颜色设置为`#0000ff`蓝色。

***css( obj )***

根据传入的key-value参数设置css属性值，

	.css({
		background-color: '#0000ff',
		font-size: 15px,
		float: left;
	});

闯入参数为一个**属性 - 值**一一对应的css属性对象，jQuery会为其一一对应的设置对应的css值。

利用两个按钮，调整某段落文字的大小：

	// html
	<p class='p1'>段落一，测试文字！！修改CSS样式！</p>
	<p class='p2'>段落二，测试文字！！修改CSS样式！</p>
	<button id='bigger'>变大</button>
	<button id='smaller'>变小</button>
	
	// script
    var $p = $('p');
    $('button').on('click', functiono(){
        var num = parseFloat($p.css('font-size'));
        var tmp = this.id == 'bigger' ? num * 1.1 : num / 1.1; 
        $p.css('font-size',num);
	});

这段代码很简单，不难，此处不再说明。

## 二、效果方法 ##
### 1、预定义效果 ###

***显示和隐藏元素***

基本的`.hide()`和`.show()`不带任何参数，跟使用`.css('display', 'none')`或`.css('display', 'block等其它')`类似，用于显示和隐藏匹配元素，

	// html
	<p class='p1'>段落一，测试文字！！修改CSS样式！</p>
	<p class='p2' style='display: none;'>段落二，测试文字！！修改CSS样式！</p>
	<p class='p3'>段落三，测试文字！！修改CSS样式！</p>
	
	// script
	$('.p1').hide();	// 隐藏段落一
	
上面的script代码，运行后会隐藏段落一，
	
	$('.p1').show();	// 显示段落二
	
在段落二的html代码中，通过style属性为其指定了一个内联的CSS属性`display`，并将其设置为none，那么默认情况下，段落二将不会显示出来（默认是隐藏状态），在调用了上面的代码之后，段落二将会显示到界面上。

当为`.show()`和`.hide()`传递参数时，就会产生像动画一样的，持续性效果。对于jQuery提供的任何效果方法，都可以为其指定两种预设的速度参数：slow和fast。

使用`.show('slow')`会在600毫秒(0.6秒)内完成显示隐藏元素的效果，而传递参数为`'fast'`时的时间为200毫秒(0.2秒)，而如果不显示的指定速度的参数，jQuery会默认在400毫秒(0.4秒)内完成执行的效果。

而如果想要指定自己需要的运行速度参数，直接传递一个数值参数即可：`.hide(999)`。

当然jQuery在隐藏显示元素中，不仅仅只为我们提供了这两个方法，还有一个`toggle()`方法，这个方法会显示或隐藏匹配的元素：当隐藏的元素调用此方法后会显示出来，而显示的元素调用此方法后会被隐藏。

	$('<button>toggle</button>')
		.appendTo('body')
		.click(function(){
			$('p').toggle('fast');
		});

上面代码在`<body>`元素后面添加一个按钮，绑定一个单击事件，点击显示或隐藏所有段落。

而上面介绍的3个方法在接受一个数值作为显示、隐藏元素速度的同时，还可以传递第二个参数，作为一个回调函数，即当完成了显示、隐藏的任务后，调用该回调函数，原型入下所示：

	.show('fast', function(){...});
	.hide('slow', function(){...});
	.toggle(1000, function(){...});

***淡入、淡出***

jQuery除了提供简单的隐藏显示的方法之外，还提供了另一些不同持续效果的隐藏显示方法，这里要将的是淡入和淡出。

跟前面的隐藏显示元素一样，提供了三个方法，都能接收数值作为速度参数，同样也可以接收一个函数作为回调函数，原型如下所示：

	.fadeIn([speed], [callback])
	.fadeOut([speed], [callback])
	.fadeToggle([speed], [callback])

其使用方法跟前面一样，不再详细给出。

其中还涉及到一个`.fadeTo(speed, opacity, [callback])`，这个方法可以调整匹配元素的不透明度，感兴趣的可以尝试一下。

	$('<button>fadeTo</button>')
		.appendTo('body')
		.click(function(){
			$('p').fadeTo(1000, 0.2);
		});
	
上面的代码，通过想html中添加一个带事件click处理程序的按钮，在其单击事件中，通过`.fadeTo`改变所有段落的不透明度(在1秒内，将不透明度由1 -> 0.2)

***滑入、滑出***

滑入和滑出是jQuery提供的另一种显示、隐藏元素的方法，接收的参数跟前面两种方法完全一样，只是其持续效果不同，原型如下所示：

	.slideDown([speed], [callback])
	.slideUp([speed], [callback])
	.slideToggle([speed], [callback])

使用方法不在给出！
	

</br>

===

**未完待续。。。**

