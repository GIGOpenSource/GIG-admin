import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/gameplay',
    name: 'gameplay',
    component: Layout,
    redirect: '/gameplay/list',
    meta: { title: '玩法管理', icon: 'setting', orderNo: 8 },
    children: [
      {
        path: 'list',
        name: 'GameplayList',
        component: () => import('@/pages/gameplay/list/index.vue'),
        meta: { title: '游戏管理' },
      },
      {
        path: 'config',
        name: 'GameplayConfig',
        component: () => import('@/pages/gameplay/config/index.vue'),
        meta: { title: 'APP管理' },
      }
    ],
  },
];
