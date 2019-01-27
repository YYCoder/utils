const assert = require('power-assert')
const {
    isEmpty,
    deepClone,
    assign,
    deepAssign,
    equalObj,
    safeGetter,
    invert
} = require('../src/util')

function deepEq(actual, value, message) {
    assert.deepStrictEqual(actual, value, message)
}

describe('对象方法：', () => {

    describe('isEmpty: ', () => {
        const obj = Object.create({ name: 'test' }, {
            key1: {
                value: 'hahaha',
                enumerable: false,
                writable: true,
                configurable: true
            },
            key2: {
                value: 'hehehe',
                enumerable: false,
                writable: true,
                configurable: true
            }
        })
        it('传入空对象，应返回 true', () => {
            assert.ok(isEmpty({}), '判断错误')
        })
        it('传入非空对象，应返回 false', () => {
            assert.ok(!isEmpty({ test: 123 }), '判断错误')
        })
        it('对不可枚举属性也可以判断，应返回 false', () => {
            assert.ok(!isEmpty(obj), '判断错误')
        })
    })

    describe('deepClone: ', () => {
        const obj1 = {
            name: '袁野',
            age: 22,
            value: null
        }
        const obj2 = {
            name: 'yuanye',
            like: ['coding', 'reading'],
            fun: function() {
                console.log(123)
            },
            obj: obj1
        }
        const obj3 = { name: 123 }
        const arr = [1, 2, 3, {
            name: 4
        }]
        it('基础使用，应返回 { name: 123 }', () => {
            const newObj = deepClone(obj3)
            deepEq(newObj, obj3, '克隆对象不正确')
            assert.ok(newObj !== obj3, '克隆对象与原对象是同一个引用，未深度克隆')
        })
        it('嵌套数组克隆，应返回 [1, 2, 3, { name: 4 }]', () => {
            const newObj = deepClone(arr)
            deepEq(newObj, arr, '克隆对象不正确')
            assert.ok(newObj !== arr, '克隆对象与原对象是同一个引用，未深度克隆')
        })
        it('嵌套对象克隆，应返回同obj2的对象', () => {
            const newObj = deepClone(obj2)
            deepEq(newObj, obj2, '克隆对象不正确')
            assert.ok(newObj !== obj2, '克隆对象与原对象是同一个引用，未深度克隆')
            assert.ok(newObj.obj !== obj1, '嵌套克隆对象与原对象是同一个引用，未深度克隆')
        })
    })

    describe('assign: ', () => {
        it('基础使用，应返回与obj同一个引用，但like属性与a属性不同', () => {
            const obj = {
                name: 'yy',
                like: [1, 2, 3],
                a: {
                    a1: 1
                }
            }
            const resObj = {
                name: 'yy',
                like: [4, 5, 6],
                a: {
                    a2: 2
                }
            }
            const newObj = assign(obj, {
                like: [4, 5, 6],
                a: {
                    a2: 2
                }
            })
            deepEq(newObj, resObj, '返回对象与期望对象不全等')
            assert.ok(newObj === obj, '返回对象与原对象不是同一个引用')
        })
        it('防止循环引用，a属性应不变', () => {
            const obj = {
                name: 'yy',
                like: [1, 2, 3],
                a: {
                    a1: 1
                }
            }
            const resObj = {
                name: 'yy',
                like: [4, 5, 6],
                a: { a1: 1 }
            }
            const newObj = assign(obj, {
                like: [4, 5, 6],
                a: obj
            })
            deepEq(newObj, resObj, '返回对象与期望对象不全等')
            assert.ok(newObj === obj, '返回对象与原对象不是同一个引用')
        })
        it('传入多个对象，后一个会覆盖前一个参数的同名属性', () => {
            const obj = { name: '123' }
            const resObj = { name: 'yuanye' }
            const newObj = assign(obj, {
                name: 'hahaha'
            }, {
                    name: 'yuanye'
                })
            deepEq(resObj, obj, '返回对象与期望对象不全等')
            assert.ok(newObj === obj, '返回对象与原对象不是同一个引用')
        })
    })

    describe('deepAssign: ', () => {
        it('基础使用，会嵌套同名属性会深度拓展', () => {
            const obj = {
                name: 'yy',
                a: {
                    a1: 1
                }
            }
            const resObj = {
                name: 'yuanye',
                a: {
                    a1: 1,
                    a2: 2
                }
            }
            const newObj = deepAssign(obj, {
                name: 'yuanye',
                a: { a2: 2 }
            })
            deepEq(newObj, resObj, '返回对象与期望对象不全等')
            assert.ok(newObj === obj, '返回对象与原对象不是同一个引用')
        })
        it('若属性为数组，不会深度拓展，而是单纯覆盖', () => {
            const obj = {
                arr: [1]
            }
            const resObj = {
                arr: [2]
            }
            const newObj = deepAssign(obj, {
                arr: [2]
            })
            deepEq(newObj, resObj, '返回对象与期望对象不全等')
            assert.ok(newObj === obj, '返回对象与原对象不是同一个引用')
        })
        it('防止循环引用，obj属性应不变', () => {
            const obj = {
                obj: { a: 1 }
            }
            const resObj = {
                obj: { a: 1 }
            }
            const newObj = deepAssign(obj, {
                obj
            })
            deepEq(newObj, resObj, '返回对象与期望对象不全等')
            assert.ok(newObj === obj, '返回对象与原对象不是同一个引用')
        })
    })

    describe('equalObj: ', () => {
        it('基本使用，没有嵌套属性', () => {
            const obj1 = { name: 123 }
            const obj2 = { name: 456 }
            assert.ok(!equalObj(obj1, obj2), '对比错误，应返回false')
        })
        it('基本使用，没有嵌套属性', () => {
            const obj1 = { name: 123 }
            const obj2 = { name: 123 }
            assert.ok(equalObj(obj1, obj2), '对比错误，应返回true')
        })
        it('数组属性，也会深度比较', () => {
            const obj1 = { arr: [1] }
            const obj2 = { arr: [2] }
            assert.ok(!equalObj(obj1, obj2), '对比错误，应返回false')
        })
        it('数组属性，也会深度比较', () => {
            const obj1 = { arr: [1] }
            const obj2 = { arr: [1] }
            assert.ok(equalObj(obj1, obj2), '对比错误，应返回true')
        })
        it('循环引用属性，若两者的同名属性都引用了自身，则认为是相等的，否则就死循环了', () => {
            const obj1 = { obj: null, name: '123' }
            const obj2 = { obj: null, name: '123' }
            obj1.obj = obj1
            obj2.obj = obj2
            assert.ok(equalObj(obj1, obj2), '对比错误，应返回true')
        })
    })

    describe('safeGetter: ', () => {
        const obj1 = {
            test1: {
                test2: 'haha'
            }
        }
        const deepObj = {
            name: 'hahaha',
            likes: [
                {
                    name: 'coding',
                    detail: {
                        type: 'work'
                    }
                }
            ],
            obj: null
        }
        deepObj.obj = deepObj
        it('基本使用，获取嵌套属性值', () => {
            assert.ok(safeGetter(['test1', 'test2'], obj1) === 'haha', '获取属性值错误')
        })
        it('获取数组元素', () => {
            assert.ok(safeGetter(['likes', 0, 'name'], deepObj) === 'coding', '获取属性值错误')
        })
        it('获取循环引用属性', () => {
            assert.ok(safeGetter(['obj', 'name'], deepObj) === 'hahaha', '获取属性值错误')
        })
        it('设置默认值', () => {
            assert.ok(safeGetter(['test1', 'hahaha'], obj1, 123) === 123, '返回默认值错误')
        })
        it('字符串语法，只有.语法', () => {
            assert.ok(safeGetter('test1.test2', obj1) === 'haha', '获取属性值错误')
        })
        it('字符串语法，只有[]语法', () => {
            assert.ok(safeGetter('test1[test2]', obj1) === 'haha', '获取属性值错误')
        })
        it('字符串语法，[]|.语法混用', () => {
            assert.ok(safeGetter('likes[0][detail].type', deepObj) === 'work', '获取属性值错误')
        })
    })

    describe('invert: ', () => {
        it('基本使用，只能翻转可以序列化成字符串的属性', () => {
            const obj = {
                name: 'haha',
                likes: [1],
                obj: {}
            }
            const resObj = {
                haha: 'name',
                1: 'likes',
                '[object Object]': 'obj'
            }
            deepEq(invert(obj), resObj, '翻转错误')
        })
    })

})

