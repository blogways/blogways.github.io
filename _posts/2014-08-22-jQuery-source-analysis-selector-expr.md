---
layout: post
category: jQuery
title: jQuery源码解读[11] -- 选择符表达式
tags: ['$', 'jQuery', '源码', 'CSS选择符','表达式']
author: 万洲
email: wanzhou@asiainfo.com
description: jQuery的工厂函数$()用于在页面中查找要操作的元素，接收一个按照类似CSS语法构成的字符串作为参数，这个字符串参数就叫做选择符表达式
---

## 测试用html：##


	<body>
		<span class='article'>
			<h2>测试标题一</h2>
			<p id='p1'>段落一，测试段落，仅供测试之用！！！<a href='#'>linkage</a></p>
			<a href='#'>read more!</a>
		</span>
		<div class='article'>
			<h2>测试标题二</h2>
			<p id='p2'>段落二，测试段落，仅供测试之用！！！<a href='#'>linkage</a></p>
			<a href='#'>read more!</a>
		</div>
		<span class='article'>
			<h2>测试标题三</h2>
			<p id='p3'>段落三，测试段落，仅供测试之用！！！<a href='#'>linkage</a></p>
			<a href='#'>read more!</a>
		</div>
		<span class='article'>
			<h2>测试标题四</h2>
			<p id='p4'>段落四，测试段落，仅供测试之用！！！<a href='#'>linkage</a></p>
			<a href='#'>read more!</a>
		</div>
		... // 后面省略的全部为<div class='article'>...</div>元素
		<input type='button' class='article'>提交</input>
	</body>



## 一、简单的CSS选择符 ##

<table width='100%'>
<tr><th width='40%'>选择符</th><th>匹配</th></tr>
<tr><td>*</td><td>匹配所有元素</td></tr>
<tr><td>#id</td><td>匹配带有给定id的元素</td></tr>
<tr><td>element</td><td>给定元素类型的所有元素</td></tr>
<tr><td>.class</td><td>匹配给定类的所有元素</td></tr>
<tr><td>a, b</td><td>与a或b匹配的元素</td></tr>
<tr><td>a b</td><td>a的所有后代元素中，与b匹配的元素</td></tr>
<tr><td>a > b</td><td>作为a子元素的所以b元素</td></tr>
<tr><td>a + b</td><td>a之后的第一个与b匹配的兄弟元素</td></tr>
<tr><td>a - b</td><td>a之后的所有兄弟元素中与b匹配的元素</td></tr>
</table>
	
测试代码：

	$('*') 	// 匹配上面html文档中的所有元素
	
	$('#p1') 	// 匹配html文档中id='p1'的元素，即为段落一的<p>元素
	
	$('p') 	  // 匹配html文档中所有的<p>元素，即所有的段落
	
	$('.article') 	// 匹配所有class='article'的元素
	
	$('h2,a')   // 匹配所有的<h2>或<a>元素
	
	$('div a')  // 匹配<div>元素所有后代中的，所有的<a>元素，此处为html中所有的<a>元素
	
	$('div > a')  // 匹配<div>元素的子元素中的<a>元素，此处为所有<a href='#'>read more!</a>

</br>

===

## 二、同辈元素间定位 ##

<table width='100%'>
<tr><th width='40%'>选择符</th><th>匹配</th></tr>

<tr><td>:nth-child(index)</td>
	<td>匹配父元素的第index个子元素(从1开始计数)</td></tr>
	
<tr><td>:nth-child(even)</td>
	<td>匹配父元素的下标(索引)为<b><i>偶数的</b></i>子元素(从1开始计数)</td></tr>
	
<tr><td>:nth-child(odd)</td>
	<td>匹配父元素的下标(索引)为<b><i>奇数的</b></i>子元素(从1开始计数)</td></tr>
	
<tr><td>:nth-child(formula)</td>
	<td>匹配父元素的第n个子元素(从1开始计数)，formula(公式)格式为an+b，a和b为整数</td></tr>
	
<tr><td>:nth-last-child()</td>
	<td>与:nth-child()相同(从最后一个元素，由1开始向前计数)</td></tr>
	
<tr><td>:first-child</td>
	<td>匹配父元素的第一个子元素</td></tr>
	
<tr><td>:last-child</td>
	<td>匹配父元素的最后一个子元素</td></tr>
	
<tr><td>:only-child</td>
	<td>匹配父元素唯一一个子元素，若有多个元素，匹配为空</td></tr>
	
<tr><td>:nth-of-type()</td>
	<td>与:nth-child()的功能相同，只是此方法只计相同元素</td></tr>
	
<tr><td>:nth-last-of-type()</td>
	<td>与:nth-of-type()的功能相同，但是计数从最后一个元素开始</td></tr>
	
<tr><td>:first-of-type</td>
	<td>同名的元素中的第一个元素</td></tr>
	
<tr><td>:last-of-type</td>
	<td>同名元素中的最后一个元素</td></tr>
	
