$(document).ready(function() {

	//anonApp.Views.buildTheWall(); // this runs the script to build the isotope elements from json
	$theWall = $('.wall'); // cache the wall

	// When images are loaded, lets get this party started
	$('body').imagesLoaded(function(){
		$('.loading').fadeOut(); // fade out loading div once assets are loaded

		if ( !$('body').hasClass('details') ) {
			anonApp.Views.sexifyLp();
			anonApp.Utils.initIsotope();
			anonApp.Utils.initIsotopeClicks();
			anonApp.Views.hoverTheWall();
			anonApp.Views.buildLandingPage();
			anonApp.Utils.initStellar();
			anonApp.Utils.doTheBubbles();
			anonApp.Views.setupHeader();
		}

		anonApp.Utils.hookupModals();
		anonApp.Models.grabStory();
	});

	// These functions are not dependent on images being loaded
	anonApp.Models.populateStorySlide();
	anonApp.Views.footerExpander();
	anonApp.Views.detailsSlide();
	anonApp.Utils.essentialsAccordian();

	// On Scroll lets fire some sexiness
	$(window).scroll(function() {

		scrollTop = $(window).scrollTop();

		if ( !$('body').hasClass('details') ) {
			anonApp.Views.scrollHeaderFooter();

			var opacity = (1 - ( scrollTop / 500 )),
				opacity2 = (0 + (scrollTop / 100)),
				opacity3 = (1 - ( scrollTop / 300 ));

			anonApp.Utils.updateElAlpha($('.scroll-img'), 0.1, opacity);
			anonApp.Utils.updateElAlpha($('#landing-page .copy'), 0.1, opacity2);
			anonApp.Utils.updateElAlpha($('#lp-copy').find('.title'), 0.1, opacity3);

		}
	}); // end window.scroll

}); // end document.ready


var anonApp = anonApp || {};
anonApp.Utils = anonApp.Utils || {};
anonApp.Models = anonApp.Models || {};
anonApp.Views = anonApp.Views || {};
anonApp.Init = anonApp.Init || {};


// setup app vars, functions and expr...
anonApp.Utils.windowWBreakpoint = 1024,
anonApp.Utils.windowHeight = $(window).height(),
anonApp.Utils.windowWidth = $(window).width(),
anonApp.Utils.JSONMethod = 'GET',
anonApp.Utils.JSONData = 'data.json',
anonApp.Utils.JSONDataType = 'json',


anonApp.Views.setupHeader = function() {

	// Wall sort drop down for small screens
	$('#sort-by li.dropdown').click(
		function() {
			if ($(this).hasClass('open')) {
				if (anonApp.Utils.windowWidth <= anonApp.Utils.windowWBreakpoint) {
					ddHeight = '25px';
				} else {
					ddHeight = 'auto';
				}
				// close me
				$('#sort-by').animate({ height: ddHeight });
				$(this).removeClass('open');
				$(this).text('Open to sort');
			} else {
				// open me
				$(this).addClass('open');
				$('#sort-by').animate({ height: 210 });
				$(this).text('Close menu');
			}
		}
	);

	// Sorting drop down click event
	$('#sort-by li a').click(function() {
		if ( anonApp.Utils.windowWidth <= anonApp.Utils.windowWBreakpoint ) {
			ddHeight = '25px';
		} else {
			ddHeight = 'auto';
		}

		$('#sort-by li.dropdown').removeClass('open');
		$('#sort-by').animate({ height: ddHeight}, 'fast');
		$('#sort-by li.dropdown').text($(this).text());
	});


	// Question Image next to sorting in header
	var tweenShow = { autoAlpha: 1, display: 'block' };
	var tweenShowNoDisplay = { autoAlpha: 1 };
	var tweenHide = { autoAlpha: 0, display: 'none' };
	var tweenHideNoDisplay = { autoAlpha: 0 };

	$('ul#sort-by li').hover(
		function() {
			if ( $(this).children('img').length === 0 ) return false;
			TweenMax.to($(this).children('img'), 1, { css: tweenShow, delay: 0 });
		},
		function() {
			if ( $(this).children('img').length === 0 ) return false;
			TweenMax.to($(this).children('img'), 0.5, { css: tweenHide, delay: 0 });
		}
	);


	// Fire overlay and pillar details in header
	$('ul#sort-by li > img').click(function() {
		var details = $(this).data('details-type'),
		detailsWindow = $('#details.' + details);

		$('body').addClass('masonryDialogIsOpen');
		TweenMax.to($('.dialog-masonry'), 1, { css: tweenShowNoDisplay, delay: 0 });
		TweenMax.to($('#main-nav'), 0.35, { css: tweenHide, delay: 0, easing: Power2.easeOut });
		TweenMax.to($(detailsWindow), 0.35, { css: tweenShow, delay: 0.35, easing: Circ.easeOut });
	});


	// Close overlay and pillar details
	$('#details .close-icon').click(function() {
		var parentDetails = $(this).parent('#details').attr('class');
		TweenMax.to($('#details.'+parentDetails), 0.35, { css: tweenHide, delay: 0, easing: Power4.easeInOut });
		TweenMax.to($('#main-nav'), 0.5, { css: tweenShow, delay: 0.35, easing: Power2.easeInOut });
		TweenMax.to($('.dialog-masonry'), 0.25, { css: tweenHideNoDisplay });
		$('body').removeClass('masonryDialogIsOpen');
	});

},



