((win, factory) => {
  win.JSONEditor = win.JSONEditor || factory(win)
})(window, win => {
  return class JSONEditor {
    /**
     * fileInput  [Element]   文件上传的控件 需要监听change事件
     */
    constructor ({fileInput}) {
      if (!fileInput || !fileInput.nodeType || fileInput.nodeType !== 1) {
        throw new Error('arguments fileInput must be an element')
      }

      this.$fileWrap = fileInput

      // 绑定文件上传的事件
      fileInput.addEventListener('change', ({target: {files: [file]}}) => this.changeHandler(file))
    }

    /**
     * 并尝试以文本的形式读取file
     * @param [File]    一个文件对象
     */
    changeHandler (file) {
      if (!file) return

      let reader = new FileReader()

      reader.onload = ({target: {result}}) => this.loadTree(result)
      reader.readAsText(file)
    }

    /**
     * 拿到一个Object 并按照特定的规则生成Dom结构
     * @param [JSON]    一个JSON对象
     */
    loadTree (data) {
      let virtual = this.virtual = {}

      buildObject(data, virtual)
    }
  }

  /**
   * 将Object对象按照特定的格式重组
   * 因为Object类型的变量存的是地址 为引用类型 所以该函数不需要返回值
   * @param  {Object} obj    要被重组的对象
   * @param  {Object} parent 该对象的容器 没有就默认为根节点
   */
  function buildObject (obj, parent) {

  }
})

/**
 * 这个JSON要生成啥样子呢。。。呃呃呃呃呃呃 好纠结
 * String 和 Number 还有 Boolean 这些都可以作为直接量。。UI上就用 text 和 radio就行。。。
 * 可是 Array 和 Object呢。。。
 * Object肯定是要递归着展示的。。
 * 可是Array呢。。。。。。。。。。 你妹的Array。。。
 * 因为Array里边可能还会有Object咧。。。😭
 * 得了。。拿下标当Key 按照类似 Object的规则展示吧。。。
 * {
 *   String: <input type="text" />,
 *   Number: <input type="number" />,
 *   Boolean: <input type="checkbox" name="${key}" checked="${value}" />,
 *   Array: {
 *    0: XXX,
 *    1: XXX
 *   },
 *   Object: {
 *    key1: XXX,
 *    key2: XXX
 *   }
 * }
 * 嗯。。就这样吧 三个直接量，以及两个肯定会包含直接量的Object
 */
