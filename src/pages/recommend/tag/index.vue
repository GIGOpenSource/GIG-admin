<template>
  <div class="channel-code-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="标签名" name="name">
                <t-input
                  v-model="formData.name"
                  type="search"
                  placeholder="输入标签名"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
           <t-col :span="4">
              <t-form-item label="标签状态" name="status">
                <t-select v-model="formData.status" placeholder="选择标签状态" clearable>
                  <t-option key="activate" value="activate" label="激活" />
                  <t-option key="deactivate" value="deactivate" label="未激活" />
                </t-select>
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button theme="primary"  @click="handleQuery"> 查询 </t-button>
          <t-button theme="default" @click="handleReset"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination">
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <edit-dialog ref="editDialogRef" @confirm="fetchDataList()" />
  </div>
</template>
<script lang="ts" setup>
import type { DateRangePickerProps, PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { ref , onMounted } from 'vue';
import { DEFAULT_PAGE_PARAMS } from '@/constants';

import EditDialog from './EditDialog.vue';
import { getTagList } from '@/api/recommend';
import { h } from 'vue';

interface FormData {
  name: string;
  status: string;
}

const tagTypeOptions = [
  { label: '内容', value: 'content' },
  { label: '兴趣', value: 'interest' },
  { label: '系统', value: 'system' },
];
const searchForm = {
  name: '',
  status: '',
};
const formData = ref<FormData>({
   ...searchForm,
});

const editDialogRef = ref<InstanceType<typeof EditDialog>>();
  function getLabel(options: { label: string; value: string }[], value: string) {
  const found = options.find(opt => opt.value === value);
  return found ? found.label : value;
}

// 表格字段
const COLUMNS: PrimaryTableCol[] = [
  {
    title: '序号',
    colKey: 'serial-number',
    align: 'center',
    width: 80,
  },
  {
    title: '标签名',
    colKey: 'name',
    align: 'left',
    ellipsis: true,
  },
//   {
//     title: '标签使用人数',
//     colKey: 'usage_count',
//     align: 'left',
//     ellipsis: true,
//     cell(h: (arg0: string, arg1: { style: string; }, arg2: string) => any, { row }: any) {
//     return tagTypeOptions.find(opt => opt.value === row.tagType)?.label || '';
// }
//   },
  {
    title: '标签使用人数',
    colKey: 'usage_count',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '标签状态',
    colKey: 'status',
    align: 'center',
    cell: (h, { row }) => {
      return row.status === 'activate' ? '激活' :
             row.status === 'deactivate' ? '未激活' : row.status;
    }
  },
   {
    title: '标签描述',
    colKey: 'description',
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
]);
const pagination = ref<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS ,
   onChange: (pageInfo: { current: number; pageSize: number }) => {
    fetchDataList(pageInfo.current);
  },
});

const handleEdit = (row: TableRowData) => {
  editDialogRef.value.open(row);
};

// 弹窗保存后刷新列表
// if (editDialogRef.value) {
//   editDialogRef.value.$on && editDialogRef.value.$on('confirm', () => {
//     fetchDataList();
//   });
// }
// 请求列表数据
  const fetchDataList = async (page: number = pagination.value.defaultCurrent) => {
     const params = {
       ...formData.value,
       page,
       size: pagination.value.defaultPageSize
     };
 const res = await getTagList(params);
  console.log('111111111111', res.data.results);
  tableData.value = res.data.results
  pagination.value.total = res.data.total;
  pagination.value.current = page;
};
// 查询
const handleQuery = () => {
  fetchDataList()
};

// 重置
const handleReset = () => {
  formData.value = { ...searchForm };
  initData()
};
// 初始化数据
const initData = async (page: number =pagination.value.defaultCurrent) => {
  const params = {
    ...formData.value,
    page,
    size: pagination.value.defaultPageSize,
  };
  console.log('🚀 ~ initData ~ params:', params);
  console.log('🚀 ~ fetchDataList ~ params:', pagination.value);
  const res = await getTagList(params);
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
