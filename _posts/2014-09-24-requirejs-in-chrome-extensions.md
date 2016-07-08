---
layout: post
title: 在Chrome Extension中使用RequireJS
category: ['杂记']
tags: ['chrome extensions','RequireJS','cajon', 'unsafe-eval', 'content security policy']
author: 唐 治
email: 
url: http://t.qq.com/TZ000000001
description: 在Chrome extensions中使用RequireJS

---

RequireJS，谁用谁知道。

在浏览器环境下使用`requireJS`，其加载js文件的方式，采用的是通过创建`script`节点，及设置其`src`属性来实现。但在chrome extensions中，这项做法被认为是不安全的，而被默认禁止，这样就导致了`RequireJS`无法生效。

要想解决这个问题，有两个方案。

## 方案一：使用cajon替代requirejs

### 1. 关于cajon的简介

[cajon](https://github.com/requirejs/cajon)和`RequireJS`是相同的[作者](https://github.com/jrburke).

cajon的工作原理：基于`RequireJS`，而重写了`requirejs.load`方法。重写的`requirejs.load`方法，默认判断逻辑，依赖相同网站的js文件，则通过异步`XHR`请求方式获取，并通过`eval`方法使之生效。如果依赖的是其他网站js文件，则仍用原来加载方式（生成一个`script`标签）进行加载。

cajon还支持自定义哪种规则的依赖文件，需要采用`XHR+eval`方式加载。


### 2. 具体解决方案

直接将原来`require.js`文件替换为`cajon.js`文件。

示例：

原来使用`requirejs`的代码：

    <script data-main="js/main" src="js/require/require.js" type="text/javascript"></script>

使用`cajon.js`替换为：

    <script data-main="js/main" src="js/require/cajon.js" type="text/javascript"></script>

Ok了，是不是很简单？！

## 方案二：设置content security policy参数

### 1. 关于content security policy的简介

这个，可以看看我的另外一篇博文，原文见：www.blogways.net。

### 2. 具体解决方案

在`manifest.json`文件中添加如下代码：

    "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'"

是的，这样就搞定了！这里，关键参数是`unsafe-eval`。

试试吧！
