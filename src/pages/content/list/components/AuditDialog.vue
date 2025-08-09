<template>
  <t-dialog
    v-model:visible="visible"
    :width="600"
    header="是否通过审核"
    cancel-btn="驳回"
    confirm-btn="通过"
    @cancel="onCancel"
    @confirm="onConfirm"
  >
    <t-input v-model="data.reason" class="form-item-content" placeholder="请输入通过/驳回理由" />
  </t-dialog>
</template>
<script setup lang="ts">
import type { DialogProps } from 'tdesign-vue-next';
import { ref } from 'vue';

import { auditContent } from '@/api/content';

interface FormData {
  id: string;
  status: string;
  reason: string;
}
const visible = ref(false);
const data = ref<FormData>({
  id: '',
  status: '',
  reason: ''
});

const open = (row: any) => {
  console.log('🚀 ~ row:', row);
  data.value.id = row.id
  visible.value = true;
};

const onConfirm: DialogProps['onConfirm'] = async () => {
  data.value.status = 'APPROVED'

  // 通过逻辑
  const res = await auditContent(data.value);
  console.log("🚀 ~ onConfirm ~ res:", res)
  visible.value = false;
};
const onCancel: DialogProps['onCancel'] = async () => {
  data.value.status = 'REJECTED'
  // 驳回逻辑
  const res = await auditContent(data.value);
  console.log("🚀 ~ onCancel ~ res:", res)

  visible.value = false;
};

defineExpose({
  open,
});
</script>
<style lang="less" scoped></style>
