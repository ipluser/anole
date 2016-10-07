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
      (Utils.isFunction(undefined)).should.be.false();
      (Utils.isFunction(0)).should.be.false();
      (Utils.isFunction('0')).should.be.false();
      (Utils.isFunction({})).should.be.false();
      (Utils.isFunction([])).should.be.false();
    });
  });

  describe('#isArray', () => {
    it('should be true', () => {
      (Utils.isArray([])).should.be.true();
      (Utils.isArray(Array(1, 2))).should.be.true();  // eslint-disable-line no-array-constructor
    });

    it('should be false', () => {
      (Utils.isArray()).should.be.false();
      (Utils.isArray(null)).should.be.false();
      (Utils.isArray(null)).should.be.false();
      (Utils.isArray(0)).should.be.false();
      (Utils.isArray('0')).should.be.false();
      (Utils.isArray({})).should.be.false();
      (Utils.isArray(() => {})).should.be.false();
    });
  });
});
