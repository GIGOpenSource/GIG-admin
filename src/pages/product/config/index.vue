<template>
  <div class="product-config-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="策略ID" name="package">
                <t-select
                  v-model="formData.package"
                  :options="packageOptions"
                  :placeholder="'请选择策略ID'"
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
      <t-table
        hover
        :data="tableData"
        :columns="COLUMNS"
        row-key="id"
      >
        <template #operation="{ row }">
          <t-space>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>
    <ConfigDialog ref="dialogRef" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
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
  { title: '特权文案', colKey: 'strategyName', align: 'left', ellipsis: true },
  { title: '附件', colKey: 'scene', align: 'left', ellipsis: true },
  { title: '所属VIP类型', colKey: 'userTags', align: 'left', ellipsis: true },
  { title: '备注(后台展示)', colKey: 'promotionCopy', align: 'left', ellipsis: true },
  { title: '优先级', colKey: 'price', align: 'center', width: 100 },
  { title: '操作', colKey: 'operation', align: 'center', width: 120 },
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
