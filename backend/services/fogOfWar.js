var _ = require('lodash')

var BoardPosition = function BoardPosition (type, color, position) {
  this.type = type
  this.color = color
  this.position = position

  this.isVisible = function isVisible (moves, player) {
    if (_.includes(moves, this.position)) return true
    if (this.color === player) return true
    return false
  }

  return this
}

var Board = function Board (game) {
  this.game = game

  this.fen = game.fen().split(' ').slice(1)

  this.rows = { '8': [], '7': [], '6': [], '5': [], '4': [], '3': [], '2': [], '1': [] }

  function fillRows() {
    var self = this
    _.each(['a','b','c','d','e','f','g','h'], function (col) {
      _.each(['1','2','3','4','5','6','7','8'].reverse(), function (row) {
        var position = col+row
        // console.log(position)
        if (game.get(position))
          self.rows[row].push(new BoardPosition(game.get(position).type, game.get(position).color, position))
        else
          self.rows[row].push(new BoardPosition(null, null, position))
      })
    })
  }
  fillRows()

  this.calculateFen = function calculateFen (turn) {
    var self = this
    var fen = ''
    var moves = _.uniq(_.map(self.game.moves({ verbose: true }), function(move) { return move.to }))
    var turn = _.isUndefined(turn) ? self.game.turn() : turn

    _.each(_.values(self.rows), function (row) {
      _.each(row, function (position) {
        if (position.isVisible(moves, turn) && position.color) {
          fen += position.color === 'w' ? position.type.toUpperCase() : position.type.toLowerCase()
        } else {
          fen += '1'
        }
      })
      fen += '/'
    })

    fen = _(fen).split('/').reverse().join('/').slice(1)

    var index = 0
    while (index != fen.length-1) {
      if (fen[index].match(/[1-7]/) && fen[index+1] === '1') {
        fen = fen.slice(0, index) + (parseInt(fen[index], 10) + 1) + fen.slice(index+2)
      }
      else 
        index += 1
    }
    
    // compat fen creating a valid FEN string
    self.fen.unshift(fen)
    self.fen = self.fen.join(' ')
    return self.fen
  }

  return this
}


module.exports = {
  calculateFogFen: function (game) {
    return Board(game).calculateFen()
  },
  calculateOppositeFogFen: function (game) {
    if (game.turn() === 'w') {
      return Board(game).calculateFen('b')
    } else {
      return Board(game).calculateFen('w')
    }
  },
  calculateWhiteFogFen: function (game) {
    return Board(game).calculateFen('w')
  },
  calculateBlackFogFen: function (game) {
    return Board(game).calculateFen('b')
  }
}
