---
layout: post
title: Zen Coding：快速编写HTML
category: web前端
tags: ['Web']
author: 景阳
# image: /images/jyjsjd/Django_logo.png
email: jingyang@asiainfo.com
description: 介绍Zen Coding快速编写 HTML
---

## 一、概述
HTML 语言很简单，但是却比较难写。各种标签、符号实在是太多了，标签又包含很多属性、class、id。想写出一个好看的静态页面确实是非常耗时而且麻烦。

下面要介绍的 Zen Coding 是一种借助 CSS 选择器的方式帮你快速编写 HTML 代码的方法。它能用很短的语句写出很长的 HTML 代码。

让我们来见识一下它的威力。

## 二、实例介绍
在开始使用 Zen Coding 之前，介绍一下它支持的 CSS 选择器：

- E：
元素名称(div, p);
- E#id：
使用id的元素(div#content, p#intro, span#error);
- E.class：
使用类的元素(div.header, p.error.critial). 你也可以联合使用class和idID: div#content.column.width;
- E>N：
子代元素(div>p, div#footer>p>span);
- E+N：
兄弟元素(h1+p, div#header+div#content+div#footer);
- E*N：
元素倍增(ul#nav>li*5>a);
- E$*N：
条目编号 (ul#nav>li.item-$*5);

Zen Coding 其实就是基于这样的语法来快速生成 HTML 的。

### 编辑器
下面所做的演示全部都来自 *Atom*，*Brackets* 同样也支持 Zen Coding。

### 实例一
在编辑器中输入：
```！```
然后按*tab*键。
最后生成的结果是：

![example1.png](/images/jyjsjd/example1.png)

没错就是这么*神奇*。

### 实例二
在页面中添加一个 class 为 *col-sm-6* 的 div 标签，只需要输入
```div.col-sm-6```，然后按 tab 键。

如果想添加12个 class 为 *col-sm-1* 的 div 标签呢？

只需要输入```div.col-sm-1*12```。

同理，如果想要输出 id 为 test 的 div 标签只需要把`.`换成`#`就行了。

### 实例四
在页面中添加

![example2.png](/images/jyjsjd/example2.png)

输入`h1+p`即可。

### 实例五
想要下面这种效果？

![example3.png](/images/jyjsjd/example3.png)

输入```div.item$*3```！
