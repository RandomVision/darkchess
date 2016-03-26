function getResponseFromServer(data_to_send) {
    $.ajax({
	type: 'CHESS',
	url: window.location.href+data_to_send,
	timeout: 15000,
	success: function(data) {
		data=data.split("#");
		board.position(data[0]);
		actual_turn=data[1]
		whoami=data[2]
	},
	error: function(XMLHttpRequest, textStatus, errorThrown) {}
	})
}


var board
var whoami="w"
var actual_turn="w"

var removeGreySquares = function() {
  $('#board .square-55d63').css('background', '');
};

var greySquare = function(square) {
  var squareEl = $('#board .square-' + square);
  
  var background = '#a9a9a9';
  if (squareEl.hasClass('black-3c85d') === true) {
    background = '#696969';
  }

  if (actual_turn===whoami){
    background = '#b0c4de';
    if (squareEl.hasClass('black-3c85d') === true) {
      background = '#6495ed';
    }
  }

  squareEl.css('background', background);
};

var onDragStart = function(source, piece) {
  // do not pick up pieces if the game is over
  // or if it's not that side's turn
  if (piece==="fog"){
    return false;
  }
  if (actual_turn === "gameover" ||
      (whoami === 'w' && piece.search(/^b/) !== -1) ||
      (whoami === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
};

var onDrop = function(source, target) {
  response = getResponseFromServer(source+"."+target);
  
  removeGreySquares();  

};

var onMouseoverSquare = function(square, piece) {
/*
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true
  });
*/
moves=0;
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
};

var cfg = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
};
board = ChessBoard('board', cfg);

window.setInterval(function(){
  $.ajax({
  type: 'CHESS',
  url: window.location.href+"update",
  timeout: 15000,
  success: function(data) {
    data=data.split("#");
    board.position(data[0]);
    actual_turn=data[1]
    whoami=data[2]
    if (whoami==="w"){
      board.orientation("white");
    }
    else if (whoami==="b"){
      board.orientation("black");
    }
    
    if (actual_turn===whoami){
      $('#turno').html("E' il tuo turno!");
    }
    else{
      $('#turno').html("E' il turno avversario..."); 
    }
    mangiati=[]
    for (var temp in data[3]){
      if (data[3][temp]==data[3][temp].toUpperCase()){
        mangiati.push("w"+data[3][temp])
      }
      else{
       mangiati.push("b"+data[3][temp].toUpperCase()) 
      }
    }
    
    ChessBoard.mangiati(mangiati)
  },
  error: function(XMLHttpRequest, textStatus, errorThrown) {}
  })
}, 1000);