anonApp.Views.scrollToMasonry = function() {
	// Run a few small things if we are on the main page
	$masonry = $('#masonry');

	if( $masonry.length === 1 ) {
		var masonryOffset = $masonry.offset();
		var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false );

		if( window.location.hash == '#theWall' && iOS !== true ) {
			window.setTimeout(function(){
				$('.loading').remove();
				TweenMax.to(window, 1.5, {scrollTo:{y: masonryOffset.top + 100}, ease:Power2.easeInOut});
			}, 1000);
		}

		// When you click top scroll image, zip down to masonry
		$('.scroll-img').click(function() {
			TweenMax.to(window, 1.75, {scrollTo:{y: masonryOffset.top + 100}, ease:Power2.easeInOut});
		});
	}
},



// Setup Landing Page
anonApp.Views.buildLandingPage = function() {
	if ( (anonApp.Utils.windowHeight + 100) < 900 ) {
		anonApp.Utils.windowHeight = 900;
	} else {
		anonApp.Utils.windowHeight = anonApp.Utils.windowHeight + 100;
	}
	$('#landing-page').css('height', anonApp.Utils.windowHeight);
	TweenMax.to( $('#landing-page .bubble-1'), 1, {css: { autoAlpha: 1 }, delay: 0});
	TweenMax.to( $('#landing-page .bubble-2'), 1, {css: { autoAlpha: 1 }, delay: 0.5});
	TweenMax.to( $('#landing-page .bubble-3'), 1, {css: { autoAlpha: 1 }, delay: 0.25});
},



// Setup Parallax Elements
anonApp.Utils.initStellar = function() {
	if ( $('#landing-page').length === 1 && ( anonApp.Utils.windowWidth > anonApp.Utils.windowWBreakpoint ) ) {
		$.stellar({
			horizontalScrolling: false,
			verticalOffset: 40
		});
	}
},



// Setup Isotope
anonApp.Utils.initIsotope = function() {
	$theWall.isotope({
		itemSelector : 'article',
		layoutMode: 'masonry',
		resizable: true,
		sortBy: 'random',
		masonry : {
			columnWidth : 15,
			gutterWidth: 15
		},
		getSortData : {
			inspiration: function($elem) {
				var isInspiration = $elem.hasClass('data-inspiration');
				return (!isInspiration?' ':'');
			},
			connection: function($elem) {
				var isConnection = $elem.hasClass('data-connection');
				return (!isConnection?' ':'');
			},
			influence: function($elem) {
				var isInfluence = $elem.hasClass('data-influence');
				return (!isInfluence?' ':'');
			},
			progress: function($elem) {
				var isProgress = $elem.hasClass('data-progress');
				return (!isProgress?' ':'');
			},
			mission: function($elem) {
				var isMission = $elem.hasClass('data-mission');
				return (!isMission?' ':'');
			},
			vision: function($elem) {
				var isVision = $elem.hasClass('data-vision');
				return (!isVision?' ':'');
			},
			originalOrder: function($elem) {
				sortBy: 'random';
			}
		}
	});
},



