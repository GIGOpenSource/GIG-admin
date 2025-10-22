import { request } from '@/utils/request';

const Api = {
  GoodsList: '/payments/pay/',
  CreateGood: '/payments/pay/',
  UpdateGood: '/payments/pay/',
  DeleteGood: '/payments/pay/',
  ChangeGoodStatus: '/payments/pay/',

  VipList: '/vip-power/query',
  VipCreate: '/vip-power/create',
  VipUpdate: '/vip-power/update',
  VipDelete: '/vip-power/delete/',

  LinkList: '/ad/ads/',
  createLink: '/ad/ads/',
  updateLink: '/ad/ads/',
  deleteLink: '/ad/ads/',
};

// 商品列表
export function getGoodsList(data: any) {
  return request.get({
    url: Api.GoodsList,
    data,
  });
}

// 创建商品
export function createGoods(data: any) {
  return request.post({
    url: Api.CreateGood,
    data,
  });
}

// 更新商品
export function updateGoods(data: any) {
  return request.put({
    url: Api.UpdateGood + data.id + '/',
    data,
  });
}

// 删除商品
export function deleteGoods(id: number) {
  return request.delete({
    url: Api.DeleteGood + id + '/',
  });
}

// 修改商品状态
export function changeGoodsStatus(id: number, status: string) {
  return request.put({
    url: Api.ChangeGoodStatus + id + '/',
    data: {
      is_active: status,
    },
  });
}

// vip列表
export function getVipList(data: any) {
  return request.post({
    url: Api.VipList,
    data,
  });
}

// 创建vip
export function createVip(data: any) {
  return request.post({
    url: Api.VipCreate,
    data,
  });
}

// 更新vip
export function updateVip(data: any) {
  return request.post({
    url: Api.VipUpdate,
    data,
  });
}

// 删除vip
export function deleteVip(id: number) {
  return request.delete({
    url: Api.VipDelete + id,
  });
}

// 获取广告
export function getLinkList(data: any) {
  return request.get({
    url: Api.LinkList,
    data,
  });
}

export function createLink(data: any) {
  return request.post({
    url: Api.createLink,
    data,
  });
}

export function updateLink(data: any) {
  return request.put({
    url: Api.updateLink + data.id + '/',
    data,
  });
}

export function deleteLink(id: string) {
  return request.delete({
    url: `${Api.deleteLink}/${id}/`,
  });
}
