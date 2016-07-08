---
layout: post
category: jQuery        
title: jQuery-datatable中文文档
tags: ['datatableAPI']
author: 付奎
email: fukui@asiainfo.com
description: datatable中文API
---

## 一、Datatable中文API---实例及基本参数  

### 一、实例 
 
1. **前端JS：**  
 
	  	<script type="text/javascript" language="javascript">
        $(document).ready(function() {
            $("#example").dataTable({
               "bPaginate": true, //开关，是否显示分页器
               "bInfo": true, //开关，是否显示表格的一些信息
                "bFilter": true, //开关，是否启用客户端过滤器
                "sDom": "<>lfrtip<>",
               "bAutoWith": false,
                "bDeferRender": false,
                "bJQueryUI": false, //开关，是否启用JQueryUI风格
                "bLengthChange": true, //开关，是否显示每页大小的下拉框
                "bProcessing": true,
                "bScrollInfinite": false,
                "sScrollY": "800px", //是否开启垂直滚动，以及指定滚动区域大小,可设值：'disabled','2000px'
                "bSort": true, //开关，是否启用各列具有按列排序的功能
                "bSortClasses": true,
                "bStateSave": false, //开关，是否打开客户端状态记录功能。这个数据是记录在cookies中的，打开了这个记录后，即使刷新一次页面，或重新打开浏览器，之前的状态都是保存下来的- ------当值为true时aoColumnDefs不能隐藏列
                "sScrollX": "50%", //是否开启水平滚动，以及指定滚动区域大小,可设值：'disabled','2000%'
                "aaSorting": [[0, "asc"]],
                "aoColumnDefs": [{ "bVisible": false, "aTargets": [0]}]//隐藏列
                "sDom": '<"H"if>t<"F"if>',
                "bAutoWidth": false, //自适应宽度
                "aaSorting": [[1, "asc"]],
                "sPaginationType": "full_numbers",
                "oLanguage": {
                    "sProcessing": "正在加载中......",
                    "sLengthMenu": "每页显示 _MENU_ 条记录",
                    "sZeroRecords": "对不起，查询不到相关数据！",
                    "sEmptyTable": "表中无数据存在！",
                    "sInfo": "当前显示 _START_ 到 _END_ 条，共 _TOTAL_ 条记录",
                    "sInfoFiltered": "数据表中共为 _MAX_ 条记录",
                    "sSearch": "搜索",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上一页",
                        "sNext": "下一页",
                        "sLast": "末页"
                    }
                } //多语言配置
 
            });
        });
    </script>  

    **最简单的就是零配置方式**  

		$(document).ready(function(){
		    $('#example').dataTable();
		});


2. **html代码：**

		<div class="row-fluid">
			<table id="example" class="table table-striped table-hover">
				<thead>
				<tr>
					<% for (var i = 0; i < tabColNames.length; i++) { %>
					<th style="text-align: center"><%= tabColNames[i] %></th>
					<% } %>
				</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>   
3. **后端JS**  

	后端就是处理前端发来的请求，取数据、处理数据。还有一种方式是不需要从向后端发送请求去取数据，可以直接在前端直接加载已有的数据，需要***注意***的是在页面在进行下一次加载页面的时候需要对上一次的datatable进行清除，用以解决数据缓存带来的问题。

		$("#example").dataTable().fnClearTable();
		$("#example").dataTable().fnDestroy();

### 二、参数说明


- **bAutoWidth:**  
默认值：true  
类型：boolean  
启用或禁用自动列宽度的计算。  
  

		$(document).ready( function () {
		    $('#example').dataTable( {
		        "bAutoWidth": false  //关闭后，表格将不会自动计算表格大小，在浏览器大化小化的时候会挤在一坨
		    } );
		} );  



- **bDeferRender:**  
默认值：true  
延期渲染，可以有个速度的提升，当datatable使用Ajax或者JS源表的数据。这个选项设置为true，将导致datatable推迟创建表元素的每个元素，直到他们都创建完成--目的就是节省大量的时间。  



		$(document).ready( function() {
		    var oTable = $('#example').dataTable( {
		        "sAjaxSource": "sources/arrays.txt",
		        "bDeferRender": true   
		    } );
		} );  



- **bFilter：**  
默认值是：true  
是否对数据进行过滤，数据过滤十分灵活，允许终端用户输入多个用空格分隔开的关键字。匹配包含这些关键字的行，即使管子的顺序不是用户输入的顺序，过滤操作会跨列进行匹配，关键字可以分布在一行中的不同列。需要**注意**的是如果你想在DataTable中使用过滤，该选项必须设置为true，如果想移除默认过滤输入框但是保留过滤功能，请设置为false(API没写，推测是false)  





