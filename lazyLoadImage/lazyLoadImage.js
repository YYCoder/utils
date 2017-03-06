/**
 * lazyLoadImage
 * @author  Markey
 * @date    2017-03-01
 */
(function () {
    'use strict';
    var lazyLoadImage = {};
    var imgArr = [];

    lazyLoadImage.init = function () {
        var allImgs = document.getElementsByTagName('img');
        var allScrollWrap = document.querySelectorAll('[data-scroll-wrap]');
        imgArr = Array.prototype.slice.call(allImgs, 0);

        imgArr.forEach(function (elem, index) {
            elem.style.opacity = '0';
            elem.style.transitionProperty = 'opacity';
            elem.style.transitionTimingFunction = 'ease';
            elem.style.transitionDuration = '0.4s';
            elem.onload = function () {
                elem.style.opacity = '1';
            }
        });
        // 设置所有滚动条容器的定位,否则内部子元素无法计算正确的距离
        allScrollWrap.forEach(function (elem, index) {
            elem.style.position = 'relative';
        });

        console.log('init !');
        console.log(imgArr);
    }
    lazyLoadImage.refresh = function () {
        throttleCheck();
    }

    // 暂时还没搞懂原理,有空继续研究
    /**
     * 节流函数
     * @param  {Function} func(必须)    [要调用的函数]
     * @param  {Number} wait(必须)    [间隔毫秒数]
     * @param  {[type]} options [description]
     * @return {Function}
     */
    var throttle = function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) {
            options = {};
        }
        var later = function () {
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) {
                context = args = null;
            }
        };
        return function () {
            var now = Date.now();
            if (!previous && options.leading === false) {
                previous = now;
            }
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) {
                    context = args = null;
                }
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };
    var throttleCheck = throttle(check, 1000);

    /**
     * 获取最近的满足选择器匹配的祖先(父)元素
     * @param  {DOM} elem(必须) [要获取父元素的元素]
     * @param  {String} selector(非必须) [要满足的选择器字符串]
     * @return {DOM}
     */
    function closest(elem, selector) {
        var parent;
        // 是否匹配选择器
        var isMatched;
        if (elem instanceof Element) {
            parent = elem.parentElement;
            if (typeof(selector) === 'string') {
                while (parent !== document.documentElement) {
                    isMatched = (parent.matchesSelector && parent.matchesSelector(selector))
                             || (parent.matches && parent.matches(selector));
                    if (isMatched) {
                        return parent;
                    }
                    else {
                        parent = parent.parentElement;
                    }
                }
                (!isMatched) && (parent = null);
            }
            else {
                return parent;
            }
        }
        else {
            console.warn('invalid parameter 1 !');
            parent = null;
        }
        return parent;
    }

    /**
     * 判断元素是否进入视区
     * @param  {DOM}  elem(必须) [元素]
     * @return {Boolean}
     */
    // 暂时先不解决滚动条容器中的图片懒加载,现在是滚动条容器进入视区就立即加载该容器中所有图片
    function isIntoView(elem) {
        // 滚动条容器
        var parent = closest(elem, '[data-scroll-wrap]');
        // 垂直方向进入视区
        var isVIntoView;
        // 水平方向进入视区
        var isHIntoView;
        // 若支持getBoundingClientRect()方法,最好使用该方法,可直接获取图片相对视区顶部的距离
        /*if (typeof elem.getBoundingClientRect === 'function') {
            var position = elem.getBoundingClientRect();
            isVIntoView = (position['top'] <= screen.availHeight)
                       && (position['bottom'] >= 0);
            isHIntoView = (position['left'] <= screen.availWidth)
                       && (position['right'] >= 0);
        }
        else {*/
            if (parent instanceof Element) {
                if (!isIntoView(parent)) {
                    return false;
                }
                else {
                    isVIntoView = isVerticalIntoView(elem, parent);
                    isHIntoView = isHorizontalIntoView(elem, parent);
                    return isVIntoView && isHIntoView;
                }
            }
            else {
                isVIntoView = isVerticalIntoView(elem, parent);
                isHIntoView = isHorizontalIntoView(elem, parent);
            }
        // }
        return isVIntoView && isHIntoView;
    }
    /**
     * 元素垂直方向是否在视区中
     * @param  {DOM}      elem(必须)        [要判断的元素]
     * @param  {DOM}      container(非必须)  [容器元素]
     * @return {Boolean}
     */
    function isVerticalIntoView(elem, container) {
        var isVerticalIntoView,
            position,
            windowTop,
            windowBottom,
            scrollTop,
            scrollBottom;
        if (!container || container == window) {
            position = getPosition(elem);
            windowTop = window.pageYOffset || window.scrollY;
            windowBottom = windowTop
                         + (window.innerHeight || document.documentElement.clientHeight);
            isVerticalIntoView = (position['top'] <= windowBottom)
                              && (position['bottom'] >= windowTop);
        }
        else {
            position = getPosition(elem, container);
            scrollTop = container.scrollTop;
            scrollBottom = scrollTop
                         + window.parseInt(window.getComputedStyle(container).height);
            isVerticalIntoView = (position['top'] <= scrollBottom)
                              && (position['bottom'] >= scrollTop)
        }
        return isVerticalIntoView;
    }
    /**
     * 元素水平方向是否在视区中
     * @param  {DOM}      elem(必须)        [要判断的元素]
     * @param  {DOM}      container(非必须)        [容器元素]
     * @return {Boolean}
     */
    function isHorizontalIntoView(elem, container) {
        var isHorizontalIntoView,
            position,
            windowLeft,
            windowRight,
            scrollLeft,
            scrollRight;
        if (!container || container == window) {
            position = getPosition(elem);
            windowLeft = window.pageXOffset || window.scrollX;
            windowRight = windowLeft
                        + (window.innerWidth || document.documentElement.clientWidth);
            isHorizontalIntoView = (position['left'] <= windowRight)
                                && (position['right'] >= windowLeft);
        }
        else {
            position = getPosition(elem, container);
            scrollLeft = container.scrollLeft;
            scrollRight = scrollLeft
                        + window.parseInt(window.getComputedStyle(container).width);
            isHorizontalIntoView = (position['left'] <= scrollRight)
                                && (position['right'] >= scrollLeft)
        }
        return isHorizontalIntoView;
    }

    /**
     * 检查所有图片哪些需要加载
     */
    function check() {
        var hasLoaded;
        var intoView;
        for (var i = 0; i < imgArr.length; i++) {
            hasLoaded = !!imgArr[i].src;
            intoView = isIntoView(imgArr[i]);
            if (!hasLoaded && intoView) {
                imgArr[i].src = imgArr[i].dataset['src'];
            }
        };
    }

    /**
     * 计算图片相对 body或滚动条容器 左上角的距离
     * @param  {DOM}     elem(必须)    [元素]
     * @return {Object}    
     */
    function getPosition(elem, container) {
        var parent = container instanceof Element
                   ? container
                   : null;
        var position = {};
        position['top'] = 0;
        position['bottom'] = elem.offsetHeight;
        position['left'] = 0;
        position['right'] = elem.offsetWidth;
        while (elem.offsetParent !== null) {
            position['left'] += elem.offsetLeft;
            position['top'] += elem.offsetTop;
            position['right'] += elem.offsetLeft;
            position['bottom'] += elem.offsetTop;
            if (elem.offsetParent === parent) {
                break;
            }
            elem = elem.offsetParent;
        }
        return position;
    }

    window.lazyLoadImage = lazyLoadImage;
    window.addEventListener('scroll', function () {
        throttleCheck();
    });

})();