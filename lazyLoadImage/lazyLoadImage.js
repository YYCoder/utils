/**
 * lazyLoadImage
 * @author  Markey
 * @date    2017-03-01
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ?
                                      module.exports = factory() :
    typeof define === 'function' && define.amd ?
                               define(factory) : (global.lazyLoadImage = factory());
}(this, function () {
    'use strict';
    var lazyLoadImage = {};
    var imgArr = [];

    // 说明:
    // 用法一: 在DOM ready后调用init()方法,初始化所有图片,并默认在window.scroll事件
    // 中刷新需要加载的图片,默认图片宽高是100%;
    // 用法二: 若是滚动容器中懒加载,需要对该容器添加data-scroll-wrap属性,并绑定scroll事件,
    // 调用refresh()方法;
    // 用法三: 加载图文详情图片,给容器加data-image-wrap="image-info"属性,
    // 图片自动设置width: 100%显示;
    // 用法四: 加载等比缩放并且居中显示的图片,给容器加data-image-wrap="center"属性
    lazyLoadImage.init = function () {
        var allImgs = document.querySelectorAll('img[data-src]');
        var allScrollWrap = document.querySelectorAll('[data-scroll-wrap]');
        imgArr = Array.prototype.slice.call(allImgs, 0);

        imgArr.forEach(function (elem, index) {
            var cssText = 'opacity: 0;'
                        + 'transition-property: opacity;'
                        + 'transition-timing-function: ease;'
                        + 'transition-duration: 0.4s;';
            var imgWrap = closest(elem, '[data-image-wrap]');
            if (imgWrap instanceof Element) {
                if (imgWrap.dataset['imageWrap'] === 'center') {
                    imgWrap.style.cssText = 'position: relative;';
                    cssText += 'max-width: 100%; max-height: 100%;'
                             + 'position: absolute;'
                             + 'left: 50%;'
                             + 'top: 50%;'
                             + 'transform: translate(-50%, -50%);';
                }
                else if (imgWrap.dataset['imageWrap'] === 'image-info') {
                    cssText += 'width: 100%;';
                }
            }
            else {
                cssText += 'width: 100%;height: 100%;';
            }

            // 防止多次调用init重复设置
            if (!elem.dataset['hasLoad']) {
                elem.style.cssText = cssText;
            }
            // 为什么不用addEventListener?因为onload重复绑定会覆盖之前绑定的,可以防止重复调用init导致绑定多次
            elem.onload = function () {
                elem.style.opacity = '1';
                elem.dataset['hasLoad'] = '1';
                elem.onload = null;
            }
        });
        // 设置所有滚动条容器的定位,否则内部子元素无法计算正确的距离
        allScrollWrap.forEach(function (elem, index) {
            elem.style.position = 'relative';
        });

        // console.log('init !');
        console.log(imgArr);
    }
    lazyLoadImage.refresh = function () {
        throttleCheck();
    }
    // 手动加载所有进入视区的图片
    lazyLoadImage.reload = function () {
        check();
    }

    /**
     * 节流函数
     * @param  {Function} func(必须)    [要调用的函数]
     * @param  {Number} wait(必须)    [间隔毫秒数]
     * @param  {[type]} options [description]
     * @return {Function}
     */
    var throttle = function (fun, wait, option) {
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
    var throttleCheck = throttle(check, 500);

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
            parent = elem.parentElement || elem.parentNode;
            if (typeof(selector) === 'string') {
                while (parent !== document.documentElement) {
                    isMatched = (parent.matchesSelector && parent.matchesSelector(selector))
                             || (parent.matches && parent.matches(selector));
                    if (isMatched) {
                        return parent;
                    }
                    else {
                        parent = parent.parentElement || parent.parentNode;
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
    function isIntoView(elem) {
        // 滚动条容器
        var parent = closest(elem, '[data-scroll-wrap]');
        // 垂直方向进入视区
        var isVIntoView;
        // 水平方向进入视区
        var isHIntoView;
        // 若支持getBoundingClientRect()方法,最好使用该方法,可直接获取图片相对视区顶部的距离
        if (typeof elem.getBoundingClientRect === 'function') {
            var position = elem.getBoundingClientRect();
            isVIntoView = (position['top'] <= screen.availHeight)
                       && (position['bottom'] >= 0);
            isHIntoView = (position['left'] <= screen.availWidth)
                       && (position['right'] >= 0);
        }
        else {
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
        }
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
     * @param  {DOM}     elem(必须)          [元素]
     * @param  {DOM}     container(非必须)    [容器元素]
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

    window.addEventListener('scroll', function () {
        throttleCheck();
    });
    return lazyLoadImage;

}));
