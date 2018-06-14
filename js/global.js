$(function () {
	$("#back").click(function(){
        var timer = setInterval( function(){
            //获取滚动条的滚动高度
            var scrollTop = $(document).scrollTop();
            //用于设置速度差，产生缓动的效果
            var speed = -80;
            $(document).scrollTop(scrollTop + speed);
            isTop =true;  //用于阻止滚动事件清除定时器
            if(scrollTop === 0){
                clearInterval(timer);
            }
        },5);
    })
    window.onscroll = function () {
        if($(document).scrollTop() > 0){
            $("#back").css("display","block");
        }else{
            $("#back").css("display","none");
        }
    }
    if($(window).width() <= 1200){
        $("ul.dropdown-menu").removeClass("wheel");
    }else{
        $("ul.dropdown-menu").addClass("wheel");
    }
    //子元素滚动，父元素不滚动
    $(".wheel").off('mousewheel').on('mousewheel',scrollUnique());
})
//子元素滚动，父元素不滚动的函数
$.fn.scrollUnique = function() {
    return $(this).each(function() {
        var eventType = 'mousewheel';
        // 火狐是DOMMouseScroll事件
        if (document.mozHidden !== undefined) {
            eventType = 'DOMMouseScroll';
        }
        $(this).on(eventType, function(event) {
            // 一些数据
            var scrollTop = this.scrollTop,
                scrollHeight = this.scrollHeight,
                height = this.clientHeight;
            var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);        
            if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
                this.scrollTop = delta > 0? 0: scrollHeight;
                // 向上滚 || 向下滚
                event.preventDefault();
            }        
        });
    }); 
}