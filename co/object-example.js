'use strict'

let co = require('co')

co(function * () {
  let a = yield {
    fisrt: Promise.resolve('hello'),
    last: Promise.resolve('world')
  }
  console.log(a.fisrt, a.last)
}).then(console.log, console.error)
