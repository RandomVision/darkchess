window.board = null
window.game = new Chess()

var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);
  
  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  squareEl.css('background', background);
};

var onDragStart = function(source, piece) {
  // do not pick up pieces if the game is over
  // or if it's not that side's turn
  console.log(player)
  console.log(game.game_over())
  console.log(piece.search(/^w/) !== -1)

  // if (player.role === 'w')


  if (game.game_over() === true ||
      (player.role === 'w' && piece.search(/^b/) !== -1) ||
      (player.role === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  } 
};

var onDrop = function(source, target) {
  removeGreySquares();

  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  });
  
  console.log(move)

  // illegal move
  if (move === null) return 'snapback';

  window.socket.emit('game.move', move)
};

var onMouseoverSquare = function(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  greySquare(square);

  // highlight the possible squares for this piece
  for (var i = 0; i < moves.length; i++) {
    greySquare(moves[i].to);
  }
};

var onMouseoutSquare = function(square, piece) {
  removeGreySquares();
};

var onSnapEnd = function() {
  board.position(game.fen());
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  // onMouseoutSquare: onMouseoutSquare,
  // onMouseoverSquare: onMouseoverSquare,
  // onSnapEnd: onSnapEnd
};
window.board = ChessBoard('board', cfg);