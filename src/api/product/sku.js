import request from '@/utils/request'
// 获取图片的接口
export const reqSpuImageList = async (skuId) => {
  return await request({
    url: `/admin/product/spuImageList/${skuId}`,
    method: 'get'
  })
}
export const reqSpuSaleAttrList = async (spuId) => {
  return await request({
    url: `/admin/product/spuSaleAttrList/${spuId}`,
    method: 'get'
  })
}
export const reqAttrInfoList = async (category1Id, category2Id, category3Id) => {
  return await request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })
}
export const reqSkuList = async (page,limit) => {
  return await request({
    url: `/admin/product/list/${page}/${limit}`,
    method: 'get'
  })
}
export const reqSale = async (skuId) => {
  return await request({
    url: `/admin/product/onSale/${skuId}`,
    method: 'get'
  })
}

export const reqCancel = async (skuId) => {
  return await request({
    url: `/admin/product/cancelSale/${skuId}`,
    method: 'get'
  })
}

export const reqSkuById = async (skuId) => {
  return await request({
    url: `/admin/product/getSkuById/${skuId}`,
    method: 'get'
  });
}
