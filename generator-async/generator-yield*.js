function * gen1 () {
  yield 1
  yield * gen2()
  yield 5
}

function * gen2 () {
  yield 2
  yield 3
  yield 4
  return 'won\'t be iterate'
}

for (let value of gen1()) {
  console.log(value)
}
// > 1
// > 2
// > 3
// > 4
// > 5
