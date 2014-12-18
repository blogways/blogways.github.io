---
layout: post
category: Sencha
title: Sencha Touch 实例分析（自定义列表）
tags: ['Sencha Touch', 'Mobile Web', 'Html5']
author: Jacky
email: shenyj5@asiainfo-linkage.com
image:
description: 在数据展示的过程中经常会用到 list，ST 也实现了强大的 list 功能，而且支持自定义扩展，满足各种丰富的数据展示。
---

##自定义列表分析
####这是一个应用分类软件的截图

![应用程序下载页面截图](/images/st-7.png)

####看看 ST 里面如何来设计这个界面

![ST 视图设计](/images/st-8.png)

简单来划分，这个视图分为三块，最外面的 TabPanel（id: tp），面板上面的 TitleBar（id: tb）以及下面主要数据展示的 List（id: ll），下面来看看每个模块的代码：

####TabPanel（id: tp）

	Ext.define('myapp.view.MyList', {
	    extend: 'Ext.TabPanel',
	    xtype: 'mylist',
	    config: {
	        tabBarPosition: 'bottom',
	        items: [{
	            title: '首页',
	            iconCls: 'home'
	        },
	        {
	            title: '分类',
	            iconCls: 'info'
	        },
	        {
	            title: '达人',
	            iconCls: 'locate'
	        },
	        {
	            title: '排行',
	            iconCls: 'user'
	        },
	        {
	            title: '管理',
	            iconCls: 'settings'
	        }]
	    }
	})

####TitleBar（id: tb）

	{
	    xtype: 'titlebar',
	    docked: 'top',
	    items: [
	        {
	            xtype: 'label',
	            html: '应用分类'
	        },
	        {
	            iconCls: 'search',
	            ui: 'plain',
	            align: 'right'
	        }
	    ]
	}

####List（id: ll）

	{
        xtype: 'list',
        store: 'MyListStore',
        itemTpl: ['<div class="mylist">', 
                        '<div class="mylist-1"><image src="{img}"/></div>', 
                        '<div class="mylist-2"><div class="mylist-2-1">{title}</div>', 
                        '<div class="mylist-2-2">{subtitle}</div></div>',
                        '<div class="mylist-3">{download}</div>', 
                  '</div>'].join(''),
        flex: 1
    }

既然是 list 肯定是有数据源的，这个示例中定义的数据源名是 MyListStore，看下其如何实现的，为了简便起见 model 我没有单独写，跟 store 合到一起了。

####myapp.store.MyListStore

	Ext.define('myapp.store.MyListStore', {
	    extend: 'Ext.data.Store',
	    config: {
	        // model: 'myapp.model.MyListModel',
	        fields: ['title', 'subtitle', 'img', 'download'],
	        data: [
	           { title: '游戏', subtitle: '体育、战略、休闲', img: 'resources/icons/Icon.png', download: '22889'},
	           { title: '电子书', subtitle: '小说、笑话、资料', img: 'resources/icons/Icon.png', download: '18621'},
	           { title: '影音播放', subtitle: 'Adobe Flash 播放器', img: 'resources/icons/Icon.png', download: '2088'},
	           { title: '交通导航', subtitle: 'Google 地图，高级地图', img: 'resources/icons/Icon.png', download: '685'},
	           { title: '生活娱乐', subtitle: '大众点评，我查查', img: 'resources/icons/Icon.png', download: '9184'}
	       ]
	    }
	});

看下最后的效果图：

![ST 自定义列表效果图](/images/st-9.png)

最后看下合并后整个视图的代码

####myapp.view.MyList

	Ext.define('myapp.view.MyList', {
	    extend: 'Ext.TabPanel',
	    xtype: 'mylist',
	    requires: [
	        'Ext.Label',
	        'Ext.dataview.List'
	    ],
	    config: {
	        tabBarPosition: 'bottom',
	        items: [{
	            title: '首页',
	            iconCls: 'home',
	            layout: 'vbox',
	            items: [{
	                xtype: 'titlebar',
	                docked: 'top',
	                items: [
	                    {
	                        xtype: 'label',
	                        html: '应用分类'
	                    },
	                    {
	                        iconCls: 'search',
	                        ui: 'plain',
	                        align: 'right'
	                    }
	                ]
	            }, {
	                xtype: 'list',
	                store: 'MyListStore',
	                itemTpl: ['<div class="mylist">', 
	                                '<div class="mylist-1"><image src="{img}"/></div>', 
	                                '<div class="mylist-2"><div class="mylist-2-1">{title}</div>', 
	                                '<div class="mylist-2-2">{subtitle}</div></div>',
	                                '<div class="mylist-3">{download}</div>', 
	                          '</div>'].join(''),
	                flex: 1
	            }]
	        },
	        {
	            title: '分类',
	            iconCls: 'info'
	        },
	        {
	            title: '达人',
	            iconCls: 'locate'
	        },
	        {
	            title: '排行',
	            iconCls: 'user'
	        },
	        {
	            title: '管理',
	            iconCls: 'settings'
	        }]
	    }
	})

自定义列表样式

####main.css

	.mylist {
	    height: 60px;
	}
	
	.mylist-1 {
	    display: inline-block;
	    float: left;
	}
	
	.mylist-2 {
	    margin-top: 10px;
	    padding-left: 10px;
	    display: inline-block;
	}
	
	.mylist-2-1 {
	    font-size: 1.2em;
	}
	
	.mylist-2-2 {
	    margin-top: 5px;
	    font-size: 0.6em;
	}
	
	.mylist-3 {
	    display: inline-block;
	    float: right;
	    padding-top: 20px;
	    padding-right: 5px;
	    font-size: 0.6em;
	}
	
	.x-list .x-list-item .x-list-item-body, .x-list .x-list-item.x-list-item-tpl .x-innerhtml {
	    padding: 5px 5px;
	}

这个示例的选择相对比较简洁，大家有时候会看到更加复杂的列表，或者自己在开发的时候需要展示的数据更多，样式要求更复杂，其实原理都是一样的，通过定义 itemTpl 节点元素来实现自定义的列表项展示。