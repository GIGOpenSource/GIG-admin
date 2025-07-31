<template>
  <div class="channel-code-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="内容类型" name="code">
                <t-input
                  v-model="formData.code"
                  type="search"
                  placeholder="请输入渠道码编码"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="标题/名称" name="code">
                <t-input
                  v-model="formData.code"
                  type="search"
                  placeholder="请输入渠道码编码"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="发布人ID" name="code">
                <t-input
                  v-model="formData.code"
                  type="search"
                  placeholder="请输入渠道码编码"
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
      <t-dropdown :options="createDropdownOptions" trigger="click">
        <t-button theme="primary" @click="handleCreate"> 新建内容 </t-button>
      </t-dropdown>
    </t-row>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination">
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleAudit(row)">审核</t-link>
            <t-link theme="primary" @click="handleViewData(row)">数据</t-link>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 小说/动漫/漫画新建编辑 -->
    <edit-dialog ref="editDialogRef" />
    <!-- 常规编辑 -->
    <edit-deafult-dialog ref="editDefaultDialogRef" />
    <!-- 审核 -->
    <audit-dialog ref="auditDialogRef" />
    <!-- 数据 -->
    <data-views ref="dataViewsRef" />
  </div>
</template>
<script lang="ts" setup>
import type { DateRangePickerProps, PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { ref } from 'vue';

import { DEFAULT_PAGE_PARAMS } from '@/constants';

import AuditDialog from './components/AuditDialog.vue';
import DataViews from './components/DataViews.vue';
import EditDeafultDialog from './components/EditDefaultDialog.vue';
import EditDialog from './components/EditDialog.vue';

interface FormData {
  code: string;
  link: string;
}

const formData = ref<FormData>({
  code: '',
  link: '',
});

const createDropdownOptions = ref([
  { content: '小说/动漫/漫画', value: 1, onClick: () => editDialogRef.value.open() },
  { content: '常规内容', value: 2, onClick: () => editDefaultDialogRef.value.open() },
]);

// 小说动漫漫画编辑
const editDialogRef = ref<InstanceType<typeof EditDialog>>();
// 审核
const auditDialogRef = ref<InstanceType<typeof AuditDialog>>();
// 常规编辑
const editDefaultDialogRef = ref<InstanceType<typeof EditDeafultDialog>>();
// 数据
const dataViewsRef = ref<InstanceType<typeof DataViews>>();

// 表格字段
const COLUMNS: PrimaryTableCol[] = [
  {
    title: '序号',
    colKey: 'index',
    align: 'center',
    width: 80,
  },
  {
    title: '内容类型',
    colKey: 'link',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '分集',
    colKey: 'code',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '发布人ID',
    colKey: 'materialName',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '标签/名称',
    colKey: 'materialImage',
    align: 'center',
  },
  {
    title: '副标题/简介',
    colKey: 'materialImage',
    align: 'center',
  },
  {
    title: '内容标签',
    colKey: 'materialImage',
    align: 'center',
  },
  {
    title: '图片',
    colKey: 'materialImage',
    align: 'center',
  },
  {
    title: '状态',
    colKey: 'materialImage',
    align: 'center',
  },
  {
    title: '操作',
    colKey: 'operation',
    align: 'center',
    width: 180,
  },
];

const tableData = ref([
  { id: 1, code: 'QDM001', link: 'https://example.com/qdm001' },
  { id: 2, code: 'QDM002', link: 'https://example.com/qdm002' },
]);

const pagination = ref<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS });

const handleAudit = (row: TableRowData) => {
  auditDialogRef.value.open(row);
};
const handleViewData = (row: TableRowData) => {
  dataViewsRef.value.open(row);
};
const handleCreate = () => {
  // editDialogRef.value.open();
};
const handleEdit = (row: TableRowData) => {
  editDialogRef.value.open(row);
};
const handleDelete = (row: TableRowData) => {
  // editDialogRef.value.open(row);
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
