<template>
  <div class="channel-code-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="内容标题" name="search">
                <t-input
                  v-model="formData.search"
                  type="search"
                  placeholder="输入内容标题"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="是否VIP" name="is_vip">
                <t-select v-model="formData.is_vip" placeholder="选择是否VIP" clearable>
                  <t-option key="true" :value="true" label="是" />
                  <t-option key="false" :value="false" label="否" />
                </t-select>
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
      <!-- <t-dropdown :options="createDropdownOptions" trigger="click" maxColumnWidth="120">
        <t-button theme="primary" @click="handleCreate"> 新建内容 </t-button>
      </t-dropdown> -->
    </t-row>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination" :key="paginationKey">
        <template #diversity="{ row }">
          <t-link
            theme="primary"
            v-if="['NOVEL', 'COMIC', 'ANIME'].includes(row.contentType)"
            @click="handleReviewDiversity(row)"
          >
            查看</t-link
          >
          <span v-else>-</span>
        </template>
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <!-- 小说/动漫/漫画新建编辑 -->
    <edit-dialog ref="editDialogRef" @confirm="initData" />
    <!-- 常规编辑 -->
    <edit-deafult-dialog ref="editDefaultDialogRef" @confirm="initData" />
    <!-- 审核 -->
    <audit-dialog ref="auditDialogRef" @confirm="initData" />
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
import { log } from 'node:console';

interface FormData {
  search: string;
  is_vip: boolean | null;
}

const searchForm = {
  search: '',
  is_vip: null as boolean | null,
};
const formData = ref<FormData>({
  ...searchForm,
});

const createDropdownOptions = ref([
  { content: '小说/动漫/漫画', value: 1, onClick: (row: TableRowData) => editDialogRef.value.open(row) },
  { content: '常规内容', value: 2, onClick: (row: TableRowData) => editDefaultDialogRef.value.open(row) },
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
    colKey: 'id',
  },
  {
    title: '内容标题',
    colKey: 'title',
    ellipsis: true,
  },
  {
    title: '内容描述',
    colKey: 'description',
    ellipsis: true,
  },
  {
    title: '内容类型',
    colKey: 'contentType',
    ellipsis: true,
    cell: (h, { row }) => (row.type == 'long' ? '长视频' : row.type == 'short' ? '短视频' : ''),
  },
  {
    title: '发布人ID',
    colKey: 'author.id',
    ellipsis: true,
  },
  {
    title: '发布人名称',
    colKey: 'author.user_nickname',
    ellipsis: true,
  },
  {
    title: '视频地址',
    colKey: 'data',
    ellipsis: true,
  },
  {
    title: '封面地址',
    colKey: 'cover_url',
    align: 'center',
  },
  {
    title: '点赞数',
    colKey: 'like_count',
    align: 'center',
  },
  {
    title: '评论数',
    colKey: 'comment_count',
    align: 'center',
  },
  {
    title: '是否VIP',
    colKey: 'is_vip',
    ellipsis: true,
    cell: (h, { row }) => (row.is_vip == true ? '是' : '否'),
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
// 分页器重新渲染的key
const paginationKey = ref(0);

const pagination = ref<TdBaseTableProps['pagination']>({
  ...DEFAULT_PAGE_PARAMS,
  onChange: (pageInfo: { current: number; pageSize: number }) => {
    console.log('分页器切换:', pageInfo);
    pagination.value.current = pageInfo.current;
    pagination.value.pageSize = pageInfo.pageSize;
    fetchDataList(pageInfo.current);
  },
});

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
  console.log('zoiulerma ');

  // editDialogRef.value.open();
};
// 编辑
const handleEdit = (row: TableRowData) => {
  if (row.contentType == 'NOVEL') {
    editDialogRef.value.open(row);
  } else {
    editDefaultDialogRef.value.open(row);
  }
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
      const res = await delContent({ id: row.id });
      console.log('🚀 ~ handleDelete ~ res:', res);
      MessagePlugin.success(res.message);
      initData();
      confirmDia.hide();
    },
    onClose: ({ e, trigger }) => {
      confirmDia.hide();
    },
  });
};

// 查询
const handleQuery = () => {
  pagination.value.current = 1;
  paginationKey.value++; // 强制重新渲染分页器
  fetchDataList(1);
};

// 请求数据
const fetchDataList = async (page: number = pagination.value.defaultCurrent) => {
  let params: any = { ...formData.value };
  // 过滤掉空值参数
  Object.keys(params).forEach((key) => {
    if (params[key] === '' || params[key] === null || params[key] === undefined) {
      delete params[key];
    }
  });

  const { data } = await getContentList({
    ...params,
    currentPage: page,
    pageSize: pagination.value.defaultPageSize,
  });
  tableData.value = data.results;
  pagination.value = {
    ...pagination.value,
    total: data.pagination.total,
    current: page,
  };
};
// 重置
const handleReset = () => {
  formData.value = { ...searchForm };
  pagination.value.current = 1;
  paginationKey.value++; // 强制重新渲染分页器
  fetchDataList(1);
};

// 初始化数据
const initData = async (page: number = pagination.value.defaultCurrent) => {
  const params = {
    ...formData.value,
    currentPage: page,
    pageSize: pagination.value.defaultPageSize,
  };
  const res = await getContentList(params);
  console.log('🚀 ~ initData ~ res:', res);

  tableData.value = res.data.results;
  pagination.value.total = res.data.pagination.total;
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
