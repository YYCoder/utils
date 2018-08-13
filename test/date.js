const assert = require('power-assert')
const {
  dateFormat
} = require('../src/util')

function deepEq(actual, value, message) {
  assert.deepStrictEqual(actual, value, message)
}
function fail(message) {
  assert.fail(message)
}

describe('日期方法：', () => {
  describe('dateFormat: ', () => {
    it('默认不传值使用', () => {
      assert.ok(dateFormat())
    })
    it('传入时间戳 1534159114263，应返回 2018-08-13 19:18:34', () => {
      deepEq(dateFormat(1534159114263), '2018-08-13 19:18:34')
    })
    it('传入时间戳 1534159114263，指定格式 %Y, %m, %d，应返回 2018, 08, 13', () => {
      deepEq(dateFormat(1534159114263, '%Y, %m, %d'), '2018, 08, 13')
    })
    it('传入时间戳 1534159114263，指定格式 %H.%M.%S，应返回 19.18.34', () => {
      deepEq(dateFormat(1534159114263, '%H.%M.%S'), '19.18.34')
    })
    it('传入时间戳 1534159114263，指定格式 %T，应返回 19:18:34', () => {
      deepEq(dateFormat(1534159114263, '%T'), '19:18:34')
    })
    it('传入时间戳 1534159114263，指定格式 %w，应返回 1', () => {
      deepEq(dateFormat(1534159114263, '%w'), '1')
    })
  })
})

















