// import Blank from '@/layouts/blank.vue';
// import Layout from '@/layouts/index.vue';

// export default [
//   {
//     path: '/message',
//     name: 'message',
//     component: Layout,
//     redirect: '/message/chat',
//     meta: { title: '消息管理', icon: 'system-messages', orderNo: 6 },
//     children: [
//       {
//         path: 'chat',
//         name: 'messageChats',
//         component: Blank,
//         redirect: '/message/chat',
//         meta: { title: '私聊管理' },
//         children: [
//           {
//             path: '',
//             name: 'messageChat',
//             component: () => import('@/pages/message/private-chat/index.vue'),
//             meta: { title: '', hidden: true },
//           },
//           {
//             path: 'detail',
//             name: 'messageChatDetail',
//             component: () => import('@/pages/message/private-chat/detail.vue'),
//             meta: { title: '对话详情', hidden: true },
//           },
//         ],
//       },

//       {
//         path: 'notice',
//         name: 'messageNotice',
//         component: () => import('@/pages/message/notice/index.vue'),
//         meta: { title: '消息通知' },
//       },
//     ],
//   },
// ];
