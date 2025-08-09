<template>
  <div class="channel-code-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="选择级别" name="level">
                <t-select v-model="formData.level" placeholder="选择级别">
                  <t-option value="1">一级</t-option>
                  <t-option value="2">二级</t-option>
                  <t-option value="3">三级</t-option>
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="父级名称" name="parentId">
                <t-input
                  v-model="formData.parentId"
                  type="search"
                  placeholder="输入渠道码编码"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="分类名称" name="name">
                <t-input
                  v-model="formData.name"
                  type="search"
                  placeholder="输入渠道码编码"
                  :style="{ minWidth: '134px' }"
                />
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
      <t-button theme="primary" @click="handleCreate"> 新建分类 </t-button>
    </t-row>
    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination">
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
import type { DateRangePickerProps, PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { DialogPlugin } from 'tdesign-vue-next';
import { ref, onMounted } from 'vue';

import { DEFAULT_PAGE_PARAMS } from '@/constants';

import { contentCategory } from '@/api/content'

import EditDialog from './EditDialog.vue';

interface FormData {
  level: string;
  name: string;
  parentId: string;
}

const formData = ref<FormData>({
  level: '',
  name: '',
  parentId: '',
});

const editDialogRef = ref<InstanceType<typeof EditDialog>>();

// 表格字段
const COLUMNS: PrimaryTableCol[] = [
  {
    title: '序号',
    colKey: 'serial-number',
  },
  {
    title: '分类名称',
    colKey: 'name',
    ellipsis: true,
  },
  {
    title: '分类级别',
    colKey: 'level',
    ellipsis: true,
  },
  {
    title: '父级',
    colKey: 'parentName',
    ellipsis: true,
  },
  {
    title: '分类icon',
    colKey: 'iconUrl',
  },
  {
    title: '操作',
    colKey: 'operation',
    align: 'center',
    width: 120,
  },
];

const tableData = ref([]);

const pagination = ref<TdBaseTableProps['pagination']>({...DEFAULT_PAGE_PARAMS});

// 创建
const handleCreate = (row: TableRowData) => {
  editDialogRef.value.open(row);
};
// 编辑
const handleEdit = (row: TableRowData) => {
  editDialogRef.value.open(row);
};
// 删除
const handleDelete = (row: TableRowData) => {
  const dialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '确认删除',
    body: '您确定要删除此分类吗？',
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: () => {
      // 执行删除操作
      console.log('删除分类:', row);
      dialog.destroy();
    },
    onCancel: () => {
      dialog.hide();
    },
  });
};

// 初始化数据
const initData = async (page: number = pagination.value.defaultCurrent) => {
  const params = {
    ...formData.value,
    page,
    size: pagination.value.defaultPageSize,
  };
  const res = await contentCategory(params);
  console.log('🚀 ~ initData ~ res:', res);

  tableData.value = res.data.data.records;
  pagination.value.total = res.data.data.total;
};

onMounted(() => {
  initData();
});
</script>
<style lang="less" scoped>
.channel-code-list-container {
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
