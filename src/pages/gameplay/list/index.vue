<template>
  <div class="gameplay-list-container">


    <t-row :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
      <t-button theme="primary" @click="handleCreate"> 新增游戏 </t-button>
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
import { getGameList, deleteGame } from '@/api/gameplay';
import EditDialog from './EditDialog.vue';

interface FormData {
  name: string;
  type: string;
  tags: string;
}

const searchForm = {
  name: '',
  type: '',
  tags: '',
};

const formData = ref<FormData>({
  ...searchForm,
});

const editDialogRef = ref<InstanceType<typeof EditDialog>>();

// 表格字段
const COLUMNS: PrimaryTableCol[] = [
  {
    title: '序号',
    colKey: 'serial-number',
    align: 'center',
    width: 80,
  },
  {
    title: '游戏名称',
    colKey: 'name',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '游戏简介',
    colKey: 'title',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '游戏权限',
    colKey: 'type',
    align: 'center',
    cell: (h, { row }: { row: any }) => {
      // 根据is_vip和price字段判断权限类型
      if (row.is_vip === true && row.price && row.price !== '') {
        return '金币';
      } else if (row.is_vip === true && (!row.price || row.price === '')) {
        return 'VIP';
      } else if (row.is_vip === false) {
        return '免费';
      }
      // 兼容旧数据，如果没有is_vip字段则使用type字段
      const typeMap: Record<string, string> = {
        vip: 'VIP',
        gold: '金币',
        free: '免费',
      };
      return typeMap[row.type] || row.type;
    },
  },
  {
    title: '游戏标签',
    colKey: 'tags',
    align: 'center',
    ellipsis: true,
  },
  {
    title: '游戏地址',
    colKey: 'click_url',
    align: 'center',
    ellipsis: true,
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

// 新增逻辑
const handleCreate = () => {
  editDialogRef.value?.open();
};

// 编辑逻辑
const handleEdit = (row: TableRowData) => {
  const editData = {
    id: row.id,
    name: row.name || '',
    brief: row.brief || '',
    description: row.description || '',
    permission: row.permission || '',
    tag: row.tag || '',
    cover: row.cover || [],
    images: row.images || [],
    url: row.url || '',
  };
  editDialogRef.value?.open(editData);
};


// Dialog 确认回调
const handleDialogConfirm = () => {
  console.log('Dialog确认回调触发，当前页:', pagination.value.current);
  fetchDataList(pagination.value.current);
};

// 删除逻辑
const handleDelete = (row: TableRowData) => {
  const dialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '确认删除',
    body: `您确定要删除游戏"${row.name}"吗？`,
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: async () => {
      try {
        const res = await deleteGame(row.id);
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
    // ...formData.value,
    type:'game',
    currentPage: page,
    pageSize: pagination.value.defaultPageSize,
  };
  console.log('请求参数:', params);
  try {
    const res = await getGameList(params);
    console.log('接口返回数据:', res.data.data);
    tableData.value = res.data.results;
    pagination.value.total = res.data.pagination.total;
    pagination.value.current = page;
    console.log('分页状态更新:', { current: page, total: res.data.pagination.total });
  } catch (error) {
    console.error('获取游戏列表失败:', error);
    MessagePlugin.error('获取游戏列表失败');
  }
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

onMounted(() => {
  fetchDataList();
});
</script>

<style lang="less" scoped>
.gameplay-list-container {
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
