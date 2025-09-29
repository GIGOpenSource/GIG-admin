import type { LoginForm } from '@/api/model/userModel';
import { request } from '@/utils/request';

const Api = {
  Login: '/auth/login/',
  Info: '/auth/users',
  CreateUser: '/user-management/create',
  UserList: '/auth/users/',
  UserInfo: '/auth/users/',
  EditInfo: '/auth/users/',
  EditStatus: '/auth/users/',
};

// 登录
export function login(data: LoginForm) {
  return request.post({
    url: Api.Login,
    data,
  });
}

// 获取用户信息
export function getInfo(params: { username: string }) {
  return request.get({
    url: Api.Info,
    params,
  });
}

// 创建用户
export function createUser(data: any) {
  return request.post({
    url: Api.CreateUser,
    data,
  });
}

// 用户列表
export function getUserList(params: any) {
  return request.get({
    url: Api.UserList,
    params,
  });
}

// 用户详情
export function getUserInfo(id: number) {
  return request.get({
    url: Api.UserInfo + id,
  });
}

// 编辑用户信息
export function editUserInfo(data: any) {
  return request.put({
    url: Api.EditInfo + data.id + '/',
    data,
  });
}

// 编辑用户状态
export function editUserStatus(data: any) {
  return request.put({
    url: Api.EditInfo + data.id + '/',
    data,
  });
}
