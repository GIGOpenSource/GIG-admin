<template>
  <div class="channel-code-list-container">
    <t-form :data="formData" :label-width="120">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="选择APP" name="code">
                <t-input
                  v-model="formData.code"
                  type="search"
                  :placeholder="'请输入渠道码编码'"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="输入菜单名称" name="code">
                <t-input
                  v-model="formData.code"
                  type="search"
                  :placeholder="'请输入渠道码编码'"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="选择菜单级别" name="code">
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
          <t-button
            theme="primary"
            type="submit"
            :style="{ marginLeft: 'var(--td-comp-margin-s)' }"
            @click="handleCreate"
          >
            新建
          </t-button>
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
import type { DateRangePickerProps, TdBaseTableProps, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { DialogPlugin } from 'tdesign-vue-next';

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
    title: '菜单级别',
    colKey: 'link',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '菜单名称',
    colKey: 'code',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '父级名称',
    colKey: 'materialName',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '展示模版',
    colKey: 'materialImage',
    align: 'center',
    width: 100,
  },
  {
    title: 'icon配置',
    colKey: 'remark',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '用户标签',
    colKey: 'tags',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '所属APP',
    colKey: 'app',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '内容标签',
    colKey: 'app',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '用户ID范围',
    colKey: 'app',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '排序',
    colKey: 'app',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '优先级',
    colKey: 'app',
    align: 'left',
    ellipsis: true,
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

const handleCreate = () => {
  // 新建渠道码逻辑
  editDialogRef.value.open();
};

const pagination = ref<TdBaseTableProps['pagination']>({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 999,
  showFirstAndLastPageBtn: true,
  totalContent: false,
});
const handleEdit = (row: TableRowData) => {
  // 编辑渠道码逻辑
};
// 删除渠道码
const handleDelete = (row: TableRowData) => {
  const confirmDia = DialogPlugin.confirm({
    header: '确认删除',
    body: `确定要删除渠道码 ${row.code} 吗？`,
    confirmBtn: '确认',
    cancelBtn: '取消',
    theme: 'danger',
    onConfirm: ({ e }) => {
      console.log('confirm button has been clicked!');
      console.log('e: ', e);
      confirmDia.hide();
    },
    onClose: ({ e, trigger }) => {
      console.log('e: ', e);
      console.log('trigger: ', trigger);
      confirmDia.hide();
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
