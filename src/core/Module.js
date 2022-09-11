import { $root, modules } from '../config/settings'


class Module {
   /**
    * Атрибут кореневого елементу додатку
    * Береться з файлу settings.js
    */
   $rootApp = $root
   /**
    * Локальний обʼєкт, який формується методом "bindData"
    * Ключ - назва ключа проксі-обʼєкту "bindDataList"
    * Значення - node елемент, який змінює свій контент, коли змінюються дані
    */
   #bindDataRefList = {}

   // modelData = {}
   /**
    * Ініціалізація інстансу модуля
    */
   constructor(selector) {
      /**
       * Записується селектор модуля (string)
       */
      this.selector = selector
      /**
       * По селектору шукається кореневий елемент модуля
       * По ньому і проводиться пошук усіх node елементів в середині модуля
       */
      this.$rootModule = this.$rootApp.querySelector(this.selector)
   }
   /**
    * Іцініалізація модуля
    * Налаштовуємо proxy для "bindDataList" та встановлюємо функцію "set"
    */
   init() {
      /**
       * Зміна обʼєкту "bindDataList" на проксований обʼєкт з сеттером даних
       */
      this.bindDataList = new Proxy(this.bindDataList, {
         set: this.#setBindData.bind(this)
      })
   }
   /**
    * Метод для зміни ключів обʼєкту "bindDataList" (пастка)
    */
   #setBindData(target, prop, value) {
      if (!(typeof target[prop] === typeof value)) {
         throw new Error(`Module Error: data type mismatch: "${target[prop]}" and "${value}". The data type must be "${typeof target[prop]}"`)
      }

      target[prop] = value

      const $targetNode = this.#bindDataRefList[prop]

      if ($targetNode) {
         $targetNode.innerHTML = value
      }

      return true
   }
   /**
    * Метод для зміни звʼязаних даних в залежності від value node елементів
    */
   #setBindValueNode($node, data) {
      this.bindDataList[data] = $node.value
   }
   /**
    * Додавання нових ключів та методів до node елемента
    */
   #customNodeElement($node) {
      const __instanse__ = this

      $node.on = (event, func) => {
         $node.addEventListener(event, func.bind(__instanse__))
      }
   }
   /**
    * Пошук елемента по селектору в середині модуля
    * selector - назва css селектору (string)
    * mode - опція для пошуку, наприклад "all" - повертає колекцію елементів
    */
   find(selector, mode) {
      const modes = ['all', 'first', 'outside', 'outsideAll',]

      if (!this.#hasListElement(modes, mode) && mode) {
         throw new Error(`Module Error: the module is not available for use: "${mode}"`)
      }

      function _first($root) {
         const $node = $root.querySelector(selector)

         if (!$node) return

         this.#customNodeElement($node)
         return $node
      }

      function _all($root) {
         const $nodes = $root.querySelectorAll(selector)
         const nodesList = []

         $nodes.forEach($node => {
            const $n = $node
            this.#customNodeElement($n)
            nodesList.push($n)
         })

         return nodesList
      }

      if (!mode || mode === 'first') {
         return _first.call(this, this.$rootModule)
      }
      else if (mode === 'all') {
         return _all.call(this, this.$rootModule)
      }
      else if (mode === 'outside') {
         return _first.call(this, this.$rootApp)
      }
      else if (mode === 'outsideAll') {
         return _all.call(this, this.$rootApp)
      }
   }
   /**
    * Отримати стороній зареєстрований модуль
    */
   callModule(moduleName) {
      if (!modules[moduleName]) return false

      return modules[moduleName]
   }
   /**
    * Перевіряє чи є ключ в обʼєкті
    */
   #hasProp(obj, prop) {
      return Object.keys(obj).includes(prop)
   }
   /**
    * Перевіряє чи є елемент в масиві
    */
   #hasListElement(list, element) {
      if (list.indexOf(element) !== -1) return true

      return false
   }
   bindData(nodeName, data, mode) {
      const modes_allowed = ['content', 'value',]
      /**
       * Перевіряє на відповідність "mode" до масиву "modes_allowed"
       */
      if (!this.#hasListElement(modes_allowed, mode) && mode) {
         throw new Error(`Module Error: the module is not available for use: "${mode}"`)
      }
      /**
       * Перевіряє чи відноситься "data" до обʼєкту "bindDataList"
       */
      if (!this.#hasProp(this.bindDataList, data)) {
         throw new Error(`Module Error: the "${data}" property is missing from the "bindDataList" object`)
      }

      const $bindNode = this[nodeName]

      /**
       * Перевіряє чи відноситься "nodeName" до інстансу модуля
       */
      if (!$bindNode) {
         throw new Error(`Module Error: node ${nodeName} is not defined in module instanse`)
      }
      /**
       * Підв'язка даних до контентної частини node елементу
       */
      if (!mode || mode === 'content') {
         this.#bindDataRefList[data] = this[nodeName]
         $bindNode.innerHTML = this.bindDataList[data]
      }

      else if (mode === 'value') {
         $bindNode.on('input', this.#setBindValueNode.bind(this, $bindNode, data))
         this.bindDataList[data] = $bindNode.value
      }
   }
}


export default Module