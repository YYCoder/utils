/**
 * observer.js
 * @author   Markey
 * @date     2017-02-23
 */
(function () {
    'use strict';

    var observer = {};

    // 工具函数
    /**
     * 判断是不是空对象
     */
    var isEmpty = function (obj) {
        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                return false;
            }
        }
        return true;
    };
    /**
     * 将函数参数对象或节点列表转换成数组。
     * @param {Object} obj 函数参数对象或节点列表.
     * @param {Number} [start] 数组开始元素是从零开始计算的下标。
     * @param {Number} [end] 数组结束元素是从零开始计算的下标.
     */
    var objToArray = function (obj, start, end) {
        var len = obj.length;
        start = start || 0;
        end = end || len;
        return Array.prototype.slice.call(obj, start, end);
    };


    // 每个监听对象的唯一id
    var eid = 0;
    /**
     * 监听对象构造函数
     * @param {Object} [obj](必须) [要添加监听的对象实例]
     * @param {String} [eventName](必须) [要监听的事件名称]
     * @param {Function} [handler](必须) [事件处理函数]
     */
    function EventListener(obj, eventName, handler) {
        this.instance = obj;
        this.eventName = eventName;
        this.handler = handler;
        this.id = ++eid;
        addListenerObj(obj, eventName)[this.id] = this;
    };
    /**
     * 给要添加监听的对象增加监听
     * @param {Object} [obj](必须) [要添加监听的对象实例]
     * @param {String} [eventName](必须) [要监听的事件名称]
     */
    function addListenerObj(obj, eventName) {
        var events;
        obj.__events__ || (obj.__events__ = {});
        events = obj.__events__;
        events[eventName] || (events[eventName] = {});
        return events[eventName];
    };
    /**
     * 获取监听对象
     * @param {Object} [obj](必须) [添加监听的对象实例]
     * @param {String} [eventName](非必须) [事件名称]
     * @return {Object} [获取到的监听对象,没有就返回空对象]
     */
    function getListener(obj, eventName) {
        var listeners;
        var events = obj.__events__ || {};
        if (eventName) {
            listeners = !isEmpty(events[eventName])
                      ? events[eventName]
                      : {};
        }
        else {
            // 每个事件可能有多个监听对象
            var listener;
            listeners = {};
            for (eventName in events) {
                listener = events[eventName];
                for (var listenerKey in listener) {
                    listeners[listenerKey] = listener[listenerKey];
                }
            }
        }
        return listeners;
    };
    /**
     * 转发事件
     * @param {Object} [obj](必须) [要转发的对象]
     * @param {String} [eventName](必须) [要被转发的事件]
     */
    function __forward__(obj, eventName) {
        return function () {
            var args = [obj, eventName];
            args = args.concat(objToArray(arguments));
            observer.trigger.apply(this, args);
        }
    }
    /**
     * 删除本监听对象
     */
    EventListener.prototype.remove = function () {
        var instance = this.instance;
        var events = instance.__events__ || {};
        var eventName = this.eventName
        if (instance) {
            if (events[eventName]) {
                getListener(instance, eventName)[this.id] = null;
                delete getListener(instance, eventName)[this.id];
            }
            if (isEmpty(events[eventName])) {
                events[eventName] = null;
                delete events[eventName];
            }
            if (isEmpty(events)) {
                instance.__events__ = null;
                delete instance.__events__;
            }
        }
        this.handler = this.instance = null;
    };


    /**
     * 给对象添加事件监听
     * @param {Object} [obj](必须) [要添加监听的对象实例]
     * @param {String} [eventName](必须) [要监听的事件名称]
     * @param {Function} [handler](必须) [事件处理函数]
     * @return {Object} [监听对象]
     */
    observer.addListener = function (obj, eventName, handler) {
        return new EventListener(obj, eventName, handler);
    };
    /**
     * 给对象添加只触发一次的事件监听
     * @param {Object} [obj](必须) [要添加监听的对象实例]
     * @param {String} [eventName](必须) [要监听的事件名称]
     * @param {Function} [handler](必须) [事件处理函数]
     * @return {Object} [监听对象]
     */
    observer.addListenerOnce = function (obj, eventName, handler) {
        var listener = this.addListener(obj, eventName, function () {
            listener.remove();
            handler.apply(this, arguments);
        });
        return listener;
    };
    /**
     * 检测实例对象是否存在指定事件的监听对象
     * @param {Object} [obj](必须) [要检测事件的对象]
     * @param {String} [eventName](必须) [事件名称]
     */
    observer.exist = function (obj, eventName) {
        var events = obj.__events__;
        var listeners;
        if (events && !isEmpty(events)) {
            listeners = getListener(obj, eventName);
        }
        return listeners && !isEmpty(listeners);
    };
    /**
     * 触发指定事件所有监听,eventName后的所有参数都以参数的形式传递到侦听器。
     * @param {Object} [obj](必须) [要触发事件的对象]
     * @param {String} [eventName](必须) [事件名称]
     */
    observer.trigger = function (obj, eventName) {
        var listeners;
        var args = objToArray(arguments, 2);
        if (observer.exist(obj, eventName)) {
            listeners = getListener(obj, eventName);
            for (var key in listeners) {
                listeners[key].handler.apply(listeners[key].instance, args);
            }
        }
    };
    /**
     * 去除指定监听对象
     * @param {Object} [listener](必须) [监听对象(可由addListener返回)]
     */
    observer.removeListener = function (listener) {
        if (listener instanceof EventListener) {
            listener.remove();
        }
    };
    /**
     * 去除指定事件所有监听对象
     * @param {Object} [obj](必须) [添加监听的对象]
     * @param {String} [eventName](必须) [事件名称]
     */
    observer.clearListener = function (obj, eventName) {
        var listeners = getListener(obj, eventName);
        for (var listenerKey in listeners) {
            listeners[listenerKey].remove();
        }
    };
    /**
     * 去除对象的所有监听
     * @param {Object} [obj](必须) [添加监听的对象]
     */
    observer.clearAllListener = function (obj) {
        var listeners = getListener(obj);
        for (var listenerKey in listeners) {
            listeners[listenerKey].remove();
        }
    };
    /**
     * 转发事件到另一个对象上触发相同事件(前提是另一个对象也有该事件的监听)
     * 并且执行的函数是每个触发事件对象绑定该事件时的处理函数,但参数都是由第一个触
     * 发事件对象传入的参数
     * @param {Object} [from](必须) [添加监听的对象]
     * @param {String} [eventName](必须) [事件名称]
     * @param {Object} [to](必须) [转发到哪个对象]
     * @return {Object} [监听对象]
     */
    observer.forward = function (from, eventName, to) {
        return observer.addListener(from, eventName, __forward__(to, eventName));
    }


    window.observer = observer;

})();