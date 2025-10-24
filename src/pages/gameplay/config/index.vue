<template>
  <div class="gameplay-config-container">
    <t-row :style="{ marginBottom: 'var(--td-comp-margin-xxl)' }">
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

<script setup lang="ts">
import type { PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { ref, onMounted } from 'vue';
import { DEFAULT_PAGE_PARAMS } from '@/constants';
import { getAppList, deleteApp } from '@/api/gameplay';
import EditDialog from './EditDialog.vue';

// 表格字段
const COLUMNS: PrimaryTableCol[] = [
  {
    title: '序号',
    colKey: 'serial-number',
    align: 'center',
    width: 80,
  },
  {
    title: 'APP名称',
    colKey: 'name',
    align: 'left',
    ellipsis: true,
  },
  {
    title: 'APP权限',
    colKey: 'permission',
    align: 'center',
    cell: (h: any, { row }: any) => {
      // 根据is_vip和price字段判断权限类型
      let permissionType = '免费';
      if (row.is_vip === true && row.price > 0) {
        permissionType = '金币';
      } else if (row.is_vip === true && row.price === 0) {
        permissionType = 'VIP';
      } else if (row.is_vip === false && row.price === 0) {
        permissionType = '免费';
      }
      return permissionType;
    }
  },
  {
    title: '操作',
    colKey: 'operation',
    align: 'center',
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

const editDialogRef = ref<InstanceType<typeof EditDialog>>();

// 新建逻辑
const handleCreate = () => {
  editDialogRef.value?.open();
};

// 编辑逻辑
const handleEdit = (row: TableRowData) => {
  const editData = {
    id: row.id,
    name: row.name || '',
    permission: row.permission || '',
    click_url: row.click_url || '',
    image_url: row.image_url || [],
    is_vip: row.is_vip || false,
    price: row.price || 0,
  };
  editDialogRef.value?.open(editData);
};

// Dialog 确认回调
const handleDialogConfirm = () => {
  console.log('Dialog确认回调触发');
  fetchDataList(pagination.value.current);
};

// 删除逻辑
const handleDelete = (row: TableRowData) => {
  const dialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '确认删除',
    body: `您确定要删除"${row.name}"吗？`,
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: async () => {
      try {
        const res = await deleteApp(row.id);
        MessagePlugin.success(res.message);
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

// 请求列表数据
const fetchDataList = async (page: number = pagination.value.current || pagination.value.defaultCurrent) => {
  const params = {
    type:'app',
    currentPage: page,
    pageSize: pagination.value.defaultPageSize,
  };
  try {
    const res = await getAppList(params);
    tableData.value = res.data.results;
    pagination.value.total = res.data.pagination.total;
    pagination.value.current = page;
  } catch (error) {
    console.error('获取APP列表失败:', error);
    MessagePlugin.error('获取APP列表失败');
  }
};

onMounted(() => {
  fetchDataList();
});
</script>

<style lang="less" scoped>
.gameplay-config-container {
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  border-radius: var(--td-radius-medium);

  .table-container {
    margin-top: var(--td-comp-margin-xxl);
  }
}
</style>
