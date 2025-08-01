import type { LoginForm } from '@/api/model/userModel';
import { request } from '@/utils/request';

const Api = {
  Login: '/login',
};

// 登录
export function login(data: LoginForm) {
  return request.post({
    url: Api.Login,
    data,
  });
}
