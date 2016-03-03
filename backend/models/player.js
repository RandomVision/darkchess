
var utils = require('../lib/utils.js')

function Player (opts) {
  var self = this

  self.name = opts.name
  self.socketId = opts.socketId
  self.role = null
}

module.exports = Player