- **bInfo:**  
默认值:true  
是否显示表格信息，是指当前页面上显示的数据的信息，如果有过滤操作执行，也会显示过滤操作的信息  



- **bJQueryUI：**  
默认值：false  
是否开启jQuery UI ThemeRoller支持，需要一些ThemeRoller使用的标记，这些标记有些与DataTable传统使用的有轻微的差异，有些是额外附加的  



- **bLengthChange：**  
默认值：true  
允许终端用户从一个选择列表中选择分页的页数，页数为10,25和100，需要分页组件bPaginate的支持  



- **bPaginage：**  
默认值：true  
是否开启分页功能,即使设置为false,仍然会有一个默认的<前进,后退>分页组件  



- **bProcessing：**  
默认值：false  
当表格在处理的时候（比如排序操作）是否显示“处理中...”  
当表格的数据中的数据过多以至于对其中的记录进行排序时会消耗足以被察觉的时间的时候，该选项会有些用处  



- **bScrollInfinite:**  
默认值：false  
是否开启不限长度的滚动条（和sSrolly属性结合使用），不限制长度的滚动条意味着当用户拖动滚动条的时候datatable会不断加载数据。  
当数据集十分大的时候会有些用处，该选项无法和分页选项同时使用，分页选项会被自动禁止，  



- **bServerSide:**  
默认值：false  
配置DataTable使用服务器端处理，注意，sAjaxSource参数必须指定，以便给DataTable一个为每一行获取数据的数据源   



- **bSort：**  
默认值：true  
是否开启列排序，对单独列的设置在每一列的bSortable选项中指定  



- **bSortClasses：**  
默认值：true  
是否在当前被排序的列上额外添加sorting_1,sorting_2,sorting_3三个class，当该列被排序的时候，可以切换其背景颜色  
 该选项作为一个来回切换的属性会增加执行时间（当class被移除和添加的时候）  
当对大数据集进行排序的时候你或许希望关闭该选项  



- **bStateSave：**  
默认值：false  
是否开启状态保存，当选项开启的时候会使用一个cookie保存表格展示的信息的状态，例如分页信息，展示长度，过滤和排序等  
这样当终端用户重新加载这个页面的时候可以使用以前的设置  



- **sScrollX:**"100%"  
默认值为空字符串，即无效  
是否开启垂直滚动，垂直滚动会驱使DataTable设置为给定的长度，任何溢出到当前视图之外的数据可以通过垂直滚动进行察看  
当在小范围区域中显示大量数据的时候，可以在分页和垂直滚动中选择一种方式，该属性可以是css设置，或者一个数字（作为像素量度来使用）  



