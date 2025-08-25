<template>
  <div class="blogger-crawler-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="博主ID" name="id">
                <t-input v-model="formData.bloggerUid" type="search" placeholder="输入博主ID" />
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
          <t-button theme="primary" @click="handleQuery"> 查询 </t-button>
          <t-button theme="default" @click="handleReset"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <t-row :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
      <t-button theme="primary" @click="handleCreate"> 新建 </t-button>
    </t-row>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination">
        <template #avatar="{ row }">
           <t-avatar :image="row.avatar" />
        </template>
        <template #counts="{ row }">
          <span>{{ row.followingCount }}/{{ row.followerCount }}</span>
        </template>
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">审核</t-link>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <edit-dialog ref="editDialogRef" @confirm="fetchDataList"/>
  </div>
</template>
<script lang="ts" setup>
import {DialogPlugin,MessagePlugin } from 'tdesign-vue-next';
import type { PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { ref, reactive, onMounted } from 'vue';

import { getBlogList,createBlog,updateBlog,delBlog } from '@/api/blogger';
import { DEFAULT_PAGE_PARAMS } from '@/constants';

import EditDialog from './Dialog.vue';

interface FormData {
  bloggerUid: string;
  status: string | number;
}

const formData = ref<FormData>({
  bloggerUid:'',
  status: '',
});

const editDialogRef = ref<InstanceType<typeof EditDialog>>();

const statusOptions = [
  { label: '全部', value: '' },
  { label: '正常', value: 'success' },
  { label: '禁用', value: 'not_updated' },
];

const COLUMNS: PrimaryTableCol[] = [
  {
    title: 'UID',
    colKey: 'bloggerUid',
  },
  {
    title: '昵称',
    colKey: 'bloggerNickname',
    ellipsis: true,
  },
  {
    title: '头像',
    colKey: 'avatar',
  },
  {
    title: '作品数',
    colKey: 'worksCount',
  },
  {
    title: '作品比例',
    colKey: 'worksRatio',
  },
  {
    title: '手机号',
    colKey: 'phone',
    ellipsis: true,
  },
  {
    title: '更新时间',
    ellipsis: true,
    colKey: 'updateTime',
  },
  {
    title: '标签',
    colKey: 'tags',
    ellipsis: true,
  },
  {
    title: '签名',
    colKey: 'bloggerSignature',
    ellipsis: true,
  },
  {
    title: '关注/粉丝',
    colKey: 'counts',
    ellipsis: true,
  },
  {
    title: '账户',
    colKey: 'account',
    ellipsis: true,
  },
  {
    title: '类型',
    colKey: 'type',
  },
  {
    title: '操作',
    colKey: 'operation',
    width: 180,
  },
];

const pagination = reactive<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS 
,
  onChange: (pageInfo: { current: number; pageSize: number }) => {
    fetchDataList(pageInfo.current);
  },
});
const tableData = ref<TableRowData[]>([]);

const handleCreate = (row: TableRowData) => {
  // 新建逻辑
 editDialogRef.value.open(row);
};

const handleEdit = (row: TableRowData) => {  
  // 编辑逻辑
    editDialogRef.value.open(row);
};

const handleDelete = (row: TableRowData) => {
  // 删除逻辑
   const dialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '确认删除',
    body: `您确定要删除博主 ${row.bloggerNickname} 吗？`,
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: async () => {
      // 执行删除操作
     
      const res = await delBlog(row.id);
      MessagePlugin.success(res.message);
      fetchDataList();
      dialog.destroy();
    },
    onCancel: () => {
      dialog.hide();
    },
  });
};

const fetchDataList = async (page: number= pagination.defaultCurrent) => {
  const params = {
    ...formData.value,
    page,
    pageSize: pagination.pageSize,
  };
  const res = await getBlogList(params);
  console.log('🚀 ~ fetchDataList ~ data:', res);
  tableData.value = res.data.data;
  pagination.total = res.data.total;
};
// 查询
const handleQuery = () => {

  fetchDataList()
};
// 重置
const handleReset = () => {
  formData.value = {
  bloggerUid: '',
  status: '',
}
  fetchDataList()
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
