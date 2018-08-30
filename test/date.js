const assert = require('power-assert')
const {
  dateFormat
} = require('../src/util')

function deepEq(actual, value, message) {
  assert.deepStrictEqual(actual, value, message)
}

describe('日期方法：', () => {
  function zeroFill(str) {
    str += ''
    str.length === 1 && (str = '0' + str)
    return str
  }

  describe('dateFormat: ', () => {
    const now = Date.now()
    const D = new Date
    const res1 = `${D.getFullYear()}-${zeroFill(D.getMonth() + 1)}-${D.getDate()} ${zeroFill(D.getHours())}:${zeroFill(D.getMinutes())}:${zeroFill(D.getSeconds())}`
    const res2 = `${D.getFullYear()}, ${zeroFill(D.getMonth() + 1)}, ${D.getDate()}`
    const res3 = `${zeroFill(D.getHours())}.${zeroFill(D.getMinutes())}.${zeroFill(D.getSeconds())}`
    const res4 = `${zeroFill(D.getHours())}:${zeroFill(D.getMinutes())}:${zeroFill(D.getSeconds())}`
    const res5 = `${D.getDay()}`

    it('默认不传值使用', () => {
      assert.ok(dateFormat())
    })
    it(`传入时间戳 ${now}，应返回 ${res1}`, () => {
      deepEq(dateFormat(now), res1)
    })
    it(`传入时间戳 ${now}，指定格式 %Y, %m, %d，应返回 ${res2}`, () => {
      deepEq(dateFormat(now, '%Y, %m, %d'), res2)
    })
    it(`传入时间戳 ${now}，指定格式 %H.%M.%S，应返回 ${res3}`, () => {
      deepEq(dateFormat(now, '%H.%M.%S'), res3)
    })
    it(`传入时间戳 ${now}，指定格式 %T，应返回 ${res4}`, () => {
      deepEq(dateFormat(now, '%T'), res4)
    })
    it(`传入时间戳 ${now}，指定格式 %w，应返回 ${res5}`, () => {
      deepEq(dateFormat(now, '%w'), res5)
    })
  })
})

















