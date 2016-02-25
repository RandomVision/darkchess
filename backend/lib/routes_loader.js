var express = require('express')
var path = require('path')
var fs = require('fs')

var routesPath = path.join(__dirname, '..', 'routes')

module.exports = function routes_loader () {
  var routes = {}

  fs.readdirSync(routesPath).forEach(function (file) {
    console.log('possible route:', file)
    if (file.match(/.*_route.js/)) {
      var routeName = path.basename(file).split('_route')[0]
      routes[routeName] = require(path.join(routesPath, file))
      console.log('>> loaded route:', routeName)
    }
  })

  return routes
}