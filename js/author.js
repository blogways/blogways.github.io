//年度博文的展开与收缩
$(function () {
    // $(".blogs").css('display','none');
    $(".page").click(function () {
        if($(this).next().css('display') === 'block'){
            $(this).next().css('display','none');
            $(this).css('background-color','#262a2b');
        }else{
            $(this).next().css('display','block');
            $(this).css('background-color','#000');
        }
    })
    var by = function(articles){
        return function(o, p){
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
                a = o[articles].length;
                b = p[articles].length;
                if (a === b) {
                    return 0;
                }
                if (typeof a === typeof b) {
                    return a > b ? -1 : 1;
                }
                return typeof a > typeof b ? -1 : 1;
            }
            else {
                throw ("error");
            }
        }
    };
    //作者列表
    $.getJSON("/authors.json",function(o){
        o.sort(by("articles"));
        $.each( o, function( i , item ){
            if($("#authorName").text().trim() === item.name){
                var content =
                "<a class='list-group-item disabled active'>"+item.name+
                "<span class='badge'>"+item.articles.length+
                "</span><div class='inset-line'></div></a>";
            }else{
                var content =
                "<a class='list-group-item' href='"+item.path+"'>"+item.name+
                "<span class='badge'>"+item.articles.length+
                "</span><div class='inset-line'></div></a>";
            }
            $("#author-list").append(content);
        });
    });
})


