/*--------------------------------------------------------*/
/* TABLE OF CONTENTS: */
/*--------------------------------------------------------*/

/* 01 - VARIABLES */
/* 02 - WINDOW LOAD */
/* 03 - SWIPER SLIDER */
/* 04 - MOBILE MENU */
/* 05 - WINDOW SCROLL */
/* 06 - IZOTOPE */
/* 07 - CLICK */
/* 08 - VIDEO OPEN */
/* 09 - WOW ANIMATION */

jQuery(function($) { "use strict";

    /*============================*/
	/* 01 - VARIABLES */
	/*============================*/
	
	var swipers = [], winW, winH, winScr, _isresponsive, smPoint = 768, mdPoint = 992, lgPoint = 1200, addPoint = 1600, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);

	function pageCalculations(){
		winW = $(window).width();
		winH = $(window).height();
	}
	pageCalculations();
					
   if(_ismobile) {$('body').addClass('mobile');}
	
	/*============================*/
	/* 02 - WINDOW LOAD */
	/*============================*/
	
	$(window).load(function(){

	     izotopInit();
	     $('.loader').hide(200);
		
	});
	
	/*============================*/
	/* 03 - SWIPER SLIDER */
	/*============================*/
					
	function updateSlidesPerView(swiperContainer){
		if(winW>=addPoint) return parseInt(swiperContainer.attr('data-add-slides'),10);
		else if(winW>=lgPoint) return parseInt(swiperContainer.attr('data-lg-slides'),10);
		else if(winW>=mdPoint) return parseInt(swiperContainer.attr('data-md-slides'),10);
		else if(winW>=smPoint) return parseInt(swiperContainer.attr('data-sm-slides'),10);
		else return parseInt(swiperContainer.attr('data-xs-slides'),10);
	}

	function resizeCall(){
		pageCalculations();

		$('.swiper-container.initialized[data-slides-per-view="responsive"]').each(function(){
			var thisSwiper = swipers['swiper-'+$(this).attr('id')], $t = $(this), slidesPerViewVar = updateSlidesPerView($t), centerVar = thisSwiper.params.centeredSlides;
			thisSwiper.params.slidesPerView = slidesPerViewVar;
			thisSwiper.reInit();
			if(!centerVar){
				var paginationSpan = $t.closest('.poind-closest').find('.pagination span');
				var paginationSlice = paginationSpan.hide().slice(0,(paginationSpan.length+1-slidesPerViewVar));
				if(paginationSlice.length<=1 || slidesPerViewVar>=$t.find('.swiper-slide').length) $t.addClass('pagination-hidden');
				else $t.removeClass('pagination-hidden');
				paginationSlice.show();
			}
		});
	}
	if(!_ismobile){
		$(window).resize(function(){
			resizeCall();
		});
	} else{
		window.addEventListener("orientationchange", function() {
			resizeCall();
		}, false);
	}
					
	function initSwiper(){
		var initIterator = 0;
		$('.swiper-container').each(function(){								  
			var $t = $(this);								  

			var index = 'swiper-unique-id-'+initIterator;

			$t.addClass('swiper-'+index + ' initialized').attr('id', index);
			$t.closest('.poind-closest').find('.pagination').addClass('pagination-'+index);

			var autoPlayVar = parseInt($t.attr('data-autoplay'),10);

			var slidesPerViewVar = $t.attr('data-slides-per-view');
			if(slidesPerViewVar == 'responsive'){
				slidesPerViewVar = updateSlidesPerView($t);
			}
			else slidesPerViewVar = parseInt(slidesPerViewVar,10);

			var loopVar = parseInt($t.attr('data-loop'),10);
			var speedVar = parseInt($t.attr('data-speed'),10);
            var centerVar = parseInt($t.attr('data-center'),10);
			swipers['swiper-'+index] = new Swiper('.swiper-'+index,{
				speed: speedVar,
				pagination: '.pagination-'+index,
				loop: loopVar,
				paginationClickable: true,
				autoplay: autoPlayVar,
				slidesPerView: slidesPerViewVar,
				keyboardControl: true,
				calculateHeight: true, 
				simulateTouch: true,
				roundLengths: true,
				centeredSlides: centerVar,
				onInit: function(swiper){
					var activeIndex = (loopVar===1)?swiper.activeLoopIndex:swiper.activeIndex;
					var sliderLen = $t.find('.swiper-slide').length;
					if (sliderLen <= 9) sliderLen = '0' + sliderLen;
				    $t.find('.first-slide').addClass('active');
					$t.parent().find('.slider-number b').text(sliderLen);
					$t.parent().find('.slider-number span').text(activeIndex+1);
				},
				onSlideChangeEnd: function(swiper){
					var activeIndex = (loopVar===1)?swiper.activeLoopIndex:swiper.activeIndex,
					qVal = $t.find('.swiper-slide-active').attr('data-val'),
					srcNext = $t.find('.swiper-slide-active').next().find('img').attr('src'),
				    srcPrev = $t.find('.swiper-slide-active').prev().find('img').attr('src');		
					$('.swiper-arrow-left').find('.preiew-img').attr('style','background-image:url('+srcPrev+')');
					$('.swiper-arrow-right').find('.preiew-img').attr('style','background-image:url('+srcNext+')');
					$t.find('.swiper-slide[data-val="'+qVal+'"]').addClass('active');
					$t.parent().find('.slider-number span').text(activeIndex+1);
				},
				onSlideChangeStart: function(swiper){
					$t.find('.swiper-slide.active').removeClass('active');
				}
			});
			swipers['swiper-'+index].reInit();
				if($t.attr('data-slides-per-view')=='responsive'){
					var paginationSpan = $t.closest('.poind-closest').find('.pagination span');
					var paginationSlice = paginationSpan.hide().slice(0,(paginationSpan.length+1-slidesPerViewVar));
					if(paginationSlice.length<=1 || slidesPerViewVar>=$t.find('.swiper-slide').length) $t.addClass('pagination-hidden');
					else $t.removeClass('pagination-hidden');
					paginationSlice.show();
				}
			initIterator++;
		});
		
	}

	initSwiper();

	$('.swiper-arrow-left').on('click', function(){
		swipers['swiper-'+$(this).closest('.arrow-closest').find('.swiper-container').attr('id')].swipePrev();
	});
	$('.swiper-arrow-right').on('click', function(){
		swipers['swiper-'+$(this).closest('.arrow-closest').find('.swiper-container').attr('id')].swipeNext();
	});
	
	/*============================*/
	/* 04 - MOBILE MENU */
	/*============================*/
	
	$(document).on('click', '.burger-menu', function(){
	    $('.nav-menu').toggleClass('slide');
		 $('body').toggleClass('fix');
	      $(this).toggleClass('active');
		   return false;
	});
	
	/*============================*/
	/* 05 - WINDOW SCROLL */
	/*============================*/
	
    $(window).scroll(function() {
		
	   if ($('.time-line').length) {
		 $('.time-line').not('.animated').each(function(){
		  if($(window).scrollTop() >= $(this).offset().top-$(window).height()*0.5)
		   {$(this).addClass('animated').find('.timer').countTo();}});
		}
		if ($('.start-line').length){
			if($(window).scrollTop() >= $('.start-line').offset().top - $('.start-line').height()){
				 $('.skill-line div').each(function(){
							var objel = $(this);
							var pb_width = objel.attr('data-width-pb');
							objel.css({'width':pb_width});
						});
			  }
		 }
	});
	
	/*============================*/
	/* 06 - IZOTOPE */
	/*============================*/
	
	function izotopInit() {
	  if ($('.izotope-container').length) {
	    var $container = $('.izotope-container');
	  	  $container.isotope({
			itemSelector: '.item',
			layoutMode: 'masonry',
			masonry: {
			  columnWidth: '.grid-sizer'
			}
		  });
			$('.filter-mob-list').on('click', 'li', function() {
			  $('.izotope-container').each(function(){
				 $(this).find('.item').removeClass('animated');
			  });
				 $('.filter-mob-list li').removeClass('active');
				 $(this).addClass('active');
				   var filterValue = $(this).attr('data-filter');
					$container.isotope({filter: filterValue});
			});  
	  }
	}
	
	$('.load-more').on('click', function(){
	    $('.load-item').fadeIn(500);
		 izotopInit();
		  $(this).fadeOut(500);
		   $('.no-item').fadeIn(500);
		  return false;
	});

	/*============================*/
	/* 07 - CLICK */
	/*============================*/
	
    if ($(window).width()<=992){					
		$(document).on('click', '.drop-link', function(){
		  $('.drop-link').parent().removeClass('active');
			 $(this).parent().addClass('active');
			   $(this).parent().find('> .drop-menu').slideToggle(300);
		});

		$(document).on('click', '.drop-link-next', function(){
		  $(this).toggleClass('active');	
			$(this).parent().find('.drop-menu-next').slideToggle(300);
		});
	}else{
	    $(document).on('mouseenter', '.style-1 .drop-link', function(){
		  $('.style-1 .nav-list li').removeClass('active');
			 $(this).parent().addClass('active');
			   $(this).parent().find('> .drop-menu').slideDown(300);
		});
		
		$('.style-1 .nav-list li').on('mouseleave', function(){
		    $(this).removeClass('active');
			   $(this).stop(true,true).find('> .drop-menu').slideUp(500); 
		});
		
		$(document).on('mouseenter', '.style-1 .drop-link-next', function(){
		   $(this).addClass('active');	
			 $(this).parent().find('.drop-menu-next').slideDown(300);
		});
		
	}
	
	if ($(window).width()<=992){
		$(document).on('click', '.drop-filter', function(){
		   $(this).parent().find('.filter-mob-list').slideToggle(300);
		}); 

		$(document).on('click', '.filter-mob-list li', function(){
		   $(this).parent().slideUp(300);
             $('.drop-filter span').text($(this).text());
		});
	}
	
	/*============================*/
	/* 08 - VIDEO OPEN */
	/*============================*/

    $(function(){	
		$(document).on('click', '.play-button', function(){
		   var buttonVal = $('.play-button').index(this);
			  var vid = $(this).closest('.video-item').find('.bgvid').eq(buttonVal);
			   $('.video-item').addClass('act');
				vid.get(0).play();
			return false;
		});

		$('.close-video').on('click', function(){
			var closeVal = $('.close-video').index(this);
			  var pauseVid = $(this).closest('.video-item').find('.bgvid').eq(closeVal);
			   $('.video-item').removeClass('act');
			   pauseVid.get(0).pause();
		});
     });
	 
	/*============================*/
	/* 09 - WOW ANIMATION */
	/*============================*/
	
    if ($(window).width()>1200){					
	var wow = new WOW(
	  {
		boxClass:     'wow',
		animateClass: 'animated',
		offset:       0, 
		mobile:       true, 
		live:         true,       
		scrollContainer: null
	  }
	);
	wow.init();	
	}
	
	$('.close-popup').on('click', function(){
	  $('.success').removeClass('active');
	});				
		
					

	  if ($('.section-scroll').length && !_ismobile)	{
		$.scrollify({
			section : ".section-scroll",
			setHeights: false,
			offset: -100
		});
	  }
					
    (function () {
    $(function () {
        var $links, $nav, activateLink, slides, wHeight;
        $nav = $('.page-vertival-nav');
        $links = $nav.find('a');
        slides = $('.section-scroll').get();
        wHeight = window.innerHeight;
        activateLink = function () {
            var bScrollTop;
            bScrollTop = document.body.scrollTop;
            return slides.forEach(function (slide) {
                var $activeLink, linkWidth;
                if (slide.offsetTop >= bScrollTop && slide.offsetTop < wHeight + bScrollTop) {
                    $activeLink = $links.filter('[href=\'#' + slide.id + '\']');
                    if (!$activeLink.hasClass('active')) {
                        $links.removeClass('active');
                        $activeLink.addClass('active');
                        if ($activeLink.offset()) {
                            linkWidth = $activeLink.width();
                        }
                        return true;
                    }
                }
            });
        };
        setTimeout(function () {
            return activateLink();
        }, 0);

        return $(window).on('scroll', function () {
            return activateLink();
        });
    });
}.call(this));
					

	var videoLink = $('#video').attr('data-link');
					
	if ($('#video').length) {				
		$('#video').YTPlayer({
			fitToBackground: true,
			videoId: videoLink
		});	
	}

});

