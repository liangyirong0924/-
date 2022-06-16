import Vue from 'vue'
import Main from '@/views/Main'
import VueRouter from 'vue-router'


Vue.use(VueRouter)
let originPush=VueRouter.prototype.push;
let originreplace=VueRouter.prototype.replace;
VueRouter.prototype.push=function(location,resolve,reject){
  if(resolve&&reject){
      //call||apply区别：相同点：都可以调用函数一次，都可以篡改函数的上下文一次
      //originPush()this指向的是window
      //不同：call与apply传递参数：call传递参数用逗号隔开，apply方法执行，传递数组。
      originPush.call(this,location,resolve,reject);//this用来改变指向Vuerouter实例
  }else{
      originPush.call(this,location,()=>{},()=>{

      });
  }
}
VueRouter.prototype.replace=function(location,resolve,reject){
  if(resolve&&reject){
      originreplace.call(this,location,resolve,resolve);
  }else{
      originreplace.call(this,location,()=>{},()=>{

      });
  }
}
const routes=[
    {
        path:'/',
        name:'Main',
        redirect:'/home',
        component:Main,
        children:[  
          {
            path: '/home',
            name: 'Home',
            component:()=>import('@/views/Home')
            
          }  
        ]
    },
    {
       path:'/login' ,
       name:'login',
       component:()=>import('@/views/Login')
    }
]
const createRouter = () => new VueRouter({
     mode: 'history', 
    scrollBehavior: () => ({ y: 0 }),
    routes
  })
  const router = createRouter()
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
  }

export default router;