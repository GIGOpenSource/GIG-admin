import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/recommend',
    name: 'TagRecommend',
    component: Layout,
    redirect: '/recommend/tags',
    meta: { title: '标签与推荐', icon: 'tag', orderNo: 3 },
    children: [
      {
        path: 'tags',
        name: 'Tags',
        component: () => import('@/pages/recommend/tag/index.vue'),
        meta: { title: '标签列表' },
      },
      {
        path: 'strategy',
        name: 'RecommendStrategy',
        component: () => import('@/pages/recommend/strategy/index.vue'),
        meta: { title: '推荐策略' },
      },
    ],
  },
];
