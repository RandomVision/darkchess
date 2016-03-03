
var _ = require('lodash')
var Game = require('../models/game.js')
var Player = require('../models/player.js')
var EventBus = require('../lib/event-bus.js')
var utils = require('../lib/utils.js')

function GameManager () {
  var self = this
  self.games = []

  EventBus.on('game.destroy', function (game) {
    self.games = _.without(self.games, game)
    if (game.engine) {
      console.log(game.hid, game.engine.pgn())
      utils.storage.setItemSync('game-'+game.hid+'-'+Date.now(), game.engine.pgn())
      console.log(utils.storage.keys(), utils.storage.values())
    }
  })
}

GameManager.prototype.newGame = function newGame () {
  var self = this

  var game = new Game({
    id: self.games.length,
    white: null,
    black: null,
  })
  self.games.push(game)
  EventBus.emit('game.new', game)

  return game
}

GameManager.prototype.find = function find (gameHid) {
  var self = this
  
  return _.find(self.games, { hid: gameHid })
}

module.exports = new GameManager()