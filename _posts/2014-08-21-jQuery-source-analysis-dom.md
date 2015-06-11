---
layout: post
category: jQuery
title: jQuery源码解读[9] -- DOM操作方法应用
tags: ['$', 'jQuery', '源码', 'DOM','操作应用']
author: 万洲
email: wanzhou@asiainfo.com
description: 一个网页，不可能内容是一成不变的，可能会根据用户的操作将新的内容呈现给用户，如果每次都需要向服务器请求新的页面，服务器的负担会非常大，所以浏览器端对页面进行一些DOM操作是必须的
---

## 一、插入新元素 ##

首先，操作DOM要分为两类，(1)操作属性；(2)操作元素；而此处暂时只分析操作DOM树中的元素。

在学习jQuery以来，我们使用最多的要数`$()`了，通过传递document判断文档是否加载完成，

	$(document).ready(....);
	
通过传递一个CSS选择符来选择DOM树中的元素，生成一个包含所选元素的jQuery对象，

	$('.div') 	// 选择DOM树中所有类名为“div”的元素，即class='div'

现在再向大家介绍`$()`的另一个用法，就是创建新的DOM元素，

	$('<div class="create by jquery">create by jquery</div>');

就像上面代码所示，只要为`$()`传递一个html的字符串，jQuery将会创建一个对应的DOM元素，当然这仅仅是创建了一个DOM元素，没有添加到DOM中，因而无法显示出来！

而jQuery中将创建元素插入到DOM树的方法有八个，它们分别是：

	.append   / .prepend   / .after       / .before
	.appendTo / .prependTo / .insertAfter / .insertBefore

它们的功能都是插入元素，但是其插入方式有比较大的差异。

***.append( content )和.appendTo( selector )***

append，在所以匹配元素的**内部**的**末尾**插入content，匹配元素就是调用此方法的jQuery对象中所包含的DOM元素，

appendTo，将匹配的元素插入到selector选择器匹配的元素的**内部**的**末尾**中，当前这里匹配的元素跟上面的是一样的，可能唯一有些区别的是，这里的匹配元素可以使用上面所说的方法创建的jQuery对象。

	$('body').append('<div class="create by jquery">create by jquery</div>');
	
	$('<div class="create by jquery">create by jquery</div>').appendTo('body');

上面所示两行代码，虽然书写方式不同，但是其含义与实现的功能都是一样的，就是将html代码，

	<div class="create by jquery">create by jquery</div>
	
添加到`<body>`元素的末尾，而实际上也真是这样，可以将代码复制到[JSFiddle.net][]进行测试，看是否将元素插入到了DOM树中。

***.prepend( content )和.prependTo( selector )***

这两个函数与前面的append与appendTo类似，只不过这两个函数是将元素插入匹配元素**内部**的**开始**，而不是末尾，

	$('body').prepend('<div class="create by jquery">create by jquery</div>');
	
	$('<div class="create by jquery">create by jquery</div>').prependTo('body');
	
运行结果就不再过多的描述了，感兴趣的可以去[JSFiddle.net][]进行测试！


[JSFiddle.net]: http://jsfiddle.net/ "JSFiddle.net"

***.after( content )和.insertAfter( selector )***

after，在每个匹配元素*外部*的后面插入content，

insertAfter，将匹配的元素插入到selector选择符匹配的元素的**外部**的后面，

这里要说一下的是，这里的**外部**和前面的**内部**，将的是元素的外部或内部，其内在含义就是：

(1)、在内部插入元素，表示将插入的元素作为自己的内容插入，即对某个`<div>`元素调用内部插入元素方法，那么结果就是：

	<div>（原来的内容）+（添加的内容）</div>

原来的内容加上新添加的内容作为行的`<div>`元素的内容。

(2)、在外部插入元素，表示将新插入的元素灬内容作为自动的兄弟结点，例如对class为div的元素进行**外部**插入一个class为after的`<div>`元素，结果就如下所示：

	<div class='div'> content  </div>
	<div class='after'> content 1 </div>

***.before( content )和.insertBefore( selector )***

这两个方法与after和insertAfter类似，都是将内容插入到匹配元素**外部**，而不同的是这两个方法是将内容插入匹配元素的**外部**的**前面**。

	$('.div').before('<div class="before"> content </div>');
	
	$('<div class="before"> content </div>').insertBefore('.div');

