import request from '@/utils/request'
// 获取一级分类
export const reqCategory1List = async () => {
  return await request({
    url: 'admin/product/getCategory1',
    method: 'get',
  })
}
// 获取二级级分类
export const reqCategory2List = async (category1Id) => {
  return await request({
    url: `admin/product/getCategory2/${category1Id}`,
    method: 'get',
  })
} // 获取一级分类
export const reqCategory3List = async (category2Id) => {
  return await request({
    url: `admin/product/getCategory3/${category2Id}`,
    method: 'get',
  })
}
//获取列表数据
export const reqAttrList = async (category1Id, category2Id, category3Id) => {
  return await request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })
}

// 添加属性和属性名
export const reqAddOrUpdateAttr = async (data) => {
  return await request({
    url: '/admin/product/saveAttrInfo',
    method: 'post',
    data,
  })
}

