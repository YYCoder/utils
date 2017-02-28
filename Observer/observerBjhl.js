(function () {
    'use strict';
    // var util = require('../util');

    // yuanye: 判断是否为ie,暂时不考虑
    // var ie;
    var observer = {};
    /**
     * 判断是不是空对象
     * @author xuzheng
     * @date   2015.4.21
     */
    var is_empty = function (object) {
        for (var p in object) {
            if (object.hasOwnProperty(p)) {
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
     * @author xuzheng
     * @date 2015.4.21
     */
    var objToArray = function (obj, start, end) {
        var len = obj.length;
        start = start || 0;
        end = end || len;
        return Array.prototype.slice.call(obj, start, end);
    };

    var getUid = (function () {
        var uid = 0;
        var magic = '__GSX__';

        return function (obj, isReset) {
            return (!isReset && obj[magic]) || (obj[magic] = ++uid);
        };
    })();

    var _listeners = {};
    var _eventObjects = {};
    var _eventObjectIdIndex = 0;


    /**
     * 将指定侦听器函数添加到指定对象实例的指定事件名称。
     *
     * <pre>
     * <strong>传回该侦听器的标识符，该标识符能够与 observer.removeListener() 配合使用。</strong>
     * </pre>
     *
     * @param {Object} instance 对象事例
     * @param {string} eventName 事件名称
     * @param {Function} handler 绑定的函数
     * @return {EventListener} listener 传回该侦听器的标识符
     */
    observer.addListener = function (instance, eventName, handler) {
        return new EventListener(instance, eventName, handler);
    };

    /**
     * 删除应由上述 observer.addListener 传回的指定侦听器。
     *
     * @param {EventListener} listener 事件侦听器
     */
    observer.removeListener = function (listener) {
        if (listener instanceof EventListener) {
            listener.remove();
        } else {
            observer.removeDomListener(listener);
        }
    };

    /**
     * 判断此事件是否注册存在。
     *
     * @param {Object} instance 对象事例
     * @param {string} eventName 事件名称
     * @return  是否注册
     * @type boolean
     */
    observer.exist = function (instance, eventName) {
        var listeners = _get_listeners(instance, eventName);
        return listeners && !is_empty(listeners);
    };

    /**
     * 对于指定实例，删除其指定事件的所有侦听器。
     *
     * @param {Object} instance 事件侦听器
     * @param {string} eventName 事件名称
     */
    observer.clearListeners = function (instance, eventName) {
        var listeners = _get_listeners(instance, eventName);
        for (var key in listeners) {
            if (listeners[key]) {
                listeners[key].remove();
            }
        }
    };

    /**
     * 对于指定实例，删除其所有事件的所有侦听器。
     *
     * @function
     * @param {Object} instance 事件侦听器
     */
    observer.clearInstanceListeners = function (instance) {
        var listeners = _get_listeners(instance);
        for (var key in listeners) {
            if (listeners[key]) {
                listeners[key].remove();
            }
        }
    };

    /**
     * 触发指定事件。eventName 后的所有参数都以参数的形式传递到侦听器。
     *
     * @param {Object} instance 事件侦听器
     * @param {string} eventName 事件名称
     */
    observer.trigger = function (instance, eventName) {
        if (observer.exist(instance, eventName)) {
            var args = objToArray(arguments, 2);
            var listeners = _get_listeners(instance, eventName);
            for (var key in listeners) {
                if (listeners[key]) {
                    listeners[key].handler.apply(listeners[key].instance, args);
                }
            }
        }
    };

    /**
     * 类似于 observer.addListener，但处理程序会在处理完第一个事件后将自已删除。
     *
     * @param {Object} instance 事件侦听器
     * @param {string} eventName 事件名称
     * @param {Function} handler 执行函数
     * @return {EventListener} listener  一个事件侦听器
     */
    observer.addListenerOnce = function (instance, eventName, handler) {
        var eventListener = observer.addListener(instance, eventName, function () {
            eventListener.remove();
            return handler.apply(this, arguments)
        });
        return eventListener;
    };

    /**
     * 将object对象上的事件转发到instance对象上触发。
     *
     * @param {Object} instance 事件侦听器
     * @param {string} eventName 事件名称
     * @param {Object} object 执行函数
     * @return  一个事件侦听器
     * @type EventListener
     */
    observer.forward = function (instance, eventName, object) {
        return observer.addListener(instance, eventName, _forward_event(eventName, object))
    };

    /**
     * 删除所有注册的事件处理程序以防止内存泄漏。应作为 unload 事件的处理程序进行调用。
     *
     * @private
     */
    observer.unload = function () {
        var listeners = _listeners;

        for (var key in listeners) {
            if (listeners[key]) {
                listeners.remove();
            }
        }
        _listeners = {};
        (listeners = window.CollectGarbage) && listeners();
    };

    observer.addDomListener = function (element, eventName, handle, useOriginalEvent) {
        var token = {
            'element': element,
            'handle': handle,
            'type': eventName
        };
        var eventID = token.eid = getUid(token);
        $(element).on(eventName + '.' + eventID, function (evt) {
            handle.call(this, useOriginalEvent ? (evt.originalEvent || evt) : evt);
        });
        return token;
    };

    observer.removeDomListener = function (token) {
        $(token.element).off(token.type + '.' + token.eid);
    };

    observer.addDomListenerOnce = function (element, eventName, handler, useOriginalEvent) {
        var token = observer.addDomListener(element, eventName, function () {
            observer.removeDomListener(token);
            return handler.apply(this, arguments);
        }, useOriginalEvent);
        return token;
    };

    /**
     * 此类是不透明的。它没有方法和构造函数。
     *
     * 此类的实例从 addListener()、addDomListener() 返回，并最终传递回 removeListener()。
     * @param {Object} instance 对象事例
     * @param {string} eventName 事件名称
     * @param {Function} handler 绑定的函数
     *
     */
    function EventListener(instance, eventName, handler) {
        this.instance = instance;
        this.eventName = eventName;
        this.handler = handler;
        this.id = ++eid;
        _get_event_list(instance, eventName)[this.id] = this;
        // if (ie) {
        //     _listeners[this.id] = this;
        // }
    }

    var eid = 0; //事件id

    EventListener.prototype.remove = function () {
        var instance = this.instance;
        var eventName = this.eventName;
        if (instance) {
            delete _get_event_list(instance, eventName)[this.id];
            if (instance.__events_) {
                if (is_empty(instance.__events_[eventName])) {
                    delete instance.__events_[eventName];
                }
                if (is_empty(instance.__events_)) {
                    delete instance.__events_;
                }
            }
            this.handler = this.instance = null;
            delete _listeners[this.id];

        }
    };

    //注册实例事件
    function _get_event_list(instance, eventName) {
        var events;
        // if (ie) {
        //     var eventObject = getEventObject(instance);
        //     events = eventObject.__events_;
        // } else {
        instance.__events_ || (instance.__events_ = {});
        events = instance.__events_;
        // }
        events[eventName] || (events[eventName] = {});
        return events[eventName];
    }

    function getEventObject(object) {
        var eventObject;
        if (object && object.__oid_) {
            eventObject = _eventObjects[object.__oid_];
        }
        if (!eventObject && object) {
            object.__oid_ = ++_eventObjectIdIndex;
            eventObject = {
                __events_: {}
            };
            _eventObjects[object.__oid_] = eventObject;
        }
        return eventObject;
    }

    //获取事件侦听器
    function _get_listeners(instance, eventName) {
        var listeners;
        var events;
        // if (ie) {
        //     var eventObject = getEventObject(instance);
        //     if (eventObject) {
        //         events = eventObject.__events_;
        //     }
        // } else {
        events = instance.__events_ || {};
        // }
        if (eventName) {
            listeners = events[eventName] || {};
        } else {
            listeners = {};
            var _items;
            var _listenerKey;
            for (eventName in events) {
                _items = events[eventName];
                for (_listenerKey in _items) {
                    listeners[_listenerKey] = _items[_listenerKey];
                }
            }
        }
        return listeners;
    }

    //转发并触发事件
    function _forward_event(eventName, object) {
        return function () {
            for (var args = [object, eventName], len = arguments.length, i = 0; i < len; ++i) {
                args.push(arguments[i]);
            }
            observer.trigger.apply(this, args);
        }
    }


    window.observer = observer;

})();