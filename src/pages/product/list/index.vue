<template>
  <div class="product-config-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="选择包" name="package">
                <!-- <t-select v-model="formData.packageName" :options="packageOptions" placeholder="包" clearable /> -->
                  <t-input v-model="formData.packageName" type="search" placeholder="输入包名" />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="选择状态" name="status">
                <t-select v-model="formData.status" :options="statusOptions" placeholder="选择状态" clearable />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="策略名称" name="scene">
               <t-input v-model="formData.strategyScene" type="search" placeholder="输入策略名称" />
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
            <t-link theme="success" @click="handleOnline(row)">上线/下线</t-link>
            <t-link theme="primary" @click="handleEdit(row)">编辑</t-link>
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>
    <config-dialog ref="dialogRef" @confirm="featchDataList()" />
  </div>
</template>
<script lang="ts" setup>
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import type { PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { ref, reactive, onMounted } from 'vue';

import { DEFAULT_PAGE_PARAMS } from '@/constants';

import { getGoodsList, deleteGoods, changeGoodsStatus } from '@/api/goods';

import ConfigDialog from './Dialog.vue';

interface FormData {
  packageName: string;
  status: string | number;
  strategyScene: string;
}

const formData = ref<FormData>({
  packageName: '',
  status: '',
  strategyScene: '',
});

const packageOptions = [
  { label: '包A', value: 'A' },
  { label: '包B', value: 'B' },
];
const statusOptions = [
  { label: '全部', value: '' },
  { label: '上线', value: 'Y' },
  { label: '下线', value: 'N'
   },
];
const sceneOptions = [
  { label: '场景1', value: 'scene1' },
  { label: '场景2', value: 'scene2' },
];

const COLUMNS: PrimaryTableCol[] = [
  { title: '序号', colKey: 'serial-number', width: 80 },
  { title: '策略名称场景', colKey: 'strategyScene', ellipsis: true },
  { title: '商品描述', colKey: 'description', align: 'left', ellipsis: true },
  { title: '价格', colKey: 'price' },
    { title: '商品类型', colKey: 'goodsType', ellipsis: true,

      cell: (h, { row }) => row.goodsType == 'coin' ? '金币' : row.goodsType == 'goods' ? '商品' : row.goodsType == 'subscription' ? '订阅':'内容'
     },
  { title: '商品名称', colKey: 'name', ellipsis: true },
  { title: '包名', colKey: 'packageName', ellipsis: true },
  { title: '优先级', colKey: 'sortOrder' },
{
    title: "状态",
    colKey: "isOnline",
  cell: (h, { row }) => row.isOnline == 'Y' ? '上线' : '下线'
},
  { title: '操作', colKey: 'operation', width: 180 },
];

const pagination = reactive<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS });
const tableData = ref([])

const dialogRef = ref<InstanceType<typeof ConfigDialog>>();
//新增
const handleCreate = (row: TableRowData) => {
  dialogRef.value?.open(row);
};
//编辑
const handleEdit = (row: TableRowData) => {
  dialogRef.value?.open(row);
};
const handleOnline = async (row: TableRowData) => {
  let status = row.status == 'Y' ? 'N' : 'Y'
  // 上线/下线逻辑
  const res = await changeGoodsStatus(row.id, status);
  MessagePlugin.success(res.message);
  featchDataList()
};
const handleDelete = (row: TableRowData) => {
  const dialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '确认删除',
    body: `您确定要删除 ${row.name} 分类吗？`,
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: async () => {
      // 执行删除操作
      console.log('删除分类:', row);
      const res = await deleteGoods(row.id);
      MessagePlugin.success(res.message);
      featchDataList()
      dialog.destroy();
    },
    onCancel: () => {
      dialog.hide();
    },
  });
};

// 查询
const handleQuery = () => {

  featchDataList()
};
// 重置
const handleReset = () => {
  formData.value = {
    packageName: '',
    status: '',
    strategyScene: '',
  }
  featchDataList()
};
const featchDataList = async (page: number = pagination.defaultCurrent) => {
  const param = {
    ...formData.value,
    page,
    pageSize: pagination.defaultPageSize,
  }
  const res = await getGoodsList(param);
  console.log("🚀 ~ featchDataList ~ res:", res)
  tableData.value = res.data.data.records;
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
