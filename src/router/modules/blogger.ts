import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/blogger',
    name: 'blogger',
    component: Layout,
    redirect: '/blogger/list',
    meta: { title: '博主管理', icon: 'usergroup',  orderNo: 5  },
    children: [
      {
        path: 'list',
        name: 'BloggerList',
        component: () => import('@/pages/blogger/list/index.vue'),
        meta: { title: '博主列表' },
      },
      {
        path: 'crawler',
        name: 'BloggerCrawler',
        component: () => import('@/pages/blogger/crawler/index.vue'),
        meta: { title: '爬虫列表' },
      },
    ],
  },
];
