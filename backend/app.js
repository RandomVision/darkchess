//
// requires
//
var express = require('express')
var logger = require('morgan')
var path = require('path')

//
// app
//
var app = express()

//
// settings
// 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//
// middlewares
//
app.use(logger('dev'))
app.use(express.static(path.join(__dirname, '..', 'app')));

//
// routes
//
var routes = require('./lib/routes_loader.js')()

// app.use('/', routes.root)

//
// launch app server
// 
var server = require('http').createServer(app).listen(4000, function () { console.log('listening...') })

module.exports = app;



// var app = require('express')();
// var http = require('http').Server(app);

// app.get('/', function(req, res){
//   res.send('<h1>Hello world</h1>');
// });

// http.listen(4000, function(){
//   console.log('listening on *:4000');
// });