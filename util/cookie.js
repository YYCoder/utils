/**
 * 各种工具方法
 * @author          Markey
 * @date            2017-02-28
 */
(function () {
    'use strict';
    //设置/创建cookie
    function setCookie (name,value,timeSpan) {
        var v = encodeURIComponent(value);
        if(!timeSpan||typeof timeSpan !== 'number') document.cookie = name+'='+v+';';
        else document.cookie = name+'='+v+';max-age='+timeSpan;
    }

    //读取cookie,返回一个对象
    function getCookie () {
        var arr = document.cookie.split('; ');
        var cookies = {};
        if(arr.length == 0) return cookies;
        for (var i = 0,len = arr.length; i < len; i++) {
            var index = arr[i].indexOf('=');
            var n = arr[i].substring(0,index);
            var v = decodeURIComponent(arr[i].substring(index+1));
            cookies[n] = v;
        }
        return cookies;
    }

})();