- **自定义语言设计**

		"oLanguage":  
		{
			"oAria":{  
					"sSortAscending": " - click/return to 			sort ascending",  
			/*  
			 默认值为activate to sort column ascending  
			 当一列被按照升序排序的时候添加到表头的ARIA标签，注意列头是这个字符串的前缀  
			*/  
	
					"sSortDescending": " - click/return to sort descending"  
			/*  
			 默认值为activate to sort column ascending  
			 当一列被按照升序降序的时候添加到表头的ARIA标签，注意列头是这个字符串的前缀  */  
					}
			"oPaginate": {  
						  "sFirst": "First page",  
			/*  
		     默认值为First  
			 当使用全数字类型的分页组件的时候，到第一页按钮上的文字
			*/
			
						  "sLast": "Last page",  
			/*  
			 默认值为Last  
			 当使用全数字类型的分页组件的时候，到最后一页按钮上的文字  
			*/  
	
						  "sNext": "Next page",  
			/*  
			 默认值为Next  
			 当使用全数字类型的分页组件的时候，到下一页按钮上的文字
			*/  
	
						   "sPrevious": "Previous page"  
			/*  
			 默认值为Previous  
			 当使用全数字类型的分页组件的时候，到前一页按钮上的文字
			*/
		                }  
	
		"sEmptyTable": "No data available in table",  
		/*  
		 默认值activate to sort column ascending    
		 当表格中没有数据（无视因为过滤导致的没有数据）时，该字符串年优先与sZeroRecords显示  
		 注意这是个可选参数，如果没有指定，sZeroRecrods会被使用（既不是默认值也不是给定的值）
		*/  
	
		"sInfo": "Got a total of _TOTAL_ entries to show (_START_ to _END_)",  
		/*  
		 默认值为Showing _START_ to _END_ of _TOTAL_ entries   
		  该属性给终端用户提供当前页面的展示信息，字符串中的变量会随着表格的更新被动态替换，而且可以被任意移动和删除
		*/  
	
		"sInfoEmpty": "No entries to show",  
		/*  
		  默认值为Showing 0 to 0 of 0 entries   
		 当表格中没有数据时展示的表格信息，通常情况下格式会符合sI默认值为空字符串nfo的格式
		*/  
	
		"sInfoFiltered": " - filtering from _MAX_ records",  
		/*  
		 默认值为(filtered from _MAX_ total entries)   
		 当用户过滤表格中的信息的时候，该字符串会被附加到信息字符串的后面，从而给出过滤器强度的直观概念
		*/  
	
		"sInfoPostFix": "All records shown are derived from real information.",  
		/*  
		 默认值为空字符串  
		 使用该属性可以很方便的向表格信息字符串中添加额外的信息，被添加的信息在任何时候都会被附加到表格信息组件的后面  
		 sInfoEmpty和sInfoFiltered可以以任何被使用的方式进行结合  
		*/  
	
		"sInfoThousands": "'",  
		/*
		 默认值为','  
		 DataTable有内建的格式化数字的工具，可以用来格式化表格信息中较大的数字  
		 默认情况下会自动调用，可以使用该选项来自定义分割的字符 
		*/  
	
		"sLengthMenu": "Display _MENU_ records",  
		/*  
		 默认值为Show _MENU_ entries  
		 描述当分页组件的下拉菜单的选项被改变的时候发生的动作，'_MENU_'变量会被替换为默认的10，25，50，100  
		 如果需要的话可以被自定义的下拉组件替换
		*/  
	
		"sLoadingRecords": "Please wait - loading...",  
		/*  
		 默认值为Loading...  
		 当使用Ajax数据源和表格在第一次被加载搜集数据的时候显示的字符串，该信息在一个空行显示  
		 向终端用户指明数据正在被加载，注意该参数在从服务器加载的时候无效，只有Ajax和客户端处理的时候有效
		*/  
	
		"sProcessing": "DataTables is currently busy",  
		/*  
		 默认值为Processing...  
		 当表格处理用户动作（例如排序或者类似行为）的时候显示的字符串
		*/
	
		"sSearch": "Apply filter _INPUT_ to table",  
		/*
		 默认为Search:  
		 描述用户在输入框输入过滤条件时的动作，变量'_INPUT_',如果用在字符串中  
		 DataTable会使用用户输入的过滤条件替换_INPUT_为HTML文本组件，从而可以支配它（即用户输入的过滤条件）出现在信息字符串中的位置   
		 如果变量没有指定，用户输入会自动添加到字符串后面
		*/  
	
		"sUrl": "http://www.sprymedia.co.uk/dataTables/lang.txt",  
		/*
		 默认值为空字符串，即：无效  
		 所有语言信息可以被存储在服务器端的文件中，DataTable可以根据该参数指定的URL去寻找  
		 必须保存语言文件的URL信息，必须是JSON格式，对象和初始化中使用的oLanguage对象具有相同的属性
		*/  
	
		"sZeroRecords": "No records to display"  
		/*  
		 默认值为No matching records found  
		 当对数据进行过滤操作后，如果没有要显示的数据，会在表格记录中显示该字符串  
		 sEmptyTable只在表格中没有数据的时候显示，忽略过滤操作
		*/
		}



- **bRetrieve:**  
默认值：false  
使用指定的选择器检索表格，**注意**，如果表格已经被初始化，该参数会直接返回已经被创建的对象   
并不会顾及你传递进来的初始化参数对象的变化，将该参数设置为true说明你确认已经明白这一点  
如果你需要的话，bDestroy可以用来重新初始化表格  



- **bScrollAutoCss：**  
默认值：true  
指明DataTable中滚动的标题元素是否被允许设置内边距和外边距等  







- **bScrollCollapse**  
默认值：false  
当垂直滚动被允许的时候，DataTable会强制表格视图在任何时候都是给定的高度（对布局有利）  
不过，当把数据集过滤到十分小的时候看起来会很古怪，而且页脚会留在最下面。当结果集的高度比给定的高度小时该参数会使表格高度自适应  



- **bSortCellsTop：**  
默认值：false  
 是否允许DataTable使用顶部（默认为true）的单元格，或者底部（默认为false）的单元格，当使用复合表头的时候会有些用处  



- **iDeferLoading：**  
默认值：null  
当选项被开启的时候，DataTable在非加载第一次的时候不会向服务器请求数据，而是会使用页面上的已有数据（不会应用排序等），因此在加载的时候保留一个XmlHttpRequest，iDeferLoading被用来指明需要延迟加载，而且也用来通知DataTable一个满的表格有多少条数据。信息元素和分页会被正确保留  



