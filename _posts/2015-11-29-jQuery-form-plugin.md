---
layout: post  
category: jQuery        
title: jQuery form plugin中文使用说明  
tags: ['FormPluginAPI']  
author: 付奎  
email: fukui@asiainfo.com  
description: 表单插件的中文文档   
---

# jQuery插件--Form表单插件
jQuery Form插件是一个优秀的Ajax表单插件，可以非常容易地、无侵入地升级HTML表单以支持Ajax。 插件里面主要的方法, ajaxForm 和 ajaxSubmit, 能够从form组件里采集信息确定如何处理表单的提交过程。两个方法都支持众多的可选参数，能够让你对表单里数据的提交做到完全的控制。这让采用AJAX方式提交一个表单的过程简单的不能再简单了！  
## 一、入门指导
1. 在你的页面里写一个简单的表单，不需要任何特殊标记  

		<form id="myForm" action="comment.php" method="post">
		    Name: <input type="text" name="name" />
		    Comment: <textarea name="comment"></textarea>
		    <input type="submit" value="Submit Comment" />
		</form>

2. 引入jQuery和Form Plugin Javascript脚本文件并且添加几句简单的代码让页面在DOM加载完成后初始化表单：  

		<head>
		    <script type="text/javascript" src="path/to/jquery.js"></script>
		    <script type="text/javascript" src="path/to/form.js"></script>
		
		    <script type="text/javascript">
		        // wait for the DOM to be loaded
		        $(document).ready(function() {
		            // bind 'myForm' and provide a simple callback function
		            $('#myForm').ajaxForm(function() {
		                alert("Thank you for your comment!");
		            });
		        });
		    </script>
		</head>
这就行了！ 当表单提交后 `name`  和  `comment` 的值就会被提交给 `comment.php`. 如果服务器端返回成功的状态，用户将会看到一句提示信息  `"Thank you"` 。  



## 二、Form Plugin API    
Form Plugin API 里提供了很多有用的方法可以让你轻松的处理表单里的数据和表单的提交过程。 
 

* **ajaxForm**  
预处理将要使用 `AJAX` 方式提交的表单，将所有需要用到的事件监听器添加到其中。它不是提交这个表单。 在页面的 `ready` 函数里使用 `ajaxForm` 来给你页面上的表单做这些 `AJAX` 提交的准备工作。  `ajaxForm` 需要零个或一个参数。这唯一的一个参数可以是一个回调函数或者是一个可选参数对象。并支持***连环调用***  
例子:  

		$('#myFormId').ajaxForm();  
此方法适用于以表单提交方式处理 `ajax `技术（需要提供表单的`action`、`id`、`method`，最好在表单中提供 `submit` 按钮）它大大简化了使用 `ajax` 技术提交表单时的数据传递问题，使用`ajaxForm()`你不需要逐个的以 `JavaScript` 的方式获取每个表单属性的值，并且也不需要在请求路径后面通过 `url` 重写的方式传递数据。`ajaxForm()` 会自动收集当前表单中每个属性的值，然后将其以表单提交的方式提交到目标 `url`。这种方式提交数据较安全，并且使用起来更简单，不必写过多冗余的 `JavaScript` 代码：  

		$(document).ready(function(){
		
		         registerForm'表单id
		
		data回调数据
		
		        $('#registerForm').ajaxForm(function(data){
		
		            alert(data);//弹出ajax请求后的回调结果
		
		        });
		
		});

* **ajaxSubmit**   
立即通过AJAX方式提交表单。最常见的用法是对用户提交表单的动作进行响应时调用它。 ajaxForm 需要零个或一个参数。唯一的一个参数可以是一个回调函数或者是一个可选参数对象。支持连环调用。  
例子：  

		// 绑定表单提交事件处理器t
		$('#myFormId').submit(function() {
		    // 提交表单
		    $(this).ajaxSubmit();
		    // return false，这样可以阻止正常的浏览器表单提交和页面转向
		    return false;
		});   
适用于以事件的机制以 `ajax` 提交 `form` 表单（超链接、图片的 click 事件），该方法作用与 `ajaxForm()` 类似，但它更为灵活，因为他依赖于事件机制，只要有事件存在就能使用该方法。你只需指定该 `form` 的 `action` 属性即可，不需要提供 `submit` 按钮。  

		$(document).ready(function(){
		
		    $('#btn').click(function(){
		
		            $('#registerForm').ajaxSubmit(function(data){
		
		                alert(data);
		
		            });
		
		            return false;
		
		    });
		
		    });

* **formSerialize（）**   
将表单序列化成一个查询字符串，这个方法将返回以下格式的字符串：name1=value1&name2=value2。不能连环调用，此方法返回一个字符串。  
实例：

		var queryString = $('#myFormId').formSerialize();
		
		// 现在可以使用$.get、$.post、$.ajax等来提交数据
		$.post('myscript.php', queryString);

