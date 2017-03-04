/**
 * lazyLoadImage
 * @author  WhyCoder
 * @date    2017-02-22
 */
(function () {
    'use strict';
    var lazyLoadImage = {};
    var imgArr = [];

    lazyLoadImage.init = function () {
        console.log('init !');
        var allImgs = document.querySelectorAll('img');
        imgArr = Array.prototype.slice.call(allImgs, 0);
        console.log(imgArr);
    }

    function check() {
        var hasLoaded;
        var isIntoView;
        var position;
        for (var i = 0; i < imgArr.length; i++) {
            hasLoaded = !!imgArr[i].src;
            position = getPosition(imgArr[i]);
            // isIntoView = ((position.y < screen.availHeight + window.scrollY)
            //               && (position.y > window.scrollY))
            // 			  || ;
            if (!hasLoaded && isIntoView) {
                imgArr[i].src = imgArr[i].dataset['src'];
            }
        };
    }

    /**
     * 获取图片相对document左上角的距离
     * @param  {DOM} img(必须) [图片元素]
     * @return {Object}       [坐标对象]     
     */
    function getPosition(img) {
        var position = {};
        // getBoundingClientRect()方法所有元素都有,现代浏览器都已兼容,IE8也兼容
        if (typeof img.getBoundingClientRect === 'function') {
            position['left'] = img.getBoundingClientRect().left;
            position['top'] = img.getBoundingClientRect().top;
            position['right'] = img.getBoundingClientRect().right;
            position['bottom'] = img.getBoundingClientRect().bottom;
        }
        else {
            var elem = img;
            position['top'] = 0;
            position['bottom'] = elem.offsetHeight;
            position['left'] = 0;
            position['right'] = elem.offsetWidth;
            // 若不支持getBoundingClientRect()方法,则只能循环offsetParent来获取绝对位置
            while (elem.offsetParent !== null) {
                position['left'] += elem.offsetLeft;
                position['top'] += elem.offsetTop;
                position['right'] += elem.offsetLeft;
                position['bottom'] += elem.offsetTop;
                elem = elem.offsetParent;
            }
        }
        return position;
    }

    window.lazyLoadImage = lazyLoadImage;
    window.addEventListener('scroll', function () {
        check();
    });

})();