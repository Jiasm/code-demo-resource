function delay () {
  return new Promise(resolve => setTimeout(resolve, 1000))
}

let tasks = [1, 2, 3, 4]

async function runner (tasks) {
  for (let task of tasks) {
    await delay()
  }
}

console.time('runner')
await runner(tasks)
console.timeEnd('runner')
