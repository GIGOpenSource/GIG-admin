import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/content',
    name: 'content',
    component: Layout,
    redirect: '/content/list',
    meta: { title: '内容管理', icon: 'article',  orderNo: 4  },
    children: [
      {
        path: 'list',
        name: 'ContentList',
        component: () => import('@/pages/content/list/index.vue'),
        meta: { title: '内容列表' },
      },
      {
        path: 'classify',
        name: 'ContentClassify',
        component: () => import('@/pages/content/classify/index.vue'),
        meta: { title: '内容分类' },
      },
      {
        path: 'topic',
        name: 'ContentTopic',
        component: () => import('@/pages/content/topic/index.vue'),
        meta: { title: '内容话题' },
      },
    ],
  },
];
