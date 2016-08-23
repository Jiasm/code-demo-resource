'use strict'

let co = require('co')

co(function * () {
  let a = yield [
    Promise.resolve('hello'),
    Promise.resolve('world')
  ]
  console.log(a)
}).then(console.log, console.error)
