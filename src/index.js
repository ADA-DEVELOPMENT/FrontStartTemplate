import { AppVue, AppModules } from './root/App'


AppModules.runModule([
   // 'Counter',
])

Vue.createApp(AppVue)
    .mount('#root')