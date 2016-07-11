(function ($) {
	$.addImagesAnimation = function (rootElSelector) {
		var el = $(rootElSelector || 'body');
		el.find('.caption-over-image')
			.unbind()
			.mouseenter(function () {
				$(this).find('span')
					.stop(true, true)
					.slideDown();
			})
			.mouseleave(function () {
				$(this).find('span')
					.stop(true, true)
					.slideUp();
			});
	};
}(jQuery));