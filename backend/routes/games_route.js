var express = require('express')
var _ = require('lodash')

var gameManager = require('../services/game-manager.js')
var EventBus = require('../lib/event-bus.js')

var router = express.Router()

router.get('/', function root_route (req, res) {
  res.render('games/index', { games: gameManager.games })
})

router.get('/new', function root_route (req, res) {
  var game = gameManager.newGame()
  console.log(game)
  
  res.redirect('games')
})

router.get('/:ghid', function root_route (req, res) {
  var game = gameManager.find(req.params.ghid)
  console.log(game)

  if (_.isUndefined(game)) {
    res.redirect('/games')
  } else {
    res.render('games/play', { game: game })
  }
})

module.exports = router