<template>
  <div class="task-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="任务名称" name="name">
                <t-input
                  v-model="formData.task_template__name__icontains"
                  type="search"
                  placeholder="输入任务名称"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="领取状态" name="status">
                <t-select v-model="formData.status" placeholder="选择任务领取状态" clearable>
                  <t-option key="empty" value="" label="全部状态" />
                  <t-option key="pending" value="pending" label="待领取" />
                  <t-option key="claimed" value="claimed" label="已领取" />
                  <t-option key="completed" value="completed" label="已完成" />
                  <t-option key="expired" value="expired" label="已过期" />
                </t-select>
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="领取人" name="user_name">
                <t-input
                  v-model="formData.user__user_nickname__icontains"
                  type="search"
                  placeholder="输入领取人名称"
                  :style="{ minWidth: '134px' }"
                />
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

<script setup lang="ts">
import type { PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { ref, onMounted } from 'vue';
import { DEFAULT_PAGE_PARAMS } from '@/constants';
import { getTaskList, deleteTask, getRewardTaskList } from '@/api/task';
import EditDialog from './EditDialog.vue';
import { int } from '@es-joy/jsdoccomment';

interface FormData {
  user__user_nickname__icontains: string;
  status: string;
  task_template__name__icontains: string;
  pageSize:string;
  currentPage: int;
}

const searchForm = {
  user__user_nickname__icontains: '',
  status: '',
  task_template__name__icontains: '',
  pageSize:'1',
  currentPage:1,
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
    title: '任务类型',
    colKey: 'task_template_type',
    align: 'center',
    cell: (h, { row }: { row: any }) => {
      const typeMap: Record<string, string> = {
        daily: '每日任务',
        checkin: '签到任务',
        novice: '新手任务',
      };
      return typeMap[row.task_template_type] || row.task_template_type;
    },
  },
  {
    title: '任务名称',
    colKey: 'task_template_name',
    align: 'center',
  },
  {
    title: '任务状态',
    colKey: 'status',
    align: 'center',
    cell: (h, { row }: { row: any }) => {
      const typeMap: Record<string, string> = {
        pending: '等待领取',
        claimed: '已领取',
      };
      return typeMap[row.status] || row.status;
    },
  },
  {
    title: '任务领取人',
    colKey: 'user_name',
    align: 'center',
  },
  {
    title: '签到时长',
    colKey: 'data',
    align: 'center',
    cell: (h, { row }: { row: any }) => {
      // 检查是否为签到任务
      if (row.task_template_type !== 'checkin') {
        return '-';
      }
      // 获取签到时间数组
      const claimedTimes = row.data?.claimed_times || [];
      if (!Array.isArray(claimedTimes) || claimedTimes.length === 0) {
        return '0天';
      }
      // 计算连续签到天数（仅基于日期）
      const consecutiveDays = calculateConsecutiveDaysSimple(claimedTimes);
      return `${consecutiveDays}天`;
    },
  },
  {
    title: '领取时间',
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
    pagination.value.current = pageInfo.current;
    pagination.value.pageSize = pageInfo.pageSize;
    fetchDataList(pageInfo.current);
  },
});
// 计算连续签到天数
// 计算连续签到天数
const calculateConsecutiveDaysSimple = (claimedTimes: string[]): number => {
  // 添加类型检查，确保 claimedTimes 是数组
  if (!Array.isArray(claimedTimes)) {
    return 0;
  }

  if (claimedTimes.length === 0) {
    return 0;
  }

  // 转换为 YYYY-MM-DD 格式的日期字符串并去重排序
  const dates = Array.from(
    new Set(
      claimedTimes.map(time => {
        // 添加对单个时间项的类型检查
        if (typeof time !== 'string') {
          return '';
        }
        const date = new Date(time);
        // 检查日期是否有效
        if (isNaN(date.getTime())) {
          return '';
        }
        return date.toISOString().split('T')[0]; // 只取日期部分
      }).filter(date => date !== '') // 过滤掉无效日期
    )
  ).sort();

  // 如果没有有效日期
  if (dates.length === 0) {
    return 0;
  }

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // 如果只有一个签到记录
  if (dates.length === 1) {
    // 只有当这个记录是今天或昨天时才算1天
    if (dates[0] === today || dates[0] === yesterdayStr) {
      return 1;
    }
    // 如果唯一记录既不是今天也不是昨天，则返回0
    return 0;
  }

  // 多个签到记录的情况 - 从最后一天开始计算连续天数
  let consecutiveCount = 1;

  // 检查今天是否有签到记录
  const hasTodayCheck = dates.includes(today);
  if (!hasTodayCheck) {
    // 如果今天没有签到，则检查昨天是否有签到
    if (!dates.includes(yesterdayStr)) {
      // 如果昨天也没有签到，则连续天数为0
      return 0;
    }
  }

  // 从最近的日期开始向前查找连续签到
  for (let i = dates.length - 1; i > 0; i--) {
    const currentDate = new Date(dates[i]);
    const previousDate = new Date(dates[i - 1]);
    // 计算日期差（天）
    const diffTime = Math.abs(currentDate.getTime() - previousDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      // 相邻日期，连续计数加1
      consecutiveCount++;
    } else {
      // 非相邻日期，中断连续
      break;
    }
  }
  return consecutiveCount;
};

// 新增逻辑
const handleCreate = () => {
  editDialogRef.value?.open();
};

// 编辑逻辑
const handleEdit = (row: TableRowData) => {
  editDialogRef.value?.open(row);
};

// Dialog 确认回调
const handleDialogConfirm = () => {
  // 编辑/新建成功后停留在当前页
  fetchDataList(pagination.value.current);
};

// 删除逻辑
const handleDelete = (row: TableRowData) => {
  const dialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '确认删除',
    body: `您确定要删除任务"${row.name}"吗？`,
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: async () => {
      try {
        const res = await deleteTask(row.id);
        MessagePlugin.success(res.message);
        // 删除后停留在当前页
        fetchDataList(pagination.value.current);
        dialog.destroy();
      } catch (error) {
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
  console.log('请求参数:', formData.value);
  const params = {
    ...formData.value,
    currentPage: page,
    pageSize: pagination.value.defaultPageSize,
  };
  try {
    const res = await getRewardTaskList(params);
    tableData.value = res.data.results;
    pagination.value.total = res.data.pagination.total;
    pagination.value.current = page;
  } catch (error) {
    MessagePlugin.error('获取任务列表失败');
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
.task-list-container {
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
