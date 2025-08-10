import { defineStore } from 'pinia';

import { usePermissionStore } from '@/store';
import type { UserInfo } from '@/types/interface';

import type { LoginForm } from '@/api/model/userModel';
import { login , getInfo} from '@/api/user';

const InitUserInfo: UserInfo = {
  username: '', // 用户名，用于展示在页面右上角头像处
  name: '', // 用户名，用于展示在页面右上角头像处
  roles: [], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
};

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '', // 默认token不走权限
    userInfo: { ...InitUserInfo },
  }),
  getters: {
    roles: (state) => {
      return state.userInfo?.roles;
    },
  },
  actions: {
    // 登录
    async login(userInfo: LoginForm) {
      const res = await login(userInfo);
      console.log("🚀 ~ res:", res)
      // if (res.code === 200) {
      if (res.code === 0 && res.data.data.token) {
        this.token = res.data.data.token;
        this.userInfo = res.data.data
        return res;
      } else {
        throw res;
      }
    },
    async getUserInfo() {
      // const mockRemoteUserInfo = async (token: string) => {
      //   if (token === 'main_token') {
      //     return {
      //       name: 'Tencent',
      //       roles: ['all'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
      //     };
      //   }
      //   return {
      //     name: 'td_dev',
      //     roles: ['UserIndex', 'DashboardBase', 'login'], // 前端权限模型使用 如果使用请配置modules/permission-fe.ts使用
      //   };
      // };
      // const res = await mockRemoteUserInfo(this.token);
     const res =  await getInfo({username: this.userInfo.username})

      this.userInfo = res.data.data;

      return res.data.data;
    },
    async setUserInfo(userInfo: UserInfo) {
      console.log("🚀 ~ setUserInfo ~ userInfo:", userInfo)
      this.userInfo = userInfo
    },
    async logout() {
      this.token = '';
      this.userInfo = { ...InitUserInfo };
    },
  },
  persist: {
    afterRestore: () => {
      const permissionStore = usePermissionStore();
      permissionStore.initRoutes();
    },
    key: 'user',
    paths: ['token','userInfo'],
  },
});
