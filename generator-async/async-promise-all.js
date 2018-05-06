function delay () {
  return new Promise(resolve => setTimeout(resolve, 1000))
}

let tasks = [1, 2, 3, 4]

async function runner (tasks) {
  tasks = tasks.map(delay)
  await Promise.all(tasks)
}

console.time('runner')
await runner(tasks)
console.timeEnd('runner')
