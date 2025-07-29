<template>
  <div class="channel-code-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="选择级别" name="code">
                <t-input
                  v-model="formData.code"
                  type="search"
                  :placeholder="'请输入渠道码编码'"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="父级名称" name="code">
                <t-input
                  v-model="formData.code"
                  type="search"
                  :placeholder="'请输入渠道码编码'"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="分类名称" name="code">
                <t-input
                  v-model="formData.code"
                  type="search"
                  :placeholder="'请输入渠道码编码'"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button theme="default" type="submit" :style="{ marginLeft: 'var(--td-comp-margin-s)' }"> 查询 </t-button>
          <t-button theme="primary" type="submit" :style="{ marginLeft: 'var(--td-comp-margin-s)' }" @click="handleCreate"> 新建 </t-button>
        </t-col>
      </t-row>
    </t-form>

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

    <EditDialog ref="editDialogRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { type DateRangePickerProps, type TdBaseTableProps, type PrimaryTableCol, type TableRowData, DialogPlugin } from 'tdesign-vue-next';

import EditDialog from './EditDialog.vue';

interface FormData {
  code: string;
  link: string;
}

const formData = ref<FormData>({
  code: '',
  link: '',
});

const editDialogRef = ref<InstanceType<typeof EditDialog>>();

// 表格字段
const COLUMNS: PrimaryTableCol[] = [
  {
    title: '序号',
    colKey: 'index',
    align: 'center',
    width: 80,
  },
  {
    title: '分类名称',
    colKey: 'link',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '分类级别',
    colKey: 'code',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '父级',
    colKey: 'materialName',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '分类icon',
    colKey: 'materialImage',
    align: 'center',
  },
  {
    title: '操作',
    colKey: 'operation',
    align: 'center',
    width: 120,
  },
];

const tableData = ref([
  { id: 1, code: 'QDM001', link: 'https://example.com/qdm001' },
  { id: 2, code: 'QDM002', link: 'https://example.com/qdm002' },
]);

const pagination = ref<TdBaseTableProps['pagination']>({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 999,
  showFirstAndLastPageBtn: true,
  totalContent: false,
});

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
