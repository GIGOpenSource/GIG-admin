<template>
  <div class="private-chat-list-container">
    <t-row>
      <t-button theme="primary" @click="handleCreate"> 新建 </t-button>
    </t-row>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="dialogId">
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" @click="handleDel(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <edit-dialog ref="editDialogRef" />
  </div>
</template>
<script setup lang="ts">
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { ref } from 'vue';

import EditDialog from './Dialog.vue';

const editDialogRef = ref<InstanceType<typeof EditDialog>>();

const COLUMNS: PrimaryTableCol[] = [
  { title: '对话ID', colKey: 'dialogId', align: 'center', width: 120 },
  { title: '所属APP', colKey: 'app', align: 'center', width: 120 },
  { title: '类型关系', colKey: 'app1', align: 'center', width: 120 },
  { title: '用户类型', colKey: 'app2', align: 'center', width: 120 },
  { title: '通知内容', colKey: 'app3', align: 'center', width: 120 },
  { title: '发送时间', colKey: 'app4', align: 'center', width: 120 },
  { title: '操作', colKey: 'operation', align: 'center', width: 120 },
];

const tableData = ref<TableRowData[]>([
  {
    dialogId: 'D10001',
    fromUserId: 'U001',
    toUserId: 'U002',
    messageCount: 35,
    updateTime: '2025-07-30 10:00:00',
    app: 'APP-A',
  },
  {
    dialogId: 'D10002',
    fromUserId: 'U003',
    toUserId: 'U004',
    messageCount: 12,
    updateTime: '2025-07-29 15:20:00',
    app: 'APP-B',
  },
]);

const handleCreate = () => {
  editDialogRef.value?.open();
};
const handleEdit = (row: TableRowData) => {
  editDialogRef.value?.open(row);
};
const handleDel = (row: TableRowData) => {};
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
