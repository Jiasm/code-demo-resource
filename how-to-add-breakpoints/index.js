'use strict'

let number = 0

let classList = [
  'red',
  'green',
  'blue'
]

let $output = document.querySelector('.output')

document.querySelector('.number-plus').addEventListener('click', e => {
  $output.innerHTML = ++number
})

document.querySelector('.random-class').addEventListener('click', e => {
  let {className: now} = $output

  let className

  do {
    className = classList[Math.random() * classList.length | 0]
  } while (className === now)

  // $output.className = className
  $output.setAttribute('class', className)
})

throw new Error('test error')
