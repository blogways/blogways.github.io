---
layout: post
title: DataTables新旧版本对比
category: ['jQuery']
tags: ['DataTables', 'jQuery', 'JavaScript']
author: 汪 回
email: wanghui6@asiainfo.com
description: 基于jQuery的Table插件DataTables,在1.10版本前后存在一定差别,在对新旧版本做了对比后,发现差别其实没有想象中那么大……
---

|  |  *目 录* |
| --- | --- |
| 1 | [DataTables简介](#intro) |
| 2 | [官方更新说明](#names) |
| 3 | [实际开发中的更替](#replace) |
| 4 | [参考文献](#reference)|


我也是近期才接触到DataTables这一款jQuery插件,项目中使用的版本是1.9.4,而目前最新的版本的是1.10.11,官网的DOC和API也是基于1.10以上版本,所以当我参考官网的帮助文档来学习项目中老版本的DataTables时,感觉区别比较大.但当我看了两个版本的源码后才发现,从使用的角度来看,它仅仅是换了个马甲.


## 一、DataTables简介 <a name="intro"></a>

DataTables是一款灵活jQuery表格插件，通过它可以轻易地实现table的数据填充、分页、排序、查询、隐藏列等功能。

### 1.1 构造方法

DataTables在被加载时，就已经定义了默认的功能(包括查询、排序、分页)，所以当要为table初始化DataTables功能是，只需要调用构造方法$().DataTable()，这些功能将会立刻被添加到指定的table中。当然，也可以在调用时传入配置参数定制需要的功能，如:$().DataTable(options)。

```
    /**
     *  调用DataTables的构造方法
     *  @param {options} 初始化参数,如果不设置初始化参数,DataTables将使用默认的初始化
     *  @example:
     *      //生成一个关闭分页和排序功能的DataTable实例
     *       $('#table').DataTable({
     *           'bPaginate' : false,
     *           'bSort' : false
     *       });
     */
    $('#table').DataTable([options]);
```

一个看似简单的构造方法就能使table获得诸多功能，如此性感，我自然想看看它的源码。

``` 
    // version 1.9.4
    
    var DataTable = function( oInit )
    {
           ...
           ...
           ...
        return this;
    }
    
    ...
    
    $.fn.DataTable = DataTable;
    $.fn.dataTable = DataTable;
```

上面代码是1.9.4版本的DataTables。
DataTables在被加载时，就向jQuery的原型$.fn添加了一个DataTable和dataTable方法，指向DataTables的构造方法，将传入的table做一个一系列加工，返回一个加工后的JQuery对象.

```
    // version 1.10.10
    
    //下面两个代码实现了循环引用,使JQuery和DataTable成为了
    //我中有你、你中有我的关系，水平有限，暂不明白此举的意义
    $.fn.dataTable = DataTable;
    DataTable.$ = $;

    $.fn.DataTable = function ( opts ) {
        return $(this).dataTable( opts ).api();
    };

```

而在1.10.10版本,$().DataTable不再返回JQuery对象,而是返回一个对象_Api,该对象是DataTables的私有变量,使用该对象对table进行操作,可以有效避免命名冲突,并且不用担心DataTables属性泄露到全局变量中.
新版本推荐使用_Api代替旧版本的JQuery对象来进行table操作，但也提供了$().dataTable()方法获得JQuery对象。


### 1.2 配置对象解析和分页

既然DataTables是把JQuery的table实例进行加工,那么这个加工过程是怎么样的呢?关于这一点,新旧版本是一个思路,下面以1.9.4版本进行说明。

```
    // version 1.9.4
    
    // DataTables的构造函数,参数oInit就是$().DataTable(options)时传入的初始化参数
    var DataTable = function( oInit )
    {
        ...
        ...
        //此处声明了很多方法,用于解析oSettings,并根据配置项加载所需功能.比如:
        _fnInitialise( oSettings ){}
        ...
        ...
        //创建一个配置对象,并在创建时就配置了一些默认的参数,此对象将决定Table是否启用、如何启用DataTables提供的一系列功能
        //而DataTable.models相当于一个预定义的oSettiongs模型,每新建一个oSettings,就以DataTable.models为模板
        var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
            "nTable":        this,
            "oApi":          _that.oApi,
            "oInit":         oInit,
            "sDestroyWidth": $(this).width(),
            "sInstance":     sId,
            "sTableId":      sId
        });
        ...
        ...
        //如果没有传入oInit,则声明oInit为一个空对象
        if ( !oInit ){
           oInit = {};
        }
        //DataTable.defaults是DataTables在加载时就定义好的默认初始化参数对象,
        //而_fnExtend()类似于jQuery.extend(),
        //此方法就是将传入的初始化参数覆盖默认的初始化参数对象
        oInit = _fnExtend( $.extend(true, {}, DataTable.defaults), oInit );
        
        //_fnMap方法 将oInit的参数覆盖oSettings的参数,实现定制 
        _fnMap( oSettings.oFeatures, oInit, "bPaginate" );
        _fnMap( oSettings.oFeatures, oInit, "bLengthChange" );
                    ......
                    ......
        _fnMap( oSettings, oInit, "fnStateLoad" );
        _fnMap( oSettings, oInit, "fnStateSave" );
        _fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
        ...
        ...
    }
```

以上是设置功能配置对象oSettings的大致过程,当oSettings生成并配置完毕后,会执行_fnInitialise(oSettings)方法,该方法会解析传入的oSettings,根据配置项绘制table,添加所需功能,下面以分页功能进行说明。

```
     function _fnInitialise ( oSettings )
     {
        ...
        ...
        //判断是否使用分页功能
        //通过oSettings.oFeatures.bPaginate是否设置为真判断
        else if ( cOption == 'p' && oSettings.oFeatures.bPaginate )
        {
            //执行加载分页功能的方法
            nTmp = _fnFeatureHtmlPaginate( oSettings );
            iPushFeature = 1;
        }
        ...
        ...
      }  
        function _fnFeatureHtmlPaginate ( oSettings )
        {   
            //如果采用了无限分页,return null
            if ( oSettings.oScroll.bInfinite )
            {
                return null;
            }
            
            //创建一个<div>,容纳翻页栏
            var nPaginate = document.createElement( 'div' );
            //设置样式
            nPaginate.className = oSettings.oClasses.sPaging+oSettings.sPaginationType;
            
            //DataTable.ext放置了一些功能的具体实现,比如排序分页
            //根据sPaginationType执行对应的fnInit方法,此方法在上面的<div>中生成了用于点击翻页<a>,并定义了如当当前页、首页、末页等参数
            DataTable.ext.oPagination[ oSettings.sPaginationType ].fnInit( oSettings, nPaginate,
                function( oSettings ) {
                    //此方法用于计算页数及末页的页码
                    _fnCalculateEnd( oSettings );
                    //此方法用于生成并插入<tr>,插入前会清空当前所有的<tr>
                    _fnDraw( oSettings );
                }
            );

            //为第一次分页功能初始化添加一个回调函数,用于翻页
            if ( !oSettings.aanFeatures.p )
            {
                oSettings.aoDrawCallback.push( {
                    "fn": function( oSettings ) {
                        //fnUpdate 用于翻页的方法,根据在接收到的参数调整DataTable.ext中的当前页、首页、末页等参数
                        DataTable.ext.oPagination[ oSettings.sPaginationType ].fnUpdate( oSettings, function( oSettings ) {
                            _fnCalculateEnd( oSettings );
                            _fnDraw( oSettings );
                        } );
                    },
                    "sName": "pagination"
                } );
            }
            return nPaginate;
        }
        
```

由于篇幅有限,许多方法的代码没有贴出来,等到以后针对某项功能进行介绍时,再一一阐述.

DataTables在加载时就会定义一系列变量和方法,如:

`DataTable.default` -- 默认初始化参数对象;
`DataTable.models` -- 默认table模型;
`DataTable.ext` -- 分页、排序等功能的具体实现方法;
`_fnInitialise(oSettings)` -- 解析oSettings的属性,判读调用哪些方法,启用什么功能;
`_fnDraw(oSettings)` -- 根据oSettings._iDisplayStart、oSettings._iDisplayEnd等属性生成tr.

当调用其构造方法时,就会将JQuery对象和配置参数传入进行加工,使用$.extend或_fnExtend将DataTable.models、DataTable.default以及传入的配置参数options合并成oSettiong对象,再将此对象传入_fnInitialise(oSettings)并执行,定制出自己的table.

以上是DataTables的简介,下面来看看官方声明的1.10版本的更新变动.



## 二、官方更新说明<a name="names"></a>

主要区别有两点:初始化方法和参数名称.

### 2.1 初始化方法

1.10版本以前
$(...).DataTable() 创建一个DataTable并返回一个jQuery对象

1.10版本以后
$(...).DataTable() 创建一个DataTable并返回一个DataTables API实例
$(...).dataTable() 创建一个dataTable并返回一个jQuery对象

此区别上文中已提及,这里不再赘述.

### 2.2 参数名称

在1.10版本以前,DataTables的各配置参数采用的是匈牙利命名法,而在1.10之后,改为了驼峰命名法.
虽然新版本也兼容匈牙利命名法的参数,但是其官网的帮助文档均用新版驼峰命名法的参数进行说明,这也是造成我误以为新老版本天差地别的原因.
下面列举了一些常用参数的新旧版本对照:

|  | | |
| --- | --- |---|
| aaData | data | 用于显示的数据 |
| aaSorting | order | 表格初始化排序 |
| aoColumns | columns | 列配置数组 |
| aoColumns | columnDefs | 定义多列排序 |
| aoSearchCols | searchCols | 定义初始化查询栏 |
| asSorting | columns.orderSequence | 定义升降序序列 |
| bAutoWidth | autoWidth | 自动设置table宽度 |
| bInfo | info | 设置表格信息展示功能 |
| bPaginate | paging | 是否启用分页功能 |
| bProcessing | processing | 显示加载信息 |
| bScrollCollapse | scrollCollapse | 是否启用滚动条 |
| bSearchable | columns.searchable | 是否启用搜索功能 |
| bServerSide | serverSide | 是否启用服务模式 |
| bSort | ordering | 是否启用排序 |
| bSortCellsTop | columns.orderable | 开关某列的排序 |
| bStateSave | stateSave | 是否启用浏览器缓存功能 |
| fnServerData | ajax | 从Ajax源加载数据 |
| fnServerParams | ajax | 设置Ajax传递参数 |

篇幅有限,若想查看全部内容请访问官网.
[https://datatables.net/upgrade/1.10-convert.html](https://datatables.net/upgrade/1.10-convert.html)


## 三、实际开发中的更替 <a name="replace"></a>

项目中使用的DataTables的版本是1.9.4,当我将其换成1.10.10版本后,所使用的功能一切正常,除了这个地方:

`这是原来旧版的呈现`
![old](/images/old_Version.png)

`这是替换成新版后的呈现`
![new](/images/new_Version.png)

我试着点击本应该disable的按钮,发现并没有发出任何请求,于是想会不会是样式问题,于是在源码中找到了分页按钮样式的名称.


```
    // version 1.9.4
    
    /* Full numbers paging buttons */
    "sPageButton": "paginate_button",
    "sPageButtonActive": "paginate_active",
    "sPageButtonStaticDisabled": "paginate_button paginate_button_disabled",
    "sPageFirst": "first",
    "sPagePrevious": "previous",
    "sPageNext": "next",
    "sPageLast": "last"
```


```
    // version 1.10.10
        
     /* Paging buttons */
    "sPageButton": "paginate_button",
    "sPageButtonActive": "current",
    "sPageButtonDisabled": "disabled"
    
```


发现原因,新旧版本的css文件不一样,class名称自然也会有所不同.
sPageButton的样式名称相同,区别在于Active和Disabled,于是把项目中的plugin.css文件改了一下,把".paginate_active"改为".current",".paginate_button_disabled"改为".disables".
或者反过来,把DataTables的js文件改为与项目css文件一致,都能够回复正常.

![old](/images/old_Version.png)


排序、分页、Ajax等功能一切正常，或许还有其他的一些错误没有排除，等遇到异常再说吧。

## 四、参考文献<a name="reference"></a>
[https://www.datatables.net/](https://www.datatables.net/)