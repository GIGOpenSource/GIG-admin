<template>
  <div class="gameplay-rules-container">
    <t-card title="玩法规则管理" :bordered="false">
      <t-row :style="{ marginBottom: 'var(--td-comp-margin-xxl)' }">
        <t-button theme="primary" @click="handleCreate"> 新建规则 </t-button>
      </t-row>

      <div class="table-container">
        <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination">
          <template #operation="{ row }">
            <t-space>
              <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
              <t-link theme="primary" @click="handleCopy(row)">复制</t-link>
              <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
            </t-space>
          </template>
          <template #status="{ row }">
            <t-tag :theme="row.status === 'active' ? 'success' : 'default'">
              {{ row.status === 'active' ? '启用' : '禁用' }}
            </t-tag>
          </template>
          <template #content="{ row }">
            <t-textarea v-model="row.content" readonly :autosize="{ minRows: 2, maxRows: 4 }" />
          </template>
        </t-table>
      </div>

      <edit-dialog ref="editDialogRef" @confirm="handleDialogConfirm" />
    </t-card>
  </div>
</template>

<script setup lang="ts">
import type { PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { ref, onMounted } from 'vue';
import { DEFAULT_PAGE_PARAMS } from '@/constants';
import { getGameplayRules, deleteGameplayRule } from '@/api/gameplay';
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
    title: '规则名称',
    colKey: 'name',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '规则类型',
    colKey: 'type',
    align: 'center',
    cell: (h, { row }: { row: any }) => {
      const typeMap: Record<string, string> = {
        participation: '参与规则',
        reward: '奖励规则',
        penalty: '惩罚规则',
        special: '特殊规则',
      };
      return typeMap[row.type] || row.type;
    },
  },
  {
    title: '规则内容',
    colKey: 'content',
    align: 'left',
    width: 300,
  },
  {
    title: '状态',
    colKey: 'status',
    align: 'center',
  },
  {
    title: '适用玩法',
    colKey: 'gameplay_name',
    align: 'center',
  },
  {
    title: '创建时间',
    colKey: 'create_time',
    align: 'center',
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
    pagination.value.current = pageInfo.current;
    pagination.value.pageSize = pageInfo.pageSize;
    fetchDataList(pageInfo.current);
  },
});

const editDialogRef = ref<InstanceType<typeof EditDialog>>();

// 新增逻辑
const handleCreate = () => {
  editDialogRef.value?.open();
};

// 编辑逻辑
const handleEdit = (row: TableRowData) => {
  editDialogRef.value?.open(row);
};

// 复制逻辑
const handleCopy = (row: TableRowData) => {
  const copyData = { ...row, id: undefined, name: `${row.name}_副本` };
  editDialogRef.value?.open(copyData);
};

// Dialog 确认回调
const handleDialogConfirm = () => {
  fetchDataList(pagination.value.current);
};

// 删除逻辑
const handleDelete = (row: TableRowData) => {
  const dialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '确认删除',
    body: `您确定要删除规则"${row.name}"吗？`,
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: async () => {
      try {
        const res = await deleteGameplayRule(row.id);
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
    currentPage: page,
    pageSize: pagination.value.defaultPageSize,
  };
  try {
    const res = await getGameplayRules(params);
    tableData.value = res.data.results;
    pagination.value.total = res.data.pagination.total;
    pagination.value.current = page;
  } catch (error) {
    console.error('获取规则列表失败:', error);
    MessagePlugin.error('获取规则列表失败');
  }
};

onMounted(() => {
  fetchDataList();
});
</script>

<style lang="less" scoped>
.gameplay-rules-container {
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  border-radius: var(--td-radius-medium);

  .table-container {
    margin-top: var(--td-comp-margin-xxl);
  }
}
</style>
