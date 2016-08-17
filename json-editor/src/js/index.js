((win, factory) => {
  win.JSONEditor = win.JSONEditor || factory(win)
})(window, win => {
  let qsa = document.querySelectorAll.bind(document)
  let qs = s => qsa(s)[0]
  let treeList = 'tree-list'
  let attrList = 'attr-list'
  let _unionKey = '.'

  class JSONEditor {
    /**
     * fileInput  [Element]   文件上传的控件 需要监听change事件
     */
    constructor ({fileInput, container, unionKey = _unionKey}) {
      this.$file = qsa(fileInput)[0]
      this.$wrap = qsa(container)[0]

      _unionKey = unionKey

      this.init()
    }

    /**
     * 并尝试以文本的形式读取file
     * @param [File]    一个文件对象
     */
    changeHandler (file) {
      if (!file) return

      let reader = new FileReader()

      reader.onload = ({target: {result}}) => this.setData(JSON.parse(result))
      reader.readAsText(file)
    }

    /**
     * 拿到一个Object 并按照特定的规则生成Dom结构
     * @param [JSON]    一个JSON对象
     */
    setData (data) {
      let virtual = this.virtual = new NodeObject({
        key: 'root',
        data: data
      })

      this.$json.appendChild(virtual.getDom())
    }

    init () {
      // 添加两个展示用的容器DOM
      this.$wrap.innerHTML = `
        <div class="row">
          <div class="col-md-12">
            <div class="panel panel-default">
              <div class="panel-heading panel-default">
                节点展示
              </div>
              <div class="panel-body tree">
                <ul class="${treeList}" id="${treeList}"></ul>
              </div>
            </div>
          </div>
        </div>
      `

      // 展示节点的容器
      this.$json = qs(`#${treeList}`)
      // 展示属性的容器
      this.$attr = qs(`#${attrList}`)

      // 绑定文件上传的事件
      this.$file.addEventListener('change', ({target: {files: [file]}}) => this.changeHandler(file))
    }
  }

  /**
   * 作为一些节点公共属性方法的定义
   */
  class NodeBase {
    constructor () {
      this.unionKey = _unionKey
    }

    /**
     * 返回子类名称
     */
    is () {
      return this.constructor.name
    }

    /**
     * getDom会在返回 一个对应DOM元素的同时 塞到this.$dom 中
     * 这样就可以避免了以后的对dom操作还需要获取的问题了
     * 理想状态下 不直接操作dom元素
     */
    getDom () {
      throw new Error('this function not defined')
    }
  }

  /**
   * 一个引用类型节点的封装
   */
  class NodeObject extends NodeBase {
    constructor (...arg) {
      super(...arg)

      let [{key, data}] = arg

      if (!data || typeof data !== 'object') throw new Error('data must be an object')

      this.key = key
      this.type = Array.isArray(data) ? 'array' : 'object'
      let keel = this.keel = {}

      buildObject(keel, data)
    }

    getDom (parent) {
      let {key, unionKey} = this
      let virtualKey = (parent ? parent + unionKey + key : key)
      let $dom = this.$dom = document.createElement('li')
      let $child = this.$child = document.createElement('ul')

      $dom.dataset['key'] = virtualKey
      $dom.dataset['type'] = 'object'

      $dom.innerHTML = `
        <p class="title-row">
          <i class="open-item fa fa-chevron-down"></i>
          <label class="editor-tag">
            <span>${key}</span>
          </label>
        </p>
      `

      $child.classList.add('tree-container')
      $child.appendChild(this.getChildDom(key))

      $dom.appendChild($child)

      return $dom
    }

    getChildDom (...arg) {
      let keel = this.keel
      let $wrap = document.createDocumentFragment()
      for (let key in keel) {
        let item = keel[key]
        $wrap.appendChild(item.getDom(...arg))
      }

      return $wrap
    }
  }
  /**
   * 一个普通的值类型的节点对象
   */
  class NodeText extends NodeBase {
    constructor (...arg) {
      super(...arg)

      let [{key, value}] = arg

      if (value && typeof value === 'object') throw new Error('value should not be an object')

      this.key = key
      this.value = value
      this.type = typeof value
    }

    getDom (parent) {
      let {type, value, key, unionKey} = this
      let virtualKey = (parent ? parent + unionKey + key : key)
      let $dom = this.$dom = document.createElement('li')
      let $value = this.$value = document.createElement('input')
      $dom.dataset['key'] = virtualKey
      $dom.dataset['type'] = 'value'
      $dom.innerHTML = `
        <p class="title-row">
          <label class="editor-tag">
            <span class="node-title">${key}</span>：<span class="node-value">${value}</span>
          </label>
        </p>
      `

      $value.setAttribute('type', 'hidden')
      $value.setAttribute('value', value)
      $value.dataset['key'] = key
      $value.dataset['type'] = type
      $value.classList.add('data-item')

      $dom.appendChild($value)

      return $dom
    }
  }

  /**
   * 将Object对象按照特定的格式重组
   * 因为Object类型的变量存的是地址 为引用类型 所以该函数不需要返回值
   * @param  {Object} obj    一个包含了Object描述的对象
   * @param  {Object} data   需要解析这个Object 把所有的值按照特定规则塞到obj中
   */
  function buildObject (obj, data) {
    for (let key in data) {
      let item = data[key]
      if (typeof item === 'object') {
        obj[key] = new NodeObject({key, data: item})
      } else {
        obj[key] = new NodeText({key, value: item})
      }
    }
  }

  return JSONEditor
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

/**
   <li>
     <p class="title-row selected"><i class="open-item fa fa-chevron-down"></i>
       <label class="editor-tag">/</label>
     </p>
     <input type="hidden" class="data-item" data-key="PROTOCOL" value="http">
     <input type="hidden" class="data-item" data-key="UPSTREAM" value="blued">
     <ul class="tree-container" style="display: block;">
       <li>
         <p class="title-row"><i class="open-item fa fa-chevron-right"></i>
           <label class="editor-tag">blued</label>
         </p>
         <input type="hidden" class="data-item" data-key="PROTOCOL" value="fastcgi">
         <input type="hidden" class="data-item" data-key="UPSTREAM" value="groups">
       </li>
     </ul>
   </li>
 */
