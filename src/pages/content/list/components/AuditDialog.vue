<template>
  <t-dialog v-model:visible="visible" :width="600" header="是否通过审核" @cancel="onCancel" cancel-btn="驳回" confirm-btn="通过">
        <t-input v-model="data.type" class="form-item-content" placeholder="请输入邮箱" readonly/>
  </t-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import { DialogProps } from 'tdesign-vue-next';

interface FormData {
  name: string;
  type: string;
  range: Array<string | number>;
}
const visible = ref(false);
const data = ref<FormData>({
  name: '',
  type: '',
  range: ['', ''],
});

const open = (row: any) => {
  console.log("🚀 ~ row:", row)
  visible.value = true;
};

const onCancel: DialogProps['onCancel'] = () => {
  // 驳回逻辑
  visible.value = false;
};

defineExpose({
  open,
});
</script>

<style lang="less" scoped></style>
