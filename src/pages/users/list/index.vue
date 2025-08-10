<template>
  <div class="user-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="用户名" name="username">
                <t-input
                  v-model="formData.username"
                  class="form-item-content"
                  type="search"
                  placeholder="输入用户名"
                />
              </t-form-item>
            </t-col>
            <!-- <t-col :span="4">
              <t-form-item label="所属APP" name="app">
                <t-input
                  v-model="formData.app"
                  class="form-item-content"
                  type="search"
                  :placeholder="t('components.commonTable.contractNamePlaceholder')"
                />
              </t-form-item>
            </t-col> -->
            <t-col :span="4">
              <t-form-item label="用户ID" name="id">
                <t-input v-model="formData.id" class="form-item-content" placeholder="输入用户ID" />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="手机号" name="phone">
                <t-input v-model="formData.phone" class="form-item-content" placeholder="输入手机号" />
              </t-form-item>
            </t-col>
            <!-- <t-col :span="4">
              <t-form-item label="帐号" name="account">
                <t-input
                  v-model="formData.account"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="设备类型" name="deviceType">
                <t-input
                  v-model="formData.deviceType"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="注册事件" name="registerEvent">
                <t-input
                  v-model="formData.registerEvent"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                />
              </t-form-item>
            </t-col> -->
            <t-col :span="4">
              <t-form-item label="账号状态" name="status">
                <t-select v-model="formData.status" placeholder="选择账号状态">
                  <t-option v-for="op in USER_STATUS" :key="op.text" :label="op.text" :value="op.value"></t-option>
                </t-select>
              </t-form-item>
            </t-col>
            <!-- <t-col :span="4">
              <t-form-item label="VIP状态" name="vipStatus">
                <t-input
                  v-model="formData.vipStatus"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="用户类型" name="userType">
                <t-input
                  v-model="formData.userType"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="选择APP" name="app">
                <select-app v-model="formData.app" @change="handleChangeApp"> </select-app>
              </t-form-item>
            </t-col> -->
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button theme="primary" @click="handleQuery"> 查询 </t-button>
          <t-button theme="default" @click="handleReset"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <!-- <t-row :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
      <t-col>
        <t-button theme="primary" @click="handleCreate"> 新建用户 </t-button>
      </t-col>
    </t-row> -->

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination" @change="onPageChange">
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" @click="handleOperation('stop', 1, row)" v-if="row.bannedStatus == 0">禁言</t-link>
            <t-link theme="warning" @click="handleOperation('stop', 0, row)" v-else>解禁</t-link>
            <t-link theme="danger" @click="handleOperation('freeze', 1, row)" v-if="row.freezeStatus == 0">冻结</t-link>
            <t-link theme="warning" @click="handleOperation('freeze', 0, row)" v-else>解冻</t-link>
          </t-space>
        </template>
      </t-table>
    </div>

    <t-dialog
      v-model:visible="confirmVisible"
      theme="danger"
      center
      header="提醒"
      :on-cancel="onCancel"
      @confirm="onConfirmOperation"
    >
      <template #body>
        <p>{{ operations.content }}</p>
      </template>
    </t-dialog>

    <!-- <create-dialog ref="createDialogRef" /> -->
    <detail-dialog ref="detailDialogRef" />
  </div>
</template>
<script lang="tsx" setup>
import {
  type SelectProps,
  type PrimaryTableCol,
  type TableRowData,
  type TdBaseTableProps,
  type TableProps,
  MessagePlugin,
} from 'tdesign-vue-next';
import { reactive, onMounted, ref } from 'vue';
import { useFormatDate } from '@/hooks';

import { DEFAULT_PAGE_PARAMS, USER_STATUS } from '@/constants';
import { getUserList, editUserStatus } from '@/api/user';

// import CreateDialog from './components/CreateDialog.vue';
import DetailDialog from './components/DetailDialog.vue';

interface FormData {
  id: string;
  username: string;
  phone: string;
  // account: string;
  // deviceType: string;
  // channelCode: string;
  status: string;
  // registerStatus: string;
  // registerEvent: string;
  // vipStatus: string;
  // userType: string;
  // app: string;
}

const searchForm = {
  id: '',
  username: '',
  phone: '',
  // account: '',
  // deviceType: '',
  // channelCode: '',
  status: '',
  // registerStatus: '',
  // userType: '',
  // registerEvent: '',
  // vipStatus: '',
  // app: '',
};
const formData = ref<FormData>({ ...searchForm });

