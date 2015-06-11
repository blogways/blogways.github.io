---
layout: post
category: jQuery
title: jQuery源码解读[7] -- Event事件处理（1）
tags: ['$', 'jQuery', '源码', 'Event','事件处理']
author: 万洲
email: wanzhou@asiainfo.com
#image:
description: 要在应用程序中实现交互性，必须时刻关注用户的一举一动，并对他们的操作给出响应，jQuery增强并扩展了了JavaScript的基本事件处理机制，很好的实现了开发人员在这方面的需求
---

## 一、前言 ##
### 1、事件传播 ###

当页面上发生一个事件时，每个层次上的DOM元素都有机会处理借个时间，如一下html为例：

    <div class='div'>&lt;div&gt;
    	<span class='span'>&lt;span&gt;
            	<a class='a'>&lt;a&gt;</a>
        	</span>
        	<p class='p'>&lt;p&gt;</p>
    </div>

当使用图形表示上面的html，其结构如下图所示：

![对应的html图形化结构图](/images/div.png)

从上面可以看出，`<a>`元素位于`<span>`,`<div>`及更外层的元素内，那么在鼠标单击`<a>`元素所在的区域时，明显可以看出同时也单击了其所有的父辈元素，如span、div等。也就是说，在鼠标点击内部元素时，内部元素所有的直接父辈元素也应该能获得响应这次单击的机会。

允许多个元素响应单击事件的策略叫做***事件捕获***，在事件捕获的工程中，最外层元素最先获得事件，然后向内将事件交给范围更小一级的可以捕获当前事件的元素，例如当点击`<a>`元素时，其捕获过程如下所示：
	
	document -> 外层元素 -> div -> span -> a

这里的外层元素就是div元素的所有直接父辈元素，值得注意的是，`document`是所有DOM元素的父辈，即无论任何事件在捕获过程中，事件首先会交给`document`，然后在向跟具体的触发事件元素传递。

两外一种相反的策略叫做***事件冒泡***，即当事件发生时，会首先将事件传递给最具体的元素，此处为`<a>`元素，然后在逐级向外传递事件，直到停止事件传播或传递到了`document`，理出当点击`<a>`元素时，其冒泡过程如下所示：

	a -> span -> div -> 外层元素 -> document
	
由于不同的浏览器采用的不同的事件策略，因此在DOM标准规定了同事使用两种策略：首先，事件从一般元素到具体元素逐层**捕获**，然后，事件再通过**冒泡**返回DOM树的顶层，事件处理程序可以注册到这个过程中的任何一个阶段，而jQuery中，如无特殊说明，默认将处理程序注册到**冒泡**阶段。

虽然默认是将处理程序注册到**冒泡**阶段，但是事件冒泡可能会导致一些无法预料的问题，例如当我们为`<div>`元素添加一个mouseout时间处理程序，当用户鼠标退出`<div>`元素时，会按照预期的一样触发事件处理程序，因为事件处理程序和触发事件元素都为`<div>`所以不会有其他元素响应这个事件，但是当用户鼠标指针在`<a>`元素内移动到`<a>`元素外时，会触发一个mouseout事件，然后向外传递到`<div>`时，会触发为`<div>`元素指定的事件处理程序，这种结果显然不是所期望的。

### 2、事件对象 ###

要解决前面所说的事件**冒泡**所产生的问题，就需要说到事件对象了，事件对象是一种DOM结构，它会在元素获得处理事件的机会时传递给被调用的事件的处理程序，就拿前面的例子来说，当`<a>`元素触发mouseout事件并冒泡到`<div>`元素时，event对象对传递给`<div>`元素上mouseout事件处理程序。

***event.target属性***

jQuery中，扩展了事件对象中的event.target属性（保存着发生事件的目标元素），使其在所有的浏览器中都能够是用这个属性，通过event.target，可以确定DOM中首先接收到事件的元素（即实际被单击的元素），而在事件处理程序中的this指针，是对处理事件的DOM元素的引用。

	$(document).ready(function(){
		$('.div').on( 'mouseout', function(event){
			if( event.target == this ){
				alert('mouseout div');
			}
		});
	});

上面的代码就是利用了enevt事件对象，很好的解决了前面所说的mouseout事件在冒泡阶段会导致的问题。

***event.stopPropagation()方法***

同时事件对象还提供了一个.stopPropagation()方法，用于完全阻止事件冒泡，与target类似，这个方法也是DOM标准的基本方法，但是在IE8及更早版本中无法使用，而在jQuery中扩展了这个方法，可以放心的使用。

	$(document).ready(function(){
    	$('.div').click(function(){
       		alert('div click');
    	});
		$('.span').click(function(){
        	alert('span click');
    	});
    	$('.a').click(function(event){
        	alert('a click');
       		event.stopPropagation();
    	});
	});

