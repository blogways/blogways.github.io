---
layout: post
title: jQuery.dataTables 自定义排序
category: ['jQuery']
tags: ['DataTables', 'jQuery', 'JavaScript']
author: 陈凡
email: chenfan@asiainfo.com
description: dataTables 自带了string，date，numeric 的排序，但当遇到比较特殊的排序需求时，就得另寻出路了...
---
|  |  **目 录** |
| --- | --- |
| 1 | [遇到问题](#intro) |
| 2 | [官方更新说明](#names) |
| 3 | [参考文献](#reference)|

最近在项目中用到了 jQuery.dataTables， 这是一个很强大的 jQuery 插件，调用方便，支持回调对数据进行排序、查询、分页等操作，并且 bootstrap 框架也有对其封装，省了我们界面设计的活。dataTables 自带了string，date，numeric 的排序，但当遇到比较特殊的排序需求时，就得另寻出路了。


## 一、遇到问题 <a name="intro"></a>
这几天做项目时，正好碰到一个需求，要对下面的分秒的形式进行排序

![mm-ss](\images\post\MM-SS.jpg)

而 dataTables 的自带排序会将这一列视为 string 排序。 显然是不满足我们需求的。一开始以为要大动干戈，后来看了API文档后发现，dataTables 的第三方扩展支持还是很灵活的。

## 二、解决方案<a name="names"></a>

官方文档中提供了两种方法：

 (1) Type based column sorting ; 

 (2) Custom data source sorting

还有一种是在服务端在查数据库时进行排序处理

这里我主要使用第一种和第三种

### （一）Type based column sorting 

**主要思路**：主要思路就是将单元格内容转成可排序的 int 类型

1.首先创建一个文件叫 dataTables.sort.plungin.js ，加入以下代码。

    jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    	"MM-SS-pre": function (a) {
        	var x = String(a).replace(/<[\s\S]*?>/g, "");    //去除html标记
        	x = x.replace(/&nbsp;/ig, "");                   //去除空格
       	    x = x.split('分')[0]*60 + x.split('分')[1].split('秒')[0]           
        	return x;
    	},

	    "MM-SS-asc": function (a, b) {                //正序排序引用方法
	        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
	    },

	    "MM-SS-desc": function (a, b) {                //倒序排序引用方法
	        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
	    }
	});

2.在前台页面中加入以下的 js 引用

	<script type="text/javascript" src="jquery.dataTables.js"></script>

3.前台JS里添加

	"aoColumnDefs": [{ "sType": "html-percent", "aTargets": [8] }]

### (二)在服务端添加排序

因为表里数据为Number格式，存的是秒，可以直接进行排序

从前端可以获得两个参数

    var sortIdx = req.query.iSortCol_0 || -1;
    var sortDir = req.query.sSortDir_0 || '';

这俩个参数分别代表所点击列的索引号和该列是升序还是逆序

  	if (sortIdx !== -1 && sortDir !== ''&& baseFieldNames !== undefined &&	baseFieldNames.length >= sortIdx) {
      	if (sortIdx === '0') {
        	sort = { 'departId-avg': -1 };
      	} else {
        	sortDir = sortDir === 'asc' ? 1 : -1;
        	sort[baseFieldNames[sortIdx]] = sortDir;
      	}
    }

整合的sort在查表时添加即可。

## 四、参考文献<a name="reference"></a>

[https://datatables.net/plug-ins/sorting/#how_to_data_source](https://datatables.net/plug-ins/sorting/#how_to_data_source)