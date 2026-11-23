'use client'
const React = require('react')
exports.ClientClock = function ClientClock() {
  return React.createElement('time', { 'data-client-clock': true }, Date.now())
}
