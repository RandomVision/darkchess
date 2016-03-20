
var utils = require('../lib/utils.js')
var Board = require('../services/fogOfWar.js')

var _ = require('lodash')
var Chess = require('chess.js').Chess

function Game (opts) {
  var self = this

  self.id = opts.id
  self.hid = utils.hashids.encode(opts.id)

  self.engine = null

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

Game.prototype.removePlayer = function removePlayer (player) {
  var self = this

  if (player.role) {
    if (player.role === 'w') {
      self.players.white = null
    } else if (player.role === 'b') {
      self.players.black = null
    }
  }
}

Game.prototype.canStart = function canStart () {
  var self = this

  return !!(self.players.white && self.players.black)
}

Game.prototype.fen = function fen () {
  var self = this
  return self.engine.fen()
}

Game.prototype.fogOfWar = function fogOfWar () {
  var self = this
  var board = Board(self.engine)
  return board.calculateFen()
}

Game.prototype.start = function start () {
  var self = this

  if (!self.engine) {
    self.engine = new Chess()
  }

  return self
}

Game.prototype.isValidMove = function isValidMove (move) {
  var self = this
  var moves = self.engine.moves()

  moves = _.map(moves, function (m) { return m.replace('#', '').replace('+', '') })
  return _.includes(moves, move)
}

module.exports = Game