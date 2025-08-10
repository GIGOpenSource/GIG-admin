<template>
  <div class="product-config-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="选择包" name="package">
                <t-select
                  v-model="formData.package"
                  :options="packageOptions"
                  placeholder="选择包"
                  clearable
                  
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="选择状态" name="status">
                <t-select
                  v-model="formData.status"
                  :options="statusOptions"
                  placeholder="选择状态"
                  clearable
                  
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="选择场景" name="scene">
                <t-select
                  v-model="formData.scene"
                  :options="sceneOptions"
                  placeholder="选择场景"
                  clearable
                  
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
    </t-form>

    <t-row :style="{ marginTop: 'var(--td-comp-margin-xxl)' }">
      <t-button theme="primary" @click="handleCreate"> 新建 </t-button>
    </t-row>
    
    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination">
        <template #operation="{ row }">
          <t-space>
            <t-link theme="success" @click="handleOnline(row)">上线/下线</t-link>
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
import { ref, reactive, onMounted } from 'vue';

import { DEFAULT_PAGE_PARAMS } from '@/constants';

import { getGoodsList } from '@/api/goods';

import ConfigDialog from './Dialog.vue';

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
  { title: '策略名称', colKey: 'name', ellipsis: true },
  { title: '场景', colKey: 'scene', align: 'left', ellipsis: true },
  { title: '用户浏览标签', colKey: 'userTags', align: 'left', ellipsis: true },
  { title: '促销文案', colKey: 'promotionCopy', align: 'left', ellipsis: true },
  { title: '价格', colKey: 'price' },
  { title: '商品名称', colKey: 'name', ellipsis: true },
  { title: '包名', colKey: 'packageName', ellipsis: true },
  { title: '优先级', colKey: 'priority'},
  { title: '状态', colKey: 'status' },
  { title: '操作', colKey: 'operation', width: 180 },
];

const pagination = reactive<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS });
const tableData = ref([])

const dialogRef = ref<InstanceType<typeof ConfigDialog>>();

const handleCreate = () => {
  dialogRef.value?.open();
};
const handleEdit = (row: TableRowData) => {
  dialogRef.value?.open(row);
};
const handleOnline = (row: TableRowData) => {
  // 上线/下线逻辑
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
  const res = await getGoodsList(param);
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
