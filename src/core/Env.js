class Env {
   #modules = {}
   /**
    * Реєстрація нового модуля в об'єкт modules за вказаним ім'ям
    */
   constructor(options){
      if (!options) options = {}

      this.initMethodRequired = this.#hasProp(options, 'initMethodRequired') ? options.initMethodRequired : true

      this.createdApp()
   }
   #hasProp(obj, prop){
      return Object.keys(obj).includes(prop)
   }
   moduleRegister(modules){
      if (typeof modules !== 'object') {
         throw new Error(`Env error: this module "${moduleName}" is not an object`)
      }

      this.beforeRegister()

      for (let moduleName in modules){
         const newModuleRegister = modules[moduleName]

         if (!newModuleRegister.init && this.initMethodRequired){
            throw new Error(`Env error: this module "${moduleName}" has no initialization method "init()"`)
         }

         newModuleRegister.status = 'registered'

         this.#modules[moduleName] = newModuleRegister
      }

      this.registered()
   }
   /**
    * Повертає інстанс модуля (атрибути та його методи)
    */
   getInstanseModule(moduleName){
      if (!this.#modules[moduleName]) {
         throw new Error(`Env error: module ${moduleName} is not defined.`)
      }

      return this.#modules[moduleName]
   }
   /**
    * Запускає модуль або модулі (викликає метод init)
    */
   runModule(moduleParam){
      if (!this.initMethodRequired) return

      if (typeof moduleParam === 'string'){
         this.initModule(moduleParam)
      }

      else if (typeof moduleParam === 'object'){
         moduleParam.forEach(moduleName => {
            this.initModule(moduleName)
         })
      }
   }
   /**
    * Виклик методу init у модуля
    */
   initModule(moduleName){
      const moduleInstanseClass = this.#modules[moduleName]

      if (!moduleInstanseClass) {
         throw new Error(`Env error: module ${moduleName} is not defined.`)
      }

      this.beforeInit()

      moduleInstanseClass.status = 'working'
      moduleInstanseClass.init()

      this.initialized()
   }

   createdApp(){}
   beforeRegister(){}
   registered(){}
   beforeInit(){}
   initialized(){}

   countAmountModulesWorking(){
      let amount = 0

      for (let moduleName in this.#modules){
         const instanseModule = this.#modules[moduleName]

         if (instanseModule.status === 'working'){
            amount++
         }
      }

      return amount
   }
   /**
    * Повертає масив усіх модулів
    */
   get getModulesAll(){
      return this.#modules
   }
   /**
    * Основні події
    */
}


export default Env