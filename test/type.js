const assert = require('power-assert')
const {
  isObject,
  isBoolean
} = require('../src/util')


describe('类型判断相关方法：', () => {
  describe('isObject: ', () => {
    it('判断普通对象，应返回true', () => {
      assert.ok(isObject({ name: 123 }), '判断错误')
    })
    it('判断数值类型，应返回false', () => {
      assert.ok(!isObject(123), '判断错误')
    })
    it('判断数组类型，应返回false', () => {
      assert.ok(!isObject([1, 2]), '判断错误')
    })
    it('判断函数类型，应返回false', () => {
      assert.ok(!isObject(() => {}), '判断错误')
    })
  })

  describe('isBoolean: ', () => {
    it('判断布尔类型，应返回true', () => {
      assert.ok(isBoolean(true), '判断错误')
    })
    it('判断数值类型，应返回false', () => {
      assert.ok(!isBoolean(123), '判断错误')
    })
    it('判断对象类型，应返回false', () => {
      assert.ok(!isBoolean({}), '判断错误')
    })
  })
})
