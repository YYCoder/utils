const assert = require('power-assert')
const {
  isEmpty,
  deepClone
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
    const obj2 = {
      name: '袁野',
      age: 22,
      value: null
    }
    const obj1 = {
      name: 'yuanye',
      like: ['coding', 'reading'],
      fun: function () {
        console.log(123)
      },
      toObj: obj2
    }
    const arr = [1, 2, 3, {
      name: 4
    }]
    const newObj = deepClone(obj1)
    const newArr = deepClone(arr)
    it('基础使用，应返回 { name: 123 }', () => {

    })
  })

})

