<template>
  <div class="blogger-crawler-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="充值类型" name="pay_channel">
                <t-select
                  v-model="formData.pay_channel"
                  :options="payChannelOptions"
                  placeholder="选择充值类型"
                  clearable
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" align="right">
          <t-button theme="primary" @click="handleQuery"> 查询 </t-button>
          <t-button theme="default" @click="handleReset"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination" :loading="loading" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { ref, onMounted, reactive } from 'vue';
import { getRechargeList } from '@/api/record';
import { DEFAULT_PAGE_PARAMS } from '@/constants';

interface FormData {
  pay_channel: string | number;
}

const formData = ref<FormData>({
  pay_channel: '',
});
const payChannelOptions = [
  { label: '金币', value: 'gold' },
  { label: 'vip', value: 'vip' },
];

const COLUMNS: PrimaryTableCol[] = [
  {
    title: '序号',
    colKey: 'index',
    align: 'center',
    width: 80,
    cell: (h: any, { rowIndex }: any) => rowIndex + 1,
  },
  {
    title: '订单ID',
    colKey: 'trade_no',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '用户',
    colKey: 'player_name',
    align: 'center',
  },
  {
    title: '充值名称',
    colKey: 'pay_channel',
    align: 'center',
    cell: (h: any, { row }: any) => {
      const channel = row.pay_channel;
      if (channel === 'gold') {
        return '金币充值';
      } else if (channel === 'vip') {
        return 'VIP充值';
      }
      return channel || '未知';
    },
  },
  {
    title: '消费金额',
    colKey: 'cash_amount',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '订单时间',
    colKey: 'create_time',
    align: 'left',
    ellipsis: true,
  },
];
const pagination = reactive<TdBaseTableProps['pagination']>({
  ...DEFAULT_PAGE_PARAMS,
  onChange: (pageInfo: { current: number; pageSize: number }) => {
    fetchDataList(pageInfo.current);
  },
});

const tableData = ref<TableRowData[]>([]);
const loading = ref(false);

const fetchDataList = async (page: number = pagination.defaultCurrent) => {
  try {
    loading.value = true;
    const params = {
      ...formData.value,
      page,
      size: pagination.defaultPageSize,
    };
    const res = await getRechargeList(params);
    console.log('🚀 ~ fetchDataList ~ data:', res);
    tableData.value = res.data.results;
    pagination.total = res.data.pagination.total;
  } catch (error) {
    console.error('获取充值记录失败:', error);
  } finally {
    loading.value = false;
  }
};
// 查询
const handleQuery = () => {
  fetchDataList();
};
// 重置
const handleReset = () => {
  formData.value = {
    pay_channel: '',
  };
  fetchDataList();
};
onMounted(() => {
  fetchDataList();
});
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
</style>
