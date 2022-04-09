import request from '@/utils/request'

// 获取spu的三级联动
export const reqSpuCategoryList = async (page, limit, category3Id) => {
  return await request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: {
      category3Id
    },
  })
}
// 获取SPuid
export const reqSpu = async (spuId) => {
  return await request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
  })
}

// 获取品牌的信息
export const reqTradeMarkList = async () => {
  return await request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get'
  })
}
// 品牌的图片
export const reqSpuImageList = async (spuId) => {
  return await request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
  })
}

// 获取所有销售属性
export const reqBaseSaleAttr = async () => {
  return await request({
    url: '/admin/product/baseSaleAttrList',
    method: 'get'
  })
}

// 修改或者添加spu
export const reqAddOrUpdateSpu = async (spuInfo) => {
  if (spuInfo.id) {
    return await request({
      url: '/admin/product/updateSpuInfo',
      method: 'post',
      data: spuInfo
    })
  } else {
    return await request({
      url: '/admin/product/saveSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }
}
// 删除spu
export const reqDeleteSpu = async (spuId) => {
  return await request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
  })
}

// 添加spu
export const reqAddSku = async (skuInfo) => {
  return await request({
    url: '/admin/product/saveSkuInfo',
    method: 'get',
    data: skuInfo
  })
}

// 获取spu
export const reqSkuList = async (spuId) => {
  return await request({
    url: `/admin/product/findBySpuId/${spuId}`,
    method: 'get'
  })
}


