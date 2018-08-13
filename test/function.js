const assert = require('power-assert')
const {
  bind,
  throttle,
  denounce
} = require('../src/util')

function deepEq(actual, value, message) {
  assert.deepStrictEqual(actual, value, message)
}
function fail(message) {
  assert.fail(message)
}

describe('函数方法：', () => {
  describe('bind: ', () => {
    function fun(...args) {
      return [
        this,
        ...args
      ]
    }
    const context = { name: 'test' }
    const bindFun1 = bind(fun, context)
    const bindFun2 = bind(fun, context, 1)

    it('bind时不传参数，后续调用也不传参数', () => {
      deepEq(bindFun1(), [ context ])
    })
    it('bind时不传参数，后续调用返回的函数时会把新传入的参数带上', () => {
      deepEq(bindFun1(2, 3), [ context, 2, 3 ])
    })
    it('bind时传了参数，后续调用返回的函数时会把新传入的参数拼接在后面', () => {
      deepEq(bindFun2(2, 3), [ context, 1, 2, 3 ])
    })
  })

  describe('throttle: ', () => {
    const fun = (cb) => {
      cb()
      return ++count
    }
    const throttleFun2 = throttle(fun, 200, { leading: false })
    const throttleFun3 = throttle(fun, 200, { leading: true })
    const throttleFun4 = throttle(fun, 200, { trailing: true })

    it('默认不传options对象，则首次也调用，最后也调用', (done) => {
      let count = 1
      const throttleFun = throttle(() => {
        if (count === 3) done()
        return count++
      }, 200)
      let now = Date.now()

      while (now <= now + 200) {
        throttleFun()
        now = Date.now()
      }
    })


  })
})

















