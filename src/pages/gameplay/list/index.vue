<template>
  <div class="gameplay-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="玩法名称" name="name">
                <t-input
                  v-model="formData.name"
                  type="search"
                  placeholder="输入玩法名称"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="玩法状态" name="status">
                <t-select v-model="formData.status" placeholder="选择玩法状态" clearable>
                  <t-option key="active" value="active" label="启用" />
                  <t-option key="inactive" value="inactive" label="禁用" />
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="玩法类型" name="type">
                <t-select v-model="formData.type" placeholder="选择玩法类型" clearable>
                  <t-option key="daily" value="daily" label="日常玩法" />
                  <t-option key="event" value="event" label="活动玩法" />
                  <t-option key="special" value="special" label="特殊玩法" />
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
      <t-button theme="primary" @click="handleCreate"> 新建玩法 </t-button>
    </t-row>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination">
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="primary" @click="handleConfig(row)">配置</t-link>
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
        <template #status="{ row }">
          <t-tag :theme="row.status === 'active' ? 'success' : 'default'">
            {{ row.status === 'active' ? '启用' : '禁用' }}
          </t-tag>
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
import { getGameplayList, deleteGameplay } from '@/api/gameplay';
import EditDialog from './EditDialog.vue';

interface FormData {
  name: string;
  status: string;
  type: string;
}

const searchForm = {
  name: '',
  status: '',
  type: '',
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
    title: '玩法名称',
    colKey: 'name',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '玩法状态',
    colKey: 'status',
    align: 'center',
  },
  {
    title: '玩法类型',
    colKey: 'type',
    align: 'center',
    cell: (h, { row }: { row: any }) => {
      const typeMap: Record<string, string> = {
        daily: '日常玩法',
        event: '活动玩法',
        special: '特殊玩法',
      };
      return typeMap[row.type] || row.type;
    },
  },
  {
    title: '玩法描述',
    colKey: 'description',
    align: 'center',
  },
  {
    title: '参与人数',
    colKey: 'participant_count',
    align: 'center',
  },
  {
    title: '创建时间',
    colKey: 'create_time',
    align: 'center',
  },
  {
    title: '更新时间',
    colKey: 'update_time',
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
  editDialogRef.value?.open(row);
};

// 配置逻辑
const handleConfig = (row: TableRowData) => {
  // 跳转到配置页面
  window.location.href = `/gameplay/config?id=${row.id}`;
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
    body: `您确定要删除玩法"${row.name}"吗？`,
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: async () => {
      try {
        const res = await deleteGameplay(row.id);
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
    ...formData.value,
    currentPage: page,
    pageSize: pagination.value.defaultPageSize,
  };
  console.log('请求参数:', params);
  try {
    const res = await getGameplayList(params);
    console.log('接口返回数据:', res.data.data);
    tableData.value = res.data.results;
    pagination.value.total = res.data.pagination.total;
    pagination.value.current = page;
    console.log('分页状态更新:', { current: page, total: res.data.pagination.total });
  } catch (error) {
    console.error('获取玩法列表失败:', error);
    MessagePlugin.error('获取玩法列表失败');
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
