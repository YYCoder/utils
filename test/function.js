const assert = require('power-assert')
const {
  bind,
  throttle,
  denounce,
  sleep,
  composeStack
} = require('../src/util')

function deepEq(actual, value, message) {
  assert.deepStrictEqual(actual, value, message)
}

// 通过死循环模拟持续调用，通过count统计调用次数，从而确认是否正常节流
function testThrottle(number, timeout, done, options = {}) {
  const start = Date.now()
  // 需要保留一个延迟100ms，因为实际运行时不可能准确到毫秒，会存在一定延迟
  const delay = 100
  let count = 0
  let now = Date.now()
  const throttleFun = throttle(() => {
    count++
  }, timeout, options)
  // 模拟持续调用
  while (now <= start + timeout + delay) {
    throttleFun()
    now = Date.now()
  }
  // 最后判断调用次数，若等于期望值，则代表节流正常；
  // 延迟是由于最后可能还存在一次调用，该调用时延迟一个timeout的，所以必须等这个timeout执行完才能统计到正确的调用次数
  setTimeout(() => {
    if (count === number) done()
    else done(`调用次数错误，期望调用 ${number} 次，实际调用 ${count} 次`)
  }, timeout + delay)
}
// 通过死循环模拟持续调用，原理同上
function testDenounce(number, timeout, done, isImmediate = false) {
  const start = Date.now()
  // 需要保留一个延迟100ms，因为实际运行时不可能准确到毫秒，会存在一定延迟
  const delay = 100
  let count = 0
  let now = Date.now()
  const denounceFun = denounce(() => {
    count++
  }, timeout, isImmediate)
  // 模拟持续调用
  while (now <= start + timeout + delay) {
    denounceFun()
    now = Date.now()
  }
  // 最后判断调用次数，若等于期望值，则代表节流正常；
  // 延迟是由于最后可能还存在一次调用，该调用时延迟一个timeout的，所以必须等这个timeout执行完才能统计到正确的调用次数
  setTimeout(() => {
    if (count === number) done()
    else done(`调用次数错误，期望调用 ${number} 次，实际调用 ${count} 次`)
  }, timeout + delay)  
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

    it('默认不传options对象，则首次也调用，最后也调用', (done) => {
      testThrottle(3, 200, done)
    })

    it('首次调用，最后不调用', (done) => {
      testThrottle(2, 200, done, { trailing: false })
    })

    it('首次不调用，最后调用', (done) => {
      testThrottle(2, 200, done, { leading: false })
    })

  })

  describe('denounce: ', () => {

    it('默认不会立即执行第一次调用', (done) => {
      testDenounce(1, 200, done)
    })

    it('立即执行第一次，会执行第一次和最后一次', (done) => {
      testDenounce(2, 200, done, true)
    })

  })

  describe('sleep: ', () => {
    it('阻塞1秒', (done) => {
      const start = Date.now()
      setTimeout(() => {
        sleep(1000)
        const end = Date.now()
        assert.ok(end - start >= 1000, '阻塞无效')
        done()
      })
    })
  })

  describe('composeStack: ', () => {
    const resArr1 = []
    const funArr1 = [
      (next) => {
        resArr1.push('first begin')
        next()
        resArr1.push('first end')
      },
      (next) => {
        resArr1.push('second begin')
        next()
        resArr1.push('second end')
      }
    ]
    const resArr2 = []
    const funArr2 = [
      (next, arg) => {
        resArr2.push('first begin')
        resArr2.push(arg)
        next()
        resArr2.push('first end')
      },
      (next, arg) => {
        resArr2.push('second begin')
        resArr2.push(arg)
        next()
        resArr2.push('second end')
      }
    ]

    it('koa-compose组合函数，基本使用', () => {
      composeStack(funArr1)()
      deepEq(resArr1, ['first begin', 'second begin', 'second end', 'first end'])
    })
    it('koa-compose组合函数，传入参数，参数会在多个函数中传递', () => {
      composeStack(funArr2)('test')
      deepEq(resArr2, ['first begin', 'test', 'second begin', 'test', 'second end', 'first end'])
    })
  })


  describe('compose: ', () => {
    
  })

})

















