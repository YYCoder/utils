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


    // 字符串方法
    /**
     * 去除字符串收尾指定字符
     * @param  {[String]} str [原字符串]
     * @param  {[String]} char [要去除的字符，默认为空格]
     * @return {[String]}      [结果字符]
     */
    str['trim'] = function (str, char) {
        var res = str,
            c = char || ' ';
        if (str) {
            return res.replace(new RegExp('^\\'+c+'+|\\'+c+'+$', 'g'), '');
        }
        else {
            console.warn('请传入正确的参数');
        }
    };
    str['trimLeft'] = function (str, char) {
        var res = str,
            c = char || ' ';
        if (str) {
            return res.replace(new RegExp('^\\'+c+'+'), '');
        }
        else {
            console.warn('请传入正确的参数');
        }
    };
    str['trimRight'] = function (str, char) {
        var res = str,
            c = char || ' ';
        if (str) {
            return res.replace(new RegExp('\\'+c+'+$'), '');
        }
        else {
            console.warn('请传入正确的参数');
        }
    };


    // 数组方法
    /**
     * 查找数组中所有与指定值相等(strict equality)的元素的索引
     * @param  {Array} [arr]必选 [被查找的数组]
     * @param  {any}   [x]必选   [要查找的元素]
     * @return {Array}            [匹配元素的索引数组]
     */
    arr['findAll'] = function (arr, x) {
        var result = [], //将会返回的索引数组
            len = arr.length, //传入的数组长度
            pos = 0; //开始搜索的位置
        while (pos < len) { //循环搜索
            pos = arr.indexOf(x, pos); //搜索到,就将索引值赋值给pos
            if (pos === -1) break; //未找到,就结束搜索
            result.push(pos); //给结果数组存储索引
            pos += 1; //从下一个位置开始搜索
        }
        return result;
    };
    /**
     * 模拟ES6 find方法，若只有一个匹配结果，则直接返回，其余都返回数组
     * @param  {Array}    arr [description]
     * @param  {Function} fun [description]
     * @return {any}          [description]
     */
    arr['find'] = function (arr, fun) {
      if (Array.isArray(arr) && typeof fun === 'function') {
        var res = [];
        arr.forEach((ele, index, array) => {
          fun(ele, index, array) && res.push(ele);
        })
        return res.length === 1 ? res[0] : res
      } else {
        console.error('Error: 请传入正确的参数');
      }
    };
    /**
     * 将类数组对象(arguments || NodeList...)转换成数组。
     * @param  {Object} obj   [函数参数对象或节点列表]
     * @param  {Number} start [数组开始元素是从零开始计算的下标]
     * @param  {Number} end   [数组结束元素是从零开始计算的下标]
     * @return {Array}        [数组]
     */
    arr['objToArray'] = function (obj, start, end) {
        var len = obj.length;
        start = start || 0;
        end = end || len;
        return Array.prototype.slice.call(obj, start, end);
    };
    /**
     * 给对象数组排序(返回新数组)
     * @param  {Array}   arr  [要排序的数组]
     * @param  {String}  key  [按那个键排序, 目前只能给数值类型的键排序]
     * @param  {Boolean} desc [是否按降序排列, 默认为false]
     * @return {Array}        [排序后的数组]
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
    };
    /**
     * 数组去重
     * @param  {Array} arr [要去重的数组]
     * @return {Array}     [去重后的数组]
     */
    arr['arrUnique'] = function (arr) {
        var result = arr.filter(function (ele, index) {
            return index === arr.indexOf(ele);
        });
        return result;
    };


    // 日期方法
    /*
     * 时间格式转换
     * @param    {String||Number} [date][必选] [时间戳(数值)||日期格式字符串(如2017-10-05 13:04:55)]
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
            D = new Date(+date);
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
    };


    // 函数方法
    /**
     * 效果类似ES5的bind方法,即修改函数内部的this指向,并在需要调用的时候才调用
     * @param  {Function} [handle][必须]   [要绑定的函数]
     * @param  {any}      [context][必须]  [要修改的this]
     * @param  {any}      [any]可选        [传入绑定函数的参数]
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
    };
    /**
     * 节流函数
     * @param  {Function}   func[必须]    [要调用的函数]
     * @param  {Number}     wait[必须]    [间隔毫秒数]
     * @param  {Object}     options      [若想禁用第一次执行,传{leading: false}; 若想禁用最后一次,传{trailing: false}]
     * @return {Function}
     */
    fun['throttle'] = function (fun, delay, option) {
        var timeout,
            lastTime = 0,
            timeDelay = delay || 300,
            option = option || {},
            hasLeading = option.hasOwnProperty('leading'),
            hasTrailing = option.hasOwnProperty('trailing'),
            result;
        // 默认既执行第一次，也执行最后一次
        !hasLeading && (option.leading = true);
        !hasTrailing && (option.trailing = true);
        if (hasTrailing && hasLeading) {
            console.error('Error: 节流函数不能同时使用两个配置项');
            return;
        }
        return function () {
            var args = arguments,
                context = this;
            // 若设置了leading为false，则首次不执行
            if (lastTime === 0 && !option.leading) {
                lastTime = Date.now();
            }
            if (Date.now() - lastTime > timeDelay) {
                result = fun.apply(context, args);
                lastTime = Date.now();
            }
            else {
                timeout && clearTimeout(timeout);
                if (option.trailing) {
                    timeout = setTimeout(function() {
                        result = fun.apply(context, args);
                        // 若设置了leading为false，重置lastTime为0，从而下次的首次也不执行
                        !option.leading ? lastTime = 0 : lastTime = Date.now();
                    }, timeDelay);                        
                }
            }
            return result;
        }
    };
    /**
     * 防抖函数：只在某连续操作结束之后延迟指定时间才执行
     * @param  {Function}       fun[必须] [要防抖的函数]
     * @param  {Number||String} wait      [延迟时间，默认500ms]
     * @param  {Boolean}        immediate [第一次是否立即执行]
     * @return {Function}                 [description]
     */
    fun['denounce'] = function (fun, wait, immediate) {
        var timeout;
        var hasImmediateRun = false;
        var result; // 调用函数返回值
        return function () {
            var args = arguments;
            var context = this; // 事件处理函数中，会把this置为绑定事件的对象，我们往往需要用到
            if (!hasImmediateRun && immediate) {
                hasImmediateRun = true;
                result = fun.apply(context, args);
            }
            else {
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    hasImmediateRun = false;
                    result = fun.apply(context, args);
                }, wait || 500);                
            }
            return result;
        }
    };
    /**
     * 阻塞函数
     * @param  {Number}   milliSeconds[必须]    [要阻塞的毫秒数]
     */
    fun['sleep'] = function (milliSeconds) {
        var now = Date.now();
        if (typeof milliSeconds !== 'number') console.error('请传入数值类型的参数');
        while (Date.now() < now + milliSeconds);
    };



    // 对象方法
    /**
     * 判断是不是空对象
     * @param  {Object}   object[必须]   [要判断的对象]
     * @return {Boolean}                [是否为空对象]
     */
    obj['isEmpty'] = function (object) {
        return Object.getOwnPropertyNames(object).length === 0;
    };
    /**
     * 深度克隆
     * @param  {any}    obj[必须]   [要克隆的对象]
     * @return {Object}             [克隆完成的对象]
     */
    obj['deepClone'] = function deepClone(obj) {
        var res;
        if (typeof(obj) !== 'object' || obj === null) {
            return obj;
        }
        else if (obj instanceof Array) {
            res = [];
            for (var i = 0; i < obj.length; i++) {
                typeof(obj[i]) === 'object' ? res[i] = deepClone(obj[i])
                                            : res[i] = obj[i];
            }
        }
        else {
            res = {};
            for(var k in obj) {
                typeof(obj[k]) === 'object' ? res[k] = deepClone(obj[k])
                                            : res[k] = obj[k];
            }
        }
        return res;
    };
    /**
     * 对象拓展，类似ES6 Object.assign
     * 注：返回的对象为要拓展对象的同一个引用
     * @param  {Object}     [多个对象，第一个为要拓展的对象]
     * @return {Object}     [拓展后的对象]
     */
    obj['assign'] = function assign() {
        var length = arguments.length,
            res = arguments[0];
        if (typeof res === 'object') {
            for (var i = 1; i < length; i++) {
                for (var k in arguments[i]) {
                    res[k] = arguments[i][k];
                }
            }
            return res;
        }
        else {
            console.error('Error: 第一个参数必须是Object类型');
            return false;
        }
    };
    /**
     * 对象深度拓展，会递归拓展对象
     * 注：返回的对象为要拓展对象的同一个引用
     * @param  {Object}         [多个对象，第一个对象为被拓展的对象]
     * @return {Object}         [返回第一个参数]
     */
    obj['deepAssign'] = function deepAssign() {
        var length = arguments.length,
            res = arguments[0];
        if (typeof res === 'object') {
            for (var i = 1; i < length; i++) {
                for (var k in arguments[i]) {
                    var val = arguments[i][k];
                    if (typeof res[k] === 'object' && typeof val === 'object') {
                        deepAssign(res[k], val);
                    }
                    else {
                        res[k] = val;
                    }
                }
            }
            return res;
        }
        else {
            console.error('Error: 第一个参数必须是Object类型');
            return false;
        }
    };



    return util;

}));
