import chai from 'chai'

import {
  toStringEqual,
  isFunction,
  isArray,
} from '../../src/common/utils'

chai.should()

describe('Utils', () => {
  describe('#toStringEqual', () => {
    it('should be equal to "[object Null]"', () => {
      toStringEqual(null, '[object Null]').should.be.true
    })

    it('should be equal to "[object Undefined]"', () => {
      toStringEqual(undefined, '[object Undefined]').should.be.true
    })

    it('should be equal to "[object Boolean]"', () => {
      toStringEqual(true, '[object Boolean]').should.be.true
      toStringEqual(false, '[object Boolean]').should.be.true
      toStringEqual(Boolean(true), '[object Boolean]').should.be.true
      toStringEqual(Boolean(false), '[object Boolean]').should.be.true
    })

    it('should be equal to "[object Number]"', () => {
      toStringEqual(0, '[object Number]').should.be.true
      toStringEqual(1.1, '[object Number]').should.be.true
      toStringEqual(Number(0), '[object Number]').should.be.true
      toStringEqual(Number(1.1), '[object Number]').should.be.true
    })

    it('should be equal to "[object String]"', () => {
      toStringEqual('', '[object String]').should.be.true
      toStringEqual(String(''), '[object String]').should.be.true
    })

    it('should be equal to "[object Object]"', () => {
      toStringEqual({}, '[object Object]').should.be.true
      toStringEqual(Object(), '[object Object]').should.be.true
    })

    it('should be equal to "[object Function]"', () => {
      toStringEqual(() => {}, '[object Function]').should.be.true
    })
  })

  describe('#isFunction', () => {
    it('should be true', () => {
      isFunction(() => {}).should.be.true
    })

    it('should be false', () => {
      isFunction().should.be.false
      isFunction(null).should.be.false
      isFunction(undefined).should.be.false
      isFunction(0).should.be.false
      isFunction('0').should.be.false
      isFunction({}).should.be.false
      isFunction([]).should.be.false
    })
  })

  describe('#isArray', () => {
    it('should be true', () => {
      isArray([]).should.be.true
      isArray(Array(1, 2)).should.be.true  // eslint-disable-line no-array-constructor
    })

    it('should be false', () => {
      isArray().should.be.false
      isArray(null).should.be.false
      isArray(null).should.be.false
      isArray(0).should.be.false
      isArray('0').should.be.false
      isArray({}).should.be.false
      isArray(() => {}).should.be.false
    })
  })
})
