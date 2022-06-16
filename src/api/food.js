import request from '@/utils/axios'

// 查询列表接口
export const getDishPage = (params) => {
    return request({
      url: '/dish/page',
      method: 'get',
      params
    })
  }
  
  // 删除接口
 export const deleteDish = (ids) => {
    return request({
      url: '/dish',
      method: 'delete',
      params: { ids }
    })
  }
  
  // 修改接口
 export const editDish = (params) => {
    return request({
      url: '/dish',
      method: 'put',
      data: { ...params }
    })
  }
  
  // 新增接口
 export const addDish = (params) => {
    return request({
      url: '/dish',
      method: 'post',
      data: { ...params }
    })
  }
  
  // 查询详情
export  const queryDishById = (id) => {
    return request({
      url: `/dish/${id}`,
      method: 'get'
    })
  }
  
  // 获取菜品分类列表
export  const getCategoryList = (params) => {
    return request({
      url: '/category/list',
      method: 'get',
      params
    })
  }
  
  // 查菜品列表的接口
export  const queryDishList = (params) => {
    return request({
      url: '/dish/list',
      method: 'get',
      params
    })
  }
  
  // 文件down预览
 export const commonDownload = (params) => {
    return request({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      url: '/common/download',
      method: 'get',
      params
    })
  }
  
  // 起售停售---批量起售停售接口
export  const dishStatusByStatus = (params) => {
    return request({
      url: `/dish/status/${params.status}`,
      method: 'post',
      params: { ids: params.id }
    })
  }