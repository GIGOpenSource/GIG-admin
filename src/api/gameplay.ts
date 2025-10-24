import { request } from '@/utils/request';

const Api = {
  // 游戏管理接口
  GameList: '/ad/ads/',
  GameDetail: '/ad/ads/',
  GameCreate: '/ad/ads/',
  GameUpdate: '/ad/ads/',
  GamePartialUpdate: '/ad/ads/',
  GameDelete: '/ad/ads/',

  // APP管理接口
  AppList:'/ad/ads/',
  AppDetail:'/ad/ads/',
  AppCreate: '/ad/ads/',
  AppUpdate: '/ad/ads/',
  AppPartialUpdate: '/ad/ads/',
  AppDelete: '/ad/ads/',

  uploadImage: '/upload/',
  tags:'/tags/'
};

// ========== 游戏管理接口 ==========

// 获取游戏列表
export function getGameList(data: any) {
  return request.get({
    url: Api.GameList,
    data,
  }, {
    joinTime: false, // 禁用时间戳参数
  });
}

// 创建游戏
export function createGame(data: any) {
  return request.post({
    url: Api.GameCreate,
    data,
  });
}

// 获取游戏详情
export function getGameDetail(id: number) {
  return request.get({
    url: Api.GameDetail + id + '/',
  }, {
    joinTime: false, // 禁用时间戳参数
  });
}

// 更新游戏
export function updateGame(data: any) {
  return request.put({
    url: Api.GameUpdate + data.id + '/',
    data,
  });
}

// 部分更新游戏
export function partialUpdateGame(data: any) {
  return request.patch({
    url: Api.GamePartialUpdate + data.id + '/',
    data,
  });
}

// 删除游戏
export function deleteGame(id: number) {
  return request.delete({
    url: Api.GameDelete + id + '/',
  });
}

// ========== APP管理接口 ==========

// 获取APP列表
export function getAppList(data: any) {
  return request.get({
    url: Api.AppList,
    data,
  }, {
    joinTime: false, // 禁用时间戳参数
  });
}

// 创建APP
export function createApp(data: any) {
  return request.post({
    url: Api.AppCreate,
    data,
  });
}

// 获取APP详情
export function getAppDetail(id: number) {
  return request.get({
    url: Api.AppDetail + id + '/',
  }, {
    joinTime: false, // 禁用时间戳参数
  });
}

// 更新APP
export function updateApp(data: any) {
  return request.put({
    url: Api.AppUpdate + data.id + '/',
    data,
  });
}

// 部分更新APP
export function partialUpdateApp(data: any) {
  return request.patch({
    url: Api.AppPartialUpdate + data.id + '/',
    data,
  });
}

// 删除APP
export function deleteApp(id: number) {
  return request.delete({
    url: Api.AppDelete + id + '/',
  });
}

// ========== 兼容性接口（保持向后兼容） ==========

// 获取玩法列表（兼容旧接口）
export function getGameplayList(data: any) {
  return getGameList(data);
}

// 新增玩法（兼容旧接口）
export function createGameplay(data: any) {
  return createGame(data);
}

// 更新玩法（兼容旧接口）
export function updateGameplay(data: any) {
  return updateGame(data);
}

// 删除玩法（兼容旧接口）
export function deleteGameplay(id: number) {
  return deleteGame(id);
}

// ========== 图片上传接口 ==========

// 获取标签列表
export function getTages(data:any) {
  return request.get({
    url: Api.tags,
    data
  }, {
    joinTime: false, // 禁用时间戳参数
  });
}

// 上传图片
export function uploadImage(file: File) {
  const formData = new FormData();
  formData.append('name', file.name);
  formData.append('type', 'img');
  formData.append('file', file);

  return request.post({
    url: Api.uploadImage,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
