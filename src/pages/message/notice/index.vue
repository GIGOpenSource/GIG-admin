<template>
  <div class="private-chat-list-container">
    <t-row>
      <t-button theme="primary" @click="handleCreate"> 新建 </t-button>
    </t-row>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination">
        <template #operation="{ row }">
          <t-space>
            <!-- <t-link theme="primary" @click="handleEdit(row)">编辑</t-link> -->
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <edit-dialog ref="editDialogRef" @confirm="fetchDataList" />
  </div>
</template>
<script setup lang="ts">
import type { PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import {DialogPlugin,MessagePlugin } from 'tdesign-vue-next';

import { ref, reactive, onMounted } from 'vue';
import { DEFAULT_PAGE_PARAMS } from '@/constants';
import { getInformsList,delInforms } from '@/api/message';

import EditDialog from './Dialog.vue'; 

interface FormData {
  // bloggerUid: string;
  // status: string | number;
}

const formData = ref<FormData>({
  // bloggerUid:'',
  // status: '',
});
const appNameOptions = [
  { label: '商场应用', value: 'mall_app' },
  { label: '社交应用', value: 'social_app' },
  { label: '支付应用', value: 'pay_app' },
  { label: '教育应用', value: 'edu_app' },
  { label: '游戏应用', value: 'game_app' },
  { label: '办公应用', value: 'office_app' },
  { label: '医疗应用', value: 'medical_app' },
  { label: '新闻应用', value: 'news_app' }
];
const typeRelationOptions = [
  { label: '订单更新', value: 'order_update' },
  { label: '好友请求', value: 'friend_request' },
  { label: '账单', value: 'bill_reminder' },
  { label: '开始课程', value: 'course_start' },
  { label: '活动通知', value: 'activity_notice' },
  { label: '会议', value: 'meeting_reminder' },
  { label: '日程提醒', value: 'appointment_reminder' },
  { label: '信息推送', value: 'info_push' }
];

const userTypeOptions = [
  { label: '买者', value: 'buyer' },
  { label: '用户', value: 'user' },
  { label: '成员', value: 'member' },
  { label: '学生', value: 'student' },    
  { label: '玩家', value: 'palyer' },
  { label: '采访人员', value: 'emplyee' },
  { label: '病人', value: 'patient' },
  { label: '读者', value: 'reader' }
];
const editDialogRef = ref<InstanceType<typeof EditDialog>>();

const COLUMNS: PrimaryTableCol[] = [
  { title: '对话ID', colKey: 'id', align: 'center', width: 120 },
  { title: '所属APP', colKey: 'appName', align: 'center', width: 120},
  { title: '类型关系', colKey: 'typeRelation', align: 'center', width: 120 },
  { title: '用户类型', colKey: 'userType', align: 'center', width: 120,cell(h: (arg0: string, arg1: { style: string; }, arg2: string) => any, { row }: any) {
    return userTypeOptions.find(opt => opt.value === row.userType)?.label || '';} },
  { title: '通知内容', colKey: 'notificationContent', align: 'center', width: 120 },
  { title: '发送时间', colKey: 'sendTime', align: 'center', width: 120 },
  { title: '操作', colKey: 'operation', align: 'center', width: 120 },
];

const tableData = ref<TableRowData[]>([

]);
const pagination = ref<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS,
   onChange: (pageInfo: { current: number; pageSize: number }) => {
    fetchDataList(pageInfo.current);
  },
 });

  // 新建逻辑
const handleCreate = (row: TableRowData) => {
  editDialogRef.value?.open(row);
};
 // 编辑逻辑
const handleEdit = (row: TableRowData) => {
  editDialogRef.value?.open(row);
};
// 删除逻辑
const handleDelete = (row: TableRowData) => {
  // 删除逻辑
   const dialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '确认删除',
    body: `您确定要删除消息通知 ${row.notificationContent} 吗？`,
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: async () => {
      // 执行删除操作
      const res = await delInforms(row.id);
      MessagePlugin.success(res.message);
      fetchDataList();
      dialog.destroy();
    },
    onCancel: () => {
      dialog.hide();
    },
  });
};
const fetchDataList = async (page: number= pagination.value.defaultCurrent) => {
  const params = {
    // ...formData.value,
    page,
    size: pagination.value.defaultPageSize,
  };
  console.log('🚀 ~ fetchDataList ~ params:', pagination.value);
  const res = await getInformsList(params);
  console.log('🚀 ~ fetchDataList ~ data:', res);
  tableData.value = res.data.data;
  pagination.value.total = res.data.total;
};
// 查询
// const handleQuery = () => {

//   fetchDataList()
// };
// // 重置
// const handleReset = () => {
//   formData.value = {
//   bloggerUid: '',
//   status: '',
// }
//   fetchDataList()
// };
onMounted(() => {
  fetchDataList();
});
</script>
<style lang="less" scoped>
.private-chat-list-container {
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  border-radius: var(--td-radius-medium);

  .table-container {
    margin-top: var(--td-comp-margin-xxl);
  }
}
.operation-container {
  text-align: right;
}
</style>
