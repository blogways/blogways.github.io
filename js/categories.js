//年度博文的展开与收缩
$(function () {
    //单击年度收缩博文
    $(".page").click(function () {
        if($(this).next().css('display') === 'block'){
            $(this).next().css('display','none');
            $(this).css('background-color','#262a2b');
        }else{
            $(this).next().css('display','block');
            $(this).css('background-color','#000');
        }
    })
    //右侧分类列表
    $.getJSON("/categorycount.json",function(o){
        $.each( o, function( i , item ){
            var currentCategory = $("#categ").text().trim();
            var content;
            if (currentCategory !== item[0]) {
              content ="<a class='list-group-item list-group-item-default' href='/categories/"+item[0]+"/'>"+item[1];
            }else{
              content ="<a class='list-group-item disabled active' >"+item[1];
            }
            content += "<span class='badge pull-right'>"+item[2]+"</span><div class='inset-line'></div>"+
            "</a>"
            $("#author-list").append(content);
        });
    });
})