为`<div>`、`<span>`和`<a>`同时添加单击事件分别显示消息，同时在`<a>`元素内调用`event.stopPropagation();`，执行上面代码，当单击`<span>`元素时，会弹出`span click`和`div click`，但是在单击`<a>`元素时，只会弹出`a click`，由此可见stopPropagation方法成功阻止了事件的冒泡，事件处理程序只会被当前元素中执行，且事件不会继续冒泡，那么其它元素也就不会再触发此事件处理程序了。

***event.preventDefault()方法***

很多元素都会有默认的事件触发动作，例如：当点击一个`<a>`元素时，会默认跳转到指定了连接；当单击表单中的submit按钮，会默认提交当前表单。在实际操作中，我们可能会需要验证某些信息，而不希望这些元素执行默认操作，通常我们的做法是在JavaScript代码中`return false;`，返回false这种做法实际上就是组合使用了.stopPropagation和.preventDefault()，阻止事件传播，阻止元素默认触发动作。

### 3、事件委托 ###

事件冒泡虽然可能会导致一些问题，但是也为我们带来了很多的好处，而**事件委托**就是利用冒泡策略来实现的，顾名思义，事件委托就是将事件处理程序委托给其它元素，让其代为处理某些元素的事件处理，当然此处的*其它元素*是指其所有直接父辈元素。

一种委托方式是通过`event.target`来判断是否触发特定元素的委托事件，例：

	$(document).ready(function(){
		$('.div').click(function(event){
			if($(event.target).is('.p')){
				alert('delegate p to div')
			} else {
				alert('div click');
			}
		});
	});
	
如上代码所示，鼠标点击`<p>`元素会弹出`delegate p to div`，`<p>`元素的事件处理程序委托给了`<div>`元素，当用户单击`<p>`元素时，本身并无事件处理程序，因此向外冒泡，触发`<p>`的父元素`<div>`元素的事件处理程序，其中通过`event.target`判断目标元素是`<p>`元素，因而调用相应的事件处理，弹出`dalegate p to div`。

首先要说明的是，`event.target`引用的是触发事件元素的html文档，而不是一个jQuery对象，可以在传递了事件对象的处理程序中通过如下代码显示，

	console.log( event.target );
	
当单击了`<span>`元素时，输出结果如下图所示：

![span的event.target](/images/eventtarget.png)

因而使用`$(html标签)`创建一个对应html标签的jQuery对象，然后通过`is()`选中元素是否是希望的元素，如果是则执行委托事件处理，否则就执行其默认处理。

而另一种事件委托方式，就是通过jQuery内置的事件委托，如：

	$('.div').on( 'click mouseleave', '.p', function(event){
		if( event.type == 'click' ){
			alert('delegate p\'s click to div');
		} else if(event.type == 'mouseleave' ){
			alert('delegate p\'s mouseleave to div');
		}
	});

上面代码所示，将`<p>`元素的click和mouseleave事件委托给了`<div>`元素，当单击`<p>`元素时，会弹出`delegate p's click to div`，相应的当鼠标离开`<p>`元素区域时，会弹出`delegate p's mouseleave to div`。

由上面可知，可以将某元素的事件处理程序委托给其所有直接父辈元素中的某一个元素，即冒泡阶段中，某元素之后的任何事件传递元素，而document作为所有页面元素的祖先元素，将事件委托给document很方便，但是也可能因为DOM嵌套层数太多，事件冒泡阶段的传递较多，导致事件处理效率不高，所以应该尽可能选择具体的委托元素，以减少不必要的开销。

***早委托***

如果我们需要在某个页面中，处理某个链接的单击事件，并阻止其默认事件（即，单击立即跳转到相应的链接），如果我们等到文档就绪之后在为其绑定单击事件，那么可能在绑定事件处理程序之前，该链接已经被点击，然后跳转到另一个页面了。把事件处理程序绑定到document上，不再等到加载完整的DOM结构之前就运行，即将事件委托作为一个IIFE放入`<head>`中，一旦加载玩绑定函数立即绑定，那么后面加载html内容时，单击触发的所有事件都会冒泡到document元素，执行相应的功能，如：

	(function($){
		$(document).on( 'click mouseleave', '.a', function(event){
			alert('a click');
			event.preventDefault;
		});
	})(jQuery);

### 3、自定义事件 ###

由浏览器的DOM实现自然触发的事件对任何WEB应用来说都是至关重要的，但是jQuery代码不没有局限于此，jQuery中支持对事件的自定义，即我们可以手动为DOM元素添加一些***自定义事件***。

