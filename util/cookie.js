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
	 * @param   {String}    name(必须)    [cookie名]
	 * @param   {String}    value(必须)   [cookie值]
	 * @param   {Object}    opt(可选)     [cookie设置项对象]
	 * opt: {
	 *    path:     cookie可用路径，默认为/
	 *    domain:   cookie可用的域，默认为不设置，浏览器会默认为当前域名
	 *    hours:    cookie可存在时间(小时)，默认为SESSION
	 *    secure:   cookie是否只在https协议下传输
	 * }
	 */
	cookie.setCookie = function (name, value, opt) {
	  var HOURS = 60 * 60 * 1000,
	      newCookie = '',
	      timeSpan;
	  if (name && value) {
	    newCookie += (name + '=' + encodeURIComponent(value) + ';');
	    if (opt) {
	      (opt.hours || opt.hours == 0) ? timeSpan = Date.now() + opt.hours * HOURS
	                                    : timeSpan = Date.now() + 24 * HOURS;
	      newCookie += 'expires=' + new Date(timeSpan).toGMTString() + ';';
	      opt.domain && (newCookie += 'domain=' + opt.domain + ';');
	      newCookie += 'path=' + (opt.path || '/') + ';'
	      opt.secure && (newCookie += 'Secure;');
	    }
	    document.cookie = newCookie;
	  }
	  else {
	    console.error('[COOKIE ERROR]: setCookie missing arguments');
	  }
	}

	/**
   * 获取指定名称的cookie值
   * @param  {String}  name(必须)  [cookie名]
   * @return {String}
   */
  cookie.getCookie = function (name) {
    var cookie = document.cookie
    if (cookie.length > 0) {
      var start = cookie.indexOf(name + '=')
      if (start !== -1) {
        var end
        start = start + name.length + 1
        end = cookie.indexOf(';', start)
        return decodeURIComponent(cookie.slice(start, end === -1 ? cookie.length : end))
      }
    }
    return ''
  }

  /**
   * 删除指定cookie
   * @param  {String}  name(必须)   [cookie名]
   * @param  {Object}  opt(可选)    [同setCookie]
   */
  cookie.removeCookie = function (name, opt) {
    cookie.setCookie(name, 'clear', {
      hours: 0,
      domain: opt && opt.domain || '',
      path: opt && opt.path || ''
    });
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
