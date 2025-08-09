<template>
  <div class="blogger-crawler-list-container">
    <t-form :data="formData" :label-width="80">
      <t-row>
        <t-col :span="10">
          <t-row :gutter="[24, 24]">
            <t-col :span="4">
              <t-form-item label="选择包" name="id">
                <t-input
                  v-model="formData.id"
                  type="search"
                  placeholder="输入博主ID"
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
            <t-col :span="4">
              <t-form-item label="订单类型" name="status">
                <t-select
                  v-model="formData.status"
                  :options="statusOptions"
                  placeholder="选择状态"
                  clearable
                  :style="{ minWidth: '134px' }"
                />
              </t-form-item>
            </t-col>
          </t-row>
        </t-col>
        <t-col :span="2" class="operation-container">
          <t-button theme="primary" > 查询 </t-button>
          <t-button theme="default" > 重置 </t-button>
        </t-col>
      </t-row>
    </t-form>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id"> </t-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { PrimaryTableCol, TableRowData } from 'tdesign-vue-next';
import { ref } from 'vue';

interface FormData {
  id: string;
  status: string | number;
}

const formData = ref<FormData>({
  id: '',
  status: '',
});

const statusOptions = [
  { label: '全部', value: '' },
  { label: '正常', value: 1 },
  { label: '禁用', value: 0 },
];

const COLUMNS: PrimaryTableCol[] = [
  {
    title: '序号',
    colKey: 'uid',
    align: 'center',
    width: 80,
  },
  {
    title: '订单ID',
    colKey: 'nickname',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '用户UID',
    colKey: 'avatar',
    align: 'center',
    width: 60,
  },
  {
    title: '订单类型',
    colKey: 'worksCount',
    align: 'center',
    width: 80,
  },
  {
    title: '充值名称',
    colKey: 'worksRatio',
    align: 'center',
    width: 100,
  },
  {
    title: '消费金额',
    colKey: 'mobile',
    align: 'left',
    ellipsis: true,
    width: 120,
  },
  {
    title: '支付状态',
    colKey: 'updateTime',
    align: 'center',
    width: 140,
  },
  {
    title: '包名',
    colKey: 'tags',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '订单时间',
    colKey: 'signature',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '到账状态',
    colKey: 'followFans',
    align: 'center',
    width: 120,
  },
];

const tableData = ref<TableRowData[]>([
  { uid: '10001', homepage: 'https://blogger.com/10001', status: 1 },
  { uid: '10002', homepage: 'https://blogger.com/10002', status: 0 },
]);

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
