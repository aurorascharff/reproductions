const React = require("react")

function readCurrentTime() {
  return new Date().toISOString()
}

exports.BlockingWidget = function BlockingWidget() {
  return React.createElement("time", null, readCurrentTime())
}