// 更新操作 id
const editId = ref(0);

// 表格
const COLUMNS: PrimaryTableCol[] = [
  {
    title: 'UID',
    fixed: 'left',
    ellipsis: true,
    colKey: 'id',
  },
  {
    title: '用户名',
    ellipsis: true,
    colKey: 'username',
  },
  {
    title: '手机号',
    ellipsis: true,
    colKey: 'phone',
  },
  // {
  //   title: '渠道码',
  //   ellipsis: true,
  //   colKey: 'channelCode',
  // },
  {
    title: '账号状态',
    ellipsis: true,
    colKey: 'status',
    cell: (h, { row }) => {
      let statusKey = 0 as keyof typeof USER_STATUS;
      if (row.status == 1) {
        if (row.bannedStatus == 1) statusKey = 1;
        if (row.freezeStatus == 1) statusKey = 2;
      }
      // const statusKey = row.status as keyof typeof USER_STATUS;
      return (
        <t-tag shape="round" theme={USER_STATUS[statusKey].theme} variant="light-outline">
          {USER_STATUS[statusKey].text}
        </t-tag>
      );
    },
  },
  {
    title: '注册时间',
    ellipsis: true,
    colKey: 'createTime',
    cell: (h, { row }) => useFormatDate().formatDate(row.createTime),
  },
  // {
  //   title: 'VIP状态',
  //   ellipsis: true,
  //   colKey: 'vipStatus',
  // },
  // {
  //   title: '所属APP',
  //   ellipsis: true,
  //   colKey: 'app',
  // },
  {
    title: '操作',
    width: 150,
    colKey: 'operation',
  },
];
const pagination = ref<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS });

const tableData = ref<TableRowData[]>([]);

// 新建
// const createDialogRef = ref<InstanceType<typeof CreateDialog>>(null);
// 编辑
const detailDialogRef = ref<InstanceType<typeof DetailDialog>>(null);

// 确认弹窗
const confirmVisible = ref(false);

const defaultOperation = {
  content: '',
  bannedStatus: 0,
  freezeStatus: 0,
};
// 弹窗名称
const operations = reactive({
  ...defaultOperation,
});

// 确认操作
const onConfirmOperation = async () => {
  const res = await editUserStatus({
    userId: editId.value,
    freezeStatus: operations.freezeStatus,
    bannedStatus: operations.bannedStatus,
  });

  if (res.code !== 0) {
    return MessagePlugin.error({
      content: res.message,
    });
  }
  MessagePlugin.success({
    content: res.message,
  });
  fetchDataList();
  confirmVisible.value = false;
};

const onCancel = () => {
  editId.value = 0;
  Object.assign(operations, defaultOperation);
};

// 切换APP
// const handleChangeApp: SelectProps['onChange'] = (ctx) => {
//   console.log('Selected app:', ctx);
// };

// 查询
const handleQuery = () => {
  fetchDataList();
};
// 重置
const handleReset = () => {
  formData.value = { ...searchForm };
  fetchDataList();
};

// 创建用户
// const handleCreate = () => {
//   createDialogRef.value?.open();
// };

// 编辑
const handleEdit = (row: TableRowData) => {
  detailDialogRef.value?.open(row.id);
};
// 禁言/冻结
const handleOperation = (type: string = 'stop', status: number = 1, row: TableRowData) => {
  editId.value = row.id;
  if (type === 'stop') {
    operations.bannedStatus = status;
    operations.freezeStatus = row.freezeStatus;
    operations.content = status === 1 ? '是否要禁言该账号？用户侧展示为封号状态' : '是否要解除禁言该账号？';
  } else {
    operations.freezeStatus = status;
    operations.bannedStatus = row.bannedStatus;
    operations.content = status === 1 ? '是否要冻结该账号？用户侧展示为封号状态' : '是否要解除冻结该账号？';
  }
  confirmVisible.value = true;
};

// 分页变化
const onPageChange: TableProps['onChange'] = async (changeParams, triggerAndData) => {
  const { current } = changeParams.pagination;
  fetchDataList(current);
};

// 请求数据
const fetchDataList = async (page: number = pagination.value.defaultCurrent) => {
  const { data } = await getUserList({
    ...formData.value,
    page,
    size: pagination.value.defaultPageSize,
  });
  tableData.value = data.data;
  pagination.value.total = data.total;
  pagination.value.current = page;
};

onMounted(() => {
  fetchDataList();
});
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
