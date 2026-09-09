(function($){
    $(document).ready(function(){
        intoSearch();
        stickFooter();
        $('[data-toggle="tooltip"]').tooltip({trigger:'hover'});
    });

    var wid = 0;

    $(window).resize(function(){
        clearTimeout(wid);
        wid = setTimeout(go_resize,200);
    });

    function go_resize(){
        stickFooter();
        trigger_resizable(false);
    }

    $(window).scroll(function(){
        if($(this).scrollTop() >= 50){
            $('#go-to-up').fadeIn(200);
            $('.big-header-banner').addClass('header-bg');
        }else{
            $('#go-to-up').fadeOut(200);
            $('.big-header-banner').removeClass('header-bg');
        }
    });

    $('.go-up').click(function(){
        $('body,html').animate({scrollTop:0},500);
        return false;
    });

    function stickFooter(){
        $('.main-footer').attr('style','');

        if($('.main-footer').hasClass('text-xs')){
            var win_height = $(window).height(),
                footer_height = $('.main-footer').outerHeight(true),
                main_content_height = $('.main-footer').position().top + footer_height;

            if(win_height > main_content_height - parseInt($('.main-footer').css('marginTop'),10)){
                $('.main-footer').css({
                    marginTop:win_height - main_content_height
                });
            }
        }
    }

    $('#sidebar-switch').on('click',function(){
        $('#sidebar').removeClass('mini-sidebar');
    });

    var isMin = false;

    function trigger_resizable(isNoAnim){
        if(!isMin && $(window).width() > 767.98){
            $('#mini-button').prop('checked',false);
            trigger_lsm_mini(isNoAnim);
            isMin = true;
        }else if($(window).width() < 767.98 && $('#sidebar').hasClass('mini-sidebar')){
            $('#sidebar').removeClass('mini-sidebar');
            isMin = false;
        }
    }

    $('.sidebar-menu-inner a').on('click',function(){
        if(!$('.sidebar-nav').hasClass('mini-sidebar')){
            $(this).parent('li').siblings('li.sidebar-item').children('ul').slideUp(200);

            if($(this).next().css('display') == 'none'){
                $(this).next('ul').slideDown(200);
                $(this).parent('li').addClass('sidebar-show').siblings('li').removeClass('sidebar-show');
            }else{
                $(this).next('ul').slideUp(200);
                $(this).parent('li').removeClass('sidebar-show');
            }
        }
    });

    $('#mini-button').on('click',function(){
        trigger_lsm_mini(false);
    });

    function trigger_lsm_mini(isNoAnim){
        if($('.header-mini-btn input[type="checkbox"]').prop('checked')){
            $('.sidebar-nav').removeClass('mini-sidebar');
            $('.sidebar-menu ul ul').css('display','none');

            if(isNoAnim){
                $('.sidebar-nav').removeClass('animate-nav');
                $('.sidebar-nav').width(220);
            }else{
                $('.sidebar-nav').addClass('animate-nav');
                $('.sidebar-nav').stop().animate({width:170},200);
            }
        }else{
            $('.sidebar-item.sidebar-show').removeClass('sidebar-show');
            $('.sidebar-menu ul').removeAttr('style');
            $('.sidebar-nav').addClass('mini-sidebar');
            $('.sidebar-nav .change-href').each(function(){
                $(this).attr('href',$(this).data('change'));
            });

            if(isNoAnim){
                $('.sidebar-nav').removeClass('animate-nav');
                $('.sidebar-nav').width(60);
            }else{
                $('.sidebar-nav').addClass('animate-nav');
                $('.sidebar-nav').stop().animate({width:60},200);
            }
        }
    }

    $(document).on(
        'mouseover',
        '.mini-sidebar .sidebar-menu ul:first>li,.mini-sidebar .flex-bottom ul:first>li',
        function(){
            var offset = $(this).parents('.flex-bottom').length != 0 ? -3 : 2;

            if($(".sidebar-popup.second").length == 0){
                $("body").append("<div class='second sidebar-popup sidebar-menu-inner text-sm'><div></div></div>");
            }

            $(".sidebar-popup.second>div").html($(this).html());
            $(".sidebar-popup.second").show();

            var top = $(this).offset().top - $(window).scrollTop() + offset;
            var d = $(window).height() - $(".sidebar-popup.second>div").height();

            if(d - top <= 0){
                top = d >= 0 ? d - 8 : 0;
            }

            $(".sidebar-popup.second").stop().animate({"top":top},50);
        }
    );

    $(document).on(
        'mouseleave',
        '.mini-sidebar .sidebar-menu ul:first, .mini-sidebar .slimScrollBar,.second.sidebar-popup',
        function(){
            $(".sidebar-popup.second").hide();
        }
    );

    $(document).on(
        'mouseover',
        '.mini-sidebar .slimScrollBar,.second.sidebar-popup',
        function(){
            $(".sidebar-popup.second").show();
        }
    );

    function intoSearch(){
        if(window.localStorage.getItem("searchlist")){
            $(".hide-type-list input#"+window.localStorage.getItem("searchlist")).prop('checked',true);
            $(".hide-type-list input#m_"+window.localStorage.getItem("searchlist")).prop('checked',true);
        }

        if(window.localStorage.getItem("searchlistmenu")){
            $('.s-type-list.big label').removeClass('active');
            $(".s-type-list [data-id="+window.localStorage.getItem("searchlistmenu")+"]").addClass('active');
        }

        toTarget($(".s-type-list.big"),false,false);

        $('.hide-type-list .s-current').removeClass("s-current");
        $('.hide-type-list input:radio[name="type"]:checked').parents(".search-group").addClass("s-current");
        $('.hide-type-list input:radio[name="type2"]:checked').parents(".search-group").addClass("s-current");

        $(".super-search-fm").attr(
            "action",
            $('.hide-type-list input:radio:checked').val()
        );

        $(".search-key").attr(
            "placeholder",
            $('.hide-type-list input:radio:checked').data("placeholder")
        );

        if(window.localStorage.getItem("searchlist") == 'type-zhannei'){
            $(".search-key").attr("zhannei","true");
        }
    }

    $(document).on('click','.s-type-list label',function(){
        $('.s-type-list.big label').removeClass('active');
        $(this).addClass('active');
        window.localStorage.setItem("searchlistmenu",$(this).data("id"));

        var parent = $(this).parents(".s-search");
        parent.find('.search-group').removeClass("s-current");
        parent.find('#'+$(this).attr("for")).parents(".search-group").addClass("s-current");

        toTarget($(this).parents(".s-type-list"),false,false);
    });

    $('.hide-type-list .search-group input').on('click',function(){
        var parent = $(this).parents(".s-search");

        window.localStorage.setItem(
            "searchlist",
            $(this).attr("id").replace("m_","")
        );

        parent.children(".super-search-fm").attr("action",$(this).val());
        parent.find(".search-key").attr("placeholder",$(this).data("placeholder"));

        if($(this).attr('id') == "type-zhannei" || $(this).attr('id') == "m_type-zhannei"){
            parent.find(".search-key").attr("zhannei","true");
        }else{
            parent.find(".search-key").attr("zhannei","");
        }

        parent.find(".search-key").select();
        parent.find(".search-key").focus();
    });

    $(document).on("submit",".super-search-fm",function(){
        var key = encodeURIComponent($(this).find(".search-key").val());

        if(key == ""){
            return false;
        }

        window.open($(this).attr("action") + key);
        return false;
    });

})(jQuery);

function toTarget(menu,padding,isMult){
    var slider = menu.children(".anchor");
    var target = menu.children(".hover").first();

    if(!target || target.length == 0){
        target = isMult ? menu.find('.active').parent() : menu.find('.active');
    }

    if(target.length > 0){
        if(padding){
            slider.css({
                left:target.position().left + target.scrollLeft() + "px",
                width:target.outerWidth() + "px",
                opacity:"1"
            });
        }else{
            slider.css({
                left:target.position().left + target.scrollLeft() + (target.outerWidth()/4) + "px",
                width:target.outerWidth()/2 + "px",
                opacity:"1"
            });
        }
    }else{
        slider.css({
            opacity:"0"
        });
    }
}