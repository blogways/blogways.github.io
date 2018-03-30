function getQueryString(variable)
{
   var query = window.location.search.substring(1);
   var vars = query.split("&");
   for (var i=0;i<vars.length;i++) {
           var pair = vars[i].split("=");
           if(pair[0] == variable){return pair[1];}
   }
   return(false);
}
function shows(year) {
    $(".page").next().hide();
    $("."+year).eq(0).next().toggle();
}

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
    var year = getQueryString("year");
    shows(year);
})


$(function(){
    var by = function(articles){
        return function(o, p){
            var a, b;
            if (typeof o === "object" && typeof p === "object" && o && p) {
                a = o[articles];
                b = p[articles];
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
    (function(){
        $.getJSON("/authorYear.json",function(o){
            o.sort(by("articles"));
            $.each( o, function( i , item ){
                if(item.articles != 0){
                    var content =
                        "<tr><td><span class='glyphicon glyphicon-user'></span><a href='"+
                        item.path+"'>"+item.name+"</a></td><td>共计<span class='count'>"+
                        item.articles+"</span>篇</td></tr>"
                    $("#"+item.year).append(content);
                }
            });
        });
    })();
});

