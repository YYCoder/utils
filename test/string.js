const assert = require('assert')
const {
  trim,
  trimLeft,
  trimRight
} = require('../src/util')

describe('字符串方法：', () => {
  describe('trim: ', () => {
    const rawInputs = [' a ', 'a ', ' a', '  a  ']

    rawInputs.forEach(input => {
      it('默认替换空格，应返回a', () => {
        assert.strictEqual('a', trim(input), '未能替换空格')
      })
    })
    it('指定要替换的字符\\n，应返回a', () => {
      assert.strictEqual('a', trim('\na\n', '\n'), '未能替换字符串"\n"')
    })
    it('指定要替换的字符haha，应返回a', () => {
      assert.strictEqual('a', trim('hahaahaha', 'haha'), '未能替换字符串"haha"')
    })
    it('没有指定要替换的字符，原样返回a', () => {
      assert.strictEqual('a', trim('a'), '未能原样返回a')
    })
  })

  describe('trimLeft: ', () => {
    it('默认替换左侧空格，应返回a', () => {
      assert.strictEqual('a', trimLeft('  a'))
    })
    it('指定替换左侧字符haha，应返回a', () => {
      assert.strictEqual('a', trimLeft('hahaa', 'haha'), '未能替换字符"haha"')
    })
    it('指定替换左侧字符\\n，应返回a', () => {
      assert.strictEqual('a', trimLeft('\n\na', '\n'), '未能替换字符"\n"')
    })
  })

  describe('trimRight: ', () => {
    it('默认替换右侧空格，应返回a', () => {
      assert.strictEqual('a', trimRight('a  '))
    })
    it('指定替换右侧字符haha，应返回a', () => {
      assert.strictEqual('a', trimRight('ahaha', 'haha'), '未能替换字符"haha"')
    })
    it('指定替换右侧字符\\n，应返回a', () => {
      assert.strictEqual('a', trimRight('a\n\n', '\n'), '未能替换字符"\n"')
    })
  })
})




