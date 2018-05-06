async function throwError () {
  throw new Error()
}
async function returnNumber () {
  return 1
}

console.log(returnNumber() instanceof Promise) // true
console.log(throwError() instanceof Promise)   // true
