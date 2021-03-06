---
layout: post
category: web前端
title: Bootstrap 简介
tags: ['Bootstrap','Web Development','前端''网页']
author: 张向民
description: Bootstrap框架的简介
---

# Bootstrap学习总结

## 简介

Bootstrap由twitter的Mark Otto和Jacob Thornton编写,该程序最初是为了保持团队开发中使用的工具与框架的一致性，并减少维护的负担。
但随后由于其出色的性能，Bootstrap被作为一个开源项目发布，由Mark Otto, Jacob Thornton 和一个核心开发小组来维护。

Bootstrap的整个框架是以HTML和CSS为基础，并加以一些Javascript插件的辅助。整个框架保留整理了CSS设置与基本的HTML的元素样式，并提供了很多便于开发的工作的组件以提高工作效率。此外，Bootstrap自带了12种jQuery插件，并允许开发者自行添加跟多的插件来扩展跟多的功能。

Bootstrap在网站及网络应用开发的工具主要集中在了四个模块：排版（layout)，内容(content)，部件(component),以及使用性(utilities)。

### 1.Layout
Bootstrap 提供了一个十二网格系统，并拥有响应式的网络系统，其内容可根据显示器窗口大小调整。这对于网站的排版提供了巨大的便利，特别是当网站需要同时满足不同大小或分辨率的显示器，也为网站在移动端平台的开发提供了便利。
![12](/images/12grids.png)


开发者亦可以通过十二网格系统的规则来决定网页内容在不同大小的显示屏中如何呈现，例如

```
<div class="row">
    <div class='col-xs-12 col-sm-6 col-md-4 col-lg-4'>
```

其中col-xs适用于小于768像素的显示器，例如手机屏幕，而col-sm，col-md以及col-lg分别适用于768px，992px,1200px及以上的显示屏，开发者可以通过实际需求自行调节。

### 2.Content
Bootstrap对于一些HTML的基础元素的参数进行了更改使其变得简洁美观，并将所有的CSS文档保存在一份文件中。Bootstrap对于版面设计，多行代码编写，以及图片和表格的显示做出了规范，以求不同元素在不同类别的显示中最优化的显现

例如，Headings和List同时的margin数值都被调整，基础的form与table形式也被调整的更简洁，对于显示规则也作出了一些调整，比如<label>的显示形式被调整为inline-block。
具体的规范可去官网查阅

### 3.Component
Bootstrap对于原CSS的组件进行了整理和改进，特别是对于一些常用的组件，Bootstrap提供了跟简便的适用方法并添加了新的元素，整个Bootstrap包含了模拟框，滚动监听，标签页，轮播，折叠，表单，警告框，弹出框，胶囊式菜单，多媒体对象，进度条等网络开发时经常用到的元素，大大提高了开发的效率。如需要更详细的了解所有组件可以去官网或源代码内查阅。

以Navigation Bar来举一个例子，在bootstrap框架中仅运用以下的代码就可以建立一个菜单导航页，相比于利用自己定义CSS来制作便捷了很多，省去了很多对于格式的调整。
```
	<nav class="navbar navbar-default">
   	     <div class="container-fluid">
      		<div class="navbar-header">
        	    <a class="navbar-brand" href="#">WebSiteName</a>
     	        </div>
                <ul class="nav navbar-nav">
                    <li class="active"><a href="#">Home</a></li>
                    <li><a href="#">Page 1</a></li>
                    <li><a href="#">Page 2</a></li>
                    <li><a href="#">Page 3</a></li>
                </ul>
            </div>
        </nav>
```
但是，Bootstrap自带的工具也提供了一定的局限性，譬如Bootstrap自带的菜单栏的折叠按钮只能在自带的菜单栏中使用，无法应用到自定义的菜单栏中，因此开发者需要自行定义CSS来满足需求。同理，如果开发者希望调整框架自带的一些基础设定，可以利用CSS工具或到源代码处自行调整。

### 4.Utilities
Bootstrap增加了许多不同风格的实用性的工具以提高网站开发的效率，减少开发者自定义的CSS class的数量，并减少文件大小。
实用工具以class的形式来表达特定的属性，这些实用工具和组件一样用class的形式添加,无需适用任何CSS代码，例如边框，边框颜色，圆角半径，框架内自带的工具有很多，也在官网上列举了出来
例如：在bootstrap框架中可以简单的通过
```
<div class="fixed-top">
```
让整个 <div> 区间保持在显示器的上方

## 其他
Bootstrap4 相比于Bootstrap3还是做出了明显的改变。CSS的源文件从LESS变成了SASS格式，并对整个表单系统做出了调整，使开发者可以便捷的加入自定义的元素。此外Bootstrap4对于原bootstrap3的组件实用规范做出了一系列的调整，例如菜单导航，折叠，响应式表格/图片等。















