$(document).ready(function(){

    var documentHeight = 0;
    var $cate = null;//$("#categorybar").offset(), // categorybar too long, no scroll 
        $auth = $('#authorslistbar').offset(),
        $newbar = $('#newbar').offset();
    var offset = $cate != null ? $cate :
             $auth != null ? $auth :
             $newbar != null ? $newbar : null;
    var $bar = $cate != null ? $('#categorybar') :
               $auth != null ? $('#authorslistbar') :
               $newbar != null ? $('#newbar') : null;

    documentHeight = $(document).height();

    (function($){
        $('[data-toggle="tooltip"]').tooltip();
        $('table').addClass('table table-bordered table-striped table-hover');
        $('table').wrap('<div class="table-responsive"></div>');
        $('table tr th').addClass('success');
        $('p > img').wrap('<a class="thumbnail"></a>');
    })(jQuery);

    $(window).scroll(function(){
        var scrollh = $(window).scrollTop();
       
        if( scrollh > 200 ){
            $('#to-top, #to-top-xs').fadeIn('fast');
        }else{
            $('#to-top, #to-top-xs').stop().fadeOut('fast');
        }

        if( offset && $bar ){
            //console.log(offset);
            //console.log(scrollh);
            //console.log($bar);
            if( scrollh > offset.top ){
                var newPosition = scrollh - offset.top + 13,
                    tmptime = scrollh > 300 ? 500 : 200;
                //console.log(newPosition);
                if(offset.top > 150 ){
                    newPosition += 20;
                }
                newPosition += 38;
                $bar.stop().animate({ marginTop: newPosition + 'px' }, tmptime);

            }else{
                $bar.stop().animate({ marginTop: 0 }, 300);
            }
        }
        
    });

    $('#to-top, #to-top-xs').on( 'click', function( event ){
        $('html,body').animate({scrollTop: '0px'}, 500);
    });
    $('#to-top,#to-top-xs').hover(function(){
        $('#to-top-title, #to-top-title-xs').show().css('display','block');
    }, function(){
        $('#to-top-title, #to-top-title-xs').hide();
    });

});
