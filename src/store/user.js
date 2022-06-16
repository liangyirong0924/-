import {getToken1, setToken1, removeToken1} from '@/utils/auth'
import { login, logout, getInfo } from '@/api/acl/user'
import { resetRouter } from '../router';
const state = {
    token: getToken1(),
    username:'',
    name:'',
    role:null,
    


};
const mutations = {
    setToken(state, token) {
        state.token = token
        setToken1(token);
    },
    clearToken(state){
        state.token = ''
        removeToken1();
    },
    getToken(state) {
        state.token = state.token || getToken1();
        
    },
    set_userInfo(state,userInfo){
        //用户名
        state.username=userInfo.username;
        state.name=userInfo.name;
        state.role=userInfo.role;
    }
}; 
const actions = {
    async login({ commit }, userinfo) {
        const { username, password } = userinfo;
        let result = await login({ username: username, password: password });
        if (result.code == 200) {
            commit('setToken', result.data);
            
            return 'ok';
        } else {
            return Promise.reject(new Error(result.msg));
        }

    },
    // 获取用户信息
    async getInfo({ commit, state }) {
        let result=await getInfo(state.token);
        if(result.code==200){
            commit('set_userInfo',result.data); 
            
            return 'ok';
        }else{
            console.log(result.msg);
            return Promise.reject(new Error(result.msg));
        }
       /*  return new Promise((resolve, reject) => {
            getInfo(state.token).then(response => {
                //获取用户信息：返回的数据包含：用户名name、用户头像avatar、routes[返回的标志：不同的用户应该展示哪些菜单的标记]、roles(用户角色的信息)、button(按钮的信息：按钮权限用的标记)
                const { data } = response;
                
                //vuex存储用户全部的信息
                commit('set_userInfo', data);
                //为什么要用cloneDeep() 因为import 导入的是值的引用 值的改变会影响原来的值
               
                resolve(data)
            }).catch(error => {
                reject(error)
            })
        }) */
    },
    //退出登录
    async logout({ commit, state }) {
        return new Promise((resolve, reject) => {
          logout(state.token).then(() => {
            commit('clearToken')
            
            
            resetRouter();
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}