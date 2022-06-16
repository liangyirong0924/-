import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' 
import { Message } from 'element-ui'

const whiteList = ['/login'] 
router.beforeEach(async(to,from,next)=>{
    NProgress.start()
    store.commit('user/getToken')
    const hasToken=store.state.user.token;

    if(hasToken){
        if(to.path==='/login'){
            next('/home')
            NProgress.done()
        }else{
            const hasGetUserInfo = store.state.user.username
            if(hasGetUserInfo){
                next()
            } else{
                try {
                  await store.dispatch('user/getInfo')
                  next()  
                } catch (e) {
                    await store.commit('user/clearToken')
                    Message.error(e||'有错误！')
                    next('/login')
                    NProgress.done()
                }
            }
        }
    }else{
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
          } else {
            // other pages that do not have permission to access are redirected to the login page.
            next('/login')
            NProgress.done()
          }
    }
})
router.afterEach(() => {
    // finish progress bar
    NProgress.done()
  })