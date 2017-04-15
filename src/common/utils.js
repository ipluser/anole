const OBJECT_PROTO = Object.prototype
const TO_STRING = OBJECT_PROTO.toString

export const toStringEqual = (obj, str) => TO_STRING.call(obj) === str

export const isFunction = obj => toStringEqual(obj, '[object Function]')

export const isArray = obj => toStringEqual(obj, '[object Array]')
