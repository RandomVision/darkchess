
var _ = require('lodash')
var gameManager = require('../services/game-manager.js')
var Player = require('../models/player.js')
var EventBus = require('../lib/event-bus.js')
var Fof = require('../services/fogOfWar.js')

module.exports = function (io) {
  var namespaces = {}
  EventBus.on('game.new', function (game) {
    namespaces[game.hid] = io.of('/'+game.hid)
    initSocket(game.hid, namespaces[game.hid])
  })
  EventBus.on('game.destroy', function (game) {
    namespaces[game.hid] = null
  })
}

function initSocket (ghid, io) {
  var connectedClients = 0

  var game = gameManager.find(ghid)

  console.log('init ' + ghid, game)

  io.on('connection', function (socket) {
    console.log(ghid, 'connection')
    var player = null

    connectedClients += 1
    console.log(connectedClients)
    console.log(socket.id)
    
    if (connectedClients <= 2) {
      player = new Player({
        socketId: socket.id,
        name: 'player'
      })
      game.addPlayer(player)
      console.log(player.role)
      socket.emit('game.player', { player: player })
    }

    if (connectedClients == 2) {
      game.start()
      if (player.role === 'w') {
        socket.emit('game.canstart', { fen: game.fen(), fog: Fof.calculateWhiteFogFen(game.engine) })
        socket.broadcast.emit('game.canstart', { fen: game.fen(), fog: Fof.calculateBlackFogFen(game.engine) })
      } else {
        socket.emit('game.canstart', { fen: game.fen(), fog: Fof.calculateBlackFogFen(game.engine) })
        socket.broadcast.emit('game.canstart', { fen: game.fen(), fog: Fof.calculateWhiteFogFen(game.engine) })
      }
    }

    socket.on('game.move', function (move) {
      // game.engine exists only if game has begun
      if (game.engine) {
        console.log(socket.id, 'move', move)
        console.log(player.role == game.engine.turn())
        console.log(game.engine.game_over())
        console.log(game.engine.moves())
        if (player.role == game.engine.turn()) {
          if (!game.engine.game_over()) {
            // random guy vs random guy
            var moves = game.engine.moves()
            // var move = moves[Math.floor(Math.random() * moves.length)]
            var san = move.san.replace('#', '')
            console.log(san, _.includes(moves, san))
            if (game.isValidMove(san)) {
              game.engine.move(san)
              socket.broadcast.emit('board.update', { fen: game.fen(), fog: Fof.calculateFogFen(game.engine) })
              // io.emit('board.update', { fen: game.fen(), fog: game.fogOfWar() })
              if (game.engine.turn() === 'w') {
                socket.emit('board.update', { fen: game.fen(), fog: Fof.calculateBlackFogFen(game.engine) })
              } else {
                socket.emit('board.update', { fen: game.fen(), fog: Fof.calculateWhiteFogFen(game.engine) })
              }
              console.log(game.engine.ascii())
            } else {
              socket.emit('move.invalid')
            }
          }
        } 
      }


    })
    
    socket.on('disconnect', function(){
      connectedClients -= 1
      console.log(socket.id + ' disconnected')
      game.removePlayer(player)
      if (connectedClients == 0) {
        EventBus.emit('game.destroy', game)
      }
    })
  })
}