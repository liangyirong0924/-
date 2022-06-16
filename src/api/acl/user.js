import request from '@/utils/axios'

/**
 * 登录
 */
 export function login({ username, password }) {
    return request({
      url: '/employee/login',
      method: 'post',
      data: { username, password }
    })
  }
  /*
获取用户信息(根据token)
*/
export function getInfo(token) {
    return request({
      url: '/employee/getUser',
      method: 'get',
      headers: {'Authorization': token},
      
    })
  }
  /*
登出
*/
export function logout(token) {
    return request({
      url: '/employee/logout',
      method: 'get',
      headers: {'Authorization': token},
    })
  }