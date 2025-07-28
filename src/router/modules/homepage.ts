import { DashboardIcon } from 'tdesign-icons-vue-next';
import { shallowRef } from 'vue';

import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/home',
    component: Layout,
    redirect: '/home',
    name: 'homepage',
    meta: {
      title: {
        zh_CN: '首页',
        en_US: 'Home',
      },
      icon: shallowRef(DashboardIcon),
      orderNo: 0,
      single: true,
    },
    children: [
      {
        path: '',
        name: 'HomeBase',
        component: () => import('@/pages/home/index.vue'),
        meta: {},
      },
    ],
  },
];
