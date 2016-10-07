const OBJECT_PROTO = Object.prototype;
const TO_STRING = OBJECT_PROTO.toString;

module.exports = {
  isFunction(obj) {
    return TO_STRING.call(obj) === '[object Function]';
  },

  isArray(obj) {
    return TO_STRING.call(obj) === '[object Array]';
  }
};
