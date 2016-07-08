---
layout: post
category: jQuery
title: Prototype.js  源码学习 
tags: ['Prototype.js', '源码']
author: 张可
description: prototype.js主要给js原生的类扩展了很多实用的方法，在学习过程中不仅可以学到怎样编写JS代码，怎样规范代码， 还可以加深对	JS原生方法的理解。

---

## 一、整体架构学习
总的来说prototype.js主要给js原生的类扩展了各的方法，通过两种方式扩展，主要用到下面这个函数扩展。

	Object.extend = function(destination, source) {
		  for (property in source) {
		    destination[property] = source[property];
		  }
		  return destination;
	}

第一种就是直接扩展，这样就直接扩展进了某个类的方法中，可以直接调用。

	Object.extend(String.prototype, {
	    /*
	     * 将Html转换为纯文本，例如：
	     * var s="<font color='red'>hello</font>";
	     * s.stripTags()将得到“hello”。
	     */
	    stripTags: function() {
	        return this.replace(/<//?[^>]+>/gi, '');
	    }
	});

	

第二种就是现在源码中定义一个类，然后直接扩展进去比如定义的Enumerable类可以扩展进Array 和 Hash 等，方式如下：
	
	var YourObject = Class.create(); 
	Object.extend(YourObject.prototype, Enumerable); 
	Object.extend(YourObject.prototype, { 
		initialize: function() { 
			// 构造函数
		}, 
		_each: function(iterator) { 
			// 迭代代码，每次循环时调用 iterator 
		}, 
		// 其它自定义方法，包括需要重写的 Enumerable 方法 
	}); 
要用到Enumerable 必须添加进 _each方法。
prototype.js 就是通过这种方式扩展的方法，这个源码都遵循这两个规则。

## 二 方法学习

最常用的就是this.each(function(value, index)这样进行迭代，相比下面总是省下了很多代码。
	
	for (var index = 0; index < myArray.length; ++index) {
		var value = myArray[index]; 
		// 你的代码... 
	};

	
方法一个个也说不完，总的来说就是掌握好源码内部定义的工具类和方法  然后再掌握好JS里原生方法，再掌握好一些判断的知识就能很好的学习Prototype.js ，有很多方法仅仅对原生方法进行简单的封装使之更容易调用。学习的时候代码中如何进行变量名命名，注意代码的格式等。



