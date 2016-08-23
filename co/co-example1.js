'use strict'

let co = require('co')
let fs = require('fs')

co(function * () {
  let a = yield fs.readFile.bind(null, './package.json')
  console.log(a.toString())
  let b = yield fs.readFile.bind(null, './package.json')
  console.log(b.toString())
}).then(console.log, console.error)
