import request from '@/utils/axios'

// 查询列表页接口
export const getOrderDetailPage = (params) => {
    return request({
      url: '/order/page',
      method: 'get',
      params
    })
  }
  
  // 查看接口
 export const queryOrderDetailById = (id) => {
    return request({
      url: `/orderDetail/${id}`,
      method: 'get'
    })
  }
  
  // 取消，派送，完成接口
 export const editOrderDetail = (params) => {
    return request({
      url: '/order',
      method: 'put',
      data: { ...params }
    })
  }

  export const getData=()=>{
    return request({
      url:'/home/getData'
     
    })
  }
  