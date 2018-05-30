/**
 * 各种工具方法
 * @author          Markey
 * @date            2017-02-28
 */
(function(global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
      ? define(factory)
      : (global.util = factory())
})(this, function() {
  'use strict'

  // 构造函数
  function Util() {
  }
  var prototype = Util.prototype

  // 字符串方法
  /**
   * 去除字符串首尾指定字符
   * @param  {String} str  [原字符串]
   * @param  {String} char [要去除的字符，默认为空格]
   * @return {String}      [结果字符]
   */
  prototype['trim'] = function(str, char) {
    var res = str,
      c = char || ' ',
      regExp = new RegExp('^(' + c + ')+|(' + c + ')+$', 'g')
    if (str) {
      return res.replace(regExp, '')
    } else {
      throw new Error('[util Error]: trim function invalid arguments')
    }
  }
  prototype['trimLeft'] = function(str, char) {
    var res = str,
      c = char || ' '
    if (str) {
      return res.replace(new RegExp('^(' + c + ')+'), '')
    } else {
      throw new Error('[util Error]: trimLeft function invalid arguments')
    }
  }
  prototype['trimRight'] = function(str, char) {
    var res = str,
      c = char || ' '
    if (str) {
      return res.replace(new RegExp('(' + c + ')+$'), '')
    } else {
      throw new Error('[util Error]: trimRight function invalid arguments')
    }
  }
  /**
   * 生成唯一id
   * @return {String}
   */
  prototype['uuid'] = function() {
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'

    var uuid = s.join('')
    return uuid
  }

  // 数组方法
  /**
   * 查找数组中所有与指定值相等(strict equality)的元素的索引
   * @param  {Array} [arr]必选 [被查找的数组]
   * @param  {any}   [x]必选   [要查找的元素]
   * @return {Array}            [匹配元素的索引数组]
   */
  prototype['findIndex'] = function(arr, x) {
    var result = [], //将会返回的索引数组
      len = arr.length, //传入的数组长度
      pos = 0 //开始搜索的位置
    while (pos < len) {
      //循环搜索
      pos = arr.indexOf(x, pos) //搜索到,就将索引值赋值给pos
      if (pos === -1) break //未找到,就结束搜索
      result.push(pos) //给结果数组存储索引
      pos += 1 //从下一个位置开始搜索
    }
    return result
  }
  /**
   * 模拟ES6 find方法，若只有一个匹配结果，则直接返回，其余都返回数组
   * @param  {Array}    arr [description]
   * @param  {Function} fun [description]
   * @return {any}          [description]
   */
  prototype['find'] = function(arr, fun) {
    if (Array.isArray(arr) && typeof fun === 'function') {
      var res = []
      arr.forEach(function(ele, index, array) {
        fun(ele, index, array) && res.push(ele)
      })
      return res
    } else {
      throw new Error('[util Error]: find function missing arguments')
    }
  }
  /**
   * 将类数组对象(arguments || NodeList...)转换成数组。
   * @param  {Object} obj   [函数参数对象或节点列表]
   * @param  {Number} start [数组开始元素是从零开始计算的下标]
   * @param  {Number} end   [数组结束元素是从零开始计算的下标]
   * @return {Array}        [数组]
   */
  prototype['objToArray'] = function(obj, start, end) {
    var len = obj.length
    start = start || 0
    end = end || len
    return Array.prototype.slice.call(obj, start, end)
  }
  /**
   * 给对象数组排序(返回新数组)
   * @param  {Array}   arr  [要排序的数组]
   * @param  {String}  key  [按那个键排序, 目前只能给数值类型的键排序]
   * @param  {Boolean} desc [是否按降序排列, 默认为false]
   * @return {Array}        [排序后的数组]
   */
  prototype['sortObjs'] = function(arr, key, desc) {
    var res = [].concat(arr),
      isDesc = desc || false
    if (Array.isArray(arr) && key) {
      return res.sort(function(ele1, ele2) {
        return isDesc ? ele2[key] - ele1[key] : ele1[key] - ele2[key]
      })
    } else {
      throw new Error('[util Error]: sortObjs function invalid arguments')
    }
  }
  /**
   * 数组去重：只能去重原始类型
   * @param  {Array} arr[必须] [要去重的数组]
   * @return {Array}          [去重后的数组]
   */
  prototype['arrUnique'] = function(arr) {
    // 第一个NaN元素索引
    var NaNIndex = -1
    // 过滤普通原始类型（除NaN以外）
    var result = arr.filter(function(ele, index) {
      var isNaN = ele !== ele
      // 若当前元素是NaN，并且未记录索引，则记录索引（因为只需要保留第一个NaN）
      if (isNaN && NaNIndex === -1) {
        NaNIndex = index
      }
      return (isNaN && NaNIndex === index) || index === arr.indexOf(ele)
    })
    return result
  }
  /**
   * 数组扁平化
   * @param  {Array}   arr[必须]      [要处理的数组]
   * @param  {Boolean} isShallow     [是否只扁平化一层]
   * @return {Array}                 [扁平化后的结果，新数组]
   */
  prototype['flatten'] = function flatten(arr, isShallow) {
    var res = [],
      isShallow = isShallow || false
    if (Array.isArray(arr)) {
      arr.forEach(function (ele) {
        res = res.concat(isShallow ? ele : flatten(ele, false))
      })
    }
    else {
      res.push(arr)
    }
    return res
  }
  /**
   * 数组取并集：多维数组会递归扁平化后合并
   * @param  {Object} opt[可选] [配置对象]
   *                  isUnique  {Boolean} [是否去重，默认为true]
   *                  isFlatten {Boolean} [是否递归扁平化，默认为true]
   * @param  {Array}  [多个数组，若传入其他类型，则也会被合并]
   * @return {Array}  [合并后的数组]
   */
  prototype['union'] = function(opt) {
    var isUnique = true,
      isFlatten = true,
      argsArr = prototype['objToArray'](arguments)
    var resArr
    // 判断参数
    if (prototype['isObject'](opt)) {
      prototype['isBoolean'](opt.unique) && (isUnique = opt.unique)
      prototype['isBoolean'](opt.flatten) && (isFlatten = opt.flatten)
      argsArr = argsArr.slice(1)
    }
    resArr = prototype['flatten'](argsArr, !isFlatten)
    if (isUnique) {
      resArr = prototype['arrUnique'](resArr)
    }
    return resArr
  }
  /**
   * 数组取反集，只取第一个数组中存在并且在之后所有数组中不存在的值
   * @param  {Array}  [多个数组，第一个数组为参照数组]
   * @return {Array}  [新数组]
   */
  prototype['diff'] = function() {
    var otherArr = prototype['arrUnique'](
        prototype['flatten']([].slice.call(arguments).slice(1))
      ),
      diffArr = arguments[0]

    return diffArr.filter(function(ele) {
      return otherArr.indexOf(ele) === -1
    })
  }
  /**
   * 数组比对，递归比对所有值
   * @param  {Array}    a1 [第一个数组]
   * @param  {Array}    a2 [第二个数组]
   * @return {Boolean}     [比对结果]
   */
  prototype['equalArr'] = function equalArr(a1, a2) {
    var len1 = a1.length,
      len2 = a2.length
    if (arguments.length > 2) {
      throw new Error('[util Error]: equalArr only can pass two arguments')
      return
    }
    if (len1 !== len2) return false

    for (var i = 0; i < a1.length; i++) {
      if (a1[i] === a2[i]) {
        continue
      } else {
        if (Array.isArray(a1[i]) && Array.isArray(a2[i])) {
          var res = equalArr(a1[i], a2[i])
          if (res) continue
          else return false
        } else if (a1[i] !== a1[i])
          // 排除NaN的情况
          continue
        else return false
      }
    }
    return true
  }

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
  prototype['dateFormat'] = function(date, format) {
    var reg = /\%Y|\%y|\%m|\%d|\%w|\%H|\%M|\%S|\%T/g
    var D
    var value
    var alter = ''
    var circle
    function zeroFill(str) {
      str += ''
      str.length === 1 && (str = '0' + str)
      return str
    }
    if (date) {
      D = new Date(+date)
      value = format = format || '%Y-%m-%d %H:%M:%S'
      if (D.toString() !== 'Invalid Date') {
        circle = reg.exec(format)
        while (circle) {
          switch (circle[0]) {
            case '%Y':
              alter = D.getFullYear()
              break
            case '%m':
              alter = zeroFill(D.getMonth() + 1)
              break
            case '%d':
              alter = D.getDate()
              break
            case '%w':
              alter = D.getDay()
              break
            case '%H':
              alter = zeroFill(D.getHours())
              break
            case '%M':
              alter = zeroFill(D.getMinutes())
              break
            case '%S':
              alter = zeroFill(D.getSeconds())
              break
            case '%T':
              alter =
                zeroFill(D.getHours()) +
                ':' +
                zeroFill(D.getMinutes()) +
                ':' +
                zeroFill(D.getSeconds())
              break
          }
          value = value.replace(circle[0], alter)
          circle = reg.exec(value)
        }
        return value
      } else {
        return 'Invalid Date'
      }
    } else {
      return false
    }
  }

  // 函数方法
  /**
   * 效果类似ES5的bind方法,即修改函数内部的this指向,并在需要调用的时候才调用
   * @param  {Function} [handle][必须]   [要绑定的函数]
   * @param  {any}      [context][必须]  [要修改的this]
   * @param  {any}      [any]可选        [传入绑定函数的参数]
   * @return {Function}                 [修改this后的函数]
   */
  prototype['bind'] = function(fun, context) {
    var argsOut
    var argsIn
    if (arguments.length > 2) {
      argsOut = prototype['objToArray'](arguments, 2)
      return function() {
        argsIn = arguments.length > 0 ? prototype['objToArray'](arguments) : []
        return fun.apply(context || this, argsOut.concat(argsIn))
      }
    } else {
      return function() {
        return fun.apply(context || this, arguments)
      }
    }
  }
  /**
   * 节流函数
   * @param  {Function}   func[必须]    [要调用的函数]
   * @param  {Number}     wait[必须]    [间隔毫秒数]
   * @param  {Object}     options      [若想禁用第一次执行,传{leading: false}; 若想禁用最后一次,传{trailing: false}]
   * @return {Function}
   */
  prototype['throttle'] = function(fun, delay, option) {
    var timeout,
      lastTime = 0,
      timeDelay = delay || 300,
      option = option || {},
      hasLeading = option.hasOwnProperty('leading'),
      hasTrailing = option.hasOwnProperty('trailing'),
      result
    // 默认既执行第一次，也执行最后一次
    !hasLeading && (option.leading = true)
    !hasTrailing && (option.trailing = true)
    if (hasTrailing && hasLeading) {
      throw new Error('[util Error]: throttle can not pass two options in same time')
      return
    }
    return function() {
      var args = arguments,
        context = this
      // 若设置了leading为false，则首次不执行
      if (lastTime === 0 && !option.leading) {
        lastTime = Date.now()
      }
      if (Date.now() - lastTime > timeDelay) {
        result = fun.apply(context, args)
        lastTime = Date.now()
      } else {
        timeout && clearTimeout(timeout)
        if (option.trailing) {
          timeout = setTimeout(function() {
            result = fun.apply(context, args)
            // 若设置了leading为false，重置lastTime为0，从而下次的首次也不执行
            !option.leading ? (lastTime = 0) : (lastTime = Date.now())
          }, timeDelay)
        }
      }
      return result
    }
  }
  /**
   * 防抖函数：只在某连续操作结束之后延迟指定时间才执行
   * @param  {Function}       fun[必须] [要防抖的函数]
   * @param  {Number||String} wait      [延迟时间，默认500ms]
   * @param  {Boolean}        immediate [第一次是否立即执行]
   * @return {Function}                 [description]
   */
  prototype['denounce'] = function(fun, wait, immediate) {
    var timeout
    var hasImmediateRun = false
    var result // 调用函数返回值
    return function() {
      var args = arguments
      var context = this // 事件处理函数中，会把this置为绑定事件的对象，我们往往需要用到
      if (!hasImmediateRun && immediate) {
        hasImmediateRun = true
        result = fun.apply(context, args)
      } else {
        clearTimeout(timeout)
        timeout = setTimeout(function() {
          hasImmediateRun = false
          result = fun.apply(context, args)
        }, wait || 500)
      }
      return result
    }
  }
  /**
   * 阻塞函数
   * @param  {Number}   milliSeconds[必须]    [要阻塞的毫秒数]
   */
  prototype['sleep'] = function(milliSeconds) {
    var now = Date.now()
    if (typeof milliSeconds !== 'number')
      throw new Error('[util Error]: sleep function please pass Number')
    while (Date.now() < now + milliSeconds);
  }
  /**
   * 函数栈组合（参考自koa-compose源码）
   * @param  {Array}     arr [函数数组]
   * @return {Function}      [匿名函数，调用即开启调用组合函数，传入的参数会在每个函数中传入]
   *
   * 核心思想：
   * 1. 利用闭包保存函数数组
   * 2. 返回匿名函数开启调用
   * 3. 递归调用dispatch，依次调用数组中的函数
   * 4. dispatch实参（即next函数），是函数组合的关键，在数组中的函数调用后即进入下一个函数
   */
  prototype['composeStack'] = function(arr) {
    if (!Array.isArray(arr))
      throw new Error('[util Error]: composeStack function\'s Function stack must be array')
    arr.forEach(function(fun) {
      if (typeof fun !== 'function')
        throw new Error('[util Error]: composeStack function\'s Function stack must be composed of functions')
    })
    return function(arg) {
      var index = -1
      // 开启调用
      dispatch(0)
      function dispatch(i) {
        index = i
        var fun = arr[index]
        if (!fun) return
        return fun(arg, function next() {
          // 递归调用dispatch，从而调用数组中下一个函数
          dispatch(++i)
        })
      }
    }
  }
  /**
   * 函数组合：传入多个函数作为参数，并将每次调用返回的结果传入下一个函数（函数式编程常用工具函数）
   * @param  {Function} [要按顺序执行的函数]
   * @return {Function} [组合函数，调用即开始按顺序调用传入的所有函数]
   */
  prototype['compose'] = function() {
    var index = 0,
      funs = arguments
    return function(arg) {
      var res = funs[index++].call(this, arg)
      while (index < funs.length) res = funs[index++].call(this, res)
      return res
    }
  }
  /**
   * 柯里化函数：将多参函数转为单参或少参多调用的函数（函数式编程必备工具函数）
   * @param  {Function}   fn   [参数个数满足要求后执行的函数]
   * @param  {Any}        args [初始化参数]
   * @return {Function}        [柯里化函数]
   *
   * 核心思想：
   * 1. 通过闭包保存函数参数，函数参数个数不满足要求则递归，满足则调用传入的函数
   */
  prototype['curry'] = function curry(fn, args) {
    var length = fn.length
    args = args || []
    if (!Array.isArray(args)) args = [args]
    return function() {
      var _args = args.slice(0),
        arg,
        i

      for (i = 0; i < arguments.length; i++) {
        arg = arguments[i]
        _args.push(arg)
      }
      if (_args.length < length) {
        return curry.call(this, fn, _args)
      } else {
        return fn.apply(this, _args)
      }
    }
  }
  /**
   * 偏函数（partial application）：将一个多参函数分两次调用
   * @param  {Function}   fn [要调用的函数]
   * @return {Function}      [偏函数]
   */
  prototype['partial'] = function(fn) {
    var length = fn.length || 0,
      args = [].slice.call(arguments, 1)
    return function() {
      var _args = args.concat([].slice.call(arguments, 0))
      if (_args.length === length) {
        return fn.apply(this, _args)
      } else {
        throw new Error('[util Error]: partial function missing arguments')
      }
    }
  }
  /**
   * 惰性函数见demo
   *
   * 核心思想：
   * 1. 利用闭包保存第一次的执行结果
   * 2. 修改本函数的引用，只取结果，不再重复执行
   */
  function lazyFun() {
    // body...
  }

  // 对象方法
  /**
   * 判断是不是空对象
   * @param  {Object}   object[必须]   [要判断的对象]
   * @return {Boolean}                [是否为空对象]
   */
  prototype['isEmpty'] = function(object) {
    return Object.getOwnPropertyNames(object).length === 0
  }
  /**
   * 深度克隆
   * @param  {any}    obj[必须]   [要克隆的对象]
   * @return {Object}             [克隆完成的对象]
   */
  prototype['deepClone'] = function deepClone(obj) {
    var res
    if (typeof obj !== 'object' || obj === null) {
      return obj
    } else if (obj instanceof Array) {
      res = []
      for (var i = 0; i < obj.length; i++) {
        typeof obj[i] === 'object'
          ? (res[i] = deepClone(obj[i]))
          : (res[i] = obj[i])
      }
    } else {
      res = {}
      for (var k in obj) {
        typeof obj[k] === 'object'
          ? (res[k] = deepClone(obj[k]))
          : (res[k] = obj[k])
      }
    }
    return res
  }
  /**
   * 对象拓展，类似ES6 Object.assign
   * 注：返回的对象为要拓展对象的同一个引用
   * @param  {Object}     [多个对象，第一个为要拓展的对象]
   * @return {Object}     [拓展后的对象]
   */
  prototype['assign'] = function assign() {
    var length = arguments.length,
      res = arguments[0]
    if (typeof res === 'object') {
      for (var i = 1; i < length; i++) {
        for (var k in arguments[i]) {
          // 若当前属性就等于要拓展的对象，则退出，防止循环引用
          if (arguments[i][k] === res) continue
          res[k] = arguments[i][k]
        }
      }
      return res
    } else {
      throw new Error('[util Error]: assign function\'s first argument must be an Object')
      return false
    }
  }
  /**
   * 对象深度拓展，会递归拓展对象，数组则直接覆盖
   * 注：返回的对象为要拓展对象的同一个引用
   * @param  {Object}         [多个对象，第一个对象为被拓展的对象]
   * @return {Object}         [返回第一个参数]
   */
  prototype['deepAssign'] = function deepAssign() {
    var length = arguments.length,
      res = arguments[0]
    if (typeof res === 'object') {
      for (var i = 1; i < length; i++) {
        for (var k in arguments[i]) {
          var val = arguments[i][k]
          // 若当前属性就等于要拓展的对象，则退出，防止循环引用
          if (val === res) continue
          if (typeof res[k] === 'object' && typeof val === 'object') {
            deepAssign(res[k], val)
          } else {
            res[k] = val
          }
        }
      }
      return res
    } else {
      throw new Error('[util Error]: deepAssign function\'s first argument must be an Object')
      return false
    }
  }
  /**
   * 对象深度对比
   * @param  {Object}     o1  [对象1]
   * @param  {Object}     o2  [对象2]
   * @return {Boolean}        [对比结果]
   */
  prototype['equalObj'] = function equalObj(o1, o2, o1Stack, o2Stack) {
    o1Stack = o1Stack || []
    o2Stack = o2Stack || []
    // 利用额外两个参数保存当前比对时o1、o2的参数值，如果它们都是引用自身的话则退出当前比对
    var length = o1Stack.length
    while (length--) {
      // 如果两个对象引用的都是自身的话，我们就认为它们是相等的，应该只比较非引用自身的其他属性
      if (o1Stack[length] === o1) {
        return o2Stack[length] === o2
      }
    }
    o1Stack.push(o1)
    o2Stack.push(o2)
    var k1 = Object.getOwnPropertyNames(o1),
      k2 = Object.getOwnPropertyNames(o2),
      len1 = k1.length,
      len2 = k2.length
    if (len1 !== len2) return false

    for (var i = 0; i < k1.length; i++) {
      var val1 = o1[k1[i]],
        val2 = o2[k2[i]]
      // 若属性名不相等，则直接退出
      if (k1[i] !== k2[i]) return false
      if (val1 === val2) continue
      else {
        if (
          (prototype['isObject'](val1) && prototype['isObject'](val2)) ||
          (Array.isArray(val1) && Array.isArray(val2))
        ) {
          var res = equalObj(val1, val2, o1Stack, o2Stack)
          if (res) continue
          else return false
        } else if (val1 !== val1)
          // 若是NaN，则认为是相等的
          continue
        else return false
      }
    }
    o1Stack.pop()
    o2Stack.pop()
    return true
  }
  /**
   * 判断是否为Object类型
   * @param  {any}       arg     [任意类型参数]
   * @return {Boolean}           [鉴定结果]
   */
  prototype['isObject'] = function(arg) {
    return Object.prototype.toString.call(arg).indexOf('Object]') !== -1
  }
  /**
   * 安全获取对象深层属性
   * @param  {Array}   props   [要获取的属性列表]
   * @param  {Object}  obj     [获取属性的对象]
   * @return {Any}             [获取到的属性值，或null]
   */
  prototype['get'] = function(props, obj) {
    if (Array.isArray(props) && prototype['isObject'](obj)) {
      return props.reduce(function (pre, next) {
        return (pre && pre[next]) ? pre[next] : null
      }, obj)
    }
    else {
      throw new Error('[util Error]: get function invalid arguments')
    }
  }

  // 其他
  /**
   * 向url中添加参数
   * @param  {String} href     [url字符串]
   * @param  {String} queryStr [查询参数字符串，如channelFrom=test]
   * @return {String}          [添加参数后的url字符串]
   */
  prototype['addQuery'] = function(href, queryStr) {
    var queryArr = href.split('?')
    var res = ''
    // 若url中已有参数
    if (queryArr[1]) {
      queryArr[1] = '?' + queryStr + '&' + queryArr[1]
      res = queryArr.join('')
    }
    // 若url中没有参数
    else {
      var hashArr = queryArr[0].split('#')
      // 若url中有hash
      if (hashArr[1]) {
        res = hashArr[0] + '?' + queryStr + '#' + hashArr[1]
      }
      // 若url中无hash
      else {
        res = hashArr[0] + '?' + queryStr
      }
    }
    return res
  }
  prototype['isBoolean'] = function(arg) {
    return typeof arg === 'boolean'
  }

  return new Util
})
