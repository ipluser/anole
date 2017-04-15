import { isFunction, isArray } from '../common/utils'

const STATUS = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
}

const SYMBOL_STATUS = Symbol('status')
const SYMBOL_DATA = Symbol('data')
const SYMBOL_RESOLVE_VALUE = Symbol('resolveValue')
const SYMBOL_FULFILLED_CALLBACK = Symbol('fulfilledCallback')
const SYMBOL_REJECTED_CALLBACK = Symbol('rejectedCallback')

const returnFunc = value => value
const throwFunc = (reason) => { throw reason }

class Promise {
  constructor(executor) {
    if (!isFunction(executor)) {
      throw new Error(`Promise executor ${executor} is not a function`)
    }

    const self = this

    self[SYMBOL_STATUS] = STATUS.PENDING
    self[SYMBOL_FULFILLED_CALLBACK] = undefined
    self[SYMBOL_REJECTED_CALLBACK] = undefined
    self[SYMBOL_DATA] = undefined

    const resovle = (value) => {
      const fulfilledCallback = self[SYMBOL_FULFILLED_CALLBACK]

      if (self[SYMBOL_STATUS] === STATUS.PENDING) {
        self[SYMBOL_STATUS] = STATUS.FULFILLED
        self[SYMBOL_DATA] = value

        if (isFunction(fulfilledCallback)) {
          setTimeout(() => {
            fulfilledCallback(value)
          })
        }
      }
    }

    const reject = (reason) => {
      const rejectedCallback = self[SYMBOL_REJECTED_CALLBACK]

      if (self[SYMBOL_STATUS] === STATUS.PENDING) {
        self[SYMBOL_STATUS] = STATUS.REJECTED
        self[SYMBOL_DATA] = reason

        if (isFunction(rejectedCallback)) {
          setTimeout(() => {
            rejectedCallback(reason)
          })
        }
      }
    }

    try {
      executor(resovle, reject)
    } catch (err) {
      reject(err)
    }
  }

  then(onFulfilled, onRejected) {  // eslint-disable-line consistent-return
    const self = this
    const status = self[SYMBOL_STATUS]
    const data = self[SYMBOL_DATA]
    const resolveValue = Promise[SYMBOL_RESOLVE_VALUE]
    const fulfilledCallback = isFunction(onFulfilled)
        ? onFulfilled
        : returnFunc
    const rejectedCallback = isFunction(onRejected)
        ? onRejected
        : throwFunc

    if (status === STATUS.PENDING) {
      return new Promise((resolve, reject) => {
        self[SYMBOL_FULFILLED_CALLBACK] = (value) => {
          try {
            const newValue = fulfilledCallback(value)
            resolveValue(newValue, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }

        self[SYMBOL_REJECTED_CALLBACK] = (reason) => {
          try {
            const newReason = rejectedCallback(reason)
            resolveValue(newReason, resolve, reject)
          } catch (err) {
            reject(err)
          }
        }
      })
    }

    if (status === STATUS.FULFILLED) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const newValue = fulfilledCallback(data)
            resolveValue(newValue, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      })
    }

    if (status === STATUS.REJECTED) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const newReason = rejectedCallback(data)
            resolveValue(newReason, resolve, reject)
          } catch (err) {
            reject(err)
          }
        })
      })
    }
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }

  static [SYMBOL_RESOLVE_VALUE](value, resolve, reject) {
    if (value instanceof Promise) {
      value.then(resolve, reject)
      return
    }

    resolve(value)
  }

  static reject(reason) {
    return new Promise((resovle, reject) => {
      reject(reason)
    })
  }

  static resolve(value) {
    if (value instanceof Promise) {
      return value
    }

    return new Promise((resovle) => {
      resovle(value)
    })
  }

  static race(values) {
    if (!isArray(values)) {
      return Promise.reject(new Error('Promise.race must be provided an Array'))
    }

    return new Promise((resovle, reject) => {
      values.forEach((value) => {
        Promise.resolve(value).then(resovle, reject)
      })
    })
  }

  static all(values) {
    if (!isArray(values)) {
      return Promise.reject(new Error('Promise.all must be provided an Array'))
    }

    return new Promise((resolve, reject) => {
      if (values.length === 0) {
        resolve([])
        return
      }

      const len = values.length
      const result = new Array(len)
      let remaining = len

      const doResolve = (index, value) => {
        Promise.resolve(value).then((val) => {
          result[index] = val
          remaining -= 1

          if (remaining === 0) {
            resolve(result)
          }
        }, reject)
      }

      for (let i = 0; i < len; i += 1) {
        doResolve(i, values[i])
      }
    })
  }
}

export default Promise
