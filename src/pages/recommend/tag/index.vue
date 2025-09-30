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
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <edit-dialog ref="editDialogRef" @confirm="handleDialogConfirm" />
  </div>
</template>
<script lang="ts" setup>
import type { DateRangePickerProps, PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { ref, onMounted } from 'vue';
import { DEFAULT_PAGE_PARAMS } from '@/constants';

import EditDialog from './EditDialog.vue';
import { getTagList, deleteTag } from '@/api/recommend';
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
  const found = options.find((opt) => opt.value === value);
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
      return row.status === 'activate' ? '激活' : row.status === 'deactivate' ? '未激活' : row.status;
    },
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

const tableData = ref([]);
const pagination = ref<TdBaseTableProps['pagination']>({
  ...DEFAULT_PAGE_PARAMS,
  onChange: (pageInfo: { current: number; pageSize: number }) => {
    console.log('分页器切换:', pageInfo);
    pagination.value.current = pageInfo.current;
    pagination.value.pageSize = pageInfo.pageSize;
    fetchDataList(pageInfo.current);
  },
});

// 新增逻辑
const handleCreate = () => {
  editDialogRef.value.open();
};

const handleEdit = (row: TableRowData) => {
  editDialogRef.value.open(row);
};

// 删除逻辑
const handleDelete = (row: TableRowData) => {
  const dialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '确认删除',
    body: `您确定要删除标签"${row.name}"吗？`,
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: async () => {
      try {
        const res = await deleteTag(row.id);
        MessagePlugin.success(res.message);
        // 删除后停留在当前页
        fetchDataList(pagination.value.current);
        dialog.destroy();
      } catch (error) {
        console.error('删除失败:', error);
        MessagePlugin.error('删除失败，请重试');
        dialog.destroy();
      }
    },
    onCancel: () => {
      dialog.hide();
    },
  });
};

// Dialog 确认回调
const handleDialogConfirm = () => {
  // 编辑成功后停留在当前页
  console.log('编辑确认回调触发，当前页:', pagination.value.current);
  fetchDataList(pagination.value.current);
};

// 弹窗保存后刷新列表
// if (editDialogRef.value) {
//   editDialogRef.value.$on && editDialogRef.value.$on('confirm', () => {
//     fetchDataList();
//   });
// }
// 请求列表数据
const fetchDataList = async (page: number = pagination.value.current || pagination.value.defaultCurrent) => {
  const params = {
    ...formData.value,
    currentPage: page,
    pageSize: pagination.value.defaultPageSize,
  };
  console.log('请求参数:', params);
  const res = await getTagList(params);
  console.log('接口返回数据:', res.data.results);
  tableData.value = res.data.results;
  pagination.value.total = res.data.total;
  pagination.value.current = page;
  console.log('分页状态更新:', { current: page, total: res.data.total });
};
// 查询
const handleQuery = () => {
  pagination.value.current = 1;
  fetchDataList(1);
};

// 重置
const handleReset = () => {
  formData.value = { ...searchForm };
  pagination.value.current = 1;
  fetchDataList(1);
};
// 初始化数据
const initData = async (page: number = pagination.value.defaultCurrent) => {
  const params = {
    ...formData.value,
    currentPage: page,
    pageSize: pagination.value.defaultPageSize,
  };
  console.log('🚀 ~ initData ~ params:', params);
  console.log('🚀 ~ fetchDataList ~ params:', pagination.value);
  const res = await getTagList(params);
  console.log('🚀 ~ initData ~ res:', res);
  tableData.value = res.data.results;
  pagination.value.total = res.data.total;
  pagination.value.current = page;
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
