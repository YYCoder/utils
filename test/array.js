const assert = require('assert')
const {
  findIndex,
  find,
  objToArray
} = require('../src/util')

function deepEq(actual, value, message) {
  assert.deepStrictEqual(actual, value, message)
}
function fail(message) {
  assert.fail(message)
}

describe('数组方法：', () => {
  const obj = {name: 123}
  const arr = ['123']
  const rawArr = ['123', 123, obj, arr, 123]

  describe('findIndex: ', () => {
    it('查找数值的位置，应返回[1, 4]', () => {
      deepEq([1, 4], findIndex(rawArr, 123), '未能查找到数值位置')
    })
    it('查找字符串的位置，应返回[0]', () => {
      deepEq([0], findIndex(rawArr, '123'), '未能查找到字符串位置')
    })
    it('查找对象的位置，应返回[2]', () => {
      deepEq([2], findIndex(rawArr, obj), '未能查找到对象位置')
    })
    it('查找数组的位置，应返回[3]', () => {
      deepEq([3], findIndex(rawArr, arr), '未能查找到数组位置')
    })
  })

  describe('find: ', () => {
    it('查找数值的位置，应返回[123, 123]', () => {
      !find(rawArr, (ele) => ele === 123).every((ele) => ele === 123) && fail('未能查找到数值位置')
    })
    it('查找字符串的位置，应返回["123"]', () => {
      !find(rawArr, (ele) => ele === '123').every((ele) => ele === '123') && fail('未能查找到字符串位置')
    })
    it('查找对象的位置，应返回[{name: 123}]', () => {
      !find(rawArr, (ele) => ele === obj).every((ele) => ele === obj) && fail('未能查找到对象位置')
    })
    it('查找数组的位置，应返回[["123"]]', () => {
      !find(rawArr, (ele) => ele === arr).every((ele) => ele === arr) && fail('未能查找到数组位置')
    })
  })

  describe('objToArray: ', () => {
    const objArr = {
      0: 123,
      1: 456,
      length: 2
    }

    it('类数组转数组，应返回[123, 456]', () => {
      const res = objToArray(objArr)
      if (!Array.isArray(res)) {
        fail('未返回数组类型')
      }
      else if (res[0] !== 123 || res[1] !== 456) {
        fail('返回数组值不对')
      }
    })

    it('类数组转数组，应返回[123]', () => {
      const res = objToArray(objArr, 0, 1)
      if (res[0] !== 123) {
        fail('截取后，返回数组值不对')
      }
    })
    it('类数组转数组，应返回[456]', () => {
      const res = objToArray(objArr, 1, 2)
      if (res[0] !== 456) {
        fail('截取后，返回数组值不对')
      }
    })
  })


})
