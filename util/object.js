/**
 * 判断是不是空对象
 * @author yuanye
 * @date   2017.02.25
 */
var isEmpty = function (object) {
    for (var p in object) {
        if (object.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
};