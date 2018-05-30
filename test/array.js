const assert = require('power-assert')
const {
  findIndex,
  find,
  objToArray,
  sortObjs,
  arrUnique,
  flatten,
  union
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

  describe('sortObjs: ', () => {
    const objArr = [
      { age: 1 },
      { age: 3 },
      { age: 2 }
    ]

    it('排序对象数组，默认升序', () => {
      deepEq([{age: 1}, {age: 2}, {age: 3}], sortObjs(objArr, 'age'))
    })
    it('排序对象数组，降序', () => {
      deepEq([{age: 3}, {age: 2}, {age: 1}], sortObjs(objArr, 'age', true))
    })
  })

  describe('arrUnique: ', () => {
    const rawArr = [123, 123, 123, 'name', 'name', null, null, undefined, undefined]
    const rawNaNArr = [NaN, 123, NaN, 123]

    it('数组去重，应返回[123, "name", null, undefined]', () => {
      deepEq([123, 'name', null, undefined], arrUnique(rawArr))
    })
    it('包含NaN数组，应返回[NaN, 123]', () => {
      const res = arrUnique(rawNaNArr)
      assert(isNaN(res[0]) || res[1] === 123)
    })
  })

  describe('flatten: ', () => {
    const rawArr = [[123, 456], [123, 456, [789]], 123]

    it('默认完全扁平化', () => {
      deepEq([123, 456, 123, 456, 789, 123], flatten(rawArr))
    })
    it('只扁平化一层', () => {
      deepEq([123, 456, 123, 456, [789], 123], flatten(rawArr, true))
    })
  })

  describe('union: ', () => {
    const arr1 = [123, 456, [123, 456], 678]
    const arr2 = [1, 2, 3, [4, 5, 6, [7, 8]]]
    const arr3 = ['haha', 'haha']

    it('两数组默认扁平化并去重', () => {
      deepEq([ 123, 456, 678, 1, 2, 3, 4, 5, 6, 7, 8 ], union(arr1, arr2))
    })
    it('三数组默认扁平化并去重', () => {
      deepEq([ 123, 456, 678, 1, 2, 3, 4, 5, 6, 7, 8, 'haha' ], union(arr1, arr2, arr3))
    })
    it('三数组不去重，只扁平化', () => {
      deepEq([ 123, 456, 123, 456, 678, 1, 2, 3, 4, 5, 6, 7, 8, 'haha', 'haha' ], union({unique: false}, arr1, arr2, arr3))
    })
    it('三数组只去重，不扁平化', () => {
      deepEq([ 123, 456, [ 123, 456 ], 678, 1, 2, 3, [ 4, 5, 6, [ 7, 8 ] ], 'haha' ], union({unique: true, flatten: false}, arr1, arr2, arr3))
    })
    it('传入非数组元素，也会被合并', () => {
      deepEq(['123', 123, 456, 678], union('123', arr1))
    })
  })

})

















