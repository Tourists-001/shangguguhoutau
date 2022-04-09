import request from '@/utils/request'
// 获取品牌列表接口
export const reqTradeMarkList = async (page, limit) => {
  return await request({
    url: `admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
  })
}

// 添加或者删除品牌(数据差不多，可以合并接口)
export const reqAddOrUpdateTradeMark = (tradeMask) => {
  if (tradeMask.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'put',
      data: tradeMask,
    })
  } else {
    return request({
      url: '/admin/product/baseTrademark/save',
      method: 'post',
      data: tradeMask,
    })
  }
}

//删除产品
export const deleteTradeMark =  (id) => {
  return  request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
}
