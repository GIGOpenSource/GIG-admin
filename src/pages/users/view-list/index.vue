<template>
  <div class="user-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="用户ID" name="name">
                <t-input
                  v-model="formData.id"
                  class="form-item-content"
                  type="search"
                  :placeholder="t('components.commonTable.contractNamePlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="视频ID" name="name">
                <t-input
                  v-model="formData.id"
                  class="form-item-content"
                  type="search"
                  :placeholder="t('components.commonTable.contractNamePlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="观看方式" name="name">
                <t-input
                  v-model="formData.id"
                  class="form-item-content"
                  type="search"
                  :placeholder="t('components.commonTable.contractNamePlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="博主ID" name="name">
                <t-input
                  v-model="formData.id"
                  class="form-item-content"
                  type="search"
                  :placeholder="t('components.commonTable.contractNamePlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="时间" name="name">
               <t-date-range-picker allow-input clearable @pick="onPick" @change="onChange" />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="选择APP" name="name">
                <t-input
                  v-model="formData.type"
                  class="form-item-content"
                  type="search"
                  :placeholder="t('components.commonTable.contractNamePlaceholder')"
                  :style="{ minWidth: '134px' }"
                />
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
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id" :pagination="pagination" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DateRangePickerProps, TdBaseTableProps, PrimaryTableCol, TableRowData } from 'tdesign-vue-next';

import { computed, onMounted, ref } from 'vue';
import { t } from '@/locales';


interface FormData {
  id: string;
  time: string;
  type: string;
}

const searchForm = {
  id: '',
  time: '',
  type: '',
};
const formData = ref<FormData>({ ...searchForm });

// 切换时间
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

// 表格
const COLUMNS: PrimaryTableCol[] = [
  {
    title: '创建时间',
    fixed: 'left',
    ellipsis: true,
    align: 'left',
    colKey: 'uid',
  },
  {
    title: '用户ID',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '视频ID',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '标题文案',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '视频类型',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '观看方式',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '观看进度(%)',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '停留时长(s)',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '视频时长(s)',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
  {
    title: '所属APP',
    ellipsis: true,
    align: 'left',
    colKey: 'name',
  },
];
const pagination = ref<TdBaseTableProps['pagination']>({
  defaultCurrent: 1,
  defaultPageSize: 10,
  total: 999,
  showFirstAndLastPageBtn: true,
  totalContent: false,
});

const tableData = ref<TableRowData[]>([
  {
    id: 1,
    uid: '10001',
    name: '用户1',
    no: '1234567890',
    status: 1,
    type: '普通用户',
  },
  {
    id: 2,
    uid: '10002',
    name: '用户2',
    no: '0987654321',
    status: 0,
    type: 'VIP用户',
  },
]);
</script>

<style lang="less" scoped>
.user-list-container {
  background-color: var(--td-bg-color-container);
  padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
  border-radius: var(--td-radius-medium);

  .table-container {
    margin-top: var(--td-comp-margin-xxl);
  }
}
.operation-container{
  text-align: right;
}
</style>
