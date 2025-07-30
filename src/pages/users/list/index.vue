<template>
  <div class="user-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="用户名" name="name">
                <t-input
                  v-model="formData.name"
                  class="form-item-content"
                  type="search"
                  :placeholder="t('components.commonTable.contractNamePlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="所属APP" name="status">
                <t-input
                  v-model="formData.status"
                  class="form-item-content"
                  type="search"
                  :placeholder="t('components.commonTable.contractNamePlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="用户ID" name="no">
                <t-input
                  v-model="formData.no"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="手机号" name="type">
                <t-input
                  v-model="formData.no"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="帐号" name="type">
                <t-input
                  v-model="formData.no"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="设备类型" name="type">
                <t-input
                  v-model="formData.no"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="注册事件" name="type">
                <t-input
                  v-model="formData.no"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="账号状态" name="type">
                <t-input
                  v-model="formData.no"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="VIP状态" name="type">
                <t-input
                  v-model="formData.no"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="用户类型" name="type">
                <t-input
                  v-model="formData.no"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="选择APP" name="type">
                <t-input
                  v-model="formData.no"
                  class="form-item-content"
                  :placeholder="t('components.commonTable.contractNumPlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button theme="default" type="submit" :style="{ marginLeft: 'var(--td-comp-margin-s)' }"> 查询 </t-button>
          <t-button
            theme="primary"
            type="submit"
            :style="{ marginLeft: 'var(--td-comp-margin-s)' }"
            @click="handleCreate"
          >
            新建用户
          </t-button>
        </t-col>
      </t-row>
    </t-form>

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
<script lang="ts" setup>
import type { PageInfo, PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { computed, onMounted, ref } from 'vue';

import { t } from '@/locales';

import CreateDialog from './components/CreateDialog.vue';
import DetailDialog from './components/DetailDialog.vue';

interface FormData {
  name: string;
  app: string;
  no: string;
  status?: number;
  type: string;
}

const searchForm = {
  name: '',
  app: '',
  no: '',
  status: 1,
  type: '',
};
const formData = ref<FormData>({ ...searchForm });

// 表格
const COLUMNS: PrimaryTableCol[] = [
  {
    title: 'UID',
    fixed: 'left',
    ellipsis: true,
    align: 'left',
    colKey: 'uid',
  },
  {
    title: '用户名',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '手机号',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '渠道码',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '账号状态',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '注册时间',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: 'VIP状态',
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
    title: '操作',
    align: 'left',
    width: 150,
    colKey: 'operation',
  },
];
const pagination = ref<TdBaseTableProps['pagination']>({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 999,
  showFirstAndLastPageBtn: true,
  totalContent: false,
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
// 创建用户
const handleCreate = () => {
  createDialogRef.value?.open();
};
// 编辑
const handleEdit = (row: TableRowData) => {
  detailDialogRef.value?.open({ name: row.name, type: row.type });
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
