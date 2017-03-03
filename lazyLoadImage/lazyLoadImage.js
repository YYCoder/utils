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
        for (var i = 0; i < imgArr.length; i++) {
            var hasLoaded = !!imgArr[i].src;
            var isIntoView = (imgArr[i].y < window.innerHeight + window.scrollY)
                            && (imgArr[i].y > window.scrollY);
            if (!hasLoaded && isIntoView) {
                imgArr[i].src = imgArr[i].dataset['src'];
            }
        };
    }

    window.lazyLoadImage = lazyLoadImage;
    window.addEventListener('scroll', function () {
        check();
    });

})();