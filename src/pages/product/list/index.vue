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
                  placeholder="请选择包"
                  clearable
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="选择状态" name="status">
                <t-select
                  v-model="formData.status"
                  :options="statusOptions"
                  placeholder="请选择状态"
                  clearable
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="选择场景" name="scene">
                <t-select
                  v-model="formData.scene"
                  :options="sceneOptions"
                  placeholder="请选择场景"
                  clearable
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
            type="button"
            :style="{ marginLeft: 'var(--td-comp-margin-s)' }"
            @click="handleCreate"
          >
            新建
          </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id">
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
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { ref } from 'vue';

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
  { title: '序号', colKey: 'index', align: 'center', width: 80 },
  { title: '策略名称', colKey: 'strategyName', align: 'left', ellipsis: true },
  { title: '场景', colKey: 'scene', align: 'left', ellipsis: true },
  { title: '用户浏览标签', colKey: 'userTags', align: 'left', ellipsis: true },
  { title: '促销文案', colKey: 'promotionCopy', align: 'left', ellipsis: true },
  { title: '价格', colKey: 'price', align: 'center', width: 100 },
  { title: '商品名称', colKey: 'productName', align: 'left', ellipsis: true },
  { title: '包名', colKey: 'package', align: 'left', ellipsis: true },
  { title: '优先级', colKey: 'priority', align: 'center', width: 80 },
  { title: '状态', colKey: 'status', align: 'center', width: 80 },
  { title: '操作', colKey: 'operation', align: 'center', width: 180 },
];

const tableData = ref<TableRowData[]>([
  {
    id: 1,
    strategyName: '策略A',
    scene: '场景1',
    userTags: '标签1,标签2',
    promotionCopy: '买一送一',
    price: 99,
    productName: '商品A',
    package: 'A',
    priority: 1,
    status: 1,
  },
  {
    id: 2,
    strategyName: '策略B',
    scene: '场景2',
    userTags: '标签3',
    promotionCopy: '限时折扣',
    price: 199,
    productName: '商品B',
    package: 'B',
    priority: 2,
    status: 0,
  },
]);

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
