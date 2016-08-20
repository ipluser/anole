const expect = require('chai').expect;
const Promise = require('../lib/promise');

describe('Promise', () => {
  describe('#constructor', () => {
    it('must pass a parameter', () => {
      expect(() => {
        new Promise()
      }).to.throw(Error);
    });

    it('should pass a parameter which is function', () => {
      expect(() => {
        new Promise('promise')
      }).to.throw(Error);
    });
  });
});
