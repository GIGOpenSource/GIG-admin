<template>
  <div class="private-chat-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="输入内容" name="search">
                <t-input v-model="formData.search" type="search" placeholder="输入内容" />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="发起用户名" name="status">
                <t-input v-model="formData.sender_nickname" type="search" placeholder="输入发起对话用户名" />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button theme="primary" @click="handleQuery"> 查询 </t-button>
          <t-button theme="default" @click="handleReset"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="dialogId" :pagination="pagination">
        <!-- <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleView(row)">查看对话</t-link>
          </t-space>
        </template> -->
      </t-table>
    </div>
  </div>
  <router-view />
</template>
<script setup lang="ts">
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { type TdBaseTableProps } from 'tdesign-vue-next';
import { DEFAULT_PAGE_PARAMS } from '@/constants';
import { getMessageList } from '@/api/message';

import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface FormData {
  search: string;
  sender_nickname: string;
}
const searchForm = {
  search: '',
  sender_nickname: '',
};
const formData = ref<FormData>({
  ...searchForm,
});

const statusOptions = [
  { label: '已发送', value: 'sent' },
  { label: '已交付', value: 'delivered' },
  { label: '已读', value: 'read' },
  { label: '已删除', value: 'deleted' },
];

const COLUMNS: PrimaryTableCol[] = [
  { title: '对话ID', colKey: 'id', align: 'center', width: 120 },
  { title: '发起对话用户ID', colKey: 'sender_id', align: 'center', width: 120 },
  { title: '发起对话用户名', colKey: 'sender_nickname', align: 'center', width: 120 },
  { title: '对话对方用户ID', colKey: 'receiver_id', align: 'center', width: 120 },
  { title: '对话对方用户名', colKey: 'receiver_nickname', align: 'center', width: 120 },
  // { title: '对话消息数量', colKey: 'send_count', align: 'center', width: 120 },
  { title: '对话内容', colKey: 'content', align: 'center', width: 160 },
  { title: '最近更新时间', colKey: 'update_time', align: 'center', width: 160 },
  // { title: '操作', colKey: 'operation', align: 'center', width: 120 },
];

const tableData = ref<TableRowData[]>([]);
const pagination = ref<TdBaseTableProps['pagination']>({
  ...DEFAULT_PAGE_PARAMS,
  onChange: (pageInfo: { current: number; pageSize: number }) => {
    fetchDataList(pageInfo.current);
  },
});

const handleView = (row: TableRowData) => {
  console.log('🚀 ~ row:', row);

  // 查看对话逻辑
  router.push({ path: '/message/chat/detail', query: { id: row.id } });
};
// 查询
const handleQuery = () => {
  fetchDataList();
};
// 请求数据
const fetchDataList = async (page: number = pagination.value.defaultCurrent) => {
  let params = { ...formData.value };
  const { data } = await getMessageList({
    ...params,
    currentPage: page,
    pageSize: pagination.value.defaultPageSize,
  });
  tableData.value = data.results;
  pagination.value.total = data.total;
  pagination.value.current = page;
};
// 重置
const handleReset = () => {
  formData.value = { ...searchForm };
  pagination.value.current = 1;
  initData(1);
};

// 初始化数据
const initData = async (page: number = pagination.value.defaultCurrent) => {
  const params = {
    ...formData.value,
    currentPage: page,
    pageSize: pagination.value.defaultPageSize,
  };
  const res = await getMessageList(params);
  console.log('🚀 ~ initData ~ res:', res);

  tableData.value = res.data.results;
  pagination.value.total = res.data.total;
};

onMounted(() => {
  initData();
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
