---
layout: post
category: Sencha
title: Sencha Touch 实例分析（功能导航）
tags: ['Sencha Touch', 'Mobile Web', 'Html5']
author: Jacky
email: shenyj5@asiainfo-linkage.com
image:
description: 前面几节讲了几个 ST 的简单示例以及 MVC 的主要概念，大部分也都是 SDK 文档里面的内容，想要了解更多概念以及组件的用法自己查找 ST 的帮助文档全面学习下。本章开始讲一些开发实用性的东西，对一些主流的页面进行分析，看看 ST 如何设计实现这些功能。
---

##功能导航页面分析
本次分析的是支付宝的一个功能导航页面

####下面是支付宝导航页面截图

![支付宝功能导航页面](/images/st-4.png)

####我们来看看在 ST 里面如何设计实现整个页面的部局

![支付宝功能导航页面设计](/images/st-5.png)

整个页面主要是一个 TabPanel（id: tp），里面包含了一个 Container（id: con1）和一个 Carousel（id: car），car 里面包含了一个 Container（id:con2）。

####下面来看看每个模块如何实现：

#####TabPanel（id: tp）

	Ext.define('myapp.view.Paypal', {
	    extend: 'Ext.TabPanel',
	    xtype: 'paypal',
	    requires: [],
	    config: {
	        tabBarPosition: 'bottom',
	        items: [{
	            title: '支付宝',
	            iconCls: 'home'
	        },
	        {
	            title: '帐单',
	            iconCls: 'info'
	        },
	        {
	            title: '我的帐单',
	            iconCls: 'locate'
	        },
	        {
	            title: '安全',
	            iconCls: 'user'
	        }]
	    }
	})

#####Container（id: con1）

	{
	    xtype: 'container',
	    padding: '15px 5px 5px 10px',
	    style: 'background-color: #5E99CC',
	    html: ['<div class="title"><div class="title-1">', 
	            '<image src="resources/icons/Icon.png"/></div>', 
	            '<div class="title-2"><div class="title-2-1">4.10 元</div>', 
	            '<div class="title-2-2">备注说明</div></div></div>'].join('')
	}

#####Carousel（id: car）

	{
	    xtype: 'carousel',
	    flex: 1,
	    layout: 'fit',
	    defaults: {
	        styleHtmlContent: true
	    },
	    items: [
	        {
	            html : 'Item 1'
	        },
	        {
	            html : 'Item 2'
	        },
	        {
	            html : ['<div class="nav"><ul>', 
	                        '<li><image src="resources/icons/Icon.png"></image><a>转帐</a></li>',
	                        '<li><image src="resources/icons/Icon.png"></image><a>信用卡还款</a></li>',
	                        '<li><image src="resources/icons/Icon.png"></image><a>手机充值</a></li>',
	                        '<li><image src="resources/icons/Icon.png"></image><a>水电煤</a></li>',
	                        '<li><image src="resources/icons/Icon.png"></image><a>扫码</a></li>',
	                        '<li><image src="resources/icons/Icon.png"></image><a>iReader</a></li>',
	                        '<li><image src="resources/icons/Icon.png"></image><a>更多</a></li>',
	                    '</ul></div>'].join('')
	        }
	    ]
	}

####看下总体的效果图

![ST 模仿效果图](/images/st-6.png)

当然我并没有完全按原样的界面去做，毕竟图片跟样式不是我们这节的重点，这个完全是按简化版来设计的，也没有添加任何事件，给大家一个参考，在实际运用的时候大家可以把两部分分成两个单独的文件来开发，通过 xtype 再结合起来。另外当中的九宫图也是比较经典的部分，我是通过 html 的无序列表来实现的，我们知道很多经典的菜单都是通过 ul+css 来实现的，这个地方也不例外，无序列表配合 css 用来实现导航功能还是蛮强大的，当然也可以通 div 来实现九宫格，样式理解起来可能更容易一些，或者直接使用 ST 的 toolbar 来实现也是可以的，这三种方式都是可以动态添加创建的，这个地方不作讨论，如果有需要的话以后来写下这三种动态实现方式。

####下面来看下完整的代码
view

	Ext.define('myapp.view.Paypal', {
	    extend: 'Ext.TabPanel',
	    xtype: 'paypal',
	    requires: [],
	    config: {
	        tabBarPosition: 'bottom',
	        items: [{
	            title: '支付宝',
	            iconCls: 'home',
	            layout: 'vbox',
	            items: [{
	                xtype: 'container',
	                padding: '15px 5px 5px 10px',
	                style: 'background-color: #5E99CC',
	                html: ['<div class="title"><div class="title-1">', 
	                        '<image src="resources/icons/Icon.png"/></div>', 
	                        '<div class="title-2"><div class="title-2-1">4.10 元</div>', 
	                        '<div class="title-2-2">备注说明</div></div></div>'].join('')
	            }, {
	                xtype: 'carousel',
	                flex: 1,
	                layout: 'fit',
	                defaults: {
	                    styleHtmlContent: true
	                },
	                items: [
	                    {
	                        html : 'Item 1'
	                    },
	                    {
	                        html : 'Item 2'
	                    },
	                    {
	                        html : ['<div class="nav"><ul>', 
	                                    '<li><image src="resources/icons/Icon.png"></image><a>转帐</a></li>',
	                                    '<li><image src="resources/icons/Icon.png"></image><a>信用卡还款</a></li>',
	                                    '<li><image src="resources/icons/Icon.png"></image><a>手机充值</a></li>',
	                                    '<li><image src="resources/icons/Icon.png"></image><a>水电煤</a></li>',
	                                    '<li><image src="resources/icons/Icon.png"></image><a>扫码</a></li>',
	                                    '<li><image src="resources/icons/Icon.png"></image><a>iReader</a></li>',
	                                    '<li><image src="resources/icons/Icon.png"></image><a>更多</a></li>',
	                                '</ul></div>'].join('')
	                    }
	                ]
	            }]
	        },
	        {
	            title: '帐单',
	            iconCls: 'info'
	        },
	        {
	            title: '我的帐单',
	            iconCls: 'locate'
	        },
	        {
	            title: '安全',
	            iconCls: 'user'
	        }]
	    }
	})

css

	.title {
	}
	
	.title-1 {
	    float: left;
	    display: inline-block;
	}
	
	.title-2 {
	    display: inline-block;
	    margin: 5px;
	    padding-top: 5px;
	}
	
	.title-2-1 {
	    font-size: 1.2em;
	}
	
	.title-2-2 {
	    font-size: 0.6em;
	}
	
	.nav {
	    margin: 0;
	    padding: 0;
	    font-size: 0.6em;
	}
	
	.nav {
	    margin: 0px;
	    padding: 0px;
	}
	
	.nav ul {
	    margin: 0px;
	    padding: 0px;
	}
	
	.nav ul li {
	    width: 33%;
	    height: 80px;
	    float: left;
	    display: inline;
	    text-align: center;
	}
	
	.nav ul li img {
	    width: 48px;
	    height: 48px;
	}
	
	.nav ul li a {
	    display: block;
	    text-decoration: none;
	}


方便起见，我把代码合到一个 view 文件里面，如果你还不知道怎么看的话，见意回头看看基础概念，别急于求成。