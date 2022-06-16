//对于axios进行二次封装
import axios from "axios";
import nprogress from "nprogress";
import { getToken1 } from '@/utils/auth'
//start:进度条开始 done:进度条结束
//引入进度条的样式
import "nprogress/nprogress.css";
//引入store
import store from '@/store'
import { Message } from "element-ui";
//1.利用axios对象的方法create，去创建一个axios实例
//2.request就是axios，只不过稍微配置一下
const requests =axios.create({
    //配置对象
    baseURL:"/lyr/api",
    //超时的时间
    timeout:5000,
});
//请求拦截器:在发请求之前，请求拦截器可以监测到，可以在请求发出去之前做一些事情；
requests.interceptors.request.use((config)=>{  
       //config:配置对象，对象里面有一个属性很重要，header请求头
       
      
       //需要携带token带给服务器
       if(store.state.user.token){
           
        config.headers['Authorization']= getToken1();
       }
       nprogress.start();
       return config;
});
//响应拦截器
requests.interceptors.response.use((res)=>{
    nprogress.done();//进度条结束
return res.data;
},(error)=>{
     Message({
         message:res.data.message||res.data.msg||'Error',
         type:'error',
         duration:5*1000
     })
    
     
})







//对外暴露
export default requests;