function run (gen) {
  gen = gen()
  return next(gen.next())

  function next ({done, value}) {
    return new Promise(resolve => {
      if (done) { // finish
        resolve(value)
      } else { // not yet
        value.then(data => {
          next(gen.next(data)).then(resolve)
        })
      }
    })
  }
}

function getRandom () {
  return new Promise(resolve => {
    setTimeout(_ => resolve(Math.random() * 10 | 0), 1000)
  })
}

function * main () {
  let num1 = yield getRandom()
  let num2 = yield getRandom()

  return num1 + num2
}

run(main).then(data => {
  console.log(`got data: ${data}`)
})
