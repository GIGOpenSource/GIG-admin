<template>
  <div class="product-config-list-container">
    <!-- <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="策略ID" name="package">
                <t-select
                  v-model="formData.package"
                  :options="packageOptions"
                  placeholder="选择策略ID"
                  clearable
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button theme="primary"> 查询 </t-button>
          <t-button theme="default"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form> -->

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

    
    <config-dialog ref="dialogRef" />
  </div>
</template>
<script lang="ts" setup>
import type { PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { ref, reactive ,onMounted } from 'vue';

import { getVipList } from '@/api/goods'

import ConfigDialog from './Dialog.vue';
import { DEFAULT_PAGE_PARAMS } from '@/constants';

interface FormData {
  package: string;
  status: string | number;
  scene: string;
}

const formData = ref<FormData>({
  package: '',
  status: '',
  scene: '',
});

const packageOptions = [
  { label: '包A', value: 'A' },
  { label: '包B', value: 'B' },
];
const statusOptions = [
  { label: '全部', value: '' },
  { label: '上线', value: 1 },
  { label: '下线', value: 0 },
];
const sceneOptions = [
  { label: '场景1', value: 'scene1' },
  { label: '场景2', value: 'scene2' },
];

const COLUMNS: PrimaryTableCol[] = [
  { title: '序号', colKey: 'serial-number', width: 80 },
  { title: '特权文案', colKey: 'powerName', ellipsis: true },
  { title: '附件', colKey: 'attachment', ellipsis: true },
  { title: '所属VIP类型', colKey: 'vipName', ellipsis: true },
  { title: '备注(后台展示)', colKey: 'remark', ellipsis: true },
  { title: '优先级', colKey: 'priority' },
  { title: '操作', colKey: 'operation',  width: 120 },
];

const tableData = ref<TableRowData[]>([]);
const pagination = reactive<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS });

const dialogRef = ref<InstanceType<typeof ConfigDialog>>();

const handleCreate = () => {
  dialogRef.value?.open();
};
const handleEdit = (row: TableRowData) => {
  dialogRef.value?.open(row);
};
const handleDelete = (row: TableRowData) => {
  // 删除逻辑
};

const featchDataList = async (page: number = pagination.defaultCurrent) => {
  const param = {
    ...formData.value,
    page,
    pageSize: pagination.defaultPageSize,
  }
  const res = await getVipList(param);
  console.log("🚀 ~ featchDataList ~ res:", res)
  tableData.value = res.data.data.data;
  pagination.total = res.data.total;
};

onMounted(() => {
  featchDataList();
})


</script>
<style lang="less" scoped>
.product-config-list-container {
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