* **fieldSerialize（）**   
将表单里的元素序列化成字符串。当你只需要将表单的部分元素序列化时可以用到这个方法。 这个方法将返回一个形如：  `name1=value1&name2=value2` 的字符串。不能连环调用, 这个方法返回的是一个字符串。  

		var queryString = $('#myFormId .specialFields').fieldSerialize();

* **fieldValue（）**   
返回匹配插入数组中的表单元素值。从0.91版起，该方法将总是以数组的形式返回数据。如果元素值被判定可能无效，则数组为空，否则它将包含一个或多于一个的元素值。不能连环调用，此方法返回一个数组。
例子：

		// 取得密码输入值
		var value = $('#myFormId :password').fieldValue(); 
		alert('The password is: ' + value[0]); 

* **resetForm（）**   
通过调用表单元素原有的 `DOM` 方法，将表单恢复到初始状态。此方法可以连环调用，  
例子：  

		$('#myFormId').resetForm();  

* **clearForm（）**   
清除表单元素。该方法将所有的文本（text）输入字段、密码（password）输入字段和文本区域（textarea）字段置空，清除任何`select`元素中的选定，以及将所有的单选（radio）按钮和多选（checkbox）按钮重置为非选定状态。此方法能连环调用。  
例子：

		$('#myFormId').clearForm();  

 
* **clearFields（）**   
清除字段元素。只有部分表单元素需要清除时才方便使用。此方法能连环调用。   
例子：   

		$('#myFormId .specialFields').clearFields();
**Options对象**  
`ajaxForm `和 `ajaxSubmit` 都支持众多的选项参数，这些选项参数可以使用一个 `Options` 对象来提供。`Options` 只是一个 `JavaScript` 对象，它包含了如下一些属性与值的集合：   



* **target**   
指明页面中由服务器响应进行更新的元素。元素的值可能被指定为一个 `jQuery` 选择器字符串，一个 `jQuery` 对象，或者一个 `DOM` 元素。   
默认值：null。   



* **url**   
表单提交的地址。   
缺省值： 表单的 `action` 的值   



* **type**  
表单提交的方式，`'GET'` 或 `'POST'`.
缺省值： 表单的 `method` 的值 (如果没有指明则认为是 'GET')    



* **beforeSubmit**  
表单提交前执行的方法。这个可以用在表单提交前的预处理，或表单校验。如果 `'beforeSubmit'` 指定的函数返回 `false`，则表单不会被提交。 `'beforeSubmit'` 函数调用时需要3个参数：数组形式的表单数据，`jQuery` 对象形式的表单对象，可选的用来传递给 `ajaxForm/ajaxSubmit `的对象。 数组形式的表单数据是下面这样的格式：   

		[ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ]
缺省值：null   



* **success**   
当表单提交后执行的函数。 如果`'success'` 回调函数被指定，当`server`端返回对表单提交的响应后，这个方法就会被执行。 `responseText` 和 `responseXML` 的值会被传进这个参数 (这个要依赖于dataType的类型).  
缺省值： `null `  



* **dataType**   
指定服务器响应返回的数据类型。其中之一: null, `'xml'`, `'script'`, 或者 `'json'`. 这个 `dataType` 选项用来指示你如何去处理server端返回的数据。 这个和 `jQuery.httpData` 方法直接相对应。 下面就是可以用的选项:     
***'xml':*** 如果 `dataType == 'xml'` 则 `server` 端返回的数据被当作是 XML 来处理， 这种情况下'success'指定的回调函数会被传进去 `responseXML` 数据    
***'json'***: 如果 `dataType == 'json'` 则 `server` 端返回的数据将会被执行，并传进`'success'`回调函数    
***'script'***:  如果 `dataType == 'script'` 则`server`端返回的数据将会在上下文的环境中被执行   
缺省值： `null`   



* **semantic**  
一个布尔值，用来指示表单里提交的数据的顺序是否需要严格按照语义的顺序。一般表单的数据都是按语义顺序序列化的，除非表单里有一个 `type="image"` 元素. 所以只有当表单里必须要求有严格顺序并且表单里有 `type="image"` 时才需要指定这个。  
缺省值： `false`   


* **resetForm**  
布尔值，指示表单提交成功后是否需要重置。  
缺省值： `null`  


* **clearForm**  
布尔值，指示表单提交成功后是否需要清空。  
缺省值： `null`  


* **iframe**  
布尔值，用来指示表单是否需要提交到一个`iframe`里。 这个用在表单里有`file`域要上传文件时。更多信息请参考 代码示例 页面里的`File Uploads` 文档。   
缺省值： false  
例子：  

		// 准备好Options对象
		var options = {
		    target:     '#divToUpdate',
		    url:        'comment.php',
		    success: function() {
		      alert('Thanks for your comment!');
		    } };
		
		   // 将options传给ajaxForm
		$('#myForm').ajaxForm(options);  
**注意**：`Options` 对象还可以用来将值传递给 `jQuery` 的`$.ajax` 方法。如果你熟悉 `$.ajax` 所支持的 `options` ，你可以利用它们来将 `Options` 对象传递给 `ajaxForm` 和 `ajaxSubmit`。