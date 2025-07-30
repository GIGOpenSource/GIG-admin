import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/configuration',
    name: 'configuration',
    component: Layout,
    redirect: '/configuration/code',
    meta: { title: '渠道与配置', icon: 'logo-cinema4d',  orderNo: 2 },
    children: [
      {
        path: 'code',
        name: 'ChannelCode',
        component: () => import('@/pages/channel-configuration/channel-code/index.vue'),
        meta: { title: '渠道码' },
      },
      {
        path: 'pkg',
        name: 'Pkgs',
        component: () => import('@/pages/channel-configuration/pkg/index.vue'),
        meta: { title: '产品包' },
      },
      {
        path: 'function',
        name: 'ProductFunction',
        component: () => import('@/pages/channel-configuration/product-function/index.vue'),
        meta: { title: '产品功能' },
      },
      {
        path: 'guide',
        name: 'GuidePage',
        component: () => import('@/pages/channel-configuration/guide/index.vue'),
        meta: { title: '引导页配置' },
      },
    ],
  },
];
