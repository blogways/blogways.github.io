$(function(){
	$("#info").bind("input propertychange",function(){
		//获取搜索框的值
		var key = $(this).val();
		$("#result").empty();
		if(key != null ){
			//遍历种类，与搜索的关键字比较
	       	$.getJSON("/categorycount.json",function(o){
	            $.each( o, function( i , item ){
	                if(item[0].indexOf(key.trim().toLowerCase()) != -1 && key != "" && key != null){
	                	$("#result").append('<li onclick="choose(this)">'+item[0]+'</li>');
	                }
	            });
	        });
			//遍历作者，与搜索的关键字比较
	       	$.getJSON("/authors.json",function(o){
	            $.each( o, function( i , item ){
	                if(item.name.indexOf(key.trim().toLowerCase()) != -1 && key != "" && key != null){
	                	$("#result").append('<li onclick="choose(this)">'+item.name+'</li>');
	                }
	            });
	        });
		}
	})
	if($(window).width() > 1200){
		$('#cate').css('height', window.screen.availHeight/2);
		$('#us').css('height', window.screen.availHeight/2);
	}else{
		$('#cate').css('height', 'auto');
		$('#us').css('height', 'auto');
	}
	window.onresize = function(){
		if($(window).width() > 1200){
			$('.navbar-nav').css('display', 'block');
			$('#cate').css('height', window.screen.availHeight/2);
			$('#us').css('height', window.screen.availHeight/2);
		}else{
			$('#cate').css('height', 'auto');
			$('#us').css('height', 'auto');
		}
		if($(window).width() <= 1200 && $(window).width() > 750){
			$('.navbar-nav').css('display', 'none');
		}	
		if($(window).width() <= 750){
			$('.navbar-nav').css('display', 'block');
		}	
	}
	$(".navbar-toggle").click(function(){
		if($(window).width() <= 1200 && $(window).width() > 750 ){
			$('.navbar-nav').toggle();
		}
	})
	$(".navbar-nav > li:not(.actived):not(:last-child)").hover(
		function(){
		    $(this).toggleClass('hovered');
		    $(this).siblings('.actived').toggleClass('hovered');
		    $(this).siblings(":not(#search)").find('ul').css('display','none');
		}
	);
	//单击显示/展开下拉框
	$(".navbar-nav li > a").click(function(){
		$(this).siblings('ul').toggle();
	})
	//悬浮/离开下拉框是，改变一级菜单的背景色及字体颜色，离开时隐藏下拉框
	$(".dropdown-menu").hover(function(){
	},function(){
		$(this).parent().removeClass('open');
		$(this).hide();
	})
})
function choose(event){
	//获取搜索框的值
	var key = $(event).text();
	if(key == "" || key == null){
		alert('请输入搜索内容');
	}else{
		//遍历种类，与搜索的关键字比较
	    (function(){
	       	$.getJSON("/categorycount.json",function(o){
	            $.each( o, function( i , item ){
	                if(key.trim().toLowerCase() === item[0]){
	                	window.location = "/categories/"+item[0]+"";
	                	return;
	                }
	            });
	        });
	    })();
		//遍历作者，与搜索的关键字比较
		(function(){
	       	$.getJSON("/authors.json",function(o){
	            $.each( o, function( i , item ){
	                if(key.trim() === item.name){
	                	window.location = item.path;
	                	return;	
	                }
	            });
	        });
	    })();
	}
}


