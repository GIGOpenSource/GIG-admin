<template>
  <div class="blogger-crawler-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="输入ID" name="id">
                <t-input v-model="formData.id" type="search" placeholder="'输入博主ID'" />
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
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { ref } from 'vue';

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
  { label: '全部', value: '' },
  { label: '正常', value: 1 },
  { label: '禁用', value: 0 },
];

const COLUMNS: PrimaryTableCol[] = [
  {
    title: '序号',
    colKey: 'index',
    align: 'center',
    width: 80,
  },
  {
    title: '博主ID',
    colKey: 'id',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '主页地址',
    colKey: 'homepage',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '状态',
    colKey: 'status',
    align: 'center',
    width: 100,
  },
  {
    title: '操作',
    colKey: 'operation',
    align: 'center',
    width: 120,
  },
];

const tableData = ref<TableRowData[]>([
  { id: '10001', homepage: 'https://blogger.com/10001', status: 1 },
  { id: '10002', homepage: 'https://blogger.com/10002', status: 0 },
]);

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
