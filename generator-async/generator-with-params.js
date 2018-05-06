function * outputGenerator () {
  let ret1 = yield 1
  console.log(`got ret1: ${ret1}`)
  let ret2 = yield 2
  console.log(`got ret2: ${ret2}`)
}

let iterator = outputGenerator()

iterator.next(1)
iterator.next(2) // got ret1: 2
iterator.next(3) // got ret2: 3
