import Layout from '@/layouts/index.vue';

export default [
  {
    path: '/product',
    name: 'product',
    component: Layout,
    redirect: '/product/list',
    meta: { title: '商品管理', icon: 'shop-1', orderNo: 6 },
    children: [
      {
        path: 'list',
        name: 'productList',
        component: () => import('@/pages/product/list/index.vue'),
        meta: { title: '商品列表(金币/VIP)' },
      },
      {
        path: 'config',
        name: 'productConfig',
        component: () => import('@/pages/product/config/index.vue'),
        meta: { title: '会员权益' },
      },
      // {
      //   path:"link",
      //   name: 'productLink',
      //   component: () => import('@/pages/product/link/index.vue'),
      //   meta: { title: '外部链接' },
      // }
    ],
  },
];
