function getRandom () {
  return new Promise(resolve => {
    setTimeout(_ => resolve(Math.random() * 10 | 0), 1000)
  })
}

async function main () {
  let num1 = await getRandom()
  let num2 = await getRandom()

  return num1 + num2
}

console.log(`got data: ${await main()}`)
