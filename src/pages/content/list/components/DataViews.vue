<template>
  <!-- 常规内容编辑 -->
  <t-dialog v-model:visible="visible" :width="600" header="数据" confirm-btn="确认"  @confirm="onConfirm" @cancel="onCancel">
    <t-space>
      <p>评论：{{ nums.totalCommentCount}}</p>
      <p>点赞：{{ nums.totalLikeCount}}</p>
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
import { ref, reactive } from 'vue';

import { dataStatistics, delCommment } from '@/api/content';

const visible = ref(false);

const id = ref(0);

// 点赞评论数
const nums = reactive({
  totalCommentCount: 0,
  totalLikeCount: 0,
});

// 表格字段
const COLUMNS: PrimaryTableCol[] = [
  {
    title: '评论人ID',
    colKey: 'userId',
  },
  {
    title: '评论时间',
    colKey: 'commentTime',
    ellipsis: true,
  },
  {
    title: '评论文案',
    colKey: 'commentContent',
    ellipsis: true,
  },
  {
    title: '评论点赞',
    colKey: 'commentLikeCount',
    ellipsis: true,
  },
  {
    title: '操作',
    colKey: 'operation',
    align: 'center',
    width: 80,
  },
];

const tableData = ref([]);

const handleDelete = (row: TableRowData) => {
  const dialog = DialogPlugin.confirm({
    theme: 'danger',
    header: '确认删除',
    body: '您确定要删除此条数据吗？',
    confirmBtn: '确认',
    cancelBtn: '取消',
    onConfirm: async () => {
      // 执行删除操作
      console.log('删除分类:', row);
      const { data:res} = await delCommment({commentId: row.commentId})
      console.log("🚀 ~ handleDelete ~ data:", res)
      dialog.destroy();
    },
    onCancel: () => {
      dialog.hide();
    },
  });
};
const open = (row: any) => {
  console.log('🚀 ~ row:', row);
  id.value = row.id;
  dataStatistics({ id: row.id }).then(({data:res}) => {
    console.log('🚀 ~ open ~ res:', res);
    nums.totalCommentCount = res.data.totalCommentCount;
    nums.totalLikeCount = res.data.totalLikeCount;
    tableData.value = res.data.comments;
  });
  visible.value = true;
};

const onConfirm: DialogProps['onConfirm'] = () => {
  visible.value = false;
};
const onCancel: DialogProps['onCancel'] = () => {
  visible.value = false;
};

defineExpose({
  open,
});
</script>
<style lang="less" scoped></style>
