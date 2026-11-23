// A dependency with a synchronous clock read, like an SDK checking token expiry.
exports.readClock = function readClock() {
  return Date.now()
}
exports.ClockWidget = function ClockWidget() {
  return require('react').createElement('time', null, exports.readClock())
}
exports.readRandom = function readRandom() {
  return Math.random()
}
exports.readUUID = function readUUID() {
  return crypto.randomUUID()
}