- **iDisplayLength：**  
默认值：10  
单页显示的数据的条数，如果bLengthChange属性被开启，终端用户可以通过一个弹出菜单重写该数值  



- **iDisplayStart：**  
默认值：0  
当开启分页的时候，定义展示的记录的起始序号，不是页数，因此如果你每个分页有10条记录而且想从第三页开始，需要把该参数指定为20  



- **oSearch：**  
无默认值  
该参数允许你在初始化的时候使用已经定义的全局过滤状态，sSearch对象必须被定义，但是所有的其它选项都是可选的，当bRegex为true的时候，搜索字符串会被当作正则表达式，当为false（默认）的时候，会被直接当作一个字符串。当bSmart为true的时候，DataTable会使用使用灵活过滤策略（匹配任何可能的数据），为false的时候不会这样做  



- **sAjaxDataProp：**  
默认值：aadata  
当使用Ajax数据源或者服务器端处理的时候，DataTable会默认搜索aaData属性作为数据源,该选项允许变更数据源的名称，你可以使用JavaScript的点号对象表示法去访问多级网状数据源  





- **sAjaxSource:**   
默认值：null  
该参数用来向DataTable指定加载的外部数据源（如果想使用现有的数据，请使用aData），可以简单的提供一个可以用来获得数据url或者JSON对象，该对象必须包含aaData，作为表格的数据源  



- **sDom：**  
默认值为`lfrtip (when bJQueryUI is false) or <"H"lfr>t<"F"ip> (when bJQueryUI is true)`  
该初始化属性用来指定你想把各种控制组件注入到dom节点的位置（比如你想把分页组件放到表格的顶部），DIV元素（带或者不带自定的class）可以添加目标样式，下列语法被使用  
可供使用的选项  

		'l' - 长度改变  
		'f' - 过滤输入  
		't' - 表格  
		'i' - 信息  
		'p' - 分页  
		'r' - 处理  
 可供使用的常量  

		'H' - jQueryUI theme "header" classes('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')  
		'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')  
 需要的语法  
	
		'<' 和 '>' - div元素  
		'<"class" and '>' - 带有class属性的div元素  
		'<"#id" and '>' - 带有id属性的div元素  
例子  

		'<"wrapper"flipt>'
		'<lf<t>ip>'
		
			$(document).ready(function(){  
			  $('#example').dataTable( {  
			   "sDom": '<"top"i>rt<"bottom"flp><"clear"&lgt;  '
			  });  
			});    



- **sServerMethod：**  
默认值：GET  
设置使用Ajax方式调用的服务器端的处理方法或者Ajax数据源的HTTP请求方式   
	
		$(document).ready(function(){  
			$('#example').dataTable({  
				"bServerSide": true,  
				"sAjaxSource": "scripts/post.php",  
				"sServerMethod": "POST"  
			});  
		});  





- **fnCreatedRow**
无默认值  
当一个新的TR元素（并且所有TD子元素被插入）被创建或者被作为一个DOM资源被注册时调用该函数，允许操作该TR元素  

		$(document).ready(function(){
		     $('#example').dataTable({
		         "fnCreatedRow": function( nRow, aData, iDataIndex ){
		             // Bold the grade for all 'A' grade browsers
		             if ( aData[4] == "A" )
		     {
		         $('td:eq(4)', nRow).html( '<b>A</b>' );
		     }
		         }
		     });
		 });



- **fnDrawCallback**  
无默认值  
每当draw事件发生时调用该函数，允许你动态编辑新建的dom对象的任何属性  
	
		$(document).ready( function(){   
		      $('#example').dataTable({  
		         "fnDrawCallback": function(){  
		             alert( 'DataTables has redrawn the table' );  
		         }  
		     });  
		 });  



- **fnInitComplete**  
无默认值  
当表格被初始化后调用该函数，通常DataTable会被持续初始化，并不需要该函数，可是，当使用异步的XmlHttpRequest从外部获得语言信息时，初始化并不是持续的
  
		$(document).ready( function(){  
		     $('#example').dataTable({  
		         "fnInitComplete": function(oSettings, json) {  
		             alert( 'DataTables has finished its initialisation.' );  
		         }  
		     });  
		 }) 
 


