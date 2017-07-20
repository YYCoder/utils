/**
 * 各种工具方法
 * @author          Markey
 * @date            2017-02-28
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ?
                                      module.exports = factory() :
    typeof define === 'function' && define.amd ?
                               define(factory) : (global.util = factory());
}(this, function () {
    'use strict';

    var arr = {};
    var date = {};
    var fun = {};
    var str = {};
    var obj = {};

    var util = {
        'array': arr,
        'date': date,
        'function': fun,
        'string': str,
        'object': obj
    };


    // 数组方法
    /**
     * 查找数组中所有与指定值相等(strict equality)的元素的索引
     * @param {Array} [a](必选) [被查找的数组]
     * @param {any} [x](必选) [要查找的元素]
     * @return {Array} [匹配元素的索引数组]
     */
    arr['findAll'] = function (a, x) {
        var result = [], //将会返回的索引数组
            len = a.length, //传入的数组长度
            pos = 0; //开始搜索的位置
        while (pos < len) { //循环搜索
            pos = a.indexOf(x, pos); //搜索到,就将索引值赋值给pos
            if (pos === -1) break; //未找到,就结束搜索
            result.push(pos); //给结果数组存储索引
            pos += 1; //从下一个位置开始搜索
        }
        return result;
    }
    /**
     * 将类数组对象(arguments || NodeList...)转换成数组。
     * @param {Object} obj 函数参数对象或节点列表.
     * @param {Number} [start] 数组开始元素是从零开始计算的下标。
     * @param {Number} [end] 数组结束元素是从零开始计算的下标.
     * @return {Array} [数组]
     */
    arr['objToArray'] = function (obj, start, end) {
        var len = obj.length;
        start = start || 0;
        end = end || len;
        return Array.prototype.slice.call(obj, start, end);
    };

    /**
     * 给对象数组排序(返回新数组)
     * @param  {Array} arr [要排序的数组]
     * @param  {String} key [按那个键排序, 目前只能给数值类型的键排序]
     * @param  {Boolean} desc [是否按降序排列, 默认为false]
     * @return {Array}     [排序后的数组]
     */
    arr['sortObjs'] = function (arr, key, desc) {
        var isDesc = desc || false;
        if (Array.isArray(arr) && key) {
            return arr.sort(function (ele1, ele2) {
                return isDesc ? ele2[key] - ele1[key] : ele1[key] - ele2[key];
            });          
        }
        else {
            console.error('Error: illegal arguments');
        }
    }


    // 日期方法
    /*
     * 时间格式转换
     * @param    {String||Number} [date](必选) [时间戳(数值)||日期格式字符串(如2017-10-05 13:04:55)]
     * @param    {String} [format](可选)  [想要输出的时间格式(如 %Y-%m-%d)]
     * 注: format可识别参数: %Y - 包括世纪数的十进制年份;
     *                     %m - 十进制月份（范围从 01 到 12）;
     *                     %d - 月份中的第几天，十进制数字（范围从 01 到 31）;
     *                     %w - 星期中的第几天，星期天为 0;
     *                     %H - 24 小时制的十进制小时数（范围从 00 到 23）;
     *                     %M - 十进制分钟数;
     *                     %S - 十进制秒数;
     *                     %T - 当前时间，和 %H:%M:%S 一样;
     * @return {String} [日期字符串]
     */
    date['dateFormat'] = function (date, format) {
        var reg = /\%Y|\%y|\%m|\%d|\%w|\%H|\%M|\%S|\%T/g;
        var D;
        var value;
        var alter = '';
        var circle;
        function zeroFill(str) {
            str += '';
            (str.length === 1) && (str = '0' + str);
            return str
        }
        if (date) {
            D = new Date(date);
            value = format = format || "%Y-%m-%d %H:%M:%S";
            if (D.toString() !== "Invalid Date") {
                circle = reg.exec(format);
                while (circle) {
                    switch (circle[0]) {
                        case "\%Y":
                            alter = D.getFullYear();
                            break;
                        case "\%m":
                            alter = zeroFill(D.getMonth() + 1);
                            break;
                        case "\%d":
                            alter = D.getDate();
                            break;
                        case "\%w":
                            alter = D.getDay();
                            break;
                        case "\%H":
                            alter = zeroFill(D.getHours());
                            break;
                        case "\%M":
                            alter = zeroFill(D.getMinutes());
                            break;
                        case "\%S":
                            alter = zeroFill(D.getSeconds());
                            break;
                        case "\%T":
                            alter = zeroFill(D.getHours())
                                  + ":"
                                  + zeroFill(D.getMinutes())
                                  + ":"
                                  + zeroFill(D.getSeconds());
                            break;
                    }
                    value = value.replace(circle[0], alter);
                    circle = reg.exec(value);
                }
                return value;
            }
            else {
                return "Invalid Date";
            }
        }
        else {
            return false;
        }
    }


    // 函数方法
    /**
     * 效果类似ES5的bind方法,即修改函数内部的this指向,并在需要调用的时候才调用
     * @param  {Function} [handle](必须)  [要绑定的函数]
     * @param  {any}      [context](必须) [要修改的this]
     * @param  {any}      [any](可选)     [传入绑定函数的参数]
     * @return {Function}                 [修改this后的函数]
     */
    fun['bind'] = function (fun, context) {
        var argsOut;
        var argsIn;
        if (arguments.length > 2) {
            argsOut = util['array']['objToArray'](arguments, 2);
            return function () {
                argsIn = arguments.length > 0
                       ? util['array']['objToArray'](arguments)
                       : [];
                return fun.apply(context || this, argsOut.concat(argsIn));
            }
        }
        else {
            return function () {
                return fun.apply(context || this, arguments);
            }
        }
    }
    /**
     * 节流函数
     * @param  {Function}   func(必须)    [要调用的函数]
     * @param  {Number}     wait(必须)    [间隔毫秒数]
     * @param  {Object}     options(可选)
     * [若想禁用第一次执行,传{leading: false}; 若想禁用最后一次,传{trailing: false}]
     * @return {Function}
     */
    fun['throttle'] = function (fun, wait, option) {
        var args,
            result,
            timeout,
            now;
        var previous = 0;
        var option = option || {};
        var later = function () {
            previous = option.leading === false ? 0 : now;
            result = fun.apply(this, args);
            // console.log('timeout');
        }
        return function () {
            now = Date.now();
            args = arguments;
            if (previous === 0 && option.leading === false) {
                previous = now;
            }
            var remain = wait - (now - previous);
            if (remain <= 0) {
                previous = now;
                clearTimeout(timeout);
                timeout = null;
                result = fun.apply(this, args);
                // console.log('now');
            }
            else if (!timeout && option.trailing !== false) {
                timeout = setTimeout(later, wait);
            }
            return result;
        }
    };
    /**
     * 阻塞函数
     * @param  {Number}   milliSeconds(必须)    [要阻塞的毫秒数]
     */
    fun['sleep'] = function (milliSeconds) {
        var now = Date.now();
        if (typeof milliSeconds !== 'number') console.error('请传入数值类型的参数');
        while (Date.now() < now + milliSeconds);
    }



    // 对象方法
    /**
     * 判断是不是空对象
     * @param {Object} [object] [要判断的对象]
     * @return {Boolean} [是否为空对象]
     */
    obj['isEmpty'] = function (object) {
        for (var p in object) {
            if (object.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    };

    /**
     * 深度克隆
     * @param  {任意类型}  [o]   [要克隆的对象]
     * @return {Object}    [克隆完成的对象]
     */
    obj['deepClone'] = function deepClone(o) {
        var res;
        if (typeof(o) !== 'object') {
            return o;
        }
        else if (o instanceof Array) {
            res = [];
            for (var i = 0; i < o.length; i++) {
                typeof(o[i]) === 'object' ? res[i] = deepClone(o[i])
                                          : res[i] = o[i];
            }
        }
        else {
            res = {};
            for(var k in o) {
                typeof(o[k]) === 'object' ? res[k] = deepClone(o[k])
                                          : res[k] = o[k];
            }
        }
        return res;
    }



    return util;

}));
