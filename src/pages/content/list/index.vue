<template>
  <div class="channel-code-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="内容类型" name="contentType">
                <t-select v-model="formData.contentType">
                  <t-option v-for="val in TYPES" :key="val" :value="val" :label="val" />
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="标题/名称" name="title">
                <t-input v-model="formData.title" type="search" placeholder="请输入标题/名称" />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="发布人ID" name="authorId">
                <t-input v-model="formData.authorId" type="search" placeholder="请输入发布人ID" />
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

    <t-row :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
      <t-dropdown :options="createDropdownOptions" trigger="click" maxColumnWidth="120">
        <t-button theme="primary" @click="handleCreate"> 新建内容 </t-button>
      </t-dropdown>
    </t-row>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination">
        <template #diversity="{ row }">
          <t-link theme="primary" v-if="['NOVEL', 'COMIC', 'ANIME'].includes(row.contentType)" @click="handleReviewDiversity(row)"> 查看</t-link>
          <span v-else>-</span>
        </template>
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleAudit(row)" v-if="row.status === 'DRAFT'">审核</t-link>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="primary" @click="handleViewData(row)" v-if="row.status === 'PUBLISHED'">数据</t-link>
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
import {
  DialogPlugin,
  MessagePlugin,
  type DateRangePickerProps,
  type PrimaryTableCol,
  type TableRowData,
  type TdBaseTableProps,
} from 'tdesign-vue-next';
import { ref, onMounted } from 'vue';

import { DEFAULT_PAGE_PARAMS } from '@/constants';
import { TYPES } from '../constants';

import { getContentList, delContent, dataStatistics } from '@/api/content';

import AuditDialog from './components/AuditDialog.vue';
import DataViews from './components/DataViews.vue';
import EditDeafultDialog from './components/EditDefaultDialog.vue';
import EditDialog from './components/EditDialog.vue';

interface FormData {
  title: string;
  authorId: string;
  contentType: string;
}

const searchForm = {
  title: '',
  contentType: '',
  authorId: '',
};
const formData = ref<FormData>({
  ...searchForm,
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
    colKey: 'serial-number',
  },
  {
    title: '内容类型',
    colKey: 'contentType',
    ellipsis: true,
  },
  {
    title: '分集',
    colKey: 'diversity',
    ellipsis: true,
  },
  {
    title: '发布人ID',
    colKey: 'authorId',
    ellipsis: true,
  },
  {
    title: '标签/名称',
    colKey: 'title',
    ellipsis: true,
  },
  {
    title: '副标题/简介',
    colKey: 'description',
    ellipsis: true,
  },
  // {
  //   title: '内容标签',
  //   colKey: 'materialImage',
  //   align: 'center',
  // },
  // {
  //   title: '图片',
  //   colKey: 'materialImage',
  //   align: 'center',
  // },
  {
    title: '状态',
    colKey: 'status',
    ellipsis: true,
  },
  {
    title: '操作',
    colKey: 'operation',
    align: 'center',
    width: 180,
  },
];

// 表格数据
const tableData = ref([]);

const pagination = ref<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS });

// 审核
const handleAudit = (row: TableRowData) => {
  auditDialogRef.value.open(row);
};
// 查看分集
const handleReviewDiversity = (row: TableRowData) => {
  // dataViewsRef.value.open(row);
};
// 查看数据
const handleViewData = (row: TableRowData) => {
  dataViewsRef.value.open(row);
};
// 创建
const handleCreate = () => {
  // editDialogRef.value.open();
};
// 编辑
const handleEdit = (row: TableRowData) => {
  editDialogRef.value.open(row);
};

// 删除
const handleDelete = (row: TableRowData) => {
  const confirmDia = DialogPlugin({
    theme: 'danger',
    header: '提示',
    body: '确定删除当前内容吗？',
    confirmBtn: '确定',
    cancelBtn: '取消',
    onConfirm: async ({ e }) => {
      const res = await delContent({id: row.id});
      console.log("🚀 ~ handleDelete ~ res:", res)
      MessagePlugin.success(res.message);
      confirmDia.hide();
    },
    onClose: ({ e, trigger }) => {
      confirmDia.hide();
    },
  });
};

// 查询
const handleQuery = () => {
  console.log(formData.value);
};
// 重置
const handleReset = () => {
  formData.value = { ...searchForm };
};

// 初始化数据
const initData = async (page: number = pagination.value.defaultCurrent) => {
  const params = {
    ...formData.value,
    page,
    size: pagination.value.defaultPageSize,
  };
  const res = await getContentList(params);
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
