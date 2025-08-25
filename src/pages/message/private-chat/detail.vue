<template>
  <div class="private-chat-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="选择时间" name="id">
                <t-date-range-picker allow-input clearable @pick="onPick" @change="onChange" />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button
            theme="primary"
            type="submit"
            @click="handleQuery"
            :style="{ marginLeft: 'var(--td-comp-margin-s)' }"
          >
            查询
          </t-button>
          <t-button theme="default" @click="handleReset"> 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table
        hover
        :data="tableData"
        :columns="COLUMNS"
        row-key="dialogId"
        :pagination="pagination"
      >
      </t-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DateRangePickerProps, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { ref, onBeforeMount, onMounted } from 'vue';
import { type TdBaseTableProps } from 'tdesign-vue-next';
import { DEFAULT_PAGE_PARAMS } from '@/constants';
import { getMessageDetails, getMessageDetailsByTime } from '@/api/message';

import { useRoute } from 'vue-router';
const $route = useRoute();

interface FormData {
  sessionId: number | string | null;
  startTime: string;
  endTime: string;
}

const formData = ref<FormData>({
  sessionId: $route.query.id ? Number($route.query.id) : null,
  startTime: '',
  endTime: '',
});
onBeforeMount(() => {
  // formData.value.sessionId = $route.query.id ? Number($route.query.id) : null;
  console.log('组件已创建', $route.query);
});
const COLUMNS: PrimaryTableCol[] = [
  { title: '消息序号', colKey: 'messageSequence', align: 'center', width: 120 },
  { title: '发送用户UID', colKey: 'senderId', align: 'center', width: 120 },
  { title: '消息类型', colKey: 'messageType', align: 'center', width: 120 },
  { title: '内容', colKey: 'content', align: 'center', width: 120 },
  { title: '发送时间', colKey: 'createTime', align: 'center', width: 160 },
];
const pagination = ref<TdBaseTableProps['pagination']>({
  ...DEFAULT_PAGE_PARAMS,
  onChange: (pageInfo: { current: number; pageSize: number }) => {
    initData(pageInfo.current);
  },
});

const tableData = ref<TableRowData[]>([]);

const onPick: DateRangePickerProps['onPick'] = (value, context) =>
  console.log('onPick:', value, context);
const onChange: DateRangePickerProps['onChange'] = (value, context) => {
  console.log('onChange:', value, context);
  formData.value.startTime = context.dayjsValue?.[0]?.format
    ? context.dayjsValue[0].format('YYYY-MM-DD HH:mm:ss')
    : '';
  formData.value.endTime = context.dayjsValue?.[1]?.format
    ? context.dayjsValue[1].format('YYYY-MM-DD HH:mm:ss')
    : '';
  console.log(
    'timestamp:',
    Array.isArray(context.dayjsValue) ? context.dayjsValue.map(d => d?.valueOf?.()) : []
  );
  console.log(
    'YYYYMMDD:',
    Array.isArray(context.dayjsValue) ? context.dayjsValue.map(d => d?.format?.('YYYYMMDD')) : []
  );
};
// 初始化数据
const initData = async (page: number = pagination.value.defaultCurrent) => {
  // const sessionId =  $route.query.id ? Number($route.query.id) : null;
  const res = await getMessageDetailsByTime({
    ...formData.value,
    page,
    size: pagination.value.defaultPageSize,
  });
  console.log('🚀 ~ initData ~ res:jijiji', res, page, pagination.value.defaultPageSize);

  tableData.value = res.data.records;
  pagination.value.total = res.data.total;
  pagination.value.current = page;
};
// 查询
const handleQuery = () => {
  initData();
};
// 重置
const handleReset = () => {
  formData.value.startTime = '';
  formData.value.endTime = '';
  // formData.value = { ...formData.value };
  initData();
};
onMounted(() => {
  initData();
});
</script>
<style lang="less" scoped>
.private-chat-list-container {
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
