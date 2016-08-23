'use strict'

let fs = require('fs')

let pro = new Promise((resolve, reject) => {
  fs.readFile('./package.json', function (err, data) {
    if (err) {
      reject(err)
    }
    resolve(data.toString())
  })
})

pro.then(data => {
  console.log(data)

  return new Promise((resolve, reject) => {
    fs.readFile('./package.json', function (err, data) {
      if (err) {
        reject(err)
      }
      resolve(data.toString())
    })
  })
}).then(data => {
  console.log(data)
})
