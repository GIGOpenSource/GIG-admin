<template>
  <t-card :bordered="false">
    <t-table :data="tableData" :columns="TABLE_COLUMNS" row-key="productName" :pagination="pagination"> </t-table>
  </t-card>
</template>
<script setup lang="ts">
import type { TdBaseTableProps } from 'tdesign-vue-next';
import { ref, reactive, onMounted } from 'vue';

import { DEFAULT_PAGE_PARAMS } from '@/constants';

import { SALE_TEND_LIST } from '../constants';

const TABLE_COLUMNS: TdBaseTableProps['columns'] = [
  { colKey: 'date', title: '日期', fixed: 'left' },
  { colKey: 'type', title: '类型', ellipsis: true },
  { colKey: 'dailyActive', title: '日活' },
  { colKey: 'onlineCount', title: '当前在线' },
  { colKey: 'newCount', title: '新增数量' },
  { colKey: 'rechargeUserCount', title: '充值人数' },
  { colKey: 'newUserRechargeAmount', title: '新用户充值金额' },
  { colKey: 'rechargeAmount', title: '充值金额' },
  { colKey: 'coinOrderCount', title: '金币订单数' },
  { colKey: 'vipOrderCount', title: 'VIP订单数' },
  { colKey: 'userConsumeCoin', title: '用户消费金币' },
  { colKey: 'channelRechargeCoin', title: '渠道充值金币' },
  { colKey: 'newUserCount', title: '新用户数' },
  { colKey: 'platformStats', title: '所属端统计', ellipsis: true },
  { colKey: 'newPayRate', title: '新增付费率' },
  { colKey: 'activePayRate', title: '活跃付费率' },
  { colKey: 'payUserActiveRate', title: '付费用户活跃率' },
  { colKey: 'userNewVideoCount', title: '用户新增视频数' },
  { colKey: 'userCoinWithdraw', title: '用户金币体现' },
  { colKey: 'userWithdrawCount', title: '用户提现笔数' },
  { colKey: 'newAgentCount', title: '新增代理数' },
];

const pagination = reactive<TdBaseTableProps['pagination']>({ ...DEFAULT_PAGE_PARAMS });

const tableData = ref<TdBaseTableProps['data']>([]);

// 请求数据
const initData = () => {
  console.log('初始化数据');
  tableData.value = SALE_TEND_LIST;
};

// 父级切换 刷新数据
const refreshData = () => {
  // 刷新数据逻辑
  console.log('刷新数据');
  // 重置分页
  Object.assign(pagination, DEFAULT_PAGE_PARAMS);
  initData();
};

defineExpose({
  refreshData,
});

onMounted(() => {
  initData();
});
</script>
<style lang="less" scoped>
.dashboard-rank-card {
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);

  :deep(.t-card__header) {
    padding: 0;
  }

  :deep(.t-card__title) {
    font: var(--td-font-title-large);
    font-weight: 400;
  }

  :deep(.t-card__body) {
    padding: 0;
    margin-top: var(--td-comp-margin-xxl);
  }
}

.dashboard-rank__cell {
  display: inline-flex;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  font-size: 14px;
  background-color: var(--td-gray-color-5);
  align-items: center;
  justify-content: center;
  font-weight: 700;

  &--top {
    background: var(--td-brand-color);
  }
}
</style>
