
var utils = require('../lib/utils.js')

var Chess = require('chess.js').Chess

function Game (opts) {
  var self = this

  self.id = opts.id
  self.hid = utils.hashids.encode(opts.id)

  self.players = {
    white: null,
    black: null
  }
}

Game.prototype.addPlayer = function addPlayer (player) {
  var self = this

  if (!self.players.white) {
    player.role = 'w'
    self.players.white = player
  } else if (!self.players.black) {
    player.role = 'b'
    self.players.black = player
  } else {
    console.log('no more players for play ' + self.hid)
  }
}

Game.prototype.canStart = function canStart () {
  var self = this

  return !!(self.players.white && self.players.black)
}

Game.prototype.fogOfWar = function fogOfWar () {
  var self = this

  return self.engine.fen()
}

Game.prototype.start = function start () {
  var self = this

  if (!self.engine) {
    self.engine = new Chess()
  }

  return self
}

module.exports = Game