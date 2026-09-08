(function($){ 
    $(document).ready(function(){
        // 侧栏菜单初始状态设置
        if(theme.minNav != '1')trigger_resizable(true);
        // 搜索模块
        intoSearch();
        // 粘性页脚
        stickFooter();
        // 网址块提示 
        if(isPC()){ $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'}); }else{ $('.qr-img[data-toggle="tooltip"]').tooltip({trigger: 'hover'}); }
        // 初始化tab滑块
        intoSlider();
    });
    // Enable/Disable Resizable Event
    var wid = 0;
    $(window).resize(function() {
        clearTimeout(wid);
        wid = setTimeout(go_resize, 200); 
    });
    function go_resize() {
        stickFooter(); 
        //if(theme.minNav != '1'){
            trigger_resizable(false);
        //}
    }
    // count-a数字动画
    $('.count-a').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 1000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
    $(document).on('click', "a[target!='_blank']", function() {
        if( theme.loading=='1' && $(this).attr('href') && $(this).attr('href').indexOf("#") != 0 && $(this).attr('href').indexOf("java") != 0 && !$(this).data('fancybox')  && !$(this).data('commentid') && !$(this).hasClass('nofx') ){
            var load = $('<div id="load-loading"></div>');
            $("body").prepend(load);
            load.animate({opacity:'1'},200,'swing').delay(2000).hide(300,function(){ load.remove() });
        }
    });
    //返回顶部
    $(window).scroll(function () {
        if ($(this).scrollTop() >= 50) {
            $('#go-to-up').fadeIn(200);
            $('.big-header-banner').addClass('header-bg');
        } else {
            $('#go-to-up').fadeOut(200);
            $('.big-header-banner').removeClass('header-bg');
        }
    });
    $('.go-up').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
    return false;
    }); 

 
    //滑块菜单
    $('.slider_menu').children("ul").children("li").not(".anchor").hover(function() {
        $(this).addClass("hover"),
        //$('li.anchor').css({
        //    transform: "scale(1.05)",
        //}),
        toTarget($(this).parent(),true,true) 
    }, function() {
        //$('li.anchor').css({
        //    transform: "scale(1)",
        //}),
        $(this).removeClass("hover") 
    });
    $('.slider_menu').mouseleave(function(e) {
        var menu = $(this).children("ul");
        window.setTimeout(function() { 
            toTarget(menu,true,true) 
        }, 50)
    }) ;  
    function intoSlider() {
        $(".slider_menu[sliderTab]").each(function() {
            if(!$(this).hasClass('into')){
                var menu = $(this).children("ul");
                menu.prepend('<li class="anchor" style="position:absolute;width:0;height:28px"></li>');
                var target = menu.find('.active').parent();
                if(0 < target.length){
                    menu.children(".anchor").css({
                        left: target.position().left + target.scrollLeft() + "px",
                        width: target.outerWidth() + "px",
                        height: target.height() + "px",
                        opacity: "1"
                    })
                }
                $(this).addClass('into');
            }
        })
    }
    //粘性页脚
    function stickFooter() {
        $('.main-footer').attr('style', '');
        if($('.main-footer').hasClass('text-xs'))
        {
            var win_height                 = jQuery(window).height(),
                footer_height             = $('.main-footer').outerHeight(true),
                main_content_height         = $('.main-footer').position().top + footer_height ;
            if(win_height > main_content_height - parseInt($('.main-footer').css('marginTop'), 10))
            {
                $('.main-footer').css({
                    marginTop: win_height - main_content_height  
                });
            }
        }
    }
 

    $('#sidebar-switch').on('click',function(){
        $('#sidebar').removeClass('mini-sidebar');
    }); 
 
    // Trigger Resizable Function
    var isMin = false,
        isMobileMin = false;
    function trigger_resizable( isNoAnim ) {
        if( (theme.minNav == '1' && !isMin && 767.98<$(window).width() )||(!isMin && 767.98<$(window).width() && $(window).width()<1024) ){
            //$('#mini-button').removeAttr('checked');
            $('#mini-button').prop('checked', false);
            trigger_lsm_mini(isNoAnim);
            isMin = true;
            if(isMobileMin){
                $('#sidebar').addClass('mini-sidebar');
                $('.sidebar-nav .change-href').each(function(){$(this).attr('href',$(this).data('change'))});
                isMobileMin = false;
            }
        }
        else if( ( theme.minNav != '1')&&((isMin && $(window).width()>=1024) || ( isMobileMin && !isMin && $(window).width()>=1024 ) ) ){
            $('#mini-button').prop('checked', true);
            trigger_lsm_mini(isNoAnim);
            isMin = false;
            if(isMobileMin){
                isMobileMin = false;
            }
        }
        else if($(window).width() < 767.98 && $('#sidebar').hasClass('mini-sidebar')){
            $('#sidebar').removeClass('mini-sidebar');
            isMobileMin = true;
            isMin = false;
        }
    }
    // sidebar-menu-inner收缩展开
    $('.sidebar-menu-inner a').on('click',function(){//.sidebar-menu-inner a //.has-sub a  

        //console.log('--->>>'+$(this).find('span').text());
        if (!$('.sidebar-nav').hasClass('mini-sidebar')) {//菜单栏没有最小化   
            $(this).parent("li").siblings("li.sidebar-item").children('ul').slideUp(200);
            if ($(this).next().css('display') == "none") { //展开
                //展开未展开
                // $('.sidebar-item').children('ul').slideUp(300);
                $(this).next('ul').slideDown(200);
                $(this).parent('li').addClass('sidebar-show').siblings('li').removeClass('sidebar-show');
            }else{ //收缩
                //收缩已展开
                $(this).next('ul').slideUp(200);
                //$('.sidebar-item.sidebar-show').removeClass('sidebar-show');
                $(this).parent('li').removeClass('sidebar-show');
            }
        }
    });
    //菜单栏最小化
    $('#mini-button').on('click',function(){
        trigger_lsm_mini(false);

    });
    function trigger_lsm_mini(isNoAnim){
        if ($('.header-mini-btn input[type="checkbox"]').prop("checked")) {
            $('.sidebar-nav').removeClass('mini-sidebar');
            $('.sidebar-menu ul ul').css("display", "none");
            if(isNoAnim){
                $('.sidebar-nav').removeClass('animate-nav');
                $('.sidebar-nav').width(220);
            }
            else{
                $('.sidebar-nav').addClass('animate-nav');
                $('.sidebar-nav').stop().animate({width: 170},200);
            }
        }else{
            $('.sidebar-item.sidebar-show').removeClass('sidebar-show');
            $('.sidebar-menu ul').removeAttr('style');
            $('.sidebar-nav').addClass('mini-sidebar');
            $('.sidebar-nav .change-href').each(function(){$(this).attr('href',$(this).data('change'))});
            if(isNoAnim){
                $('.sidebar-nav').removeClass('animate-nav');
                $('.sidebar-nav').width(60);
            }
            else{
                $('.sidebar-nav').addClass('animate-nav');
                $('.sidebar-nav').stop().animate({width: 60},200);
            }
        }
        //$('.sidebar-nav').css("transition","width .3s");
    }
    //显示2级悬浮菜单
    $(document).on('mouseover','.mini-sidebar .sidebar-menu ul:first>li,.mini-sidebar .flex-bottom ul:first>li',function(){
        var offset = 2;
        if($(this).parents('.flex-bottom').length!=0)
            offset = -3;
        $(".sidebar-popup.second").length == 0 && ($("body").append("<div class='second sidebar-popup sidebar-menu-inner text-sm'><div></div></div>"));
        $(".sidebar-popup.second>div").html($(this).html());
        $(".sidebar-popup.second").show();
        var top = $(this).offset().top - $(window).scrollTop() + offset; 
        var d = $(window).height() - $(".sidebar-popup.second>div").height();
        if(d - top <= 0 ){
            top  = d >= 0 ?  d - 8 : 0;
        }
        $(".sidebar-popup.second").stop().animate({"top":top}, 50);
    });
    //隐藏悬浮菜单面板
    $(document).on('mouseleave','.mini-sidebar .sidebar-menu ul:first, .mini-sidebar .slimScrollBar,.second.sidebar-popup',function(){
        $(".sidebar-popup.second").hide();
    });
    //常驻2级悬浮菜单面板
    $(document).on('mouseover','.mini-sidebar .slimScrollBar,.second.sidebar-popup',function(){
        $(".sidebar-popup.second").show();
    });
    // 搜索模块 -----------------------
    function intoSearch() {
        if(window.localStorage.getItem("searchlist")){
            $(".hide-type-list input#"+window.localStorage.getItem("searchlist")).prop('checked', true);
            $(".hide-type-list input#m_"+window.localStorage.getItem("searchlist")).prop('checked', true);
        }
        if(window.localStorage.getItem("searchlistmenu")){
            $('.s-type-list.big label').removeClass('active');
            $(".s-type-list [data-id="+window.localStorage.getItem("searchlistmenu")+"]").addClass('active');
        }
        toTarget($(".s-type-list.big"),false,false);
        $('.hide-type-list .s-current').removeClass("s-current");
        $('.hide-type-list input:radio[name="type"]:checked').parents(".search-group").addClass("s-current"); 
        $('.hide-type-list input:radio[name="type2"]:checked').parents(".search-group").addClass("s-current");

        $(".super-search-fm").attr("action",$('.hide-type-list input:radio:checked').val());
        $(".search-key").attr("placeholder",$('.hide-type-list input:radio:checked').data("placeholder")); 
        if(window.localStorage.getItem("searchlist")=='type-zhannei'){
            $(".search-key").attr("zhannei","true"); 
        }
    }
    $(document).on('click', '.s-type-list label', function(event) {
        //event.preventDefault();
        $('.s-type-list.big label').removeClass('active');
        $(this).addClass('active');
        window.localStorage.setItem("searchlistmenu", $(this).data("id"));
        var parent = $(this).parents(".s-search");
        parent.find('.search-group').removeClass("s-current");
        parent.find('#'+$(this).attr("for")).parents(".search-group").addClass("s-current"); 
        toTarget($(this).parents(".s-type-list"),false,false);
    });
    $('.hide-type-list .search-group input').on('click', function() {
        var parent = $(this).parents(".s-search");
        window.localStorage.setItem("searchlist", $(this).attr("id").replace("m_",""));
        parent.children(".super-search-fm").attr("action",$(this).val());
        parent.find(".search-key").attr("placeholder",$(this).data("placeholder"));

        if($(this).attr('id')=="type-zhannei" || $(this).attr('id')=="m_type-zhannei")
            parent.find(".search-key").attr("zhannei","true");
        else
            parent.find(".search-key").attr("zhannei","");

        parent.find(".search-key").select();
        parent.find(".search-key").focus();
    });
    $(document).on("submit", ".super-search-fm", function() {
        var key = encodeURIComponent($(this).find(".search-key").val())
        if(key == "")
            return false;
        else{
            window.open( $(this).attr("action") + key);
            return false;
        }
    });
    $('.nav-login-user.dropdown').hover(function(){
        if(!$(this).hasClass('show'))
            $(this).children('a').click();
    },function(){
        //$(this).removeClass('show');
        //$(this).children('a').attr('aria-expanded',false);
        //$(this).children('.dropdown-menu').removeClass('show');
    });
})(jQuery);
function isPC() {
    let u = navigator.userAgent;
    let Agents = ["Android", "iPhone", "webOS", "BlackBerry", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    let flag = true;
    for (let i = 0; i < Agents.length; i++) {
        if (u.indexOf(Agents[i]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
function chack_name(str){
    //var pattern = RegExp(/[( )(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\»)(\«)(\“)(\”)(\?)(\)]+/);
    var pattern = RegExp(/[( )(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\*)(\()(\))(\+)(\=)(\[)(\])(\{)(\})(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\»)(\«)(\“)(\”)(\?)(\)]+/);
    if (pattern.test(str)){
        return true;
    }
    return false;
}
function showAlert(data) {
    var title,alert,ico;
    switch(data.status) {
        case 1: 
            title = '成功';
            alert='success';
            ico='icon-adopt';
            break;
        case 2: 
            title = '信息';
            alert='info';
            ico='icon-tishi';
            break;
        case 3: 
            title = '警告';
            alert='warning';
            ico='icon-warning';
            break;
        case 4: 
            title = '错误';
            alert='danger';
            ico='icon-close-circle';
            break;
        default: 
    } 
    var msg = data.msg;
    if(!$('#alert_placeholder').hasClass('text-sm')){
        $('body').append('<div id="alert_placeholder" class="text-sm" style="position: fixed;bottom: 10px;right: 10px;z-index: 2000;text-align: right;text-align: -webkit-right"></div>')
    }
    $html = $('<div class="alert-body" style="display:none;"><div class="alert alert-'+alert+' text-lg pr-4 pr-md-5" style="text-align:initial"><i class="iconfont '+ico+' icon-lg" style="vertical-align: middle;margin-right: 10px"></i><span style="vertical-align:middle">'+title+'</span><br><span class="text-md" style="margin-left:30px;vertical-align:middle">'+msg+'</span></div></div>');
    $('#alert_placeholder').append( $html );//prepend
    $html.show(200).delay(3500).hide(300, function(){ $(this).remove() }); 
} 
function toTarget(menu, padding, isMult) {
    var slider =  menu.children(".anchor");
    var target = menu.children(".hover").first() ;
    if (target && 0 < target.length){
    }
    else{
        if(isMult)
            target = menu.find('.active').parent();
        else
            target = menu.find('.active');
    }
    if(0 < target.length){
        if(padding)
        slider.css({
            left: target.position().left + target.scrollLeft() + "px",
            width: target.outerWidth() + "px",
            opacity: "1"
        });
        else
        slider.css({
            left: target.position().left + target.scrollLeft() + (target.outerWidth()/4) + "px",
            width: target.outerWidth()/2 + "px",
            opacity: "1"
        });
    }
    else{
        slider.css({
            opacity: "0"
        })
    }
}
var ioadindex = 0;
function loadingShow(parent = "body"){
    if($('.load-loading')[0]){
        ioadindex ++;
        return $('.load-loading');
    }
    var load = $('<div class="load-loading" style="display:none"><div class="bg"></div><div class="rounded-lg bg-light" style="z-index:1"><div class="spinner-border m-4" role="status"><span class="sr-only">Loading...</span></div></div></div>');
    $(parent).prepend(load);
    load.fadeIn(200);
    return load;
}
function loadingHid(load){
    if(ioadindex>0)
        ioadindex--;
    else{
        ioadindex = 0;
        load.fadeOut(300,function(){ load.remove() });
    }
}
function ioPopupTips(type, msg, callBack) {
	var ico = '';
    switch(type) {
        case 1: 
            ico='icon-adopt';
            break;
        case 2: 
            ico='icon-tishi';
            break;
        case 3: 
            ico='icon-warning';
            break;
        case 4: 
            ico='icon-close-circle';
            break;
        default: 
    } 
	var c = type==1 ? 'tips-success' : 'tips-error';
	var html = '<section class="io-bomb '+c+' io-bomb-sm io-bomb-open">'+
					'<div class="io-bomb-overlay"></div>'+
                    '<div class="io-bomb-body text-center">'+
                        '<div class="io-bomb-content bg-white px-5"><i class="iconfont '+ico+' icon-8x"></i>'+
                            '<p class="text-md mt-3">'+msg+'</p>'+
                        '</div>'+
                    '</div>'+
                '</section>';
    var tips = $(html);
	$('body').addClass('modal-open').append(tips);
	setTimeout(function(){
        $('body').removeClass('modal-open');
        if ($.isFunction(callBack)) callBack(true); 
		tips.removeClass('io-bomb-open').addClass('io-bomb-close');
		setTimeout(function(){
			tips.removeClass('io-bomb-close');
			setTimeout(function(){
				tips.remove();
			}, 200);
		},400);
	},2000);
}
function ioPopup(type, html, maskStyle, btnCallBack) {
	var maskStyle = maskStyle ? 'style="' + maskStyle + '"' : '';
	var size = '';
	if( type == 'big' ){
		size = 'io-bomb-lg';
	}else if( type == 'no-padding' ){
		size = 'io-bomb-nopd';
	}else if( type == 'cover' ){
		size = 'io-bomb-cover io-bomb-nopd';
	}else if( type == 'full' ){
		size = 'io-bomb-xl';
	}else if( type == 'small' ){
		size = 'io-bomb-sm';
	}else if( type == 'confirm' ){
		size = 'io-bomb-md';
	}
	var template = '\
	<div class="io-bomb ' + size + ' io-bomb-open">\
		<div class="io-bomb-overlay" ' + maskStyle + '></div>\
		<div class="io-bomb-body text-center">\
			<div class="io-bomb-content bg-white">\
				'+html+'\
			</div>\
			<div class="btn-close-bomb mt-2">\
                <i class="iconfont icon-close-circle"></i>\
            </div>\
		</div>\
	</div>\
	';
	var popup = $(template);
	$('body').addClass('modal-open').append(popup);
	var close = function(){
        $('body').removeClass('modal-open');
		$(popup).removeClass('io-bomb-open').addClass('io-bomb-close');
		setTimeout(function(){
			$(popup).removeClass('io-bomb-close');
			setTimeout(function(){
				popup.remove();
			}, 200);
		},600);
	}
	$(popup).on('click touchstart', '.btn-close-bomb i, .io-bomb-overlay', function(event) {
		event.preventDefault();
        if ($.isFunction(btnCallBack)) btnCallBack(true); 
		close();
	}); 
	return popup;
} 
function ioConfirm(message, btnCallBack) {
	var template = '\
	<div class="io-bomb io-bomb-confirm io-bomb-open">\
		<div class="io-bomb-overlay"></div>\
		<div class="io-bomb-body">\
			<div class="io-bomb-content bg-white">\
				'+message+'\
                <div class="text-center mt-3">\
                    <button class="btn btn-danger mx-2" onclick="_onclick(true);">确定</button>\
                    <button class="btn btn-light mx-2" onclick="_onclick(false);">取消</button>\
                </div>\
			</div>\
		</div>\
	</div>\
	';
	var popup = $(template);
	$('body').addClass('modal-open').append(popup);
    _onclick = function (r) { 
        close();
        if ($.isFunction(btnCallBack)) btnCallBack(r); 
    };
	var close = function(){
        $('body').removeClass('modal-open');
		$(popup).removeClass('io-bomb-open').addClass('io-bomb-close');
		setTimeout(function(){
			$(popup).removeClass('io-bomb-close');
			setTimeout(function(){
				popup.remove();
			}, 200);
		},600);
	}
	return popup;
}
/**
 * Minified by jsDelivr using Terser v5.3.5.
 * Original file: /npm/js-base64@3.6.0/base64.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):function(){const r=e.Base64,o=t();o.noConflict=()=>(e.Base64=r,o),e.Meteor&&(Base64=o),e.Base64=o}()}("undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:this,(function(){"use strict";const e="3.6.0",t="function"==typeof atob,r="function"==typeof btoa,o="function"==typeof Buffer,n="function"==typeof TextDecoder?new TextDecoder:void 0,a="function"==typeof TextEncoder?new TextEncoder:void 0,f=[..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="],i=(e=>{let t={};return e.forEach(((e,r)=>t[e]=r)),t})(f),c=/^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,u=String.fromCharCode.bind(String),s="function"==typeof Uint8Array.from?Uint8Array.from.bind(Uint8Array):(e,t=(e=>e))=>new Uint8Array(Array.prototype.slice.call(e,0).map(t)),d=e=>e.replace(/[+\/]/g,(e=>"+"==e?"-":"_")).replace(/=+$/m,""),l=e=>e.replace(/[^A-Za-z0-9\+\/]/g,""),h=e=>{let t,r,o,n,a="";const i=e.length%3;for(let i=0;i<e.length;){if((r=e.charCodeAt(i++))>255||(o=e.charCodeAt(i++))>255||(n=e.charCodeAt(i++))>255)throw new TypeError("invalid character found");t=r<<16|o<<8|n,a+=f[t>>18&63]+f[t>>12&63]+f[t>>6&63]+f[63&t]}return i?a.slice(0,i-3)+"===".substring(i):a},p=r?e=>btoa(e):o?e=>Buffer.from(e,"binary").toString("base64"):h,y=o?e=>Buffer.from(e).toString("base64"):e=>{let t=[];for(let r=0,o=e.length;r<o;r+=4096)t.push(u.apply(null,e.subarray(r,r+4096)));return p(t.join(""))},A=(e,t=!1)=>t?d(y(e)):y(e),b=e=>{if(e.length<2)return(t=e.charCodeAt(0))<128?e:t<2048?u(192|t>>>6)+u(128|63&t):u(224|t>>>12&15)+u(128|t>>>6&63)+u(128|63&t);var t=65536+1024*(e.charCodeAt(0)-55296)+(e.charCodeAt(1)-56320);return u(240|t>>>18&7)+u(128|t>>>12&63)+u(128|t>>>6&63)+u(128|63&t)},g=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,B=e=>e.replace(g,b),x=o?e=>Buffer.from(e,"utf8").toString("base64"):a?e=>y(a.encode(e)):e=>p(B(e)),C=(e,t=!1)=>t?d(x(e)):x(e),m=e=>C(e,!0),U=/[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g,F=e=>{switch(e.length){case 4:var t=((7&e.charCodeAt(0))<<18|(63&e.charCodeAt(1))<<12|(63&e.charCodeAt(2))<<6|63&e.charCodeAt(3))-65536;return u(55296+(t>>>10))+u(56320+(1023&t));case 3:return u((15&e.charCodeAt(0))<<12|(63&e.charCodeAt(1))<<6|63&e.charCodeAt(2));default:return u((31&e.charCodeAt(0))<<6|63&e.charCodeAt(1))}},w=e=>e.replace(U,F),S=e=>{if(e=e.replace(/\s+/g,""),!c.test(e))throw new TypeError("malformed base64.");e+="==".slice(2-(3&e.length));let t,r,o,n="";for(let a=0;a<e.length;)t=i[e.charAt(a++)]<<18|i[e.charAt(a++)]<<12|(r=i[e.charAt(a++)])<<6|(o=i[e.charAt(a++)]),n+=64===r?u(t>>16&255):64===o?u(t>>16&255,t>>8&255):u(t>>16&255,t>>8&255,255&t);return n},E=t?e=>atob(l(e)):o?e=>Buffer.from(e,"base64").toString("binary"):S,v=o?e=>s(Buffer.from(e,"base64")):e=>s(E(e),(e=>e.charCodeAt(0))),D=e=>v(z(e)),R=o?e=>Buffer.from(e,"base64").toString("utf8"):n?e=>n.decode(v(e)):e=>w(E(e)),z=e=>l(e.replace(/[-_]/g,(e=>"-"==e?"+":"/"))),T=e=>R(z(e)),Z=e=>({value:e,enumerable:!1,writable:!0,configurable:!0}),j=function(){const e=(e,t)=>Object.defineProperty(String.prototype,e,Z(t));e("fromBase64",(function(){return T(this)})),e("toBase64",(function(e){return C(this,e)})),e("toBase64URI",(function(){return C(this,!0)})),e("toBase64URL",(function(){return C(this,!0)})),e("toUint8Array",(function(){return D(this)}))},I=function(){const e=(e,t)=>Object.defineProperty(Uint8Array.prototype,e,Z(t));e("toBase64",(function(e){return A(this,e)})),e("toBase64URI",(function(){return A(this,!0)})),e("toBase64URL",(function(){return A(this,!0)}))},O={version:e,VERSION:"3.6.0",atob:E,atobPolyfill:S,btoa:p,btoaPolyfill:h,fromBase64:T,toBase64:C,encode:C,encodeURI:m,encodeURL:m,utob:B,btou:w,decode:T,isValid:e=>{if("string"!=typeof e)return!1;const t=e.replace(/\s+/g,"").replace(/=+$/,"");return!/[^\s0-9a-zA-Z\+/]/.test(t)||!/[^\s0-9a-zA-Z\-_]/.test(t)},fromUint8Array:A,toUint8Array:D,extendString:j,extendUint8Array:I,extendBuiltins:()=>{j(),I()},Base64:{}};return Object.keys(O).forEach((e=>O.Base64[e]=O[e])),O}));
/**
 * Chrome Bookmarks Converter
 * v1.0.0
 *
 * Convert a standard exported Google Chrome bookmarks HTML file into a JavaScript oject structure.
 * 
 * Dependencies: jQuery (latest).
 *
 * @summary Use JavaScript to convert an exported Chrome bookmarks HTML file. Export the results to JSON.
 * @author Jason Snelders <jason@jsnelders.com>
 *
 * Created at     : 2019-11-14 22:34:00
 * Last modified  : 2019-11-14 22:34:00
 */
function ChromBookmarkConverter(){this.bookmarks={folders:[]},this.stripUnneededTags=function(a){return a=a.replace(/<p>/gi,""),a=a.replace(/<P>/gi,""),a=a.replace(/<dt>/gi,""),a=a.replace(/<DT>/gi,"")},this.processChromeBookmarksContent=function(a){var c,b=this;a=this.stripUnneededTags(a),c=$.parseHTML(a),$.each(c,function(a,c){if("DL"==c.tagName){var d={type:"folder",title:"未命名",items:[]};b.bookmarks.folders.push(d),b.processDL(c,1,d)}})},this.processDL=function(a,b,c){var d=this,e=0,f={},g={type:"folder",title:"",add_date:"",last_modified:"",items:[]},h={},i=$(a),j=!1;$.each(i.children(),function(a,i){var k,l,m,n,o,p,q,r,s;e+=1,k=b+"."+e,1==j&&i.tagName.toLowerCase()!="DL".toLowerCase()&&(j=!1,console.log("h3",f),g.items.push(f)),i.tagName.toLowerCase()=="DL".toLowerCase()&&(g={type:"folder",title:f.title,add_date:f.add_date,last_modified:f.last_modified,items:[]},1==j&&(j=!1),d.bookmarks.folders.push(g),d.processDL(i,k,g)),i.tagName.toLowerCase()=="H3".toLowerCase()&&(l=$(i),m=l.text()?l.text():"未命名",n=l.attr("add_date"),o=l.attr("last_modified"),f={type:"header",title:m,add_date:n,last_modified:o},j=!0),"a"==i.tagName.toLowerCase()&&isURL($(i).attr("href"))&&""!=$(i).text()&&(p=$(i),q=p.text(),r=p.attr("href"),s=p.attr("add_date"),p.attr("icon"),h={type:"link",title:q,href:r,add_date:s},c.items.push(h))})}}