由于是自定义事件，因而其触发必须是手动的方式来触发，其应用方式就像函数的定义与调用一样，自定义事件就像创建一个完成某项功能的的函数，在需要完成某个功能时，通过触发方式来触发自定义事件，就像调用函数一样，如：

	$(document).ready(function(){
		$(document).on( 'AlertHello', function(event){
			alert('Hello World!');
		} );
		
		$('.p').click(function(){
			$(this).trigger('AlertHello');
		});
	});
当点击`<p>`元素时，成功弹出`Hello World!`，当然也可以对自定义事件传递自定义参数，如：

	$(document).on( 'AlertStr', function( event, str ){
		var s = str || "Hello World!";
		alert(s);
	}
	
	$('.p').click(function(){
			$(this).trigger( 'AlertStr', 'jQuery');
	});

而此时单击`<p>`元素时，如你所想的，弹出的是`jQuery`。

### 4、移除事件处理程序 ###

有绑定事件处理程序，当然也有移除绑定，在jQuery中，移除事件处理程序通常是用.off()方法来实现，如移除`<span>`元素的单击事件，代码如下：

	$('.span').click(function(){
        	alert('span click');
    });
    
    $('.span').off('click');

再单击`<span>`元素时，不会弹出任何警示框了，开始为其绑定了一个单击事件，然后移除了单击事件click的事件处理程序，之后单击都不会弹出提示。

当然此处通过代码

	$('.span').off('click');
	
是将`<span>`元素的所有单击事件都移除，言外一致就是只要是click事件的处理程序就被移除，不在响应click事件，而现实中我们通常只是希望移除某个或某些特定的事件，这就要用到事件处理的命名空间了。

通过命名空间可以让.off()方法更具有针对性，避免移除仍需要的事件处理程序，而事件处理的命名空间，事件绑定事件处理程序的时候，附带传入的信息，用以表示一个或者一类的事件处理程序，如：

	$(document).ready(function(){
		$('.p').on( 'click.alerthello', function(){
			alert('Hello!');
		});
		$('.p').on( 'click.alerthello', function(){
			alert('Hello World!');
		});
		$('.p').on( 'click.alertjquery', function(){
			alert('Hello jQuery!');
		});
		
		$('.p').off('click.alerthello');
	});

单击`<p>`元素时，只弹出警示框显示`Hello jQuery!`，而另外两个没有显示，说明成功移除了click单击事件中，`alerthello`命名空间下所有的事件处理程序，而`alertjquery`命名空间下的事件处理程序仍然保留。

### 5、DOM2级及IE 事件处理程序 ###

DOM2级事件定义了两个方法，addEventListener()和removeEventListener()，用于处理指定和删除事件处理程序操作，这两个方法接收三个参数：事件处理程序名称、事件处理程序函数和一个布尔值（用于表示是否在捕获阶段调用事件处理程序，默认值为false，即在冒泡阶段调用事件处理程序）。

IE中实现了与DOM中类似的两个方法：attachEvent()和detachEvent()，由于IE8及更早版本只支持冒泡阶段，因而这两个方法只接收两个参数：事件处理程序名称和事件处理程序函数。

jQuery中的为DOM元素添加和删除事件处理程序中，最底层的操作也是通过这四个方法来实现的，实现了对IE及其它浏览器的事件处理程序的兼容。

***addEventListener( type, listener, capture )***

* type 事件处理程序类型，即要监听的事件名称，例如click mouseout mouseleave等；
* listener 事件处理程序的具体实现函数，当规定的事件发生时，执行该函数；
* capture 如果为true，表示在事件捕获阶段调用事件处理程序。

addEventListener()可能被调用多次，在同一个节点上为同一种类型的事件注册多个事件句柄。但要注意，DOM不能确定多个事件句柄被调用的顺序。

***removeEventListener( type, listener, capture )***

* type 要删除事件处理程序的类型
* listener 要删除的事件程序的函数
* capture 如果要删除是捕获阶段的事件处理程序，则为true；如果要删除的是冒泡阶段的事件处理程序，则为false

***attachEvent( type, listener )***

* type 事件处理程序名称，带有一个“on”前缀，例如onclick onmouseout onmouseleave等；
* listener 事件处理程序的具体实现函数，当规定的事件发生时，执行该函数；

这个方法是一个特定与IE的事件注册方法。它和标准的addEventListener()方法（IE不支持它）具有相同的作用，只是两者传递的参数不同，而且IE中不支持***事件捕获***。

***detachEvent( type, listener )***

* type 要删除的事件监听器所针对的事件的类型，带有一个on前缀。
* listener 要删除事件处理程序函数

这个方法解除掉由attachEvent()方法所执行的事件句柄函数注册。它是removeEventListener()方法的特定与IE的替代。要为一个元素删除一个事件函数句柄，只需要使用你最初传递attachEvent()的相同参数来调用detachEvent()。

</br>

===

**未完待续。。。**

