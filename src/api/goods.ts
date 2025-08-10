import { request } from '@/utils/request';

const Api = {
  GoodsList: '/goods/query',
  CreateGood: '/goods/create',
  UpdateGood: '/goods/update',
  DeleteGood: '/goods/delete/',
  ChangeGoodStatus: '/goods/status/',

  VipList: '/goods/vip-power/query',
  VipCreate: '/goods/vip-power/create',
  VipUpdate: '/goods/vip-power/update',
  VipDelete: '/goods/vip-power/delete/',
};

// 商品列表
export function getGoodsList(data: any) {
  return request.post({
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
  return request.post({
    url: Api.UpdateGood,
    data,
  });
}

// 删除商品
export function deleteGoods(id: number) {
  return request.delete({
    url: Api.DeleteGood + id,
  });
}

// 修改商品状态
export function changeGoodsStatus(id: number, status: string) {
  return request.put({
    url: Api.ChangeGoodStatus + id,
    data: {
      key: status,
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
