// A dependency with a synchronous clock read, like an SDK checking token expiry.
exports.readClock = function readClock() {
  return Date.now()
}
exports.ClockWidget = function ClockWidget() {
  return require('react').createElement('time', null, exports.readClock())
}
