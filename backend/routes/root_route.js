var express = require('express')

var router = express.Router()

router.get('/', function root_route (req, res) {
  res.render('index')
})

module.exports = (function () { return router; })()