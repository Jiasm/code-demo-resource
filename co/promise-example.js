'use strict'

let co = require('co')
let cb2pro = require('cb2pro')
let fs = cb2pro(require('fs'), {}, ['readFile'])

co(function * () {
  let a = yield fs.readFile('./package.json')
  console.log(a.toString())
}).then(console.log, console.error)
