'use strict';

const utils = require('./utils');
const isFunction = utils.isFunction;

const STATUS = {
  PENDING: Symbol('pending'),
  FULFILLED: Symbol('fulfilled'),
  REJECTED: Symbol('rejected')
};

class Promise {
  constructor(executor) {
    const self = this;
    const status = self.status = STATUS.PENDING;

    self.fulfilledCallback = undefined;
    self.rejectedCallback = undefined;
    self.data = undefined;

    function resovle(value) {
      const fulfilledCallback = self.fulfilledCallback;

      if (status === STATUS.PENDING) {
        self.status = STATUS.FULFILLED;
        self.data = value;

        if (isFunction(fulfilledCallback)) {
          setTimeout(() => {
            fulfilledCallback(value);
          });
        }
      }
    }

    function reject(reason) {
      const rejectedCallback = self.rejectedCallback;

      if (status === STATUS.PENDING) {
        self.data = reason;
        self.status = STATUS.REJECTED;

        if (isFunction(rejectedCallback)) {
          setTimeout(() => {
            rejectedCallback(reason);
          });
        }
      }
    }

    try {
      isFunction(executor) && executor(resovle, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    const self = this;
    const status = self.status;
    const _onFulfilled = isFunction(onFulfilled) ? onFulfilled : function (value) { return value; };
    const _onRejected = isFunction(onRejected) ? onRejected : function (reason) { throw reason; }

    if (status === STATUS.PENDING) {
      return new Promise((resolve, reject) => {
        self.fulfilledCallback = value => {
          try {
            const newValue = _onFulfilled(value);
            handle(newValue, resolve, reject);
          } catch (err) {
            reject(err);
          }
        };

        self.rejectedCallback = reason => {
          try {
            const newReason = _onRejected(reason);
            handle(newReason, resolve, reject);
          } catch (err) {
            reject(err);
          }
        };
      });
    }

    if(status === STATUS.FULFILLED) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const newValue = _onFulfilled(self.data);
            handle(newValue, resolve, reject);
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
            const newReason = _onRejected(self.data);
            handle(newReason, resolve, reject);
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
};

function handle(value, resolve, reject) {
  if (value instanceof Promise) {
    value.then(resolve, reject);
    return;
  }

  resolve(value);
}

module.exports = Promise;
