/**
 * 查找数组中所有与指定值相等(strict equality)的元素的索引
 * @author   yuanye
 * @date     2017-02-25
 * @param {Array} [a](必选) [被查找的数组]
 * @param {any} [x](必选) [要查找的元素]
 */
function findAll(a, x) {
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
 * @author  yuanye
 * @date    2017.02.26
 * @param {Object} obj 函数参数对象或节点列表.
 * @param {Number} [start] 数组开始元素是从零开始计算的下标。
 * @param {Number} [end] 数组结束元素是从零开始计算的下标.
 * @return {Array} [数组]
 */
var objToArray = function (obj, start, end) {
    var len = obj.length;
    start = start || 0;
    end = end || len;
    return Array.prototype.slice.call(obj, start, end);
};