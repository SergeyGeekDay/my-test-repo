function getView() {
	var cookie = getCookie('deviceView'),
		isMobile;

	if (cookie) {
		isMobile = cookie == 'mobile';
	} else {
		isMobile = isMobileDevice();
	}

	return isMobile ? 'mobile' : 'desktop';
}

function toggleDeviceView() {
	if (getView() == 'mobile') {
		setCookie('deviceView', 'desktop', 365, true);
	} else {
		setCookie('deviceView', 'mobile', 365, true);
	}

	location.reload();
}

function isMobileDevice() {
	var isMobile = false,
		htmlTagClasses = css_browser_selector(navigator.userAgent),
		resolution,
		mobileResolution = 640; //iPhone

	if (htmlTagClasses.indexOf('mobile') > -1) {
		isMobile = true;
	}

	// Set opera mobile as mobile device.
	if (htmlTagClasses.indexOf('opera') > -1 && htmlTagClasses.indexOf('linux') > -1) {
		isMobile = true;
	}

	if (window.screen) {
		resolution = Math.min(window.screen.width, window.screen.height);

		// Set large devices as desktop.
		if (isMobile && resolution > mobileResolution) {
			isMobile = false;
		}
	}

	return isMobile;
}

function showMobileView($) {
	var meta,
		html = $('html'), emptyClass = 'container-empty',
		contentNode, firstNavigationWidget, headerContainer;

	// Add viewport meta tag for mobile browsers
	if (!$('meta[name="viewport"]').length) {
		meta = document.createElement('meta');
		meta.name = 'viewport';
		meta.content = 'width=device-width, initial-scale=1, user-scalable=1';
		document.getElementsByTagName('head')[0].appendChild(meta);
	}

	html.addClass('mobile-view');

	// set content before sidebars
	contentNode = document.getElementById('content');
	contentNode.parentNode.insertBefore(contentNode, contentNode.parentNode.firstChild);

	// Attach mobile navigation to content
	$('ul.navigation a:not([href*="#"])').each(function() {
		var $this = $(this),
			linkPath = $this.attr('href');
		$this.attr('href', linkPath + '#content-content-inner');
	});

	//Move the first navigation widget to the top if it isn't there
	firstNavigationWidget = $('.widget-navigation').first();
	firstNavigationWidget.addClass('navigation-first');
	if (firstNavigationWidget[0] != $('.widget').first()[0]) {
		firstNavigationWidget.prependTo('#header-content-inner');

		headerContainer = $('.container.header').first();
		if (headerContainer.hasClass(emptyClass)) {
			headerContainer.removeClass(emptyClass);
		}
	}

	// Some mobile browsers don't handle anchor links. We should force scrolling.
	if (window.location.hash) {
		html.animate({
			scrollTop: $(window.location.hash).offset().top
		}, 750);
	}

	$('.mobile-view-switcher').html(window.mobileSwitcherText);
}

function showDesktopView($) {
	$('html').removeClass('mobile-view');


	if ($.browser.msie && $.browser.version < 10) {
		$('.unsupported').show();
	} else {
		window.fixWatermarkHeightId = $.startFixWatermarkHeight();

		if (typeof fixHeightColumns !== 'undefined' && fixHeightColumns) {
			window.fixWHeightColumnsId = $.startFixHeightColumns();
		}
	}

	$('.mobile-view-switcher').html(window.desktopSwitcherText);
}

function showMobileSwitcher($) {
	$('.mobile-view-switcher')
		.show()
		.click(function (e) {
			e.preventDefault();
			toggleDeviceView();
		});
}

(function($) {
	$(function() {
		if (getView() == 'mobile') {
			showMobileView($);
		} else {
			showDesktopView($);
		}

		if (isMobileDevice()) {
			showMobileSwitcher($);
		}
	});
})(siteBuilderJs);