// Setup Isotope Click Events
anonApp.Utils.initIsotopeClicks = function() {
	var $optionSets = $('#main-nav .option-set'),
	$optionLinks = $optionSets.find('a');

	//$optionLinks.click(function(){
	$optionLinks.on('click', function() {

		var $this = $(this),
			$optionSet = $this.parents('.option-set'),
			options = {},
			key = $optionSet.attr('data-option-key'),
			value = $this.attr('data-option-value');

		value = value === 'false' ? false : value;
		options[ key ] = value;

		if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
			changeLayoutMode( $this, options );
		} else {
			$theWall.isotope( options );

			$('#sort-by').find('.checked').removeClass('checked');
			$(this).addClass('checked');
		}

		return false;
	});
},



// Story Details Slider (page, not modal)
anonApp.Views.detailsSlide = function() {

	var $blocks = $('#slide-blocks'),
		$blocksList = $blocks.find('ul');
		totalBlocks = $blocksList.find('li').length,
		defaults = {
			easing: 'Expo.easeInOut',
			moveDuration: '1',
			moveUpBy: '-425',
			moveDownBy: '425'
		};

	// if no blocks are present or total block count less than or = to 5, dont run
	if ( !$blocks || totalBlocks <= 5 ) {

		// set initial block opacity then hover event for opacity 1 and scale
		var tweenMouseEnter = { scaleX: 1.1, scaleY: 1.1 };
		var tweenMouseLeave = { scaleX: 1, scaleY: 1 };

		$blocksList.find('li:not(".see-more")').css('opacity', 0.6);
		$blocksList.find('li:not(".see-more")').hover(
			function() {
				TweenMax.to($(this), 0.25, {css:{ opacity: 1 }, delay: 0});
				TweenMax.to($(this).find('img'), 0.25, { css: tweenMouseEnter, delay: 0, easing: Circ.easeInOut });
			},
			function() {
				TweenMax.to($(this), 0.25, {css:{ opacity: 0.6 }, delay: 0});
				TweenMax.to($(this).find('img'), 0.25, { css: tweenMouseLeave, delay: 0, easing: Circ.easeInOut });
			}
		);

		return false;

	}

	_init = function() {
		$blocksList.find('a.more').on('click', function() {
			slideBlocks(1);
		});

		$blocksList.find('a.less').on('click', function() {
			slideBlocks(0);
		});

		setOddBlocks();

		// set initial block opacity then hover event for opacity 1 and scale
		var tweenMouseEnter = { scaleX: 1.1, scaleY: 1.1 };
		var tweenMouseLeave = { scaleX: 1, scaleY: 1 };

		$blocksList.find('li:not(".see-more")').css('opacity', 0.6);
		$blocksList.find('li:not(".see-more")').hover(
			function() {
				TweenMax.to($(this), 0.25, {css:{ opacity: 1 }, delay: 0});
				TweenMax.to($(this).find('img'), 0.25, { css: tweenMouseEnter, delay: 0, easing: Circ.easeInOut });
			},
			function() {
				TweenMax.to($(this), 0.25, {css:{ opacity: 0.6 }, delay: 0});
				TweenMax.to($(this).find('img'), 0.25, { css: tweenMouseLeave, delay: 0, easing: Circ.easeInOut });
			}
		);

		// randomly fade in story blocks
		var v = $blocks.find("li").css('visibility', 'hidden'), cur = 0;
		for( var j, x, i = v.length; i; j = parseInt(Math.random() * i,10), x = v[--i], v[i] = v[j], v[j] = x );

		function fadeInNextLI() {
			v.eq(cur++).css('visibility','visible').hide().fadeIn();
			if(cur != v.length) setTimeout(fadeInNextLI, 50);
		}

		fadeInNextLI();
	},

	setOddBlocks = function() {
		$blocksList.find('li').filter(':odd').each(function() {
			$(this).css('margin-right', 0);
		});
	},

	slideBlocks = function(amt) {
		if ( amt === 1 ) {
			TweenMax.to($blocksList, defaults.moveDuration, {css:{ top: '+=' + defaults.moveUpBy }, delay: 0.15, easing: defaults.easing });
		} else {
			TweenMax.to($blocksList, defaults.moveDuration, {css:{ top: '+=' + defaults.moveDownBy }, delay: 0, easing: defaults.easing });
		}
	};

	_init();
},



