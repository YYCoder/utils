/**
 * CookieAPI
 * @author     Markey
 * @date 			 2017-03-15
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ?
																		module.exports = factory() :
	typeof define === 'function' && define.amd ?
														 define(factory) : (global.cookie = factory());
}(this, function () {
	'use strict';

	var cookie = {};

	/**
	 * 设置cookie
	 * @param 	{String} 	name(必须) 		[cookie名]
	 * @param 	{String} 	value(必须) 	[cookie值]
	 * @param 	{Object} 	opt(可选) 		[cookie设置项对象]
	 * opt: {
	 * 				path:  		cookie可用路径,
	 * 				expires:  cookie可存在时间(小时),
	 * 				secure:   cookie是否只在https协议下传输.
	 * 			}
	 */
	cookie.setCookie = function (name, value, opt) {
		var HOURS = 60 * 60 * 1000,
		    newCookie = '',
		    timeSpan;
		if (name && value) {
			newCookie += (name + '=' + encodeURIComponent(value) + ';');
			(opt.expires || opt.expires == 0) ? timeSpan = Date.now() + opt.expires * HOURS
																				: timeSpan = Date.now() + 24 * HOURS;
			newCookie += 'expires=' + new Date(timeSpan).toGMTString() + ';';
			newCookie += 'domain=' + location.host + ';';
			newCookie += 'path=' + (opt.path || '/') + ';'
			opt.secure && (newCookie += 'secure=' + opt.secure + ';');

			document.cookie = newCookie;
		}
		else {
			console.warn('cookie设置参数错误');
		}
	};

	/**
	 * 获取指定名称的cookie值
	 * @param  {String}  name(必须)  [cookie名]
	 * @return {String}        			 [cookie值]
	 */
	cookie.getCookie = function (name) {
		var cookies = document.cookie,
			  index = cookies.indexOf(name),
			  reg = new RegExp(name + '=.*;?');
		return index === -1 ? '' : decodeURIComponent(reg.exec(cookies)[0].slice(name.length + 1));
	}

	/**
	 * 删除指定cookie
	 * @param  {String}  name(必须)  [cookie名]
	 */
	cookie.removeCookie = function (name) {
		var val = encodeURIComponent(cookie.getCookie(name));
		cookie.setCookie(name, val, {expires: 0});
	}

	/**
	 * 获取所有cookie
	 * @return {Array} [所有的cookie以Object形式返回]
	 */
	cookie.getAllCookies = function () {
		var cookiesArr = document.cookie.split(';'),
		    resArr = [],
		    key,
				val;
		cookiesArr.forEach(function (elem) {
			key = elem.replace(/=.+/, '');
			val = elem.replace(/.+=/, '');
			resArr.push({
				name:  key,
				value: val
			});
		});
		return resArr;
	}


	return cookie;

}));
