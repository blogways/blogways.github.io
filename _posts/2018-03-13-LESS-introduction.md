---
layout: post 	
category: Less      
title: LESS简述
tags: ['Less']   
author: 顾瑞棋
image: /images/less.jpg   
email: gurq@gmail.com  
description: LESS简述
---
# LESS简述

****
## 什么是LESS
    Less 是一门 CSS 预处理语言,它扩展了 CSS 语言,增加了变量、Mixin、函数等特性。

## 变量

1. 书写形式： @变量名 例如：@fjore,@var
2. 可用变量名定义为变量即变量名作为变量的值
          
		@fnord:"I am fnord";@var:"fnord";
		则 @@var 输出"I am fnord";
3. LESS中的变量为完全的‘常量’，所以只能定义一次
4. @arguments 变量:@arguments包含了所有传递进来的参数

		 .box-shadow (@x: 0, @y: 0, @blur: 1px, @color: #000) {
		   box-shadow: @arguments;
		   -moz-box-shadow: @arguments;
		   -webkit-box-shadow: @arguments;
		}

## 混合 
1. 定义： 定义一些通用的属性集为一个class,然后在另一个class中去调用这些属性
2. 形式：  

	    .bordered {border-top: dotted 1px black;  
	  	border-bottom: solid 2px black;  
		}  
	          	
	    #menu a {  
	  	color: #111;  
	 	 .bordered;  
		}  
a标签就会包含.bordered的属性  
通用属性要定义为Class属性  

## 带参数的混合
1. 定义:像函数一样定义一个带参数的属性集合:
2. 形式：
 
		.border-radius (@radius) {  
	   	    border-radius: @radius;  
		    -moz-border-radius: @radius;  
		    -webkit-border-radius: @radius;  
		 }  

    调用：

		#header {  
	  	.border-radius(4px);  
		}  
		.button {
	 	 .border-radius(6px);  
		}
3.默认值的形参：  

		.border-radius (@radius: 5px) {
		  border-radius: @radius;
		  -moz-border-radius: @radius;
		  -webkit-border-radius: @radius;
		} 
调用时  

		#header {
		  .border-radius;//不带参数默认5px;  
		}
4.定义不带参数属性集合,如果你想隐藏这个属性集合，不让它暴露到CSS中去，但是你还想在其他的属性集合中引用
		
		.wrap () {
		  text-wrap: wrap;
		  white-space: pre-wrap;
		  white-space: -moz-pre-wrap;
		  word-wrap: break-word;
		}
**即在类名后加括号，不加括号会被认为是一般类的属性集合，编译css时会显示在css文件中；**

## 模式匹配
1. 定义：有些情况下，我们想根据传入的参数来改变混合的默认呈现
2. 形式：  

		.mixin (dark, @color) {
		  color: darken(@color, 10%);
		}
		.mixin (light, @color) {
		  color: lighten(@color, 10%);
		}
		.mixin (@_, @color) {
		  display: block;
		}
3. 只有被匹配的混合才会被使用。变量可以匹配任意的传入值，而变量以外的固定值就仅仅匹配与其相等的传入值。
4. 也可以匹配多个参数：

		.mixin (@a) {
		  color: @a;
		}
		.mixin (@a, @b) {
		  color: fade(@a, @b);
		}

## 导引  
1. 根据表达式进行匹配，而非根据值和参数匹配时；when关键字用以定义一个导引序列。
2.   
  
		.mixin (@a) when (lightness(@a) >= 50%) {
		  background-color: black;
		}
		.mixin (@a) when (lightness(@a) < 50%) {
		  background-color: white;
		}
		.mixin (@a) {
		  color: @a;
		}
3. 导引中可用的全部比较运算有： > >= = =< <。此外，关键字true只表示布尔真值，除去关键字true以外的值都被视示布尔假：
4. 导引序列使用逗号‘,’—分割，当且仅当所有条件都符合时，才会被视为匹配成功。  
   例：.mixin (@a) when (@a > 10), (@a < -10) { ... }
5. 想基于值的类型进行匹配，我们就可以使用is*函式：  
   .mixin (@a, @b: 0) when (isnumber(@b)) { ... }；  
   常见的检测函式：
   iscolor  
   isnumber  
   isstring  
   iskeyword  
   isurl  
   ispixel  
   ispercentage  
   isem
