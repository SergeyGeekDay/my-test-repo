(function($) {
	$.fixHeightColumns = function() {
		function getBottom(elem) {
			return elem.offset().top + elem.height();
		}

		$.unfixHeightColumns();

		var columns = $('#content-content:visible, #column1-content:visible, #column2-content:visible'),
			maxBottom = 0;

		columns.each(function() {
			var bottom = getBottom($(this));
			if (bottom > maxBottom) {
				maxBottom = bottom;
			}
		});

		columns.each(function() {
			var column = $(this);
			if (getBottom(column) < maxBottom) {
				column.height(maxBottom - column.offset().top);
			}
		});
	};

	$.unfixHeightColumns = function() {
		$('#content-content:visible, #column1-content:visible, #column2-content:visible').each(function() {
			$(this).height('');
		});
	};

	$.startFixHeightColumns = function() {
		$.fixHeightColumns();
		return setInterval(function() {
			$.fixHeightColumns();
		}, 500);
	};

	$.fixWatermarkHeight = function() {
		$('.external-middle').height(
			$('#layout').height() - $('.external-top').height() - $('.promofooter').outerHeight()
		);
	};

	$.startFixWatermarkHeight = function() {
		$.fixWatermarkHeight();
		return setInterval(function() {
			$.fixWatermarkHeight();
		}, 500);
	};
})(jQuery || siteBuilderJs);

/**
 * Return cookie value by name
 * @param {String} name
 * @return {String|Null} value
 */
function getCookie (name) {
	var matches = document.cookie.match(name + '=(.*?)(;|$)');
	return matches ? matches[1] : null;
}

/**
 * Set cookie
 * @param {String} name
 * @param {String} value
 * @param {Number} days
 * @param {Boolean} isAllPages
 */
function setCookie (name, value, days, isAllPages) {
	var expires = new Date(),
		path = isAllPages ? '; path=/' : '';

	expires.setDate(expires.getDate() + days);
	document.cookie = name + '=' + value + path + '; expires=' + expires.toUTCString();
}