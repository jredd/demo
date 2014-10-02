var main_nav = $('#main_nav');
var nav_width = main_nav.width();
var left_out = -40-nav_width;
var nav_height = main_nav.height();
var header_height = $('header').height()-3;
var nav_icon = $('#nav_icon');

$( document ).ready(function() {
    // If the page is loaded below the nav just animate in the nav_ico and place the nav
    if ($(window).scrollTop() > header_height) {
        console.log($(window).scrollTop(), '---', header_height);
        nav_icon.filter(':not(:animated)').stop(true, false).delay(100).animate({
            left: 0
        }, 300, function() {
            main_nav.css({'left': left_out})
            main_nav.addClass('sticky_nav')
        })
    }

    $(window).scroll(function(e) {
        var scroll = $(window).scrollTop();

        if (scroll > header_height) {
            main_nav.addClass('sticky_nav');
            main_nav.filter(':not(:animated)').stop(true, false).animate({
                left: left_out
            }, 300);

            nav_icon.filter(':not(:animated)').stop(true, false).delay(100).animate({
                left:0
            }, 300)
        }else {
            main_nav.removeClass('sticky_nav');
            main_nav.filter(':not(:animated)').stop(true, false).animate({
                left: 110
            }, 300);
            nav_icon.filter(':not(:animated)').stop(true, false).delay(0).animate({
                left: '-52px'
            }, 300)
        }
    });

    var left;
    // setup nav flyout on ico click
    nav_icon.click(function(e) {
        if (main_nav.css('left') == '12px'){
            left = left_out
        }else {
            left = 12
        }

        main_nav.animate({
            left: left
        })
    });
});