// Leadership Accordian
anonApp.Utils.essentialsAccordian = function() {
	if ( $('.accordian').length !== 1 ) return false;
	$('.accordian h4 a').click(function(e){
		e.preventDefault();
		if ($(this).hasClass('open')) {
			$(this).removeClass('open');
			$(this).parent().parent().find('ul').slideUp();
			$(this).find('span').html('+');
		} else {
			$(this).addClass('open');
			$(this).parent().parent().find('ul').slideDown('slow');
			$(this).find('span').html('-');
		}
	});
},



// Footer Expanding Event
anonApp.Views.footerExpander = function() {
	$('footer .controller, footer h3').click(function() {

		screenWidth = $(window).width();
		if ( screenWidth <= anonApp.Utils.windowWBreakpoint ) {
			footerDims = {
				open: '335px',
				close: '52px'
			};
		} else {
			footerDims = {
				open: '195px',
				close: '52px'
			};
		}

		var $footer = $('footer'),
			footerDefaults = {
				topClosed: 53,
				topOpen: 300,
				easingClose: 'Power3.easeInOut',
				easingOpen: 'Power2.easeOut'
			};

		if ($footer.hasClass('open')) {
			$footer.removeClass('open');
			TweenMax.to($footer, 0.25, {css:{ height: footerDims.close }, delay: 0, ease:Power2.easeIn});
			$('footer .controls').removeClass('collapse').find('h2').html('Expand');

			TweenMax.to($('footer .share-lg'), 0.5, {css:{ autoAlpha: 0, top: '400' }, delay: 0, easing: footerDefaults.easingClose });
			TweenMax.to($('footer .share-sm'), 0.5, {css:{ autoAlpha: 1, top: 0 }, delay: 0, easing: footerDefaults.easingClose });
			TweenMax.to($('footer .annual-report > .underhead'), 0.25, {css:{ top: footerDefaults.topOpen }, delay: 0.03, easing: footerDefaults.easingClose });
			TweenMax.to($('footer .about > .underhead'), 0.25, {css:{ top: footerDefaults.topOpen }, delay: 0.02, easing: footerDefaults.easingClose });
			TweenMax.to($('footer .join > .underhead'), 0.25, {css:{ top: footerDefaults.topOpen }, delay: 0, easing: footerDefaults.easingClose });

		} else {

			$footer.addClass('open');
			TweenMax.to($('footer'), 0.5, {css:{ height: footerDims.open }, delay: 0, ease:Power2.easeOut});
			$('footer .controls').addClass('collapse').find('h2').html('Collapse');

			TweenMax.to($('footer .share-sm'), 1, {css:{ autoAlpha: 0, top: '-150'}, delay: 0, easing: Back.easeIn});
			TweenMax.to($('footer .share-lg'), 0.75, {css:{ autoAlpha: 1, top: 0}, delay: 0, easing: Circ.easeOut});
			TweenMax.to($('footer .annual-report > .underhead'), 0.5, { css:{ top: footerDefaults.topClosed }, delay: 0, easing: footerDefaults.easingOpen });
			TweenMax.to($('footer .about > .underhead'), 0.45, {css:{ top: footerDefaults.topClosed }, delay: 0.15, easing: footerDefaults.easingOpen });
			TweenMax.to($('footer .join > .underhead'), 0.4, {css:{ top: footerDefaults.topClosed }, delay: 0.2, easing: footerDefaults.easingOpen });
		}
	});
},



