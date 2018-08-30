const assert = require('power-assert')
const {
  addQuery,
  getPaths,
  getQuery
} = require('../src/util')

function deepEq(actual, value, message) {
  assert.deepStrictEqual(actual, value, message)
}
const host = 'http://markey.test.cn'
const path = '/test/markey'
const query = 'test=test&a=b'

describe('url方法：', () => {
  describe('addQuery: ', () => {
    const param = 'channelFrom=123'

    it('没有pathname，无hash，无参数，直接添加到域名后面', () => {
      deepEq(addQuery(host, param), `${host}?${param}`)
    })
    it('没有pathname，有hash，无参数，添加到域名之后，hash之前', () => {
      deepEq(addQuery(`${host}#/hash`, param), `${host}?${param}#/hash`)
    })
    it('没有pathname，无hash，有参数，添加到域名后面，已有参数前面', () => {
      deepEq(addQuery(`${host}?${query}`, param), `${host}?${param}&${query}`)
    })
    it('没有pathname，有hash，有参数，添加到域名后面，已有参数前面', () => {
      deepEq(addQuery(`${host}?${query}#/hash`, param), `${host}?${param}&${query}#/hash`)
    })
    it('有pathname，无hash，无参数，直接添加到pathname后面', () => {
      deepEq(addQuery(`${host}${path}`, param), `${host}${path}?${param}`)
    })
    it('有pathname，无hash，有参数，添加到域名后面，已有参数前面', () => {
      deepEq(addQuery(`${host}${path}?${query}`, param), `${host}${path}?${param}&${query}`)
    })
    it('有pathname，有hash，无参数，添加到pathname后面，hash前面', () => {
      deepEq(addQuery(`${host}${path}#/hash`, param), `${host}${path}?${param}#/hash`)
    })
    it('有pathname，有hash，有参数，添加到域名后面，已有参数前面', () => {
      deepEq(addQuery(`${host}${path}?${query}#/hash`, param), `${host}${path}?${param}&${query}#/hash`)
    })
  })

  describe('getPaths: ', () => {
    it('基本应用，传入pathname，得到数组', () => {
      deepEq(getPaths(path), ['test', 'markey'], '获取拆分pathname错误')
    })
  })

  describe('getQuery: ', () => {
    it('无参数，无hash，得到空对象', () => {
      const href = `${host}${path}`
      deepEq(getQuery(href), {}, '返回结果不正确')
    })
    it('无参数，有hash，得到空对象', () => {
      const href = `${host}${path}#/hash`
      deepEq(getQuery(href), {}, '返回结果不正确')
    })
    it('有参数，无hash，得到参数对象', () => {
      const href = `${host}${path}?${query}`
      deepEq(getQuery(href), { test: 'test', a: 'b' }, '返回结果不正确')
    })
    it('有参数，有hash，得到参数对象', () => {
      const href = `${host}${path}?${query}#/hash`
      deepEq(getQuery(href), { test: 'test', a: 'b' }, '返回结果不正确')
    })
  })
})

