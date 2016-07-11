(function () {
	try {
		if (document.location.search == '' || !(m = document.location.search.match(/fresh=\d+/))) {
			return;
		}
		var fresh = m[0],
			links	= document.links,
			iMax	= links.length;
		for (var i=0; i < iMax; i++) {
			var link		= links[i],
				href		= link.href,
				isInternal	= (href.substring(0, 21) == 'http://hackaton-p.ru/' ||  href.substring(0, 4) != 'http');
			if (isInternal) {
				var	query = (link.search == '') ? '?' + fresh : link.search + '&' + fresh,
					path = link.href.split('#')[0].split('?')[0];
				link.href = path + query + link.hash;
			}
		}
	} catch(e) {}
})();