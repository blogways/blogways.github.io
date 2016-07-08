---
layout: post
category: Sencha
title: Sencha Touch 框架简介
tags: ['Sencha Touch', 'Mobile Web', 'Html5']
author: Jacky
email: shenyj5@asiainfo-linkage.com
image:
description: Sencha Touch（下称ST） 框架是第一个基于 HTML5 的 Mobile App 框架，是 Ext 整合 JQTouch 和 Raphael 而推出的适用于最前沿 Touch Web 的框架，完全基于 HTML5+CSS3 的最新标准，全面兼容 Android 、 Apple IOS 和 BlackBerry 等设备。ST 继承了 Ext 的界面风格，可以让你的 Web App 看起来更像 Native App，其丰富的界面组件、强大的数据管理以及跨浏览器兼容的矢量图将 ST 打造成 Mobile 跨平台开发利器，易扩展，足够应付绝大部分开发需求。
---

## Sencha Touch 框架简介

Sencha Touch（下称ST） 框架是第一个基于 HTML5 的 Mobile App 框架，是 Ext 整合 JQTouch 和 Raphael 而推出的适用于最前沿 Touch Web 的框架，完全基于 HTML5+CSS3 的最新标准，全面兼容 Android 、 Apple IOS 和 BlackBerry 等设备。ST 继承了 Ext 的界面风格，可以让你的 Web App 看起来更像 Native App，其丰富的界面组件、强大的数据管理以及跨浏览器兼容的矢量图将 ST 打造成 Mobile 跨平台开发利器，易扩展，足够应付绝大部分开发需求。

由于苹果对 Flash 的封杀，使得 Flash 无法进入 IOS 的平台，虽然 Flash 对 Android 系统支持得也不错，但对开发者来说还是有些遗憾，Flash 引以为豪的跨平台特性被中止，随着 Webkit 在移动设备上的流行，越来越多的人开始看好 Html5，后来居上的 ST 得到快速的发展。

### 下面是官方列出的几大特性：

#### 1、基于最新的 web 标准——HTML5，CSS3，JavaScript
整个库压缩和 gzip 后大约 120KB，通过禁用一些组件还会使它更小。

#### 2、支持目前世界上最好的移动设备
Sencha Touch 目前支持 Apple iOS，Android 和 BlackBerry 等目前 3G 市场上最流行的移动设备，它为不同的设备定制了不同的主题，用户可以通过使用这些主题使 web 应用在移动设备上的展现更华丽。

#### 3、增强的触摸事件
除了 touchstart，touchend 等标准事件基础外，Sencha Touch 增加了一组自定义触摸事件，如 tap、double tap、swipe、tap and hold、pinch、rotate 等。

#### 4、数据集成
Sencha Touch 提供了强大的数据包，通过 Ajax、JSONP、YQL 等方式用户可以很容易的从各种各样的数据源拿到数据并绑定到组件模板，写入本地离线存储。

### ST 功能模块介绍：
#### 1、用户界面组件，容器和布局组件
Sencha Touch 提供了丰富的用户界面组件，包括常用的按钮，单选框，复选框，文本框，日期选择控件，表格，列表等等，通过运用 Sencha Touch 定制的样式和主题，这些控件在移动设备上看起来和本地应用的 UI 组件没有什么区别。在容器和布局方面，Sencha Touch 也可以和 Adobe 的 Flex 相媲美，不仅提供了基础的 HBoxLayout，VBoxLayout 还提供了 DockLayout，CardLayout，FieldLayout 等更适合开发支持触屏设备的 Mobile web 应用的组件，关于每个组件详细的内容可以参考参考资源中列出的 Sencha Touch 的 API 文档。

#### 2、WebKit/CSS3 样式技巧增强
Sencha Touch 充分运用了 CSS3 的新特性使基于 webKit 浏览器运行的 Sencha Touch 应用更炫更酷。它支持并增强了对 Animations（动画），Transitions（转换效果），Gradients（渐变），shadows（阴影效果），Font Face（用户自定义字库），Marquee（文字移动效果），Multiple Backgrounds（多背景），RGBA（高清色彩显示通道）等样式效果的展示。

#### 3、数据包
Sencha Touch 的一个最大特性就是提供了功能强大的数据包。在 Ext.data 包中提供了丰富的 API 实现对 AJAX，JSONP，YQL 等数据访问方式的支持，并提供了 API 供用户更简单方便的操作和展现 JSON 数据， XML 数据等。用户还可以扩展基础接口实现对更复杂数据的操作和访问。Ext.data 数据包中最基础的是 Ext.data.Model，它就像 Java 的 Object 类一样是定义所有对象的基础类，代表应用程序中的数据类型：用户，产品，销售等任何东西。

#### 4、数据验证和数据关联
Sencha Touch 提供了五种基本的数据验证方式，用户可以将验证方式的定义直接和对象的定义绑定，就像定义数据库表的列约束一样方便和简洁。这五种验证方式是：

	Presence：验证数据不能为空值。
	Length：验证数据的长度，可以定义最大长度和最小长度。
	Format：Format验证数据的格式是否符合预定义的格式，比如定义某个时间属性的格式是“yyyy-mm-dd”，那么“20110324”这样的值就被认为是不合法的。
	Inclusion：验证数据是否属于某个预定义的范围，该范围可以是一个闭合区间，也可以是一些可能值的集合。
	Exclusion：验证数据是否不属于某个预定义的范围。 

### ST 的缺点：
	1、相比较而言入门门槛较高，有些习惯了 jquery 开发的人不太习惯 st 的编程方式；
	2、框架类库文件体积大；
	3、执行效率低；
	4、有些组件响应有延时；

总之，ST 开发简单、兼容性好、支持标准化，提供丰富的界面组件以及强大的数据操作 API，是目前 Mobile Web 开发最成熟的框架，虽然存在一些缺点，相信随着版本的升级会越来越好！