这两行代码的含义是一样的，将`<div class='before'> content </div>`作为所以包含class为div的元素兄长结点插入，即将该html插入到匹配结点之前，结果如下：

	<div class='before'> content </div>
	<div class='div'> content </div>
	
## 二、移动元素 ###

用于测试的html文档：

	<html>
		<body>
			<div class='div'>
    			<span class='span'>&lt;span&gt;<a class='a' href='#'>&lt;a&gt;</a></span>
    			<p class='p'>&lt;p&gt;</p>
			</div>
		</body>
	</html>

前面通过`$()`创建DOM元素，然后通过8个方法将其添加到DOM树中，其中

	.appendTo / .prependTo / .insertAfter / .insertBefore

这四个方法调用对象为jQuery实例对象，即这四个方法运行的上下文环境是一个jQuery对象实例，而接收的参数为一个CSS选择符，因而它们能完成一项感觉跟它们完全没关系的功能。

它们可以作为插入节点元素的方法，但是这四个方法同样可以移动DOM中元素节点的位置；

	$('.a').appendTo('body');

执行上面的jQuery代码过后，可以看到如下的html：

	<html>
		<body>
			<div class='div'>
    			<span class='span'>&lt;span&gt;</span>
    			<p class='p'>&lt;p&gt;</p>
			</div>
			<a class='a' href='#'>&lt;a&gt;</a>
		</body>
	</html>	

可以看出，`.appendTo`和`.prependTo`继承了它们是在匹配元素**内部**操作的，那么由此可见`insertAfter`和`insertBefore`将会是在匹配元素**外部**操作的，如：

	$('.a').insertAfter('body');

结果如下所示：

	<html>
		<body>
			<div class='div'>
    			<span class='span'>&lt;span&gt;</span>
    			<p class='p'>&lt;p&gt;</p>
			</div>
		</body>
		<a class='a' href='#'>&lt;a&gt;</a>
	</html>	

有了这四个方法，就可以根据需求在DOM树中，将需要的节点移动到另一个位置。

## 三、包装元素 ##

有时候，需要给很多个段落（即，`<p>`元素的内容）编号时，有人可能会想用循环为每个元素编号，或者高大上一点通过each遍历来实现，在学习jQuery之前我可能跟你一样，在学了jQuery之后，再也不需要那么麻烦了，jQuery想到了这一块，为我们提供了相应的方法，首先来看下一下效果吧，html如下：

	<body>
		<p>段落一，这仅仅是一些测试文字！</p>
		<p>段落二，这仅仅是一些测试文字！</p>
		<p>段落三，这仅仅是一些测试文字！</p>
		<p>段落四，这仅仅是一些测试文字！</p>
		<p>段落五，这仅仅是一些测试文字！</p>
	</body>
	
jQuery中提供了相应的包装元素的方法：`.wrap( content )`、`.wrapAll( content )`以及`.wrapInner( content )`方法；

***wrap( content )***

将匹配的每个元素包装在content中，

***wrapAll( content )***

将匹配的每个元素作为一个党员包装在content中，

***wrapInner( content )***

将匹配的每个元素**内部的内容**包装在content中。

有了这3个方法，相信实现起来不难了吧：

	$('p').wrapAll('<ol></ol>')
		  .wrap('<li></li>')
		  .wrapInner('<i></i>');

首先用一对闭合的`<ol></ol>`（`<ol>`元素用于有序编号，`<ul>`元素用于无序编号），通过`.wrapAll()`方法，将所有的段落均包含在内，如：

	<ol>
		<p>段落一，这仅仅是一些测试文字！</p>
		<p>段落二，这仅仅是一些测试文字！</p>
		<p>段落三，这仅仅是一些测试文字！</p>
		<p>段落四，这仅仅是一些测试文字！</p>
		<p>段落五，这仅仅是一些测试文字！</p>
	</ol>

因为调用`.wrapAll()`方法返回的，是一个包装`<ol>`元素之后的对所有段落元素的引用的jQuery对象，可以继续对其调用jQuery实例方法，`.wrap()`将匹配的每一个元素包装在参数所给的内容中，则结果如下：

	<ol>
		<li><p>段落一，这仅仅是一些测试文字！</p></li>
		<li><p>段落二，这仅仅是一些测试文字！</p></li>
		<li><p>段落三，这仅仅是一些测试文字！</p></li>
		<li><p>段落四，这仅仅是一些测试文字！</p></li>
		<li><p>段落五，这仅仅是一些测试文字！</p></li>
	</ol>

