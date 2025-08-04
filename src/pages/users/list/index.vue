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
                  placeholder="请输入用户名"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="所属APP" name="app">
                <t-input
                  v-model="formData.app"
                  class="form-item-content"
                  type="search"
                  :placeholder="t('components.commonTable.contractNamePlaceholder')"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="用户ID" name="uid">
                <t-input
                  v-model="formData.uid"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="手机号" name="phone">
                <t-input
                  v-model="formData.phone"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
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
            </t-col>
            <t-col :span="4">
              <t-form-item label="账号状态" name="status">
                <t-input
                  v-model="formData.status"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
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
      <t-col>
        <t-button theme="primary" @click="handleCreate"> 新建用户 </t-button>
      </t-col>
    </t-row>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination">
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" @click="handleStop(row)">禁言</t-link>
            <t-link theme="danger" @click="handleFreeze(row)">冻结</t-link>
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
        <p>是否要{{ operationType }}该账号？用户侧展示为封号状态</p>
      </template>
    </t-dialog>

    <create-dialog ref="createDialogRef" />
    <detail-dialog ref="detailDialogRef" />
  </div>
</template>
<script lang="tsx" setup>
import type { SelectProps, PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useFormatDate } from '@/hooks';

import { DEFAULT_PAGE_PARAMS, USER_STATUS } from '@/constants';
import { getUserList } from '@/api/user';

import { t } from '@/locales';

import CreateDialog from './components/CreateDialog.vue';
import DetailDialog from './components/DetailDialog.vue';

interface FormData {
  uid: string;
  username: string;
  phone: string;
  account: string;
  deviceType: string;
  channelCode: string;
  status: string;
  registerStatus: string;
  registerEvent: string;
  vipStatus: string;
  userType: string;
  app: string;
}

const searchForm = {
  uid: '',
  username: '',
  phone: '',
  account: '',
  deviceType: '',
  channelCode: '',
  status: '',
  registerStatus: '',
  userType: '',
  registerEvent: '',
  vipStatus: '',
  app: '',
};
const formData = ref<FormData>({ ...searchForm });

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
      const statusKey = row.status as keyof typeof USER_STATUS;
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
  {
    title: 'VIP状态',
    ellipsis: true,
    colKey: 'vipStatus',
  },
  {
    title: '所属APP',
    ellipsis: true,
    colKey: 'app',
  },
  {
    title: '操作',
    width: 150,
    colKey: 'operation',
  },
];
const pagination = ref<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS });

const tableData = ref<TableRowData[]>([]);

// 新建编辑
const createDialogRef = ref<InstanceType<typeof CreateDialog>>(null);
const detailDialogRef = ref<InstanceType<typeof DetailDialog>>(null);

// 确认弹窗
const confirmVisible = ref(false);
const operationType = ref('冻结');

const onConfirmOperation = () => {
  // 真实业务请发起请求
  // tableData.value.splice(operationType.value, 1);
  pagination.value.total = tableData.value.length;
  confirmVisible.value = false;
  // MessagePlugin.success('删除成功');
  // resetIdx();
};

const onCancel = () => {
  // resetIdx();
};

// 切换APP
const handleChangeApp: SelectProps['onChange'] = (ctx) => {
  console.log('Selected app:', ctx);
  // 这里可以添加处理逻辑，比如更新图表或列表数据
};

// 查询
const handleQuery = () => {
  // 真实业务请发起请求
  console.log('查询条件:', formData.value);
};
// 重置
const handleReset = () => {
  formData.value = { ...searchForm };
};

// 创建用户
const handleCreate = () => {
  createDialogRef.value?.open();
};

// 编辑
const handleEdit = (row: TableRowData) => {
  detailDialogRef.value?.open(row.id);
  console.log('编辑用户:', row);
};
// 禁言
const handleStop = (row: TableRowData) => {
  console.log('禁言用户:', row);
  operationType.value = '禁言';
  confirmVisible.value = true;
};
// 冻结
const handleFreeze = (row: TableRowData) => {
  operationType.value = '冻结';
  confirmVisible.value = true;
  console.log('冻结用户:', row);
};

const initData = async () => {
  const res = await getUserList(formData.value);
  tableData.value = res.data;
  pagination.value.total = res.total
};

onMounted(() => {
  initData();
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
