'use strict';

const Promise = require('../lib/promise');

describe('Promise', () => {
  const delay = 100;
  let pendingFulfilledPromise;
  let pendingRejectedPromise;
  let fulfilledPromise;
  let rejectedPromise;

  beforeEach(() => {
    pendingFulfilledPromise = new Promise(resolve => {
      setTimeout(() => resolve(delay), delay);
    });

    pendingRejectedPromise = new Promise((resolve, reject) => {
      setTimeout(() => reject(delay), delay);
    });

    fulfilledPromise = new Promise(resolve => resolve(0));

    rejectedPromise = new Promise((resolve, reject) => reject(0));
  });

  describe('status', () => {
    describe('pending to fulfilled', () => {
      it('delay', () => {
        return pendingFulfilledPromise.should.be.fulfilled();
      });

      it('immediately', () => {
        return fulfilledPromise.should.be.fulfilled();
      });
    });


    describe('pending to rejected', () => {
      it('delay', () => {
        return pendingRejectedPromise.should.be.rejected();
      });

      it('immediately', () => {
        return rejectedPromise.should.be.rejected();
      });
    });
  });

  describe('#constructor', () => {
    it('must pass a parameter', () => {
      (() => new Promise()).should.throw();
    });

    it('should pass a parameter which is function', () => {
      (() => new Promise('param')).should.throw();
    });

    it('should be promise', () => {
      pendingFulfilledPromise.should.be.Promise();  // eslint-disable-line
      pendingRejectedPromise.should.be.Promise();   // eslint-disable-line
      fulfilledPromise.should.be.Promise();  // eslint-disable-line
      rejectedPromise.should.be.Promise();   // eslint-disable-line
    });
  });

  describe('#then', () => {
    describe('pending to fulfilled', () => {
      it(`delay, return the value is ${delay}`, () => {
        return pendingFulfilledPromise.then(value => {
          value.should.be.equal(delay);
        });
      });

      it('immediately, return the value is 0', () => {
        return fulfilledPromise.then(value => {
          value.should.be.equal(0);
        });
      });
    });

    describe('pending to rejected', () => {
      it(`delay, return the reason is ${delay}`, () => {
        return pendingRejectedPromise.then(() => {}, reason => {
          reason.should.be.equal(delay);
        });
      });

      it('immediately, return the reason is 0', () => {
        return rejectedPromise.then(() => {}, reason => {
          reason.should.be.equal(0);
        });
      });
    });
  });

  describe('#catch', () => {
    it(`delay, catch the reason is ${delay}`, () => {
      return pendingRejectedPromise.catch(reason => {
        reason.should.be.equal(delay);
      });
    });

    it('immediately, catch the reason is 0', () => {
      return rejectedPromise.catch(reason => {
        reason.should.be.equal(0);
      });
    });
  });

  describe('#then chain call', () => {
    describe('pending to fulfilled', () => {
      describe('delay', () => {
        it('not pass the value to next then', () => {
          return pendingFulfilledPromise.then(value => {
            value.should.be.equal(delay);
          }).then(value => {
            (value === undefined).should.be.true();
          });
        });

        it(`pass the value is ${delay} to next then`, () => {
          return pendingFulfilledPromise.then(value => {
            value.should.be.equal(delay);
            return delay;
          }).then(value => {
            value.should.be.equal(delay);
          });
        });

        describe('pass the Promise to next then', () => {
          it(`resolve Promise, the value is ${delay}`, () => {
            return pendingFulfilledPromise.then(value => {
              value.should.be.equal(delay);
              return new Promise(resolve => resolve(delay));
            }).then(value => {
              value.should.be.equal(delay);
            });
          });

          it(`rejected Promise, the reason is ${delay}`, () => {
            return pendingFulfilledPromise.then(value => {
              value.should.be.equal(delay);
              return new Promise((resolve, reject) => reject(delay));
            }).then(() => {}, reason => {
              reason.should.be.equal(delay);
            });
          });
        });
      });

      describe('immediately', () => {
        it('not pass the value to next then', () => {
          return fulfilledPromise.then(value => {
            value.should.be.equal(0);
          }).then(value => {
            (value === undefined).should.be.true();
          });
        });

        it('pass the value is 0 to next then', () => {
          return fulfilledPromise.then(value => {
            value.should.be.equal(0);
            return 0;
          }).then(value => {
            value.should.be.equal(0);
          });
        });

        describe('pass the Promise to next then', () => {
          it('resolve Promise', () => {
            return fulfilledPromise.then(value => {
              value.should.be.equal(0);
              return new Promise(resolve => resolve(0));
            }).then(value => {
              value.should.be.equal(0);
            });
          });

          it('rejected Promise', () => {
            return fulfilledPromise.then(value => {
              value.should.be.equal(0);
              return new Promise((resolve, reject) => reject(0));
            }).then(() => {}, reason => {
              reason.should.be.equal(0);
            });
          });
        });
      });
    });

    describe('pending to rejected', () => {
      describe('delay', () => {
        it('not pass the value to next then', () => {
          return pendingRejectedPromise.then(() => {}, reason => {
            reason.should.be.equal(delay);
          }).then(value => {
            (value === undefined).should.be.true();
          });
        });

        it(`pass the value is ${delay} to next then`, () => {
          return pendingRejectedPromise.then(() => {}, reason => {
            reason.should.be.equal(delay);
            return delay;
          }).then(value => {
            value.should.be.equal(delay);
          });
        });

        describe('pass the Promise to next then', () => {
          it(`resolve Promise, the value is ${delay}`, () => {
            return pendingRejectedPromise.then(() => {}, reason => {
              reason.should.be.equal(delay);
              return new Promise(resolve => resolve(delay));
            }).then(value => {
              value.should.be.equal(delay);
            });
          });

          it(`rejected Promise, the reason is ${delay}`, () => {
            return pendingRejectedPromise.then(() => {}, reason => {
              reason.should.be.equal(delay);
              return new Promise((resolve, reject) => reject(delay));
            }).then(() => {}, reason => {
              reason.should.be.equal(delay);
            });
          });
        });
      });

      describe('immediately', () => {
        it('not pass the value to next then', () => {
          return rejectedPromise.then(() => {}, reason => {
            reason.should.be.equal(0);
          }).then(value => {
            (value === undefined).should.be.true();
          });
        });

        it('pass the value is 0 to next then', () => {
          return rejectedPromise.then(() => {}, reason => {
            reason.should.be.equal(0);
            return 0;
          }).then(value => {
            value.should.be.equal(0);
          });
        });

        describe('pass the Promise to next then', () => {
          it('resolve Promise', () => {
            return rejectedPromise.then(() => {}, reason => {
              reason.should.be.equal(0);
              return new Promise(resolve => resolve(0));
            }).then(value => {
              value.should.be.equal(0);
            });
          });

          it('rejected Promise', () => {
            return rejectedPromise.then(() => {}, reason => {
              reason.should.be.equal(0);
              return new Promise((resolve, reject) => reject(0));
            }).then(() => {}, reason => {
              reason.should.be.equal(0);
            });
          });
        });
      });
    });
  });

  describe('#then #catch combination call', () => {
    it('#then catch the reason, #catch cann\'t catch', () => {
      return pendingRejectedPromise.then(() => {}, reason => {
        reason.should.be.equal(delay);
      }).catch(() => {
        (true).should.fail();
      });
    });

    it('#then cann\'t catch, #catch the reason', () => {
      return pendingRejectedPromise.then().catch(reason => {
        reason.should.be.equal(delay);
      });
    });
  });
});
