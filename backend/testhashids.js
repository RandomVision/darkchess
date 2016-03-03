
var Hashids = require('hashids')
var hashidsConfig = require('./configs/hashids.js')

var hids = new Hashids(hashidsConfig.salt)


for (var i = 100001 - 1; i >= 0; i--) {
  console.log(hids.encode(i))
};