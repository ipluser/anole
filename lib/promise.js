'use strict';

const utils = require('./utils');
const isFunction = utils.isFunction;

const STATUS = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected'
};

const SYMBOL_STATUS = Symbol('status');
const SYMBOL_DATA = Symbol('data');
const SYMBOL_RESOLVE_VALUE = Symbol('resolveValue');
const SYMBOL_FULFILLED_CALLBACK = Symbol('fulfilledCallback');
const SYMBOL_REJECTED_CALLBACK = Symbol('rejectedCallback');

class Promise {
  constructor(executor) {
    if (!isFunction(executor)) {
      throw Error(`Promise executor ${executor} is not a function`);
    }

    const self = this;
    const status = self[SYMBOL_STATUS] = STATUS.PENDING;

    self[SYMBOL_FULFILLED_CALLBACK] = undefined;
    self[SYMBOL_REJECTED_CALLBACK] = undefined;
    self[SYMBOL_DATA] = undefined;

    function resovle(value) {
      const fulfilledCallback = self[SYMBOL_FULFILLED_CALLBACK];

      if (status === STATUS.PENDING) {
        self[SYMBOL_STATUS] = STATUS.FULFILLED;
        self[SYMBOL_DATA] = value;

        if (isFunction(fulfilledCallback)) {
          setTimeout(() => {
            fulfilledCallback(value);
          });
        }
      }
    }

    function reject(reason) {
      const rejectedCallback = self[SYMBOL_REJECTED_CALLBACK];

      if (status === STATUS.PENDING) {
        self[SYMBOL_STATUS] = STATUS.REJECTED;
        self[SYMBOL_DATA] = reason;

        if (isFunction(rejectedCallback)) {
          setTimeout(() => {
            rejectedCallback(reason);
          });
        }
      }
    }

    try {
      executor(resovle, reject);
    } catch (err) {
      reject(err);
    }
  }

  [SYMBOL_RESOLVE_VALUE](value, resolve, reject) {
    if (value instanceof Promise) {
      value.then(resolve, reject);
      return;
    }

    resolve(value);
  }

  then(onFulfilled, onRejected) {  // eslint-disable-line consistent-return
    const self = this;
    const status = self[SYMBOL_STATUS];
    const data = self[SYMBOL_DATA];
    const resolveValue = self[SYMBOL_RESOLVE_VALUE];
    const fulfilledCallback = isFunction(onFulfilled)
        ? onFulfilled
        : function returnFunc(value) { return value; };
    const rejectedCallback = isFunction(onRejected)
        ? onRejected
        : function throwFunc(reason) { throw reason; };

    if (status === STATUS.PENDING) {
      return new Promise((resolve, reject) => {
        self[SYMBOL_FULFILLED_CALLBACK] = value => {
          try {
            const newValue = fulfilledCallback(value);
            resolveValue(newValue, resolve, reject);
          } catch (err) {
            reject(err);
          }
        };

        self[SYMBOL_REJECTED_CALLBACK] = reason => {
          try {
            const newReason = rejectedCallback(reason);
            resolveValue(newReason, resolve, reject);
          } catch (err) {
            reject(err);
          }
        };
      });
    }

    if (status === STATUS.FULFILLED) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const newValue = fulfilledCallback(data);
            resolveValue(newValue, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      });
    }

    if (status === STATUS.REJECTED) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const newReason = rejectedCallback(data);
            resolveValue(newReason, resolve, reject);
          } catch (err) {
            reject(err);
          }
        });
      });
    }
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

module.exports = Promise;
