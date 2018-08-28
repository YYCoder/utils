const assert = require('power-assert')
const {
  bind,
  throttle,
  denounce,
  sleep,
  composeStack,
  compose,
  curry,
  partial
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
    const input = 'hello functional programming'
    function nameWord(word) {
      return word.split(' ')
    }
    function compName(wordArr) {
      return wordArr.join('-')
    }
    it('compose组合函数基本调用，期望返回字符串 hello-functional-programming', () => {
      const output = 'hello-functional-programming'
      const getName = compose(nameWord, compName)
      assert.ok(getName(input) === output, '返回结果不对')
    })

    it('值传入一个函数，期望返回数组[hello, functional, programming]', () => {
      const output = ['hello', 'functional', 'programming']
      const getSplitName = compose(nameWord)
      deepEq(getSplitName(input), output)
    })
  })

  describe('curry: ', () => {
    let hasCalled = false
    function curryTest1(arg1, arg2, arg3, arg4) {
      return [arg1, arg2, arg3, arg4]
    }
    function curryTest2(arg1, arg2) {
      hasCalled = true
      return [arg1, arg2]
    }
    it('首次调用赋予初始参数，应返回 [1, 2, 3, 4]', () => {
      const test = curry(curryTest1, 1)(2)
      deepEq(test(3)(4), [1, 2, 3, 4], '调用返回结果不正确')
    })
    it('首次调用不传初始参数，应返回 [1, 2, 3, 4]', () => {
      const test = curry(curryTest1)(1, 2)
      deepEq(test(3)(4), [1, 2, 3, 4], '调用返回结果不正确')
    })
    it('参数未达到要求个数，不会调用传入函数', () => {
      curry(curryTest2)(3)
      assert.ok(!hasCalled, '调用错误，参数未达到要求个数便调用科里化函数')
    })
  })

  describe('partial: ', () => {
    function partialTest1(a1, a2, a3) {
      return [a1, a2, a3]
    }
    function partialTest2() {
      return []
    }
    it('首次调用传入初始参数，应返回 [1, 2, 3]', () => {
      const test = partial(partialTest1, 1, 2)
      deepEq(test(3), [1, 2, 3], '调用返回结果不正确')
    })
    it('首次调用无初始参数，应返回 [1, 2, 3]', () => {
      const test = partial(partialTest1)
      deepEq(test(1, 2, 3), [1, 2, 3], '调用返回结果不正确')
    })
    it('无参数，应返回 []', () => {
      const test = partial(partialTest2)
      deepEq(test(), [], '调用返回结果不正确')
    })
  })

})

