// Parallax background bubbles and elements
anonApp.Utils.doTheBubbles = function() {

	$window = $(window);

	$('[data-type]').each(function() {
		$(this).data('offsetY', parseInt($(this).attr('data-offsetY'),10));
		$(this).data('Xposition', $(this).attr('data-Xposition'));
		$(this).data('speed', $(this).attr('data-speed'));
	});

	//$('section[data-type="background"]').each(function(){
	$('[data-type="background"]').each(function() {
		var $self = $(this),
			offsetCoords = $self.offset(),
			topOffset = offsetCoords.top;

		$(window).scroll(function() {

			var yPos = -($window.scrollTop() / $self.data('speed'));
			if ( $self.data('offsetY') ) yPos += $self.data('offsetY');
			var coords = '50% '+ yPos + 'px';
			$self.css({ backgroundPosition: coords });

			// adjust bg position
			$('[data-type="sprite"]', $self).each(function() {
				var $sprite = $(this);
				var yPos = -($window.scrollTop() / $sprite.data('speed'));
				var coords = $sprite.data('Xposition') + ' ' + (yPos + $sprite.data('offsetY')) + 'px';
				$sprite.css({ backgroundPosition: coords });

			});

			// adjust bottom positioning
			$('[data-type="sprite-abs"]', $self).each(function() {
				var $sprite = $(this);
				var yPos = ($window.scrollTop() * $sprite.data('speed'));
				var coords = (yPos + $sprite.data('offsetY')) + 'px';
				$sprite.css({ bottom: coords, left: $sprite.data('Xpositin') });
			});

		}); // end scroll
	});	// end each
},



// Isotope Item Hover Events for mask
anonApp.Views.hoverTheWall = function() {
	$('.wall article:not(.empty)').hover(
		function() {
			TweenMax.to($(this).find('.mask'), 0.5, {css:{ autoAlpha: 1, className: '+=active' }, delay: 0, ease:Power2.easeOut });
		},
		function() {
			TweenMax.to($(this).find('.mask'), 0.35, {css:{ autoAlpha:0, className: '-=active' }, delay: 0, ease:Power2.easeInOut });
		}
	);
},



// Function to help animate element opacity
anonApp.Utils.updateElAlpha = function(elem, speed, opacity) {
	if(elem.length === 0) return false;
	TweenMax.to(elem, speed, { css:{ autoAlpha: opacity }, delay: 0 });
},



// Vars to help stop scroll events from propigating more then once
anonApp.Utils.masonryLoaded = false,
anonApp.Utils.masonryTopped = false,



// Animate in header and footer once scroll position reaches certain point
// then remove teh landing page to prevent scrolling up
anonApp.Views.scrollHeaderFooter = function() {

	var $nav = $('#head-menu'),
		$footer = $('footer'),
		tweenDisplay = { autoAlpha: 1 },
		tweenEasing = 'Power3.easeOut',
		scrollTop = $(window).scrollTop();

	if ( scrollTop > (anonApp.Utils.windowHeight - 50 ) && anonApp.Utils.masonryLoaded === false ) {

		anonApp.Utils.masonryLoaded = true;
		TweenMax.to($nav, 0.75, { css: tweenDisplay, delay: 0 });
		TweenMax.to($nav, 0.5, { css:{ top: 0 }, delay: 0, easing: Power3.easeOut });
		TweenMax.to($footer, 0.75, { css: tweenDisplay, delay: 0 });
		TweenMax.to($footer, 0.5, { css:{ bottom: 0 }, delay: 0, easing: Power3.easeOut });

		//$('#landing-page').remove();
		$('#landing-page').hide();
		$('.loading').hide();
		//$('body').scrollTop(0).scrollLeft(0);
		$(window).scrollTop(0);
		$(document).scrollTop(0);

		TweenMax.to($('#bubbles'), 0.2, { css: tweenDisplay, delay: 0 });
	}

	if ( anonApp.Utils.masonryLoaded && anonApp.Utils.masonryTopped === false ) {
		if ( $('#landing-page').length === 0 && scrollTop < 250 ) {
			TweenMax.to($('#masonry'), 0.5, {css:{ marginTop:150 }, delay:0});
			anonApp.Utils.masonryTopped = true;
		}
	}

},



