import { request } from '@/utils/request';

const Api = {
  GameplayList: '/gameplay/',
  GameplayConfig: '/gameplay/config/',
  GameplayRules: '/gameplay/rules/',
  CreateGameplay: '/gameplay/',
  UpdateGameplay: '/gameplay/',
  DeleteGameplay: '/gameplay/',
  CreateGameplayRule: '/gameplay/rules/',
  UpdateGameplayRule: '/gameplay/rules/',
  DeleteGameplayRule: '/gameplay/rules/',
};

// 获取玩法列表
export function getGameplayList(data: any) {
  return request.get({
    url: Api.GameplayList,
    data,
  });
}

// 新增玩法
export function createGameplay(data: any) {
  return request.post({
    url: Api.CreateGameplay,
    data,
  });
}

// 更新玩法
export function updateGameplay(data: any) {
  return request.put({
    url: Api.UpdateGameplay + data.id + '/',
    data,
  });
}

// 删除玩法
export function deleteGameplay(id: number) {
  return request.delete({
    url: Api.DeleteGameplay + id + '/',
  });
}

// 获取玩法配置
export function getGameplayConfig(id: number) {
  return request.get({
    url: Api.GameplayConfig + id + '/',
  });
}

// 更新玩法配置
export function updateGameplayConfig(data: any) {
  return request.put({
    url: Api.GameplayConfig + data.id + '/',
    data,
  });
}

// 获取玩法规则列表
export function getGameplayRules(data: any) {
  return request.get({
    url: Api.GameplayRules,
    data,
  });
}

// 新增玩法规则
export function createGameplayRule(data: any) {
  return request.post({
    url: Api.CreateGameplayRule,
    data,
  });
}

// 更新玩法规则
export function updateGameplayRule(data: any) {
  return request.put({
    url: Api.UpdateGameplayRule + data.id + '/',
    data,
  });
}

// 删除玩法规则
export function deleteGameplayRule(id: number) {
  return request.delete({
    url: Api.DeleteGameplayRule + id + '/',
  });
}
