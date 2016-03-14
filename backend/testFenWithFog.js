
var _ = require('lodash')
var Chess = require('chess.js').Chess

var game = new Chess()

// console.log(game.fen())
// console.log(game.turn())
// console.log(game.ascii())

// implementation 3 ############################################################

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

  this.rows = {
    '8': [],
    '7': [],
    '6': [],
    '5': [],
    '4': [],
    '3': [],
    '2': [],
    '1': [],
  }

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

  this.calculateFen = function calculateFen () {
    var self = this
    var fen = ''
    var moves = _.uniq(_.map(self.game.moves({ verbose: true }), function(move) { return move.to }))
    var turn = self.game.turn()

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

// var b = Board(game)
// console.log(b.calculateFen())
// console.log(game.validate_fen(b.fen))
// 
/*
  Castling availability SHOULD BE REMOVED
 */

console.log('ascii\n', game.ascii())
console.log('fog fen', Board(game).calculateFen())
console.log('whoami', game.turn())
console.log(Chess(Board(game).calculateFen()).ascii())

while (!game.game_over()) {
  var moves = game.moves()
  var move = moves[Math.floor(Math.random() * moves.length)]
  game.move(move)
  console.log('ascii\n', game.ascii())
  console.log('fog fen', Board(game).calculateFen())
  console.log('whoami', game.turn())
  console.log(Chess(Board(game).calculateFen()).ascii())
}

 

// implementation 2 ############################################################
// if (game.turn() === 'w') {
//   // get all moves without san ( that game.moves() returns )
//   var moves = _.uniq(_.map(game.moves({ verbose: true }), function(move) { return move.to }))
//   console.log(moves)
//   console.log()

//   var withFog = _.map(moves, function (move) { return { type: null, color: game.turn(), position: move }})

//   // remove all lowercase letters with position is not in moves
//   _.each(['a','b','c','d','e','f','g','h'], function (col) {
//     _.each([1,2,3,4,5,6,7,8], function (row) {
//       var boardPosition = col+row
//       console.log(boardPosition, game.get(boardPosition))
//       if (game.get(boardPosition) && game.get(boardPosition).color === game.turn()) {
//         var gg = game.get(boardPosition)
//         gg.position = boardPosition
//         withFog.push(gg)
//       }
//     })
//   })

//   withFog = _.sortBy(_.uniq(withFog), 'position')
//   console.log(withFog)
// }

// implementation 1 ############################################################
// var rows = fen.split(' ')[0].split('/')
// console.log(rows)

// _.each(rows, function (row) {
//   var positions = row.split('')
//   positions = _.map(positions, function (position) {
//     console.log(position)
//     if (position.match(/[a-z]/)) {
//       // lowercase means black player
//       if (game.turn() === 'w') {
//         return '-'
//       }
//     }
//     if (position.match(/[A-Z]/)) {
//       if (game.turn() === 'b')
//         return '-'
//     }
//   })
//   console.log(positions)
// })