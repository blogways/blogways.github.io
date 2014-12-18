---
layout: post
category: jQuery
title: jQuery源码解读[3] -- 简单DOM遍历方法
tags: ['$', 'jQuery', 'DOM', '遍历方法','next/nextAll','addBack','siblings','parent','children']
author: 万洲
email: wanzhou@asiainfo.com
#image:
description: jQuery中一个简单的后代元素、同辈元素、祖先元素、集合元素的DOM遍历方法介绍，及一些简单的应用
---

## 一、前言 ##

DOM遍历有两个核心的函数，其它的遍历方法都通过调用这两个方法来间接实现相应的功能，这两个核心函数的函数原型，如：

	dir: function( elem, dir, until ) {},
	sibling: function( n, elem ) {}
`dir( elem, dir, until )`，从一个元素出发，迭代检索某个方向上的所有元素并记录，直到与遇到 document 对象或遇到 until 匹配的元素；

`sibling( n, elem )`，返回 n 元素的所有后续兄弟元素，包含 n，不包含 elem, 返回 n 的兄弟节点(把 n, elem 设为相同元素时，则不返回本身).

然后通过`jQuery.extend()`方法将两个核心函数扩展到`jQuery`全局对象中去，以便后面需要的时候直接通过`jQuery.dir/sibling`调用。

### 1、dir( elem, dir, until )和sibling( n, elem )的实现 ###

在`jquery-1.11.1.js`中，其源码如下所示：


	jQuery.extend({
	 	// elem		起始元素
	 	// dir		迭代方向，可选值：parentNode nextSibling previousSibling
	 	// until	选择器表达式，如果遇到until匹配的元素，迭代终止
		dir: function( elem, dir, until ) {
			var matched = [],	// 保存匹配元素
				// 根据dir从elem取出一个元素作为匹配的开始节点，
				// cur表示匹配开始节点，为当前节点在dir迭代方向的下一个节点，
				// 因此匹配结果不包含本节点
				cur = elem[ dir ];

			// 通过while循环 、 cur = cur[dir]（根据迭代方向，向后移动一个节点），
			// 实现向迭代方向的遍历，
			// 当遍历完，或遇到document（cur.nodeType === 9），
			// until匹配的元素（ jQuery( cur ).is( until ) ）时，结束遍历，返回结果
			while ( cur && cur.nodeType !== 9 && (until === undefined 
							|| cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
				if ( cur.nodeType === 1 ) {
					// 将匹配的Element元素压入matched结果集中
					matched.push( cur );
				}
				cur = cur[dir]; 	// 像dir方向，往后一个节点
			}
			return matched;
		},
		
		// n	  起始元素（包含在返回结果中）
		// elem	  剔除元素（不包含在结果集中）
		sibling: function( n, elem ) {
			var r = [];
			
			// 将 n 是否存在作为判断循环是否继续的依据，
			// 先判断 n 的存在与否，再移动当前节点，
			// 因此结果集中包含 n 
			for ( ; n; n = n.nextSibling ) {
				// 当元素类型为Element 且 节点不为 elem 时，
				// 将当前元素压入结果集，
				if ( n.nodeType === 1 && n !== elem ) {
					r.push( n );
				}
			}
			return r;
		}
	});
从上面的代码可以发现，虽然两个核心函数的代码量很少，但是实际上用它们能实现的功能是非常强大的。就拿`dir`函数来说，它支持3个迭代方向，这意味着它能实现至少3个函数的功能，再加上`until`是选择器表达式，所有它能遍历筛选的元素是非常多的。

`dir( elem, dir, until )`函数中判断遇到`until`匹配元素结束迭代的判断语句：

	until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until ) 
其隐含的表达出了执行最后一个判断语句（即遇到`until`匹配元素结束迭代）的执行条件是：

	until !== undefined && cur.nodeType === 1
即`until`必须存在，`cur`节点必须是`Element`元素，这种写法虽然阅读和维护都不是很方便，但是看上去比较简洁，同时节约了很多的代码，在`jQuery`中很多地方都使用了这种写法，有兴趣可以自己去看看。

### 2、has、closest、index、add、addBack扩展