6. 在导引序列中可以使用and关键字实现与条件；使用not关键字实现或条件

## 嵌套规则
1. LESS 可以让我们以嵌套的方式编写层叠样式

   		#header { color: black; }
		#header .navigation {
  			font-size: 12px;
		}
		#header .logo { 
		    width: 300px; 
		}
		#header .logo:hover {
		    text-decoration: none;
		}
可写成：
		#header {
		  color: black;
		
		  .navigation {
		    font-size: 12px;
		  }
		  .logo {
		    width: 300px;
		    &:hover { text-decoration: none }
		  }
		}

2. 注意 & 符号的使用—如果你想写串联选择器，而不是写后代选择器，就可以用到&了. 这点对伪类尤其有用如 :hover 和 :focus.

		.bordered {
		  &.float {
		    float: left; 
		  }
		  .top {
		    margin: 5px; 
		  }
		}
会输出：

		.bordered.float {
		  float: left;  
		}
		.bordered .top {
		  margin: 5px;
		}

3. 串联选择器与后代选择器的区别：

		串联选择器：作用在同一个标签上
		
		<div class=”a” id ="qq"><span>look at the color</span></div>
		
		css: #qq.a{
		
		….
		
		}

		后代选择器：作用在不同标签上
		
		<div  id ="qq"><span class=”a”>look at the color</span></div>
		
		css: #qq .a{
		
		}

		注意#qq .a 之前有空格

## 运算
1.任何数字、颜色或者变量都可以参与运算

	@base: 5%;
	@filler: @base * 2;
	@other: @base + @filler;
	
	color: #888 / 4;
	background-color: @base-color + #111;
	height: 100% / 2 + @filler;

## 命名空间
1.命名空间与混合的区别
	混合类似于 类选择器 以.开头
    命名空间  以   # 开头

2.

	#bundle {
	  .button () {
	    display: block;
	    border: 1px solid black;
	    background-color: grey;
	    &:hover { background-color: white }
	  }
	  .tab { ... }
	  .citation { ... }
	}
使用时

	#header a {
	  color: orange;
	  #bundle > .button;
	}

## 作用域
1. LESS 中的作用域跟其他编程语言非常类似，首先会从本地查找变量或者混合模块，如果没找到的话会去父级作用域中查找，直到找到为止.

		@var: red;
		
		#page {
		  @var: white;
		  #header {
		    color: @var; // white
		  }
		}
		
		#footer {
		  color: @var; // red  
		}

## 避免编译
1. 有时候我们需要输出一些不正确的CSS语法或者使用一些 LESS不认识的专有语法.

要输出这样的值我们可以在字符串前加上一个 ~ ：

		.class {
		  filter: ~"ms:alwaysHasItsOwnSyntax.For.Stuff()";
		}
我们可以将要避免编译的值用 “”包含起来，输出结果为:


	.class {
	  filter: ms:alwaysHasItsOwnSyntax.For.Stuff();
	}

## 注释
CSS 形式的注释在 LESS 中是依然保留的:

	/* Hello, I'm a CSS-style comment */
	.class { color: black }
LESS 同样也支持双斜线的注释, 但是编译成 CSS 的时候自动过滤掉:
	
	// Hi, I'm a silent comment, I won't show up in your CSS
	.class { color: white }

## 字符串插值
变量可以用类似ruby和php的方式嵌入到字符串中，像@{name}这样的结构:
	
	@base-url: "http://assets.fnord.com";
	background-image: url("@{base-url}/images/bg.png");

## JavaScript 表达式
JavaScript 表达式也可以在.less 文件中使用. 可以通过反引号的方式使用:

	@var: `"hello".toUpperCase() + '!'`;
输出:

	@var: "HELLO!";
注意你也可以同时使用字符串插值和避免编译:

	@str: "hello";
	@var: ~`"@{str}".toUpperCase() + '!'`;
输出:

	@var: HELLO!;
它也可以访问JavaScript环境:
		
	@height: `document.body.clientHeight`;
如果你想将一个JavaScript字符串解析成16进制的颜色值, 你可以使用 color 函数:

	@color: color(`window.colors.baseColor`);
	@darkcolor: darken(@color, 10%);