这就完成了对所有段落的有序编号，只有两行代码，比自己写循环要简单非常非常的多，使用起来也非常的方便。

在看到了两个包装方法的应用后，再来看下最后一个`.wrapInner()`，将匹配元素每个元素**内部的内容**包装在所给参数值，其含义很明显了，就是将段落的内容保存到常熟中，其运行结果如下：

	// <i>：倾斜
	<ol>
		<li><p><i>段落一，这仅仅是一些测试文字！</i></p></li>
		<li><p><i>段落二，这仅仅是一些测试文字！</i></p></li>
		<li><p><i>段落三，这仅仅是一些测试文字！</i></p></li>
		<li><p><i>段落四，这仅仅是一些测试文字！</i></p></li>
		<li><p><i>段落五，这仅仅是一些测试文字！</i></p></li>
	</ol>
	
## 四、替换 ##

	<p><b>段落一，这仅仅是一些测试文字！</b></p>
	<p>段落二，这仅仅是一些测试文字！</p>
	<p>段落三，这仅仅是一些测试文字！</p>

在jQuery的DOM操作方法中，jQuery为我们提供了两个替换方面的方法：`.replaceWith( content )`和`.replaceAll( selector )`。还有两个设置匹配元素值的方法，也可以类似的看成是替换：`html()`和`text()`方法，

***replaceWith( content )***

将匹配的元素替换为content，

	$('p').replaceWith('by replaceWith ! ');
	
	// 结果
	by replaceWith ! 
	by replaceWith ! 
	by replaceWith ! 

***replaceAll( selector )***

将selector选择符匹配的元素替换为匹配的元素，

这里要说一下的就是，这里有两个匹配的元素，前面一个是selector（即参数）所选中的匹配元素，后面的一个是调用此方法的jQuery对象中包含的元素，即运行此方法上下文所包含的元素。

	$('<p>无段落序号，这仅仅是一些替代文字！</p>').replaceAll('p');

	// 结果
	<p>无段落序号，这仅仅是一些替代文字！</p>
	<p>无段落序号，这仅仅是一些替代文字！</p>
	<p>无段落序号，这仅仅是一些替代文字！</p>

***html( [content] )***

函数参数content可省略，省略后调用此方法，会返回所有匹配元素中**第一个元素**的HTML内容；若不省略content，会将每个匹配的元素的HTML内容读设置为content。

	$('p').html();  // <p>段落一，这仅仅是一些测试文字！</p>
	
	$('p').first().html('<h2>设置HTML</h2>');
	
	// 结果
	<p><h2>设置HTML</h2></p>
	<p>段落二，这仅仅是一些测试文字！</p>
	<p>段落三，这仅仅是一些测试文字！</p>

***text( [content] )***

跟`html()`一样，省略content，则会返回**所有匹配元素**的文本内容，返回一个字符串；若不省略content，则设置每个匹配元素的文本内容为传入值content。

	$('p').text();
	// 段落一，这仅仅是一些测试文字！段落二，这仅仅是一些测试文字！段落三，这仅仅是一些测试文字！
	
	$('p').text('<b>无段落序号，这仅仅是一些替代文字！</b>');
	
	// 结果
	<p>&lt;b&gt;无段落序号，这仅仅是一些替代文字！&lt;/b&gt;</p>
	<p>&lt;b&gt;无段落序号，这仅仅是一些替代文字！&lt;/b&gt;</p>
	<p>&lt;b&gt;无段落序号，这仅仅是一些替代文字！&lt;/b&gt;</p>

## 五、复制元素 ##

复制元素jQuery中只提供了一个方法`clone( [ boolean ] )`方法，

默认情况下，`.clone()`方法不会复制匹配的元素或其后代元素中绑定的事件，不过，当为此函数传递一个true的boolean值时，就可以连同事件一起赋值，即`.clone( true )`。

	// html
	<button id='btn1'>测试复制</button>
	
	// js
	$('#btn1').click(function(){
		alert('测试复制事件！');
	});
	
	$('#btn1').clone(true).appendTo('body');

测试结果是，点击复制的按钮也会弹出警示框显示`测试复制事件！`，而没有设置参数的时候，点击复制后的按钮不会有任何相应。

</br>

===

**未完待续。。。**

