//
// requires
//
var express = require('express')
var logger = require('morgan')
var path = require('path')
var bodyParser = require('body-parser')
var session = require('express-session')
var socketio = require('socket.io')

//
// app
//
var app = express()

//
// settings
// 
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//
// middlewares
//
app.use(logger('dev'))
// app.use(express.static(path.join(__dirname, '..', 'app')))
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded())
app.use(session({ secret: 'asdqwepoilkj', maxAge: null, resave: false, saveUninitialized: true }))

//
// routes
//
var routes = require('./lib/routes_loader.js')()

app.use('/games', routes.games)

//
// setup error handlers
//
require('./lib/error_handlers.js')(app)

//
// launch app server
// 
var server = require('http').createServer(app)

//
// Start socketio binded to app
//
io = socketio(server)
require('./lib/socket-manager.js')(io)

//
// Launch app server
//
server.listen(4000, function () { console.log('listening...') })

module.exports = app
