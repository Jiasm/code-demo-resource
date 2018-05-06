function * oddGenerator () {
  yield 1
  yield 3
  yield 5

  return 'won\'t be iterate'
}

for (let value of oddGenerator()) {
  console.log(value)
}
// > 1
// > 3
// > 5
