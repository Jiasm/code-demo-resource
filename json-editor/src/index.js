((win, factory) => {
  win.JSONEditor = win.JSONEditor || factory(win)
})(window, win => {
  return class JSONEditor {
    constructor ({fileInput}) {
      console.log(fileInput)
    }
  }
})
