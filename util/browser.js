/**
 * browser相关API
 * @author     Markey
 * @date 			 2017-03-27
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ?
																		module.exports = factory() :
	typeof define === 'function' && define.amd ?
														 define(factory) : (global.browser = factory());
}(this, function () {
	'use strict';

	var browser = {};

	/**
	 * 返回IE的版本(6,7,8,9)
	 * @return 	{Number} 	[IE版本||false]
	 */
	function witchIE() {
		var browser = navigator.appName,
		    b_version = navigator.appVersion,
		    version = b_version.split(";"),
		    trim_Version = version[1].replace(/[ ]/g,"");
		var res;
		if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE6.0") {
			res = 6;
		}
		else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0") {
			res = 7;
		}
		else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
			res = 8;
		}
		else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
			res = 9;
		}
		else if (browser != "Microsoft Internet Explorer") {
			console.warn('your browser is not IE !');
			res = false;
		}

		return res;
	}


	browser['witchIE'] = witchIE;
	browser['isIE6'] = witchIE() === 6;
	browser['isIE7'] = witchIE() === 7;
	browser['isIE8'] = witchIE() === 8;
	browser['isIE9'] = witchIE() === 9;

	return browser;

}));
