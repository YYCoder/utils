// 测试util.js是否支持CMD

const deepClone = require('./util').deepClone

var obj2 = {
    name: '袁野',
    age: 22,
    value: null
},
obj1 = {
    name: 'yuanye',
    like: ['coding', 'reading'],
    fun: function () {
        console.log(123);
    },
    toObj: obj2
},
arr = [1, 2, 3, {
    name: 4
}];
var newObj = deepClone(obj1),
    newArr = deepClone(arr);
obj2.name = '123';
console.log(obj1);
console.log(newObj);
console.log(newArr);