// Initialize Modals and their events
anonApp.Utils.hookupModals = function() {

	//$('article.empty:not(".transparent"), a[id*="modal"]').click(function(evt) {
	$('.item:not(.empty), a#modal').click(function(evt) {
		evt.preventDefault();

		if ( $(this).data('story-id') ) {
			storyId = $(this).data('story-id');
		} else {
			storyId = $(this).parents('article').data('story-id');
		}

		// load story into modal
		anonApp.Models.grabStoryForModal(storyId);

		//open the modal and add the blur
		$('body').addClass('dialogIsOpen');
		$('#modal').addClass('open');

		// initialize the modal slider and populate it with stories from the same pillar
		anonApp.Views.buildModalSlider();
		anonApp.Models.populateModalSlide(storyId);

	});


	// modal close
	$('#modal a.close-mask, #modal a.close-modal').click(function() {
		$('body').removeClass('dialogIsOpen');
		TweenMax.to($('#modal'), 0.3, {css:{ className: '-=open' }, delay: 0});
		$('.slide-tracking ul').css('left', 0); // reset modal slide tracker on modal close
		$('#modal .image-wrapper img').attr('src', 'img/wall-blocks/lg-square-2.png'); //reset image
		$('#modal').find('.arrow-left, .arrow-right').hide();
	});
},



// Modal Slider
anonApp.Views.buildModalSlider = function() {

	var $modal = $('#modal'),
		$slides = $modal.find('.slide-tracking ul li'),
		$slideTrack = $modal.find('.slide-tracking ul'),
		totalSlides = $slides.length,
		$arrowLeft = $modal.find('a.arrow-left'),
		$arrowRight = $modal.find('a.arrow-right'),
		defaults = {
			moveSpeed: '0.75',
			easing: 'Power2.easeOut',
			slidePosition: 1,
			moveDistance: 236,
			cssShow: 'visible',
			cssHide: 'hidden'
		};

	moveTrackRight = function() {
		if ( totalSlides <= 4 ) return false;
		if ( defaults.slidePosition == 2 && totalSlides <= 8 ) return false;

		var moveAmt = '-' + (defaults.moveDistance * defaults.slidePosition);

		TweenMax.to($slideTrack, defaults.moveSpeed, {css:{ left: moveAmt }, delay: 0, easing: defaults.easing });
		defaults.slidePosition++;

		checkControlArrows();
	},

	moveTrackLeft = function() {
		var moveAmt = 0;
		if ( defaults.slidePosition == 1 ) return false;
		if ( defaults.slidePosition == 3 ) { moveAmt = '-' + defaults.moveDistance; }

		TweenMax.to($slideTrack, defaults.moveSpeed, {css:{ left: moveAmt }, delay: 0, easing: defaults.easing });
		defaults.slidePosition--;

		checkControlArrows();
	},

	changeStories = function() {
		$modal.find('.slide-tracking a').click(function(e) {
			e.preventDefault();
			var selectedStory = $(this).data('story-id');
			anonApp.Models.grabStoryForModal(selectedStory); // grab new story
		});
	},

	checkControlArrows = function() {

		if ( defaults.slidePosition === 1 ) {
			$arrowLeft.fadeOut();
			$arrowRight.fadeIn();

		} else if ( defaults.slidePosition === 2 ) {
			$arrowLeft.fadeIn();
			$arrowRight.fadeIn();

		} else if ( defaults.slidePosition === 3 ) {
			$arrowLeft.fadeIn();
			$arrowRight.fadeOut();
		}

	};

	(_init = function() {

		// unbind all previously bound click event handlers
		$arrowLeft.off('click').fadeOut();
		$arrowRight.off('click').fadeIn();
		$modal.find('.slide-tracking a').unbind('click');

		changeStories(); // setup story changing click event

		if ( totalSlides > 4 ) {
			$arrowLeft.css('visibility', defaults.cssShow);
			$arrowRight.css('visibility', defaults.cssShow);

			$arrowRight.on('click', function() { moveTrackRight(); });
			$arrowLeft.on('click', function() { moveTrackLeft(); });
		} else {
			$arrowLeft.css('visibility', defaults.cssHide);
			$arrowRight.css('visibility', defaults.cssHide);
		}
	}()); // was })();
},