在向`jQuery`扩展两个核心函数的同时，也通过`jQuery.fn.extend`向**实例对象**扩展了遍历方法，如：

	jQuery.fn.extend({
		// 判断当前元素集合中，是否包含target选择符指定的元素
		// 当前元素集合指调用has的实例对象当中的元素
		has: function( target ) {},
		
		// 与选择符selectors匹配的第一个元素，遍历路径从选中元素开始，
		// 沿DOM树向上在其中祖先节点中查找
		closest: function( selectors, context ) {},

		// 在当前元素集合中，返回给定elem元素所在的索引位置
		index: function( elem ) {},

		// 为选中的元素（当前匹配元素集合），加上与给定选择符selector匹配的元素
		add: function( selector, context ) {},

		// 为选中的元素，加上内部jQuery栈中与给定选择符selector匹配的元素
		addBack: function( selector ) {}
	});

## 二、遍历方法 ##

### 1、遍历方法的函数原型 ###

首先调用两个核心函数，实现相应的遍历方法，然后将这些方法一起包装到一个对象`{}`当中，最后通过`jQuery.each`遍历这个方法对象，并在其回调函数中通过`jQuery.fn[ name ] = function9){}`添加到**实例对象**中，其函数原型如下所示：

	jQuery.each({
		parent: function( elem ) { 	// 父元素
			var parent = elem.parentNode;
			
			// 有父元素，且父元素不为DocumentFragment时，返回父元素
			// 否则返回null
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents: function( elem ) { 	// 祖先元素
			// 检索所有祖先元素，直到document
			return jQuery.dir( elem, "parentNode" );
		},
		
		// 每个选中元素的所有祖先元素，直到但不包含util的祖先元素，
		parentsUntil: function( elem, i, until ) {  
			// 检索所有祖先元素，直到遇到与until匹配的元素
			return jQuery.dir( elem, "parentNode", until );
		},
		next: function( elem ) { 	// 每个选中元素紧邻的下一个同辈元素
			return sibling( elem, "nextSibling" );
		},
		prev: function( elem ) { 	// 每个选中元素紧邻的上一个同辈元素
			return sibling( elem, "previousSibling" );
		},
		nextAll: function( elem ) { 	// 每个选中元素之后的所有同辈元素
			return jQuery.dir( elem, "nextSibling" );
		},
		prevAll: function( elem ) { 	// 每个选中元素之前的所有同辈元素
			return jQuery.dir( elem, "previousSibling" );
		},
		
		// 匹配每个选中元素之后的所有同辈元素，
		// 直到遇到与until匹配的元素，不包含until
		nextUntil: function( elem, i, until ) {  
			return jQuery.dir( elem, "nextSibling", until );
		},
		prevUntil: function( elem, i, until ) {
			return jQuery.dir( elem, "previousSibling", until );
		},
		
		// 给定节点的所有同辈元素
		siblings: function( elem ) {
			// elem父元素的第一个子节点的所有兄弟元素，排除当前节点
			return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
		},
		// 子节点
		children: function( elem ) {
			// elem的第一个子节点的所有兄弟元素，即为elem的所有子节点
			return jQuery.sibling( elem.firstChild );
		},
		// 所有的子节点，包含Element、Text、Comment
		contents: function( elem ) {
			return jQuery.nodeName( elem, "iframe" ) ?
				elem.contentDocument || elem.contentWindow.document :
				jQuery.merge( [], elem.childNodes );
		}
	}, function( name, fn ) {
		// 将遍历对象中的方法扩展到jQuery实例对象中去
		jQuery.fn[ name ] = function( until, selector ) {

			// 将当前匹配集合中的元素，用fn处理，
			// 然后用until过滤处理结果，最后返回匹配结果
			var ret = jQuery.map( this, fn, until );
	
			// 不过函数名不以Until结尾
			if ( name.slice( -5 ) !== "Until" ) {
				// 不需要参数until，只有一个参数selector，util只到这里为止
				selector = until;
			}
			if ( selector && typeof selector === "string" ) {
				// 对ret数组用selector进行过滤，只留下匹配的元素
				// jQuery.filter会调用jQuery.find.matches > Sizzle.matches 
				// > Sizzle，Sizzle查找、过滤的结果已经经过排序、去重
				ret = jQuery.filter( selector, ret );
			}
	
			if ( this.length > 1 ) {
				// 去除重复
				if ( !guaranteedUnique[ name ] ) {
					ret = jQuery.unique( ret );
				}
	
				// parent或prev的遍历matched应该反转，使matched顺序更符合逻辑
				if ( rparentsprev.test( name ) ) {
					// 倒序
					ret = ret.reverse();
				}
			}
			// 根据操作结果，构造新的jQuery对象并返回用以后续操作
			return this.pushStack( ret );
		};
	});

### 应用：###

HTML：
	
    // html
	<h2>Shakespeare's Plays</h2>
    <table>
        <tr>
		        <td>As You Like It</td>
		        <td>Comedy</td>
		        <td></td>
        </tr>
        <tr>
		        <td>All's Well that Ends Well</td>
		        <td>Comedy</td>
		        <td>1601</td>
        </tr>
        <tr>
		        <td>Hamlet</td>
		        <td>Tragedy</td>
		        <td>1604</td>
        </tr>
        <tr>
		        <td>Macbeth</td>
		        <td>Tragedy</td>
		        <td>1606</td>
        </tr>
        <tr>
		        <td>Romeo and Juliet</td>
		        <td>Tragedy</td>
		        <td>1595</td>
        </tr>
        <tr>
		        <td>Henry IV, Part I</td>
		        <td>History</td>
		        <td>1596</td>
        </tr>
        <tr>
		        <td>Henry V</td>
		        <td>History</td>
		        <td>1599</td>
        </tr>
    </table>
    
CSS：

	.highlight {
		font-size: large;
        font-family: monospace;
        font-weight: bold;
		font-style: italic;
	}
	
### 1、next() ###
`next()`，每个选中元素紧邻的下一个同辈元素，给表格中包含Henry的邻近单元格加一个高亮，如：

	$('td:contains("Henry")').next().addClass('highlight');
	
`td:contains(Henry)`筛选出包含Henry内容的单元格（两处），则此时的选中元素是
	
	<td>Henry IV, Part I</td> 和 <td>Henry V</td>，
	
`next()`为选中元素的下一个同辈元素，所以在`next()`过后的选中元素是：

	<td>History</td> 和 <td>History</td>
	
将代码复制到[JSFiddle][]测试显示结果，表格里面的两个History显示为hightlight类的样式了。

</br>

### 2、nextAll() ###
`nextALl()`，选中元素之后的所有同辈元素，给表格包含Henry的之后所有单元格加高亮，如：

	$('td:contains("Henry")').nextAll().addClass('highlight');
	
其它与前面是一样的，不一样的时，在执行了`nextAll()`之后，选中的元素是：

	<td>Tragedy</td>、<td>1595</td>、<td>History</td> 和 <td>1599</td>
	
测试运行过后，可以看到两个包含Henry行的当前但与昂之后的所有单元格均显示为hightlight类的样式了。

</br>

### 3、addBack()、parent()、children() ###

`addBack()`，选中的元素，加上内部`jQuery`栈中之前选中的那一组元素，

	$('td:contains("Henry")').nextAll().addBack().addClass('highlight');
	
在执行`addBack()`之后，相应行中所有单元格都显示为hightlight类的样式了。事实上，要选择同一组元素，可以采用的方法很多，如：
	
	$('td:contains("Henry")').parent().children().addClass('highlight');

</br>

### 4、siblings() ###

`siblings()`，当前选中节点的所有同辈元素，剔除当前选中元素，

	$('td:contains("Tragedy")').siblings().addClass('highlight');
	
在执行`siblings()`之前的选中元素为表格中包含“Tragedy”的三个单元格`<td></td>`元素，而执行了`siblings()`之后，选中的元素为前面选中元素的所有同辈元素，即：
		        
	<td>Hamlet</td>
	<td>1604</td>
	<td>Macbeth</td>
	<td>1606</td>
	<td>Romeo and Juliet</td>
	<td>1595</td>
	
运行测试过后，这几项就会显示为highlight类的样式了。

测试网站推荐[JSFiddle][]!!

[JSFiddle]: http://jsfiddle.net
</br>

===

**未完待续。。。**

