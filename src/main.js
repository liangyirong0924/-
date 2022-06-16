import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import '@/assets/less/index.less'
/* import'./permission' */
import '@/assets/less/page.css'
import API from '@/api'
import {requestUrlParam} from '@/utils/index.js'

import JsonExcel from 'vue-json-excel'
Vue.component('downloadExcel', JsonExcel)
import '@/utils/validate'
import moment from 'moment'
import '@/api/mock.js'
Vue.prototype.moment  =  moment;

Vue.config.productionTip = false
Vue.use(ElementUI)

router.beforeEach(async(to,from,next)=>{
  store.commit('user/getToken')
  const token=store.state.user.token
  if(!token&&to.name!=='login'){
    next('/login')
  }else if(token&&to.name==='login'){
    
       await store.dispatch('user/getInfo');
       next('/home')
  }else{
    next()
  }
})

Vue.filter('formatDate', (input, formatString = "YYYY-MM-DD HH:mm:ss") => {
 
   if(!input){
     return '-'
   }
   return moment(input).format(formatString);
})

Vue.prototype.$requestUrlParam=requestUrlParam;

Vue.prototype.$API=API;

new Vue({
  router,
  store,
  render: h => h(App),
  created(){
    store.commit('addMenu',router)
  }
}).$mount('#app')
