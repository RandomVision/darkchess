var game = new Phaser.Game(1200, 750, Phaser.AUTO, '', { 
  preload: preload, 
  create: create, 
  update: update,
  render: render
})

var dimension = 80;
var board = []

function preload() {
  // game.load.image('board', 'assets/chessboard.svg', 800, 800)
}

function create() {
  create_board()  
  
}

function render() {
  draw_board()
}

function update() {
}

function create_board() {
  for (var x = 0; x <= 8; x++) {
    for (var y = 0; y <= 8; y++) {
      board.push(new Phaser.Rectangle(x*dimension, y*dimension, dimension, dimension));
    };
  };
}
function draw_board() {
  color = false
  for (var i = board.length - 1; i >= 0; i--) {
    if (color)
      game.debug.geom(board[i], '#4f4f4f')
    else
      game.debug.geom(board[i], '#f0f0f0')
    color = !color
  };
}