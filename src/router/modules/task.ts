import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/task',
    name: 'task',
    component: Layout,
    redirect: '/task/list',
    meta: { title: '任务管理', icon: 'task', orderNo: 5 },
    children: [
      {
        path: 'list',
        name: 'TaskList',
        component: () => import('@/pages/task/list/index.vue'),
        meta: { title: '任务列表' },
      },
    ],
  },
];
