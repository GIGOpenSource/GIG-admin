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
          <t-button theme="default" type="submit" :style="{ marginLeft: 'var(--td-comp-margin-s)' }"> 查询 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="dialogId"> </t-table>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { DateRangePickerProps, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { ref } from 'vue';

interface FormData {
  id: string;
  status: string | number;
}

const formData = ref<FormData>({
  id: '',
  status: '',
});

const COLUMNS: PrimaryTableCol[] = [
  { title: '消息序号', colKey: 'dialogId', align: 'center', width: 120 },
  { title: '发送用户UID', colKey: 'fromUserId', align: 'center', width: 120 },
  { title: '消息类型', colKey: 'toUserId', align: 'center', width: 120 },
  { title: '内容', colKey: 'messageCount', align: 'center', width: 120 },
  { title: '发送时间', colKey: 'updateTime', align: 'center', width: 160 },
];

const tableData = ref<TableRowData[]>([
  {
    dialogId: 'D10001',
    fromUserId: 'U001',
    toUserId: 'U002',
    messageCount: 35,
    updateTime: '2025-07-30 10:00:00',
    app: 'APP-A',
  },
  {
    dialogId: 'D10002',
    fromUserId: 'U003',
    toUserId: 'U004',
    messageCount: 12,
    updateTime: '2025-07-29 15:20:00',
    app: 'APP-B',
  },
]);

const onPick: DateRangePickerProps['onPick'] = (value, context) => console.log('onPick:', value, context);
const onChange: DateRangePickerProps['onChange'] = (value, context) => {
  console.log('onChange:', value, context);
  console.log(
    'timestamp:',
    context.dayjsValue.map((d) => d.valueOf()),
  );
  console.log(
    'YYYYMMDD:',
    context.dayjsValue.map((d) => d.format('YYYYMMDD')),
  );
};
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