- **fnPreDrawCallback**  
无默认值  
在每一个表格draw事件发生前调用该函数，通过返回false来取消draw事件，其它任何的返回值，包括undefined都会导致draw事件的发生  

		$(document).ready( function(){  
		     $('#example').dataTable({  
		         "fnPreDrawCallback": function( oSettings ) {  
		             if ( $('#test').val() == 1 ) {  
		                 return false;  
		             }  
		         }  
		     });  
		 });  



- **fnRowCallback**  
无默认值
你可以通过该函数在每一个表格绘制事件发生之后，渲染到屏幕上之前，向表格里的每一行传递'处理过程'，该函数可以用来设置行的class名字等  

		$(document).ready(function(){
		     $('#example').dataTable({
		         "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		             // Bold the grade for all 'A' grade browsers
		             if ( aData[4] == "A" )
		     {
		         $('td:eq(4)', nRow).html( '<b>A</b>' );
		     }
		         }
		      });
		 });



- **fnServerData**  
无默认值  
你可以使用该参数重写从服务器获取数据的方法（$.getJSON）,从而使其更适合你的应用，例如你可以使用POST方式提交，或者从Google Gears或者AIR数据库获取数据  

		// POST data to server  
	
		 $(document).ready(function(){
		      $('#example').dataTable( {
		         "bProcessing": true,
		         "bServerSide": true,
		         "sAjaxSource": "xhr.php",
		         "fnServerData": function ( sSource, aoData, fnCallback ) {
		             $.ajax( {
		                 "dataType": 'json',
		             "type": "POST",
		             "url": sSource,
		             "data": aoData,
		             "success": fnCallback
		             } );
		         }
		     });
		 });



- **fnServerParams**  
无默认值  
用来在向服务器发送Ajax请求时发送额外的数据，例如自定义的过滤信息，该函数使向服务器发送额外参数变得简单，传递进来的参数是DataTable建立的数据集合，你可以根据需要添加或者修改该集合  

		$(document).ready(function(){
		     $('#example').dataTable( {
		         "bProcessing": true,
		         "bServerSide": true,
		         "sAjaxSource": "scripts/server_processing.php",
		         "fnServerParams": function ( aoData ) {
		             aoData.push( { "name": "more_data", "value": "my_value" } );
		         }
		     });
		  });  



- **aDataSort**  
默认为null,自动使用列序号作为默认  
在排序一列的时候同时将其它几列也排序，例如名和姓作为多列排序 
 
		// Using aoColumnDefs  
		$(document).ready(function(){
		     $('#example').dataTable({
		         "aoColumnDefs": [
		     { "aDataSort": [ 0, 1 ], "aTargets": [ 0 ] },
		         { "aDataSort": [ 1, 0 ], "aTargets": [ 1 ] },
		         { "aDataSort": [ 2, 3, 4 ], "aTargets": [ 2 ] }
		     ]
		     });
		 }); 
 
		// Using aoColumns  
		$(document).ready(function(){
		     $('#example').dataTable({
		          "aoColumns": [
		      { "aDataSort": [ 0, 1 ] },
		         { "aDataSort": [ 1, 0 ] },
		         { "aDataSort": [ 2, 3, 4 ] },
		         null,
		         null
		         ]
		     });
		 });  



- **bSearchable**  
默认值：true  
是否在列上应用过滤   
 
		$(document).ready(function(){
		     $('#example').dataTable({
		         "aoColumnDefs": [
		     { "bSearchable": false, "aTargets": [ 0 ] }
		     ]} );
		 });



- **bSortable**  
默认值：true  
是否在某一列上开启排序  
 


- **bVisible**  
默认值：true  
是否展示某一列  

		$(document).ready(function() {
		     $('#example').dataTable( {
		         "aoColumnDefs": [
		     { "bVisible": false, "aTargets": [ 0 ] }
		     ] } );
		 } );



- **fnRender**  
无默认值  
自定义列中每个单元格被展示的时候调用的展示函数  

		$(document).ready(function() {
		     $('#example').dataTable( {
		         "aoColumnDefs": [
		     {
		         "fnRender": function ( o, val ) {
		             return o.aData[0] +' '+ o.aData[3];
		         },
		         "aTargets": [ 0 ]
		     }
		     ]
		     } );
		 } );



- **iDataSort**  
默认值为-1，使用自动计算的列标  
当选择该列进行排序的时候，你希望调用排序操作的列的列号，该参数可以用来按隐藏列排序  



- **bServerSide**  
默认值：false  
配置使用服务器端处理的DataTable，注意sAjaxSource参数必须指定，以便给DataTable一个获取每行数据的数据源  
  
		$(document).ready( function () {
		     $('#example').dataTable( {
		         "bServerSide": true,
		         "sAjaxSource": "xhr.php"
		     } );
		 } );
	

