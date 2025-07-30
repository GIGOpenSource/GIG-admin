<template>
  <!-- 常规内容编辑 -->
  <t-dialog v-model:visible="visible" :width="600" header="小说/动漫/漫画编辑" confirm-btn="保存" @cancel="onCancel">
    <t-space>
      <p>评论：2323626</p>
      <p>点赞：47474856858658</p>
    </t-space>

    <div class="table-container">
      <t-table hover :data="tableData" :columns="COLUMNS" row-key="id">
        <template #operation="{ row }">
          <t-space>
            <t-link theme="danger" @click="handleDelete(row)">删除</t-link>
          </t-space>
        </template>
      </t-table>
    </div>
  </t-dialog>
</template>
<script setup lang="ts">
import type { DialogProps, PrimaryTableCol, TableRowData, TdBaseTableProps } from 'tdesign-vue-next';
import { DialogPlugin } from 'tdesign-vue-next';
import { ref } from 'vue';

interface FormData {
  name: string;
  type: string;
  range: Array<string | number>;
}
const visible = ref(false);

// 表格字段
const COLUMNS: PrimaryTableCol[] = [
  {
    title: '评论人ID',
    colKey: 'index',
    align: 'center',
  },
  {
    title: '评论时间',
    colKey: 'link',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '评论文案',
    colKey: 'code',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '评论点赞',
    colKey: 'materialName',
    align: 'left',
    ellipsis: true,
  },
  {
    title: '操作',
    colKey: 'operation',
    align: 'center',
    width: 80,
  },
];

const tableData = ref([
  { id: 1, code: 'QDM001', link: 'https://example.com/qdm001' },
  { id: 2, code: 'QDM002', link: 'https://example.com/qdm002' },
]);

const handleDelete = (row: TableRowData) => {
  const dialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '确认删除',
    body: '您确定要删除此条数据吗？',
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: () => {
      // 执行删除操作
      console.log('删除分类:', row);
      dialog.destroy();
    },
    onCancel: () => {
      dialog.hide();
    },
  });
};
const open = (row: any) => {
  console.log('🚀 ~ row:', row);
  visible.value = true;
};

const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
<style lang="less" scoped></style>
