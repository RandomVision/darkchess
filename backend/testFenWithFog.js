
var _ = require('lodash')
var Chess = require('chess.js').Chess

var game = new Chess()

// console.log(game.fen())
// console.log(game.turn())
// console.log(game.ascii())

// implementation 3 ############################################################

var Fof = require('./services/fogOfWar.js')

// var b = Board(game)
// console.log(b.calculateFen())
// console.log(game.validate_fen(b.fen))
// 
/*
  Castling availability SHOULD BE REMOVED
 */

function printStatus (game) {
  console.log('ascii')
  console.log(game.ascii())
  console.log('fog fen', Fof.calculateFogFen(game))
  console.log('whoami', game.turn())
  console.log(Chess(Fof.calculateFogFen(game)).ascii())
  console.log(Chess(Fof.calculateOppositeFogFen(game)).ascii())
}

printStatus(game)
console.log('==================================================')

game.move('e4')
printStatus(game)
console.log('==================================================')

game.move('f5')
printStatus(game)
console.log('==================================================')

// var index = 0
// while (!game.game_over() && index < 10) {
//   var moves = game.moves()
//   var move = moves[Math.floor(Math.random() * moves.length)]
//   game.move(move)
//   console.log('ascii\n', game.ascii())
//   console.log('fog fen', Fof.calculateFogFen(game))
//   console.log('whoami', game.turn())
//   console.log(Chess(Fof.calculateFogFen(game)).ascii())
//   index += 1
// }

 

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