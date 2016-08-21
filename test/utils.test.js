'use strict';

const Utils = require('../lib/utils');

describe('Utils', () => {
  describe('#isFunction', () => {
    it('should be true', () => {
      (Utils.isFunction(() => {})).should.be.true();
    });

    it('should be false', () => {
      (Utils.isFunction()).should.be.false();
      (Utils.isFunction(null)).should.be.false();
      (Utils.isFunction(100)).should.be.false();
      (Utils.isFunction('100')).should.be.false();
      (Utils.isFunction({})).should.be.false();
      (Utils.isFunction([])).should.be.false();
    });
  });
});
