
var Hashids = require('hashids')
var hashidsConfig = require('../configs/hashids.js')
var storage = require('node-persist')

storage.initSync({
  dir: process.cwd() + '/storage',
})

module.exports = {
  hashids: new Hashids(hashidsConfig.salt),
  storage: storage,
}