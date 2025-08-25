<template>
  <div class="user-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="选择APP" name="name">
                <select-app v-model="formData.name" @change="handleChangeApp" />
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
      <t-button theme="primary" @click="handleCreate">
        新建
      </t-button>
    </t-row>
    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination">
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleDownload(row)">下载</t-link>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space></template
        >
      </t-table>
    </div>

    <detail-dialog ref="detailDialogRef" />
  </div>
</template>
<script lang="ts" setup>
import type { PrimaryTableCol, TableRowData, TdBaseTableProps, SelectProps } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';

import { DEFAULT_PAGE_PARAMS } from '@/constants';
import { t } from '@/locales';

import DetailDialog from './components/DetailDialog.vue';
import style from '@/config/style';

interface FormData {
  id: string;
  time: string;
  type: string;
  name: string;
}

const searchForm = {
  id: '',
  time: '',
  type: '',
  name: '',
};
const formData = ref<FormData>({ ...searchForm });

// 切换APP
const handleChangeApp: SelectProps['onChange'] = (ctx) => {
  console.log('Selected app:', ctx);
  // 这里可以添加处理逻辑，比如更新图表或列表数据
};

// 表格
const COLUMNS: PrimaryTableCol[] = [
  {
    title: '等级标识',
    fixed: 'left',
    ellipsis: true,
    align: 'left',
    colKey: 'uid',
  },
  {
    title: '等级最小消费金额',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '等级最大消费金额',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '等级状态',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '所属APP',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '创建时间',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '更新时间',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '操作',
    align: 'left',
    colKey: 'operation',
    width: 150,
  },
];
const pagination = ref<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS,
   onChange: (pageInfo: { current: number; pageSize: number }) => {
    // fetchDataList(pageInfo.current);
  },
 });

const tableData = ref<TableRowData[]>([
  {
    id: 1,
    uid: '10001',
    name: '用户1',
    no: '1234567890',
    status: 1,
    type: '普通用户',
  },
  {
    id: 2,
    uid: '10002',
    name: '用户2',
    no: '0987654321',
    status: 0,
    type: 'VIP用户',
  },
]);

const handleDownload = (row: TableRowData) => {
  console.log('下载', row);
};
const handleEdit = (row: TableRowData) => {
  console.log('编辑', row);
};
const handleDelete = (row: TableRowData) => {
  console.log('删除', row);
};

const detailDialogRef = ref<InstanceType<typeof DetailDialog>>(null);

const handleCreate = () => {
  if (detailDialogRef.value) {
    detailDialogRef.value.open();
  }
};
</script>
<style lang="less" scoped>
.user-list-container {
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
