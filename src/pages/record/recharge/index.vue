<template>
  <div class="blogger-crawler-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="选择包" name="packageName">
                <t-select
                  v-model="formData.packageName"
                  :options="packageOptions"
                  placeholder="选择包"
                  clearable
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="订单类型" name="orderType">
                 <t-select
                  v-model="formData.orderType"
                  :options="orderTypeOptions"
                  placeholder="选择订单类型"
                  clearable
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button theme="primary" @click="handleQuery" > 查询 </t-button>
          <t-button theme="default"  @click="handleReset"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table
        hover
        :data="tableData"
        :columns="COLUMNS"
        row-key="id"
        :pagination="pagination"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { ref, onMounted,reactive } from 'vue';
import { getRechargeList} from '@/api/record';
import { DEFAULT_PAGE_PARAMS } from '@/constants';

interface FormData {
  packageName: string | number;
  orderType: string | number;
}

const formData = ref<FormData>({
  packageName: '',
  orderType: '',
});
//包名选择 
const packageOptions = [
  { label: '全部', value: '' },
  { label: '正常', value: 1 },
  { label: '禁用', value: 0 },
];
const orderTypeOptions = [
  { label: '商品购买', value: 'goods' },
  { label: '内容购买', value: 'content' },
  { label: 'VIP购买', value: 'subscription' },
  { label: '金币充值', value: 'coin' },
];

const COLUMNS: PrimaryTableCol[] = [
  {
    title: '序号',
    colKey: 'id',
    align: 'center',
    width: 80,
  },
  {
    title: '订单ID',
    colKey: 'orderNo',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '用户UID',
    colKey: 'userId',
    align: 'center',
    width: 80,
  },
  {
    title: '订单类型',
    colKey: 'orderType',
    align: 'center',
    width: 100,
        cell(h: (arg0: string, arg1: { style: string; }, arg2: string) => any, { row }: any) {
    return orderTypeOptions.find(opt => opt.value === row.orderType)?.label || '';}

  },
  {
    title: '充值名称',
    colKey: 'goodsName',
    align: 'center',
    width: 100,
  },
  {
    title: '消费金额',
    colKey: 'amount',
    align: 'left',
    ellipsis: true,
    width: 120,
  },
  {
    title: '支付状态',
    colKey: 'status',
    align: 'center',
    width: 140,
  },
  {
    title: '包名',
    colKey: 'packageName',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '订单时间',
    colKey: 'createTime',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '到账状态',
    colKey: 'settlementStatus',
    align: 'center',
    width: 120,
  },
];
const pagination = reactive<TdBaseTableProps['pagination']>({
  ...DEFAULT_PAGE_PARAMS,
  onChange: (pageInfo: { current: number; pageSize: number }) => {
    fetchDataList(pageInfo.current);
  },
});

const tableData = ref<TableRowData[]>([
]);
const fetchDataList = async (page: number = pagination.defaultCurrent) => {
// ...existing code...
  const params = {
    ...formData.value,
    page,
    size: pagination.defaultPageSize,
  };
  const res = await getRechargeList(params);
  console.log('🚀 ~ fetchDataList ~ data:', res);
  tableData.value = res.data.data;
  pagination.total = res.data.total;
  // pagination.current = page;
};
// 查询
const handleQuery = () => {

  fetchDataList()
};
// 重置
const handleReset = () => {
  formData.value = {
  packageName: '',
  orderType: '',
}
  fetchDataList()
};
onMounted(() => {
  fetchDataList();
});
const handleCreate = () => {
  // 新建逻辑
};

const handleEdit = (row: TableRowData) => {
  // 编辑逻辑
};

const handleDelete = (row: TableRowData) => {
  // 删除逻辑
};
</script>
<style lang="less" scoped>
.blogger-crawler-list-container {
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
