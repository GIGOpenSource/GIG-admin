<template>
  <div class="private-chat-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="输入ID" name="id">
                <t-input
                  v-model="formData.id"
                  type="search"
                  placeholder="请输入对话ID"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="选择状态" name="status">
                <t-select
                  v-model="formData.status"
                  :options="statusOptions"
                  placeholder="请选择状态"
                  clearable
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button theme="default" type="submit" :style="{ marginLeft: 'var(--td-comp-margin-s)' }"> 查询 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="dialogId">
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleView(row)">查看对话</t-link>
          </t-space>
        </template>
      </t-table>
    </div>
  </div>
  <router-view />
</template>
<script setup lang="ts">
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface FormData {
  id: string;
  status: string | number;
}

const formData = ref<FormData>({
  id: '',
  status: '',
});

const statusOptions = [
  { label: '全部', value: '' },
  { label: '正常', value: 1 },
  { label: '禁用', value: 0 },
];

const COLUMNS: PrimaryTableCol[] = [
  { title: '对话ID', colKey: 'dialogId', align: 'center', width: 120 },
  { title: '发起对话用户ID', colKey: 'fromUserId', align: 'center', width: 120 },
  { title: '对话对方用户ID', colKey: 'toUserId', align: 'center', width: 120 },
  { title: '对话消息数量', colKey: 'messageCount', align: 'center', width: 120 },
  { title: '最近更新时间', colKey: 'updateTime', align: 'center', width: 160 },
  { title: '所属APP', colKey: 'app', align: 'center', width: 120 },
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

const handleView = (row: TableRowData) => {
  console.log('🚀 ~ row:', row);

  // 查看对话逻辑
  router.push({ path: '/message/chat/detail' });
};
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