// Animate landing page on load
anonApp.Views.sexifyLp = function() {

	screenWidth = $(window).width();
	if ( screenWidth >= anonApp.Utils.windowWBreakpoint ) {
		bgPosition = "50% -100px";
	} else {
		bgPosition = "50% -100px";
	}
	TweenMax.to($('#landing-page'), 2, {css:{ autoAlpha: 1, visibility: 'visible' }, delay: 0});
	TweenMax.to($('#landing-page .number-mask'), 0.5, {css:{ autoAlpha: 1, backgroundPosition: bgPosition, visibility: 'visible' }, delay: 0});

},



anonApp.Utils.pullStoryFromFile = function() {
	var fileName = window.location.href.substr(window.location.href.lastIndexOf('/') + 1);
	var fileNameShort = fileName.slice(7,9);
	return fileNameShort.replace('.', '');
},



// Details Page - Grab a story for details page from json
anonApp.Models.grabStory = function(storyID) {

	$content = $('#content.story');
	if ( $content.length === 0 ) return false;

	var storyNumber = anonApp.Utils.pullStoryFromFile();

	$.ajax({
		type: anonApp.Utils.JSONMethod,
		url: anonApp.Utils.JSONData,
		dataType: anonApp.Utils.JSONDataType,
		success: function(data) {
			$content.find('header > h2').text('Reason: ' + data[storyNumber - 1].id);
			$content.find('header > h3').text(data[storyNumber - 1].pillar);
			$content.find('article > h1').text(data[storyNumber - 1].reason);
			$content.find('.similar header h4').text(data[storyNumber - 1].pillar);
			$content.find('.featured img').attr('src', data[storyNumber - 1].imgStory);
			$content.find('.featured p').text(data[storyNumber - 1].storyShort);
		},
		complete: function() { $('#slide-blocks ul').empty(); anonApp.Models.populateStorySlide(); }
	});
},



// Modal - Grab short story and details for modal from json
anonApp.Models.grabStoryForModal = function(storyID) {

	if ( !storyID || storyID === '' ) return false;

	$modal = $('#modal');

	$.ajax({
		type: anonApp.Utils.JSONMethod,
		url: anonApp.Utils.JSONData,
		dataType: anonApp.Utils.JSONDataType,
		success: function(data) {
			$modal.find('header h3').text(data[storyID - 1].pillar);
			$modal.find('.dialog-right h3').text('Reason: ' + data[storyID - 1].id);
			$modal.find('.dialog-right h2').text(data[storyID - 1].reason);
			$modal.find('.dialog-right p').text(data[storyID - 1].storyShort);
			$modal.find('.dialog-right .button-wrapper a').attr('href', data[storyID - 1].linkUrl);
			$modal.find('.dialog-left .image-wrapper img').attr('src', data[storyID - 1].imgStory);
			$modal.find('.dialog-left .story-slide p > span').text(data[storyID - 1].pillar);
		}
	});
},



