function * oddGenerator () {
  yield 1
  yield 3

  return 5
}

let iterator = oddGenerator()

let first = iterator.next()  // { value: 1, done: false }
let second = iterator.next() // { value: 3, done: false }
let third = iterator.next()  // { value: 5, done: true  }
