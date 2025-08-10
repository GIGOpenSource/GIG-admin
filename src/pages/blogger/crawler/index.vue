<template>
  <div class="blogger-crawler-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="输入ID" name="id">
                <t-input v-model="formData.id" type="search" placeholder="输入博主ID" />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="选择状态" name="status">
                <t-select v-model="formData.status" :options="statusOptions" placeholder="选择状态" clearable />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button theme="primary"> 查询 </t-button>
          <t-button theme="default"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <t-row :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
      <t-button theme="primary" type="submit" @click="handleCreate"> 新建 </t-button>
    </t-row>
    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id">
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>
    <edit-dialog ref="editDialogRef" />
  </div>
</template>
<script lang="ts" setup>
import type { PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { ref, reactive, onMounted } from 'vue';

import { getBlogList } from '@/api/blogger';
import { DEFAULT_PAGE_PARAMS } from '@/constants';

import EditDialog from './Dialog.vue';

interface FormData {
  id: string;
  status: string | number;
}

const formData = ref<FormData>({
  id: '',
  status: '',
});

const editDialogRef = ref<InstanceType<typeof EditDialog>>();

const statusOptions = [
  { label: '未更新', value: 1 },
  { label: '已更新', value: 0 },
];

const COLUMNS: PrimaryTableCol[] = [
  {
    title: '序号',
    colKey: 'serial-number',
    width: 80,
  },
  {
    title: '博主ID',
    colKey: 'bloggerUid',
    ellipsis: true,
  },
  {
    title: '主页地址',
    colKey: 'homepageUrl',
    ellipsis: true,
  },
  {
    title: '状态',
    colKey: 'status',
  },
  {
    title: '操作',
    colKey: 'operation',
    width: 120,
  },
];

const tableData = ref<TableRowData[]>([]);
const pagination = reactive<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS });

const handleCreate = () => {
  // 新建逻辑
  editDialogRef.value.open();
};

const handleEdit = (row: TableRowData) => {
  // 编辑逻辑
  editDialogRef.value.open(row);
};

const handleDelete = (row: TableRowData) => {
  // 删除逻辑
};

const fetchDataList = async (page: number= pagination.defaultCurrent) => {
  const params = {
    ...formData.value,
    page,
    pageSize: pagination.pageSize,
  };
  const res = await getBlogList(params);
  console.log('🚀 ~ fetchDataList ~ data:', res);
  tableData.value = res.data.data.data;
  pagination.total = res.data.data.total;
};

onMounted(() => {
  fetchDataList();
});
</script>
<style lang="less" scoped>
.blogger-crawler-list-container {
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
