<template>
  <t-card :bordered="false">
    <t-table :data="SALE_TEND_LIST" :columns="TABLE_COLUMNS" row-key="productName" :pagination="pagination">
      <template #index="{ rowIndex }">
        <span :class="getRankClass(rowIndex)">
          {{ rowIndex + 1 }}
        </span>
      </template>
      <template #growUp="{ row }">
        <span>
          <trend :type="row.growUp > 0 ? 'up' : 'down'" :describe="Math.abs(row.growUp)" />
        </span>
      </template>
      <template #operation="slotProps">
        <t-link theme="primary" @click="rehandleClickOp(slotProps)">{{
          t('pages.dashboardBase.rankList.info')
        }}</t-link>
      </template>
    </t-table>

  </t-card>
</template>
<script setup lang="ts">
import type { TdBaseTableProps, TdPaginationProps } from 'tdesign-vue-next';
import { ref } from 'vue';

import Trend from '@/components/trend/index.vue';
import { t } from '@/locales';

import { SALE_TEND_LIST } from '../constants';

const TABLE_COLUMNS: TdBaseTableProps['columns'] = [
  {
    align: 'center',
    colKey: 'index',
    title: '日期',
    fixed: 'left',
  },
  {
    align: 'left',
    ellipsis: true,
    colKey: 'productName',
    title: '类型',
  },
  {
    align: 'center',
    colKey: 'growUp',
    title: '日活',
  },
  {
    align: 'center',
    colKey: 'count',
    title: '当前在线',
  },
  {
    align: 'center',
    colKey: 'operation',
    title: '新增数量',
  },
  {
    align: 'center',
    colKey: 'operation1',
    title: '充值人数',
  },
  {
    align: 'center',
    colKey: 'operation123',
    title: '新用户充值金额',
  },
  {
    align: 'center',
    colKey: 'operation124',
    title: '充值金额',
  },
  {
    align: 'center',
    colKey: 'operation125',
    title: '金币订单数',
  },
  {
    align: 'center',
    colKey: 'operation1225',
    title: 'VIP订单数',
  },
  {
    align: 'center',
    colKey: 'operation1235',
    title: '用户消费金币',
  },
  {
    align: 'center',
    colKey: 'operation21235',
    title: '渠道充值金币',
  },
  {
    align: 'center',
    colKey: 'opera2tion1235',
    title: '新用户数',
  },
  {
    align: 'center',
    colKey: 'opera2tion12535',
    title: '所属端统计',
  },
  {
    align: 'center',
    colKey: 'opera2ti3on1235',
    title: '新增付费率',
  },
  {
    align: 'center',
    colKey: 'opera22tion1235',
    title: '活跃付费率',
  },
  {
    align: 'center',
    colKey: 'oper2a2tion1235',
    title: '付费用户活跃率',
  },
  {
    align: 'center',
    colKey: 'oper2a2tion15235',
    title: '用户新增视频数',
  },
  {
    align: 'center',
    colKey: 'oper2a2t5ion1235',
    title: '用户金币体现',
  },
  {
    align: 'center',
    colKey: 'oper2a232tion1235',
    title: '用户提现笔数',
  },
  {
    align: 'center',
    colKey: 'oper12a232tion1235',
    title: '新增代理数',
  },
];

const rehandleClickOp = (val: MouseEvent) => {
  console.log(val);
};
const getRankClass = (index: number) => {
  return ['dashboard-rank', { 'dashboard-rank__top': index < 3 }];
};

const pagination: TdBaseTableProps['pagination'] = {
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 999,
  showFirstAndLastPageBtn: true,
  totalContent: false
};

const pageSize = ref(10);
const onPageSizeChange: TdPaginationProps['onPageSizeChange'] = (size) => {
  console.log('page-size:', size);
};
const onCurrentChange: TdPaginationProps['onCurrentChange'] = (index, pageInfo) => {
  console.log(pageInfo);
};
const onChange: TdPaginationProps['onChange'] = (pageInfo) => {
  console.log(pageInfo);
};
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