anonApp.Models.populateStorySlide = function() {

	if ( $('.story').length !== 1 ) return false;

	var currentType = $('.story .similar header h4').text().toLowerCase(),
		itemHtml = '',
		itemCount = 1,
		lastShown = false;

	$.ajax({
		type: anonApp.Utils.JSONMethod,
		url: anonApp.Utils.JSONData,
		dataType: anonApp.Utils.JSONDataType,
		success: function(data){
			$.each(data, function(index, element) {

				// iterate over pillar value in json and match current page's pillar
				if ( element.pillar == currentType && element.linkUrl !== '' && element.blockEmpty === false ) {

					// count items to add more/less boxes
					if ( itemCount == 6 ) {
						itemHtml += '<li class="see-more"><a class="more">See<br>MORE+</a></li>';
					}

					itemHtml += '<li><a href="' + element.linkUrl + '" data-story-id="' + element.id + '">' +
								'<img src="' + element.imgSlide + '">' +
								'</a></li>';

					itemCount++;
				}

				$('#slide-blocks ul').append(itemHtml); // throw the blocks into the ul

				// if we have over 7 we need to have a less block
				if ( itemCount > 7 ) {
					if ( lastShown === false ) {
						$('#slide-blocks ul').append('<li class="see-more less"><a class="less">See<br>Less-</a></li>');
						lastShown = true;
					}
				}

				itemHtml = '';
			});
		},
		complete: function() { anonApp.Views.detailsSlide(); }
	});

},



// Modal - Grab all stories in the same pillar and throw them into the slider
anonApp.Models.populateModalSlide = function(storyId) {

	if ( !storyId ) storyId = 1;

	$.ajax({
		type: anonApp.Utils.JSONMethod,
		url: anonApp.Utils.JSONData,
		dataType: anonApp.Utils.JSONDataType,
		success: function(data) {

			var parentStoryType = data[storyId - 1].pillar;
			var $slideTracker = $('#modal').find('.slide-tracking ul');
			$slideTracker.empty(); // clear out any lingering items in the list

			$.each(data, function(index, element) {

				if ( element.pillar == parentStoryType && element.linkUrl !== '' && element.blockEmpty === false ) {
					$slideTracker.append('<li><a id="change-story" data-story-id="' + element.id + '"><img src="' + element.imgStory + '" height="50" width="50"></a></li>');
				}

			});
		},

		complete: function() { anonApp.Views.buildModalSlider(); }
	});


};



// Isotope for centered masonry
$.Isotope.prototype._getCenteredMasonryColumns = function() {
	this.width = this.element.width();
	var parentWidth = this.element.parent().width();
	var colW = this.options.masonry && this.options.masonry.columnWidth || this.$filteredAtoms.outerWidth(true) || parentWidth;
	var cols = Math.floor( parentWidth / colW );
	cols = Math.max( cols, 1 );
	this.masonry.cols = cols;
	this.masonry.columnWidth = colW;
};

$.Isotope.prototype._masonryReset = function() {
	this.masonry = {};
	this._getCenteredMasonryColumns();
	var i = this.masonry.cols;
	this.masonry.colYs = [];
	while (i--) {
		this.masonry.colYs.push( 0 );
	}
};

$.Isotope.prototype._masonryResizeChanged = function() {
	var prevColCount = this.masonry.cols;
	this._getCenteredMasonryColumns();
	return ( this.masonry.cols !== prevColCount );
};

$.Isotope.prototype._masonryGetContainerSize = function() {
	var unusedCols = 0,
	i = this.masonry.cols;
	while ( --i ) {
		if ( this.masonry.colYs[i] !== 0 ) {
			break;
		}
		unusedCols++;
	}
	return {
		height : Math.max.apply( Math, this.masonry.colYs ),
		width : (this.masonry.cols - unusedCols) * this.masonry.columnWidth
	};
};

/*function getJsondata($str){

	return htmlspecialchars(stripslashes($str));

}*/
