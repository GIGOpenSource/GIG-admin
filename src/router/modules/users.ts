import { LogoutIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/users',
    name: 'users',
    component: Layout,
    redirect: '/users/list',
    meta: { title: '用户管理', icon: 'user-circle' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/pages/users/list/index.vue'),
        meta: { title: '用户列表' },
      },
      {
        path: 'logs',
        name: 'UserLogs',
        component: () => import('@/pages/users/login-log/index.vue'),
        meta: { title: '用户登录日志' },
      },
      {
        path: 'views',
        name: 'UserViews',
        component: () => import('@/pages/users/view-list/index.vue'),
        meta: { title: '用户观看列表' },
      },
      {
        path: 'grade',
        name: 'UserGrade',
        component: () => import('@/pages/users/grade/index.vue'),
        meta: { title: '等级管理' },
      },
    ],
  },
];