<tr><td>:only-of-type</td>
	<td>没有同名的同辈元素的元素</td></tr>
	
</table>

测试代码：

	$('.article:nth-child(1)') 	 // 匹配第一个class='article'元素，
	// 无论<div>,<span>,<input>都行，(以后简称.article元素)
	
	$('.article:nth-child(even)') 	  // 匹配偶数位置(2,4,6,8...)的.article元素
	
	$('.article:nth-child(odd)')   // 匹配奇数位置(1,3,5,7...)的.article元素
	
	$('.article:nth-child(2n+1)')   // 匹配奇数位置(1,3,5,7...)的.article元素
	// 即当n为0,1,2,3...时，表达式2n+1的值即为匹配元素
	
	$('.article:nth-last-child(2)')  // 匹配倒数第2个.article元素
	
	$('.article:first-child')  // 匹配第一个.article元素
	
	$('.article:last-child')  // 匹配最后一个.article元素
	
	$('.article:only-child')  // 因为匹配元素中不止一个.article元素，匹配为空
	
	$('.article:nth-of-type(2)')  // 匹配同类元素中的第二个元素，
	// 首先会找到含有class＝'article'所有元素，然后根据元素名称分类，
	// 最后匹配不同分类中的第二个元素(如果存在的话)
	// 此处匹配段落二和段落四所在的元素
	
	$('.article:nth-last-of-type(1)') 	// 分别匹配同类元素中倒数第一个元素
	// 此处匹配段落二和段落四，还有最后一个<input>元素
	
	$('.article:first-of-type')  // 分别匹配同类元素中的第一个元素
	// 此处匹配段落一、段落二所在元素，和最后一个<input>元素
	
	$('.article:last-of-type')  // 分别匹配同来元素中的最后一个元素
	// 雨nth-last-of-type(1)匹配结果相同
	
	$('.article:only-of-type')  // 匹配当前jQuery对象元素中，没有同名同辈元素的元素
	// 如当前jQuery对象元素中，仅仅包含一个<input class='article'>...</input>元素，
	// 那么此元素即为匹配元素
	// 此处匹配最后一个<input>元素
	
</br>

===

## 三、匹配元素间定位 ##

<table width='100%'>
<tr><th width='40%'>选择符</th><th>匹配</th></tr>

<tr><td>:first</td>
	<td>结果集中的第一个元素</td></tr>
	
<tr><td>:last</td>
	<td>结果集中的最后一个元素</td></tr>
	
<tr><td>:not(selector)</td>
	<td>结果集中与selector不匹配的所有元素</td></tr>
	
<tr><td>:even</td>
	<td>结果集中的偶数元素(从0开始计数)</td></tr>
	
<tr><td>:odd</td>
	<td>结果集中的奇数元素(从0开始计数)</td></tr>
	
<tr><td>:eq(index)</td>
	<td>结果集中下标(索引)为index的元素(从0开始计数)</td></tr>
	
<tr><td>:gt(index)</td>
	<td>结果集中位于给定下标(索引)之后的所有元素(从0开始计数)</td></tr>
	
<tr><td>:lt(index)</td>
	<td>结果集中位于给定下标(索引)之前的所有元素(从0开始计数)</td></tr>
	
</table>

测试代码：

	:first  :last  与 :first-child  :last-child结果一样

由于匹配元素间定位计数都是从0开始，而同辈元素间匹配是从1开始，

	:even 与 :nth-child(odd) 结果一样；
	:odd 与 nth-child(even) 结果一样
	
相同的或者类似的此处不再介绍，

	$('.article:not(div,span)')  // 匹配jQuery包含class＝'article'的不为<dib>和<span>的元素
	// 此处匹配最后一个<input>元素
	
	$('.article:eq(0)')  //  匹配第一个.article元素，:eq(index)功能与nth-child(index)一样，
	// 只不过:eq(index)从下标从0开始计数
	
	$('.article:gt(3)')  // 匹配从第4个.article元素之后的所有元素(不包括第四个)
	
	$('.article:lt(3)')   // 匹配从第4个.article元素之前的所有元素(不包括第四个)，
	// 此处匹配前三个.article元素

</br>

===

## 四、属性匹配 ##

<table width='100%'>
<tr><th width='40%'>选择符</th><th>匹配</th></tr>

<tr><td>[attr]</td>
	<td>匹配带有属性attr的元素</td></tr>
	
<tr><td>[attr='val']</td>
	<td>匹配attr属性的值为val的元素</td></tr>
	
<tr><td>[attr!='val']</td>
	<td>匹配attr属性值不为val的元素</td></tr>
	
<tr><td>[attr^='val']</td>
	<td>匹配attr属性值以val开头的元素</td></tr>
	
<tr><td>[attr$='val']</td>
	<td>匹配attr属性值以val结尾的元素</td></tr>
	
<tr><td>[attr*='val']</td>
	<td>匹配attr属性值包含字符串val的元素</td></tr>
	
<tr><td>[attr~='val']</td>
	<td>匹配attr属性值是多个空格分开的字符串，其中一个为val的元素</td></tr>
	
<tr><td>[attr|='val']</td>
	<td>匹配attr属性值为val，或者以val开头后面跟一个连接符(-)的元素</td></tr>
	
</table>

测试代码：

	$('article > [href]')  // 匹配包含class＝'article'元素的子元素中，带有href属性的元素
	// 此处为所有的a元素，如果在<p>元素中也包含a元素，将不会匹配在内
	
	$('article [href]')  // 匹配包含class＝'article'元素所有后代元素中，带有href属性的元素
	// 与上面一个一样，匹配所有a元素，包含在<p>元素中的<a href=''>元素
	
	$('.article [href='#']')   // 匹配包含class＝'article'元素所有后代元素中，带有href属性的元素
	// 且属性值为'#'的元素
	
	[href!='www.baidu.com']  // 匹配属性href不为‘www.baidu.com’的元素
	
	[href^='www']  // 匹配所有包含属性href，且href属性值以‘www’开头的元素
	
	[href$='com']  // 匹配所有包含属性href，且href属性值以‘com’结尾的元素
	
	[href*='baidu']  // 匹配所有包含属性href，且href属性值中包含‘baidu’的元素
	
	[class~='hover']  // 匹配class='hover article blsf sflsj'的元素
	
	[class|='my']   // 匹配class='my'或class='my-xxx'的元素
	

</br>

===

## 五、表单匹配 ##

<table width='100%'>
<tr><th width='40%'>选择符</th><th>匹配</th></tr>

<tr><td>:input</td>
	<td>匹配所有&lt;input&gt;、&lt;select&gt;、&lt;textarea&gt;、&lt;button&gt;的元素</td></tr>
	
<tr><td>:text</td>
	<td>匹配type='text'的&lt;input&gt;元素</td></tr>
	
<tr><td>:password</td>
	<td>匹配type='password'的&lt;input&gt;元素</td></tr>
	
<tr><td>:file</td>
	<td>匹配type='file'的&lt;input&gt;元素</td></tr>
	
<tr><td>:radio</td>
	<td>匹配type='radio'的&lt;input&gt;元素</td></tr>
	
<tr><td>:checkbox</td>
	<td>匹配type='checkbox'的&lt;input&gt;元素</td></tr>
	
<tr><td>:submit</td>
	<td>匹配type='submit'的&lt;input&gt;元素</td></tr>
	
<tr><td>:image</td>
	<td>匹配type='image'的&lt;input&gt;元素</td></tr>
	
<tr><td>:reset</td>
	<td>匹配type='reset'的&lt;input&gt;元素</td></tr>
	
<tr><td>:button</td>
	<td>匹配type='button'的&lt;input&gt;元素</td></tr>
	
<tr><td>:enabled</td>
	<td>匹配启用的表单元素</td></tr>
	
<tr><td>:disabled</td>
	<td>匹配禁用的表单元素</td></tr>
	
<tr><td>:checked</td>
	<td>匹配选中的复选框和单选按钮元素</td></tr>
	
<tr><td>:selected</td>
	<td>匹配选中的&lt;option&gt;元素</td></tr>

</table>

</br>

===

## 六、自定义选择符 ##

<table width='100%'>
<tr><th width='40%'>选择符</th><th>匹配</th></tr>

<tr><td>:root</td>
	<td>文档的根节点</td></tr>
	
<tr><td>:header</td>
	<td>标题元素(如&lt;h1&gt;、&lt;h2&gt;等)</td></tr>
	
<tr><td>:animated</td>
	<td>匹配当前jQuery对象元素中，其动画正在播放的元素</td></tr>
	
<tr><td>:contains(text)</td>
	<td>匹配当前jQuery对象元素中，包含给定文本text的元素</td></tr>
	
<tr><td>:empty</td>
	<td>匹配当前jQuery对象元素中，不包含子节点的元素</td></tr>
	
<tr><td>:has(selector)</td>
	<td>匹配当前jQuery对象元素中，后代元素中有和selector匹配的元素</td></tr>
	
<tr><td>:parent</td>
	<td>匹配当前jQuery对象元素中，包含子节点的元素</td></tr>
	
<tr><td>:hidden</td>
	<td>匹配当前jQuery对象元素中，隐藏的元素，包括通过css隐藏的元素和&lt;input type='hidden' /&gt;</td></tr>
	
<tr><td>:visible</td>
	<td>匹配当前jQuery对象元素中，显示的元素(即与:hidden相反的元素)</td></tr>
	
<tr><td>:focus</td>
	<td>匹配当前jQuery对象元素中，获得焦点的元素</td></tr>
	
<tr><td>:lang(language)</td>
	<td>匹配当前jQuery对象元素中，具有指定语言代码的元素(即指定了lang属性，或在&lt;meta&gt;标签中申明的)</td></tr>
	
<tr><td>:target</td>
	<td>匹配URI标识符指向的目标元素</td></tr>

</table>

</br>

===

**未完待续。。。**

